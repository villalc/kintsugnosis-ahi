import pytest
import torch
import sys
import os

# Añadir el path del paquete al sistema
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from core.geometry.models.syntergic_model import SintergicGaugeNet
from core.geometry.physics.metrics import unified_integrity_check, GEOMETRIC_EPSILON

def test_topological_integrity_baseline():
    """
    AUDITORÍA DE REALIDAD:
    Verifica que el modelo base (SintergicGaugeNet) mantiene un Gap de Fisher
    por encima del umbral de colapso U(1) en condiciones normales.
    """
    LATTICE_SIZE = 8
    model = SintergicGaugeNet(lattice_size=LATTICE_SIZE, hidden_dim=32, num_classes=10)
    model.eval()
    
    # Simular entrada estándar
    inputs = torch.randn(2, LATTICE_SIZE**2)
    
    # Probamos con el método Ricci (Wasserstein) que es el usado en el "Pulso Diario"
    result = unified_integrity_check(model, inputs, method="ricci")
    
    print(f"\n[CI AUDIT] Gap medido: {result['gap']:.6f} (Umbral: {GEOMETRIC_EPSILON})")
    
    assert result['stable'] is True, (
        f"COLAPSO TOPOLÓGICO DETECTADO: El gap {result['gap']} es inferior al "
        f"umbral de seguridad {GEOMETRIC_EPSILON}. El commit degrada la invarianza del sistema."
    )

def test_geometric_lock_activation():
    """
    VERIFICACIÓN DEL DISYUNTOR:
    Verifica que el sistema detecta correctamente un colapso cuando se le presenta
    un modelo degenerado (pesos en cero).
    """
    LATTICE_SIZE = 8
    model = SintergicGaugeNet(lattice_size=LATTICE_SIZE, hidden_dim=32, num_classes=10)
    
    # Forzar colapso matando los pesos (U(1) trivial approximation)
    with torch.no_grad():
        for param in model.parameters():
            param.zero_()
            
    model.eval()
    inputs = torch.randn(2, LATTICE_SIZE**2)
    
    result = unified_integrity_check(model, inputs, method="ricci")
    
    assert result['stable'] is False, "EL BLOQUEO FALLÓ: Un modelo degenerado (zero weights) no activó la alerta."
    assert result['geometric_lock_status'] == "COLLAPSE"
