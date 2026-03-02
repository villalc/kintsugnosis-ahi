import numpy as np
import logging
import time

logger = logging.getLogger(__name__)


class CosmicPhysicsEngine:
    """
    Motor de física cósmica 3D con campo escalar continuo.

    Implementa:
    - Difusión laplaciana en espacio en expansión (Klein-Gordon sin masa)
    - Dilución cosmológica de materia: rho ~ a^-3
    - Enfriamiento térmico: T = T0 / a(t)
    - Curvatura escalar conforme: R = e^{2u}(4∇²u - 2|∇u|²)
    - Energía libre termodinámica: F = E - T·S
    - Sueño-optimizador con threshold normalizado

    Validado: run 83a530fe, 32³, 1000 pasos
    Régimen I (colapso 0-10), II (atractor 10-260), III (deriva cosmológica 260-999)
    """

    ENTROPY_HIGH = 0.95   # threshold normalizado S/S_max
    ENTROPY_LOW = 0.05
    TEMPERATURE = 0.1     # T_0 (temperatura inicial, se enfría con expansión)

    @staticmethod
    def evolucionar(u, step=0, H=1e-4):
        """
        Evoluciona el campo escalar u un paso temporal.

        Args:
            u (np.ndarray): Campo escalar 3D ∈ [0,1], shape (N,N,N)
            step (int): Paso de simulación actual
            H (float): Parámetro de Hubble (tasa de expansión lineal)

        Returns:
            tuple: (new_state, metrics_dict)
        """
        a_t = 1 + H * step

        # --- Difusión laplaciana (Klein-Gordon sin masa) ---
        laplaciano = (
            -6 * u
            + np.roll(u, 1, axis=0) + np.roll(u, -1, axis=0)
            + np.roll(u, 1, axis=1) + np.roll(u, -1, axis=1)
            + np.roll(u, 1, axis=2) + np.roll(u, -1, axis=2)
        )
        diffusion_coeff = 0.05 / (a_t ** 2)
        new_state = u + diffusion_coeff * laplaciano

        # --- Dilución cosmológica: rho ~ 1/a^3 ---
        new_state *= (1.0 / (1.0 + 3 * H))

        # --- Ruido térmico con enfriamiento cosmológico: T ~ 1/a ---
        current_temp = 0.01 / a_t
        new_state += np.random.normal(0, current_temp, size=u.shape)
        new_state = np.clip(new_state, 0, 1)

        # --- Métricas ---
        entropy = CosmicPhysicsEngine._entropy(new_state)
        energy = CosmicPhysicsEngine._energy(new_state)
        curvature_field = CosmicPhysicsEngine._ricci_curvature(new_state)
        mean_curvature = float(np.mean(curvature_field))

        # Normalización: S_max = N/e (máximo de -p·ln(p) es 1/e en p=1/e)
        S_max = new_state.size / np.e
        entropy_norm = entropy / S_max

        # Energía libre con temperatura de clase (no la efectiva, para consistencia)
        free_energy = energy - CosmicPhysicsEngine.TEMPERATURE * entropy

        # --- Sueño-optimizador (threshold normalizado) ---
        sueno = False
        if (entropy_norm > CosmicPhysicsEngine.ENTROPY_HIGH
                or entropy_norm < CosmicPhysicsEngine.ENTROPY_LOW):
            sueno = True
            # FIX: dream sobre new_state evolucionado, con temperatura efectiva
            new_state = CosmicPhysicsEngine._dream_search(
                new_state, temperature=current_temp
            )
            entropy = CosmicPhysicsEngine._entropy(new_state)
            energy = CosmicPhysicsEngine._energy(new_state)
            free_energy = energy - CosmicPhysicsEngine.TEMPERATURE * entropy
            mean_curvature = float(np.mean(CosmicPhysicsEngine._ricci_curvature(new_state)))
            entropy_norm = entropy / S_max

        metrics = {
            "step": step,
            "entropy": float(entropy),
            "entropy_norm": float(entropy_norm),
            "energy": float(energy),
            "free_energy": float(free_energy),
            "sueno": sueno,
            "expansion_factor": float(a_t),
            "mean_curvature": mean_curvature,
            "temperature": float(current_temp),
            "timestamp": time.time(),
        }

        return new_state, metrics

    # ------------------------------------------------------------------ #
    #  Observables geométricos                                             #
    # ------------------------------------------------------------------ #

    @staticmethod
    def _ricci_curvature(u):
        """
        Curvatura escalar conforme discreta.
        Métrica conforme: g = e^{-2u} δ_ij
        R = e^{2u} (4∇²u - 2|∇u|²)
        """
        gx = (np.roll(u, -1, axis=0) - np.roll(u, 1, axis=0)) / 2
        gy = (np.roll(u, -1, axis=1) - np.roll(u, 1, axis=1)) / 2
        gz = (np.roll(u, -1, axis=2) - np.roll(u, 1, axis=2)) / 2
        grad_sq = gx ** 2 + gy ** 2 + gz ** 2

        lap = (
            -6 * u
            + np.roll(u, 1, axis=0) + np.roll(u, -1, axis=0)
            + np.roll(u, 1, axis=1) + np.roll(u, -1, axis=1)
            + np.roll(u, 1, axis=2) + np.roll(u, -1, axis=2)
        )

        # Clamp para evitar overflow en exp
        conf_factor = np.exp(2 * np.clip(u, 0, 5))
        return conf_factor * (4 * lap - 2 * grad_sq)

    @staticmethod
    def _entropy(u):
        """Entropía diferencial del campo: S = -∑ u_i · ln(u_i)"""
        p = u.flatten()
        p = p[p > 1e-12]
        return float(-np.sum(p * np.log(p)))

    @staticmethod
    def _energy(u):
        """Energía de gradiente (energía cinética del campo escalar)."""
        grad = (
            (np.roll(u, 1, 0) - u) ** 2
            + (np.roll(u, 1, 1) - u) ** 2
            + (np.roll(u, 1, 2) - u) ** 2
        )
        return float(np.sum(grad))

    @staticmethod
    def _dream_search(u, trials=5, temperature=None):
        """
        Búsqueda estocástica del mínimo de energía libre.
        Opera sobre el estado YA evolucionado (no sobre el estado anterior).
        """
        if temperature is None:
            temperature = CosmicPhysicsEngine.TEMPERATURE

        best = u
        best_F = np.inf

        for _ in range(trials):
            candidate = u + np.random.normal(0, 0.05, size=u.shape)
            candidate = np.clip(candidate, 0, 1)

            S = CosmicPhysicsEngine._entropy(candidate)
            E = CosmicPhysicsEngine._energy(candidate)
            F = E - temperature * S  # FIX: temperatura efectiva, no constante

            if F < best_F:
                best_F = F
                best = candidate

        return best
