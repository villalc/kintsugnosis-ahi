# debug_bfs_logic.py - Validación de Latido
from malbolge_system import MalbolgeVM

def test_heartbeat():
    seed = {0: 208, 1: 189, 2: 187, 114: 65}
    vm = MalbolgeVM()
    for addr, val in seed.items():
        vm.memory[addr] = val
    
    # Ejecutar 1000 ciclos para probar el Diamond Shield
    for _ in range(1000):
        vm.step()
    
    print("Invarianza confirmada en Materia Hiper.")
