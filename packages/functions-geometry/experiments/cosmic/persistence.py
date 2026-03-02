"""Legacy 2D persistence — conservado para referencia histórica.

Ver cosmic_persistence.py para la implementación correcta (3D, con run_id,
step, metrics, y sin el bug de dict sin cerrar).
"""
import json
import time
import numpy as np


class UniverseStatePersistence:
    @staticmethod
    def save_to_jsonl(estado, filename):
        """
        Guarda el estado del universo 2D binario en JSONL.
        """
        with open(filename, "a", encoding="utf-8") as f:
            data = {
                "timestamp": time.time(),
                "grid": estado.tolist(),
                "grid_shape": list(estado.shape),
                "metadata": {
                    "engine": "PhysicsEngine-2D",
                    "ndim": int(getattr(estado, "ndim", 2)),
                    "total_cells": int(estado.size),
                    "active_cells": int(np.sum(estado)),
                },
            }
            f.write(json.dumps(data) + "\n")
