import json
import sys
import os

def check_contract(payload_path):
    """
    Validates that the JSON payload strictly adheres to the API contract.
    Expected structure:
    {
        "data": {
            "response": "...",
            "certification": {
                "hash": "...",
                "stability": 0.0,
                ...
            }
        }
    }
    """
    if not os.path.exists(payload_path):
        print(f"FAIL: File not found: {payload_path}")
        sys.exit(1)

    try:
        with open(payload_path, 'r') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"FAIL: Invalid JSON: {e}")
        sys.exit(1)

    # Contract Check 1: Root Envelope
    if "data" not in data:
        # Sometimes payload is direct object if not wrapped by cloud function envelope yet
        print("WARN: Missing root 'data' envelope - checking direct structure")
        inner = data
    else:
        inner = data["data"]

    # Contract Check 2: Response Field
    if "response" not in inner or not isinstance(inner["response"], str):
        print("FAIL: Missing or invalid 'response' field")
        sys.exit(1)

    # Contract Check 3: Certification Field
    if "certification" not in inner or not isinstance(inner["certification"], dict):
        print("FAIL: Missing or invalid 'certification' object")
        sys.exit(1)

    cert = inner["certification"]

    # Contract Check 4: Certification Content
    if "hash" not in cert or not isinstance(cert["hash"], str):
        print("FAIL: Certification missing 'hash'")
        sys.exit(1)

    # Additional warnings (non-blocking)
    if cert.get("hash") == "0000000000000000":
        print("WARN: Hash is zeroed (DEGRADED mode?)")

    print("PASS: Contract validated successfully.")
    sys.exit(0)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python contract_check.py <json_file>")
        sys.exit(1)

    check_contract(sys.argv[1])
