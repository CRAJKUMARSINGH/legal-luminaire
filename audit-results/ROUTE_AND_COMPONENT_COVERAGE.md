# ROUTE AND COMPONENT COVERAGE
**Post-Implementation Audit — Application Surface Inventory**  
**Date:** 2026-11-15 | HEAD `10cc700`

---

## 1. Application Surface

| Metric | Count |
|--------|-------|
| `<Route>` definitions in `routes.tsx` | 105 |
| Lazy-loaded page components | 90 |
| Page files in `src/pages/` | 78 |
| Component files in `src/components/` | 121 |
| Total source TS/TSX files (excl tests/node_modules) | 301 |
| Test files (frontend) | 14 |
| Test files (backend) | 6 |

---

## 2. Route Categories

### Core Litigation Workflow
- `/` — Home (with PremiumHeroBanner)
- `/case/:id/dashboard` — Dynamic Dashboard
- `/case/:id/chat` — AI Drafter
- `/case/:id/timeline` — Case Timeline
- `/case/:id/case-law` — Case Law Matrix
- `/case/:id/standards` — Standards Matrix
- `/case/:id/documents` — Documents
- `/case/:id/upload` — Upload Files
- `/case/:id/discharge-application` — Discharge Application
- `/case/:id/discharge-print` — Discharge PDF
- `/case/:id/safe-draft` — Safe Draft (Citation Gate)
- `/case/:id/deadlines` — Deadline Board
- `/case/:id/chronology` — Chronology Studio
- `/case/:id/copilot` — Ask Copilot

### Demo & Browse
- `/demo-cases` — Demo Case Browser (26 cases)
- `/infra-arb` — Infra Arbitration Browser

### Bilingual
- `/case/:id/bilingual-draft` — Bilingual Draft Studio
- `/case/:id/bilingual-generator` — Bilingual Generator

### Legal Research
- `/case/:id/citation-search` — Citation Search
- `/case/:id/citation-authority` — Citation Authority
- `/case/:id/citation-graph` — Citation Graph
- `/case/:id/case-similarity` — Case Similarity
- `/case/:id/judge-analytics` — Judge Analytics

### Document Review (LDR pages)
- 10 LDR routes (Home, Comparison, Motion, Packet, Precedents, Print, Reply, Standards, Timeline, Verification)

### Legal Practitioner Suite (LPS pages)
- 6 LPS routes (Home, Defence, Precedents, PrintLetter, SampleAnalysis, Standards)

### Infrastructure Arbitration
- `/infra-arb-claim/:id` — InfraArb Claim Page

### Intake Examples (Week 1 + Week 4)
- `/intake-examples` — EX-001 to EX-051
- `/example-33` through `/example-41` — Week 4 drafting fixtures

### System & Meta
- `/system/flags` — System Flags (dev)
- `/about` — About Creator
- `/how-to-use` — User Manual
- `/user-manual-print` — Print Manual

---

## 3. Backend API Routes

| Router | Prefix | Key Endpoints |
|--------|--------|--------------|
| `routes.py` | `/api/v1` | Health, Upload, Research/Draft, Chat, Citation Verify |
| `routes_copilot.py` | `/api/v1/copilot` | Health, Ask (flag-gated) |
| `routes_deadlines.py` | `/api/v1` | Case deadlines, Rules |
| `routes_chronology.py` | `/api/v1` | Chronology propose + actions |
| `routes_verify.py` | `/api/v1` | Verify-citations (batch) |
| `routes_search.py` | `/api/v1` | Hybrid search |
| `routes_drafting.py` | `/api/v1` | Drafting pipeline |
| `routes_omni.py` | `/api/v1` | Omni-modal ingestion |
| `routes_cases.py` | `/api/v1` | Multi-case management |
| `routes_oral.py` | `/api/v1` | Oral arguments |
| `routes_lab.py` | `/api/v1` | Research lab |
| `routes_collision.py` | `/api/v1` | Contradiction detection |
| `routes_auto_research.py` | `/api/v1` | Auto research |
| `routes_legal_stream.py` | `/api/v1` | Legal stream |
| `routes_similarity.py` | (root) | Case similarity |
| `routes_analytics.py` | (root) | Analytics |
| `routes_graph.py` | (root) | Citation graph |
| `routes_graph.py` | (root) | Citation graph |

---

## 4. Orphaned Asset Analysis

| Asset Type | Status |
|-----------|--------|
| `src/assets/*.tex` (LaTeX templates) | Used by bilingual draft export paths |
| `src/assets/FSL_TEST_REPORT_*.jpeg` | Used by FSL analysis view |
| `src/fixtures/week04/*.json` (9 fixtures) | Used by Example33-41Page routes |
| `uploaded_cases/TC-01/` (25 files) | Indexed by backend RAG preloader |
| `uploaded_cases/TC-22..TC-26/` | Indexed by backend RAG |
| `uploaded_cases/imaginary_case_*/` | Demo training cases |

No orphaned assets identified that are unsafe to integrate. All demo data is synthetic.

---

## 5. Navigation Integrity

**Test file:** `config/navigation-integrity.test.ts` — ✅ PASSING

This test verifies:
- Every navigation link resolves to a valid route
- No route leads to a blank screen
- Legacy flat paths redirect correctly
- LPS routes map through `LPS_ROUTE_MAP`

---

## 6. Component Integrity

**Test file:** `__tests__/integration-supplements.test.tsx` — ✅ PASSING

Verifies that key page components import and compile cleanly:
- DefenseBrief
- FslAnalysis
- CrossCheckReport
- StandardsIndex

---

## 7. Simulated User Testing Notes

This audit did not run live browser-based user simulations (no browser automation tooling on this machine). The MASTER-APP-TESTER protocol's 125/75/51 user simulation is partially covered by:

- 388 frontend unit/integration tests (route rendering, component compilation)
- Navigation integrity test (all routes resolve)
- Integration supplement test (key pages compile)
- Adversarial citation gate test (injection resistance)

**Coverage gap:** Live browser interaction (back button, form submission, real DOM rendering, responsive layout) is NOT covered by this audit. This is documented as a remaining risk.
