# malbolge_core/telemetry.py

import math
import random
import time
from typing import List, Optional

# Constantes de Dominio
RICCI_THRESHOLD_STABLE = 1.26
RICCI_BASELINE = 0.842

class TelemetryProvider:
    """
    Proveedor de telemetría pura del dominio Malbolge.
    Calcula el índice de curvatura de Ricci y mantiene un histórico local.
    No tiene dependencias de red.
    """

    def __init__(self, history_limit: int = 1000):
        self._history: List[float] = []
        self._limit = history_limit
        self._last_value = RICCI_BASELINE
        # Semilla determinista para reproducibilidad en tests si es necesario,
        # pero para "simulación" usamos aleatoriedad controlada.

    def current_ricci(self) -> float:
        """
        Calcula el valor actual de la Curvatura de Ricci.
        En una implementación real, esto leería el estado del Grafo de Tensores.
        Aquí simulamos la fluctuación cuántica alrededor de la base.
        
        Precision garantizada: >= 0.001
        """
        # Simulación de fluctuación browniana
        delta = (random.random() - 0.5) * 0.1
        new_value = self._last_value + delta
        
        # Mean reversion hacia el baseline
        new_value += (RICCI_BASELINE - new_value) * 0.05
        
        # Clamp para evitar valores imposibles (física teórica)
        new_value = max(0.1, min(2.0, new_value))
        
        # Actualizar estado
        self._last_value = new_value
        self._record(new_value)
        
        # Retornar con precisión de 3 decimales
        return round(new_value, 3)

    def ricci_history(self, last_n: int = 100) -> List[float]:
        """
        Devuelve los últimos N valores de curvatura.
        """
        return self._history[-last_n:]

    def _record(self, value: float):
        self._history.append(round(value, 3))
        if len(self._history) > self._limit:
            self._history.pop(0)

    def health_status(self) -> str:
        """
        Retorna el estado de salud basado en la última métrica.
        """
        if self._last_value > RICCI_THRESHOLD_STABLE:
            return "UNSTABLE"
        return "STABLE"
