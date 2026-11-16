# SECURITY AND CASE ISOLATION
**Master Enrichment Guide Phase B — verified 2026-11-16**

## B1. Authentication and case isolation

| Check | Status | Evidence |
|-------|--------|----------|
| Unauthenticated requests fail closed | ✅ VERIFIED | `tests/test_authentication.py` — 22 tests pass |
| `LL_API_KEY` enforcement | ✅ VERIFIED (shared-secret model) | `test_security_remediation.py` — 18 tests pass |
| Per-user case isolation (user A vs B) | ⚠️ NOT APPLICABLE / NOT VERIFIED | Single-operator shared-key model; no per-user identity exists — see exception SE-01. Multi-user isolation **cannot** be claimed. |
| Session expiry / revocation / rotation | ❌ NOT IMPLEMENTED | No sessions; static key only (SE-01) |
| Rate limiting | ⚠️ PARTIAL | In-memory limiter; not shared across instances (SE-02) |
| CORS / secure headers | ⚠️ PARTIAL | Reviewed in `final-deliverables/AUTH_BOUNDARY_REVIEW.md` |
| Secrets in client bundle | ✅ VERIFIED | 0 hits for `sk-`, `ghp_`, `AKIA`, `LL_API_KEY`, `tvly-` across `dist/public/assets/*.js` |
| Secrets in diff | ✅ VERIFIED | Design merge diff contains no credentials |

**Gate verdict:** PASS for single-operator demo/staging. **BLOCKED for confidential multi-user production** until SE-01 is remediated (OIDC/OAuth2 PKCE).

## B2. Citation and legal accuracy

See `CITATION_EXPORT_REGRESSION.md` and `final-deliverables/CITATION_EXPORT_RECHECK.md` + `CITATION_GATE_ADVERSARIAL_RESULTS.md`. Registry is server-side; export gate re-evaluates cited IDs server-side; p13/p14/p16 restricted classifications unchanged (0 registry files in design diff).

## B3. Uploads, privacy, AI safety

| Check | Status | Evidence |
|-------|--------|----------|
| Upload validation | ⚠️ PARTIAL | Document-content sanitisation present (`routes.py` strips `</DOCUMENT>`); archive/content-type validation NOT VERIFIED end-to-end |
| Prompt-injection defence | ⚠️ PARTIAL | `<DOCUMENT>` delimiters + rules block implemented; residual risk registered as SE-05 |
| PII masking in logs/prompts | NOT VERIFIED | No automated PII scan executed |
| Dependency vulnerabilities | ⚠️ KNOWN | chromadb 1.5.9 PYSEC ×5 → SE-08 (no patch); 19 pre-existing npm findings documented in `SECURITY_EXCEPTIONS.md` |

**Overall:** No new security regression introduced by the design merge. Pre-existing gaps remain documented exceptions; confidential production remains gated.
