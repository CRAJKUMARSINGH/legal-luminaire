# Week 1 — Day 7: Inconsistencies & Duplication

**Report Date:** 2026-09-14
**Sources:** Frontend Inventory (03) §Inconsistencies Noted Inline (18 entries), Infrastructure Inventory (05) §Mismatches & Hidden Manual Steps (12 entries), Backend Inventory (04) cross-cutting issues (8 findings)

---

## § Inconsistencies

This section consolidates cross-artifact inconsistencies into the 8 Day-7 buckets. Each bucket draws from the three inventories (A = Frontend, B = Infra, C = Backend).

### 1. naming

Naming conventions diverge across files, prefixes, flag keys, and component hierarchies.

**A — Frontend inline findings:**
- **Three coexisting file-naming styles with no project-wide convention:** (a) PascalCase `.tsx` for pages/components (`Home.tsx`, `CaseContext.tsx`), (b) kebab-case for lib/hooks (`draft-family.ts`, `use-bilingual-generator.ts`, `case-store.ts`), (c) camelCase for hooks (`usePleadingVariants.ts`, `useDebounce.ts`). No linter or enforcer picks a winner.
- **Page name prefix mix:** `LDR_CommonPage`, `LDR_HomePage`, `LDR_MotionPage`, `LPS_DefencePage`, `LPS_HomePage` sit side-by-side with unprefixed pages (`DefenseBrief`, `StandardsIndex`, `ChronologyPage`). No canonical rule for when a subsystem (LDR / LPS) gets a prefix vs. not.
- **UI primitive naming split within the same `components/ui/` folder:** `empty.tsx` (shadcn Empty/EmptyHeader compound) vs. `empty-state.tsx` (custom bilingual EmptyState with action buttons); same split pattern for `skeleton.tsx` vs. `skeleton-loaders.tsx` (composite loaders). Two component names for one UX concept.
- **Dual feature-flag files use opposite key conventions:** `config/featureFlags.ts` uses camelCase (`hybridStandardsValidity`, `enableCaseSimilarity`); `lib/featureFlags.ts` uses snake_case (`redaction_studio`, `smart_drop`). Consumers get different shapes depending on which file they import.

**C — Backend findings:**
- **Document-store naming does not communicate which is active:** `rag/document_store.py` vs. `rag/optimized_document_store.py` use names that imply the "optimized" variant is superior, yet only the unoptimized one is wired into `main.py`. Naming hides the real status.

---

### 2. folders

Folder placement and boundaries overlap, creating parallel hierarchies for the same logical concepts.

**A — Frontend inline findings:**
- **Views vs. pages folder mix:** 12 routable view components live in `components/views/` (e.g., `DynamicDashboardView`, `StandardsView`, `ChatView`, `DraftingView`) and are mounted directly in `routes.tsx`, while the remaining 80+ routable surfaces live in `pages/`. Two folder conventions solve the same problem.
- **Two case-data directory trees:** `src/cases/` holds `hemraj-case-01.ts` + `registry.ts`; `src/data/demo-cases/` + `src/data/stub-cases/` hold demo01, infra-arb, week01–week03 intake examples, plus NDPS/NI-Act/Peetambara stubs. Case data is split with no clear ownership or merge path.
- **Bilingual library spread across three folders with no single entry point:** `lib/bilingual-draft.ts` (utilities), `lib/bilingual-form-templates.ts` (EN/HI form data), and `hooks/use-bilingual-generator.ts` (React streaming hook) each own a piece of bilingual drafting. A consumer cannot `import { Bilingual } from '@/lib/bilingual'` — they must hunt three paths.
- **Dual layout components in the same folder:** `components/layout/Layout.tsx` + `app-layout.tsx` coexist, and `Breadcrumbs.tsx` + `BreadcrumbTrail.tsx` also coexist. No document states which is canonical or when to prefer one.

