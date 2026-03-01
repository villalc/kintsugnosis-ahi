import torch
import numpy as np
import matplotlib.pyplot as plt
from core.geometry.models.gauge_lattice import SintergicGaugeNet
import io

def visualize_living_lattice():
    DEVICE = torch.device('cpu')
    print("Capturing 3D State...")
    
    # 1. Load Model (Untrained vs Trained)
    # Visualizing specific state
    model = SintergicGaugeNet().to(DEVICE)
    
    # Load weights from the experiment if we saved them... we didn't save .pth.
    # We will simulate a "Snapshot" by doing a quick burst of training
    # and capturing frames.
    
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    
    # 3D Grid Coordinates
    # 5x5x5
    x = np.linspace(0, 1, 5)
    y = np.linspace(0, 1, 5)
    z = np.linspace(0, 1, 5)
    X, Y, Z = np.meshgrid(x, y, z, indexing='ij')
    
    coords = np.stack([X.flatten(), Y.flatten(), Z.flatten()], axis=1) # [125, 3]
    
    # Input: Let's assume input matches spatial structure
    # Actually, input is random in our experiment.
    # But for "Living Lattice", let's feed a spatial wave.
    input_wave = torch.tensor(coords, dtype=torch.float32).flatten().unsqueeze(0) # [1, 375] -> Mismatch?
    # Model expects 125 inputs.
    # Let's say input is scalar per node.
    input_wave = torch.tensor(np.sin(10 * coords.sum(axis=1)), dtype=torch.float32).unsqueeze(0) # [1, 125]
    
    frames = []
    
    for step in range(50):
        # Forward to get activations
        # We need to hook into the layer.
        # But 'SintergicGaugeNet' layers return processed output.
        # Let's just visualize the OUTPUT of layer 2 (Hidden 64). 
        # Wait, that's 64 dim. Lattice is 125.
        # Let's visualize the FIRST LAYER OUTPUT (128 dim). 
        # Or better: The INPUT * Psi (The "Gated" Input).
        # Or even better: We visualize the 'Gauge Field' phi itself!
        # Phi is the heart of the theory.
        
        # Phi is in layer1 and layer2.
        phi1 = model.layer1.phi.detach().numpy() # [128] roughly
        # Let's visualize the first 125 dimensions of Phi mapped to the grid.
        
        # Fake training step to make it move
        loss = torch.sum(model(input_wave)[0])
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        vals = phi1[:125]
        frames.append(vals)

    # Plot Last Frame (Static for now)
    fig = plt.figure(figsize=(10, 8))
    ax = fig.add_subplot(111, projection='3d')
    
    final_state = frames[-1]
    # Color map
    p = ax.scatter(coords[:,0], coords[:,1], coords[:,2], c=final_state, cmap='twilight', s=100)
    
    ax.set_title("The Gauge Field (Phi) on $5^3$ Lattice")
    fig.colorbar(p, label='Gauge Potential')
    
    plt.savefig("living_lattice_3d.png")
    print("Saved living_lattice_3d.png")

if __name__ == "__main__":
    visualize_living_lattice()
