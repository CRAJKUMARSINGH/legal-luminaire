# SECURITY EXCEPTIONS
**Guide 1 — Accepted Risks and Exception Register**  
**Date:** 2026-11-15

Each entry records a known security gap that is accepted for the current release
tier with documented rationale and required remediation before promotion.

---

## Exception SE-01 — Shared Static API Key (not per-user identity)

**Severity:** HIGH for multi-user production; LOW for single-operator  
**Applies to:** Any deployment where multiple independent users access the backend  
**Description:** `LL_API_KEY` is a shared secret. Any holder of the key can access
all cases (unless `LL_ALLOWED_CASES` is set). There is no per-user identity,
no session expiry, and no audit trail of who performed which action.  
**Accepted for:** Single-operator demo and staging  
**Not accepted for:** Multi-user production with confidential client cases  
**Required remediation:** Implement OIDC/OAuth2 authorization-code-with-PKCE  
**Owner:** Backend developer + product decision  

---

## Exception SE-02 — In-Memory Rate Limiter (not shared across instances)

**Severity:** MEDIUM  
**Description:** `main.py` uses `_request_counts` dict. Resets on restart.
Two running instances have independent counters. Redis config field exists but
is not wired.  
**Accepted for:** Single-instance deployments  
**Not accepted for:** Horizontally scaled production  
**Required remediation:** Wire `redis_url` from `config.py` into rate limiter  
**Owner:** Backend developer  

---

## Exception SE-03 — `extract-zip` Path Traversal (no patch available)

**Severity:** LOW — dev-time tool only, not in production bundle  
**CVE:** GHSA-jmr9-qjv8-65gv / GHSA-7pqw-9j4j-h8q3  
**Path:** `scripts > puppeteer > @puppeteer/browsers > extract-zip <=2.0.1`  
**Patched versions:** `<0.0.0` (no patch exists)  
**Description:** Path traversal via symlink entries in ZIP archives.  
**Accepted for:** Current release — puppeteer is not used in production frontend  
**Required remediation:** Remove puppeteer from `scripts/` if unused; otherwise
sandbox in isolated container  
**Owner:** DevOps  

---

## Exception SE-04 — Legacy `api-server` Express Dependencies

**Severity:** LOW — not in production deployment path  
**Description:** `artifacts/api-server` has stale `express/body-parser`
(GHSA-27r3-jxmh-p828).  
**Accepted for:** Current release — api-server is a Replit-era artifact  
**Required remediation:** Remove workspace package or update to patched version  
**Owner:** Developer  

---

## Exception SE-05 — `<DOCUMENT>` Tag Prompt Injection Defence Is Partial

**Severity:** MEDIUM  
**Description:** Document content is delimited with `<DOCUMENT>` XML tags and
LLM is instructed to treat it as untrusted data. This reduces but does not
eliminate prompt injection risk — a sufficiently adversarial document may still
influence model outputs.  
**Accepted for:** Demo/staging with synthetic documents  
**Not accepted for:** Production with real client documents  
**Required remediation:** Add tool-boundary enforcement, instruction hierarchy,
output validation, and malicious-document test fixtures  
**Owner:** AI/RAG engineer  

---

## Exception SE-06 — No CSRF Protection

**Severity:** LOW — no session cookies in current design  
**Description:** No CSRF token middleware. Mitigated by: `X-API-Key` header
(cross-origin JS cannot read response), explicit CORS allowlist, SameSite cookie
attribute not applicable (no cookies).  
**Accepted for:** Current API-key design  
**Not accepted for:** Any session-cookie design  
**Required remediation:** Add CSRF double-submit or SameSite cookies when session
cookies are introduced  
**Owner:** Backend developer  

---

## Exception SE-07 — `langchain-community` Deprecation Warning

**Severity:** LOW — functional, not a security vulnerability  
**Description:** `langchain-community` package is sunset. Remaining warning in
test output. No CVE.  
**Accepted for:** Current release  
**Required remediation:** Migrate to standalone `langchain-chroma`,
`langchain-text-splitters` etc. when stable  
**Owner:** Developer  

---

## Exception SE-08 — `chromadb` 1.5.9 Known Vulnerabilities (no patch available)

**Severity:** MEDIUM — depends on deployment exposure; no fixed release exists  
**Description:** `pip-audit` reports 5 advisory rows / 4 distinct CVEs against
`chromadb==1.5.9` (PYSEC-2026-311 = CVE-2026-45829 dup, PYSEC-2026-3813 =
CVE-2026-45830, PYSEC-2026-3814 = CVE-2026-45833, PYSEC-2026-3815 =
CVE-2026-45831). All four CVEs live in the **ChromaDB server surface**:
the `/api/v2/tenants/...` REST endpoints, `SimpleRBACAuthorizationProvider`
tenant scoping, and `trust_remote_code` model-repository loading.

**Verified non-applicability:** the backend uses chromadb only through
`langchain_community.vectorstores.Chroma` with `persist_directory` — an
embedded `PersistentClient`. There is **no ChromaDB server, no HTTP API,
no RBAC provider, no multi-tenancy, and no remote model repositories** in
this deployment (`grep` confirms zero `HttpClient`/`SimpleRBAC`/
`trust_remote_code` usage). The vulnerable code paths are unreachable.  
**Accepted for:** All current deployment tiers while usage remains embedded-only  
**Not accepted for:** Any future deployment that runs `chromadb serve` /
`ChromaServer` or enables `trust_remote_code` — re-review required first  
**Required remediation:** Re-run `pip-audit` each release; upgrade
`chromadb` when patched; if a server mode is ever introduced, these CVEs
become CRITICAL and must be fixed before exposure.  
**Owner:** Backend developer  

---

## Summary

| ID | Description | Severity | Accepted For |
|----|-------------|----------|-------------|
| SE-01 | Shared API key | HIGH | Single-operator only |
| SE-02 | In-memory rate limiter | MEDIUM | Single-instance only |
| SE-03 | extract-zip no patch | LOW | Dev-time only |
| SE-04 | Legacy api-server | LOW | Unused in prod |
| SE-05 | Partial prompt injection | MEDIUM | Synthetic docs only |
| SE-06 | No CSRF | LOW | No cookies |
| SE-07 | langchain-community | LOW | Functional |
| SE-08 | chromadb 1.5.9 (4 CVEs, server surface only) | LOW — unreachable code paths | Embedded client only; re-review if server mode ever enabled |
