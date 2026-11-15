# SECURITY FINDINGS
**Audit Date:** 2026-11-15  
**HEAD SHA:** `bda89ce6227e7f70b9f45af3f4e5f818b0571f92`  
**Method:** Code inspection + `pnpm audit --audit-level high` + static analysis

Findings are classified CRITICAL / HIGH / MEDIUM / LOW.

---

## CRITICAL

### SEC-C01 — CORS Configured to Allow All Origins in Default Config
**File:** `artifacts/legal-luminaire/backend/config.py`  
**Evidence:**
```python
cors_origins: str = "http://localhost:5173,http://localhost:3000"
```
`main.py` builds `allow_origins=settings.cors_origins_list` from this value. The default is safe for local dev, but if `.env` omits `CORS_ORIGINS` or sets it to `*`, the CORS middleware will accept requests from any origin, including an attacker's site, which could allow cross-origin credential theft.  
**Impact:** Cross-origin request forgery; session/cookie theft if credentials are added.  
**Recommendation:** Validate `CORS_ORIGINS` at startup; reject `*` or empty; log the configured value.

---

## HIGH

### SEC-H01 — No Authentication on FastAPI Backend Endpoints
**File:** `artifacts/legal-luminaire/backend/api/routes.py` (all routes), `main.py`  
**Evidence:** No `Depends(get_current_user)` or any auth middleware present across all 15+ routers. Any caller with network access to port 8000 can read, upload, delete case documents and trigger AI research jobs.  
**Impact:** Unauthorised document upload, case data exfiltration, AI credit abuse via unmetered research endpoint.  
**Recommendation:** Add HTTP Bearer token or API-key auth to all backend routes; at minimum, all document and research endpoints must require a secret. The `chamber-auth.ts` frontend token is not enforced server-side.

### SEC-H02 — Server-Side Citation Gate Is Keyword-Only and Bypassable
**File:** `artifacts/legal-luminaire/backend/api/routes.py` lines 100–117  
**Evidence:**
```python
def _evaluate_citation_gate(text: str) -> dict:
    normalized = (text or "").upper()
    statuses = {
        "PENDING": len(re.findall(r"\bPENDING\b", normalized)),
        ...
    }
    must_block = statuses["PENDING"] > 0 or statuses["FATAL_ERROR"] > 0
```
The gate scans the AI output text for the literal words `PENDING` and `FATAL_ERROR`. A model output that never emits these words but still contains an unverified citation bypasses the gate. There is no structural check against the registry.  
**Impact:** Unverified citations could reach a court-filed document if the AI does not label them.  
**Recommendation:** Implement the registry check on the backend (mirror `verification-engine.ts` in Python); do not rely on the AI self-labelling its output.

### SEC-H03 — Rate Limiter Uses In-Memory Dict (No Persistence, No Client Auth)
**File:** `artifacts/legal-luminaire/backend/main.py` — `_request_counts` dict  
**Evidence:** Rate limiting is keyed on `request.client.host`. An attacker behind a proxy or rotating IPs trivially evades it. The store is in-process and resets on restart.  
**Impact:** AI endpoint abuse, OpenAI credit exhaustion.  
**Recommendation:** Use Redis-backed rate limiting (config already has `redis_url`); key on session token rather than IP alone.

### SEC-H04 — `extract-zip` Path Traversal (GHSA-jmr9-qjv8-65gv / GHSA-7pqw-9j4j-h8q3)
**Path:** `scripts > puppeteer > @puppeteer/browsers > extract-zip <=2.0.1`  
**Evidence:** `pnpm audit` output — 2 HIGH advisories.  
**Impact:** Symlink-based path traversal during ZIP extraction — arbitrary file write in a CI/dev context where `scripts/puppeteer` is used.  
**Note:** No patched version exists (`Patched versions: <0.0.0`). Mitigation: remove puppeteer from `scripts/` if unused, or sandbox its execution.  
**Recommendation:** Audit whether puppeteer is active in the pipeline. If unused, remove it. If needed, run in an isolated container.

### SEC-H05 — `body-parser` DoS (GHSA-27r3-jxmh-p828) in `artifacts/api-server`
**Path:** `artifacts/api-server > express > body-parser >=2.0.0 <2.4.0`  
**Evidence:** `pnpm audit` output — 1 HIGH advisory.  
**Impact:** DoS via trailing bytes in compressed request bodies.  
**Recommendation:** Update express/body-parser in `artifacts/api-server/package.json` to a patched version, or remove the api-server workspace if it is not used in production.

### SEC-H06 — `launch-editor` Windows `fs.existsSync()` Bypass (GHSA-mrhx-c7xc-m3w5)
**Path:** `artifacts__legal-luminaire > zod` (transitive via a vite dev-time tool)  
**Evidence:** `pnpm audit` output.  
**Impact:** Dev-only — allows bypassing the existence check on Windows. Not exploitable in a deployed production build.  
**Recommendation:** Add `launch-editor: ">=2.7.0"` to pnpm overrides once a patched version is available.

---

## MEDIUM

