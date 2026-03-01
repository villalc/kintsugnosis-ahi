import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt
import numpy as np
from quantum_lattice import QuantumGaugeNet

def run_quantum_experiment():
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Initializing Quantum Simulation on {DEVICE}...")
    
    model = QuantumGaugeNet().to(DEVICE)
    optimizer = optim.Adam(model.parameters(), lr=1e-3)
    criterion = nn.CrossEntropyLoss()
    
    # Data: Simple XOR-like logical problem difficult for linear models?
    # Or just our standard random memory task to see capacity?
    inputs = torch.randn(16, 125).to(DEVICE)
    targets = torch.randint(0, 2, (16,)).to(DEVICE)
    
    print("Collapsing Wavefunctions (Training)...")
    
    loss_history = []
    
    for step in range(300):
        optimizer.zero_grad()
        
        logits, (xr, xi) = model(inputs)
        loss = criterion(logits, targets)
        loss.backward()
        optimizer.step()
        
        loss_history.append(loss.item())
        
        if step % 50 == 0:
            print(f"Step {step}: Loss = {loss.item():.4f}")
            
    print("Training Complete. Visualizing Interference...")
    
    # Visualization: INTERFERENCE PATTERN
    # We plot the Phase of the activations in Layer 2.
    # Phase = atan2(Im, Re)
    phase = torch.atan2(xi, xr).detach().cpu().numpy() #[16, 64]
    magnitude = torch.sqrt(xr**2 + xi**2).detach().cpu().numpy()
    
    # Pick first sample
    p_sample = phase[0] # [64]
    m_sample = magnitude[0] # [64]
    
    # Polar Plot
    fig = plt.figure(figsize=(10, 5))
    
    ax = fig.add_subplot(121, projection='polar')
    # Scatter plot: Angle = Phase, Radius = Magnitude
    c = ax.scatter(p_sample, m_sample, c=m_sample, cmap='hsv', alpha=0.75)
    ax.set_title("Qubit State (Layer 2)")
    
    ax2 = fig.add_subplot(122)
    ax2.plot(loss_history)
    ax2.set_title("Wavefunction Convergence")
    ax2.set_xlabel("Step")
    ax2.set_ylabel("Loss")
    
    plt.tight_layout()
    plt.savefig("quantum_interference.png")
    print("Saved quantum_interference.png")

if __name__ == "__main__":
    run_quantum_experiment()
