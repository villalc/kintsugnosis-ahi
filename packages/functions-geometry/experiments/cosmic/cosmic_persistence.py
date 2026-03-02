import json
import time
import numpy as np


class UniverseStatePersistence:
    """Persiste snapshots del campo escalar en formato JSONL."""

    @staticmethod
    def save_to_jsonl(estado, filename, run_id, step, metrics):
        """
        Guarda un snapshot del estado del universo.

        Args:
            estado (np.ndarray): Campo escalar 3D actual.
            filename (str): Ruta al archivo JSONL de log.
            run_id (str): UUID del experimento.
            step (int): Paso de simulación.
            metrics (dict): Métricas calculadas por CosmicPhysicsEngine.
        """
        with open(filename, "a", encoding="utf-8") as f:
            data = {
                "timestamp": time.time(),
                "run_id": run_id,
                "step": step,
                "shape": list(estado.shape),
                "metrics": metrics,
                "metadata": {
                    "engine": "CosmicPhysicsEngine-3D",
                    "ndim": int(estado.ndim),
                    "mean_density": float(np.mean(estado)),
                    "variance": float(np.var(estado)),
                },  # FIX: dict correctamente cerrado
            }   # FIX: dict data correctamente cerrado
            f.write(json.dumps(data) + "\n")
