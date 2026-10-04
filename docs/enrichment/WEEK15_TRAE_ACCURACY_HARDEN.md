# WEEK 15 — TRAE ACCURACY HARDENING REPORT
**Agent**: Trae (Backend / Accuracy Hardening)
**Week Theme**: Copilot grounding, citation deep-links, limitation engine, offline stubs, cost reporting
**Date**: September 2026
**Status**: ✅ COMPLETE — All deliverables committed

---

## EXECUTIVE SUMMARY

Week 15 backend and accuracy hardening completed. Copilot grounding is tightened to
the verified case-law registry only, citation deep-links are functional from every draft
and verification panel, the limitation engine returns deterministic results for the top
test cases, offline/stub coverage is confirmed for TC-01 through TC-21, and lightweight
usage/cost reporting is surfaced via the observability endpoint already scaffolded in Week 4.

---

## 1. COPILOT GROUNDING HARDENED ✅

**File**: `artifacts/legal-luminaire/backend/agents/copilot_agent.py`

- System prompt updated: copilot may only cite case law present in `PRECEDENT_ACCURACY`
  registry (verification-engine.ts mirror in Python: `backend/registry/precedent_registry.py`).
- Any citation not in the allowlist is flagged `NEEDS_VERIFICATION` and blocked from
  the response body — returned only in a `flagged_citations[]` metadata field.
- Verbatim holding rule enforced: if `verifiedHolding` is `null` for an entry, copilot
  is instructed to state "holding text not yet confirmed from certified copy" rather than
  paraphrase.

---

## 2. CITATION DEEP-LINKS ✅

**File**: `artifacts/legal-luminaire/src/components/CitationGatePanel.tsx`

- Each `CitationMatch` result now renders a clickable deep-link:
  - `COURT_SAFE` / `VERIFIED` → links to `sourceUrl` (Indian Kanoon / SCC Online).
  - `SECONDARY` → links with a `⚠` prefix and tooltip: "Verify before filing."
  - `PENDING` / `BLOCKED` → no link; shows lock icon + statusNote only.
- Deep-links open in new tab with `rel="noopener noreferrer"`.
- Accessible: `aria-label` set to `"Open source: {caseName}"`.

---

## 3. LIMITATION ENGINE DETERMINISM ✅

**File**: `artifacts/legal-luminaire/backend/agents/limitation_engine.py`

- Added deterministic seed for Rajasthan HC calendar (Diwali vacation, summer recess,
  Jodhpur/Jaipur bench schedule) sourced from publicly available HC notification PDFs.
- All date calculations now use `datetime.date` (not `datetime.datetime`) to avoid
  timezone-drift across IST / UTC boundaries.
- TC-01 (Hemraj), TC-11 (PC Act bribery), TC-10 (service writ) limitation outputs are
  now stable across repeated calls with the same input dates.
- Edge case: if `firDate` or `orderDate` is missing → engine returns
  `{"status": "INDETERMINATE", "reason": "Date field missing — cannot compute limitation"}`.

---

## 4. OFFLINE / STUB COVERAGE ✅

**Files**: `artifacts/legal-luminaire/backend/rag/offline_stubs.py`

Confirmed stub coverage for all 21 functional test cases (TC-01 through TC-21):
- Each case has a pre-seeded ChromaDB collection entry for offline/demo mode.
- Stubs return the top 3 verified precedents (from `PRECEDENT_ACCURACY` registry) with
  correct Fact-Fit scores so the demo path works without a live LLM call.
- TC-07 (medical negligence) and TC-13 (POCSO) stubs include the mandatory
  `BLOCKED_ACTIVE_MATTER` guardrail — no strategy output, triage memo only.

Error surfaces hardened:
- All FastAPI routes return structured `{"error": "...", "code": "..."}` JSON (not 500 HTML).
- Upload endpoint returns `{"error": "File too large", "maxMB": 25}` on size violation.
- ChromaDB collection-not-found → graceful fallback to stub, not crash.

---

## 5. USAGE / COST REPORTING VISIBILITY ✅

**File**: `artifacts/legal-luminaire/src/components/views/ResearchImprovementView.tsx`

- Added a collapsible "Session Usage" card at the top of the Improvement Lab that calls
  `GET /api/v1/observability/session-summary`.
- Shows: requests made this session, approximate tokens used, estimated cost (USD),
  and per-step breakdown (upload / index / research / draft).
- Falls back gracefully: if backend is offline (static Netlify demo), shows
  "Backend offline — usage data unavailable."
- Bilingual labels: English + Hindi cost/token labels.

---

## ACCEPTANCE CRITERIA CHECK

| Criterion | Status |
|-----------|--------|
| Copilot only cites allowlisted registry entries | ✅ |
| Unknown citations → `NEEDS_VERIFICATION` flag | ✅ |
| Citation deep-links functional from every draft + gate panel | ✅ |
| Limitation engine deterministic on TC-01, TC-10, TC-11 | ✅ |
| All TC-01..TC-21 have offline stubs | ✅ |
| Error surfaces return structured JSON (no 500 HTML) | ✅ |
| Session usage card visible at `/improvement-lab` | ✅ |
| `WEEK15_TRAE_ACCURACY_HARDEN.md` committed | ✅ This file |

---

## HAND-OFF NOTES FOR ANTIGRAVITY (WEEK 16)

1. Full E2E browser walkthrough: landing → Demo Mode → guided flow → verification report
   → pre-filing checklist. Target < 5 minutes for a non-technical judge.
2. Submission kit for vibecode.law: title, tagline, practice-area tags, screenshots,
   60-second video script.
3. Tag `v2.3.0-competition`, update CHANGELOG.md, produce "Why this wins" brief.
4. All protected files must be confirmed intact before tagging.
5. `pnpm install --frozen-lockfile && pnpm run typecheck && pnpm --filter @workspace/legal-luminaire run build`
   must pass clean before tag.
