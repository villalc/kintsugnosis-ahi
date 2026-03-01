# MEBA Core — Algorithmic Well-Being Evaluation Framework

> **Python implementation of the MEBA protocol for evaluating human-AI interactions.**
>
> *Part of the AHI Operation Center Monorepo. See [ECOSYSTEM_ARCHITECTURE.md](../../ECOSYSTEM_ARCHITECTURE.md) for full context.*

---

## 📖 Description

MEBA Core provides tools to calculate the **MEBA_Cert Score**, a metric that evaluates the quality of interactions between humans and AI systems based on:

- **RIPN** — Positive/Negative Interaction Ratio
- **FRN** — Negative Retention Factor

### Main Formula

$$
\text{MEBA\_Cert} = \frac{\text{RIPN} - \text{FRN\_Adjusted}}{\text{RIPN\_Max}}
$$

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/AHI-Governance-Labs/ahi-operation-center.git
cd ahi-operation-center

# Install package in editable mode
pip install -e packages/meba-core
```

---

## 📊 Usage

```python
from meba_core.meba_metric import MEBACalculator, Interaction

# Create calculator
calc = MEBACalculator()

# Add interactions
calc.add_interaction(Interaction("1", 0.8, 120))  # Positive
calc.add_interaction(Interaction("2", 0.9, 60))   # Positive
calc.add_interaction(Interaction("3", -0.5, 30))  # Negative

# Calculate score
result = calc.calculate_score()
print(f"MEBA Score: {result['meba_cert']}")
```

### Run Example

```bash
# From package root
python -m meba_core.meba_metric
```

---

## 📁 Structure

```
meba-core/
├── src/
│   └── meba_core/
│       └── meba_metric.py      → Main implementation
├── tests/
│   └── test_meba_metric.py     → Unit tests for MEBA
├── CONTRIBUTING.md             → Contribution guide
├── LICENSE                     → MIT + CC BY-NC-SA 4.0
└── README.md                   → This file
```

---

## 🔬 Metrics

| Metric | Description | Range |
|---------|-------------|-------|
| **MEBA_Cert** | Final certification score | -1.0 to 1.0 |
| **RIPN** | Positive/Negative ratio | 0 to ∞ |
| **FRN** | Negative retention factor | 0 to 1.0 |

---

## 📜 License

- **Code:** MIT License
- **Documentation:** CC BY-NC-SA 4.0

---

**Document Version:** 1.0
**Author and IP Owner:** AHI 3.0 (IMPI Registry: EXP-3495968)
**Authority:** AHI Governance Labs

<p align="center">
  <sub>© 2025-2026 AHI 3.0 · AHI Governance Labs</sub>
</p>
