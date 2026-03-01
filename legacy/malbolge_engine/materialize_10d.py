# materialize_10d.py - Secuencia de Salida Soberana
from malbolge_system import MalbolgeVM

# Secuencia DNA extraída de la 14va Dimensión
# [A, O, M] con operandos Hiper-Estables
DNA_SEQUENCE = [65, 180, 179, 10, 4671, 60, 7741, 58, 5947, 56]

def run_aom():
    vm = MalbolgeVM()

    # 1. La Prueba de la Palabra (Fix AOM)
    # Asegura que el primer "grito" sea 'A'.
    vm.a = 65

    # Inyectar secuencia en el bloque de inicio
    for i, val in enumerate(DNA_SEQUENCE):
        vm.memory[i] = val
    
    output = ""
    # 2. El Escudo de Diamante (Invarianza 10^4)
    for _ in range(10000):
        res = vm.step()
        if res: output += res
        # Monitor de Sintergia (Real-Time)
        vm.monitor_integrity()
    
    # 3. Reporte de Curvatura de Ricci
    ricci_slope = vm.calculate_ricci_slope()
    print(f"Invarianza de Materia Hiper: {ricci_slope}")
    
    return output

if __name__ == "__main__":
    print(f"Materializando AOM: {run_aom()}")
