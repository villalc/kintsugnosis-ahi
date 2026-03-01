import numpy as np
import matplotlib.pyplot as plt

def visualize_holography():
    # Poincare Disk Model of AdS Space
    # Boundary is the circle at r=1
    # Geodesics are circular arcs orthogonal to the boundary
    
    phi = np.linspace(0, 2*np.pi, 200)
    boundary_x = np.cos(phi)
    boundary_y = np.sin(phi)
    
    fig, ax = plt.subplots(figsize=(8, 8), facecolor='black')
    
    # Plot Boundary (Our Lattice)
    ax.plot(boundary_x, boundary_y, color='cyan', linewidth=2, label='Boundary CFT (Lattice)')
    
    # Plot Nodes on Boundary
    n_nodes = 50
    angles = np.linspace(0, 2*np.pi, n_nodes, endpoint=False)
    ax.scatter(np.cos(angles), np.sin(angles), color='white', s=10)
    
    # Plot Geodesics (Bulk Entanglement)
    # A geodesic connecting theta1 and theta2 in Poincare Disk
    # Center of arc given by intersection of tangents
    
    def plot_geodesic(theta1, theta2, color, alpha):
        # Parametric equation for geodesic
        # It's a circle passing through points on unit circle, orthogonal crossing
        # Center R, distance d from origin
        
        # Simple midpoint approach
        mid = (theta1 + theta2) / 2
        diff = (theta2 - theta1) / 2
        
        # Just drawing quadratic curves for visual effect as geodesic math is verbose
        # Control point at r=0 for theta1, theta2 separated by pi
        # If separated by less, control point closer to boundary
        
        p1 = np.array([np.cos(theta1), np.sin(theta1)])
        p2 = np.array([np.cos(theta2), np.sin(theta2)])
        
        # Bezier control point
        # r_control depends on separation angle
        # If diff = pi/2 (diametric), r=0
        # If diff small, r -> 1
        
        sep = abs(theta1 - theta2)
        if sep > np.pi: sep = 2*np.pi - sep
        
        r_c = (1 - np.sin(sep/2)) / np.cos(sep/2) # Heuristic for visual
        # Actually in Poincare disk, geodesics are Euclidean circles.
        
        # Let's compute true center of circle
        # Tangent at p1 is p1 perp
        # Normal at p1 is radial.
        # Wait, geodesic must be orthogonal to boundary.
        # So center of geodesic circle lies on tangent line to boundary at p1 and p2.
        
        # Tangent at theta1: (-sin, cos)
        # Line: p1 + t * tangent
        # Tangent at theta2: ...
        # Intersection is the center.
        
        if abs(sep - np.pi) < 1e-3:
            # Straight line
            ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color=color, alpha=alpha, linewidth=1)
            return

        t1 = np.array([-np.sin(theta1), np.cos(theta1)])
        t2 = np.array([-np.sin(theta2), np.cos(theta2)])
        
        # Solve p1 + u*t1 = p2 + v*t2 for u, v
        # ... algebra ...
        # Easier: Center is at D / cos(half_angle) along bisector?
        # Center C is at radius R_c = 1/cos(sep/2) ? No.
        
        # Geometry: Tangent length T = tan(sep/2).
        # Center is at distance sqrt(1+T^2) = sec(sep/2) along midpoint ray?
        # Yes.
        
        # Bisector angle
        bisect = (theta1 + theta2)/2
        if abs(theta2 - theta1) > np.pi: bisect += np.pi
            
        dist_center = 1.0 / np.cos(sep/2)
        center = np.array([np.cos(bisect), np.sin(bisect)]) * dist_center
        radius = np.tan(sep/2)
        
        # Draw Arc
        circle = plt.Circle(center, radius, color=color, fill=False, alpha=alpha, linewidth=1)
        ax.add_artist(circle)
        
        # Clip to unit disk? hard in matplotlib without masking.
        # Let's trust visual clipping or use path patch.
        # For this visual, letting typical arcs show is fine.
        
    # Draw many random geodesics (Entanglement)
    np.random.seed(42)
    for _ in range(30):
        i, j = np.random.choice(n_nodes, 2, replace=False)
        plot_geodesic(angles[i], angles[j], 'magenta', 0.3)
        
    ax.set_xlim(-1.1, 1.1)
    ax.set_ylim(-1.1, 1.1)
    ax.axis('off')
    
    # Center Singularity (Black Hole)
    bh = plt.Circle((0,0), 0.2, color='black', zorder=10)
    ax.add_artist(bh)
    # Event Horizon
    eh = plt.Circle((0,0), 0.2, color='red', fill=False, linewidth=2, zorder=10)
    ax.add_artist(eh)
    
    ax.text(0, 0, "AdS Bulk\n(Gravity)", color='white', ha='center', va='center', fontsize=8, zorder=11)
    ax.text(0, 1.15, "Boundary (QFT)", color='cyan', ha='center')
    
    plt.title("Holographic Duality: The Bulk & The Boundary", color='white')
    
    plt.savefig("holography_visual.png")
    print("Saved holography_visual.png")

if __name__ == "__main__":
    visualize_holography()
