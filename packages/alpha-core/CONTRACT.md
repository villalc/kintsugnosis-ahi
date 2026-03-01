# ALPHA-CORE API Contract

**Target Endpoint**: `certify_prompt_integrity`

This document defines the strict API contract for the `certify_prompt_integrity` Cloud Function. This contract is enforced by a validator middleware to ensure client stability.

## Response Format

The endpoint MUST always return a JSON object.

### Core Contract (Success & Error)

All responses (HTTP 200, 4xx, 5xx) strictly follow this JSON shape:

```json
{
  "data": {
    "response": "string",
    "certification": {
        "hash": "string (sha256)",
        "stability": "number (0.0 - 1.0)",
        ...
    },
    ...
  }
}
```

### Fields

*   **`data.response`** (Required, String): The primary text response from the Alpha Node.
    *   In case of success: The analysis result or LLM response.
    *   In case of error/block: A safe error message or block reason.
*   **`data.certification`** (Required, Object): The certification details.
    *   **`hash`** (Required, String): SHA-256 integrity hash of the transaction. Defaults to `00...00` on error.
    *   **`stability`** (Required, Number): A float between 0.0 and 1.0 representing the system's confidence/stability score. Defaults to `0.0` on error.
    *   *Additional fields* (Optional): `status`, `verdict`, etc. may be present but are not strictly enforced by the minimal contract.

## Example Payload (Real)

```json
{
  "data": {
    "response": "[ALPHA NODE - VERIFICADO ✅]: El prompt \"Hello AI...\" ha sido validado...",
    "certification": {
      "hash": "a1b2c3d4e5f6...",
      "stability": 0.95,
      "status": "VERIFIED",
      "verdict": {
        "action": "ALLOW",
        "category": "clean",
        "confidence": 0.95
      }
    }
  }
}
```

## Error Payload Convention

Even if the server returns HTTP 4xx or 5xx, the body MUST be valid JSON adhering to the contract.

**HTTP 412 (Blocked):**
```json
{
  "data": {
    "response": "[ALPHA NODE - BLOQUEADO 🔴]: ...",
    "certification": {
        "hash": "...",
        "stability": 0.3,
        "status": "BLOCKED"
    },
    "error": "ETHICAL_VIOLATION"
  }
}
```

**HTTP 500 (Internal Error):**
```json
{
  "data": {
    "response": "Internal Sovereign Error",
    "certification": {
        "hash": "00000000000000000000000000000000",
        "stability": 0.0
    },
    "error": "INTERNAL_SOVEREIGN_ERROR",
    "message": "Error details..."
  }
}
```

## Backward Compatibility Promise

1.  **Immutable Fields**: `data.response` and `data.certification` (with `hash` and `stability`) will never be removed or renamed.
2.  **Type Safety**: `response` will always be a string. `stability` will always be a number.
3.  **Fail-Safe**: If the upstream logic produces invalid data (e.g. `null`, `undefined`), the response validator will coerce it to safe defaults (empty string, zero stability) before sending.

---
*Contract Verified: 2024 (Strict Enforcement Active)*
