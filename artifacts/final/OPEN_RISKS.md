# OPEN RISKS
**Legal Luminaire — Risk Register**  
**Audit Date:** 2026-11-15 | HEAD `bda89ce6227e7f70b9f45af3f4e5f818b0571f92`

Each risk has: ID, description, likelihood, impact, current mitigation, and required action.

---

## Legal / Accuracy Risks

### RISK-L01 — Three VERIFIED Precedents Are Sourced from Media, Not Certified Orders
**Likelihood:** CERTAIN (the source links are on record)  
**Impact:** CRITICAL — if filed in court, citing a news report as authority is impermissible  
**Precedents:** p13 (Rajasthan HC Suo Motu PIL), p14 (Surendra Koli), p16 (RSMML)  
**Current mitigation:** Citation Gate will flag these as "VERIFIED" — but VERIFIED tier is allowed in draft output  
**Required action:** Downgrade all three to SECONDARY immediately (Remediation REM-P0-02 and REM-P0-03)  
**Owner:** Developer + Advocate team  
**Deadline:** Before any court filing

### RISK-L02 — IS Standard Clause Numbers Are Not Confirmed from Official BIS Sources
**Likelihood:** CERTAIN — `exactClauseText: null` for IS 2250:1981, IS 3535:1986, CPWD Manual  
**Impact:** HIGH — a clause number that does not exist or states something different invalidates the technical argument  
**Current mitigation:** All five standards are SECONDARY tier; clause numbers are stated as "require verification"  
**Required action:** Obtain official BIS copies (IS 2250:1981, IS 3535:1986, IS 4031 Part 6) and CPWD Manual 2023  
**Owner:** Advocate team (procurement)  
**Deadline:** Before any discharge application or written submission is filed

### RISK-L03 — Four PENDING Precedents Are in the Research UI Without Authentication
**Likelihood:** LOW (blocked by `blockedFromDraft: true`)  
**Impact:** HIGH if `blockedFromDraft` ever defaults to `false`  
**Current mitigation:** Citation Gate hard-blocks; tested in suite  
**Required action:** Add CI lint rule asserting PENDING → `blockedFromDraft: true` (REM-P0-01)  
**Owner:** Developer  
**Deadline:** Before next code commit that modifies case01-data.ts

### RISK-L04 — Deadline Engine Uses Working-Day Approximation Without Court Holiday Calendar
**Likelihood:** HIGH — advocates will rely on displayed deadline dates  
**Impact:** HIGH — missing a real court deadline due to relying on an approximated one  
**Current mitigation:** `is_synthetic=True`; `[SYNTHETIC/DEMO]` label in `basis_en`; label may not be prominent in UI  
**Required action:** Add prominent UI-level amber warning for all working-day deadlines (REM-P1-08)  
**Owner:** Frontend developer  
**Deadline:** Before production deployment

### RISK-L05 — Backend Citation Verification Is Against Internal JSON, Not Live Legal Sources
**Likelihood:** CERTAIN — `law_db.json` is a small static file  
**Impact:** MEDIUM — a citation can be "verified" against the internal DB but not exist in SCC/Indian Kanoon  
**Current mitigation:** Verification result says "Verified: [citation]" with no disclaimer  
**Required action:** Add disclaimer to `/verify-citations` response: "Verified against internal database only. Live database check requires Tavily/SCC keys."  
**Owner:** Backend developer  
**Deadline:** Before production deployment

---

## Security Risks

### RISK-S01 — No Authentication on FastAPI Backend
**Likelihood:** CERTAIN to be exploited in a public deployment  
**Impact:** CRITICAL — unlimited AI spend; document exfiltration; case data manipulation  
**Current mitigation:** Backend not publicly deployed (no cloud URL confirmed)  
**Required action:** Implement API key auth before any cloud deployment (REM-P1-01)  
**Owner:** Backend developer  
**Deadline:** Before production backend deployment

### RISK-S02 — `extract-zip` Path Traversal in `scripts/puppeteer` — No Patch Available
**Likelihood:** LOW in current deployment (dev-time tool, not in production bundle)  
**Impact:** HIGH if puppeteer is run in CI against untrusted input  
**Current mitigation:** pnpm override pins to `2.0.1` (highest available, still vulnerable)  
**Required action:** Determine if puppeteer is active in CI. If not, remove. If yes, sandbox in isolated container.  
**Owner:** DevOps  
**Deadline:** Next CI audit cycle

### RISK-S03 — Prompt Injection via Uploaded Documents
**Likelihood:** MEDIUM — requires a deliberately adversarial document  
**Impact:** HIGH — could produce fabricated citations that pass the keyword-only server gate  
**Current mitigation:** Citation Gate on frontend catches unrecognised citations as WARN  
**Required action:** Delimit document content in LLM prompts; implement structural backend citation check (REM-P2-05, REM-P1-03)  
**Owner:** Backend developer  
**Deadline:** Before any real case documents are processed

### RISK-S04 — Case Data in `localStorage` Visible to XSS
**Likelihood:** LOW — CSP not set, but no XSS vectors identified in this audit  
**Impact:** MEDIUM — case metadata visible to XSS payload  
**Current mitigation:** No sensitive documents stored in localStorage (only metadata)  
**Required action:** Add CSP headers (REM-P1-02); add "clear session" UI option  
**Owner:** Frontend developer  
**Deadline:** P1

---

## Operational Risks

### RISK-O01 — Backend Requires OPENAI_API_KEY — No Graceful Degradation Notice
**Likelihood:** HIGH in first-time deployment  
**Impact:** MEDIUM — backend starts but all AI features return 503  
**Current mitigation:** Backend returns `HTTP 503: OPENAI_API_KEY not configured`; frontend continues with localStorage  
**Required action:** Add a visible banner in the UI when backend returns 503 on API calls; link to setup guide  
**Owner:** Frontend developer  
**Deadline:** P2

### RISK-O02 — ChromaDB Data Not Backed Up
**Likelihood:** MEDIUM — container restart without volume mount loses vector data  
**Impact:** MEDIUM — all uploaded/indexed documents must be re-ingested  
**Current mitigation:** Source documents are separately stored in `uploaded_cases/`  
**Required action:** Mount ChromaDB as a persistent volume; add backup cron to dump collections  
**Owner:** DevOps  
**Deadline:** P1 for production

### RISK-O03 — `pnpm-lock.yaml` Has Local Drift (Modified, Not Committed)
**Likelihood:** CERTAIN — observed in `git status`  
**Impact:** LOW — may cause `--frozen-lockfile` failure in CI  
**Current mitigation:** CI uses `--frozen-lockfile`; will fail on mismatch  
**Required action:** `git checkout pnpm-lock.yaml` or commit the updated lockfile after review  
**Owner:** Developer  
**Deadline:** Immediate

---

## Risks Accepted (Documented)

| Risk | Acceptance Rationale |
|------|---------------------|
| `minimumReleaseAge: 0` in pnpm-workspace.yaml | CI/Netlify builds require this; documented with intent to restore via env var for local dev |
| Harvey.ai model `gpt-5` does not exist | Feature is disabled (`HARVEY_ENABLED=false`); will not activate until API access obtained |
| Combined `overallAccuracyScore()` percentage in code | Used internally for self-assessment; must be removed from public UI output |
