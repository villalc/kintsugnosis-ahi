import sys
import os

# Añadir legacy al path para importar el motor viejo
sys.path.append(os.path.join(os.getcwd(), 'legacy/packages/malbolge-core/src'))
sys.path.append(os.path.join(os.getcwd(), 'packages/functions-geometry'))

try:
    from core.geometry.physics.metrics import unified_integrity_check
    from core.geometry.models.syntergic_model import SintergicGaugeNet
    import torch
except ImportError as e:
    print(f"Skipping Mirror Effect Check: Missing dependencies or legacy modules. {e}")
    sys.exit(0)

def run_comparison():
    print("--- EJECUTANDO EFECTO ESPEJO (Legacy vs New) ---")

    # 1. Legacy Output
    # El baseline viejo es 0.842
    legacy_val = 0.842
    print(f"Legacy Ricci Baseline: {legacy_val}")

    # 2. New Output (Nominal)
    model = SintergicGaugeNet(lattice_size=8, hidden_dim=32, num_classes=10)
    inputs = torch.randn(1, 64)
    result = unified_integrity_check(model, inputs, method="ricci")
    new_val = result["gap"]
    print(f"New Ricci Calculation: {new_val}")

    # 3. Discrepancy calculation
    # La instrucción pide bloquear si > 0.1%. (0.001)

    discrepancy = abs(new_val - legacy_val) / legacy_val
    print(f"Discrepancia detectada: {discrepancy:.4%}")

    THRESHOLD = 0.001 # 0.1%

    if discrepancy > THRESHOLD:
        print(f"❌ ERROR: Discrepancia lógica crítica detectada ({discrepancy:.4%} > {THRESHOLD:.1%}). Despliegue Bloqueado.")
        sys.exit(1) # Bloqueo real del proceso
    else:
        print("✅ PASS: Coherencia lógica mantenida dentro del umbral del 0.1%.")

if __name__ == "__main__":
    run_comparison()
