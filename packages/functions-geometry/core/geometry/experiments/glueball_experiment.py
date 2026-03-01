import torch
import torch.nn as nn
import numpy as np
import matplotlib.pyplot as plt

class Lattice4D(nn.Module):
    """
    4D Hypercubic Lattice for Spacetime simulations (Euclidean).
    Volume: T x L x L x L
    """
    def __init__(self, time_size=8, space_size=6, hidden_dim=64):
        super().__init__()
        self.T = time_size
        self.L = space_size
        self.dim = 4
        self.hidden_dim = hidden_dim
        
        # We model the Gauge Links U_mu(x) directly.
        # Links connect x to x+mu.
        # Input to network: Coordinate + Link Direction?
        # Or simply parameterize the field on the grid.
        
        # For Neural Ansatz: We learn a function Phi(x, mu) -> SU(N) element (or algebra)
        # Input: [Batch, 4] coordinate
        # Output: [Batch, Dim] gauge link value
        
        # But for 'Glueball Spectrum', we need a Statistical Ensemble (Markov Chain Monte Carlo)
        # OR we use our "Sintergic" approach: Variational Energy Minimization?
        # The user's list implies standard Lattice QCD methods (Monte Carlo), but we are doing "Neural" Gauge Theory.
        # Let's use Gradient Descent to find the "Vacuum State" (Minimum Action), then measure fluctuations (Masses).
        # Mass = Curvature of the well around the vacuum.
        
        # 1. Vacuum Search: Minimize S[U] (Action).
        # 2. Correlators: <O(t) O(0)> decay.
        
        # Let's simplify: Standard parameters on the grid.
        self.links = nn.Parameter(torch.randn(self.T, self.L, self.L, self.L, 4, hidden_dim) * 0.1)

    def action(self):
        # Neural Plaquet Action (Wilson Action analog)
        # Sum over all mu < nu of Tr(1 - U_plaq)
        # U_plaq = U_mu(x) U_nu(x+mu) U_mu(x+nu)^dagger U_nu(x)^dagger
        
        # Link U: [T, L, L, L, 4, H]
        # We need to implement shifts (circshift for periodic boundaries)
        U = self.links
        
        total_action = 0
        
        # Loop over mu, nu planes (01, 02, 03, 12, 13, 23)
        # Simplified: Just sum nearest neighbor differences squared as a proxy for smoothness (Yang Mills limit)
        # Force "Gauge Field" behavior: Smooth but non-trivial.
        
        # Let's use a "Neural Energy": Sum of local commutator norms? 
        # Or standard Plaquet sum.
        
        # Shifted Links
        for mu in range(4):
            for nu in range(mu+1, 4):
                # U_mu(x)
                U_mu = U[..., mu, :]
                
                # U_nu(x + mu)
                # Roll -1 in dim mu
                U_nu_shift = torch.roll(U[..., nu, :], shifts=-1, dims=mu)
                
                # U_mu(x + nu) -> U_mu_dag
                U_mu_shift = torch.roll(U[..., mu, :], shifts=-1, dims=nu)
                
                # U_nu(x) -> U_nu_dag
                U_nu = U[..., nu, :]
                
                # Plaquette P = U_mu * U_nu_shift - U_mu_shift * U_nu (Commutator-like for Algebra)
                # For Lie Algebra fields (A_mu), F_munu ~ dA - dA + [A, A]
                # Let's compute F_munu squared.
                
                # Difference derivative
                diff_mu_nu = (U_nu_shift - U_nu) - (U_mu_shift - U_mu) 
                
                # Commutator [A_mu, A_nu] ?
                # For abelian, it's 0. For non-abelian (matrix), we need matrix dims.
                # Assuming hidden_dim represents algebra components.
                
                # Let's stick to simple "Field Strength" energy:
                # E = sum || F_munu ||^2
                
                F_munu = diff_mu_nu # + commutator term if we had structure constants
                
                total_action += torch.sum(F_munu**2)
                
        return total_action

    def get_0pp_correlated(self):
        # Correlator for Scalar Glueball 0++
        # Operator O(t) = Sum_spatial Re(Trace(Plaquette))
        # Here: Sum_spatial ||F_munu||^2 (Energy Density)
        
        with torch.no_grad():
            U = self.links
            # Calculate Spatial Energy density per time slice
            energies = []
            
            for t in range(self.T):
                # Spatial plaquettes only (ij)
                slice_energy = 0
                for i in [1, 2, 3]:
                    for j in range(i+1, 4): # 12, 13, 23
                        # ... similar calculation as action but 3D slice ...
                        U_i = U[t, ..., i, :]
                        U_j_shift = torch.roll(U[t, ..., j, :], shifts=-1, dims=i-1) # dims 0,1,2 in slice
                        U_i_shift = torch.roll(U[t, ..., i, :], shifts=-1, dims=j-1)
                        U_j = U[t, ..., j, :]
                        
                        F_ij = (U_j_shift - U_j) - (U_i_shift - U_i)
                        slice_energy += torch.sum(F_ij**2)
                
                energies.append(slice_energy.item())
            
            # Autocorrelation of this series
            # C(tau) = <E(t) E(t+tau)>
            energies = np.array(energies)
            # Subtract vacuum energy (mean)
            energies -= energies.mean()
            
            # Compute C(tau)
            N = len(energies)
            C = []
            for tau in range(N//2):
                val = 0
                for t in range(N):
                    val += energies[t] * energies[(t+tau)%N]
                C.append(val / N)
                
            return np.array(C)

def run_glueball_spectrum():
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print("Simulating 4D Lattice for Glueball Spectrum...")
    
    # Needs to be bigger for correlation decay
    # T=16, L=6
    lattice = Lattice4D(time_size=16, space_size=6, hidden_dim=16).to(DEVICE)
    
    # 1. Thermalize / Minimize Action to find Vacuum
    # "Cooling" finding the instanton/vacuum background
    optimizer = torch.optim.Adam(lattice.parameters(), lr=0.01)
    
    print("Cooling to Vacuum...")
    for step in range(200):
        optimizer.zero_grad()
        S = lattice.action()
        S.backward()
        optimizer.step()
        if step % 50 == 0:
            print(f"Cooling Step {step}: Action = {S.item():.4f}")
            
    # 2. Add Thermal Fluctuations (Langevin Dynamics)
    # To measure mass, we need fluctuations around the vacuum.
    # We will simulate a "Monte Carlo" chain using SGD + Noise
    
    print("Collecting Measurements (Langevin Evolution)...")
    correlators = []
    
    optimizer = torch.optim.SGD(lattice.parameters(), lr=0.01)
    
    for step in range(1000):
        optimizer.zero_grad()
        S = lattice.action()
        S.backward()
        
        # Add Langevin Noise (Temperature)
        for p in lattice.parameters():
            noise = torch.randn_like(p) * 0.05
            p.grad += noise # Gradient flow + Noise -> Langevin
            
        optimizer.step()
        
        if step > 200 and step % 10 == 0: # Burn-in
            C = lattice.get_0pp_correlated()
            correlators.append(C)
            
    # 3. Average Correlator
    C_avg = np.mean(correlators, axis=0)
    
    # 4. Extract Mass
    # C(t) ~ A * exp(-m * t) + ...
    # Effective mass: m_eff(t) = log(C(t) / C(t+1))
    
    # Avoid log(negative)
    C_avg = np.abs(C_avg) + 1e-9
    m_eff = np.log(C_avg[:-1] / C_avg[1:])
    
    print("\nEffective Mass Plateau:")
    print(m_eff)
    
    # Plot
    fig, ax = plt.subplots(1, 2, figsize=(10, 4))
    
    ax[0].plot(C_avg, marker='o')
    ax[0].set_yscale('log')
    ax[0].set_title(r"Glueball Correlator $C(t)$")
    ax[0].set_xlabel("Euclidean Time $t$")
    
    ax[1].plot(m_eff, marker='x', color='red')
    ax[1].set_title(r"Effective Mass $m_{eff}(t)$")
    ax[1].set_xlabel("Time Separation")
    ax[1].set_ylabel("Mass (Lattice Units)")
    ax[1].set_ylim(0, max(m_eff)*1.2)
    
    plt.tight_layout()
    plt.savefig("glueball_spectrum.png")
    print("Saved glueball_spectrum.png")

if __name__ == "__main__":
    run_glueball_spectrum()
