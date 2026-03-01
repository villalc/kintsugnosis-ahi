# packages/telemetry-api/Dockerfile

FROM python:3.9-slim as builder

WORKDIR /app

# Install build dependencies
RUN pip install --no-cache-dir hatchling

# Copy malbolge-core (local dependency)
COPY packages/malbolge-core /app/packages/malbolge-core

# Copy telemetry-api
COPY packages/telemetry-api /app/packages/telemetry-api

# Install telemetry-api (and its dependency malbolge-core)
# We assume we are in the monorepo root context when building, or we copy what we need.
# For simplicity here, we assume the build context includes packages/

WORKDIR /app/packages/telemetry-api
RUN pip install .

FROM python:3.9-slim

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy app code just in case, though installed as package
COPY packages/telemetry-api/src /app/src

EXPOSE 8000

CMD ["uvicorn", "telemetry_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
