# SECURITY REPORT
**Legal Luminaire — Security Assessment**  
**Audit Date:** 2026-11-15 | HEAD `bda89ce6227e7f70b9f45af3f4e5f818b0571f92`

This report consolidates findings from SECURITY_FINDINGS.md with their current remediation status.

---

## Threat Model Summary

| Threat Vector | Present? | Severity |
|---------------|---------|---------|
| Prompt injection via uploaded documents | YES | MEDIUM |
| Cross-case data leakage (ChromaDB isolation) | PARTIALLY MITIGATED | MEDIUM |
| Authorization bypass (no backend auth) | YES | HIGH |
| XSS (no CSP headers) | YES | MEDIUM |
| CSRF | PARTIALLY MITIGATED | MEDIUM |
| File upload abuse | PARTIALLY MITIGATED | MEDIUM |
| Sensitive logging (API keys) | NO — keys read from env, not logged | LOW |
| Dependency vulnerabilities | YES | HIGH |
| API key exposure in code | NO — `.env` pattern used | LOW |
| Redaction failures | PARTIALLY (phone/PAN/Aadhaar) | MEDIUM |
| Export endpoint bypass | PARTIALLY MITIGATED | MEDIUM |
| Insecure browser storage | YES (localStorage) | MEDIUM |
| Data retention/deletion | NOT IMPLEMENTED | LOW |

---

## Findings by Severity

### CRITICAL

**SEC-C01 — CORS Wildcard Risk**  
If `CORS_ORIGINS` env var is not set, default is `localhost:5173,localhost:3000` (safe). But there is no startup validation preventing `*`. If a deployer sets `*`, any origin can make credentialed requests.  
**Status:** OPEN — no startup validator present  
**Remediation:** Add `Settings` validator in `config.py`; reject `*`

### HIGH

**SEC-H01 — No Authentication on FastAPI Endpoints**  
All 15+ routers are unauthenticated. POST `/api/v1/cases/{id}/research` triggers AI pipeline with no credentials.  
**Status:** OPEN  
**Remediation:** Add API-key middleware before production deployment

**SEC-H02 — Server-Side Citation Gate Is Keyword-Only**  
`_evaluate_citation_gate()` only checks for the word "PENDING" in the LLM output text. A model that cites an unverified case without using the word "PENDING" will not be blocked.  
**Status:** OPEN  
**Remediation:** Port `PRECEDENT_ACCURACY` registry to Python; check citations structurally

**SEC-H03 — In-Memory Rate Limiter**  
`_request_counts` dict resets on restart; keyed on raw IP; not Redis-backed.  
**Status:** OPEN (Redis config exists but not wired)

**SEC-H04 — `extract-zip` Path Traversal (via puppeteer in `scripts/`)**  
Two HIGH advisories from `pnpm audit`. No patched version exists.  
**Status:** OPEN — no patched `extract-zip` available. Mitigation: determine if puppeteer is in active use.

**SEC-H05 — `body-parser` DoS in `artifacts/api-server`**  
Express legacy server has vulnerable body-parser.  
**Status:** OPEN — api-server not confirmed as production-path service

### MEDIUM

**SEC-M01 — No Magic-Byte File Validation**  
Upload endpoint checks extension only. A crafted `.lex` file could be a polyglot.  
**Status:** OPEN

**SEC-M02 — PII Redaction Incomplete**  
Email, passport, voter ID not covered.  
**Status:** OPEN

**SEC-M03 — Prompt Injection via Documents**  
Document content inserted directly into LLM system prompt.  
**Status:** OPEN

**SEC-M04 — Case Data in `localStorage`**  
Persistent across sessions on shared machines.  
**Status:** OPEN — no "clear session" option

**SEC-M05 — No CSRF Protection**  
No CSRF token middleware.  
**Status:** OPEN

**SEC-M06 — No Security Headers**  
No CSP, HSTS, X-Frame-Options on frontend.  
**Status:** OPEN

### LOW

**SEC-L01 — api-server stale**  
**Status:** OPEN — verify if in production path

**SEC-L02 — `minimumReleaseAge: 0`**  
Supply-chain protection disabled. Intentional for CI.  
**Status:** ACCEPTED (documented in pnpm-workspace.yaml)

**SEC-L03 — `hallucination_threshold` Not Enforced**  
Config key exists in `.env.example` but not in `config.py`.  
**Status:** OPEN

**SEC-L04 — Harvey Model `gpt-5` Does Not Exist**  
Config default points to unavailable model.  
**Status:** OPEN

---

## Security Controls Already in Place

The following controls exist and are working:

| Control | File | Verification |
|---------|------|-------------|
| `.env` for all secrets (not in code) | `config.py` | No keys in git history (inspected) |
| File extension allowlist on upload | `routes.py` — `ALLOWED_EXTENSIONS` | Code inspection |
| Filename sanitisation on upload | `_safe_filename()` in `routes.py` | Code inspection |
| Rate limiting on expensive endpoints | `main.py` — `_is_expensive_endpoint()` | Code inspection |
| CORS origins configured (not open) | `config.py` default | Code inspection |
| `blockedFromDraft: true` for PENDING | `case01-data.ts` | Frontend test suite pass |
| Citation Gate hard-block on PENDING | `citation-gate.ts` | `citation-gate.test.ts` passes |
| PII redaction (Aadhaar/PAN/phone) | `redaction_utils.py` | Code inspection |
| Strict TypeScript (no `any` in core) | `tsconfig.base.json` | Typecheck passes clean |
| 29 CVE overrides in pnpm workspace | `pnpm-workspace.yaml` | Code inspection |
| `python-multipart` secure file handling | `requirements.txt` | Dependency present |
| ChromaDB case isolation | `rag/case_isolated_store.py` | Module exists (not runtime-tested) |

---

## Security Posture Summary

The frontend citation safety controls (Citation Gate, Verification Engine) are well-implemented and tested. The backend has meaningful rate limiting and file sanitisation. The critical gap is **authentication** — the backend is completely open. This must be resolved before the application handles real case documents. Secondary priorities are security headers and prompt injection defences.

**Overall security posture: NOT PRODUCTION READY due to missing authentication (SEC-H01).**