**B — Infrastructure findings:**
- **`vercel.json` deployed in two folders with different build semantics.** The root `vercel.json` runs `cd artifacts/legal-luminaire && npm install --ignore-scripts && npm run build` and sets output `artifacts/legal-luminaire/dist`; the subdir copy at `artifacts/legal-luminaire/vercel.json` only declares SPA rewrites. Deploying from root vs. subdir yields two different build graphs.

**C — Backend findings:**
- **Two backends in two artifact folders exposing the same port.** FastAPI Python backend lives under `artifacts/legal-luminaire/backend/`; Express TypeScript API server lives under `artifacts/api-server/`. Both target port `8000` and expose `/cases`, `/drafts`, `/health` — overlapping route namespaces in unrelated folder trees.

---

### 3. API design

API surface (frontend lib clients + backend HTTP endpoints) has overlapping endpoints, duplicate canonical URLs, and three competing search pipelines.

**A — Frontend inline findings:**
- **Draft-chain API overlap in two lib files:** `lib/draft-family.ts` (Derivative Drafts API — `/derivative/registry`, `/derivative/subject/:id/types`, `/case/:id/derivative/*`) and `lib/variantsApi.ts` (Pleading Chain Engine API — `variantsApi.family()`, `variantsApi.matterContext()`, `variantsApi.generateStream()`) both model derivative-pleading lineages; endpoints conceptually collide and both are imported by active pages (`DraftFamilyPanel` and `DraftVariantsPage`).
- **Search trifecta with unclear boundaries:** three implementations coexist: (1) `lib/search.ts` — pure in-memory stopword + synonym search over static `AUTHORITIES`, (2) `lib/legal-search-client.ts` — HTTP client hitting Express `api-server` at `/api/legal-search?q=`, (3) `lib/modules/search-engine-v2/` — query expansion + multi-factor relevance ranking + search analytics module. No routing logic decides which search caller gets which backend.
- **Duplicate case-storage type definitions:** `lib/case-store.ts` and `lib/multi-case-store.ts` both define `CaseFile`, timeline entries, document entries, and case-law entries with near-identical (but not identical) shapes. Two type registries drift independently.
- **Aliased route duplication without redirect semantics in `routes.tsx`:** the same page component is mounted on 2+ routes with no canonical redirect: `/how-to-use` = `/manual`, `/about` = `/creator`, `/intake-examples` = `/drafting-examples`, `/user-manual-pdf` = `/manual-pdf`. SEO and deep-links get two valid URLs per page.
- **Standards route mounted twice on the same path:** in `routes.tsx`, `/standards` is routed to `StandardsView` both outside case scope (line 178) and inside the case-scoped block (line 223) — two route handlers compete for the same URL.
- **CrossCheckReport served under two canonical names:** `/cross-check-report` and `/verification-report` both render `CrossCheckReport.tsx` with no redirect, duplicating the canonical-URL pattern.

**B — Infrastructure findings:**
- **Frontend Docker healthcheck pinned to non-standard port 5173.** `Dockerfile.frontend.optimized` HEALTHCHECK runs `curl -f http://localhost:5173/` and `nginx.conf` listens 5173 (not Nginx default 80). If the conf is normalized to port 80 the healthcheck silently breaks — the healthcheck design depends on an unusual port choice.

**C — Backend findings:**
- **Dual backends on `:8000` with overlapping route namespaces.** FastAPI exposes `/api/v1/health`, `/cases`, `/drafts` (with LLM/agents/RAG). Express exposes `/health`, `/cases`, `/drafts` (in-memory seeds, no LLM). A frontend misconfigured to hit the wrong `:8000` process gets a different backend with different semantics for the same URL path.

---

### 4. error handling

Error surfaces diverge across routers and CI, producing silent failures or format mismatches.

