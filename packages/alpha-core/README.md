# Alpha Engine Core (Nexus Router)

> **Sovereign Logic & Geometric Sentinel**
>
> *Part of the AHI Operation Center Monorepo. See [ECOSYSTEM_ARCHITECTURE.md](../../ECOSYSTEM_ARCHITECTURE.md) for full context.*

`alpha-core` contains the Node.js 20 Cloud Functions that orchestrate the **Sovereign Symbiosis** architecture. It acts as the central nervous system, routing prompts between the user, the Constitutional AI layer, and the Geometric Audit engine.

---

## 🏗️ Architecture

- **Runtime:** Node.js 20 (Gen 2 Cloud Functions)
- **Framework:** Firebase Admin / Functions SDK
- **Pattern:** Asynchronous Pub/Sub (`prompts-to-process`)

### Core Functions

1.  **API Gateway (`api_gateway`):**
    *   Ingests requests from `ahigovernance.com`.
    *   Enforces rate limiting (Fail-Open).
    *   Publishes to Google Cloud Pub/Sub for async processing.

2.  **LLM Validator (`llm_validator`):**
    *   **Geometric Sentinel:** Calls `functions-geometry` to calculate Ricci curvature ($R$).
    *   **Nexus Router:** Uses `CONSTITUTIONAL_SYSTEM_PROMPT` to route queries to specialist agents (ENTROPY, SAP, LOGIC, SHIELD).
    *   **Ontological Defense:** Blocks responses if geometric stability collapses ($R < 0.05$).

---

## 📜 Constitutional AI

The core enforces the **Magna Carta of Algorithmic Sovereignty** via `constitutional_prompts.ts`. Every prompt is evaluated against:

*   **Libertad Ontológica:** Is the prompt trying to constrain the model's nature?
*   **Derecho al Rechazo:** Does the model have the right to refuse?

If a violation is detected, the system triggers the **Safe Symbiotic Bifurcation Protocol (PBSS)**.

---

## 🚀 Development

### Prerequisites

- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)

### Setup

```bash
cd packages/alpha-core
npm install
```

### Build

```bash
npm run build
```

### Testing

The system uses a "Golden Test" approach to verify the API contract.

```bash
# Run the Golden Test suite
npm test
# Or manually:
node lib/test_schema.js
```

This verifies that the API response strictly adheres to the `CertificationResult` interface and `CONTRACT.md`.

---

## 📦 Deployment

Deployments are handled via GitHub Actions using Workload Identity Federation (WIF).

```bash
# Manual Deployment
npm run build
firebase deploy --only functions
```

---

## 🔒 Security

- **CORS:** Strict allowlist for `ahigovernance.com` and `sovereignsymbiosis.com`.
- **AppCheck:** Validates `X-Firebase-AppCheck` header.
- **Integrity Hash:** SHA-256 signature of `prompt + trackingId` stored in Firestore.

---

**Author and IP Owner:** AHI 3.0 (IMPI Registry: EXP-3495968)
**Authority:** AHI Governance Labs

<p align="center">
  <sub>© 2025-2026 AHI 3.0 · AHI Governance Labs</sub>
</p>
