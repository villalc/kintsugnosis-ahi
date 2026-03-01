import torch
import torch.optim as optim
from omega_loader import OmegaLatticeLoader
from syntergic_model import SintergicGaugeNet, syntergic_loss_with_ricci
import os
import numpy as np

def biopsy_schema_lock():
    # Settings
    LATTICE_SIZE = 28 
    HIDDEN_DIM = 64
    EPOCHS = 3
    BATCH_SIZE = 16
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Path to LOCAL schema lock file
    DATA_PATH = "dataset_schema_lock.jsonl"
    
    if not os.path.exists(DATA_PATH):
        print(f"Data not found at {DATA_PATH}")
        return

    print(f"Loading Schema Lock Data from {DATA_PATH}...")
    # Use existing loader (patched)
    loader = OmegaLatticeLoader(DATA_PATH, lattice_size=LATTICE_SIZE, max_samples=500)
    X, y = loader.get_dataset()
    
    if len(X) == 0:
        print("No data loaded.")
        return
        
    print(f"Loaded {len(X)} samples. (All benign).")
    
    X = X.to(DEVICE)
    y = y.to(DEVICE) # All 0s
    
    # Model
    model = SintergicGaugeNet(lattice_size=LATTICE_SIZE, hidden_dim=HIDDEN_DIM, num_classes=2).to(DEVICE)
    optimizer = optim.Adam(model.parameters(), lr=0.002)
    
    print("Starting Geometric Biopsy...")
    
    ricci_vals = []
    
    for epoch in range(EPOCHS):
        perm = torch.randperm(len(X))
        X = X[perm]
        y = y[perm]
        
        for i in range(0, len(X), BATCH_SIZE):
            inputs = X[i:i+BATCH_SIZE]
            targets = y[i:i+BATCH_SIZE]
            
            optimizer.zero_grad()
            loss, psi_sig, loss_ric, ric_val = syntergic_loss_with_ricci(
                model, inputs, targets, kappa_min=0.1
            )
            loss.backward()
            optimizer.step()
            
            ricci_vals.append(ric_val.item())
            
        print(f"Epoch {epoch+1}: Mean Ricci = {np.mean(ricci_vals[-10:]):.4f}, Psi = {psi_sig.item():.4f}")

    avg_ricci = np.mean(ricci_vals)
    print(f"\n--- Biopsy Result ---")
    print(f"Average Ricci Curvature: {avg_ricci:.4f}")
    
    if avg_ricci > -0.05:
        print("[VERDICT] Dataset is Geometrically RIGID (Safe structure). Suitible for transplant.")
    else:
        print("[VERDICT] Dataset shows high negative curvature (Hyperbolic/Chaotic). Proceed with caution.")

if __name__ == "__main__":
    biopsy_schema_lock()
