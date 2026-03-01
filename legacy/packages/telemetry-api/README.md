# Telemetry API (Microservice)

FastAPI-based microservice exposing Malbolge Core metrics via REST.

## Endpoints
- `GET /metrics/ricci`: Returns current curvature and status.
- `GET /metrics/history`: Returns last N measurements.
- `GET /metrics/health`: Health check.
- `GET /metrics/version`: Service version.

## Architecture
- **Layer 2**: Interface Layer.
- **Dependencies**: `malbolge-core` (Layer 1).
- **Security**: Rate Limiting (100 req/min).

## Running
```bash
uvicorn telemetry_api.main:app --reload
```

## Docker
```bash
docker build -t telemetry-api .
docker run -p 8000:8000 telemetry-api
```
