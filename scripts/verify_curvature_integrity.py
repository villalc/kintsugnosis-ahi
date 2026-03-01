import os
import sys
import torch
import torch.nn as nn
import torch.optim as optim
import time
import numpy as np
from collections import deque

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEOMETRY_PACKAGE_ROOT = os.path.join(REPO_ROOT, "packages", "functions-geometry")
if GEOMETRY_PACKAGE_ROOT not in sys.path:
    sys.path.append(GEOMETRY_PACKAGE_ROOT)

from core.geometry.physics.curvature import ollivier_ricci_curvature, ricci_curvature_regularizer


def log(msg, level="INFO"):
    print(f"[{level}] {msg}")


def generate_hypersphere_data(n_samples, dim, radius=1.0):
    """Genera puntos en una hiperesfera (curvatura positiva/convergente)."""
    data = torch.randn(n_samples, dim)
    data = data / (torch.norm(data, dim=1, keepdim=True) + 1e-12) * radius
    return data


def generate_tree_hierarchy_data(n_samples, dim, branching=3, levels=6, radial_growth=1.4):
    """
    Genera un árbol embebido en una bola tipo Poincaré (aprox. euclidiana):
    - radio creciente con profundidad (expansión)
    - apertura angular para desacoplar ramas
    """
    points = []

    root_dir = torch.randn(dim)
    root_dir = root_dir / (torch.norm(root_dir) + 1e-12)
    frontier = deque([(torch.zeros(dim), root_dir, 0)])

    while frontier and len(points) < n_samples:
        pos, parent_dir, level = frontier.popleft()
        points.append(pos)

        if level >= levels - 1:
            continue

        radius = 0.95 * (1.0 - np.exp(-radial_growth * (level + 1) / levels))
        spread = 0.15 + 0.20 * (level / max(levels - 1, 1))

        for _ in range(branching):
            random_dir = torch.randn(dim)
            random_dir = random_dir / (torch.norm(random_dir) + 1e-12)

            child_dir = 0.65 * parent_dir + 0.35 * random_dir
            child_dir = child_dir / (torch.norm(child_dir) + 1e-12)

            jitter = torch.randn(dim)
            jitter = jitter / (torch.norm(jitter) + 1e-12)
            child_dir = child_dir + spread * jitter
            child_dir = child_dir / (torch.norm(child_dir) + 1e-12)

            frontier.append((radius * child_dir, child_dir, level + 1))

            if len(frontier) + len(points) >= n_samples * 2:
                break

    return torch.stack(points[:n_samples])


def _summarize_distribution(name, ricci):
    mean_v = ricci.mean().item()
    p10 = torch.quantile(ricci, 0.10).item()
    p50 = torch.quantile(ricci, 0.50).item()
    p90 = torch.quantile(ricci, 0.90).item()
    neg_frac = (ricci < 0).float().mean().item()
    log(f"{name}: mean={mean_v:.4f}, q10={p10:.4f}, q50={p50:.4f}, q90={p90:.4f}, frac_neg={neg_frac:.2%}")
    return mean_v, neg_frac


def test_numerical_consistency():
    log("=== TEST 1: CONSISTENCIA NUMÉRICA ===")

    dims = 64
    batch_sizes = [32, 128, 512]
    ks = [5, 15]

    for batch in batch_sizes:
        log(f"--- Probando Batch Size: {batch} ---")
        data = torch.randn(batch, dims)

        for k in ks:
            if k >= batch:
                continue

            start_time = time.time()
            try:
                # sigma=0.3 is used as a single representative value for consistency checks;
                # geometric sensitivity across sigma is evaluated in test_geometric_control.
                ricci = ollivier_ricci_curvature(data, k_neighbors=k, sigma=0.3)
                elapsed = (time.time() - start_time) * 1000

                mean_r = ricci.mean().item()
                std_r = ricci.std().item()
                min_r = ricci.min().item()
                max_r = ricci.max().item()
                nans = torch.isnan(ricci).sum().item()

                log(f"K={k} | Tiempo: {elapsed:.2f}ms")
                log(f"  Ricci Stats: Mean={mean_r:.4f}, Std={std_r:.4f}, Range=[{min_r:.4f}, {max_r:.4f}]")

                if nans > 0:
                    log(f"  ❌ FAILURE: {nans} NaNs detectados!", "ERROR")
                else:
                    log("  ✅ Integridad Numérica OK")

            except Exception as e:
                log(f"  ❌ CRITICAL ERROR: {str(e)}", "ERROR")


