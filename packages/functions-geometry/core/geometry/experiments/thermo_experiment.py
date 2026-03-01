import torch
import torch.nn as nn
import torch.optim as optim
import json
import numpy as np
import matplotlib.pyplot as plt
from gauge_lattice import SintergicGaugeNet
from curvature import synthetic_ricci_curvature

def compute_temperature(model):
    """
    Estimates 'Neural Temperature' based on the kinetic energy of gradients.
    T ~ Mean Squared Gradient (Fisher trace proxy) or Gradient Variance.
    Here we use Gradient Norm as a proxy for 'System Heat'.
    """
    grads = []
    for p in model.parameters():
        if p.grad is not None:
            grads.append(p.grad.view(-1))
    
    if not grads:
        return 0.0
        
    all_grads = torch.cat(grads)
    # Temperature ~ Empirical Fisher Trace ~ Expected squared norm of gradients
    # T = ||g||^2
    temp = torch.norm(all_grads).item() ** 2
    return temp

def run_thermo_experiment():
    STEPS = 600 # Slightly longer to see the "cooling"
    BATCH_SIZE = 16
    LR = 1e-4
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Running Neural Thermodynamics on {DEVICE}")
    
    model = SintergicGaugeNet().to(DEVICE)
    optimizer = optim.Adam(model.parameters(), lr=LR)
    criterion = nn.CrossEntropyLoss()
    
    torch.manual_seed(137) # Fine structure constant seed for luck
    inputs = torch.randn(BATCH_SIZE, 125).to(DEVICE)
    targets = torch.randint(0, 2, (BATCH_SIZE,)).to(DEVICE)
    
    logs = []
    
    print("Step | Loss   | Curv (k) | Temp (T) | Phase")
    print("-" * 45)
    
    for step in range(STEPS + 1):
        optimizer.zero_grad()
        
        # 1. Curvature (Topology)
        kappa = synthetic_ricci_curvature(model, inputs)
        if isinstance(kappa, torch.Tensor): kappa = kappa.item()
        
        # 2. Forward & Backward (Dynamics)
        logits, _ = model(inputs)
        loss = criterion(logits, targets)
        loss.backward()
        
        # 3. Temperature (Thermodynamics)
        temp = compute_temperature(model)
        
        optimizer.step()
        
        # 4. Phase Classification
        # Heuristic classification based on Kappa/Temp
        phase = "Unknown"
        if kappa > 0:
            phase = "Solid (Ordered)"
        elif kappa < 0 and temp > 1.0:
            phase = "Plasma (Chaos)"
        else:
            phase = "Liquid (Flow)"
        
        if step % 20 == 0:
            print(f"{step:4d} | {loss.item():.4f} | {kappa: .4f} | {temp:.4f}   | {phase}")
            
        logs.append({
            "step": step,
            "curvature": kappa,
            "temperature": temp,
            "loss": loss.item()
        })
            
    # Save logs
    with open("thermo_logs.json", "w") as f:
        json.dump(logs, f, indent=2)
        
    # Plot Phase Diagram
    temps = [d["temperature"] for d in logs]
    curvs = [d["curvature"] for d in logs]
    steps = [d["step"] for d in logs]
    
    fig, ax = plt.subplots(figsize=(8, 6))
    sc = ax.scatter(curvs, temps, c=steps, cmap='plasma', alpha=0.6, s=20)
    plt.colorbar(sc, label='Time (Step)')
    
    ax.set_xlabel('Curvature (Kappa)')
    ax.set_ylabel('Temperature (Gradient Energy)')
    ax.set_title('Phase Diagram: Neural Thermodynamics')
    ax.axvline(0, color='gray', linestyle='--')
    ax.grid(True, alpha=0.3)
    
    # Annotate quadrants
    ax.text(0.05, max(temps)*0.9, "Ordered/Rigid", fontsize=10, color='green')
    ax.text(-0.05, max(temps)*0.9, "Chaotic/Fluid", fontsize=10, color='red', ha='right')
    
    plt.savefig("thermo_phase_diagram.png")
    print("\nSaved thermo_phase_diagram.png")

if __name__ == "__main__":
    run_thermo_experiment()