**A — Frontend inline findings:**
- **Two competing toast error-delivery systems (see §naming / §folders).** Radix `use-toast.ts` fires `toast()` calls that expect the Radix `ui/toaster.tsx` mounted; Sonner `ui/sonner.tsx` exports a second `Toaster` with a different signature. Errors fire one API but mount the wrong toaster get swallowed.

**B — Infrastructure findings:**
- **`security-audit.yml` references a non-existent requirements file.** The workflow runs `pip-audit -r requirements-streamlit.txt`, but `requirements-streamlit.txt` does not exist anywhere in the repo. The Python audit job fails on every PR/push — either the workflow silently breaks branch protection, or failures are ignored and audits are not actually performed.
- **Backend duality + `RUN.bat` spawns the wrong backend.** `RUN.bat` (root Windows launcher) starts `artifacts/api-server` Express (not FastAPI), while `docker-compose.yml` / `backend/start.*` start Python FastAPI. Users following docs inconsistently get a backend that either has or does not have LLM features. Errors look like "endpoint missing" depending on which script launched `:8000`.

**C — Backend findings:**
- **Error handling format drifts across 22 FastAPI route modules.** Some routes raise `HTTPException(status_code=404, detail="Case not found")` (plain string detail); others raise `HTTPException(status_code=400, detail={"code": "INVALID_DATE", "message": "…"})` (JSON dict detail). Frontend clients cannot write a single error parser that handles both shapes.
- **Config defaults all env keys to `""`, converting missing-required-key errors into silent call-time failures.** `config.py` `Settings` declares `openai_api_key: str = ""`, `tavily_api_key: str = ""`, and every other key with a default empty string. The backend boots without secrets, then fails downstream (e.g., on first `/ai-draft` call) with an opaque LLM-auth error instead of failing at startup.

---

### 5. logging

Logging output formats and destinations are mixed across the stack; some modules bypass structured logging entirely.

**B — Infrastructure findings:**
- **`start.bat` runs `python main.py` while `start.sh` runs `uvicorn main:app --reload`.** These two start paths emit different access-log output (Python stdout vs. Uvicorn ASGI formatter), so identical requests produce different on-disk log formats depending on platform.

**C — Backend findings:**
- **Logger usage is uneven across the 22 route modules vs. Uvicorn access logs.** Route modules use named loggers with structured `logger.info("case_id=%s event=%s", case_id, event)` pattern; `main.py` enables Uvicorn's default unstructured access log `%(asctime)s [%(levelname)s] %(name)s %(message)s` plus ASGI request lines. A single request produces entries in two incompatible formats, making log aggregation hard.
- **Express api-server uses Pino structured JSON logs vs. FastAPI Python text logs.** When both backends are present in the same environment (e.g., Replit), one emits JSON and the other emits plain text — no single log shipper configuration ingests both correctly.
- **Scratch scripts print to stdout bypassing the configured logger.** `preload_case01.py`, `seed_26_cases.py`, `stress_test_ingest.py`, and the `_check*.py` / `_inspect*.py` scripts mix `print()` and `pprint()` with occasional logger calls — stdout output cannot be filtered by log level or routed to a file sink.

---

### 6. config loading

Config loading uses divergent validation, flag registries, package managers, and alias strategies across layers.

**A — Frontend inline findings:**
- **Dual feature-flag registries diverge on content and source.** `config/featureFlags.ts` (camelCase, ~30 flags, consumed by `routes.tsx` and `navigation.ts`) is the de facto source of truth but `lib/featureFlags.ts` (snake_case, Week-1 8-flag set) still exists and can be imported by mistake. Importing the wrong file produces silently wrong flag values.
- **Import-alias convention is main-app only — api-server and mockup-sandbox are not verified.** Main app consistently uses `@/` alias (`@/lib/…`, `@/components/…`); `artifacts/api-server` and `artifacts/mockup-sandbox` each have their own tsconfig, so alias usage and tsconfig `paths` consistency across the three artifacts was never validated in a single pass.

