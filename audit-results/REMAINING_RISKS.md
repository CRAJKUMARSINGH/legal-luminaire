# REMAINING RISKS
**Post-Implementation Audit — Open Risk Register**  
**Date:** 2026-11-15 | HEAD `10cc700`

---

## Critical (Block Production)

### RISK-01 — No Backend Authentication (SEC-H01)
**Likelihood:** CERTAIN if deployed publicly  
**Impact:** CRITICAL — unauthorised AI credit consumption, case data exfiltration  
**Status:** NOT FIXED — deferred, requires auth architecture decision  
**Mitigation:** Backend must not be deployed publicly without auth. Frontend works standalone via localStorage.

### RISK-02 — Server-Side Citation Gate is Keyword-Only (SEC-H02)
**Likelihood:** MEDIUM — requires an LLM that omits the word "PENDING"  
**Impact:** HIGH — unverified citation could reach export via direct API bypass  
**Status:** NOT FIXED — deferred, requires Python registry mirror  
**Mitigation:** Frontend Citation Gate is more robust (structural registry lookup). Both gates must be bypassed for a forged citation to reach export.

---

## High (Before Court Filing)

### RISK-03 — Four PENDING Citations Lack Certified Copies
**Likelihood:** CERTAIN — `exactClauseText` is null  
**Impact:** HIGH — citing an unconfirmed citation in court is impermissible  
**Status:** CORRECTLY BLOCKED — `blockedFromDraft: true` enforced + P0 regression guard  
**Mitigation:** Already mitigated. PENDING entries cannot reach drafts.

### RISK-04 — Four IS/ASTM Standards Have No Official Clause Text
**Likelihood:** CERTAIN — `exactClauseText` is null  
**Impact:** HIGH — citing a clause number without official text is a material error  
**Status:** REQUIRES LEGAL REVIEW — procurement task (BIS/ASTM purchase)  
**Mitigation:** Standards are SECONDARY tier with explicit verification notes.

### RISK-05 — Three Downgraded Precedents (p13/p14/p16) Need Certified Orders
**Likelihood:** CERTAIN — sources are news media only  
**Impact:** HIGH — already downgraded to SECONDARY; must not be promoted back  
**Status:** CORRECTLY DOWNGRADED — P0 regression guard prevents re-promotion  
**Mitigation:** Already mitigated. Requires advocate team to file certified copy requests.

---

## Medium (Scheduled)

### RISK-06 — No Browser-Based Testing
**Likelihood:** HIGH — no Playwright/Puppeteer configured  
**Impact:** MEDIUM — untested DOM rendering, responsive layout, browser interaction  
**Status:** NOT IMPLEMENTED — requires browser automation setup  
**Mitigation:** 461 unit/integration tests provide partial coverage. Live browser testing is a P2 enhancement.

### RISK-07 — No UI-Level Working-Day Deadline Warning
**Likelihood:** HIGH — advocates will see computed deadlines  
**Impact:** MEDIUM — relying on approximated deadline without holiday calendar  
**Status:** NOT FIXED — P1 item deferred  
**Mitigation:** `basis_en` string carries disclaimer text. Needs prominent UI amber warning.

### RISK-08 — Prompt Injection via Uploaded Documents
**Likelihood:** MEDIUM — requires adversarial document  
**Impact:** HIGH — could override system instructions  
**Status:** NOT FIXED — P2 item deferred  
**Mitigation:** Citation Gate on frontend catches unrecognised citations.

### RISK-09 — pnpm-lock.yaml Local Drift
**Likelihood:** CERTAIN — uncommitted local modification  
**Impact:** LOW — CI uses `--frozen-lockfile`; will fail if mismatch  
**Status:** NOT FIXED — pre-existing  
**Mitigation:** Run `git checkout pnpm-lock.yaml` to restore.

### RISK-10 — extract-zip Vulnerability (No Patch Available)
**Likelihood:** LOW — dev-time tool only (puppeteer path)  
**Impact:** HIGH in CI if puppeteer processes untrusted input  
**Status:** NOT FIXED — no patched version exists  
**Mitigation:** Evaluate whether puppeteer is needed; remove if unused.

---

## Low (Documented/Accepted)

### RISK-11 — No PR Template or Dependabot
**Likelihood:** MEDIUM  
**Impact:** LOW — GitHub polish gap  
**Status:** NOT IMPLEMENTED  
**Mitigation:** Add `.github/PULL_REQUEST_TEMPLATE.md` and `.github/dependabot.yml`.

### RISK-12 — Body-Parser DoS in Legacy api-server
**Likelihood:** LOW — api-server may not be in production path  
**Impact:** HIGH if exposed  
**Status:** NOT FIXED  
**Mitigation:** Determine if api-server is active; remove if not.

### RISK-13 — Gold/Ivory Hex Slightly Different from Directive
**Likelihood:** CERTAIN  
**Impact:** NEGLIGIBLE — cosmetic  
**Status:** Minor deviation  
**Mitigation:** Update `#D8B36A` → `#DCC38A` and `#F7F5F0` → `#F8F7F3` in PremiumHeroBanner.tsx.

### RISK-14 — test_copilot.py Cannot Collect (langchain dependency)
**Likelihood:** CERTAIN  
**Impact:** LOW — copilot feature may work at runtime; test cannot collect  
**Status:** Pre-existing dependency mismatch (`langchain.text_splitter` moved to `langchain_text_splitters`)  
**Mitigation:** Update `.venv` with `pip install langchain-text-splitters` or fix import in `rag/optimized_document_store.py`.

---

## Risk Summary

| Severity | Count |
|----------|-------|
| Critical | 2 |
| High | 3 |
| Medium | 5 |
| Low | 4 |
| **Total** | **14** |

**Critical risks (RISK-01, RISK-02) block production deployment.** The application is safe for demo/staging (frontend-only, localStorage) but must not have a public backend without authentication.
