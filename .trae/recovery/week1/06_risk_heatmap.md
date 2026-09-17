# Week 1 — Risk Heatmap

> Source: `detailed_recovery_plan.md` Day 7. Every inventoried module is triaged into one of four buckets below so the recovery board can sequence stabilization work.
> Document created 2026-09-14 (Recovery Day 1).

---

## 1. Business-critical and unstable

| Module Name | Path(s) | Bucket | 1-sentence Rationale | Owner Status |
|---|---|---|---|---|
| FastAPI backend root + main entry | `artifacts/legal-luminaire/backend/main.py`, `artifacts/legal-luminaire/backend/config.py` | Business-critical and unstable | Every user-facing page hits the FastAPI entry; no CI tests exercise startup path, multiple ad-hoc `_check*.py` debug scripts leak into root, and env/config ownership is unresolved. | UNOWNED [G-3] |
| API routes family (18 routers) | `artifacts/legal-luminaire/backend/api/routes*.py` (18 files) | Business-critical and unstable | Every feature page depends on these routers; no end-to-end test coverage, ownership is provisional only, and scattered stress-test/ingest scripts indicate runtime instability. | User (default) — Provisional |
| RAG + document store + search index | `artifacts/legal-luminaire/backend/rag/` | Business-critical and unstable | All drafting, research, and citation pages rely on RAG retrieval; no owner assigned, hybrid search + query classifier + standards index share no test harness, and `law_db.json` is an opaque in-repo blob. | UNOWNED [G-2] |
| CaseContext + case-store + multi-case-store | `artifacts/legal-luminaire/src/context/CaseContext.tsx`, `artifacts/legal-luminaire/src/lib/case-store.ts`, `artifacts/legal-luminaire/src/lib/multi-case-store.ts` | Business-critical and unstable | Every case-aware page pulls from these stores; two store implementations coexist with no clear migration path, hydration race conditions are documented in `MULTI_CASE_IMPLEMENTATION.md`, and no unit tests cover either. | User (default) — Provisional |
| Registry + uploaded_cases data layer | `artifacts/legal-luminaire/backend/registry/`, `artifacts/legal-luminaire/src/cases/registry.ts` | Business-critical and unstable | Case metadata is non-recoverable if the registry drifts; Python and TS registries are duplicated with no sync contract, owner is unfilled, and no schema validation enforces parity. | UNOWNED [G-2] |
| Search trifecta (3 implementations) | `artifacts/legal-luminaire/src/lib/search.ts`, `artifacts/legal-luminaire/src/lib/legal-search-client.ts`, `artifacts/legal-luminaire/backend/api/routes_search.py` | Business-critical and unstable | Three parallel search stacks (client lib, legal client, backend router) with unclear call boundaries; duplicate logic, no owner, and CI does not exercise the search paths end-to-end. | UNOWNED [G-2] |
| Feature flags duality | `artifacts/legal-luminaire/src/config/featureFlags.ts`, `artifacts/legal-luminaire/src/lib/featureFlags.ts` | Business-critical and unstable | Two unrelated feature-flag modules ship side-by-side; no owner for flag lifecycle, both patches reference flags differently, and no audit of stale flags exists. | UNOWNED [G-3] |
| CI workflows (ci.yml + security-audit.yml) | `.github/workflows/ci.yml`, `.github/workflows/security-audit.yml` | Business-critical and unstable | Release gates depend on these workflows; owner unfilled, `req-streamlit` is explicitly missing from the audit per inventory, and there is no workflow covering the Express api-server artifact. | UNOWNED [G-4] [G-1] |
| Docker + Netlify + Vercel deploy configs | `artifacts/legal-luminaire/Dockerfile.frontend.optimized`, `artifacts/legal-luminaire/backend/Dockerfile.optimized`, `artifacts/legal-luminaire/vercel.json`, `artifacts/legal-luminaire/nginx.conf`, `docker-compose.yml`, `artifacts/legal-luminaire/public/_redirects` | Business-critical and unstable | Production deployability relies on 6+ config files across 2 artifacts; no CI verifies Docker builds, no rollback owner is named, and nginx+Netlify+Vercel redirects may conflict at runtime. | UNOWNED [G-4] |
| Neo4j graph client | `artifacts/legal-luminaire/backend/graph/neo4j_client.py` | Business-critical and unstable | Citation-graph and case-similarity pages fail without this client; owner unfilled, no connection-health check, no integration tests, and error handling paths from inventory suggest runtime failures. | UNOWNED [G-2] |

