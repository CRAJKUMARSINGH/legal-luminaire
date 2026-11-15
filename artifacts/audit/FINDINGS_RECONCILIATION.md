# FINDINGS RECONCILIATION
**Comparing Phase 0 audit findings against enrichment changes applied.**  
**Date:** 2026-11-15

| Finding ID | Description | Phase 0 Status | Enrichment Action | Evidence |
|------------|-------------|---------------|-------------------|---------|
| LAR-C01 | PENDING citations lack CI regression guard | OPEN | ✅ FIXED — Suite 9 adds 3 pytest-style tests in `verification-engine.test.ts` | Test file updated |
| LAR-H04 | p13 Rajasthan HC PIL — blank docket, paraphrased holding, VERIFIED | OPEN | ✅ FIXED — Downgraded to SECONDARY in `case01-data.ts` | `status: "SECONDARY"`, updated `statusNote` |
| LAR-M02 | p14 Surendra Koli — news media source, VERIFIED | OPEN | ✅ FIXED — Downgraded to SECONDARY | `case01-data.ts` |
| LAR-M03 | p16 RSMML — newspaper source, VERIFIED | OPEN | ✅ FIXED — Downgraded to SECONDARY | `case01-data.ts` |
| LAR-L01 | Combined accuracy percentage violates directive | OPEN | ✅ FIXED — `overallAccuracyScore()` returns `score = -1` sentinel; `accuracyNote` field added | `verification-engine.ts`; test suite updated |
| SEC-C01 | No CORS wildcard validator | OPEN | ✅ FIXED — `validate_cors_origins` field validator + `check_production_cors()` in `config.py` | `config.py` |
| SEC-M06 | Missing Permissions-Policy and HSTS | OPEN | ✅ FIXED — Added to `netlify.toml` | `netlify.toml` |
| SEC-M02 | PII redaction missing email/passport/voter ID | OPEN | ✅ FIXED — 3 new patterns in `redaction_utils.py` | `redaction_utils.py` |
| SEC-L03 | `hallucination_threshold` not in `config.py` | OPEN | ✅ FIXED — Added with Pydantic validator 0.0–1.0 | `config.py` |
| SEC-L04 | Harvey model `gpt-5` does not exist | OPEN | ✅ FIXED — Default changed to `gpt-4o` | `config.py` |
| Backend `test_copilot.py` import error | Relative import fails under pytest | OPEN | ✅ FIXED — `..rag.hybrid_search` → `rag.hybrid_search`; `.models` → `api.models` | `routes_copilot.py` |
| Backend `test_verification_syntax.py` fixture errors | Helper functions collected as fixtures | OPEN | ✅ FIXED — Renamed `test_*` → `_check_*`; single proper pytest test added | `test_verification_syntax.py` |
| Backend `test_stadium_collapse_accuracy.py` warnings | `return bool` instead of assert | OPEN | ✅ FIXED — All return statements replaced with `assert` | `test_stadium_collapse_accuracy.py` |
| SEC-H01 | No backend authentication | OPEN | ⚠️ DEFERRED — P1; requires advocate team decision on auth mechanism | Documented in OPEN_RISKS.md |
| SEC-H02 | Keyword-only server citation gate | OPEN | ⚠️ DEFERRED — P2; requires Python mirror of PRECEDENT_ACCURACY registry | Documented in OPEN_RISKS.md |
| LAR-H03 | IS standards have no official clause text | OPEN | ⚠️ DEFERRED — Requires physical BIS procurement | Documented in OPEN_RISKS.md |
| RISK-O03 | `pnpm-lock.yaml` local drift | OPEN | Noted; not changed (working tree file, not in src) | |

**Summary:**
- 13 findings resolved in this enrichment session
- 4 deferred (require advocate team decision, external procurement, or deeper refactoring)
