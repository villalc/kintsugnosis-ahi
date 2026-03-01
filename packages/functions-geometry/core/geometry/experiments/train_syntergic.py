import torch
import torch.optim as optim
from syntergic_model import SintergicGaugeNet, syntergic_loss
from syntergy_metrics import iphy_i_evaluation
import time

def train_syntergic():
    # Settings
    LATTICE_SIZE = 28 # MNIST size for convenience/testing
    HIDDEN_DIM = 128
    EPOCHS = 3
    BATCH_SIZE = 16
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    print(f"Initializing Syntergic GLNN on {DEVICE}...")
    
    # Model
    model = SintergicGaugeNet(lattice_size=LATTICE_SIZE, hidden_dim=HIDDEN_DIM, num_classes=10).to(DEVICE)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # Fake Data (e.g. MNIST-like)
    print("Generating synthetic data...")
    inputs = torch.randn(BATCH_SIZE, LATTICE_SIZE**2, device=DEVICE) # Flattened
    targets = torch.randint(0, 10, (BATCH_SIZE,), device=DEVICE)
    
    test_inputs = torch.randn(10, LATTICE_SIZE**2, device=DEVICE)
    test_targets = torch.randint(0, 10, (10,), device=DEVICE)
    test_loader = [(test_inputs, test_targets)] # Simple list for loader abstraction
    
    # Training Loop
    print("Starting Syntergic Training...")
    
    for epoch in range(EPOCHS):
        optimizer.zero_grad()
        
        # Forward & Loss
        loss, psi_val_sig = syntergic_loss(model, inputs, targets)
        
        loss.backward()
        optimizer.step()
        
        print(f"Epoch {epoch+1}: Loss={loss.item():.4f}, Psi (Sigmoid)={psi_val_sig.item():.4f}")
        
    print("\nRunning IPHY-I Resilience Protocol...")
    results = iphy_i_evaluation(model, test_loader, shock_intensity=0.5)
    
    print(f"IPHY-I Result: Stable={results['stable']}")
    print(f"Avg Integrity Loss: {results['avg_integrity_loss']:.4f}")

if __name__ == "__main__":
    train_syntergic()
