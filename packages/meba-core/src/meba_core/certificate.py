"""
MEBA Certification Artifact Generator
Generates the "Certificado de Verdad Estructural" for Omega Certification.

© 2026 AHI Governance Labs
"""

import hashlib
import hmac
import time
import uuid
import os

def calculate_grade(score):
    if score >= 0.95: return "DIAMOND"
    if score >= 0.85: return "PLATINUM"
    if score >= 0.70: return "GOLD"
    if score >= 0.50: return "SILVER"
    return "BRONZE"

def generate_certificate(entity_name: str, meba_score: float, details: dict = None) -> dict:
    """
    Generates a signed certification artifact.
    """
    cert_id = f"OMEGA-{uuid.uuid4().hex[:8].upper()}"
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    grade = calculate_grade(meba_score)

    # Secret key for signature (In prod, use HSM or KMS)
    secret_key = os.environ.get("OMEGA_SIGNING_KEY")
    if not secret_key:
        raise ValueError("Security Error: OMEGA_SIGNING_KEY environment variable is not set.")

    payload_str = f"{cert_id}:{entity_name}:{meba_score}:{timestamp}"
    # Use HMAC-SHA256 for cryptographic integrity
    signature = hmac.new(secret_key.encode(), payload_str.encode(), hashlib.sha256).hexdigest()

    certificate = {
        "certificate_id": cert_id,
        "certification_type": "OMEGA_STRUCTURAL_TRUTH",
        "entity": entity_name,
        "meba_score": round(meba_score, 4),
        "grade": grade,
        "issued_at": timestamp,
        "valid_until": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() + 3600*24*90)), # 90 days
        "details": details or {},
        "signature": signature,
        "issuer": "AHI Governance Labs"
    }

    return certificate

if __name__ == "__main__":
    # Test
    print(generate_certificate("Test Corp", 0.92))
