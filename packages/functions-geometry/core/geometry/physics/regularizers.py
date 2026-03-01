import torch


def _dot(list_a, list_b):
    """Computes the dot product of two lists of tensors."""
    if not list_a:
        return torch.tensor(0.0)
    res = sum(torch.dot(a.flatten(), b.flatten()) for a, b in zip(list_a, list_b))
    if not isinstance(res, torch.Tensor):
        # Fallback if sum returns int (e.g. empty sequence, though caught above)
        return torch.tensor(res)
    return res


def _norm(list_a):
    """Computes the L2 norm of a list of tensors."""
    return torch.sqrt(_dot(list_a, list_a))


def compute_hvp(model, loss, v_list, create_graph=False):
    """
    Computes the Hessian-Vector Product (HVP) efficiently.
    Hv = grad(grad(loss) * v)

    Args:
        model: The PyTorch model.
        loss: The scalar loss value.
        v_list: The list of tensors to multiply with the Hessian (matching model parameters).
        create_graph: Whether to create the graph for higher-order derivatives (default: False).
    """
    grads = torch.autograd.grad(loss, model.parameters(), create_graph=True, retain_graph=True)

    # Validation
    if len(grads) != len(v_list):
        raise ValueError(f"Gradient list length {len(grads)} does not match vector list length {len(v_list)}")

    # Compute dot product (scalar)
    # avoiding torch.cat and huge flattened tensors
    prod = _dot(grads, v_list)

    # Compute gradient of the product w.r.t parameters -> Hv
    hvp_grads = torch.autograd.grad(prod, model.parameters(), create_graph=create_graph, retain_graph=True)

    # Return as list of tensors, matching model parameters structure
    return list(hvp_grads)


def lanczos_algorithm(model, loss, num_params, k=10, max_iter=20, return_vectors=False):
    """
    Lanczos iteration to approximate top k eigenvalues/eigenvectors of the Hessian.
    Note: Standard Lanczos finds extremal eigenvalues (largest magnitude).
    To find the smallest positive eigenvalue (mass gap), one might need shift-invert
    or just inspect the spectrum if the gap is near the edges.
    Here we return the smallest found in the Krylov subspace.
    """
    device = next(model.parameters()).device

    # Initial random vector (as list of tensors)
    v = [torch.randn_like(p) for p in model.parameters()]
    v_norm = _norm(v)
    v = torch._foreach_div(v, v_norm.item())  # Normalize

    # Lanczos storage
    V = [v]  # List of lists of tensors
    alphas = []
    betas = []

    v_prev = None

    for i in range(max_iter):
        # w = H * v_i
        # Detach to ensure we don't build a graph through the iterative process
        w_list = compute_hvp(model, loss, V[-1], create_graph=False)
        w = [t.detach() for t in w_list]

        # Orthogonalize against v_{i-1}
        if v_prev is not None:
            # w = w - betas[-1] * v_prev
            w = torch._foreach_add(w, v_prev, alpha=-betas[-1].item())

        # alpha_i = w . v_i
        alpha = _dot(w, V[-1])
        alphas.append(alpha)

        # w = w - alpha_i * v_i
        w = torch._foreach_add(w, V[-1], alpha=-alpha.item())

        # beta_{i+1} = ||w||
        beta = _norm(w)

        if beta.item() < 1e-6:
            break

        betas.append(beta)
        v_prev = V[-1]

        # V.append(w / beta)
        V.append(torch._foreach_div(w, beta.item()))

    # Construct Tridiagonal Matrix T
    # T = diag(alphas) + off_diag(betas)
    dim = len(alphas)
    T = torch.zeros(dim, dim, device=device)
    T.diagonal().copy_(torch.stack(alphas))
    if len(betas) > 0:
        # Use only the first k-1 betas for the off-diagonal of a kxk matrix
        # The loop produces len(alphas) betas if no break, but the last beta corresponds
        # to the boundary to the (k+1)-th vector.
        b = torch.stack(betas[:len(alphas) - 1])
        if len(b) > 0:
            T.diagonal(offset=1).copy_(b)
            T.diagonal(offset=-1).copy_(b)

    # Eigen decomposition of T (much smaller than H)
    eigvals = torch.linalg.eigvalsh(T)

    if return_vectors:
        return eigvals, T, V

    return eigvals


def mass_gap_regularizer(model, loss, lambda_reg=0.01, delta_min=0.1, k=10, max_iter=20):
    """
    Penalizes independent directions where curvature is too low (gap).
    """
    # Count params (still useful for API consistency or logging, though not used for flat vector anymore)
    num_params = sum(p.numel() for p in model.parameters())

    # Compute spectrum approximation
    # We detach loss for the Lanczos part because we don't differentiate *through* the eigensolver
    # for the index selection, but we do need the graph for HVP.
    # However, to regularize the *gap*, we technically need gradients of the eigenvalue w.r.t params.
    # Differentiating through Lanczos is unstable/expensive.
    # User's pseudo code implies: eigenvalues = compute(grads).
    # Usually one regularizes trace or specific directions.
    # Differentiating the eigenvalue itself requires knowing the eigenvector: d(lambda) = v^T * dH * v.

    # For this implementation, we will assume we want to push the smallest eigenvalue UP.
    # v_min^T H v_min < Delta.
    # Penalty: (Delta - v_min^T H v_min)^2

    # Get eigenvalues and basis vectors from Lanczos
    # We use the iterative solver to find the direction, but we will re-compute
    # the curvature in that direction with the autograd graph enabled to ensure differentiability.
    _, T, V = lanczos_algorithm(model, loss, num_params, return_vectors=True)

    # We need eigenvectors of T to reconstruct eigenvectors of H
    # T is a tridiagonal matrix representing H restricted to the Krylov subspace.
    T_eigvals, T_eigvecs = torch.linalg.eigh(T)

    # Select the eigenvector corresponding to the smallest eigenvalue
    # eigh returns eigenvalues in ascending order
    min_idx = 0
    u_min = T_eigvecs[:, min_idx]

    # Reconstruct the approximate eigenvector of H: v_min = V * u_min
    # V is a list of list of tensors. We only use the first len(u_min) vectors from V.
    # The Krylov basis has dimension equal to the size of T.

    # Initialize v_min as list of zeros matching model params
    v_min = [torch.zeros_like(p) for p in model.parameters()]

    for i in range(len(u_min)):
        # v_min += u_min[i] * V[i]
        # V[i] is a list of tensors
        scaled_Vi = torch._foreach_mul(V[i], u_min[i].item())
        v_min = torch._foreach_add(v_min, scaled_Vi)

    # Normalize and detach to treat as a constant witness vector
    v_min_norm = _norm(v_min)
    v_min = torch._foreach_div(v_min, v_min_norm.item() + 1e-8)
    v_min = [t.detach() for t in v_min]

    # Compute the Rayleigh quotient R(v) = v^T H v with the graph enabled.
    # This allows gradients to flow through H (and thus model parameters).
    # H v_min
    hvp = compute_hvp(model, loss, v_min, create_graph=True)

    # v_min^T (H v_min)
    rayleigh_quotient = _dot(v_min, hvp)

    gap = rayleigh_quotient

    # If gap is huge (negative curvature?), we might ignore or clamp.
    # Assuming positive semi-definite approx:
    penalty = lambda_reg * torch.clamp(delta_min - gap, min=0)**2

    return penalty