---

## 2. Business-critical but stable

| Module Name | Path(s) | Bucket | 1-sentence Rationale | Owner Status |
|---|---|---|---|---|
| Agents family (drafter, researcher, fact-checker, etc.) | `artifacts/legal-luminaire/backend/agents/` (9 modules) | Business-critical but stable | Core drafting and research agent pipeline drives the product's main value; despite provisional ownership, each agent has a single-responsibility file structure and `crew.py` orchestrates deterministically. | User (default) — Provisional |
| Express api-server (Artifact B) | `artifacts/api-server/src/` | Business-critical but stable | Separate Node/Express API surface for bills, correspondence, parties, and notices; self-contained with a clean routes/ folder, dedicated logger, and no duplicate implementations within the artifact. | User (default) — Provisional |
| Frontend routes.tsx (App routing) | `artifacts/legal-luminaire/src/routes.tsx` | Business-critical but stable | Single source of truth for page navigation; declarative React Router structure, one import point, and no duplicate routing layers detected in inventory. | User (default) — Provisional |
| Chronology + deadlines feature modules | `artifacts/legal-luminaire/src/features/chronology/`, `artifacts/legal-luminaire/src/features/deadlines/`, `artifacts/legal-luminaire/backend/api/routes_chronology.py`, `artifacts/legal-luminaire/backend/api/routes_deadlines.py` | Business-critical but stable | Dedicated feature folders on both sides with matching backend routes; specs exist in `.kiro/specs/`, and the separation of concerns from drafting code keeps blast radius small. | User (default) — Provisional |
| Citation-graph + case-similarity modules | `artifacts/legal-luminaire/backend/api/routes_graph.py`, `artifacts/legal-luminaire/backend/api/routes_similarity.py`, `artifacts/legal-luminaire/backend/agents/case_similarity.py`, `artifacts/legal-luminaire/src/pages/CitationGraphPage.tsx`, `artifacts/legal-luminaire/src/pages/CaseSimilarityPage.tsx` | Business-critical but stable | Backend route + agent + frontend page trio mirrors Chronology's proven pattern; individual Kiro specs exist for citation deeplink, reducing ambiguity. | User (default) — Provisional |
| Copilot module (frontend + backend) | `artifacts/legal-luminaire/src/features/copilot/`, `artifacts/legal-luminaire/src/pages/CopilotPage.tsx`, `artifacts/legal-luminaire/backend/api/routes_copilot.py`, `artifacts/legal-luminaire/backend/tests/test_copilot.py` | Business-critical but stable | The only backend module with a dedicated test file (`test_copilot.py`); feature spec exists in `.kiro/specs/ask-copilot/`, and the stack traces a clean feature→page→route path. | User (default) — Provisional |
| MatterDraftingStudio page | `artifacts/legal-luminaire/src/pages/` (drafting surface pages incl. AIDraftEngine, SafeDraftPage, DraftVariantsPage) | Business-critical but stable | Core drafting UX surface; pages compose shared UI components consistently, routing is centralized in routes.tsx, and page-level files follow a predictable naming convention. | User (default) — Provisional |
| DraftFamilyPanel + draft-family lib | `artifacts/legal-luminaire/src/pages/DraftFamilyPanel.tsx`, `artifacts/legal-luminaire/src/lib/draft-family.ts` | Business-critical but stable | Panel + lib pair matches the page→lib pattern used elsewhere; user opened `draft-family.ts` confirming active maintenance, and file naming aligns with inventory conventions. | User (default) — Provisional |
| ChronologyPage + DeadlinePage | `artifacts/legal-luminaire/src/pages/ChronologyPage.tsx`, `artifacts/legal-luminaire/src/pages/DeadlinePage.tsx` | Business-critical but stable | Pages consume the dedicated chronology/deadlines feature modules; no duplicate implementations, and each page maps 1:1 to a backend route file. | User (default) — Provisional |

