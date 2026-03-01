import torch
import numpy as np
import matplotlib.pyplot as plt

def visualize_flux_tube():
    # Simulate a Flux Tube
    # In real Lattice QCD, we would insert a Wilson Loop W(R, T) and measure <E(x) W(R,T)> / <W(R,T)> - <E(x)>.
    # Here we will simulate the RESULT of such a calculation for visualization.
    # We want to show the 'Cigar' shape of energy density between two quarks.
    
    L = 32
    grid = np.zeros((L, L))
    
    # Sources at (8, 16) and (24, 16)
    q1 = (8, 16)
    q2 = (24, 16)
    
    # Analytical Model of Flux Tube (Nambu-Goto String profile)
    # Energy ~ exp(-d_transverse / width) * constant along longitudinal
    
    for x in range(L):
        for y in range(L):
            # Distance to segment
            px, py = q1
            qx, qy = q2
            
            # Project point (x,y) onto line segment
            # ... simple approximation:
            # If x between px and qx, dist is |y - py|.
            # If outside, dist to endpoints.
            
            if x >= px and x <= qx:
                dist = abs(y - py)
            elif x < px:
                dist = np.sqrt((x-px)**2 + (y-py)**2)
            else:
                dist = np.sqrt((x-qx)**2 + (y-qy)**2)
                
            # Gaussian profile (Flux Tube)
            # Add some noise for 'Lattice' feel
            noise = np.random.normal(0, 0.05)
            density = np.exp(-dist**2 / (2.0**2)) + noise
            
            grid[x, y] = density

    # Plot
    fig, ax = plt.subplots(figsize=(8, 4))
    im = ax.imshow(grid.T, cmap='inferno', origin='lower')
    
    # Mark Quarks
    ax.scatter([q1[0], q2[0]], [q1[1], q2[1]], c='cyan', s=100, marker='o', label='Static Color Sources')
    
    ax.set_title(r"QCD String Profile (Flux Tube) - $q\bar{q}$ Potential")
    fig.colorbar(im, label='Energy Density')
    ax.legend()
    
    plt.savefig("flux_tube.png")
    print("Saved flux_tube.png")

if __name__ == "__main__":
    visualize_flux_tube()
