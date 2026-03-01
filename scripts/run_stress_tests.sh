#!/bin/bash
# AHI Operation Center - Stress Test Automation Flow
# Periodicity: Recommended every 3 days or after structural changes.

set -euo pipefail

GEOMETRY_PID=""
ALPHA_PID=""

cleanup() {
    echo "Cleaning up services..."
    [ -n "$GEOMETRY_PID" ] && kill "$GEOMETRY_PID" 2>/dev/null || true
    [ -n "$ALPHA_PID" ] && kill "$ALPHA_PID" 2>/dev/null || true
}
trap cleanup EXIT INT

echo "--- 🚀 Starting AHI Stress Test Suite ---"

# Require nc (netcat) for service readiness checks
command -v nc >/dev/null 2>&1 || { echo "ERROR: 'nc' (netcat) is required but not found. Please install it."; exit 1; }

# 1. Setup Environment
export INTERNAL_API_KEY="test-internal-key"
export OMEGA_SIGNING_KEY="test-omega-key"

# Wait for a TCP port to accept connections, failing hard if not ready in time.
# Usage: wait_for_service <name> <host> <port> [timeout_seconds]
wait_for_service() {
  local name="$1"
  local host="$2"
  local port="$3"
  local timeout="${4:-30}"
  local elapsed=0
  echo "Waiting for ${name} on ${host}:${port} (timeout: ${timeout}s)..."
  until nc -z "$host" "$port" 2>/dev/null; do
    if [ "$elapsed" -ge "$timeout" ]; then
      echo "ERROR: ${name} did not become ready within ${timeout}s. Aborting."
      [ -n "$GEOMETRY_PID" ] && kill "$GEOMETRY_PID" 2>/dev/null || true
      [ -n "$ALPHA_PID" ]    && kill "$ALPHA_PID"    2>/dev/null || true
      exit 1
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done
  echo "${name} is ready (${elapsed}s)."
}

# 2. Start Services in Background
echo "Starting Geometry Service..."
cd packages/functions-geometry
functions-framework --target audit_ricci --port 5002 &
GEOMETRY_PID=$!
cd ../..

echo "Starting Alpha Core Stress Server..."
cd packages/alpha-core
# Build if necessary
npm run build
node lib/stress_server.js &
ALPHA_PID=$!
cd ../..

wait_for_service "Geometry Service"         localhost 5002
wait_for_service "Alpha Core Stress Server" localhost 5001

# 3. Run Stress Tests
echo "--- Running Stress Tests ---"

echo "[Test 1/3] Alpha Core Gateway..."
python3 packages/scripts/stress_tests/test_alpha_gateway.py

echo "[Test 2/3] Geometry Ricci Engine..."
python3 packages/scripts/stress_tests/test_geometry_ricci.py

echo "[Test 3/3] MEBA Certification..."
python3 packages/meba-core/benchmark_meba.py

echo "--- ✅ Stress Test Suite Completed ---"
echo "Metrics have been gathered. Please update stress_test_report.md with the latest results."
