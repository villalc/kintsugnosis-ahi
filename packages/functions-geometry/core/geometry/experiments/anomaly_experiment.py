import torch
import torch.nn as nn
import numpy as np
import matplotlib.pyplot as plt
from gauge_lattice import SintergicGaugeNet
from curvature import synthetic_ricci_curvature
from gauge_experiment import compute_mass_gap

def run_anomaly_test():
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Running Geometric Anomaly Test on {DEVICE}...")
    
    # 1. Load Trained Model (or retrain quickly if not saved, but we'll just train a fresh one quickly for purity)
    # Ideally we load 'gauge_experiment.py' model state, but we didn't save weights. 
    # Let's train a quick one to convergence (it takes only seconds for 500 steps).
    print("Training reference model...")
    model = SintergicGaugeNet().to(DEVICE)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    criterion = nn.CrossEntropyLoss()
    
    # "In-Distribution" (ID) - The pattern it learned
    torch.manual_seed(42)
    inputs_id = torch.randn(16, 125).to(DEVICE) # The fixed batch it memorized
    targets_id = torch.randint(0, 2, (16,)).to(DEVICE)
    
    # Train
    for _ in range(300):
        optimizer.zero_grad()
        logits, _ = model(inputs_id)
        loss = criterion(logits, targets_id)
        loss.backward()
        optimizer.step()
        
    print("Model trained. Beginning Geometric Analysis...")
    
    # 2. Define "Out-Of-Distribution" (OOD)
    # Case 1: Gaussian Noise with high variance
    inputs_ood_noise = torch.randn(16, 125).to(DEVICE) * 5.0
    
    # Case 2: "Adversarial-like" (Uniform noise)
    inputs_ood_uniform = (torch.rand(16, 125).to(DEVICE) - 0.5) * 4.0
    
    # 3. Measure Metrics
    def get_metrics(name, data):
        # Curvature
        k = synthetic_ricci_curvature(model, data)
        if isinstance(k, torch.Tensor): k = k.item()
        
        # Mass Gap (Note: Gap is property of Hessian LOSS, which depends on Targets. 
        # For OOD, what are targets? 
        # Option A: Use model predictions as targets (self-consistency gap)
        # Option B: Use random targets.
        # Paper implies gap is property of LANDSCAPE. 
        # Usually Hessian of Loss requires labels. We'll use predicted labels to see landscape "confidence".
        with torch.no_grad():
            preds = model(data)[0].argmax(dim=1)
        
        # We need a loss function to measure Hessian against.
        # If we use CrossEntropy against *predicted* labels, gradients are zero at first order?
        # Not necessarily for non-optimal points, but close.
        gap = compute_mass_gap(model, criterion, data, preds)
        
        return k, gap

    k_id, g_id = get_metrics("In-Distribution", inputs_id)
    k_ood1, g_ood1 = get_metrics("OOD (High Var)", inputs_ood_noise)
    k_ood2, g_ood2 = get_metrics("OOD (Uniform)", inputs_ood_uniform)
    
    print(f"\nResults:")
    print(f"{'Data Type':<20} | {'Curvature (k)':<15} | {'Mass Gap (Delta)':<15}")
    print("-" * 60)
    print(f"{'In-Distribution':<20} | {k_id:.5f}          | {g_id:.5f}")
    print(f"{'OOD (High Var)':<20} | {k_ood1:.5f}          | {g_ood1:.5f}")
    print(f"{'OOD (Uniform)':<20} | {k_ood2:.5f}          | {g_ood2:.5f}")
    
    # Visualization
    labels = ['In-Dist', 'OOD-Noise', 'OOD-Unif']
    ks = [k_id, k_ood1, k_ood2]
    gs = [g_id, g_ood1, g_ood2]
    
    fig, ax = plt.subplots(1, 2, figsize=(12, 5))
    
    # Curvature Bar
    ax[0].bar(labels, ks, color=['green', 'orange', 'red'])
    ax[0].set_title("Ricci Curvature Response")
    ax[0].set_ylabel("Kappa")
    ax[0].axhline(0, color='black', linewidth=0.5)
    
    # Gap Bar
    ax[1].bar(labels, gs, color=['purple', 'yellow', 'brown'])
    ax[1].set_title("Mass Gap Response")
    ax[1].set_ylabel("Delta")
    
    plt.tight_layout()
    plt.savefig("anomaly_results.png")
    print("\nSaved anomaly_results.png")

if __name__ == "__main__":
    run_anomaly_test()