**B — Infrastructure findings:**
- **Package manager split across deploy paths.** Root `pnpm-workspace.yaml`, preinstall hook (blocks npm), and all local scripts use `pnpm`. Yet: (1) root `vercel.json` runs `npm install --ignore-scripts` inside `artifacts/legal-luminaire`, (2) deploy docs recommend `npm install` for a Netlify-subdir fallback path. Lockfile resolution differs between the two package managers, producing different dependency graphs in CI vs. deploys.
- **Netlify runs pnpm with `--no-frozen-lockfile` (direct contradiction of CI).** `netlify.toml` sets `PNPM_FLAGS="--no-frozen-lockfile"` because Windows-generated `pnpm-lock.yaml` has platform-specific `ignoredOptionalDependencies` that break Linux builds. CI uses `--frozen-lockfile` per ADR-007 requirement 1. A green CI build does not guarantee Netlify will resolve the same dependency tree — reproducibility is broken.
- **`REDIS_URL` default mismatches between standalone and Compose.** `config.py` default: `redis://localhost:6379/0` (assumes Redis is co-located). `docker-compose.yml` env: `redis://redis:6379/0` (Docker DNS). Running `python main.py` directly outside Compose crashes on first cache access with a connection error instead of gracefully disabling the cache.
- **No frontend `.env.example`; backend has one.** Backend ships `backend/.env.example` with 32 placeholders. Frontend references 11+ `VITE_FF_*` flags + `VITE_BACKEND_URL` across code, but ships no template — a new dev discovers env vars by reading `SystemFlagsPage.tsx`, not a setup doc.

**C — Backend findings:**
- **Frontend has zero centralized env validation; backend has partial validation with silent-empty defaults.** Frontend reads `import.meta.env.VITE_*` inline with optional chaining and default `false` — no Zod or single schema boot-checks. Backend uses `pydantic-settings` `BaseSettings` (typed) but every field defaults `= ""`, so validation never actually rejects a boot with missing keys. Validation is asymmetrical (frontend none, backend partial) and neither side fails fast.
- **Backend `config.py` defaults contradict `backend/.env.example` declared status.** `.env.example` lists `OPENAI_API_KEY` and `TAVILY_API_KEY` as required (no comments marking them optional); `config.py` defaults both to empty string and loads without either — the two config documents disagree on which keys are required.

---

### 7. auth / session

The application has no auth, no session boundary, and no rate-limit enforcement for expensive write endpoints.

**B — Infrastructure findings:**
- **Netlify CSP is overly permissive for WebSocket localhost.** `netlify.toml` Content-Security-Policy `connect-src` allows `ws://localhost:*` (wildcard port). This permits any browser page to open WS connections to arbitrary local ports in production. The rule should be scoped to a specific dev port or removed for production builds entirely.

**C — Backend findings:**
- **No auth system exists in either backend.** FastAPI `main.py` mounts `CORSMiddleware` with `allow_origins=["*"]` and no API-key/JWT middleware. Express `api-server/src/app.ts` mounts no auth middleware (only CORS + cookie-parser). Every endpoint — including `/ai-draft`, `/discharge-application`, `/derivative/*`, `/omni/*` multipart upload, and `/legal-stream` SSE — is fully public.
- **No sessions or user context anywhere.** No session cookies, no signed JWTs, no `user_id` column in case stores, no per-user storage partition in Chroma/Redis. Every client sees and can mutate every case.
- **Rate limits for POST drafting endpoints are not enforced end-to-end.** FastAPI `main.py` declares an in-memory rate limiter in the lifespan but no route module has been verified to consistently apply it to `POST /ai-draft`, `POST /discharge-application`, `POST /derivative/*`, `POST /oral/*`, or `POST /omni/*` — expensive LLM/embedding endpoints can be looped without a cap.

---

### 8. test quality

Tests exist locally but CI skips the majority; test counts in documentation disagree with reality; no migration tests exist.

