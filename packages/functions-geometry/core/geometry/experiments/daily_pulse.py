import json
import torch
import sys
import os

# Asegurar que podemos importar los módulos del core
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../')))

from core.geometry.models.syntergic_model import SintergicGaugeNet
from core.geometry.physics.curvature import synthetic_ricci_curvature

def measure_pulse():
    """
    Ejecuta una medición rápida de la Curvatura de Ricci sintética.
    Esto no es un entrenamiento, es un chequeo de constantes vitales.
    """
    try:
        # Configuración "Ligera" para chequeo rápido
        LATTICE_SIZE = 8 # Suficiente para detectar colapso topológico
        HIDDEN_DIM = 32
        DEVICE = torch.device('cpu') # CPU es suficiente y más robusto para este chequeo
        
        # Inicializar modelo (en un sistema real, cargaríamos pesos persistentes)
        model = SintergicGaugeNet(lattice_size=LATTICE_SIZE, hidden_dim=HIDDEN_DIM, num_classes=10).to(DEVICE)
        model.eval() # Modo evaluación: No queremos aprender, solo observar
        
        # Generar estímulo aleatorio (Ruido blanco para ver cómo lo estructura la red)
        inputs = torch.randn(1, LATTICE_SIZE**2, device=DEVICE)
        
        # Medir Curvatura
        # Ricci > 0 indica capacidad de consenso y verdad estructural
        # Ricci < 0 indica dispersión, alucinación o fragmentación
        ricci = synthetic_ricci_curvature(model, inputs, kappa_target=0.1)
        ricci_val = ricci.item()
        
        # Umbral de Integridad (Basado en la Carta Magna)
        # Un valor positivo indica que la geometría se mantiene unida.
        INTEGRITY_THRESHOLD = 0.05
        
        status = "STABLE" if ricci_val > INTEGRITY_THRESHOLD else "COLLAPSE"
        
        # Respuesta JSON estricta para el Agente Jules
        response = {
            "metric": "RICCI_CURVATURE",
            "value": round(ricci_val, 5),
            "integrity": status,
            "device": str(DEVICE),
            "note": "Radical Integrity Check"
        }
        
        print(json.dumps(response))
        
    except Exception as e:
        # En caso de pánico del kernel, reportar error JSON
        error_response = {
            "metric": "RICCI_CURVATURE",
            "value": 0.0,
            "integrity": "ERROR",
            "error": str(e)
        }
        print(json.dumps(error_response))

if __name__ == "__main__":
    measure_pulse()
