# REPOSITORY INVENTORY
**Audit Date:** 2026-11-15  
**HEAD SHA:** `bda89ce6227e7f70b9f45af3f4e5f818b0571f92`  
**Branch:** `main` (tracked: `origin/main`)  
**Working-tree status:** 1 modified file — `pnpm-lock.yaml` (uncommitted local drift)  
**Package manager:** pnpm 10.11.0  

---

## 1. Monorepo Root

| Path | Purpose |
|------|---------|
| `package.json` | Workspace root — typecheck, build, daemon scripts |
| `pnpm-workspace.yaml` | Workspace globs + 29 security overrides for CVEs |
| `tsconfig.base.json` | Strict TypeScript base (strict, noImplicitOverride) |
| `docker-compose.yml` | Compose spec (frontend + backend containers) |
| `netlify.toml` | Netlify deploy config |
| `vercel.json` | Vercel SPA rewrite rules |
| `.github/workflows/ci.yml` | CI: typecheck + test + build + smoke checks |
| `.github/workflows/security-audit.yml` | Weekly pnpm audit + pip-audit |
| `CHANGELOG.md` | Manual changelog |
| `ROADMAP.md` | Feature roadmap |
| `SECURITY.md` | Security policy |
| `CODE_OF_CONDUCT.md` | Community guidelines |

---

## 2. Frontend — `artifacts/legal-luminaire/`

**Framework:** React 19.1.0, Vite 7.3.6, TypeScript 5.9, Tailwind CSS 4, Wouter 3.3.5, TanStack Query 5  
**Test runner:** Vitest 4.1.11  
**Build output:** `artifacts/legal-luminaire/dist/public/`

### Key Source Directories

| Path | Contents |
|------|---------|
| `src/App.tsx` | Root component: QueryClient + Providers + Router |
| `src/routes.tsx` | Full route table (Wouter) |
| `src/pages/` | 80+ page components |
| `src/components/views/` | Main view components |
| `src/components/ui/` | Radix-based UI primitives (~50 components) |
| `src/lib/` | Core logic modules |
| `src/lib/citation-gate.ts` | Citation safety scanner (SAFE/WARN/BLOCKED) |
| `src/lib/verification-engine.ts` | Accuracy tier registry (COURT_SAFE → FATAL_ERROR) |
| `src/lib/case01-data.ts` | 19 precedents + 7 standards for Hemraj case |
| `src/lib/chamber-auth.ts` | Chamber-mode authentication |
| `src/lib/limitation_engine` → `services/limitation_engine.py` | Deadline calculation |
| `src/context/CaseContext.tsx` | Multi-case state (localStorage + optional backend) |
| `src/context/AccuracyContext.tsx` | Accuracy metrics context |
| `src/features/` | Feature slices: academy, chronology, copilot, deadlines |
| `src/data/` | Demo cases, stub cases, citations |
| `src/__tests__/` | 13 test files, 364 tests (all passing) |

### Frontend Page Inventory (selected)

| Route/Page | Status |
|-----------|--------|
| Home, DashboardView | Rendered (no backend required) |
| SafeDraftPage + SafeDraftEditor | Citation Gate wired |
| CitationGatePanel | Live sidebar scan |
| DeadlinePage | Renders deadline board |
| ChronologyPage | Timeline studio |
| CopilotPage | Ask Copilot panel |
| BilingualDraftPage | EN/HI side-by-side |
| DemoCaseBrowser + InfraArbBrowser | 26+ demo cases |
| LDR_* pages (8 pages) | Legal draft review pages |
| LPS_* pages (5 pages) | Legal practitioner suite |
| AccuracyAcademyPage | Training module |
| VerificationPanel | Citation status display |
| CourtFormatterPage | Court-style formatter |

---

## 3. Backend — `artifacts/legal-luminaire/backend/`

