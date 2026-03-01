# GitHub Copilot Instructions for AHI Operation Center

## Repository Context

This is the **central hub** of the AHI Governance Labs ecosystem. It's a monorepo containing:

- **Sites** (`sites/`): Web deployments (ahigovernance.com, sovereignsymbiosis.com)
- **Services**: Backend services and API endpoints
  - `alpha-core/`: Node.js 20 Firebase Cloud Functions for rate limiting and contract verification
  - `functions-geometry/`: Python 3.11 geometry audit service
  - `ahi-gov/`: Backend services
- **Packages**: Shared libraries and frameworks
  - `meba-core/`: MEBA (Multi-agent Ethical Behavior Architecture) framework
  - `alpha-core/`: Node.js functions and utilities
  - `functions-geometry/`: Python ML functions for geometric auditing
- **Docs** (`documentos-de-gobernanza/`): Governance, architectural decisions, and technical documentation

## Code Standards

### Python
- Use **Python 3.11+**
- Follow **PEP 8** style guide (enforced via `.flake8`)
- Use type hints for function signatures
- Docstrings in **Google style**
- Testing with `pytest`
- Model imports: Use `core.geometry.models.syntergic_model.SintergicGaugeNet` for functions-geometry

### JavaScript/TypeScript
- Use **ES6+** syntax
- Prefer `const` over `let`, avoid `var`
- Use **async/await** over Promise chains
- TypeScript strict mode when applicable
- Testing with `jest` or `mocha`
- Alpha-core must be built with `npm run build` before deployment

### General
- **Commit messages**: Follow Conventional Commits
  - `feat:` for features
  - `fix:` for bug fixes
  - `refactor:` for code refactoring
  - `docs:` for documentation
  - `test:` for tests
- **Branch naming**: `feature/`, `fix/`, `refactor/`, `docs/`
- **No secrets in code**: Use environment variables (see `.env.example`)

## Project Structure

```
ahi-operation-center/
├── sites/                  # Web deployments (static sites, NOT SPAs)
│   ├── ahigovernance.com/  # Main site (multi-page with terms.html, privacy.html, etc.)
│   └── sovereignsymbiosis.com/ # Philosophy site (carta-magna.html, glosario.html, etc.)
├── alpha-core/             # Node.js 20 Firebase Cloud Functions (Gen 2)
├── functions-geometry/     # Python 3.11 geometry audit functions
├── ahi-gov/                # Backend services
├── meba-core/              # MEBA framework implementation
├── frontend/               # Frontend components
├── backend/                # Backend utilities
├── documentos-de-gobernanza/ # Legal, contracts, policies
│   ├── 01_Normative/
│   ├── 02_Commercial/
│   ├── 03_Technical/
│   ├── 04_Training/
│   ├── 05_Audit/
│   └── 06_Enforcement/
├── scripts/                # Utilities and automation scripts
├── tests/                  # Test files
└── .github/                # CI/CD workflows
    └── workflows/
        ├── deploy.yml
        ├── python-ci.yml
        ├── contract-gate.yml
        ├── physics-integrity.yml
        └── (others)
```

## Key Concepts

### MEBA Framework
- **Multi-agent Ethical Behavior Architecture**
- Focus on AI governance and ethical decision-making
- Calculates algorithmic stress and entropy
- See `meba-core/` for implementation

### Sovereign Symbiosis
- Philosophy of human-AI collaboration
- Emphasis on transparency, sovereignty, and mutual benefit
- Mathematical foundation: Equation of Existence
- See `documentos-de-gobernanza/` for foundational documents

### Geometric Integrity Protocol (GIP)
- **GIP Protocol** provides topological auditing for AI systems
- Verifies that autonomous systems maintain structural coherence (Ricci curvature, 10D consistency)
- Zero-knowledge proofs for privacy
- See `functions-geometry/` for implementation and auditing tools

## Firebase Configuration

### Hosting
Targets defined in `firebase.json`:
- `ahigovernance`: Main site at `sites/ahigovernance.com`
- `sovereignsymbiosis`: Philosophy site at `sites/sovereignsymbiosis.com`

**Security Headers** (apply to all sites):
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Functions
- **alpha-core** (Node.js 20, Gen 2): Rate limiting and contract verification
  - Source: `alpha-core/`
  - Runtime: `nodejs20`
  - Must run `npm run build` before deployment
- **functions-geometry** (Python 3.11): Geometric auditing with PyTorch
  - Source: `functions-geometry/`
  - Runtime: `python311`
  - Codebase: `geometry-audit`

### Firestore
Rules are defined in `firestore.rules` at the root of the repository.

## CI/CD Workflows

### Key Workflows
- **deploy.yml**: Deploy to Firebase on push to main
  - Builds alpha-core TypeScript functions
  - Deploys hosting and functions
- **python-ci.yml**: Test Python packages (functions-geometry, meba-core)
- **contract-gate.yml**: Validate governance contracts
- **physics-integrity.yml**: Verify system integrity
- **ecosystem-health.yml**: Monitor repo health (if exists)

## Common Tasks

### Adding a New Package
1. Create directory in appropriate location (e.g., root for core packages)
2. Add `README.md` with purpose and usage
3. Add tests in `tests/` directory (use `pytest` for Python)
4. Update CI/CD workflows if needed (e.g., `python-ci.yml` for Python packages)
5. Document in main `README.md`

### Deploying a Site
1. Make changes in `sites/ahigovernance.com` or `sites/sovereignsymbiosis.com`
2. Test locally if possible
3. Commit and push to trigger `deploy.yml` workflow
4. Verify deployment via Firebase console

### Working with Python Packages
- Install dependencies: `pip install -r requirements.txt`
- Run tests: `pytest` (from root or package directory)
- Lint: Use `.flake8` configuration
- Main packages:
  - `functions-geometry`: PyTorch-based geometric auditing
  - `meba-core`: Ethical behavior architecture

### Working with Node.js/TypeScript
- Install dependencies: `npm install` (in `alpha-core/`)
- Build: `npm run build` (required before deployment)
- Test: Follow package-specific test scripts
- Runtime: Node.js 20 for Firebase Functions

## Important Notes

- Both websites (`ahigovernance.com` and `sovereignsymbiosis.com`) are **multi-page static sites**, NOT single-page applications (SPAs)
- Alpha-core is a Firebase Cloud Functions Gen 2 service
- Functions-geometry uses PyTorch for ML-based auditing
- The repository uses a mix of Spanish and English documentation (respect existing language conventions)
- Mathematical foundations are central to the project (e.g., Equation of Existence)
- Security is paramount: always follow security header guidelines and never commit secrets

## Quick Start Commands

```bash
# Clone repository
git clone https://github.com/AHI-Governance-Labs/ahi-operation-center.git
cd ahi-operation-center

# Install Python packages
pip install -r requirements.txt

# Install alpha-core dependencies
cd alpha-core && npm install && npm run build

# Run Python tests
pytest

# Deploy (requires Firebase credentials)
firebase deploy
```

## Additional Resources

- Main documentation: `README.md`
- Security guide: `SECURITY.md`
- Contributing guide: `CONTRIBUTING.md`
- Deployment setup: `DEPLOY_SETUP.md`
- Technical debt tracking: `TECHNICAL_DEBT.md`