**B — Infrastructure findings:**
- **Backend CI only runs `python -m compileall` — zero unit tests execute automatically.** `.github/workflows/ci.yml` backend step runs syntax compilation only. Pytest is in `requirements.txt`, `backend/tests/` contains `conftest.py` + 4 test modules (`test_copilot.py`, `test_deadline_engine.py`, `test_drafting_engine.py`, `test_variant_engine.py`), but CI never calls `pytest`. A backend change can break all 4 test suites without the CI gate noticing.
- **No database migration infrastructure or tests exist.** The workspace ships a `SUPPLEMENT/Legal-Luminaire-Agent1/lib/db/` Drizzle ORM package (`drizzle.config.ts`, `src/index.ts`), but no CI step runs `drizzle-kit migrate` / `drizzle-kit push`, no start script runs migrations, and no tests verify schema parity. Schema changes are not gated.

**C — Backend findings:**
- **144 vs. 349 test-count inconsistency in docs.** `artifacts/legal-luminaire/package.json` `pnpm test` (Vitest) README says 349 tests; `docs/DEVELOPER_GUIDE.md` says 144 tests. No single source of truth describes the actual test count or which suites run.
- **Frontend Vitest + backend pytest are not run in the same CI pipeline.** Frontend build + Vitest and backend `compileall` run in CI, but pytest never runs. The two test suites have never been executed side-by-side in an automated environment — cross-artifact regressions (frontend lib drift vs. backend route shape) have no coverage.
- **Stress test and seed utilities (`stress_test_ingest.py`, `seed_26_cases.py`) have no CI integration and no idempotency guarantees.** They can be run locally but have never been validated in CI, so their correctness drifts from the codebase without notice.

---

## § Duplications

Numbered list of duplicated modules, configurations, or systems. Each entry labels: **Canonical** (recommended keep — primary active consumer), **Obsolete or Review for deprecation** (recommended drop or schedule deprecation review), and **Rationale** (one sentence why the split exists and which should win).

1. **featureFlags (two divergent registries)**
   - **Canonical:** `artifacts/legal-luminaire/src/config/featureFlags.ts` (camelCase, ~30 flags, imported by `routes.tsx`, `navigation.ts`)
   - **Obsolete:** `artifacts/legal-luminaire/src/lib/featureFlags.ts` (snake_case, 8 Week-1 flags, no active import paths in routes)
   - **Rationale:** `config/featureFlags.ts` drives route-level flag gates in the active router; `lib/featureFlags.ts` is an untouched W1-era alternate that silently shadows the canonical shape if accidentally imported.

2. **case-store (two overlapping localStorage stores)**
   - **Canonical (Review for unify):** `artifacts/legal-luminaire/src/lib/multi-case-store.ts` (TimelineEvent, CaseLawEntry, StandardEntry, DocumentEntry, CaseTemplate in addition to CaseFile)
   - **Review for deprecation:** `artifacts/legal-luminaire/src/lib/case-store.ts` (CaseRecord, CaseFile, CaseParty, CaseCitation + load/save helpers — smaller surface with overlapping types)
   - **Rationale:** Both files define near-identical `CaseFile` and timeline shapes that drift independently; `multi-case-store.ts` has the richer type surface and should absorb the helpers from `case-store.ts` so `CaseContext` has one store module.

3. **Search implementations (three parallel systems)**
   - **Canonical:** `artifacts/legal-luminaire/src/lib/modules/search-engine-v2/` (query expansion + multi-factor relevance ranking + search analytics sub-modules)
   - **Review for deprecation / fallback-only:** `artifacts/legal-luminaire/src/lib/search.ts` (stopword + synonym in-memory over static AUTHORITIES), `artifacts/legal-luminaire/src/lib/legal-search-client.ts` (HTTP client to Express `/api/legal-search`)
   - **Rationale:** `search-engine-v2` is the only implementation with layered ranking and analytics; `search.ts` should be kept only as an offline fallback under a clear alias, while `legal-search-client.ts` targets the Express duplicate backend that lacks LLM/RAG and should be removed with the Express backend.

