"""Legacy 2D PhysicsEngine — conservado para referencia histórica.

Este módulo fue el precursor del CosmicPhysicsEngine-3D.
NO usar en producción: opera sobre grids binarios 2D con ruido aleatorio
y tiene bugs documentados (threshold de sueño absoluto, sin física real).
Ver cosmic_engine.py para la implementación correcta.
"""
import random
import numpy as np


class PhysicsEngine:
    @staticmethod
    def evolucionar(u):
        """
        Evoluciona el estado del universo u (grid 2D binario).

        Returns:
            tuple: (new_state, entropy, sleep_mode)
        """
        rows, cols = u.shape
        new_state = np.zeros((rows, cols), dtype=int)

        for i in range(rows):
            for j in range(cols):
                if random.random() < 0.1:
                    new_state[i, j] = 1 - u[i, j]
                else:
                    new_state[i, j] = u[i, j]

        total_cells = rows * cols
        ones = np.sum(new_state)
        p = ones / total_cells if total_cells > 0 else 0
        if p == 0 or p == 1:
            entropy = 0.0
        else:
            entropy = -p * np.log2(p) - (1 - p) * np.log2(1 - p)

        # BUG conocido: threshold 0.9 dispara sueño en ~100% de pasos
        # (grids al 50% tienen entropía binaria ~0.9997)
        sueno = False
        if entropy < 0.1 or entropy > 0.9:
            sueno = True
            new_state = np.random.randint(2, size=(rows, cols))
            entropy = 1.0

        return new_state, entropy, sueno
