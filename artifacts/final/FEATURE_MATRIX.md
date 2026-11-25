# FEATURE MATRIX
**Legal Luminaire — Feature Status**  
**Audit Date:** 2026-11-15 | HEAD `bda89ce6227e7f70b9f45af3f4e5f818b0571f92`

This matrix records the November 15 audit. See the [current release decision](../../docs/RELEASE_READINESS.md) and [architecture and triage report](../../LAUNCH_HARDENING_REPORT.md) for the verified offline flows, provider boundaries, and Pleading Chain status.

Status definitions:
- **VERIFIED WORKING** — executed in this audit, output confirmed
- **IMPLEMENTED BUT UNVERIFIED** — code exists and compiles; runtime not confirmed in this audit (requires API keys or live browser)
- **PARTIALLY WORKING** — core logic works; known gaps
- **BLOCKED** — cannot function without a missing prerequisite
- **NOT IMPLEMENTED** — described in specs/roadmap but code absent

---

## Core Citation Safety

| Feature | Status | Evidence |
|---------|--------|---------|
| Citation Gate — real-time text scanning | VERIFIED WORKING | `citation-gate.test.ts` — 364 frontend tests pass; `citation-gate-BSnlxvOK.js` present in dist |
| SAFE/WARN/BLOCKED classification | VERIFIED WORKING | Test suite + code inspection |
| Hard-block on PENDING/FATAL_ERROR citations | VERIFIED WORKING | `blockedFromDraft: true` enforced; test verifies |
| SECONDARY citations flagged with qualification | VERIFIED WORKING | `tierToStatus()` returns WARN for SECONDARY |
| Citation Gate Panel (live sidebar) | IMPLEMENTED BUT UNVERIFIED | Component exists: `CitationGatePanel.tsx`; requires browser |
| Safe Draft Editor with gate wired | IMPLEMENTED BUT UNVERIFIED | `SafeDraftEditor.tsx` imports `scanDraftForCitations` |
| Server-side citation gate (backend) | PARTIALLY WORKING | `_evaluate_citation_gate()` exists but is keyword-only (see SEC-H02) |
| Backend export block on PENDING citations | IMPLEMENTED BUT UNVERIFIED | Logic in `routes.py`; requires running backend |

---

## Verification Engine

| Feature | Status | Evidence |
|---------|--------|---------|
| PRECEDENT_ACCURACY registry (9 entries) | VERIFIED WORKING | `verification-engine.test.ts` passes |
| STANDARDS_ACCURACY registry (5 entries) | VERIFIED WORKING | Code inspection; test passes |
| `getCourtSafePrecedents()` / `getBlockedPrecedents()` | VERIFIED WORKING | Utility functions in `verification-engine.ts`; tested |
| `generateAccuracyReport()` | VERIFIED WORKING | Function present and tested |
| Tier upgrade path (PENDING → VERIFIED) | IMPLEMENTED BUT UNVERIFIED | Requires manual data entry + re-deployment |
| Para-level citation references (some) | PARTIALLY WORKING | p4, p5, p10 have `para` field; p1, p2, p3 do not |

---

## Limitation & Deadline Engine

| Feature | Status | Evidence |
|---------|--------|---------|
| Deterministic deadline computation | VERIFIED WORKING | 50/50 pytest tests passing |
| CrPC §167, §173, §309, §439, §468 rules | VERIFIED WORKING | V01–V07 hand-computed tests pass |
| Calendar-day and working-day rules | VERIFIED WORKING | B01–B12 boundary tests pass |
| CANNOT_COMPUTE for missing dates | VERIFIED WORKING | V05, U05–U07 tests pass |
| Bilingual (EN + HI) basis strings | VERIFIED WORKING | U06, U16 tests confirm Hindi text present |
| TC-01 event file integration | VERIFIED WORKING | V08–V10 tests pass against actual JSON file |
| Copilot citation snippet format | VERIFIED WORKING | C01–C07 tests pass |
| Deadline Board UI rendering | IMPLEMENTED BUT UNVERIFIED | `DeadlineBoard.tsx` exists; requires browser |
| Court holiday calendar exclusion | NOT IMPLEMENTED | Known gap; 1.4× approximation used with disclaimer |
| Vacation period exclusion | NOT IMPLEMENTED | Explicitly documented in source as not implemented |

---

## Document Intelligence

| Feature | Status | Evidence |
|---------|--------|---------|
| PDF/DOCX/MD/TXT file upload | IMPLEMENTED BUT UNVERIFIED | `routes.py` upload endpoint; extension validation present |
| OCR for scanned documents (pytesseract) | IMPLEMENTED BUT UNVERIFIED | `requirements.txt` includes `pytesseract`; `rag/advanced_processor.py` has `classify_document_type` |
| ChromaDB vector ingestion | IMPLEMENTED BUT UNVERIFIED | `rag/document_store.py`; requires OPENAI_API_KEY |
| BM25 + semantic hybrid retrieval | IMPLEMENTED BUT UNVERIFIED | `rag/hybrid_search.py` — has import error in test context |
| Case-isolated vector collections | IMPLEMENTED BUT UNVERIFIED | `rag/case_isolated_store.py` |
| Document deduplication | IMPLEMENTED BUT UNVERIFIED | `src/lib/document-dedup.ts` |
| Contradiction detection | IMPLEMENTED BUT UNVERIFIED | `routes_collision.py` |
| Cryptographic file hashes / provenance | NOT IMPLEMENTED | No hash field in upload response model |
| Document version history | NOT IMPLEMENTED | Not in codebase |

