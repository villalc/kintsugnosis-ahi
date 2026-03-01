import torch
import torch.optim as optim
import matplotlib.pyplot as plt
import numpy as np
from gauge_lattice import SintergicGaugeNet
from curvature import synthetic_ricci_curvature

def dream_geometry():
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Dreaming on {DEVICE}...")
    
    # Load a fresh model (random weights have symmetry too) or trained? 
    # Let's use a random model to see inherent structure of the architecture itself, 
    # or a slightly trained one. A random Gauge Net already has the symmetry constraints!
    model = SintergicGaugeNet().to(DEVICE)
    model.eval() # Freeze layers (though we need gradients w.r.t input)
    
    # Start with noise
    # We want to find an input X that MAXIMIZES Geometric Stability (Curvature)
    input_dream = torch.randn(1, 125, requires_grad=True, device=DEVICE)
    
    optimizer = optim.Adam([input_dream], lr=0.1)
    
    print("Optimizing Input for Maximum Curvature...")
    
    logs = []
    
    for step in range(200):
        optimizer.zero_grad()
        
        # Maximize Curvature => Minimize -Curvature
        # Note: synthetic_ricci_curvature returns a float or tensor?
        # In my implementation it returns a detailed calculation.
        # WAIT. 'synthetic_ricci_curvature' uses 'no_grad' for the perturbations!
        # This means it is NOT differentiable w.r.t weights.
        # But is it differentiable w.r.t INPUTS?
        # The perturbation is on WEIGHTS.
        # Input flows through weights.
        # If the metric calculation (entropy, wasserstein) uses the input in a differentiable way, yes.
        # BUT the perturbation loop `with torch.no_grad():` wraps the forward passes.
        # So... gradients won't flow back to input_dream through the `activations` calculation 
        # because it's inside `with torch.no_grad():`.
        
        # CRITICAL BLOCAKGE: The current `curvature.py` blocks gradients.
        # To "Dream", we need a differentiable metric.
        
        # Alternative Dream Target: "High Mass Gap"?
        # Gap is also estimated via non-diff finite differences.
        
        # Alternative 2: "Resonance". Maximize Activation of the Gauge Layer (Phi interaction).
        # We want to see what stimulation excites the "Gauge Field" the most.
        # Let's maximize `torch.norm(h_tilde - h)`. 
        # This measures how much the Gauge Field is "modifying" the signal.
        # If the signal is "pure gauge", maybe it passes through unchanged? 
        # Or maybe the "Gauge Resonance" is when the interaction is strongest.
        
        # Let's try: Maximize the Norm of the Interaction Term.
        # h_tilde = h * (1 + 0.1 tanh(phi))
        # Interaction = h * 0.1 * tanh(phi)
        # We want to find x that maximizes this interaction.
        
        # Recalc graph
        # We need to manually forward to get gradients
        x = input_dream
        h1 = model.layer1.linear(x)
        phi1 = model.layer1.phi
        psi1 = model.layer1.psi
        
        # Interaction 1
        interaction1 = h1 * 0.1 * torch.tanh(phi1)
        score = torch.norm(interaction1)
        
        loss = -score # Maximize score
        
        loss.backward()
        optimizer.step()
        
        if step % 20 == 0:
            print(f"Step {step}: Interaction Score = {score.item():.4f}")
            
    # Visualize the Dream
    # Reshape 125 -> 5x5x5
    dream_state = input_dream.detach().cpu().numpy().reshape(5, 5, 5)
    
    # Plot 3D Slices or Volumetric
    fig = plt.figure(figsize=(12, 5))
    
    # 1. 3D Scatter
    ax1 = fig.add_subplot(1, 2, 1, projection='3d')
    x, y, z = np.indices((5, 5, 5))
    # Filter only strong activations for clarity
    threshold = np.percentile(np.abs(dream_state), 75)
    mask = np.abs(dream_state) > threshold
    
    ax1.scatter(x[mask], y[mask], z[mask], c=dream_state[mask], cmap='coolwarm', s=100)
    ax1.set_title("The Dream Crystal (3D)")
    
    # 2. Slices
    ax2 = fig.add_subplot(1, 2, 2)
    # Montage of 5 slices
    slice_montage = np.hstack([dream_state[i,:,:] for i in range(5)])
    
    ax2.imshow(slice_montage, cmap='coolwarm')
    ax2.set_title("5 Layers of the Lattice (Slices)")
    ax2.axis('off')
    
    plt.tight_layout()
    plt.savefig("dream_result.png")
    print("Saved dream_result.png")

if __name__ == "__main__":
    dream_geometry()