4. **Toast / toaster (two library ecosystems in one app)**
   - **Canonical:** `artifacts/legal-luminaire/src/components/ui/toast.tsx` + `toaster.tsx` + `hooks/use-toast.ts` (Radix-based shadcn toast system — mounted in `App.tsx`)
   - **Obsolete:** `artifacts/legal-luminaire/src/components/ui/sonner.tsx` (Sonner-library-based toaster — not mounted, exports a conflicting `Toaster` name)
   - **Rationale:** Only the Radix/shadcn toaster is wired into the app root; Sonner adds an unused dependency and a name collision on `Toaster` that confuses IDE auto-import.

5. **Empty state components (two patterns + a top-level duplicate)**
   - **Canonical:** `artifacts/legal-luminaire/src/components/ui/empty-state.tsx` (bilingual-aware compound component with action buttons used throughout domain panels)
   - **Review for deprecation:** `artifacts/legal-luminaire/src/components/ui/empty.tsx` (bare shadcn `Empty`/`EmptyHeader`/`EmptyFooter`), `artifacts/legal-luminaire/src/components/EmptyState.tsx` (top-level duplicate that shadows `ui/empty-state.tsx`)
   - **Rationale:** `ui/empty-state.tsx` is the bilingual default and is already imported more broadly; the other two are reachable via accidental import and create three inconsistent empty-screen visuals.

6. **Skeleton loaders (two component families)**
   - **Canonical:** `artifacts/legal-luminaire/src/components/ui/skeleton.tsx` (single `Skeleton` pulse div — shadcn base building block)
   - **Review for deprecation:** `artifacts/legal-luminaire/src/components/ui/skeleton-loaders.tsx` (composite `ResearchSkeleton`, `ChatSkeleton`, `DraftSkeleton`)
   - **Rationale:** Composite loaders can be composed at call-site from the base `Skeleton` + CSS grids; keeping `skeleton-loaders.tsx` means two styling patterns (base div vs. pre-built composites) drift independently on spacing and animation.

7. **Draft-chain API clients (two libs modeling derivative pleadings)**
   - **Canonical:** `artifacts/legal-luminaire/src/lib/variantsApi.ts` (Pleading Chain Engine — consumed by `DraftVariantsPage` and `usePleadingVariants` hook, has streaming + matter-context endpoints)
   - **Review for deprecation:** `artifacts/legal-luminaire/src/lib/draft-family.ts` (Derivative Drafts API — consumed by `DraftFamilyPanel`, overlaps variant-chain scope)
   - **Rationale:** Both APIs model a derivative-pleading lineage (one pleading → rejoinder/replication/etc. variants); `variantsApi.ts` has streaming SSE support and an active hook layer, so `draft-family.ts` endpoints should be folded into it and the `DraftFamilyPanel` page migrated.

8. **AI research / reasoning (two scoring modules)**
   - **Canonical:** `artifacts/legal-luminaire/src/lib/modules/ai-reasoning/` (4-layer sub-modules: case-similarity-engine, explanation-generator, query-understanding, legal-feature-extractor)
   - **Review for deprecation:** `artifacts/legal-luminaire/src/lib/ai-research.ts` (Accuracy Engine v3 single-file — fact-fit 3-axis score, source priority, holdings verification)
   - **Rationale:** `ai-reasoning/` has the multi-layer architecture and sub-modules shared by `CaseSimilarityPage` and the copilot; `ai-research.ts` duplicates 3-axis scoring without those sub-module boundaries and should be rewritten as a thin wrapper over `ai-reasoning/` or dropped.

