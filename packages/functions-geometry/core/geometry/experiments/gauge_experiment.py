import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import json
import time
from gauge_lattice import SintergicGaugeNet, get_psi_loss

# Import curvature calculation from existing file (assuming it's compatible or we inline it)
# The existing curvature.py's `synthetic_ricci_curvature` needs checking. 
# It takes `model` and `data_batch`.
# We need to make sure we use the version compatible with this model.
from curvature import synthetic_ricci_curvature

def compute_mass_gap(model, loss_fn, inputs, targets, epsilon=1e-2, num_directions=10):
    """
    Estimates the physical mass gap using directional finite differences.
    """
    out_orig, _ = model(inputs)
    original_loss = loss_fn(out_orig, targets).item()
    
    eigenvalues = []
    
    # Store parameters to restore later
    params = [p for p in model.parameters() if p.requires_grad]
    param_vector = torch.nn.utils.parameters_to_vector(params)
    
    for _ in range(num_directions):
        # Generate random direction
        d = torch.randn_like(param_vector)
        d = d / (d.norm() + 1e-9) # Normalize
        
        # Perturb +
        torch.nn.utils.vector_to_parameters(param_vector + epsilon * d, params)
        out_plus, _ = model(inputs)
        loss_plus = loss_fn(out_plus, targets).item()
        
        # Perturb - (Optional, paper uses L(theta + eps) - L(theta), simpler FD)
        # Lambda approx 2 * (L(p+e) - L(p)) / e^2 implies a one-sided Taylor approx of 2nd order term
        # L(p+e) approx L(p) + g*e + 0.5 e^T H e. 
        # If we are at a minimum, g=0. Then L(p+e) - L(p) approx 0.5 * lambda * e^2.
        # So lambda = 2 * Diff / e^2.
        
        # We assume we might not be exactly at 0 gradient during training, but this is the "Directional Curvature"
        eigenvalues.append(2 * (loss_plus - original_loss) / (epsilon**2))
    
    # Restore
    torch.nn.utils.vector_to_parameters(param_vector, params)
    
    # Filter gauge modes (lambda near 0)
    # "Values with |lambda| < delta (e.g. 10^-2) are interpreted as gauge modes"
    vals = np.array(eigenvalues)
    abs_vals = np.abs(vals)
    
    physical_modes = abs_vals[abs_vals >= 1e-2]
    
    if len(physical_modes) == 0:
        return 0.0 # No physical gap found (flat)
        
    return np.min(physical_modes)

def run_experiment():
    # Settings
    STEPS = 500
    BATCH_SIZE = 16
    LR = 1e-4
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Running on {DEVICE}")
    
    # Model
    model = SintergicGaugeNet().to(DEVICE)
    optimizer = optim.Adam(model.parameters(), lr=LR)
    
    # Static Dataset (Fixed batch as per "train it for 500 steps on a fixed batch")
    # "Fixed batch of synthetic inputs of size 16"
    torch.manual_seed(42)
    inputs = torch.randn(BATCH_SIZE, 125).to(DEVICE)
    targets = torch.randint(0, 2, (BATCH_SIZE,)).to(DEVICE)
    
    criterion = nn.CrossEntropyLoss()
    
    logs = []
    
    print("Step | Loss   | Curv   | Gap    | Psi")
    print("-" * 40)
    
    for step in range(STEPS + 1):
        optimizer.zero_grad()
        
        # Calculate Curvature FIRST (avoids in-place modification error affecting the loss graph)
        kappa_est = synthetic_ricci_curvature(model, inputs)
        if isinstance(kappa_est, torch.Tensor):
            kappa_est = kappa_est.item()
            
        logits, _ = model(inputs)
        task_loss = criterion(logits, targets)
        psi_loss = get_psi_loss(model)
        
        # We do NOT add kappa to the backward loss if it's not differentiable.
        loss = task_loss + 0.1 * psi_loss
        
        loss.backward()
        
        # Gradient Clipping
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        
        optimizer.step()
        
        # Checkpoints for Mass Gap (every 50 steps roughly, or tracking regularly)
        # The report says "record, at regular intervals... approximate physical mass gap"
        # Computing gap is slow (loop over directions). Let's do it every 10 steps.
        
        metrics = {
            "step": step,
            "loss": task_loss.item(),
            "curvature": kappa_est,
            "psi": model.global_psi.item()
        }
        
        if step % 10 == 0:
            gap = compute_mass_gap(model, criterion, inputs, targets)
            metrics["mass_gap"] = gap
            print(f"{step:4d} | {task_loss.item():.4f} | {kappa_est:.4f} | {gap:.4f} | {model.global_psi.item():.3f}")
        else:
            metrics["mass_gap"] = None # Optional: Interpolate or leave empty
            
        logs.append(metrics)

    # Save logs
    with open("gauge_experiment_logs.json", "w") as f:
        json.dump(logs, f, indent=2)
        
    print("\nExperiment Complete. Logs saved to gauge_experiment_logs.json")

if __name__ == "__main__":
    run_experiment()
