# Week 2 — Day 8 Architecture Baseline

> Source: `detailed_recovery_plan.md` Week 2, Day 8. Document created 2026-09-14 (Recovery Day 8).
> Approved by: Architecture Owner (User, default). Effective through the 30-day recovery period and until superseded by ADRs at Day 27.

---

## 1. § Decision — Target Architecture

**CHOSEN OPTION:** Layered application with shared platform components.

**Rejected alternatives:**
- (a) Modular monolith — rejected because it does not directly resolve the dual-backend overlap problem (FastAPI + Express on port :8000); modular monolith implies a single runtime process boundary, which contradicts the current reality of two separate backend runtimes.
- (b) Clearly bounded service system — rejected because (i) the team is a single-person solo operation with no service-to-service coordination budget, (ii) there is no documented production deploy for either backend, so drawing hard network boundaries now would be speculative, and (iii) the current duplication (3 search impls, 2 case stores, 55+ UI components) is a code-structure problem, not a service-boundary problem.

**Why layered application with shared platform components is the correct choice:**

1. **Maps to existing folder layout already.** The current repo already has a recognizable layered structure even if it is undocumented: `artifacts/legal-luminaire/src` (presentation), `src/features/*` (feature modules), `src/lib/*` (orchestration clients), `backend/api/*` + Express `api-server` (application services), `backend/agents/*` + `backend/services/*` (domain/agent logic), `backend/registry` + `backend/rag` + `src/lib/utils` (shared platform), and `backend/data/*` + localStorage + ChromaDB (persistence). The layered baseline simply names these existing layers instead of inventing a new structure.

2. **Avoids premature microservice boundaries.** A solo team maintaining a mono-repo does not need independently deployable services with network-level separation. The current "two backends" situation is an accident of history (FastAPI added for AI/agent work, Express existed earlier for CRUD), not a deliberate service-split. The layered baseline treats them as two runtime implementations of the same *Application Services Layer* contract, not two competing product services.

3. **Directly answers the dual-backend overlap problem.** The layered baseline assigns non-overlapping layer-level responsibilities:
   - **FastAPI (`backend/api/*`, `main.py`) = AI/Agent sub-layer within Application Services Layer** — it owns agent-invocation routes, RAG-query routes, drafting pipeline routes, LLM-prompt endpoints, and agent-tool-call orchestration. It is the entry point for any route that calls an LLM or runs an agent loop.
   - **Express `api-server/` = CRUD/Operations sub-layer within Application Services Layer** — it owns workspace CRUD, case upload endpoints, user preference storage, document conversion jobs, filesystem operations, and non-AI utility routes. It is the entry point for any route that does pure state management.

   This means "same port :8000 conflict" is no longer an architectural fight — it is a deployment-config problem to be resolved by a reverse-proxy or process supervisor (not an architecture rewrite). The two backends do not compete; they sit side-by-side in the same logical Application Services Layer, each handling its assigned route class.

4. **Reduces confusion fastest.** New contributors (or the solo developer returning to the codebase after two weeks) can answer "where does this code belong?" by walking down the layer list instead of debating service boundaries. Import-direction rules (see §3) are simpler to enforce than network-boundary rules for a mono-repo.

---

## 2. § Decision Criteria — All 5 Day 8 Criteria Addressed

### 2.1 (a) Current team skill

**Fact base:** Single-person solo team. Documented skill profile from inventories:
- Primary: React/TypeScript (frontend SPA, features, components)
- Secondary: Python/FastAPI (agents, RAG, drafting pipelines, `main.py` routes)
- Tertiary: Node/Express (the `api-server/` directory exists and has routes, but changes are less frequent than FastAPI changes)
- No Kubernetes, service-mesh, or multi-cluster operational experience documented.
- No dedicated DevOps or SRE function.

**How layered architecture matches:**
- Layered architecture uses only the three runtime stacks the team already knows (React/TS SPA, Python/FastAPI, Node/Express). No new framework or runtime is required.
- Import-direction and folder-convention rules are enforceable by the single developer without needing service-contract CI or API-gateway validation.
- Shared Platform Layer means the developer can write a utility once (e.g., case-ID format, date parsing, config loading) and consume it from both backends and the frontend without designing a cross-service shared-library package manager.

**If we had chosen service system instead:** Would require learning API gateway config, service-to-service auth, per-service deploy pipelines, and distributed tracing — none of which are in the current skill set, and all of which are pure operational overhead for a solo operator.

---

### 2.2 (b) Current deployment model

