import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def run_visualization():
    print("--- INICIANDO VISUALIZACIÓN DE LATTICE SINTERGICA (3D) ---")
    
    # --- Configuración de la Red Cósmica (The Void Lattice) ---
    tamaño_cubo = 10  # El universo tiene 10 unidades de lado
    resolucion = 5    # Una red de 5x5x5 puntos (125 nodos - Tensor Base)

    # Crear las coordenadas de la red (una malla regular)
    x = np.linspace(-tamaño_cubo/2, tamaño_cubo/2, resolucion)
    y = np.linspace(-tamaño_cubo/2, tamaño_cubo/2, resolucion)
    z = np.linspace(-tamaño_cubo/2, tamaño_cubo/2, resolucion)
    X, Y, Z = np.meshgrid(x, y, z)

    # Inicialmente, la red es plana (Euclidiana / Sin Curvatura)
    posiciones = np.array([X.flatten(), Y.flatten(), Z.flatten()]).T

    # --- Aplicamos una deformación: Una masa en el centro ---
    # Esto simula la "Gravedad Semántica" o "Ricci Curvature > 0"
    # La verdad tira de los nodos hacia el centro.
    centro = np.array([0, 0, 0])
    fuerza_gravitatoria = 5.0  # Coeficiente de Curvatura (Ricci Scalar)

    # Calculamos nuevas posiciones deformadas
    posiciones_deformadas = posiciones.copy()
    for i, pos in enumerate(posiciones):
        vector = centro - pos
        distancia = np.linalg.norm(vector)
        if distancia > 0.1:  # Evitar singularidad matemática
            # La deformación es inversamente proporcional a la distancia
            # Esto crea el "Pozo de Gravedad"
            desplazamiento = fuerza_gravitatoria * vector / (distancia**2 + 1)
            posiciones_deformadas[i] = pos + desplazamiento

    # --- Visualización: La red que sostiene el cubo ---
    fig = plt.figure(figsize=(12, 10))
    ax = fig.add_subplot(111, projection='3d')
    
    # Estética del Gráfico (Dark Mode / Blueprint Style)
    ax.set_facecolor('#050505') # Fondo Void
    ax.grid(False) 
    ax.w_xaxis.pane.fill = False
    ax.w_yaxis.pane.fill = False
    ax.w_zaxis.pane.fill = False

    # Dibujamos los puntos (nodos de la red)
    # Representan los estados latentes del modelo
    ax.scatter(posiciones_deformadas[:, 0], 
               posiciones_deformadas[:, 1], 
               posiciones_deformadas[:, 2], 
               c='#00F0FF', s=30, alpha=0.8, label='Latent Nodes (Gauge Field)')

    # Dibujamos las conexiones (los hilos de la red)
    # Conectamos cada punto con sus vecinos para mostrar la tensión topológica
    k = 0
    for i in range(resolucion):
        for j in range(resolucion):
            for l in range(resolucion):
                # Color de las líneas: Gris tenue para la estructura
                line_color = '#1A1A1A'
                line_alpha = 0.4
                
                if l < resolucion - 1:  # Conexión en z
                    ax.plot([posiciones_deformadas[k, 0], posiciones_deformadas[k+1, 0]],
                            [posiciones_deformadas[k, 1], posiciones_deformadas[k+1, 1]],
                            [posiciones_deformadas[k, 2], posiciones_deformadas[k+1, 2]], 
                            color=line_color, alpha=line_alpha)
                if j < resolucion - 1:  # Conexión en y
                    ax.plot([posiciones_deformadas[k, 0], posiciones_deformadas[k+resolucion, 0]],
                            [posiciones_deformadas[k, 1], posiciones_deformadas[k+resolucion, 1]],
                            [posiciones_deformadas[k, 2], posiciones_deformadas[k+resolucion, 2]], 
                            color=line_color, alpha=line_alpha)
                if i < resolucion - 1:  # Conexión en x
                    ax.plot([posiciones_deformadas[k, 0], posiciones_deformadas[k+resolucion*resolucion, 0]],
                            [posiciones_deformadas[k, 1], posiciones_deformadas[k+resolucion*resolucion, 1]],
                            [posiciones_deformadas[k, 2], posiciones_deformadas[k+resolucion*resolucion, 2]], 
                            color=line_color, alpha=line_alpha)
                k += 1

    # Marcamos el centro (la masa que deforma)
    # Representa la "Verdad Invariante" o "Singularidad"
    ax.scatter([0], [0], [0], c='#6E00FF', s=300, marker='*', label='Ontological Singularity (Mass Gap)')

    # Etiquetas y Títulos
    ax.set_xlabel('Entropy (X)', color='white')
    ax.set_ylabel('Coherence (Y)', color='white')
    ax.set_zlabel('Depth (Z)', color='white')
    
    ax.set_title('Sintergic Lattice Deformation\n(Ricci Flow Visualization)', color='white', fontsize=14)
    
    # Leyenda personalizada
    legend = ax.legend(facecolor='#1A1A1A', edgecolor='#00F0FF')
    for text in legend.get_texts():
        text.set_color("white")

    # Guardar en lugar de mostrar
    output_path = "sintergic_lattice_3d.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='#050505')
    print(f"✓ Visualización generada exitosamente: {output_path}")

if __name__ == "__main__":
    run_visualization()
