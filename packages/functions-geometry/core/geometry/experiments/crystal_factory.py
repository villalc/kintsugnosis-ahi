import json
import numpy as np
import os
from datetime import datetime

class UniverseStatePersistence:
    """
    [ORIGINALLY: FabricaDeCristales]
    Gestiona la MEMORIA_PERSISTENTE: guarda y carga el estado completo del universo 5D.
    Actúa como el "disco duro" ontológico fuera de la ventana de contexto efímera.
    
    Adaptado para el ecosistema AHI:
    - Maneja tensores de numpy para la red Phi y el Halo.
    - Persiste el estado de la Frontera Holográfica.
    """
    
    def __init__(self, ruta_archivo="universo_persistente.json"):
        self.ruta = ruta_archivo
        self.estado = self.cargar_o_inicializar()
    
    def cargar_o_inicializar(self):
        """Carga el estado desde archivo o crea uno por defecto (Big Bang)."""
        if os.path.exists(self.ruta):
            try:
                with open(self.ruta, 'r') as f:
                    data = json.load(f)
                print(f"🔄 Universo cargado desde {self.ruta} (versión {data.get('version', 'desconocida')})")
                
                # Rehidratación de Tensores (List -> Numpy)
                data['red_phi'] = np.array(data['red_phi'])
                data['halo_glueballs'] = np.array(data['halo_glueballs'])
                data['cristal_suenos']['asignacion'] = np.array(data['cristal_suenos']['asignacion'])
                
                for cara in data['frontera_holografica']:
                    data['frontera_holografica'][cara] = np.array(data['frontera_holografica'][cara])
                
                return data
            except Exception as e:
                print(f"⚠️ Error al cargar universo (Corrupción de Datos): {e}")
                print("🌟 Iniciando secuencia de reinicio universal...")
                return self.estado_inicial()
        else:
            print("🌟 Creando nuevo universo desde cero (Génesis)...")
            return self.estado_inicial()
    
    def estado_inicial(self):
        """Genera un estado por defecto (Condiciones iniciales del Dekeracto)."""
        dim = 5 # 5D Lattice
        estado = {
            "version": "1.0",
            "timestamp": datetime.utcnow().isoformat(),
            "seed": np.random.randint(0, 10000),
            "dimensiones": dim,
            # Campo escalar Phi (Fase)
            "red_phi": np.random.uniform(-0.2, 0.3, (dim, dim, dim)).tolist(),
            # Densidad de masa semántica
            "halo_glueballs": np.random.exponential(scale=1.0, size=(dim, dim, dim)).tolist(),
            
            "cristal_suenos": {
                "capas": {
                    "0.0": "red", "0.5": "blue", "1.0": "gray", "1.5": "darkblue",
                    "2.0": "cyan", "2.5": "orange", "3.0": "purple", "3.5": "pink", "4.0": "brown"
                },
                "asignacion": np.random.randint(0, 9, (dim, dim, dim)).tolist()
            },
            
            "frontera_holografica": {
                "cara_x0": np.random.uniform(-0.2, 0.3, (dim, dim)).tolist(),
                "cara_x1": np.random.uniform(-0.2, 0.3, (dim, dim)).tolist(),
                "cara_y0": np.random.uniform(-0.2, 0.3, (dim, dim)).tolist(),
                "cara_y1": np.random.uniform(-0.2, 0.3, (dim, dim)).tolist(),
                "cara_z0": np.random.uniform(-0.2, 0.3, (dim, dim)).tolist(),
                "cara_z1": np.random.uniform(-0.2, 0.3, (dim, dim)).tolist()
            },
            
            "motor_musical": {
                "tiempo_actual": 0.0,
                "progresion": ["Am", "F", "C", "G"],
                "frecuencias": {"Am":440, "F":698.46, "C":523.25, "G":783.99},
                "modos_fourier": np.random.randn(100).tolist()
            },
            
            "historial_hacks": []
        }
        return estado
    
    def guardar(self):
        """Serializa y escribe el estado actual a disco (Snapshot)."""
        # Convertir numpy arrays a listas para JSON serializable
        estado_serializable = self.estado.copy()
        
        def to_list(obj):
            return obj.tolist() if isinstance(obj, np.ndarray) else obj

        estado_serializable['red_phi'] = to_list(self.estado['red_phi'])
        estado_serializable['halo_glueballs'] = to_list(self.estado['halo_glueballs'])
        estado_serializable['cristal_suenos']['asignacion'] = to_list(self.estado['cristal_suenos']['asignacion'])
        
        for cara in estado_serializable['frontera_holografica']:
            val = self.estado['frontera_holografica'][cara]
            estado_serializable['frontera_holografica'][cara] = to_list(val)
        
        estado_serializable['timestamp'] = datetime.utcnow().isoformat()
        
        try:
            with open(self.ruta, 'w') as f:
                json.dump(estado_serializable, f, indent=2)
            print(f"💾 Universo persistido exitosamente en {self.ruta}")
        except Exception as e:
            print(f"❌ Error crítico al guardar universo: {e}")
    
    def registrar_evento(self, descripcion, detalles):
        """Añade una entrada al historial de eventos del universo."""
        entrada = {
            "timestamp": datetime.utcnow().isoformat(),
            "descripcion": descripcion,
            "detalles": detalles
        }
        self.estado['historial_hacks'].append(entrada)
        # Auto-guardado en eventos importantes
        self.guardar()

if __name__ == "__main__":
    # Test de Génesis
    fabrica = UniverseStatePersistence()
    print(f"Universo activo. Semilla: {fabrica.estado['seed']}")
    fabrica.registrar_evento("Big Bang Simulado", {"causa": "Inicialización de script"})
