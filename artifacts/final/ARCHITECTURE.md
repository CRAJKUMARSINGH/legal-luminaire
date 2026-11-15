# ARCHITECTURE
**Legal Luminaire — System Architecture**  
**Audit Date:** 2026-11-15 | HEAD `bda89ce6227e7f70b9f45af3f4e5f818b0571f92`

---

## 1. Overview

Legal Luminaire is a bilingual (English/Hindi) Indian litigation intelligence workbench. It is structured as a pnpm monorepo with a React frontend and an optional FastAPI backend. The frontend is fully functional without the backend (using `localStorage` for persistence); the backend unlocks AI research, document ingestion, and RAG-grounded drafting.

```
┌─────────────────────────────────────────────────────┐
│  Browser (React 19 / Vite / Wouter)                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Citation    │  │ Verification │  │ Deadline   │ │
│  │ Gate (TS)   │  │ Engine (TS)  │  │ Board      │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │  CaseContext (localStorage + optional backend) │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────┘
                           │ HTTP /api/v1/* (optional)
┌──────────────────────────▼──────────────────────────┐
│  FastAPI Backend (Python 3.14)                      │
│  ┌────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Research   │  │ Limitation   │  │ Chronology │  │
│  │ + CrewAI   │  │ Engine (det.)│  │ Studio     │  │
│  └────────────┘  └──────────────┘  └────────────┘  │
│  ┌────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ ChromaDB   │  │ Hybrid BM25  │  │ Redaction  │  │
│  │ (vector)   │  │ + Semantic   │  │ (Aadhaar/  │  │
│  └────────────┘  └──────────────┘  │  PAN/Phone)│  │
│                                    └────────────┘  │
│  ┌─────────────────────────────────────────────┐   │
│  │  Rate Limiter (in-memory, 10 req/min)        │   │
│  │  CORS Middleware                             │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Routing
- **Router:** Wouter 3.3.5 (lightweight, no React Router dependency)
- **Route file:** `src/routes.tsx` — 80+ routes
- **Code splitting:** Vite manual chunks (`vendor`, `router`, `ui`, `utils`)

### 2.2 State Management
- **Case State:** `CaseContext.tsx` — Zustand-like context with `localStorage` persistence and optional backend sync
- **Accuracy State:** `AccuracyContext.tsx` — citation tier counts
- **Server State:** TanStack Query v5 — API calls with retry and stale-time policies

### 2.3 Citation Safety Layer (always-on, no backend required)
```
User types in SafeDraftEditor
  → CitationGatePanel subscribes (debounced)
  → citation-gate.ts scanDraftForCitations(text)
  → Regex patterns extract citation strings
  → lookupRegistry() fuzzy-matches against PRECEDENT_ACCURACY
  → Returns GateResult {overallStatus, matches, hardBlock}
  → "BLOCKED" citations prevent finalization
  → "WARN" citations show qualification note
  → "SAFE" citations show green tick
```

### 2.4 Verification Engine
- Authoritative source of truth for all 9 precedents and 5 standards
- Tiers: `COURT_SAFE → VERIFIED → SECONDARY → PENDING → FATAL_ERROR`
- Utility functions: `getCourtSafePrecedents()`, `getBlockedPrecedents()`, `generateAccuracyReport()`
- Used by Citation Gate, Verification Dashboard, pre-filing checklist

### 2.5 Limitation Engine (frontend display)
- `src/features/deadlines/DeadlineBoard.tsx` renders deadlines from backend API
- Fallback to hardcoded TC-01 dates for demo without backend

---

## 3. Backend Architecture

### 3.1 Application Lifecycle
```
startup (lifespan):
  → mkdir chroma_path, case_docs_path
  → if OPENAI_API_KEY: preload_hemraj_case() into ChromaDB
  → register 15 routers at /api/v1/*
  → start CORS + rate-limit middleware
```

### 3.2 Multi-Agent Research Pipeline (CrewAI)
```
POST /api/v1/cases/{id}/research
  → UploadedDocuments? → RAG retriever (ChromaDB, k=10)
  → run_legal_crew(query, case_context, mode)
     ├── LegalResearcher agent
     ├── FactFitEngine (3-axis scoring)
     ├── HallucinationBreaker
     └── DraftingAgent (temperature=0.2)
  → _evaluate_citation_gate(draft) [keyword scan]
  → Return job_id → poll GET /research/{job_id}
```

### 3.3 RAG / Document Store
- **Vector DB:** ChromaDB (local persistence)
- **Embeddings:** OpenAI `text-embedding-3-small` (primary) or local SBERT
- **Chunking:** LangChain text splitters
- **Retrieval:** Hybrid BM25 + semantic (`rag/hybrid_search.py`)
- **Case isolation:** `rag/case_isolated_store.py` — each case has its own ChromaDB collection

### 3.4 Limitation Engine (backend)
- Fully deterministic — no LLM calls
- Rules loaded from `services/limitation_rules.json` (10 rules: CrPC §167, §173, §439, §468, §309, APPEAL-SC-SLP)
- Input: event dates from `TC-xx_Deadline_Events.json`
- Output: `ComputedDeadline` dataclass with `basis_en`, `basis_hi`, `is_synthetic=True`
- Working-day rules use 1.4× factor with explicit disclaimer

### 3.5 Chronology Studio
- POST `/api/v1/case/{id}/chronology/propose` — extracts timeline events from documents
- Source-cited: each event carries the document filename and page reference
- Does not silently replace original evidence

---

## 4. Data Flow — Court-Ready Document Export

```
1. Advocate loads case in SafeDraftEditor
2. Types or pastes draft text
3. Citation Gate scans in real-time
4. If hardBlock=true → "Export" button is disabled
5. If overallStatus="WARN" → "Export with Qualification" is offered
6. Advocate clicks Export
7. Frontend sends draft to backend /api/v1/verify-citations
8. Backend checks against law_db.json
9. CitationGate on backend re-evaluates (keyword scan)
10. If citation_gate.must_block → 403 response, export blocked
11. If download_allowed → PDF/LEX file returned
12. Verification Report prepended to output
```

---

## 5. Deployment Architecture

| Environment | Mechanism |
|-------------|-----------|
| Local dev | `pnpm --filter @workspace/legal-luminaire run dev` → localhost:5173 |
| Frontend (Netlify) | Build: `vite build` → `dist/public/` → Netlify CDN |
| Frontend (Docker) | `Dockerfile.frontend.optimized` → nginx serving `dist/public/` |
| Backend (local) | `uvicorn main:app --reload` → localhost:8000 |
| Backend (Docker) | `Dockerfile.optimized` → Python 3.14 + uvicorn |
| Compose | `docker-compose.yml` — both services + network |

**Vite proxy:** `/api/legal/*` → `VITE_BACKEND_URL` (defaults to `http://127.0.0.1:8000`)

---

## 6. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Citation Gate in frontend TypeScript | Works without backend; advocate gets real-time feedback |
| Limitation Engine is deterministic (no LLM) | Deadlines must be reproducible and auditable |
| `is_synthetic=True` on all computed deadlines | Prevents demo data from being used as real court dates |
| `blockedFromDraft: true` default for PENDING | Fail-closed for citation safety |
| `localStorage` fallback for CaseContext | Frontend remains functional without backend |
| Multi-chunk Vite build | Reduces initial JS load; each route loads independently |
| Rate limiting on expensive endpoints | Protects AI credit budget; 10 req/min per IP |
