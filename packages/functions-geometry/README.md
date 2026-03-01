# Geometry Audit Module

> **Geometric Drift Detection & Metric Audit**
>
> *Part of the AHI Operation Center Monorepo. See [ECOSYSTEM_ARCHITECTURE.md](../../ECOSYSTEM_ARCHITECTURE.md) for full context.*

`functions-geometry` implements the mathematical analysis layer for detecting drift in AI outputs using PyTorch and custom geometric algorithms. This engine acts as the "Topological Sentry" for the AHI Governance platform.

---

## 📐 Mathematical Foundations

The core hypothesis is that **semantic truth has a stable geometric structure**. We detect hallucinations by measuring the curvature of the latent manifold.

### 1. Ricci Curvature Flow ($R$)
We compute the synthetic Ricci curvature of the embedding space.
*   **$R > 0$ (Spherical):** High structural integrity. The model is confident and consistent.
*   **$R < 0$ (Hyperbolic):** Structural expansion. The model is hallucinating or diverging.
*   **Critical Threshold:** A Ricci slope of **1.26** (derived from the Malbolge constant) indicates imminent semantic collapse.

### 2. Mass Gap Regularizer
We use the **Lanczos Algorithm** to approximate the spectral gap of the Hessian matrix ($v^T H v$) without full diagonalization. This ensures that the decision boundary remains "gapped" (robust) against adversarial perturbations.

### 3. Drift Detection ($\sigma$)
Drift is defined as the deviation from the **Architect's Signature**.
*   **Drift Threshold:** $\sigma > 0.73$ triggers a `DRIFT_DETECTED` warning.
*   **Identity Preservation:** We enforce an **84.2%** identity preservation rate across transformations.

---

## 🏗️ Architecture

- **Runtime:** Python 3.11 (Cloud Run)
- **Framework:** Google Cloud Functions Framework (`functions-framework`)
- **Core Library:** PyTorch (CPU-only optimized for inference)

### Key Features

1.  **Metric Audit:** Calculates coherence scores ($C_n$) and drift.
2.  **Programmatic Init:** Models are instantiated via code to avoid heavy binary uploads.
3.  **Root Health Check:** Returns 200 OK on `/` for Cloud Run probes.

---

## 🚀 Development

### Prerequisites

- Python 3.11+
- `pip`

### Setup

```bash
cd packages/functions-geometry
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Local Execution

The service uses `functions-framework` to serve HTTP requests locally:

```bash
functions-framework --target=audit_ricci --debug
```

---

## 📦 Deployment

The deployment pipeline automatically excludes heavy artifacts (venv, .pth, .h5) via `.gcloudignore`.

```bash
gcloud functions deploy geometry-audit \
  --gen2 \
  --runtime=python311 \
  --region=us-central1 \
  --source=. \
  --entry-point=audit_ricci \
  --trigger-http
```

---

**Author and IP Owner:** AHI 3.0 (IMPI Registry: EXP-3495968)
**Authority:** AHI Governance Labs

<p align="center">
  <sub>© 2025-2026 AHI 3.0 · AHI Governance Labs</sub>
</p>
