# Week 2 — Day 9 Code Organization Standard

> Source: `detailed_recovery_plan.md` Week 2, Day 9. Aligns with `08_architecture_baseline.md` (layered application with shared platform components).
> Approved by: Architecture Owner (User, default). Effective through the 30-day recovery period.
> Exit check: a developer can place a new file correctly without asking three people — see §7 quiz.

---

## 1. Frontend folder conventions

Root: `artifacts/legal-luminaire/src/`.

| Folder | Goes in | Does not go in |
|--------|---------|----------------|
| `pages/` | One routable page per file, PascalCase `.tsx`, mounted from `routes.tsx`. | Shared UI primitives, hooks, API clients, feature-internal components that are not routes. New views that are only used inside a feature belong in `features/<Name>/`. |
| `components/views/` | **Legacy only.** Existing view files stay until Day 27. | **New** routable surfaces. New pages go in `pages/` (or `features/<Name>/` if the feature owns its page). |
| `components/ui/` | Shared shadcn-style primitives (Button, Card, Dialog, Input). No product copy, no case-domain types. | Feature layouts, pages, toast *application* wrappers that encode product copy. Canonical toast primitive is `toast.tsx` + `toaster.tsx` (see Day 7 duplication list). |
| `components/charts/` | Reusable chart wrappers with no case-specific data. | One-off page charts (those stay next to the page or in the feature folder). |
| `components/layout/` | App chrome: `Layout.tsx`, `Sidebar.tsx`, breadcrumbs. Canonical layout is `Layout.tsx`. | Duplicate `app-layout.tsx` for new work; do not add a third layout. |
| `lib/` | Cross-feature typed clients, formatters, validators, store adapters. Files are kebab-case `.ts`. | React components, page JSX, feature-only hooks. |
| `lib/modules/` | Versioned platform modules (e.g. search-engine-v2) that are not yet the canonical client. Treat as Shared Platform; do not import from pages directly — go through a `lib/*-client.ts`. | New one-off helpers (those go in `lib/` root as a single kebab-case file). |
| `hooks/` | Reusable React hooks used by **two or more** features. Filename: `use-<name>.ts` (kebab-case). | Feature-only hooks (those live in `features/<Name>/hooks.ts` or `use-<name>.ts` inside the feature folder). |
| `features/<Name>/` | Feature-owned `types.ts`, `hooks.ts`, page component, feature-local components. Folder name PascalCase matching the product noun (Academy, Chronology, Deadlines, Copilot, Search, Cases). | Imports from another `features/*` folder. Shared UI. Backend Python. |
| `context/` | React context providers with **no** business logic (auth, case pointer, flags, config). | API calls, RAG queries, draft generation. |
| `config/` | Boot-time frontend config: canonical feature flags (`featureFlags.ts`), env schema when added. | Duplicate flag registries. Do not add `lib/featureFlags.ts` consumers; that file is obsolete (Day 7 dup #1). |
| `data/` | Static demo/stub JSON/TS used at build time. | Runtime case registry (that is `src/cases/registry.ts` until EXC-4 is resolved). |
| `cases/` | Case registry TS and packed demo case modules. | UI components. |
| `routes.tsx` | Single SPA route table. | Feature-local nested routers. |
| `types/` | Cross-app TypeScript types that are not feature-owned. | Feature-only types (those stay in `features/<Name>/types.ts`). |
| `App.tsx` / `main.tsx` | SPA shell, providers, mount. | Route definitions (those stay in `routes.tsx`). |

`artifacts/mockup-sandbox/` is a prototype tree (EXC-2). Copy surviving primitives **into** `components/ui/`; never import sandbox into the main SPA.

`artifacts/api-server/` is not frontend. Its TypeScript lives under Application Services (Express). Use that tree's own `src/routes/`, `src/lib/`. Do not add SPA pages there.

---

## 2. Backend folder conventions

Root: `artifacts/legal-luminaire/backend/`.

| Folder / file | Goes in | Does not go in |
|---------------|---------|----------------|
| `api/` | FastAPI routers only: parse request, call Domain/Agent or Shared Platform, serialize response. Files: `routes_<domain>.py`. | Prompt text, RAG query construction, CrewAI loops, Pydantic models that are not request/response DTOs. |
| `agents/` | Agent loops, tool wiring, crew orchestration. `snake_case.py`. | HTTP routers, FastAPI `Request` objects. |
| `services/` | Deterministic domain services (limitation engine, variant engine). No HTTP. | Route handlers. |
| `rag/` | Chunking, embedding, store **interfaces**, hybrid search primitives. | Route handlers (`routes_search.py` stays in `api/`). |
| `graph/` | Graph client and graph primitives. | Page-level analytics. |
| `drafting/` | Template expansion, variant internals, citation formatter, prompt **functions**. | FastAPI routers. |
| `registry/` | JSON registries and loaders (schema + files). | Agent prompt strings. |
| `data/` | Static JSON such as `subject_variants.json`, limitation rules. | Uploaded user cases. |
| `scripts/` | One-off seed, ingest, generator CLIs. Not imported by `main.py` request path. | Production request handlers. |
| `tests/` | `test_<module>.py` plus `conftest.py`. | Application code. |
| `utils/` | Small pure helpers used by ≥2 backend packages. | Domain drafting logic. |
| `uploaded_cases/` | On-disk case packs (TC-*). | Source code. |
| `main.py` | App factory, middleware, router includes, lifespan. | Business logic. |
| `config.py` | Env loading and validation (Shared Platform). | Route-specific constants that belong next to the route. |
| `cache.py` | Redis adapter. | Search ranking logic. |

Express Application Services live in `artifacts/api-server/src/` (`routes/`, `lib/`, `index.ts`). New CRUD/ops routes go there; new AI/agent routes go in FastAPI `api/`.

---

## 3. Naming rules per layer

| Kind | Rule | Example |
|------|------|---------|
| Pages + React components | PascalCase `.tsx` | `ChronologyPage.tsx`, `VariantChain.tsx` |
| Lib utilities | kebab-case `.ts` | `draft-family.ts`, `citation-gate.ts` |
| Hooks | `use-<name>.ts` kebab-case | `use-bilingual-generator.ts` |
| Config | kebab-case or existing `featureFlags.ts` (canonical file keeps current name; **new** flag keys are camelCase) | `config/featureFlags.ts` |
| Features folder | PascalCase directory | `features/Chronology/` |
| Backend route modules | `routes_<domain>.py` | `routes_deadlines.py` |
| Backend agents / services / rag / drafting | `snake_case.py` | `derivative_drafter.py`, `variant_engine.py` |
| DTO / models | Dedicated `models.py` (or `schemas.py`) beside the package; no new inline ad-hoc Pydantic classes scattered inside unrelated modules | `api/models.py` for request/response; `drafting/models.py` for domain |
| Backend tests | `test_<module>.py` | `test_variant_engine.py` |
| Frontend tests | `<module>.test.ts` or `<module>.test.tsx` | `academy.test.ts` |

Do not introduce a fourth hook style (`useFoo.ts` camelCase). Existing camelCase hooks (`usePleadingVariants.ts`, `useDebounce.ts`) stay until the owning recovery PR; **new** hooks use kebab-case `use-*.ts`.

Page prefixes `LDR_*` and `LPS_*` are allowed only for those existing product lines. New pages use an unprefixed PascalCase product name (`FooPage.tsx`).

---

## 4. Shared code vs duplication (three rules)

1. **Share when all three are true:** ≥3 consumers, identical function signature and semantics, and the helper has **no** case/drafting/RAG domain nouns in its API. Put it in frontend `lib/` or backend `utils/` / Shared Platform (`config.py`, `registry/`).
2. **Duplicate (keep local) when domains differ or will diverge.** Example: chronology date parsing that encodes Limitation Act rules stays in `features/deadlines/` or `services/limitation_engine.py`; do not fold it into `lib/utils.ts`.
3. **Do not create a new shared package or monorepo workspace** for one helper. Cross-language duplication of a *spec* (case ID format) is allowed: one JSON schema in `registry/`, Python and TS each implement it. Do not add a third language-specific copy.

---

## 5. Import rules and allowed dependency directions

Frontend (down-only, matches Day 8 table):

- `pages/` and `components/layout/` may import `features/`, `lib/`, `components/ui/`, `context/`, `config/`.
- `features/*` may import `lib/`, `hooks/` (shared), `components/ui/`, `context/`, `config/`. **Must not** import another `features/*` or `pages/`.
- `lib/` must not import `features/`, `pages/`, or `components/views/`.
- `components/ui/` must not import `pages/`, `features/`, or `lib/` except `lib/utils.ts` (cn helper).
- SPA must not import `artifacts/mockup-sandbox/**`.
- SPA must not import Express or FastAPI Python modules (HTTP only via clients).

Backend:

- `api/` (routes) may import `agents/`, `services/`, `rag/`, `graph/`, `drafting/`, `registry/`, `config.py`, `cache.py`.
- `agents/` must **not** import `api/` route modules.
- `services/` must **not** import `api/` or `agents/` (agents may call services; not the reverse).
- `rag/`, `graph/`, `registry/` must **not** import `api/` or `agents/`.
- `drafting/` must **not** import `api/`.
- `tests/` may import anything under `backend/` except `uploaded_cases/` binary files as Python modules.

Forbidden examples (do not add):

- `lib/case-store.ts` importing `@/pages/Home`.
- `agents/drafter.py` importing `api.routes_drafting`.
- `components/ui/button.tsx` importing `@/features/Copilot`.

Violations require an APPROVED EXCEPTION in `02_control_rules.md` §4.

---

## 6. Inside a module vs outside

**Inside a feature module** (`features/<Name>/` or a backend package such as `services/`): owned types, owned hooks, owned page (frontend), owned tests, owned static JSON that only that module reads.

**Outside (Shared Platform / lib):** anything a second feature already needs, env/flag/config, UI primitives, HTTP clients, registry schemas.

**Stay out of the module:** deploy files, CI workflows, Docker, Netlify — those belong to infra (G-4), not the feature folder.

A FastAPI **route file is not a module**. The module is the domain package (`drafting/`, `agents/`, `services/`). The route is the Application Services adapter.

---

## 7. Placement quiz (exit evidence)

| # | Question | Correct placement |
|---|----------|-------------------|
| 1 | New page `/case/:id/hearing-notes` | `src/pages/HearingNotesPage.tsx` + one line in `routes.tsx` |
| 2 | New shadcn-style `Badge` variant used by 5 pages | `src/components/ui/badge.tsx` (edit existing) |
| 3 | Hook used only by Chronology | `src/features/chronology/` (e.g. `use-timeline-filter.ts`) |
| 4 | Hook used by Chronology, Deadlines, and Copilot | `src/hooks/use-<name>.ts` |
| 5 | Typed FastAPI client for RAG search | `src/lib/fastapi-client.ts` (or dedicated `src/lib/rag-client.ts`); pages do not `fetch` raw URLs |
| 6 | New AI drafting HTTP endpoint | `backend/api/routes_drafting.py` (or `routes_<new>.py` if a new domain) + include in `main.py`; prompt logic in `backend/drafting/` or `backend/agents/` |
| 7 | New workspace CRUD for parties | `artifacts/api-server/src/routes/` (Express CRUD/ops sub-layer) |
| 8 | New Pydantic request body for deadlines | `backend/api/models.py` or `backend/services/` models file — not inline in an unrelated agent |
| 9 | Pytest for variant engine | `backend/tests/test_variant_engine.py` |
| 10 | Prototype of a new Card layout | `artifacts/mockup-sandbox/` until copied to `components/ui/` |

---

## 8. Exit check

A developer can place a new file correctly without asking three people: match the folder table, apply the naming row, then check the import-direction row. If the file still does not fit, ask the Architecture Owner (do not invent a new folder).