---

## 3. Low criticality and messy

| Module Name | Path(s) | Bucket | 1-sentence Rationale | Owner Status |
|---|---|---|---|---|
| Dual toast + toaster UI components | `artifacts/legal-luminaire/src/components/ui/toast.tsx`, `artifacts/legal-luminaire/src/components/ui/toaster.tsx`, `artifacts/legal-luminaire/src/components/ui/sonner.tsx`, `artifacts/mockup-sandbox/src/components/ui/toast.tsx`, `artifacts/mockup-sandbox/src/components/ui/sonner.tsx` | Low criticality and messy | Toast UX duplicates across 2 artifacts with 3 component variants (toast/toaster/sonner); pages may use either, but a broken toast never blocks a workflow. | User (default) — Provisional |
| Dual layout / sidebar components | `artifacts/legal-luminaire/src/components/layout/Layout.tsx`, `artifacts/legal-luminaire/src/components/layout/Sidebar.tsx`, `artifacts/legal-luminaire/src/components/ui/sidebar.tsx`, `artifacts/mockup-sandbox/src/components/ui/sidebar.tsx` | Low criticality and messy | Two sidebar paradigms (`components/layout/Sidebar.tsx` vs shadcn `components/ui/sidebar.tsx`) plus a sandbox copy; visual chrome only, so mismatch degrades UX without breaking features. | User (default) — Provisional |
| Drafting variants + derivatives + bilingual modules | `artifacts/legal-luminaire/src/hooks/usePleadingVariants.ts`, `artifacts/legal-luminaire/src/lib/variantsApi.ts`, `artifacts/legal-luminaire/src/lib/bilingual-draft.ts`, `artifacts/legal-luminaire/backend/api/routes_derivative.py`, `artifacts/legal-luminaire/backend/api/routes_drafting.py`, `artifacts/legal-luminaire/src/pages/DraftVariantsPage.tsx`, `artifacts/legal-luminaire/src/pages/BilingualDraftPage.tsx` | Low criticality and messy | Pleading variants, derivatives, and bilingual draft are scattered across hooks/lib/routes/pages with no single entry; falling back to the base draft engine still produces output, so blast radius is low. | User (default) — Provisional |
| mockup-sandbox UI duplicates | `artifacts/mockup-sandbox/src/components/ui/` (44 files) | Low criticality and messy | Near-complete copy of the shadcn UI kit duplicated from `artifacts/legal-luminaire/src/components/ui/` with subtle drift (e.g., `alert-dialog.tsx`, `aspect-ratio.tsx`, `button-group.tsx` exist only in sandbox); sandbox is a design preview artifact, not production surface. | User (default) — Provisional |
| Accuracy academy module | `artifacts/legal-luminaire/src/features/academy/`, `artifacts/legal-luminaire/src/__tests__/academy.test.ts`, `.kiro/specs/accuracy-academy/` | Low criticality and messy | Standalone training feature isolated from the drafting pipeline; spec exists and a test file exists, but feature folder, test file, and spec folder sit in 3 unrelated tree locations. | User (default) — Provisional |

---

## 4. Unknown risk

