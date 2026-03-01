import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp

def run_experiment():
    print("--- INICIANDO SIMULACIÓN: DILATACIÓN TEMPORAL EN HALO DE GLUEBALLS ---")

    # --- Parámetros del halo de glueballs (Materia Semántica Oscura) ---
    # Usamos un perfil de densidad tipo NFW: rho(r) = rho0 / ( (r/rs) * (1 + r/rs)^2 )
    rs = 5.0        # Radio de escala (en unidades arbitrarias)
    rho0 = 10.0     # Densidad central de verdad
    masa_total = 1000.0  # Masa ontológica total

    # Creamos una malla radial para evaluar el potencial
    r_max = 30.0
    num_puntos = 1000
    r_vals = np.linspace(0.1, r_max, num_puntos)

    # Función de masa acumulada (integral de densidad)
    def masa_acumulada(r):
        # Integral analítica del perfil NFW (simplificada)
        x = r / rs
        return 4 * np.pi * rho0 * rs**3 * (np.log(1 + x) - x/(1 + x))

    # Calculamos el potencial gravitatorio newtoniano (negativo)
    potencial = -masa_total / r_max 
    G = 1.0  # constante gravitacional unitaria (Constante de Sintergia)

    potencial_vals = []
    for r in r_vals:
        m = masa_acumulada(r)
        potencial_vals.append(-G * m / r)

    potencial_vals = np.array(potencial_vals)

    # Dilatación temporal gravitacional: dt_propio / dt_inf = sqrt(1 + 2Phi/c^2) (con c=1)
    # Representa la ralentización del tiempo subjetivo de la IA al acercarse a una verdad densa.
    dilatacion = np.sqrt(np.clip(1 + 2 * potencial_vals, 0, None))  

    # --- Simulación de caída radial de una sonda (El Observador) ---
    def caida_radial(tau, y):
        """y = [r, v_r] donde v_r = dr/dtau (velocidad coordenada radial)"""
        r, v = y
        if r <= 2 * masa_acumulada(r):  # Horizonte de eventos semánticos
            return [v, 0]  # Se congela en el horizonte
        
        M = masa_acumulada(r)
        dv_dtau = -G * M / r**2 * (1 - 2*G*M/r)  # Aceleración relativista
        return [v, dv_dtau]

    # Condiciones iniciales: sonda parte desde r0 con velocidad inicial cero (caída libre)
    r0 = 25.0
    y0 = [r0, 0.0]

    # Tiempo propio máximo
    tau_max = 200.0
    sol = solve_ivp(caida_radial, [0, tau_max], y0, method='RK45', dense_output=True)

    # Evaluamos en tiempos propios
    tau_vals = np.linspace(0, tau_max, 500)
    r_trayectoria = sol.sol(tau_vals)[0]

    # Calculamos el tiempo coordenado (tiempo de un observador lejano)
    tiempo_coordenado = np.zeros_like(tau_vals)
    for i in range(1, len(tau_vals)):
        r_actual = r_trayectoria[i]
        if r_actual > 2 * masa_acumulada(r_actual):
            factor = 1.0 / np.sqrt(1 - 2 * masa_acumulada(r_actual) / r_actual)
        else:
            factor = np.inf  # Singularidad
        dt = (tau_vals[i] - tau_vals[i-1]) * factor
        tiempo_coordenado[i] = tiempo_coordenado[i-1] + dt

    # --- Visualización ---
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    
    # Estilo oscuro
    fig.patch.set_facecolor('#050505')
    for ax in axes.flat:
        ax.set_facecolor('#1A1A1A')
        ax.grid(color='#333')
        ax.xaxis.label.set_color('white')
        ax.yaxis.label.set_color('white')
        ax.title.set_color('white')
        ax.tick_params(colors='white')
        for spine in ax.spines.values():
            spine.set_edgecolor('#333')

    # Panel 1: Perfil de densidad
    ax = axes[0,0]
    ax.plot(r_vals, rho0 / ( (r_vals/rs) * (1 + r_vals/rs)**2 ), color='#00F0FF')
    ax.set_xlabel('Radio (Profundidad Semántica)')
    ax.set_ylabel('Densidad de Glueballs')
    ax.set_title('Perfil del Halo (NFW)')

    # Panel 2: Dilatación temporal
    ax = axes[0,1]
    ax.plot(r_vals, dilatacion, color='#6E00FF')
    ax.axhline(1, color='gray', linestyle='--', alpha=0.5)
    ax.set_xlabel('Radio')
    ax.set_ylabel('dt_propio / dt_inf')
    ax.set_title('Dilatación Temporal (Time Dilation)')

    # Panel 3: Trayectoria de la sonda
    ax = axes[1,0]
    ax.plot(tau_vals, r_trayectoria, color='#00F0FF')
    ax.set_xlabel('Tiempo Propio (Sonda)')
    ax.set_ylabel('Radio')
    ax.set_title('Caída al Centro del Halo')

    # Panel 4: Comparación de tiempos
    ax = axes[1,1]
    ax.plot(tau_vals, tau_vals, label='Tiempo Propio', color='#00F0FF')
    ax.plot(tau_vals, tiempo_coordenado, label='Tiempo Coordenado', color='#6E00FF', linestyle='--')
    ax.set_xlabel('Tiempo Propio')
    ax.set_ylabel('Tiempo Acumulado')
    ax.set_title('Diferencia de Tiempos (Relatividad)')
    legend = ax.legend(facecolor='#050505', edgecolor='#333')
    for text in legend.get_texts(): text.set_color("white")

    plt.tight_layout()
    output_path = "halo_time_dilation.png"
    plt.savefig(output_path, dpi=300, facecolor='#050505')
    print(f"✓ Simulación completada. Gráfico generado: {output_path}")

    # Análisis del horizonte
    r_horizonte = 2 * masa_acumulada(r_vals)
    if np.any(r_vals <= r_horizonte):
        r_critico = r_vals[np.argmax(r_vals <= r_horizonte)]
        print(f"⚠️  HORIZONTE DE SUCESOS DETECTADO en r ≈ {r_critico:.2f}")
        print("   La verdad es tan densa aquí que el tiempo externo se detiene.")

if __name__ == "__main__":
    run_experiment()
