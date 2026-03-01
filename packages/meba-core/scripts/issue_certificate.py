#!/usr/bin/env python3
import sys
import os

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from meba_core.certificate import generate_certificate
import argparse
import json

def main():
    parser = argparse.ArgumentParser(description="Issue an OMEGA Structural Truth Certificate")
    parser.add_argument("entity", help="Entity Name")
    parser.add_argument("score", type=float, help="MEBA Score (0.0 - 1.0)")
    parser.add_argument("--key", help="HMAC Signing Key", default=os.environ.get("OMEGA_SIGNING_KEY"))

    args = parser.parse_args()

    if not args.key:
        print("Error: Signing key required. Set OMEGA_SIGNING_KEY or use --key")
        sys.exit(1)

    # Set env var for internal function to pick up
    os.environ["OMEGA_SIGNING_KEY"] = args.key

    try:
        cert = generate_certificate(args.entity, args.score)
        print(json.dumps(cert, indent=2))
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
