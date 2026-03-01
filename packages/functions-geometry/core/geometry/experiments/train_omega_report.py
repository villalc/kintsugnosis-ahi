import torch
import torch.optim as optim
import torch.nn as nn
from omega_loader import OmegaLatticeLoader
from syntergic_model import SintergicGaugeNet, syntergic_loss_with_ricci
from regularizers import lanczos_algorithm
from curvature import synthetic_ricci_curvature
import json
import os
import numpy as np
import time

def train_omega_report():
    # Settings
    SEEDS = [42, 108, 777] # 3 seeds for confidence intervals
    LATTICE_SIZE = 28
    HIDDEN_DIM = 64 # Reduce dim slightly for speed in multi-seed
    EPOCHS = 5
    BATCH_SIZE = 32
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    DATA_PATH = os.path.join("omega", "dataset_omega_escudo_v4_enterprise.jsonl")
    REPORT_FILE = "omega_ricci_logs.jsonl"
    
    if not os.path.exists(DATA_PATH):
        print("Data not found.")
        return

    # Load Data
    print("Loading Data...")
    loader = OmegaLatticeLoader(DATA_PATH, lattice_size=LATTICE_SIZE, max_samples=500)
    X_all, y_all = loader.get_dataset()
    X_all, y_all = X_all.to(DEVICE), y_all.to(DEVICE)
    
    print(f"Starting Multi-Seed Training (Seeds: {SEEDS})...")
    
    # Clear log file
    with open(REPORT_FILE, 'w') as f:
        pass

    for seed in SEEDS:
        print(f"\n--- Seed {seed} ---")
        torch.manual_seed(seed)
        np.random.seed(seed)
        
        # Init Model
        model = SintergicGaugeNet(lattice_size=LATTICE_SIZE, hidden_dim=HIDDEN_DIM, num_classes=2).to(DEVICE)
        optimizer = optim.Adam(model.parameters(), lr=0.002)
        
        step_global = 0
        
        for epoch in range(EPOCHS):
            # Shuffle
            perm = torch.randperm(len(X_all))
            X = X_all[perm]
            y = y_all[perm]
            
            epoch_loss = 0
            
            for i in range(0, len(X), BATCH_SIZE):
                inputs = X[i:i+BATCH_SIZE]
                targets = y[i:i+BATCH_SIZE]
                
                # train step
                optimizer.zero_grad()
                loss, psi_sig, loss_ric, ric_val = syntergic_loss_with_ricci(
                    model, inputs, targets, 
                    lambda_ricci=0.05, kappa_min=0.1
                )
                loss.backward()
                optimizer.step()
                
                step_global += 1
                
                # Check metrics every N steps or end of epoch? 
                # Doing Gap calc is expensive. Let's do it every 5 steps.
                if step_global % 5 == 0:
                    # Measure Gap
                    # Requires dummy forward for graph
                    dummy_out, _ = model(inputs)
                    dummy_loss = nn.CrossEntropyLoss()(dummy_out, targets)
                    num_params = sum(p.numel() for p in model.parameters())
                    try:
                        eig = lanczos_algorithm(model, dummy_loss, num_params, k=5, max_iter=10)
                        gap_val = eig.min().item()
                    except:
                        gap_val = 0.0
                    
                    log_entry = {
                        "seed": seed,
                        "epoch": epoch,
                        "step": step_global,
                        "loss": loss.item(),
                        "ricci": ric_val.item(),
                        "gap": gap_val,
                        "psi": psi_sig.item()
                    }
                    
                    with open(REPORT_FILE, 'a') as f:
                        f.write(json.dumps(log_entry) + "\n")
                        
            print(f"Seed {seed} Epoch {epoch+1} Done.")

        # End of Seed: Analyze Geometric Separation
        print(f"Seed {seed}: Analyzing Separation...")
        mask_safe = (y_all == 0)
        mask_risk = (y_all == 1)
        
        metrics_safe = []
        metrics_risk = []
        
        # Batch analysis
        def analyze_subset(subset):
            r_list = []
            for j in range(0, len(subset), BATCH_SIZE):
                b = subset[j:j+BATCH_SIZE]
                if len(b) < 2: continue
                r = synthetic_ricci_curvature(model, b, kappa_target=0.1)
                r_list.append(r.item())
            return np.mean(r_list) if r_list else 0.0

        ricci_safe = analyze_subset(X_all[mask_safe])
        ricci_risk = analyze_subset(X_all[mask_risk])
        
        sep_entry = {
            "seed": seed,
            "type": "separation",
            "ricci_safe": ricci_safe,
            "ricci_risk": ricci_risk
        }
        with open(REPORT_FILE, 'a') as f:
            f.write(json.dumps(sep_entry) + "\n")

if __name__ == "__main__":
    train_omega_report()