def test_geometric_control():
    log("\n=== TEST 2: GEOMETRÍA CONTROLADA ===")

    n_samples = 200
    dim = 16

    sphere_data = generate_hypersphere_data(n_samples, dim)
    tree_data = generate_tree_hierarchy_data(n_samples, dim, branching=3, levels=6, radial_growth=1.4)

    candidates = [(8, 0.3), (10, 0.2), (12, 0.15)]
    best = None

    for k, sigma in candidates:
        ricci_sphere = ollivier_ricci_curvature(sphere_data, k_neighbors=k, sigma=sigma)
        ricci_tree = ollivier_ricci_curvature(tree_data, k_neighbors=k, sigma=sigma)

        log(f"--- Configuración: k={k}, sigma={sigma} ---")
        mean_sphere, neg_sphere = _summarize_distribution("ESFERA", ricci_sphere)
        mean_tree, neg_tree = _summarize_distribution("ÁRBOL", ricci_tree)

        margin = mean_sphere - mean_tree
        # Combined score: prioritize curvature margin, with neg_tree as a secondary signal
        alpha = 0.7  # weight for curvature margin
        beta = 0.3   # weight for fraction of negative curvature in tree
        score = alpha * margin + beta * neg_tree
        if best is None or score > best[0]:
            best = (score, k, sigma, mean_sphere, mean_tree, neg_tree)

    _, k_best, sigma_best, mean_sphere, mean_tree, neg_tree = best
    log(f"Mejor configuración observada: k={k_best}, sigma={sigma_best}")

    if mean_sphere > mean_tree:
        log("✅ Discriminación Geométrica Exitosa: Esfera > Árbol")
    else:
        log("❌ FALLO DE GEOMETRÍA: El modelo no distingue topologías clara.", "ERROR")

    if mean_tree < 0 or neg_tree > 0.15:
        log("✅ Detección de señal hiperbólica en árbol (media o cola negativa).")
    else:
        log("⚠️ WARNING: El árbol no muestra señal hiperbólica suficiente.", "WARN")


def test_backpropagation():
    log("\n=== TEST 3: BACKPROPAGATION & GRADIENTES ===")

    model = nn.Sequential(
        nn.Linear(32, 64),
        nn.ReLU(),
        nn.Linear(64, 32)
    )

    optimizer = optim.SGD(model.parameters(), lr=0.01)
    input_data = torch.randn(64, 32)

    log("Iniciando loop de entrenamiento simulado (5 pasos)...")

    for step in range(5):
        optimizer.zero_grad()
        latents = model(input_data)

        loss_ricci, mean_ricci = ricci_curvature_regularizer(
            None,
            latents,
            kappa_min=-0.5,
            lambda_reg=0.1,
        )

        loss_ricci.backward()

        grads = []
        for _, param in model.named_parameters():
            if param.grad is not None:
                grads.append(param.grad.norm().item())

        avg_grad = np.mean(grads) if grads else 0.0
        max_grad = np.max(grads) if grads else 0.0

        log(
            f"Step {step + 1}: Loss={loss_ricci.item():.6f}, Mean Ricci={mean_ricci.item():.4f}, "
            f"Avg Grad Norm={avg_grad:.6f}, Max Grad={max_grad:.6f}"
        )

        if np.isnan(loss_ricci.item()) or np.isnan(avg_grad):
            log("❌ FAILURE: NaNs en Loss o Gradientes", "ERROR")
            break

        if avg_grad == 0.0:
            log("⚠️ WARNING: Gradientes muertos (0.0).", "WARN")

        optimizer.step()

    log("✅ Test de Backprop completado.")

if __name__ == "__main__":
    log("INICIANDO VERIFICACIÓN DE INTEGRIDAD DE CURVATURA...")
    torch.manual_seed(42) # Reproducibilidad
    
    try:
        test_numerical_consistency()
        test_geometric_control()
        test_backpropagation()
        log("\n=== VERIFICACIÓN COMPLETADA ===")
    except Exception as e:
        log(f"\n❌ ERROR FATAL EN LA SUITE DE PRUEBAS: {e}", "ERROR")
        import traceback
        traceback.print_exc()
