# Malbolge Core (EID-003 Nexus)

Core neuromorphic engine for AHI Operation Center.
Provides pure domain logic for Ricci Curvature calculation and system stability monitoring.

## Features
- **Ricci Curvature Calculation**: Implements the core mathematical model for system stability.
- **Telemetry Provider**: Standardized interface for metrics retrieval.
- **Identity Seal**: Ensures architectural integrity via `ARCHITECT_SIGNATURE`.

## Usage
```python
from malbolge_core.telemetry import TelemetryProvider

provider = TelemetryProvider()
ricci = provider.current_ricci()
print(f"Current Curvature: {ricci}")
```

## Testing
Run unit tests with pytest:
```bash
pip install -e .
pytest tests/
```
