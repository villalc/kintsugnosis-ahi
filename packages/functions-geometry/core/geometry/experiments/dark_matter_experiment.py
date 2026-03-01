import numpy as np
import matplotlib.pyplot as plt

def run_rotation_curve_simulation():
    print("Simulating Galaxy Dynamics with Glueball Dark Matter...")
    
    # Radius (kpc)
    r = np.linspace(0.1, 30, 100)
    
    # Constants
    G = 1.0 # Normalized Gravitational Constant
    
    # 1. Visible Matter (Baryons)
    # Model: Exponential Disk
    # Sigma(r) = Sigma_0 * exp(-r/Rd)
    # Mass M_disk(r) = 2pi * Sigma_0 * Rd^2 * [1 - exp(-r/Rd)(1 + r/Rd)]
    
    M_visible_total = 1.0
    Rd = 3.0 # Scale length (kpc)
    
    # Calculate Enclosed Mass for Disk
    # Normalized so total mass is M_visible_total
    M_disk_r = M_visible_total * (1 - np.exp(-r/Rd) * (1 + r/Rd))
    
    # Velocity contribution from Disk: v^2 = G * M / r
    v_disk = np.sqrt(G * M_disk_r / r)
    
    # 2. Dark Matter Halo (Glueballs)
    # Model: NFW Profile (Navarro-Frenk-White) or Isothermal Sphere
    # Let's use NFW: rho(r) = rho_0 / ( (r/Rs) * (1 + r/Rs)^2 )
    # M_halo(r) = 4pi * rho_0 * Rs^3 * [ln(1+cx) - cx/(1+cx)] where x = r/Rs
    
    # Halo Parameters
    Rs = 8.0 # Scale radius (kpc) - Halo is bigger than disk
    rho_0 = 0.05 # Central density
    
    # Calculate Enclosed Mass for Halo
    x = r / Rs
    # Integral of density profile
    # M(r) proportional to ...
    # Let's simplify: Isothermal Sphere (constant curve at large r)
    # rho(r) ~ 1/r^2
    # M(r) ~ r
    # v^2 ~ constant
    
    # Using NFW for realism
    M_halo_r = 4 * np.pi * rho_0 * (Rs**3) * (np.log(1 + x) - x / (1 + x))
    
    v_halo = np.sqrt(G * M_halo_r / r)
    
    # 3. Total Velocity
    # v_total^2 = v_disk^2 + v_halo^2
    v_total = np.sqrt(v_disk**2 + v_halo**2)
    
    # 4. "Newtonian" Prediction (No Dark Matter)
    # Just v_disk (decaying Keplerian)
    
    # Plotting
    plt.figure(figsize=(10, 6))
    
    # Plot Components
    plt.plot(r, v_disk, 'g--', label='Visible Matter (Disk)', linewidth=2, alpha=0.7)
    plt.plot(r, v_halo, 'm--', label='Glueball Halo (Dark Matter)', linewidth=2, alpha=0.7)
    
    # Plot Total
    plt.plot(r, v_total, 'w-', label='Observed (Total)', linewidth=3)
    
    # Newtonian Expected (Same as v_disk but conceptually distinct)
    plt.plot(r, v_disk, 'r:', label='Newtonian Prediction (without DM)', linewidth=1)
    
    plt.xlabel("Radius (kpc)")
    plt.ylabel("Orbital Velocity (km/s)")
    plt.title("Galaxy Rotation Curve: The Glueball Hypothesis")
    plt.style.use('dark_background')
    plt.legend()
    plt.grid(True, alpha=0.2)
    
    plt.annotate(r'Decline expected by Newton ($1/\sqrt{r}$)', 
                 xy=(25, v_disk[-1]), xytext=(15, v_disk[-1]+0.2),
                 arrowprops=dict(facecolor='red', shrink=0.05))
                 
    plt.annotate(r'Flat Curve observed (Glueballs)', 
                 xy=(25, v_total[-1]), xytext=(15, v_total[-1]-0.2),
                 arrowprops=dict(facecolor='white', shrink=0.05))
    
    plt.savefig("rotation_curve.png")
    print("Saved rotation_curve.png")
    
    # Verify Flatness
    flatness = v_total[-1] / np.max(v_total)
    print(f"Curve Flatness Factor: {flatness:.2f} (1.0 = Perfectly Flat)")

if __name__ == "__main__":
    run_rotation_curve_simulation()
