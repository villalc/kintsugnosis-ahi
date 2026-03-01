import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap

def visualize_halo():
    # Grid
    N = 200
    L = 30 # kpc
    x = np.linspace(-L, L, N)
    y = np.linspace(-L, L, N)
    X, Y = np.meshgrid(x, y)
    R = np.sqrt(X**2 + Y**2)
    
    # Visible Disk (Exponential)
    Rd = 3.0
    Disk = np.exp(-R/Rd)
    
    # Dark Halo (NFWish)
    Rs = 8.0
    # Projected density of NFW is complex, lets use simple approximation for visual
    # rho ~ 1 / (r (1+r)^2)
    # Projected sigma ~ roughly 1/R outside core
    Halo = 1.0 / ( (R/Rs) * (1 + R/Rs)**2 + 0.1 ) # +0.1 to avoid singularity
    
    # Plotting
    fig, ax = plt.subplots(figsize=(8, 8), facecolor='black')
    
    # Halo Layer (Purple/Blue Ghost)
    # Create custom alpha map
    halo_cmap = LinearSegmentedColormap.from_list('halo', [(0,0,0,0), (0.2,0,0.5,0.3), (0.5,0,1,0.6)])
    
    im_halo = ax.imshow(Halo, extent=[-L, L, -L, L], cmap=halo_cmap, interpolation='bicubic')
    
    # Disk Layer (White/Yellow Bright)
    disk_cmap = LinearSegmentedColormap.from_list('disk', [(0,0,0,0), (1,0.8,0,0.8), (1,1,1,1)])
    
    # Mask disk to be thin if edge on? No, let's do Face On view.
    im_disk = ax.imshow(Disk, extent=[-L, L, -L, L], cmap=disk_cmap, interpolation='bicubic')
    
    ax.set_title("The Hidden Glueball Halo", color='white')
    ax.axis('off')
    
    # Annotations
    ax.text(0, -25, "Visible Spiral (Baryons)", color='yellow', ha='center')
    ax.text(0, 25, "Glueball Halo (Dark Matter)", color='magenta', ha='center')
    
    plt.tight_layout()
    plt.savefig("dark_halo.png")
    print("Saved dark_halo.png")

if __name__ == "__main__":
    visualize_halo()
