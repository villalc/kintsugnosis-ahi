# Sentinel's Journal

## 2026-01-22 - Static Site Reverse Tabnabbing
**Vulnerability:** Multiple `target="_blank"` links in static HTML files lacked `rel="noopener noreferrer"`.
**Learning:** Static sites often bypass security scanning pipelines focused on backend code (Python/JS). Developers copy-paste links without security attributes.
**Prevention:** Use a linter (like `HTMLHint` or `eslint-plugin-html`) or a pre-commit hook to scan for `target="_blank"` without `rel="noopener"`.

## 2026-02-14 - Path Traversal in File Output Methods
**Vulnerability:** Methods accepting `output_path` (e.g., `generate_certificate`) allowed writing to arbitrary system paths via `../` traversal, lacking validation against CWD.
**Learning:** `os.path.commonpath` is the robust way to check path containment, better than `startswith()`. Test suites using `tempfile.NamedTemporaryFile` defaults (using `/tmp`) can mask this restriction if not updated to use `dir=os.getcwd()`.
**Prevention:** Validate all file outputs with `os.path.commonpath([os.getcwd(), os.path.abspath(path)]) == os.getcwd()`.

## 2026-03-03 - Unbounded Memory Growth in Incremental Calculators
**Vulnerability:** `MEBACalculator` appended objects to an unused list `self.interactions` for every event, creating a memory leak (DoS risk).
**Learning:** Developers often keep "history" lists for debugging or future features, but forget to implement retention policies (like rotation or capping), leading to OOM in long-running processes. Incremental algorithms should NOT store raw data unless strictly required.
**Prevention:** Audit all list/deque append operations in hot paths. Use `maxlen` for `deque` or remove the list entirely if aggregates are sufficient.

## 2026-05-20 - Exception Message Leakage in Cloud Functions
**Vulnerability:** The `catch` block in `certify_prompt_integrity` directly exposed `err.message` in the HTTP 500 response body.
**Learning:** While `logger.error` correctly captures the stack trace server-side, custom error response builders (like `buildSafeResponse`) often inadvertently prioritize developer convenience (passing the error message) over security (hiding internals).
**Prevention:** Catch blocks in public APIs must explicitly sanitize error messages sent to the client, using generic "Internal Server Error" strings, while keeping the specific error in server logs.

## 2026-06-15 - Timing Attack in Internal Auth
**Vulnerability:** `verify_server_auth` used standard string comparison (`==`) for API keys.
**Learning:** Developers often forget that standard string comparison is vulnerable to timing attacks, especially in authentication checks. Even in high-latency environments (Cloud Functions), this is a bad practice.
**Prevention:** Always use `hmac.compare_digest` (Python) or `crypto.timingSafeEqual` (Node.js) for secret comparison.