**Fact base (from Week 1 inventory output):**
- Mono-repo structure (confirmed: one Git repo, one `main` branch per control rules).
- **Primary deploy surface:** Netlify static SPA. This is the only deploy with documented, working, production-path behavior. The SPA is built from `artifacts/legal-luminaire/` and deployed as static assets.
- **FastAPI sidecar:** Exists in repo root (`main.py`, `backend/`). No documented production deploy. `docker-compose.yml` references it but no staging/prod Docker registry or host is configured. Local dev runs on `:8000`.
- **Express api-server:** Exists at repo root `api-server/`. Deploy path is *unclear* — no Netlify function mapping, no standalone host target, no documented process supervisor. Local dev also runs on `:8000`, creating a direct port conflict with FastAPI.
- **No documented staging environment.**
- CI (`.github/workflows/`): Only runs `compileall` on Python backend; does NOT run pytest, frontend build, lint, or typecheck as of Week 1.

**How layered architecture matches:**
- Preserves the Netlify-static-SPA primary deploy *exactly* — Presentation Layer and Feature Layer remain static assets. No change to the only working deploy path.
- Allows FastAPI and Express to coexist as optional sidecar processes (both part of the Application Services Layer) without requiring that either one be removed or rewritten immediately. The architecture baseline does not force a deploy of either backend today; it only defines *what role each would play if deployed*.
- Mono-repo tooling (one CI pipeline, one dependency lockfile family, one `vercel.json` / `netlify.toml`) aligns naturally with a layered model — all layers share one repo root, one branch policy, and one release cadence.

**If we had chosen modular monolith instead:** Would require consolidating FastAPI (Python) and Express (Node) into a *single* runtime process, which is technically impossible without rewriting one backend entirely into the other language. That rewrite is explicitly out of scope for the 30-day recovery.

---

### 2.3 (c) Degree of service duplication

**Fact base (from Week 1 inventories — Day 4 frontend + Day 5 backend):**
1. **Two overlapping backend surfaces, same port:** FastAPI `main.py:app` and Express `api-server/src/server.ts` both bind `:8000`. Route inspection shows at least 3 route prefixes exist in both backends with different implementations: `/api/search`, `/api/cases`, `/api/upload`.
2. **Three parallel search implementations:**
   - (i) Frontend client-side search in `artifacts/legal-luminaire/src/features/search/` (filters in-memory case-store).
   - (ii) FastAPI RAG search via `backend/rag/*` (ChromaDB vector search).
   - (iii) Express keyword search via `api-server/src/routes/search.ts` (SQLite / file-based keyword scan).
3. **Two case-storage types:**
   - (i) Browser `localStorage`-backed `case-store.ts` used by most SPA pages.
   - (ii) Server-persisted `multi-case-store.ts` / Express workspace DB used by upload + multi-case flows.
4. **Two toast/layout systems:** `components/ui/toast.tsx` (shadcn-style, in main SPA) and `mockup-sandbox/src/components/toast/*` (custom, in sandbox).
5. **55+ duplicate UI components in `mockup-sandbox/`:** Every major component (CaseCard, Timeline, DeadlineBadge, AcademyLesson, CopilotChat, Sidebar, TopNav, Modal, Dropdown) has a mirror copy in `mockup-sandbox/src/components/` that is nearly-identical but independently maintained, with styling and prop-drift.

**How layered architecture addresses this:**
- **Not by forcing immediate deletion** — see §4 Known Exceptions. All of the above duplications are explicitly kept *as-is* for this recovery cycle.
- **By providing a single source of truth for "which implementation is the canonical one going forward."** The layered baseline assigns:
  - *Canonical search path:* Feature Layer → Orchestration Layer (`lib/search-client.ts`) → Application Services Layer (FastAPI for RAG/AI search; Express for keyword/file search — client routes to the correct sub-layer based on search intent). The frontend-only in-memory search is marked as the offline fallback, not the primary path.
  - *Canonical case store:* Shared Platform Layer owns the case-store schema and types; both localStorage and Express workspace DB are *implementations* of that schema, selected by feature flag. No two parallel data models.
  - *Canonical UI system:* Presentation Layer uses `components/ui/` (shadcn-style) as the platform primitives. `mockup-sandbox/` UI components are marked as prototypes-to-be-migrated, not an approved parallel system.
- **Concrete outcome:** When a developer adds a new search feature on Day 15, there is exactly one allowed layer chain — not three guesses. Duplication remains but its status is now *documented and direction is set*, whereas before Day 8 all three implementations had equal implicit "blessed" status.

---

### 2.4 (d) Coordination cost between components

**Fact base:**
- Single-person team → *current coordination cost between components is near-zero* (one brain, no inter-team meetings, no cross-team API contract negotiations).
- However, *duplication-driven self-coordination burden is growing*: every feature change requires remembering which of the 3 search impls to update, which of the 2 toast systems has the newer styling, which case-store is authoritative for a given page, and whether a route should be added to FastAPI or Express. This is internal cognitive overhead masquerading as "no coordination needed."
- No service mesh, no event bus, no API gateway. Components coordinate via direct imports (frontend) or direct function calls (within each backend).

