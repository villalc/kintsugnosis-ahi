import torch
import numpy as np
import matplotlib.pyplot as plt
from glueball_experiment import Lattice4D

def measure_polyakov_loop(lattice):
    """
    Polyakov Loop L(x) = Prod_t U_0(x, t)
    Order parameter for Deconfinement.
    Low T (Confined): <L> ~ 0 (Center Symmetry preserved)
    High T (Deconfined): <L> != 0 (Center Symmetry broken)
    """
    # U has shape [T, L, L, L, 4, Hidden]
    # We take the product of temporal links (dim 0, index 0)
    # Simplified: We treat 'links' as effectively U(1) angles or SU(2) matrices.
    # Our lattice param is [..., Hidden]. Let's take Norm as "Value".
    # Or assuming abelian U(1), parameter is Angle.
    
    # Let's assume the parameters ARE the phases/angles for a U(1) theory approximation
    # Trace(Product) ~ Sum(Angles) for phases?
    # No, Product of exp(i*theta) = exp(i * sum(theta))
    # Trace = Re(exp(...)) = cos(sum(theta))
    
    # Temporal links at direction mu=0
    U_temporal = lattice.links[..., 0, :] # [T, S, S, S, Hidden]
    
    # Sum over time (Product of matrices -> Sum of exponents in abelian)
    # We sum over the T dimension (dim 0)
    loop_sum = torch.sum(U_temporal, dim=0) # [S, S, S, Hidden]
    
    # "Trace" (Value of the loop)
    # Assuming parameters are phases or generators. 
    # Let's take the Cosine of the magnitude as a proxy for the Trace of the group element.
    # L = mean(cos(sum of temporal links))
    L_val = torch.mean(torch.cos(torch.norm(loop_sum, dim=-1)))
    
    return L_val.item()

def run_deconfinement_scan():
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print("Initiating Thermal Scan for Critical Temperature Tc...")
    
    # 4D Lattice
    lattice = Lattice4D(time_size=8, space_size=6, hidden_dim=8).to(DEVICE)
    
    # Temperature Range
    temperatures = np.linspace(0.01, 2.0, 20)
    polyakov_loops = []
    susceptibilities = []
    
    # We scan T. For each T, we equilibrate and measure.
    # We use a NEW optimizer/state for each T to avoid hysteresis (or maybe we want to see it?)
    # Let's reset for independence.
    
    for T in temperatures:
        print(f"Sampling at Temperature T={T:.2f}...")
        
        # Reset Lattice (Cold Start)
        lattice.links.data = torch.randn_like(lattice.links) * 0.1
        
        # Langevin Dynamics:
        # dU = -dS/dU * dt + noise * sqrt(2*T*dt)
        # We simulate this via Gradient Descent + Noise scale
        
        lr = 0.05
        # Noise scale sigma = sqrt(2 * lr * T) ??
        # In discrete SGD: theta_new = theta - lr * grad + sqrt(2*lr*T)*noise
        noise_scale = np.sqrt(2 * lr * T)
        
        measurements = []
        
        optimizer = torch.optim.SGD(lattice.parameters(), lr=lr)
        
        for step in range(200): # Fast equilibration
            optimizer.zero_grad()
            S = lattice.action()
            S.backward()
            
            # Add Noise (Langevin)
            with torch.no_grad():
                for p in lattice.parameters():
                    noise = torch.randn_like(p) * noise_scale
                    p.grad += noise # Effectively subtracting noise if we do step, but noise is symm.
                    
            optimizer.step()
            
            if step > 100: # Measure
                p_loop = abs(measure_polyakov_loop(lattice)) # |L|
                measurements.append(p_loop)
                
        # Average <|L|>
        avg_L = np.mean(measurements)
        # Susceptibility Chi = <L^2> - <L>^2
        var_L = np.var(measurements) * (lattice.L ** 3) # Volume scaling
        
        polyakov_loops.append(avg_L)
        susceptibilities.append(var_L)
        
        print(f"  -> <|L|> = {avg_L:.4f}")

    # Plot
    fig, ax1 = plt.subplots(figsize=(8, 6))

    color = 'tab:red'
    ax1.set_xlabel('Temperature (Langevin Noise)')
    ax1.set_ylabel('Polyakov Loop <|L|>', color=color)
    ax1.plot(temperatures, polyakov_loops, color=color, marker='o', label='Order Parameter')
    ax1.tick_params(axis='y', labelcolor=color)
    ax1.grid(True, alpha=0.3)
    
    # Mark Transition
    # Find max susceptibility
    peak_idx = np.argmax(susceptibilities)
    Tc = temperatures[peak_idx]
    
    ax2 = ax1.twinx()
    color = 'tab:blue'
    ax2.set_ylabel('Susceptibility (Fluctuations)', color=color)
    ax2.plot(temperatures, susceptibilities, color=color, linestyle='--', marker='x', label='Susceptibility')
    ax2.tick_params(axis='y', labelcolor=color)
    
    plt.title(f"Deconfinement Phase Transition (Tc ~ {Tc:.2f})")
    plt.axvline(Tc, color='green', linestyle=':', label=f'Critical Temp Tc={Tc:.2f}')
    
    fig.tight_layout()
    plt.savefig("deconfinement_results.png")
    print(f"Saved deconfinement_results.png. Critical Temperature found at Tc = {Tc}")

if __name__ == "__main__":
    run_deconfinement_scan()
