from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List
import time
import logging
from malbolge_core.telemetry import TelemetryProvider
from malbolge_core.swarm import SwarmValidator

# Logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("TELEMETRY_API")

app = FastAPI(
    title="AHI Neuromorphic Telemetry API",
    version="1.1.0",
    description="Microservice for Ricci Curvature monitoring and Swarm Consensus"
)

# Initialize Domain Logic
provider = TelemetryProvider(history_limit=100)

# Models
class RicciResponse(BaseModel):
    current: float = Field(..., description="Current Ricci Curvature Index")
    status: str = Field(..., description="System Stability Status")
    timestamp: float = Field(default_factory=time.time)

class HealthResponse(BaseModel):
    status: str
    version: str

class HistoryResponse(BaseModel):
    history: List[float]

class SwarmRequest(BaseModel):
    word: str = Field(..., description="Target semantic concept to validate")
    nodes: int = Field(default=5, ge=1, le=20, description="Number of swarm nodes")

class SwarmResponse(BaseModel):
    target: str
    consensus: str
    stable_nodes: int
    total_nodes: int
    details: List[dict]

# Middleware for Rate Limiting (Simple In-Memory)
request_counts = {}
RATE_LIMIT = 100 # req/min

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    current_time = int(time.time() / 60) # Minute bucket
    key = f"{client_ip}:{current_time}"
    
    count = request_counts.get(key, 0)
    if count >= RATE_LIMIT:
        logger.warning(f"Rate limit exceeded for {client_ip}")
        return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded"})
    
    request_counts[key] = count + 1
    
    # Cleanup old keys (naive)
    if len(request_counts) > 1000:
        request_counts.clear() # Reset occasionally to prevent leak
        
    response = await call_next(request)
    return response

# Endpoints
@app.get("/metrics/ricci", response_model=RicciResponse)
async def get_ricci_metrics():
    try:
        val = provider.current_ricci()
        status = provider.health_status()
        logger.info(f"Ricci Metric Requested: {val} [{status}]")
        return RicciResponse(current=val, status=status)
    except Exception as e:
        logger.error(f"Error calculating Ricci: {e}")
        raise HTTPException(status_code=500, detail="Internal Calculation Error")

@app.get("/metrics/history", response_model=HistoryResponse)
async def get_history():
    return HistoryResponse(history=provider.ricci_history())

@app.post("/swarm/validate", response_model=SwarmResponse)
async def validate_swarm(request: SwarmRequest):
    """
    Executes a distributed swarm trial to validate the stability of a concept (word).
    """
    try:
        logger.info(f"Initiating Swarm Trial for concept: {request.word} with {request.nodes} nodes")
        result = SwarmValidator.validate_distributed(request.word, request.nodes)
        return SwarmResponse(**result)
    except Exception as e:
        logger.error(f"Swarm Validation Failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/metrics/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="healthy", version="1.1.0")

@app.get("/metrics/version")
async def version():
    return {"version": "1.1.0", "engine": "malbolge-core-0.2.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