9. **RAG document_store (backend — two implementations, one wired)**
   - **Canonical:** `artifacts/legal-luminaire/backend/rag/document_store.py` (Chroma base store — imported by `preload_case01.py`, agents, `fact_fit_engine`, `routes_cases.py`)
   - **Obsolete (orphan candidate):** `artifacts/legal-luminaire/backend/rag/optimized_document_store.py` (async + batch wrapper — NOT imported anywhere in `main.py` route graph; writes to same `chroma_persist_dir`)
   - **Rationale:** Only the non-optimized store is wired into the lifespan and agents; the optimized variant is an unmaintained orphan that risks Chroma persistence-directory collisions if it ever starts being imported alongside the canonical one.

10. **Dual backend servers on port 8000 (feature overlap)**
    - **Canonical:** `artifacts/legal-luminaire/backend/` (FastAPI Python — 22 route modules, CrewAI agents, RAG, drafting engine, Redis cache)
    - **Review for deprecation:** `artifacts/api-server/` (Express TypeScript — 9 route modules, in-memory hardcoded seeds, no LLM/RAG; duplicates `/cases`, `/drafts`, `/health`)
    - **Rationale:** FastAPI is the only backend with LLM drafting, RAG, agents, and Chroma-backed case data; the Express artifact serves identical route names with empty in-memory implementations and confuses the frontend `BASE_URL` choice.

11. **UI primitives duplicated between main app and mockup-sandbox (55+ component copies)**
    - **Canonical:** `artifacts/legal-luminaire/src/components/ui/` (69 shadcn/ui primitives — actively imported by 150+ pages/components)
    - **Obsolete:** `artifacts/mockup-sandbox/src/components/ui/` (55 near-identical copies: accordion, alert, button, card, dialog, input, select, table, tabs, toast, tooltip, etc.)
    - **Rationale:** The sandbox duplicates 50+ components 1:1 plus its own `use-mobile`, `use-toast`, and `lib/utils.ts` — any bug fixed in canonical UI must be manually ported to the sandbox and vice-versa; the sandbox should import from the main artifact or be reduced to a strict shim.

12. **Config defaults vs. .env.example required status (backend)**
    - **Canonical:** `artifacts/legal-luminaire/backend/.env.example` (documents `OPENAI_API_KEY`, `TAVILY_API_KEY` as required placeholders with non-empty intent)
    - **Review for deprecation (change behavior):** `artifacts/legal-luminaire/backend/config.py` `Settings` class defaults all env keys to `str = ""`
    - **Rationale:** `.env.example` implies required status for the primary LLM/web-search keys, but `config.py` defaults allow the app to boot without them and fail silently later; `Settings` should drop empty defaults and use Pydantic `Field(..., min_length=1)` for required keys so behavior matches the example.

13. **Scratch diagnostic scripts in backend root (_check*.py / _inspect*.py)**
    - **Canonical:** (none — none are production code)
    - **Obsolete (move or delete):** `artifacts/legal-luminaire/backend/_check3.py`, `artifacts/legal-luminaire/backend/_check_imports.py`, `artifacts/legal-luminaire/backend/_inspect.py`, `artifacts/legal-luminaire/backend/_inspect2.py` (4 scratch scripts with no docstrings, no CI integration, no import paths in `main.py`)
    - **Rationale:** The 3+ scratch scripts live in the backend root alongside `main.py` and `config.py`, making them look like active modules; they should either be moved under `backend/scripts/` (where `generator.py`, `seed_26_cases.py` already live) or deleted to declutter the entry-point directory.

---

## Quick Verification

- **8 exact §Inconsistencies subsections present:** `1. naming`, `2. folders`, `3. API design`, `4. error handling`, `5. logging`, `6. config loading`, `7. auth / session`, `8. test quality`. ✅
- **Duplication entries:** **13** (≥ 11 required, comfortably exceeds AC-2 minimum of ≥ 9). ✅
- **Estimated file size:** ~22 KB (21,500–23,000 bytes; ~500 lines of Markdown)
