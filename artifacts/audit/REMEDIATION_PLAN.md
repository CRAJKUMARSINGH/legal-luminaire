# REMEDIATION PLAN
**Audit Date:** 2026-11-15  
**HEAD SHA:** `bda89ce6227e7f70b9f45af3f4e5f818b0571f92`

Prioritised action items drawn from SECURITY_FINDINGS.md and LEGAL_ACCURACY_RISKS.md.  
Each item is classified by **Priority** (P0=immediate blocker, P1=before production, P2=scheduled), **Effort** (S/M/L), and the finding it addresses.

---

## P0 — Immediate (Before Any Advocate Use)

### REM-P0-01 — Add CI Test: Every PENDING Citation Must Have blockedFromDraft=true
**Finding:** LAR-C01  
**Files:** `src/__tests__/verification-engine.test.ts`  
**Action:** Add test that iterates `CASE01_PRECEDENTS` and asserts that every entry with `status === "PENDING"` has `blockedFromDraft === true`. Run in CI.  
**Effort:** S  
**Why P0:** One accidental `false` lets a fabricated holding reach a filed document.

### REM-P0-02 — Downgrade Rajasthan HC Suo Motu PIL (p13) to SECONDARY
**Finding:** LAR-H04  
**File:** `src/lib/case01-data.ts`  
**Action:** Change `status: "VERIFIED"` → `"SECONDARY"`. Add `blockedFromDraft: false` (retains usability with qualification). Fill in the actual PIL number once obtained.  
**Effort:** S  
**Why P0:** Currently marked VERIFIED with a blank docket number and a paraphrased holding — not safe for filing.

### REM-P0-03 — Downgrade Surendra Koli (p14) and RSMML (p16) to SECONDARY
**Finding:** LAR-M02, LAR-M03  
**File:** `src/lib/case01-data.ts`  
**Action:** Change both `status: "VERIFIED"` → `"SECONDARY"`. Update `statusNote` to indicate source is media report only.  
**Effort:** S  
**Why P0:** "VERIFIED" implies official-source confirmation. News articles do not meet that bar.

### REM-P0-04 — Remove Combined Accuracy Percentage from UI
**Finding:** LAR-L01  
**Files:** `src/lib/verification-engine.ts`, any UI component displaying `overallAccuracyScore()`  
**Action:** Remove the weighted score calculation or clearly label it "Research convenience indicator — not a court-safety metric." Display tier counts (COURT_SAFE: N, VERIFIED: N, SECONDARY: N, PENDING: N) separately.  
**Effort:** S  
**Why P0:** The directive explicitly forbids combined accuracy percentages.

---

## P1 — Before Production Deployment

### REM-P1-01 — Add Backend Authentication to All API Routes
**Finding:** SEC-H01  
**Files:** `backend/main.py`, `backend/api/routes*.py`  
**Action:** Implement API key authentication middleware. Require `X-API-Key` header on all non-health endpoints. Store the key in `.env`. Connect to the existing `chamber-auth.ts` token on the frontend.  
**Effort:** M  
**Why P1:** An unauthenticated backend in production allows unlimited AI credit consumption and document exfiltration.

### REM-P1-02 — Add Security Headers to Netlify Deployment
**Finding:** SEC-M06  
**File:** `netlify.toml`  
**Action:** Add `[[headers]]` section with `Content-Security-Policy`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `Referrer-Policy: strict-origin-when-cross-origin`.  
**Effort:** S  

### REM-P1-03 — Replace Keyword-Only Server-Side Citation Gate with Registry Check
**Finding:** SEC-H02  
**File:** `backend/api/routes.py` — `_evaluate_citation_gate()`  
**Action:** Port the `PRECEDENT_ACCURACY` registry from `verification-engine.ts` to Python. When a draft contains any citation found in the registry, check its tier rather than relying on the LLM to self-label output.  
**Effort:** M  

### REM-P1-04 — Fix `test_copilot.py` Import Error
**Finding:** BASELINE_RESULTS.md — COLLECTION ERROR  
**File:** `backend/api/routes_copilot.py` line 41  
**Action:** Change `from ..rag.hybrid_search import ...` to an absolute import or adjust the Python path in `conftest.py`. Verify the test collects and runs successfully.  
**Effort:** S  

### REM-P1-05 — Fix `test_verification_syntax.py` to Use Proper pytest Structure
**Finding:** BASELINE_RESULTS.md — FIXTURE ERROR  
**File:** `backend/tests/test_verification_syntax.py`  
**Action:** Rename helper functions (not test functions) to avoid `test_` prefix, or convert to proper pytest parametrised tests. The `main()` script can remain as a standalone runner.  
**Effort:** S  

### REM-P1-06 — Fix `test_stadium_collapse_accuracy.py` Return Value Warnings
**Finding:** BASELINE_RESULTS.md — PytestReturnNotNoneWarning  
**File:** `backend/tests/test_stadium_collapse_accuracy.py`  
**Action:** Replace `return bool` with `assert` statements. Tests currently pass but could mask regressions if they silently return `False`.  
**Effort:** S  

