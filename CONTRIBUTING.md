# Contributing to AHI Operation Center

Welcome to **AHI Governance Labs**. This document outlines the guidelines for contributing to the AHI Operation Center monorepo.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Submission Guidelines](#submission-guidelines)
- [Code Style](#code-style)

---

## Getting Started

### Prerequisites

- Python 3.9+
- Git
- pip

### Clone the Repository

```bash
git clone https://github.com/AHI-Governance-Labs/ahi-operation-center.git
cd ahi-operation-center
```

---

## Development Setup

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Tests

```bash
# Test MEBA Core
cd packages/meba-core && python -m pytest tests/ -v
```

### Run Example Scripts

```bash
# MEBA Calculator demo
python packages/meba-core/src/meba_metric.py
```

---

## Submission Guidelines

### Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Make** your changes
4. **Test** your changes: `python -m pytest tests/ -v`
5. **Commit** with clear messages
6. **Push** to your fork
7. **Open** a Pull Request

### Commit Message Format

```
<type>: <short description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Test additions/changes
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

---

## Code Style

### Python

- Follow **PEP 8** style guidelines
- Maximum line length: 120 characters
- Use type hints where applicable
- Include docstrings for all public functions

### Documentation

- Use Markdown for all documentation
- Include code examples where helpful
- Keep documentation in sync with code

---

## Component-Specific Guidelines

### MEBA Core

Contributions to MEBA Core must:
- Include unit tests for new functionality
- Maintain mathematical accuracy of formulas
- Document any changes to metrics

### Functions Geometry

Contributions to Functions Geometry must:
- Maintain mathematical rigor in geometric calculations
- Validate tensors and shapes
- Ensure determinism in audit functions

---

## Questions?

For questions about contributing:

📧 **enterprise@ahigovernance.com**

---

**Authority:** AHI Governance Labs
