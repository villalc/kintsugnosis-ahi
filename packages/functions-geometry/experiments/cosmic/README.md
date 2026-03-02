# CosmicPhysicsEngine-3D — Experimentos

Módulo de simulación cosmológica para el ecosistema AHI.
Implementa un campo escalar φ ∈ [0,1] en un universo 3D en expansión.

## Uso rápido

```bash
python main.py --steps 1000 --size 32 --hubble 0.0001 --temp 0.1
```

## Parámetros

| Argumento | Default | Descripción |
|---|---|---|
| `--steps` | 500 | Pasos de simulación |
| `--size` | 32 | Lado del grid cúbico (N³ celdas) |
| `--hubble` | 1e-4 | Parámetro de Hubble H |
| `--temp` | 0.1 | Temperatura inicial T₀ |
| `--out` | cosmic_log.jsonl | Archivo de salida |
| `--seed` | None | Semilla aleatoria |

## Física implementada

- **Difusión**: `∂u/∂t = (0.05/a²) ∇²u` — Klein-Gordon sin masa
- **Expansión**: `a(t) = 1 + H·t` — cosmología FRW lineal
- **Dilución**: `u *= 1/(1+3H)` — materia: ρ ∝ a⁻³  
- **Temperatura**: `T(t) = T₀/a(t)` — enfriamiento cosmológico
- **Curvatura**: `R = e²ᵘ(4∇²u − 2|∇u|²)` — métrica conforme
- **Energía libre**: `F = E − T·S`

## Regímenes dinámicos (validado: 32³, 1000 pasos)

| Régimen | Pasos | Descripción |
|---|---|---|
| I — Colapso | 0→10 | Campo aleatorio → suave (ΔF = −7239) |
| II — Atractor | 10→260 | Convergencia exponencial τ ≈ 28 pasos hacia F∞ ≈ −1100 |
| III — Deriva | 260→999 | Expansión diluye materia, F sube +0.058/paso |

## Archivos

- `cosmic_engine.py` — Motor principal (3D, continuo, termodinámico)
- `cosmic_persistence.py` — Serialización JSONL
- `main.py` — Runner con CLI
- `physics_engine.py` — Legacy 2D (solo referencia)
- `persistence.py` — Legacy 2D (solo referencia)