| Module Name | Path(s) | Bucket | 1-sentence Rationale | Owner Status |
|---|---|---|---|---|
| Backend tests/ directory | `artifacts/legal-luminaire/backend/tests/` (`__init__.py`, `conftest.py`, `test_copilot.py`) | Unknown risk | Only one real test file (`test_copilot.py`) exists in a 9+ module backend; unclear whether tests are intentionally minimal or abandoned, and conftest.py signals intent that was never fulfilled. | UNOWNED [G-2] |
| Drafting engine internals (blocks, grounds, catalog, conflicts, prompts) | `artifacts/legal-luminaire/backend/drafting/` (8 modules incl. `architecture.py`, `blocks.py`, `catalog.py`, `conflicts.py`, `engine.py`, `grounds.py`, `placeholders.py`, `prompts.py`) | Unknown risk | Eight tightly-coupled drafting sub-modules with no inventory doc describing their call graph, no individual test coverage, and no named owner beyond the backend-wide provisional assignment; unclear which files are active vs legacy scaffolding. | UNOWNED [G-2] |
| Frontend lib catch-all (case-templates, citation-gate, document-dedup, input-quality, verification-engine, case01-data) | `artifacts/legal-luminaire/src/lib/` (case-templates.ts, citation-gate.ts, document-dedup.ts, input-quality.ts, verification-engine.ts, case01-data.ts, recent-cases.ts, intake-schema.ts, date-validator.ts, citation-formatter.ts) | Unknown risk | Eleven miscellaneous `lib/` files outside the inventoried case-store/search/draft-family group; import graphs were not traced in inventory, owner is not individually assigned, and active status per file is undetermined. | User (default) — Provisional |
| Data blobs + demo-cases packs | `artifacts/legal-luminaire/src/data/demo-cases/`, `artifacts/legal-luminaire/src/data/stub-cases/`, `artifacts/legal-luminaire/src/data/` (12 data files), `artifacts/legal-luminaire/src/cases/hemraj-case-01.ts` | Unknown risk | Case data and demo packs live in three disjoint folders (`src/cases`, `src/data/demo-cases`, `src/data/stub-cases`) with cross-references in `all-demo-cases.ts` and `case-pack-paths.ts`; no owner, no schema validation, and unclear refresh cadence. | UNOWNED [G-2] |

---

## § Interpretation

### Heuristics applied

**Business-critical** = every user-facing page relies on it, OR the data it holds is non-recoverable if lost.
Concretely: FastAPI entry, API routers, RAG store, case registry, case stores, search stack, feature flags, CI/release gates, deploy configs, and the Neo4j client all qualify because a defect in any of them either breaks every page or destroys data that has no backup path.

**Unstable** = ≥2 of the following four signals are present:
1. Explicit ownership gap (UNOWNED with a G-1..G-4 reference from `01_roles_and_ownership.md`)
2. Duplicate or competing implementations inventoried (e.g., two case stores, three search paths, two feature-flag files, two sidebar systems)
3. CI / test coverage absent for the module's happy path
4. Inventory or in-repo evidence of known runtime failures (scattered debug scripts, unmerged patch diffs, migration docs describing races)

A module in **Bucket 1** is therefore both irreplaceable to the product AND currently unreliable. Recovery work should begin here, ordered by count of unstable signals.

**Messy** = code structure, location, or naming diverges from the standard page→lib→route→feature pattern used by the healthy modules (chronology, copilot, citation-graph), but the module is not on the critical path for core drafting output. Messy modules cost time during edits and reviews; they do not (yet) cost users.

**Unknown risk** = (a) no individually named owner AND (b) inventory did not establish active-status or import-reach. These modules require a quick audit (owner + 30-minute trace) before they can be promoted to Bucket 2 or demoted to Bucket 3. Until then, they are treated as watch-list items on the recovery board.

### How to use this heatmap

1. Day 3–4: Triage every **Business-critical and unstable** row, assigning a named owner and drafting a stabilization task per row.
2. Day 5: Close the four G-gaps in `01_roles_and_ownership.md` so new rows cannot default to UNOWNED.
3. Week 2: Audit the **Unknown risk** rows; move each row into Bucket 2, 3, or 1 with evidence.
4. Week 2–3: Clean up **Low criticality and messy** rows as time permits between critical-path milestones.