**How layered architecture matches:**
- **Coordination via import-direction rules, not network boundaries.** The layered model replaces "which service talks to which?" (which doesn't apply here) with "which layer can import which other layer?" (see §3 arrows). This is enforceable with simple lint rules (or for a solo team, a checklist item on PRs) rather than requiring service-discovery or auth-to-service setup.
- **Import direction table is the coordination contract:**
  - Presentation Layer may import: Feature Layer, Orchestration Layer, Shared Platform Layer. Never ↓ Domain, Data.
  - Feature Layer may import: Orchestration Layer, Shared Platform Layer. Never ↓ Domain, Data, Presentation.
  - Orchestration Layer may import: Application Services Layer (both sub-layers via route clients), Shared Platform Layer. Never ↓ Domain direct, Data direct, Presentation, Feature.
  - Application Services Layer (FastAPI + Express) may import: Domain/Agent Layer, Shared Platform Layer, Data/Persistence Layer. Never ↑ Orchestration, Feature, Presentation.
  - Domain/Agent Layer may import: Shared Platform Layer, Data/Persistence Layer. Never ↑ anything above it.
  - Shared Platform Layer may import: Data/Persistence Layer (for store adapters). Never ↑ anything above it.
  - Data/Persistence Layer imports: none of the upper layers (zero upward imports).
- For a solo team, this is a 2-minute self-review at PR time rather than a cross-team meeting. The coordination cost per feature is bounded and predictable.

**If we had chosen clearly bounded service system instead:** Would introduce *network-level coordination cost* (API versioning, per-service auth, retries, timeouts, circuit breakers, distributed request IDs) for zero benefit because there is only one operator. Every feature would cost more cognitive overhead, not less.

---

### 2.5 (e) Operational complexity

**Fact base (from Week 1 Day 6 infrastructure inventory):**
- **No staging environment.** Local-only and production-only; no intermediate tier.
- **No release owner (G-1 ownership gap).** No single person accountable for deploy health, rollback procedure, or post-deploy monitoring.
- **No monitoring.** No APM, no structured log aggregation, no alerting on backend downtime or LLM-call failures. FastAPI and Express each have unstructured `print` / `console.log` output with no standardized log levels or fields.
- **CI coverage is minimal:** `.github/workflows/backend.yml` only runs `python -m compileall backend/`. No pytest run, no frontend build check, no lint, no typecheck, no integration test.
- **No Kubernetes, no Terraform, no service mesh.** Deploy is ad-hoc: Netlify drag-and-drop or CLI push for SPA; FastAPI and Express have no documented prod deploy at all.
- Operational-readiness state: a single deploy of a new backend route today would require (1) manually choosing a host, (2) manually setting env vars, (3) manually verifying it doesn't break SPA calls, (4) no rollback script. This is the definition of high-ops-complexity-for-a-solo-team.

**How layered architecture keeps operational complexity as-low-as-possible (ALAP):**
- **No k8s, no service mesh, no API gateway required** for the baseline. The layered model is a *logical* architecture (code structure + import rules), not a physical topology. Physical topology can remain "Netlify SPA + optional FastAPI sidecar + optional Express sidecar on same host behind nginx" — and that is explicitly the recommended deploy topology for this recovery cycle.
- **Operational improvements are layer-scoped, not cross-system.** When CI is strengthened on Day 15, the layered model tells us exactly what order to add checks: Shared Platform tests first (used by all), then Data/Persistence, then Domain/Agent, then Application Services, then Orchestration/Feature/Presentation. No "which service pipeline do I update first?" question.
- **Monitoring rollout is also layer-scoped.** Day 19+ standardization can add structured logs at Domain/Agent Layer first (single code location: every agent entry and exit), then propagate upward to Application Services and downward to Data. No distributed-tracing setup required to get value.
- **Rollback is repo-atomic.** All layers share one mono-repo and one `main` branch per control rules. A bad rollback is `git revert <sha>` + Netlify redeploy + restart the two sidecar processes. No per-service rollback coordination.

**If we had chosen clearly bounded service system instead:** The minimum viable ops stack would jump from ~5 moving parts (SPA + 2 backends + 2 storage adapters) to ~15+ (per-service CI, per-service deploy, per-service secrets, API gateway, service discovery, inter-service auth, distributed tracing) with zero personnel to run it. This is a non-starter for a solo team.

---

## 3. § Target Shape Diagram (Text-Only)

Layers ordered **top (closest to user)** → **bottom (closest to disk/network)**.
Call direction: **DOWN ONLY.** No bottom layer may import or call upward. A layer may skip layers downward (e.g., Feature → Shared Platform directly is allowed) but **never** call up.

```
 ┌───────────────────────────────────────────────────────────────────────────┐
 │  PRESENTATION LAYER (closest to user)                                     │
 │  ┌─────────────────────────────────────────────────────────────────────┐  │
 │  │  pages/           — route-level page containers (Next-style pages) │  │
 │  │  components/ui/  — shared UI primitives (shadcn-style: button,     │  │
 │  │                     card, dialog, toast, form inputs)              │  │
 │  │  features/       — (see Feature Layer below — mounted here)        │  │
 │  │  App.tsx         — SPA shell, layout composition, providers       │  │
 │  └─────────────────────────────────────────────────────────────────────┘  │
 │  Runtime: React / TypeScript SPA, static-built, deployed to Netlify     │
 └───────────────────────────────────┬───────────────────────────────────────┘
                                     │ calls DOWN (imports, render composition)
                                     ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │  FEATURE LAYER                                                           │
 │  ┌─────────────────────────────────────────────────────────────────────┐  │
 │  │  features/Academy/      — types.ts, hooks.ts, AcademyPage.tsx      │  │
 │  │  features/Chronology/   — types.ts, hooks.ts, ChronologyPage.tsx   │  │
 │  │  features/Deadlines/    — types.ts, hooks.ts, DeadlinesPage.tsx    │  │
 │  │  features/Copilot/      — types.ts, hooks.ts, CopilotPanel.tsx     │  │
 │  │  features/Search/       — types.ts, hooks.ts, SearchPage.tsx       │  │
 │  │  features/Cases/        — types.ts, hooks.ts, CaseListPage.tsx     │  │
 │  │  Rule: Each feature owns its own types, hooks, and page.           │  │
 │  │  No cross-feature imports (e.g., Academy may not import Deadlines).│  │
 │  └─────────────────────────────────────────────────────────────────────┘  │
 │  Runtime: React / TypeScript (bundled with SPA)                          │
 └───────────────────────────────────┬───────────────────────────────────────┘
                                     │ calls DOWN (hook calls, client calls)
                                     ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │  ORCHESTRATION LAYER                                                     │
 │  ┌─────────────────────────────────────────────────────────────────────┐  │
 │  │  lib/*-client.ts  — typed API clients:                             │  │
 │  │                     fastapi-client.ts (AI/RAG routes),             │  │
 │  │                     express-client.ts (CRUD/ops routes)            │  │
 │  │  routes.tsx       — SPA route table, maps path → Feature page      │  │
 │  │  React Contexts   — auth-context, case-context, feature-flag-      │  │
 │  │                     context, config-context (no business logic)    │  │
 │  │  Rule: Orchestration never imports from features/* directly.       │  │
 │  │  Features import orchestration clients, not the reverse.           │  │
 │  └─────────────────────────────────────────────────────────────────────┘  │
 │  Runtime: React / TypeScript (bundled with SPA)                          │
 └───────────────────────────────────┬───────────────────────────────────────┘
                                     │ calls DOWN (HTTP fetch via typed clients)
                                     ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │  APPLICATION SERVICES LAYER (thin — NO business logic in routes)        │
 │  ┌─────────────────────────────────────────────────────────────────────┐  │
 │  │  FASTAPI sub-layer (AI / Agent entry-points)                        │  │
 │  │    backend/api/agents.py      — agent-invocation routes            │  │
 │  │    backend/api/drafting.py    — drafting pipeline routes           │  │
 │  │    backend/api/rag.py         — RAG / semantic search routes       │  │
 │  │    backend/api/copilot.py     — copilot chat / tool-call routes    │  │
 │  │  Rule: FastAPI routes = request parsing → call Domain/Agent        │  │
 │  │  Layer function → response serialization. Zero prompt-writing,     │  │
 │  │  zero RAG-query construction, zero case-business-logic in routes.  │  │
 │  ├─────────────────────────────────────────────────────────────────────┤  │
 │  │  EXPRESS sub-layer (CRUD / Operations entry-points)                │  │
 │  │    api-server/src/routes/cases.ts      — workspace CRUD            │  │
 │  │    api-server/src/routes/upload.ts     — document ingest           │  │
 │  │    api-server/src/routes/preferences.ts — user prefs storage       │  │
 │  │    api-server/src/routes/jobs.ts       — conversion / batch jobs  │  │
 │  │  Rule: Express routes = request parsing → call Shared Platform    │  │
 │  │  or Data Layer directly (since CRUD has no domain logic) →         │  │
 │  │  response serialization. Zero domain decisions in handlers.       │  │
 │  └─────────────────────────────────────────────────────────────────────┘  │
 │  Runtime: Python 3.11 + FastAPI (Uvicorn), Node 20 + Express            │
 │  Deploy note: Both sub-layers exist. Physical deploy (same host via    │
 │  nginx path-based routing, or separate ports) is an ops decision, not  │
 │  an architecture decision. Logical role of each sub-layer is fixed by  │
 │  this baseline regardless of port or host.                              │
 └───────────────────────────────────┬───────────────────────────────────────┘
                                     │ calls DOWN (direct function invocations)
                                     ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │  DOMAIN / AGENT LAYER (pure business logic — no HTTP, no I/O primitives) │
 │  ┌─────────────────────────────────────────────────────────────────────┐  │
 │  │  backend/agents/*        — research agent, drafting agent,         │  │
 │  │                            timeline-agent, deadline-agent          │  │
 │  │  backend/services/*      — chronology-builder, deadline-calc,      │  │
 │  │                            pleading-merger, issue-spotter          │  │
 │  │  backend/drafting/*      — template expansion, variant generator,  │  │
 │  │                            citation formatter (LLM calls live here │  │
 │  │                            as pure async functions, NOT in routes) │  │
 │  │  Rule: Zero imports from Application Services or above.            │  │
 │  │  Rule: Zero FastAPI/Express request/response objects in scope.     │  │
 │  │  Rule: Pure callable functions + dataclasses/Pydantic models.      │  │
 │  └─────────────────────────────────────────────────────────────────────┘  │
 │  Runtime: Python 3.11 (no web-framework dependency in this layer)        │
 └───────────────────────────────────┬───────────────────────────────────────┘
                                     │ calls DOWN (shared primitives + storage adapters)
                                     ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │  SHARED PLATFORM LAYER (cross-cutting primitives — used by ALL layers)   │
 │  ┌─────────────────────────────────────────────────────────────────────┐  │
 │  │  BACKEND primitives:                                                  │  │
 │  │    backend/registry/     — standards registry, type-defs, schema   │  │
 │  │    backend/rag/          — RAG primitives (chunking, embedding,    │  │
 │  │                             store interfaces — NOT route handlers)  │  │
 │  │    backend/graph/        — graph primitives (entity extraction,    │  │
 │  │                             citation-link interfaces)               │  │
 │  │    backend/config.py     — centralized env loading + validation    │  │
 │  │    backend/feature_flags.py — server-side flag evaluation          │  │
 │  │  FRONTEND primitives (used by Presentation/Feature/Orchestration):  │  │
 │  │    src/lib/utils.ts      — date/caseId formatting, classnames,     │  │
 │  │                             small pure helpers                      │  │
 │  │    src/lib/validators.ts — shared zod schemas for case data        │  │
 │  │    src/lib/feature-flags.ts — client-side flag reader              │  │
 │  │  Rule: Shared platform has zero business logic (no drafting, no    │  │
 │  │  chronology-building). It provides the building blocks, not the    │  │
 │  │  finished products.                                                 │  │
 │  └─────────────────────────────────────────────────────────────────────┘  │
 │  Runtime: Python 3.11 (backend half), TypeScript (frontend half)         │
 │  Note: Cross-language duplication of platform primitives (e.g., caseId   │
 │  format in both Python and TS) is ACCEPTABLE and documented. Shared      │
 │  source-of-truth for the *spec* of these primitives is the registry     │
 │  JSON schema; code on both sides implements that same spec.             │
 └───────────────────────────────────┬───────────────────────────────────────┘
                                     │ calls DOWN (storage adapters only)
                                     ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │  DATA / PERSISTENCE LAYER (bottom layer — ZERO upward calls)             │
 │  ┌─────────────────────────────────────────────────────────────────────┐  │
 │  │  Vector store:      ChromaDB (via backend/rag adapters)            │  │
 │  │  Browser store:     localStorage case stores (frontend adapters)   │  │
 │  │  File uploads:      uploaded_cases/ directory (local filesystem)   │  │
 │  │  Registry data:     backend/registry/*.json (JSON files on disk)   │  │
 │  │  Workspace DB:      Express api-server SQLite / lowdb store        │  │
 │  │  Optional future:   Postgres (single instance, no sharding)        │  │
 │  │  Rule: Data layer exposes interface/ports to Shared Platform.      │  │
 │  │  No data-layer code directly imports or references Domain, App-    │  │
 │  │  Services, Orchestration, Feature, or Presentation code.           │  │
 │  └─────────────────────────────────────────────────────────────────────┘  │
 │  Runtime: ChromaDB server, Node fs module, Python pathlib, SQLite,      │
 │  (future) Postgres                                                        │
 └───────────────────────────────────────────────────────────────────────────┘
```

### Allowed Call Direction Summary (Arrows = Down-Only)

| Calling Layer ↓ | May Call → Presentation | May Call → Feature | May Call → Orchestration | May Call → App Services | May Call → Domain/Agent | May Call → Shared Platform | May Call → Data/Persistence |
|---|---|---|---|---|---|---|---|
| **Presentation** | — | YES (mounts features) | YES (clients via hooks) | NO (must go through Orchestration) | NO | YES (ui primitives, utils) | NO |
| **Feature** | NO | — | YES (hooks, client calls) | NO (must go through Orchestration) | NO | YES (types, validators) | NO |
| **Orchestration** | NO | NO | — | YES (typed HTTP clients) | NO (no skip past App Services) | YES (config, flags) | NO |
| **App Services (FastAPI)** | NO | NO | NO | — | YES (direct fn call) | YES (config, registry) | YES (via adapters) |
| **App Services (Express)** | NO | NO | NO | — | NO (Express calls no domain) | YES (config, registry) | YES (direct for CRUD) |
| **Domain / Agent** | NO | NO | NO | NO | — | YES (rag primitives, graph) | YES (via adapters) |
| **Shared Platform** | NO | NO | NO | NO | NO | — | YES (storage port/interface) |
| **Data / Persistence** | NO | NO | NO | NO | NO | NO | — |

**Violations of this table (an upward import, or a skip that is explicitly "NO") require a documented APPROVED EXCEPTION in the Control Rules exception register plus an entry in the architecture exception list below.**

---

## 4. § Known Exceptions That Cannot Change Immediately

Every exception below is a temporary carve-out. The "Review Date" is the day by which either (a) the exception is resolved (code is migrated to the canonical layer path), or (b) the exception is re-approved as a permanent carve-out via an ADR written on Day 27. No exception is open-ended.

| # | Exception ID | Current State (why it cannot change now) | Impact if we forced a change during recovery cycle | Canonical Target (what the layered baseline wants eventually) | Review Date |
|---|---|---|---|---|---|
| 1 | **EXC-1** | Express `api-server/` + FastAPI `main.py` BOTH remain supported simultaneously. No backend migration, no deprecation, no route-deletion. Both backends continue to exist and to have active routes added to them during Weeks 3–4. | Forcing a migration would require rewriting ≥ 20 Express routes into FastAPI or vice-versa, which is ≥ 3 weeks of work with no user-visible benefit — entire 30-day cycle would be consumed by rewrite, leaving zero time for the Week 3 gates (CI, PR template, ownership) and Week 4 module recovery. | Physical topology decision (single host with nginx routing, or port split, or long-term consolidation into one backend) deferred to Day 30 final review. Logical roles per §3 remain in effect even while both runtimes exist: new routes must be added to the correct sub-layer per the Application Services Layer rule (AI/agent → FastAPI, CRUD/ops → Express). | **Day 30** |
| 2 | **EXC-2** | `mockup-sandbox/` 55+ duplicate UI components remain in the repo and continue to receive edits (the sandbox is an active prototyping surface for new feature variants). No component deletion, no forced migration, no repo-level ban on imports into sandbox. | Forcing migration would require auditing 55+ components for prop-drift, writing a shim-layer for the 2 toast systems, and re-testing every sandbox demo. Estimate: 2–3 weeks of frontend-only work, with zero impact on backend stability or the Week 3 operational gates. Sandbox work would displace all 3 Week 4 module-recovery targets. | `components/ui/` in the main SPA remains the canonical Shared Platform UI primitive set. `mockup-sandbox/` components are prototyping-only. New UI primitives that survive prototyping get copied upward into `components/ui/` (direction: sandbox → canonical, never the reverse). Consolidation/migration of existing duplicates deferred to Day 27 prioritization review. | **Day 27** |
| 3 | **EXC-3** | Three parallel search implementations remain. No consolidation, no deletion, no refactor to unify them. The three implementations are: (i) frontend in-memory search (features/search/client-search.ts), (ii) FastAPI RAG vector search (backend/api/rag.py + backend/rag/*), (iii) Express keyword file search (api-server/src/routes/search.ts). | Consolidating search would require (a) defining one canonical search schema, (b) writing an orchestration-layer router that picks the correct backend, (c) feature-flagging rollout, (d) migrating all 6 pages that currently call different search endpoints. This is a medium-to-large feature in its own right (≥ 10 files touched, ≥ 800 LOC) that competes directly with the 3 Week 4 module-recovery targets. | Orchestration Layer owns a single `search-client.ts` that routes to the correct implementation based on query intent. Frontend in-memory search is the offline-only fallback. FastAPI RAG is the primary semantic-search path. Express keyword search is retained for workspace-only file scans. Unified client + routing schema deferred to Day 30 backlog prioritization. | **Day 30** |
| 4 | **EXC-4** | Case-store duplication (`artifacts/legal-luminaire/src/lib/case-store.ts` vs `src/lib/multi-case-store.ts` vs Express workspace DB) remains for this recovery cycle. All three stores continue to accept writes. No store deprecation, no write-through caching layer added, no forced migration of existing user localStorage data. | Unifying case stores is high-risk because (a) localStorage data for existing users cannot be migrated without a user-facing prompt and rollback plan, (b) multi-case-store.ts is used by upload flows that have no test coverage today (Week 1 inventory flagged upload as "broken/unclear"), (c) Express workspace DB schema has no documented migration path. Attempting unification before CI and test gates are in place (Week 3 Day 15–16) would likely cause data loss in user localStorage. | Shared Platform Layer owns one canonical CaseStore interface. localStorage, multi-case-store, and Express DB are three interchangeable adapter implementations behind that interface. Write-once, read-through adapter pattern deferred to Day 27 ADR drafting. | **Day 27** |
| 5 | **EXC-5** | No staging environment remains the state. This is a process/infrastructure exception, not a code exception. All changes go directly from local-dev verification → main → production (Netlify SPA). Backend changes have no deploy target and therefore no staging anyway. | Creating a staging environment would require (a) provisioning a second Netlify site (or Vercel preview deploy config), (b) provisioning a second host for FastAPI/Express sidecars, (c) copying or anonymizing production upload_cases/ data for staging, (d) writing a deploy script. Estimate 2–3 days of pure ops work with zero direct code-quality benefit. Release Owner role (G-1 gap) must be filled first before staging ownership can be assigned; otherwise staging would be an unmaintained env that drifts. | Staging environment design + provisioning is the #1 ops item on the Day 30 follow-up 60-day plan. Release Owner assignment at Day 5 is the prerequisite. In the meantime, the Emergency Change Flow (Control Rules §3) and the PR risk-level field act as the operational safety net. | **Day 30** |

### Exception Approval Chain

All 5 exceptions above are co-approved by:
- Recovery Lead (User, default)
- Architecture Owner (User, default)
- Interim Release Owner (User, default — filling G-1 gap until Day 5)

Approval recorded in this document per Control Rules §4 requirement that "no bypass is undocumented." If any of these exceptions must be extended past their review date, a new row must be added to the Control Rules Approved Exception Register in `02_control_rules.md` §4.

---

## 5. § Relation to Week 1 Findings

### 5.1 Cross-reference to Ownership Gaps G-1..G-4 (`01_roles_and_ownership.md` §3)

The layered baseline maps each ownership gap to a specific layer or set of layers. This means when each gap is resolved (deadline: Day 5), the new owner knows exactly which parts of the codebase are in scope — no more "does data-layer ownership include registry JSONs?" ambiguity.

| Ownership Gap | Gap Description (from Week 1) | Mapping to Layers per This Baseline | How the Architecture Baseline Reduces Ambiguity for the Incoming Owner |
|---|---|---|---|
| **G-1** | Release Owner unfilled → emergency changes have no accountable approver; CI bypass can't be audited. | Release Owner owns the *deploy boundary between layers*, specifically: (i) Presentation/Feature/Orchestration → Netlify deploy pipeline, (ii) Application Services Layer (both sub-layers) → sidecar deploy pipeline, (iii) CI health for all layers. | Layered baseline gives the incoming Release Owner a deploy-scoping checklist: check 1 = SPA build (Presentation+Feature+Orchestration compiles), check 2 = FastAPI starts (App Services sub-layer 1), check 3 = Express starts (App Services sub-layer 2), check 4 = storage layers are reachable. No more "what constitutes a working deploy?" debate. |
| **G-2** | Data / RAG / Graph owner missing → RAG and vector-store changes affect all drafting features; drift risk is high. | Maps to two layers jointly: (i) **Shared Platform Layer:** `backend/rag/`, `backend/graph/`, `backend/registry/` (the primitive adapters), (ii) **Data / Persistence Layer:** ChromaDB instance, registry JSON files on disk, uploaded_cases/. | The incoming G-2 owner can point to §3 table and say "my scope stops at Domain/Agent Layer upward" — Domain/Agent calls *into* Shared Platform, so the G-2 owner provides the rag/graph interfaces but does not own the agent logic. This prevents the classic "RAG owner ends up owning all drafting" scope-creep pattern. |
| **G-3** | Auth + Config owner missing → env/secrets/flag changes leak into patches unchecked (both patches reference flags). | Maps to **Shared Platform Layer,** specifically the cross-cutting primitives column: `backend/config.py`, `backend/feature_flags.py`, `src/lib/feature-flags.ts`, `.env.example` family, any future auth adapter. | §3 explicitly marks Shared Platform as "no business logic" — so the G-3 owner's mandate is narrow: validate env vars at boot, provide a typed flag reader to other layers, and reject any PR that embeds a secret or a hardcoded flag value outside the Shared Platform Layer. No scope ambiguity. |
| **G-4** | Infra + CI/CD owner missing → Workflows, Docker, Vercel deploy have no single owner; rollback ownership undefined. | Maps to the *physical deploy plumbing* that supports all layers. The G-4 owner does not own any logical layer's code — they own the GitHub Actions workflows, `docker-compose.yml`, Dockerfiles, `vercel.json`, `netlify.toml`, nginx config (if used for dual-backend routing), and rollback scripts. | Layered baseline clarifies that G-4 is *not* a code-owner role (unlike G-2 and G-3) but a plumbing-and-automation role. This prevents conflict between the future G-4 owner and the Application Services Layer owners (who own FastAPI/Express *code*, not the Dockerfile that runs them). Ownership matrix in `01_roles_and_ownership.md` §2 can now be updated with precise layer-to-owner mappings. |

### 5.2 Cross-reference to Control Rules (`02_control_rules.md`)

All 6 control rules remain fully active and are *reinforced* by the layered baseline. No control rule is suspended or weakened.

| Control Rule Area | Rule Summary (from `02_control_rules.md`) | How Layered Baseline Reinforces It |
|---|---|---|
| **§1 Branch Policy** | Single source of truth = `main`; allowed branch prefixes (`recovery/`, `fix/`, `feat/` frozen, `hotfix/`, `chore/`); PR size guidance. | Because all layers share one mono-repo, the branch policy applies uniformly to every layer. A PR that touches Presentation Layer code AND Domain/Agent Layer code → automatically classified by the PR size guidance (likely Medium or Large → 1 owner + 1 peer, or >1k LOC → Recovery Lead approval). No per-service branch policy, no confusion. |
| **§2 Review Policy** | Every PR needs at least 1 area-owner approval; CI green before merge; no self-merge; drafting/agent/routing PRs need Architecture Owner review. | The ownership-to-layer mapping in §5.1 above means the Review Policy's "area owner" is now computable: if a PR touches `backend/rag/`, the G-2 owner (Data/RAG/Graph) must approve. If it touches `backend/api/drafting.py` routes, it needs both the Application Services FastAPI sub-layer owner AND (because it's a drafting route) Architecture Owner. No more "who reviews this?" guesswork. |
| **§3 Emergency Change Flow** | Hotfix = production restoration or data-loss only; 6-step flow; post-hoc review within 24h; logged in Exception Register. | Layered baseline makes hotfix scoping precise: a hotfix to "SPA crashes on CaseListPage" is a Presentation/Feature Layer hotfix → branch `hotfix/caselist-crash`, rollback = Netlify revert the SPA deploy. A hotfix to "RAG search returns 500" is a Shared Platform/Data Layer hotfix → branch `hotfix/rag-500`, rollback = restart ChromaDB + FastAPI. No cross-service hotfix coordination. |
| **§4 APPROVED EXCEPTION Register** | Every bypass must be a row in the register. | The 5 architecture exceptions in §4 above are architectural carve-outs. Additionally, any PR that violates the §3 import-direction table *also* requires a register row. This doubles the exception surface (process exceptions + architecture exceptions) but keeps all bypasses visible in one place. |
| **Recovery-wide non-negotiable (from `detailed_recovery_plan.md` § "Non-negotiable rules")** | "No new dependency, framework, or architectural pattern without approval." | Layered baseline defines the *current* approved pattern set. Any proposal to add a new pattern (e.g., "let's add tRPC between Orchestration and App Services," or "let's add a GraphQL gateway") is automatically a new architectural pattern → requires Architecture Owner + Recovery Lead written approval, per the recovery-wide rule. No pattern creep by default. |
| **PR risk-level field (Reviewer Checklist §2.2)** | Medium/high risk PRs must carry a rollback note. | Layered baseline gives a first-pass risk calculator: PRs that touch *multiple layers at once* (e.g., Feature page + Domain agent + storage adapter) are automatically higher risk than single-layer PRs, because cross-layer changes have more places to fail. The reviewer can use layer-count as the first risk-signal before even reading the diff. |

---

## 6. § Exit Check — "There is one target shape, not three competing visions."

This document resolves the pre-Day-8 ambiguity by replacing three implicit, conflicting architectures (each of the three plan options was, in effect, being partially implemented in different parts of the codebase) with one explicit, named target: the layered application with shared platform components. Before Day 8, a developer adding a new route had to guess whether to put it in FastAPI (treating the system as a bounded AI service) or Express (treating it as a modular CRUD monolith) — after Day 8, §2.3 and §3 Application Services Layer assign that decision to a fixed rule: AI/agent routes → FastAPI sub-layer, CRUD/ops routes → Express sub-layer, no guessing required. Before Day 8, a new search feature had three equally valid implementation paths (frontend-only, FastAPI RAG, Express keyword) with no canonical direction — after Day 8, §4 EXC-3 keeps the three implementations but §2.3 names exactly which path is canonical going forward (Orchestration Layer typed client → correct Application Services sub-layer based on intent), so new code follows one path even while old code temporarily supports three. Before Day 8, ownership gaps G-1..G-4 had fuzzy code-scope boundaries (e.g., "does config ownership include the frontend flag reader?") — after Day 8, §5.1 maps each gap to precise layers, so when the gaps are filled at Day 5 the incoming owners start with zero scope disputes. The 5 documented known exceptions in §4 prevent the most common architecture-baseline failure mode (pretending duplication doesn't exist and calling a rewrite "standardization") by explicitly naming what stays, when it gets reviewed, and what the canonical target is — no one can claim the baseline is unrealistic because every deviation is on the page with a review date. Collectively, these decisions collapse three competing mental models (modular monolith advocates, service-split advocates, and "let's just add layers" advocates) into one written, approved, reviewable target shape that every PR for the next 22 days can be measured against.