### SEC-M01 — File Upload Accepts `.lex` and `.md` Without Content Inspection
**File:** `artifacts/legal-luminaire/backend/api/routes.py` — `ALLOWED_EXTENSIONS`  
**Evidence:**
```python
ALLOWED_EXTENSIONS = {".pdf", ".md", ".txt", ".lex", ".doc", ".docx", ".jpg", ".jpeg", ".png"}
```
Extension is checked but file content (magic bytes) is not validated. A malicious PDF with embedded scripts or a polyglot file will pass the extension check.  
**Impact:** Stored XSS via malicious document if served back to browser; potential LLM prompt injection via crafted `.lex` file.  
**Recommendation:** Add magic-byte validation (e.g., `python-magic`); strip/sanitise document content before passing to LLM.

### SEC-M02 — PII Redaction Misses Email, Passport, Voter ID, Bank Account Numbers
**File:** `artifacts/legal-luminaire/backend/api/redaction_utils.py`  
**Evidence:** Only three patterns exist: Aadhaar (12-digit), PAN, phone. The function comment says "Names are intentionally kept."  
**Impact:** Email addresses, passport numbers, voter IDs, and bank account numbers uploaded in case documents will not be redacted.  
**Recommendation:** Expand to cover additional Indian document identifiers; clearly document which fields are intentionally preserved and why.

### SEC-M03 — Prompt Injection via Uploaded Documents
**File:** `artifacts/legal-luminaire/backend/api/routes.py` — `_legacy_run_research` / `_chat_impl`  
**Evidence:** Uploaded document content is injected directly into LLM system prompts:
```python
case_context = "\n".join(
    f"[{d.metadata.get('source_file', 'doc')}]: {d.page_content[:400]}"
    for d in docs
)
system = f"""... CASE CONTEXT FROM UPLOADED DOCUMENTS:\n{case_context}..."""
```
No sanitisation for LLM control sequences before insertion.  
**Impact:** An adversarially crafted uploaded document could override system instructions and produce a fabricated citation that bypasses the citation gate.  
**Recommendation:** Escape or delimit document content clearly; consider a separate validation pass before inserting into the system prompt.

### SEC-M04 — `localStorage` Contains Case Data Including Uploaded Document Metadata
**File:** `artifacts/legal-luminaire/src/context/CaseContext.tsx`  
**Evidence:** CaseContext persists to `localStorage`. localStorage is accessible to any JavaScript on the same origin, is not encrypted, and survives browser restarts.  
**Impact:** Case names, hearing dates, notes visible to XSS attacks; persisted across sessions on shared machines.  
**Recommendation:** Add a "clear session" option; warn users on shared machines; consider `sessionStorage` for sensitive fields.

### SEC-M05 — No CSRF Protection on Stateful Backend Mutations
**File:** `artifacts/legal-luminaire/backend/main.py`  
**Evidence:** No CSRF token middleware. CORS is configured, which provides some protection, but `allow_credentials: True` with a broad origins list could allow cookie-bearing cross-origin requests on misconfiguration.  
**Recommendation:** Add CSRF double-submit cookie or SameSite cookie policy; review `allow_credentials` scope.

### SEC-M06 — No Security Headers (CSP, HSTS, X-Frame-Options) on Frontend
**File:** `artifacts/legal-luminaire/nginx.conf`, `netlify.toml`  
**Evidence:** `nginx.conf` exists but does not set `Content-Security-Policy`, `Strict-Transport-Security`, or `X-Frame-Options`. `netlify.toml` has no `[[headers]]` section.  
**Impact:** Clickjacking; XSS amplification without CSP.  
**Recommendation:** Add CSP, HSTS, X-Frame-Options: DENY, Referrer-Policy to Netlify headers or nginx config.

---

## LOW

### SEC-L01 — API Server `artifacts/api-server` Has Stale Dependencies (Express legacy)
**Evidence:** `body-parser` vulnerability in api-server's own node_modules. This server appears to be a Replit-era artifact.  
**Recommendation:** Determine if api-server is in the production deployment path. If not, remove or archive it.

### SEC-L02 — `minimumReleaseAge: 0` in pnpm-workspace.yaml
**File:** `pnpm-workspace.yaml` line 42  
**Evidence:** The comment explains this was disabled for CI/Netlify builds. The supply-chain protection guard is off for all installs.  
**Recommendation:** Re-enable for local dev with the env-var mechanism described in the comment.

### SEC-L03 — `hallucination_threshold` Config Has No Enforcement Path
**File:** `backend/.env.example` — `HALLUCINATION_THRESHOLD=0.25`  
**Evidence:** The config field exists in `.env.example` but inspection of `config.py` shows no `hallucination_threshold` field. The threshold is never read.  
**Impact:** Developers believe hallucination blocking is configured when it is not.  
**Recommendation:** Either add the config field and enforce it in the hallucination breaker agent, or remove the env var from the example.

### SEC-L04 — Harvey.ai Model Hardcoded to `gpt-5` (Non-Existent Model)
**File:** `config.py` — `harvey_model: str = "gpt-5"`  
**Evidence:** As of audit date, OpenAI's GPT-5 is not publicly available. Any call to Harvey with this model name would fail.  
**Impact:** Misconfiguration leads to silent failure when Harvey is enabled.  
**Recommendation:** Use a verified model name or make it clearly experimental.

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 1 |
| HIGH | 5 |
| MEDIUM | 6 |
| LOW | 4 |
