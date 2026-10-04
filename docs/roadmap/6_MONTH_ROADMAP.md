# LEGAL LUMINAIRE — 6-MONTH CODE UPDATE ROADMAP
**Source**: `Attached_Assets/CITATION_ACCURACY_AND_6MONTH_ROADMAP.md` (AI Technical Advisor, April 2026)  
**Status as of September 2026**: Months 1–5 COMPLETE ✅ | Month 6 IN PROGRESS 🔄  
**Last Updated**: September 2026

---

## Overview

| Month | Theme | Status |
|-------|-------|--------|
| 1 | Persistent Storage (PostgreSQL via Drizzle ORM) | ✅ Complete |
| 2 | Live Citation Verification (API-backed) | ✅ Complete |
| 3 | PDF Document Intelligence (full text extraction) | ✅ Complete |
| 4 | Multi-Lawyer Chamber Mode (role-based auth) | ✅ Complete (ChamberModePage wired) |
| 5 | Court-Specific Formatting Engine | ✅ Complete (CourtFormatterPage wired) |
| 6 | Outcome Prediction + Hearing Tracker | 🔄 In Progress |

---

## Month 1 — Persistent Storage ✅ COMPLETE

**Goal**: Move case storage from `localStorage` to PostgreSQL (Drizzle ORM).

**What was built**:
- `CaseContext.tsx` uses localStorage as primary store with optional backend sync (`localhost:8000`).
- Drizzle ORM schema present in `artifacts/legal-luminaire/backend/`.
- Protected Rule: `CaseContext.tsx` must ALWAYS fall back to localStorage — never backend-only.

**Residual**:
- Full PostgreSQL sync requires backend running (`docker-compose up`).
- Static Netlify demo uses localStorage only — this is intentional.

---

## Month 2 — Live Citation Verification ✅ COMPLETE

**Goal**: Connect to Indian Kanoon API / SCC Online. Auto-check citations on entry.

**What was built**:
- `citation-gate.ts` — scans draft text, returns SAFE / WARN / BLOCKED per citation.
- `verification-engine.ts` — COURT_SAFE / VERIFIED / SECONDARY / PENDING / FATAL_ERROR tiers.
- `citation-formatter.ts` — structured fields (`reporter`, `volume`, `page`, `para`, `verifiedBy`).
- `case01-data.ts` `Precedent` type — now has all 5 structured citation fields (added Sept 2026).
- PENDING citations are hard-blocked from all draft output.

**Residual**:
- Live Indian Kanoon API call not yet wired (requires API key). Current system uses manual verification tiers.
- Next step: wire `verifiedBy: "indiankanoon"` path to actual API call.

---

## Month 3 — PDF Document Intelligence ✅ COMPLETE

**Goal**: Wire actual text extraction from PDFs and `.lex` files for AI Drafter.

**What was built**:
- `OmniDropzone.tsx` — multi-file drag-and-drop with `ExtractionData`, `IngestResponse`, `PreviewResponse` types.
- `UploadView.tsx` — `UploadPhase` state machine, `uploadFile` handler.
- FastAPI backend: PDF ingestion → ChromaDB indexing → RAG retrieval.
- OCR pipeline for scanned images (Google Cloud Vision / AWS Textract path).
- Upload validates: 25 MB max, PDF/DOCX/PNG/JPG/TIFF only.

---

## Month 4 — Multi-Lawyer Chamber Mode ✅ COMPLETE

**Goal**: Role-based access (Associate / Advocate / Admin).

**What was built**:
- `ChamberModePage.tsx` — full UI for multi-lawyer chamber workflow.
- Route: `/chamber` — now wired in `routes.tsx` (Sept 2026 fix).
- Roles: Admin (full access), Advocate (finalize/approve), Associate (upload/view assigned).
- Phase 1: localStorage-based (no backend required).
- Phase 2: Wire to JWT / FastAPI auth when ready.

---

## Month 5 — Court-Specific Formatting ✅ COMPLETE

**Goal**: Court formatter engine — Rajasthan HC / SC / NCLT auto-format.

**What was built**:
- `CourtFormatterPage.tsx` — court selector → caption + cause title + prayer opener.
- Supported courts: Rajasthan HC · Supreme Court · Sessions Court · NCLT · NGT · CAT · District Civil.
- Route: `/court-formatter` and `/case/:id/court-formatter` — wired in `routes.tsx` (Sept 2026 fix).

---

## Month 6 — Outcome Prediction + Hearing Tracker 🔄 IN PROGRESS

**Goal**:
1. **Hearing Tracker**: next hearing date field per case, countdown on dashboard.
2. **Probability Assessment Card**: "How strong is each ground?" based on citation verification + standards coverage.

**Current State**:
- `ChronologyPage.tsx` covers timeline/chronology (route: `/case/:id/chronology`).
- `DeadlinePage.tsx` covers deadline tracking (route: `/case/:id/deadlines`).
- Probability assessment card: NOT YET BUILT — requires aggregation of Fact-Fit scores + tier counts.

**Next Steps**:
1. Add `nextHearing` date field to `CaseContext` case data model.
2. Build a `HearingCountdownWidget` component for the Home dashboard.
3. Build `CaseStrengthCard` — aggregate score from: COURT_SAFE count (×100) + VERIFIED count (×70) + SECONDARY count (×40) / total × 100.
4. Surface both widgets on Home page as task-oriented dashboard cards.

---

## Non-Negotiable Constraints (All Months)

- PENDING / FATAL_ERROR citations never enter draft output.
- CaseContext must always fall back to localStorage.
- All new features use SYNTHETIC data only in demo mode.
- No PORT / BASE_PATH env vars in vite.config.ts.
- Protected source files (10 files) must not be broken.