**Framework:** FastAPI (Python 3.14 / 3.13 for CrewAI)  
**AI:** LangChain 0.3, OpenAI GPT-4o, CrewAI 1.x (optional), ChromaDB  
**OCR:** pytesseract (Tesseract-based)  
**Embeddings:** OpenAI text-embedding-3-small + local SBERT  

### Key Modules

| Module | Purpose |
|--------|---------|
| `main.py` | FastAPI app, CORS, rate limiter, router registration |
| `config.py` | Pydantic-settings config from `.env` |
| `api/routes.py` | File upload, research/draft jobs, chat, observability |
| `api/routes_verify.py` | Citation batch verification against law_db.json |
| `api/routes_copilot.py` | Ask Copilot — citation-or-refuse |
| `api/routes_deadlines.py` | Deadline engine API |
| `api/routes_chronology.py` | Chronology studio API |
| `api/routes_drafting.py` | Drafting pipeline |
| `api/routes_search.py` | Hybrid search (BM25 + semantic) |
| `api/routes_omni.py` | Omni-modal ingestion |
| `api/redaction_utils.py` | Aadhaar/PAN/phone redaction |
| `services/limitation_engine.py` | Deterministic deadline computation |
| `services/limitation_rules.json` | 10+ statutory rules (CrPC/BNSS) |
| `rag/document_store.py` | ChromaDB ingest + retriever |
| `rag/hybrid_search.py` | BM25 + vector hybrid |
| `agents/crew.py` | CrewAI multi-agent pipeline |
| `agents/fact_fit_engine.py` | Fact-fit scoring (3 axes, 0–100) |
| `agents/hallucination_breaker.py` | Hallucination detection |
| `verification/accuracy_pipeline.py` | Accuracy verification pipeline |
| `verification/error_detector.py` | Hallucination + standard error detection |
| `graph/neo4j_client.py` | Optional Neo4j citation graph |

### Backend Test Suite

| File | Tests | Status |
|------|-------|--------|
| `tests/test_deadline_engine.py` | 50 | 50/50 PASSED |
| `tests/test_route_registry.py` | 1 | PASSED |
| `tests/test_stadium_collapse_accuracy.py` | 3 | PASSED (with PytestReturnNotNoneWarning) |
| `tests/test_copilot.py` | — | COLLECTION ERROR (relative import) |
| `tests/test_verification_syntax.py` | — | FIXTURE ERROR (not pytest-style) |

---

## 4. API Server — `artifacts/api-server/`

**Framework:** Express.js (TypeScript)  
**Purpose:** Replit-era companion API server (now largely superseded by FastAPI backend)

---

## 5. Additional Workspace Packages

| Package | Location |
|---------|---------|
| ETERNAL_RESEARCH_CHILD | `ETERNAL_RESEARCH_CHILD/` — Research daemon |
| Scripts | `scripts/` |
| Lib integrations | `lib/` |

---

## 6. Data / Case Assets

| Location | Contents |
|----------|---------|
| `uploaded_cases/TC-01/` | Hemraj stadium collapse (25 documents) |
| `uploaded_cases/TC-22..TC-26/` | Infrastructure arbitration cases |
| `uploaded_cases/imaginary_case_*/` | Demo training cases |
| `real_cases/` | Real case documents (gitignored) |
| `Attached_Assets/` | Supplementary assets |
| `sample_cases/` | Sample input files |

---

## 7. Specification / Design Docs

| Spec | Feature |
|------|---------|
| `.kiro/specs/accuracy-academy/` | Accuracy Academy module |
| `.kiro/specs/ask-copilot/` | Ask Copilot AI assistant |
| `.kiro/specs/chronology-studio/` | Chronology Studio |
| `.kiro/specs/citation-deeplink/` | Citation deep-link |
| `.kiro/specs/deadline-engine/` | Limitation & Deadline Engine |
| `.kiro/specs/redaction-studio/` | PII redaction |
| `.kiro/specs/smart-drop/` | Document smart-drop |
| `.kiro/specs/standards-explorer/` | IS/ASTM standards explorer |