---

## Legal Research (AI-Assisted)

| Feature | Status | Evidence |
|---------|--------|---------|
| Multi-agent research pipeline (CrewAI) | IMPLEMENTED BUT UNVERIFIED | `agents/crew.py`; requires OPENAI_API_KEY + CrewAI venv |
| Fact-Fit Gate (3-axis scoring) | IMPLEMENTED BUT UNVERIFIED | `agents/fact_fit_engine.py`; scores hardcoded in data |
| Hallucination breaker agent | IMPLEMENTED BUT UNVERIFIED | `agents/hallucination_breaker.py` |
| Indian Kanoon search tool | IMPLEMENTED BUT UNVERIFIED | `agents/tools.py` — `indian_kanoon_search` |
| Tavily web search | IMPLEMENTED BUT UNVERIFIED | Requires `TAVILY_API_KEY` |
| Jurisdiction filter | NOT IMPLEMENTED | No explicit jurisdiction parameter in research API |
| Statutory versioning | NOT IMPLEMENTED | No version-aware statute lookup |
| Source freshness indicators | PARTIALLY WORKING | `date` field on precedents; no automated staleness check |
| Ask Copilot — citation-or-refuse | IMPLEMENTED BUT UNVERIFIED | `routes_copilot.py`; test has import error |

---

## Drafting & Workflow

| Feature | Status | Evidence |
|---------|--------|---------|
| Discharge Application (TC-01) | IMPLEMENTED BUT UNVERIFIED | Multiple `.lex` templates in `uploaded_cases/TC-01/` |
| Bilingual side-by-side draft editor | IMPLEMENTED BUT UNVERIFIED | `BilingualSideBySideEditor.tsx` |
| Draft template library | IMPLEMENTED BUT UNVERIFIED | `src/data/draft-template-library.ts` |
| Court formatter (style output) | IMPLEMENTED BUT UNVERIFIED | `CourtFormatterPage.tsx` + `lib/court-formatter.ts` |
| DraftFamilyPanel (variant chains) | IMPLEMENTED BUT UNVERIFIED | `DraftFamilyPanel.tsx` |
| Pre-filing checklist | IMPLEMENTED BUT UNVERIFIED | `FilingChecklist.tsx` |
| Human advocate approval step | NOT IMPLEMENTED | No approval workflow; `FilingChecklist` is a display only |

---

## Chronology Studio

| Feature | Status | Evidence |
|---------|--------|---------|
| Timeline view (UI) | IMPLEMENTED BUT UNVERIFIED | `TimelineView.tsx` |
| Chronology proposal API | IMPLEMENTED BUT UNVERIFIED | `routes_chronology.py` |
| Source-cited event extraction | IMPLEMENTED BUT UNVERIFIED | Spec in `.kiro/specs/chronology-studio/` |

---

## Privacy & Redaction

| Feature | Status | Evidence |
|---------|--------|---------|
| Aadhaar redaction | VERIFIED WORKING | Code in `redaction_utils.py`; pattern covers 12-digit format |
| PAN redaction | VERIFIED WORKING | Regex confirmed |
| Phone number redaction | VERIFIED WORKING | +91 and 10-digit patterns present |
| Email redaction | NOT IMPLEMENTED | No email pattern (see LAR-M02) |
| Passport / Voter ID redaction | NOT IMPLEMENTED | No patterns |

---

## Infrastructure Arbitration Cases (TC-22 to TC-26)

| Feature | Status | Evidence |
|---------|--------|---------|
| InfraArb case browser | IMPLEMENTED BUT UNVERIFIED | `InfraArbBrowser.tsx`, `InfraArbClaimPage.tsx` |
| TC-22..TC-26 document sets | VERIFIED WORKING | Files exist in `uploaded_cases/TC-22..TC-26/` |
| Arbitration claim templates | IMPLEMENTED BUT UNVERIFIED | Multiple `.lex` files in TC-22/ |

---

## Bilingual Support

| Feature | Status | Evidence |
|---------|--------|---------|
| English/Hindi side-by-side view | IMPLEMENTED BUT UNVERIFIED | `BilingualSideBySideEditor.tsx` |
| Bilingual deadline basis strings | VERIFIED WORKING | `basis_en` + `basis_hi` in deadline engine; tested |
| Hindi discharge application template | IMPLEMENTED BUT UNVERIFIED | `SUPERIOR_HINDI_DISCHARGE_APPLICATION_FULL.lex` |
| Bilingual legal notices | IMPLEMENTED BUT UNVERIFIED | `CLAIM_STATEMENT_HINDI.lex` |
| Translation quality verification | NOT IMPLEMENTED | Translations are machine-assisted; not verified against official Hindi judgments |

---

## Demo & Testing Infrastructure

| Feature | Status | Evidence |
|---------|--------|---------|
| 26 demo cases | IMPLEMENTED BUT UNVERIFIED | `src/data/demo-cases/`, `uploaded_cases/TC-01..TC-26/` |
| TC-01 Hemraj stadium collapse (complete) | VERIFIED WORKING | 25 documents; deadline events file; test suite |
| DemoCaseBrowser UI | IMPLEMENTED BUT UNVERIFIED | `DemoCaseBrowser.tsx` |
| Accuracy Academy | IMPLEMENTED BUT UNVERIFIED | `AccuracyAcademy.tsx`, `AccuracyAcademyPage.tsx` |
| Self-assessment tests | VERIFIED WORKING | `__tests__/self-assessment.test.ts` passes |
