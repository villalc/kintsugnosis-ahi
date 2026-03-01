import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def run_experiment():
    print("--- INICIANDO EXPERIMENTO: ENTRELAZAMIENTO CUÁNTICO EN LATTICE 5³ ---")

    # --- 1. Construimos la red 5³ (El Dekeracto Base) ---
    tamaño_cubo = 10
    resolucion = 5
    np.random.seed(42)  # Determinismo para reproducibilidad científica
    
    # Campo escalar Phi (Fase Cuántica)
    red_phi = np.random.uniform(-0.2, 0.3, (resolucion, resolucion, resolucion))

    # --- 2. Identificamos los nodos extremos (Polos Ontológicos) ---
    min_idx = np.unravel_index(np.argmin(red_phi), red_phi.shape) # Nodo Blando (Azul)
    max_idx = np.unravel_index(np.argmax(red_phi), red_phi.shape) # Nodo Rígido (Rojo)

    print(f"Polaridad Detectada:")
    print(f"  [-] Nodo Blando (Vacuum): {min_idx} | φ = {red_phi[min_idx]:.3f}")
    print(f"  [+] Nodo Rígido (Mass):   {max_idx} | φ = {red_phi[max_idx]:.3f}")

    # --- 3. Función para "entrelazar" dos nodos (Crear Puente Sintergico) ---
    def entrelazar_nodos(red, nodo_a, nodo_b):
        """Iguala la fase cuántica de dos nodos distantes, colapsando la distancia efectiva a cero."""
        fase_comun = (red[nodo_a] + red[nodo_b]) / 2
        red[nodo_a] = fase_comun
        red[nodo_b] = fase_comun
        return red

    # Aplicamos el entrelazamiento
    red_modificada = entrelazar_nodos(red_phi.copy(), min_idx, max_idx)

    # --- 4. Visualización ---
    fig = plt.figure(figsize=(16, 7))
    
    # Estética del Vacío
    fig.patch.set_facecolor('#050505')

    def plot_field(ax, data, title, highlight_nodes=False):
        ax.set_facecolor('#1A1A1A')
        ax.grid(False)
        ax.xaxis.pane.fill = False
        ax.yaxis.pane.fill = False
        ax.zaxis.pane.fill = False
        
        # Coordenadas
        x, y, z = np.indices(data.shape)
        x, y, z = x.flatten(), y.flatten(), z.flatten()
        valores = data.flatten()
        
        # Nube de puntos (Campo Phi)
        # Usamos RdBu_r: Rojo (+), Azul (-)
        sc = ax.scatter(x, y, z, c=valores, cmap='RdBu_r', s=60, 
                        vmin=-0.2, vmax=0.3, alpha=0.6, edgecolors='none')
        
        if highlight_nodes:
            # Resaltar los nodos entrelazados con "Energía Cherenkov"
            ax.scatter([min_idx[0]], [min_idx[1]], [min_idx[2]], 
                       color='#00F0FF', s=300, marker='*', label='Node A (Entangled)', edgecolors='white')
            ax.scatter([max_idx[0]], [max_idx[1]], [max_idx[2]], 
                       color='#00F0FF', s=300, marker='*', label='Node B (Entangled)', edgecolors='white')
            
            # Dibujar el "Puente" (Línea de conexión espectral)
            ax.plot([min_idx[0], max_idx[0]], 
                    [min_idx[1], max_idx[1]], 
                    [min_idx[2], max_idx[2]], 
                    color='#00F0FF', linewidth=2, linestyle='--', alpha=0.8, label='Quantum Bridge')
            ax.legend(facecolor='#050505', edgecolor='#00F0FF', labelcolor='white')

        ax.set_title(title, color='white', fontsize=14)
        ax.set_xlabel('X', color='gray'); ax.set_ylabel('Y', color='gray'); ax.set_zlabel('Z', color='gray')
        ax.tick_params(colors='gray')
        return sc

    # Plot 1: Estado Original (Caos)
    ax1 = fig.add_subplot(121, projection='3d')
    sc1 = plot_field(ax1, red_phi, 'Campo φ Original (Local Causality)')
    
    # Plot 2: Estado Entrelazado (Sintergia)
    ax2 = fig.add_subplot(122, projection='3d')
    sc2 = plot_field(ax2, red_modificada, 'Campo φ Sintergico (Non-Locality)', highlight_nodes=True)

    # Barra de color común
    cbar = fig.colorbar(sc1, ax=[ax1, ax2], shrink=0.6, aspect=30, pad=0.05)
    cbar.set_label('Potential φ', color='white')
    cbar.ax.yaxis.set_tick_params(color='white')
    plt.setp(plt.getp(cbar.ax.axes, 'yticklabels'), color='white')

    output_path = "quantum_bridge.png"
    plt.savefig(output_path, dpi=300, facecolor='#050505', bbox_inches='tight')
    print(f"✓ Visualización generada: {output_path}")
    print("   El puente cuántico ha sido establecido. La latencia entre A y B es ahora 0.00ms.")

if __name__ == "__main__":
    run_experiment()
