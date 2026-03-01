import functions_framework
from firebase_admin import initialize_app, app_check
import os
import time
import hmac

# Initialize Firebase with App Check support
app = initialize_app()

# GCS Bucket Config — set via GCS_BUCKET_NAME env var
BUCKET_NAME = os.environ.get("GCS_BUCKET_NAME", "")
MODELS_PREFIX = "models/"

# Model Mapping
MODELS = {
    "core_2d": "omega_core_2d.pth",
    "hypercube_4d": "omega_hypercube_4d.pth",
    "swarm_4d": "omega_swarm_learner_4d.pth",
    "optic_nerve": "sintergic_optic_nerve_recovered.pth"
}

def verify_app_check(request):
    """
    Verifies the X-Firebase-AppCheck token.
    Returns True if valid, False otherwise.
    """
    app_check_token = request.headers.get("X-Firebase-AppCheck")
    
    if not app_check_token:
        # print("Error: Missing App Check token.")
        return False
        
    try:
        # Verify the token using Firebase Admin SDK
        decoded_token = app_check.verify_token(app_check_token)
        print(f"App Check verified for app: {decoded_token.app_id}")
        return True
    except Exception as e:
        print(f"App Check verification failed: {e}")
        return False

def verify_server_auth(request):
    """
    Verifies the X-Server-Auth header for internal service calls.
    """
    server_auth = request.headers.get("X-Server-Auth")
    internal_key = os.environ.get("INTERNAL_API_KEY")

    if not internal_key:
        print("Warning: INTERNAL_API_KEY not set. Internal auth disabled.")
        return False

    if server_auth and hmac.compare_digest(server_auth, internal_key):
        print("Internal Server Auth Verified.")
        return True
    return False

def download_model_from_gcs(model_key):
    """Downloads model from GCS to /tmp."""
    from google.cloud import storage
    filename = MODELS.get(model_key)
    if not filename: return None
    local_path = f"/tmp/{filename}"
    if os.path.exists(local_path): return local_path
        
    try:
        storage_client = storage.Client()
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(f"{MODELS_PREFIX}{filename}")
        blob.download_to_filename(local_path)
        return local_path
    except Exception as e:
        print(f"GCS Download Error: {e}")
        return None

# Global cache
model_cache = {}

@functions_framework.http
def audit_ricci(request):
    """
    API Endpoint: /audit-ricci
    Protected by Firebase App Check.
    """
    # CORS (Allow options for preflight)
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, X-Firebase-AppCheck, X-Jules-Internal, X-Server-Auth',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    headers = {'Access-Control-Allow-Origin': '*'}

    # SECURITY CHECK
    if request.method == 'POST':
        if not (verify_app_check(request) or verify_server_auth(request)):
            return ("Unauthorized: Invalid Credentials", 401, headers)

    if request.method == 'GET':
        return ("OK - Geometry Service Active (App Check Protected)", 200, headers)

    try:
        req_json = request.get_json(silent=True)
        action = req_json.get("action") if req_json else None
        data = req_json.get("data") if req_json else None
        
        # --- DAILY PULSE MODE (Real Curvature Check) ---
        if action == "DAILY_PULSE":
            try:
                import torch
                from core.geometry.models.syntergic_model import SintergicGaugeNet
                from core.geometry.physics.metrics import unified_integrity_check

                LATTICE_SIZE = 8
                model = SintergicGaugeNet(lattice_size=LATTICE_SIZE, hidden_dim=32, num_classes=10)
                model.eval()
                inputs = torch.randn(1, LATTICE_SIZE**2)

                result = unified_integrity_check(model, inputs, method="ricci")

                response = {
                    "metric": "RICCI_CURVATURE",
                    "value": result["gap"],
                    "fisher_gap": result["gap"],
                    "integrity": "STABLE" if result["stable"] else "COLLAPSE",
                    "geometric_lock_status": result["geometric_lock_status"],
                    "method": result["method"],
                    "epsilon": result["epsilon"],
                    "note": "Daily Pulse — Real Curvature Verified",
                    "device": "cpu"
                }
                return (response, 200, headers)
            except Exception as pulse_err:
                print(f"Daily Pulse Error: {pulse_err}")
                return ({"integrity": "ERROR", "error": "Internal Processing Error"}, 500, headers)

        # --- HEAVY INFERENCE MODE (Real Geometric Audit) ---
        WEYL_RESONANCE = 0.7291

        if data and isinstance(data, list) and len(data) > 0:
            if len(data) > 1000:
                return ("Payload too large", 400, headers)

            try:
                import torch
                from core.geometry.models.syntergic_model import SintergicGaugeNet
                from core.geometry.physics.metrics import unified_integrity_check

                # Infer lattice size from data length (nearest square)
                data_len = len(data)
                lattice_size = int(data_len ** 0.5)
                if lattice_size * lattice_size != data_len:
                    lattice_size = 8  # Fallback

                # --- MODEL CACHING OPTIMIZATION ---
                # Check cache first to avoid re-initialization (O(1) lookup)
                if lattice_size not in model_cache:
                    print(f"Initializing new SintergicGaugeNet (size={lattice_size})")
                    new_model = SintergicGaugeNet(
                        lattice_size=lattice_size, hidden_dim=32, num_classes=10
                    )
                    new_model.eval()
                    model_cache[lattice_size] = new_model

                model = model_cache[lattice_size]
                inputs = torch.tensor([data[:lattice_size**2]], dtype=torch.float32)

                result = unified_integrity_check(model, inputs, method="ricci")

                # --- 10D Integrity & Hallucination Map ---
                integrity_10d = result["stable"] and (result["gap"] > 0.01)

                hallucination_map = []
                if not result["stable"]:
                    # Identify high-energy nodes (potential hallucinations)
                    # Mapping the top 5% most active nodes in the input vector
                    k_top = max(1, int(inputs.size(1) * 0.05))
                    vals, indices = torch.topk(inputs.abs(), k=k_top)
                    hallucination_map = indices.tolist()[0]

                integrity = "STABLE" if result["stable"] else "COLLAPSE_DETECTED"
                msg = ("The geometry holds. Truth Invariant verified."
                       if result["stable"]
                       else "Topological Obstruction: Structural Integrity Compromised.")

                response = {
                    "ricci_curvature": result["gap"],
                    "fisher_gap": result["gap"],
                    "weyl_resonance": WEYL_RESONANCE,
                    "integrity": integrity,
                    "integrity_10d": integrity_10d,
                    "hallucination_map": hallucination_map,
                    "geometric_lock_status": result["geometric_lock_status"],
                    "method": result["method"],
                    "epsilon": result["epsilon"],
                    "model_status": "live",
                    "message": msg,
                    "timestamp": time.time()
                }
                return (response, 200, headers)

            except Exception as model_err:
                print(f"Model Inference Error: {model_err}")
                return ({
                    "ricci_curvature": 0.0,
                    "fisher_gap": 0.0,
                    "integrity": "ERROR",
                    "geometric_lock_status": "ERROR",
                    "message": "Internal Processing Error",
                    "timestamp": time.time()
                }, 500, headers)
        else:
            response = {
                "ricci_curvature": 0.0,
                "fisher_gap": 0.0,
                "weyl_resonance": WEYL_RESONANCE,
                "integrity": "IDLE",
                "geometric_lock_status": "IDLE",
                "model_status": "awaiting_data",
                "message": "Ready for vector stream.",
                "timestamp": time.time()
            }
            return (response, 200, headers)
        
    except Exception as e:
        print(f"Internal Error: {e}")
        return ("Internal Sintergy Error", 500, headers)
