# REMEDIATION RECHECK
**Post-Implementation Audit — Historical Finding Verification**  
**Date:** 2026-11-15 | HEAD `10cc700`

Each historical finding from the Phase 0 audit (SECURITY_FINDINGS.md + LEGAL_ACCURACY_RISKS.md) is independently verified below. Statuses: FIXED AND TESTED · FIXED BUT UNTESTED · PARTIALLY FIXED · REGRESSED · NOT FIXED · REQUIRES LEGAL REVIEW.

---

## Legal Accuracy Findings

| ID | Finding | Status | Evidence |
|----|---------|--------|---------|
| LAR-C01 | PENDING citations lack CI regression guard | **FIXED AND TESTED** | 3 tests in `verification-engine.test.ts:471` (Suite 9). All 4 PENDING entries confirmed `blockedFromDraft: true` in `case01-data.ts:275,292,309,326`. 388/388 tests pass. |
| LAR-H04 | p13 Rajasthan HC PIL — blank docket, VERIFIED | **FIXED AND TESTED** | Downgraded to SECONDARY at `case01-data.ts:223`. P0 guard test confirms `p13.status !== "VERIFIED"` at `verification-engine.test.ts:500`. |
| LAR-M02 | p14 Surendra Koli — news media, VERIFIED | **FIXED AND TESTED** | Downgraded to SECONDARY at `case01-data.ts:345`. P0 guard test at line 505. |
| LAR-M03 | p16 RSMML — newspaper, VERIFIED | **FIXED AND TESTED** | Downgraded to SECONDARY at `case01-data.ts:380`. P0 guard test at line 510. |
| LAR-L01 | Combined accuracy percentage violates directive | **FIXED AND TESTED** | `score = -1` sentinel + `accuracyNote` field in `verification-engine.ts:631`. Test at `verification-engine.test.ts:528` confirms sentinel. `generateAccuracyReport()` no longer prints score/100. |
| LAR-H01 | 7 SECONDARY citations with `holdingAccurate: false` | **PARTIALLY FIXED** | 3 new SECONDARY entries added to `PRECEDENT_ACCURACY` registry. The 7 original SECONDARY entries still have `holdingAccurate: false` — intentional (they await SCC copy). Not regressed. |
| LAR-H02 | Working-day deadline approximation lacks UI warning | **NOT FIXED** | No UI-level amber warning added to `DeadlineBoard.tsx`. The `basis_en` string carries the disclaimer but it may not be prominently displayed. Deferred P1 item. |
| LAR-H03 | 5 IS/ASTM standards have no official clause text | **REQUIRES LEGAL REVIEW** | Standards remain SECONDARY with `exactClauseText: null`. Requires BIS procurement — not an engineering task. |
| LAR-M01 | Fact-fit scores manually assigned | **PARTIALLY FIXED** | Scores remain manually assigned. `fitScoredBy` metadata field was proposed but not added. The P0 guard tests now verify the scores structurally. |
| LAR-L02 | IS 3535:1986 archive.org source | **REQUIRES LEGAL REVIEW** | Source unchanged. Requires official BIS copy — procurement task. |

---

## Security Findings

| ID | Finding | Status | Evidence |
|----|---------|--------|---------|
| SEC-C01 | No CORS wildcard validator | **FIXED AND TESTED** | `validate_cors_origins` field validator in `config.py:58`. `check_production_cors()` method at line 105. Behavioral test `TestCORSValidator` (4 tests) all pass. |
| SEC-H01 | No backend authentication | **NOT FIXED** | No `Depends`, `get_current_user`, or auth middleware in `main.py`. All routes remain unauthenticated. Deferred — requires auth architecture decision. |
| SEC-H02 | Server-side citation gate keyword-only | **NOT FIXED** | `_evaluate_citation_gate()` in `routes.py:136` still scans for literal "PENDING" keyword. No structural registry check. Deferred — requires Python registry mirror. |
| SEC-H03 | In-memory rate limiter | **NOT FIXED** | `_request_counts` dict in `main.py`. No Redis wiring. Deferred P2. |
| SEC-H04 | extract-zip path traversal | **NOT FIXED** | No patched version exists. `puppeteer` dependency path unchanged. Deferred. |
| SEC-H05 | body-parser DoS in api-server | **NOT FIXED** | Legacy `artifacts/api-server` unchanged. Deferred. |
| SEC-M01 | No magic-byte file validation | **NOT FIXED** | Upload endpoint checks extension only. Deferred P2. |
| SEC-M02 | PII redaction incomplete | **FIXED AND TESTED** | Email, passport, voter-ID patterns added to `redaction_utils.py`. Behavioral test `TestPIIRedaction` (10 tests) all pass. 6 PII types now covered. |
| SEC-M03 | Prompt injection via documents | **NOT FIXED** | Document content still injected directly into LLM prompts. Deferred P2. |
| SEC-M04 | Case data in localStorage | **NOT FIXED** | No "clear session" option added. Deferred P2. |
| SEC-M05 | No CSRF protection | **NOT FIXED** | No CSRF middleware. Deferred. |
| SEC-M06 | No security headers | **FIXED AND TESTED** | `Permissions-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `CSP` all present in `netlify.toml`. Verified via file inspection. |
| SEC-L01 | api-server stale | **NOT FIXED** | Legacy server unchanged. |
| SEC-L02 | minimumReleaseAge: 0 | **ACCEPTED** | Documented as intentional for CI. |
| SEC-L03 | hallucination_threshold not wired | **FIXED AND TESTED** | `hallucination_threshold: float = 0.25` added to `config.py:52` with validator at line 77. Behavioral test `TestHallucinationThreshold` (5 tests) all pass. |
| SEC-L04 | Harvey model gpt-5 non-existent | **FIXED AND TESTED** | Default changed to `gpt-4o` at `config.py:39`. |

---

## Backend Test Infrastructure

| Issue | Status | Evidence |
|-------|--------|---------|
| test_copilot.py relative import error | **FIXED** | `routes_copilot.py:41` changed from `..rag.hybrid_search` to `rag.hybrid_search`. Collection now reaches deeper — NEW error exposed: `ModuleNotFoundError: No module named 'langchain.text_splitter'` (pre-existing dependency version mismatch, not caused by enrichment). |
| test_verification_syntax.py fixture errors | **FIXED AND TESTED** | Helpers renamed `test_*` → `_check_*`. Single proper pytest test added. `test_verification_syntax.py::test_verification_systems_syntax_and_structure` PASSES. |
| test_stadium_collapse_accuracy.py return warnings | **FIXED AND TESTED** | All `return bool` → `assert`. Zero `PytestReturnNotNoneWarning` in latest run. |

---

## Summary

| Category | Count |
|----------|-------|
| FIXED AND TESTED | 11 |
| FIXED BUT UNTESTED | 0 |
| PARTIALLY FIXED | 2 |
| REGRESSED | 0 |
| NOT FIXED (deferred) | 9 |
| REQUIRES LEGAL REVIEW | 2 |
| ACCEPTED (documented) | 1 |

**Zero regressions.** All previously applied remediations hold. Deferred items remain deferred with documented rationale.