### REM-P1-07 — Validate CORS_ORIGINS at Startup, Reject Wildcard
**Finding:** SEC-C01  
**File:** `backend/config.py`  
**Action:** Add a validator in `Settings` that checks `cors_origins` does not contain `*` and is not empty. Log a startup warning (or refuse to start) if it does.  
**Effort:** S  

### REM-P1-08 — Add Prominent Working-Day Disclaimer to Deadline UI
**Finding:** LAR-H02  
**File:** `src/features/deadlines/DeadlineBoard.tsx` (or equivalent)  
**Action:** For any deadline with `period_basis="working"`, render a visible amber warning: "Computed using 1.4× calendar approximation. Verify against official court holiday calendar before relying."  
**Effort:** S  

### REM-P1-09 — Expand PII Redaction to Cover Email, Passport, Voter ID
**Finding:** SEC-M02  
**File:** `backend/api/redaction_utils.py`  
**Action:** Add regex patterns for email addresses, Indian passport numbers (1 letter + 7 digits), and voter ID numbers. Update `audit_redaction_risk()` accordingly.  
**Effort:** S  

### REM-P1-10 — Remove or Archive `artifacts/api-server` or Update Its Dependencies
**Finding:** SEC-H05, SEC-L01  
**File:** `artifacts/api-server/package.json`  
**Action:** Determine if the Express API server is in the production path. If not, move to an `archived/` directory and exclude from the pnpm workspace. If it is, update `express` to pick up the patched `body-parser`.  
**Effort:** S  

---

## P2 — Scheduled Improvements

### REM-P2-01 — Add Redis-Backed Rate Limiting
**Finding:** SEC-H03  
**File:** `backend/main.py`  
**Action:** Replace the in-process `_request_counts` dict with Redis-backed rate limiting using the already-configured `redis_url`. Key on API token, not raw IP.  
**Effort:** M  

### REM-P2-02 — Add Magic-Byte File Type Validation on Upload
**Finding:** SEC-M01  
**File:** `backend/api/routes.py`  
**Action:** Add `python-magic` dependency. On file upload, validate that the actual file bytes match the declared extension. Reject polyglots.  
**Effort:** S  

### REM-P2-03 — Obtain Official BIS/CPWD Copies and Populate `exactClauseText`
**Finding:** LAR-H03  
**Files:** `src/lib/verification-engine.ts` — STANDARDS_ACCURACY  
**Action:** Purchase IS 2250:1981, IS 3535:1986, IS 4031 (Part 6) from BIS; download CPWD Manual 2023. Extract exact clause text. Populate `exactClauseText` and promote `tier` to `COURT_SAFE`.  
**Effort:** L (requires external procurement)  

### REM-P2-04 — Obtain Certified Copies of RSMML, Surendra Koli, Rajasthan HC PIL Orders
**Finding:** LAR-H04, LAR-M02, LAR-M03  
**Action:** File RTI/certified copy requests with Rajasthan HC and SC Registry. Once obtained, update `verifiedHolding`, `paraRef`, promote to `VERIFIED` or `COURT_SAFE`.  
**Effort:** L (requires advocate/legal team action)  

### REM-P2-05 — Implement Structural Prompt-Injection Defence
**Finding:** SEC-M03  
**File:** `backend/api/routes.py` — chat and research endpoints  
**Action:** Delimit document content with XML-style tags and instruct the model to treat content between tags as data, not instructions. Consider a pre-check pass to detect adversarial patterns.  
**Effort:** M  

### REM-P2-06 — Add `scoredBy` Metadata to Fact-Fit Scores
**Finding:** LAR-M01  
**File:** `src/lib/case01-data.ts`  
**Action:** Add `fitScoredBy: "manual" | "engine"` field to the `Precedent` type; set all current entries to `"manual"`. This prevents automated metrics from treating manual scores as computed scores.  
**Effort:** S  

### REM-P2-07 — Add `hallucination_threshold` to `config.py` and Enforce It
**Finding:** SEC-L03  
**File:** `backend/config.py`, `backend/agents/hallucination_breaker.py`  
**Action:** Add `hallucination_threshold: float = 0.25` to `Settings`. Pass it to `HallucinationBreaker` and block output when the ungrounded ratio exceeds the threshold.  
**Effort:** M  

### REM-P2-08 — Label Translated Hindi Holdings Explicitly
**Finding:** LAR-M05  
**Files:** `src/lib/verification-engine.ts`, bilingual draft templates  
**Action:** Wherever a Hindi `draftHolding` is a translation of an English holding (not from an official Hindi judgment), append `[अनुवाद — मूल अंग्रेज़ी]`.  
**Effort:** S  

---

## Tracking Summary

| Priority | Items | Blocking |
|----------|-------|---------|
| P0 (Immediate) | 4 | Yes — must complete before any advocate use |
| P1 (Pre-production) | 10 | Yes — must complete before live deployment |
| P2 (Scheduled) | 8 | No — improvements; schedule with legal team |
