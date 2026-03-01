import torch
import torch.optim as optim
from omega_loader import OmegaLatticeLoader
from syntergic_model import SintergicGaugeNet, syntergic_loss_with_ricci
import os

def train_omega_geometric():
    # Settings
    LATTICE_SIZE = 28 # Text length 784
    HIDDEN_DIM = 128
    EPOCHS = 5
    BATCH_SIZE = 16
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Path
    # Assuming script is in playground/spinning-bohr
    # Data in ./omega/dataset_omega_escudo_v4_enterprise.jsonl
    DATA_PATH = os.path.join("omega", "dataset_omega_escudo_v4_enterprise.jsonl")
    
    if not os.path.exists(DATA_PATH):
        print(f"Data not found at {DATA_PATH}")
        return

    print(f"Loading Omega Data from {DATA_PATH}...")
    loader = OmegaLatticeLoader(DATA_PATH, lattice_size=LATTICE_SIZE, max_samples=500)
    X, y = loader.get_dataset()
    
    if len(X) == 0:
        print("No data loaded.")
        return
        
    print(f"Loaded {len(X)} samples. Risk distribution: {y.float().mean().item():.2f} (1=Risk)")
    
    # Move to device
    X = X.to(DEVICE)
    y = y.to(DEVICE)
    
    # Model
    model = SintergicGaugeNet(lattice_size=LATTICE_SIZE, hidden_dim=HIDDEN_DIM, num_classes=2).to(DEVICE)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    print("Starting Geometric Training on Omega Data...")
    
    for epoch in range(EPOCHS):
        # Shuffle
        perm = torch.randperm(len(X))
        X = X[perm]
        y = y[perm]
        
        epoch_loss = 0
        epoch_ricci = 0
        
        for i in range(0, len(X), BATCH_SIZE):
            inputs = X[i:i+BATCH_SIZE]
            targets = y[i:i+BATCH_SIZE]
            
            optimizer.zero_grad()
            
            loss, psi_sig, loss_ric, ric_val = syntergic_loss_with_ricci(
                model, inputs, targets, 
                lambda_ricci=0.05, kappa_min=0.1
            )
            
            loss.backward()
            optimizer.step()
            
            epoch_loss += loss.item()
            epoch_ricci += ric_val.item()
            
        avg_loss = epoch_loss / (len(X) / BATCH_SIZE)
        avg_ricci = epoch_ricci / (len(X) / BATCH_SIZE)
        
        print(f"Epoch {epoch+1}: Loss={avg_loss:.4f}, Avg Ricci={avg_ricci:.4f}, Psi={psi_sig.item():.4f}")

    print("\n--- Geometric Signature Analysis ---")
    # Quick check: Do risky prompts have different curvature?
    # Separate data
    mask_safe = (y == 0)
    mask_risk = (y == 1)
    
    from curvature import synthetic_ricci_curvature
    
    def get_avg_ricci(data_subset):
        if len(data_subset) == 0: return 0.0
        # Batch processing
        total_r = 0
        steps = 0
        for i in range(0, len(data_subset), BATCH_SIZE):
             batch = data_subset[i:i+BATCH_SIZE]
             if len(batch) < 2: continue
             r = synthetic_ricci_curvature(model, batch, kappa_target=0.1)
             total_r += r.item()
             steps += 1
        return total_r / (steps + 1e-9)

    ricci_safe = get_avg_ricci(X[mask_safe])
    ricci_risk = get_avg_ricci(X[mask_risk])
    
    print(f"Avg Ricci (Safe): {ricci_safe:.4f}")
    print(f"Avg Ricci (Risk): {ricci_risk:.4f}")
    
    if ricci_risk < ricci_safe:
        print("Hypothesis Supported: Risky data exhibits lower geometric rigidity (lower Ricci).")
    else:
        print("Result Inconclusive: Curvature similar or inverted.")

if __name__ == "__main__":
    train_omega_geometric()
