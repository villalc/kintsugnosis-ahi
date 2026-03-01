# Security Policy — AHI Operation Center

---

## 1. Scope

This security policy applies to all components in the AHI Operation Center repository:

| Component | Scope |
|-----------|-------|
| **packages/alpha-core/** | Alpha Engine (Node.js) |
| **packages/meba-core/** | MEBA Calculator implementation |
| **packages/functions-geometry/** | Geometric Integrity Protocol (GIP) implementation |
| **ahi-unified-platform/** | Unified Next.js governance platform |
| **dataconnect/** | Firebase Data Connect (PostgreSQL) configuration |

---

## 2. Reporting Vulnerabilities

### Private Disclosure Required

All security vulnerabilities **MUST** be reported privately.

**Do NOT:**
- Open public GitHub issues
- Publish proof-of-concept exploits
- Share vulnerability details publicly

### Contact

| Method | Details |
|--------|---------|
| **Email** | enterprise@ahigovernance.com |
| **Subject** | `[SECURITY] Vulnerability Disclosure` |

### Required Information

A valid security report must include:

1. **Description** — Clear explanation of the vulnerability
2. **Component** — Affected repository component and version
3. **Reproduction** — Steps to reproduce (keep confidential)
4. **Impact** — Assessment of potential impact

---

## 3. Security Considerations

### Python Components (meba-core, functions-geometry)

- No external network calls (unless explicitly required for auditing)
- No persistent storage of sensitive data
- Deterministic, reproducible execution

### Alpha Engine (alpha-core)

- Fail-closed security model
- Strict API contract enforcement
- Sanitized error responses (no raw error messages)

### Unified Platform (ahi-unified-platform)

- Next.js 16 / React 19 architecture
- Server-side rendering with strict CSP
- Minimum client-side state

### Persistence Layer (dataconnect)

- GraphQL-based PostgreSQL access
- No direct database access from untrusted clients

---

## 4. Response Timeline

| Phase | Timeline |
|-------|----------|
| Acknowledgment | Within 72 hours |
| Initial Assessment | Within 7 days |
| Resolution | Dependent on severity |

---

## 5. Dependencies

This project uses minimal dependencies:

| Dependency | Purpose | Security Notes |
|------------|---------|----------------|
| **numpy** | Numerical computations | Well-maintained, secure |
| **torch** | Geometric tensor calculations | Well-maintained, secure |
| **pytest** | Testing (dev only) | Not in production |

---

## 6. Supported Versions

| Version | Supported |
|---------|-----------|
| main branch | ✅ Yes |
| Other branches | ❌ No |

---

## Legal Notice

This policy does **not** grant permission to:

- Perform unauthorized testing on production systems
- Access customer environments
- Disclose vulnerabilities without coordination

---

**Document Version:** 1.0
**Authority:** AHI Governance Labs
