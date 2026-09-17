# Recovery: Week 1 Closure + Week 2 Standards — Implementation Plan

## Task 1: Close backend inventory placeholder
- **Status**: `completed`
- **Priority**: high
- **Depends On**: None (Week 1 prerequisites are already in-place)
- **Description**:
  - Write `.trae/recovery/week1/04_backend_inventory.md` as a structured module catalog covering the FastAPI backend (`artifacts/legal-luminaire/backend/`), the Express API server (`artifacts/api-server/`), and the Mockup Sandbox build system.
  - Per-row columns match `03_frontend_inventory.md`: Name, Path(s), Status (active/duplicated/deprecated/broken/unclear), Language/Framework, Runtime, Deploy Target, Owner, Upstream Callers, Downstream Dependencies, DB/Queue Usage, Auth Model, Logging Style, Health/Test Status, Notes.
  - Include an Executive Summary with total-module counts and top-3 duplicates/gaps.
  - Categorization tally table: active / duplicated / deprecated / broken / unclear.
  - Backend sections to cover: FastAPI root (main.py, config.py, cache.py, preload), api routes (all 22 modules), agents (all 12 + crew/tools), services (3), RAG (4 modules + law_db.json), graph, drafting, registry, scripts, tests, utils, uploaded_cases, Express api-server (8 route modules, db lib, build system), Docker files, start scripts.
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `rule` TR-1.1: File size > 2 KB on disk. Evidence: `wc -c .trae/recovery/week1/04_backend_inventory.md` or equivalent directory listing showing non-trivial size.
  - `rule` TR-1.2: File contains all required column headings: Name, Path, Status, Language/Framework, Owner, Upstream, Downstream, DB/Queue, Auth, Logging, Health/Test, Notes, plus Categorization Tally and Executive Summary sections. Evidence: `grep` for the headings within the file returns matches.
- **Notes**: Owner column defaults per `01_roles_and_ownership.md`: User (default, provisional) for frontend/backend; explicitly mark UNOWNED gaps for data/RAG, auth/config, infra per the ownership matrix.

## Task 2: Consolidate inconsistencies into 8 plan categories + duplication list
- **Status**: `completed`
- **Priority**: high
- **Depends On**: Task 1 (needs backend inventory to identify backend naming/logging/API inconsistencies; otherwise frontend-only would miss half the picture)
- **Description**:
  - Write `.trae/recovery/week1/07_inconsistencies_and_duplication.md`.
  - § Inconsistencies with 8 subsections exactly matching plan Day 7 buckets: naming, folders, API design, error handling, logging, config loading, auth/session, test quality.
  - Populate each subsection from:
    1. Inline inconsistencies in `03_frontend_inventory.md` (18 entries, covers naming, folders, aliases, dual-layout, dual-toast, search-trifecta, case-store-dup, draft-chain-overlap, etc.)
    2. Mismatches & Hidden Manual Steps in `05_infrastructure_inventory.md` (12 entries, mostly config loading + deploy reproducibility + test-quality gaps)
    3. Backend inconsistencies discovered during Task 1 inventory (error handling style across routes, log field inconsistency, dual-backend on same port 8000, env-var validation defaulting to `""`, no automated pytest in CI, two API surface conventions, etc.)
  - § Duplications numbered list ≥ 9 entries, each entry labeling: canonical (kept) candidate / obsolete (review for deprecation) candidate / rationale for canonical choice.
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `rule` TR-2.1: All 8 category headings present exactly per plan naming. Evidence: heading scan returns all 8.
  - `rule` TR-2.2: Duplication list ≥ 9 numbered entries, each with "Canonical:" and "Obsolete / Review:" labels. Evidence: count of `^[0-9]+\.` lines ≥ 9, each entry contains both labels.

## Task 3: Build Week-1 first-pass risk heatmap (4 buckets)
- **Status**: `completed`
- **Priority**: high
- **Depends On**: Task 1 + Task 2 (needs the complete inventories + inconsistency knowledge to assign buckets without guessing)
- **Description**:
  - Write `.trae/recovery/week1/06_risk_heatmap.md`.
  - Define 4 buckets exactly matching plan Day 7 naming:
    1. business-critical-and-unstable
    2. business-critical-but-stable
    3. low-criticality-and-messy
    4. unknown-risk
  - Each bucket contains rows for: Module Name, Path(s), Bucket (repeated for clarity), 1-sentence Rationale, Owner Status (named / UNOWNED with gap ref).
  - Include at least the following modules to distribute realistically: FastAPI backend root/main, api routes family, agents family, RAG, data layer, frontend case-store/multi-case-store, search trifecta, frontend routes.tsx, feature flags duality, Express api-server, CI/workflows, docker + netlify deploy infra, the dual toast/layout components, drafting-related modules (variants, derivatives, bilingual), mockup-sandbox UI duplicates.
  - Include a short § Interpretation explaining the heuristics used for bucket assignment (so Day 13 detailed scoring can build consistently on top of them).
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `rule` TR-3.1: All 4 exact bucket labels present and each bucket has ≥ 1 module rows with all 5 required columns. Evidence: heading scan + row inspection.
  - `rule` TR-3.2: § Interpretation / bucket heuristics section present. Evidence: heading scan.

## Task 4: Write architecture baseline (Day 8)
- **Status**: `completed`
- **Priority**: high
- **Depends On**: Tasks 1, 2, 3 (needs complete inventory picture to choose between the 3 plan options with real data)
- **Description**:
  - Write `.trae/recovery/week2/08_architecture_baseline.md`.
  - § Decision: explicitly name the chosen target architecture (modular monolith / clearly-bounded-services / layered-app-with-shared-platform-components) — choose the option that fits: 1-person team, current mono-repo deploy to Netlify (static SPA) + optional FastAPI backend sidecar, duplication between two backends is the biggest architecture drift.
  - § Decision criteria: address all 5 Day 8 criteria explicitly: (a) current team skill, (b) current deployment model, (c) degree of service duplication, (d) coordination cost, (e) operational complexity.
  - § Target shape diagram (text-only) of frontend (SPA) vs backend stacks vs shared data/registry, plus arrows for call directions.
  - § Known exceptions that cannot change immediately: list 3–5 items (e.g. Express + FastAPI both on :8000 dual backend must remain until migration date; mockup-sandbox duplicates must remain; etc.) with Review Date = Day 27 or Day 30.
  - § Relation to Week 1 findings: reference how ownership gaps (G-1..G-4) and control rules (branch policy) interact with the architecture choice.
  - § Exit check verbiage: "there is one target shape, not three competing visions" — explicitly state how the document resolves ambiguity.
- **Acceptance Criteria Addressed**: AC-4 (directory & file existence), AC-5 (rubric)
- **Test Requirements**:
  - `rule` TR-4.1: File exists at `.trae/recovery/week2/08_architecture_baseline.md`. Evidence: directory listing.
  - `rubric` TR-4.2 (maps to AC-5): Reality-groundedness and single-direction clarity. Scale 1–5; anchors 1=hypothetical/no-choice, 3=shallow rationale (≤2 criteria), 5=all 5 Day 8 criteria + known exceptions with review dates. Threshold ≥ 4. Evidence: grep for all 5 criteria keywords (skill / deployment / duplication / coordination / operational) and count unique criteria hit ≥ 4; count of entries in known-exceptions table ≥ 3.

## Task 5: Write code organization standard (Day 9)
- **Status**: `completed`
- **Priority**: high
- **Depends On**: Task 4 (import-direction rules must align with the chosen architecture baseline's layering)
- **Description**:
  - Write `.trae/recovery/week2/09_code_organization_standard.md`.
  - § Frontend folder conventions (pages, components/views, components/ui, components/charts, components/layout, lib/, lib/modules, hooks, features, context, config, data, routes, types, App/main root) — for each folder state what goes in and what does NOT go in.
  - § Backend folder conventions (api/, agents/, services/, rag/, graph/, drafting/, registry/, data/, scripts/, tests/, utils/, uploaded_cases/, root files) — same go/goes-not pattern per folder.
  - § Naming rules per layer:
    - Pages + React components: PascalCase `.tsx`
    - Lib utilities, hooks (use-*), config: kebab-case `.ts`
    - Backend route modules: `routes_*.py` / `routes_<domain>.py` prefix
    - Backend agents / services / modules: `snake_case.py`
    - DTO/models: explicit `models.py` file(s), no inline pydantic scattered
    - Tests: `test_<module>.py` (backend) / `<module>.test.ts[x]` (frontend)
  - § Shared code vs duplication rules: 3 concrete rules answering the plan's "when shared allowed vs duplication preferred" question (e.g. shared allowed if ≥3 consumers, same signature, no domain leak; duplication preferred if domains differ or will diverge).
  - § Import rules + allowed dependency directions (frontend and backend separately). Explicit forbidden-direction examples (e.g. lib must not import features/pages; agents must not import route modules).
  - § What belongs inside a module vs outside: e.g. feature = owns its own types + hooks + data + page; shared = lives in lib/ and is architecture-layer only.
  - § Exit check: "a developer can place a new file correctly without asking three people" — include a 10-question placement quiz with correct answers as the exit evidence.
- **Acceptance Criteria Addressed**: AC-4, AC-6
- **Test Requirements**:
  - `rule` TR-5.1: File exists at expected path. Evidence: directory listing.
  - `rubric` TR-5.2 (maps to AC-6): Actionability for a new contributor. Scale 1–5; anchors 1=vague/best-judgment, 3=2–3 rules with gaps, 5=full folder conventions for both stacks + naming per layer + shared-vs-local rules + import-direction section + "inside vs outside module" section. Threshold ≥ 4. Evidence: count of distinct file-kind naming rules (pages, components, lib, hooks, features, routes, agents, services, DTOs/tests) ≥ 8; presence of shared-vs-local AND import-direction AND inside/outside-module sections = all 3 headings present.

## Task 6: Write API & interface standard (Day 10)
- **Status**: `completed`
- **Priority**: high
- **Depends On**: Task 4 (versioning and contract documentation must align with the chosen architecture direction — e.g. if layered, API contract applies uniformly across both backends)
- **Description**:
  - Write `.trae/recovery/week2/10_api_contract_standard.md`.
  - § Standard request structure: content-type JSON; optional `request_id` client-sent or server-generated; pagination pattern (`limit`/`offset` or `cursor`) for collection endpoints; file upload multipart pattern for ingest endpoints.
  - § Standard response structure: envelope or top-level? Pick one envelope (e.g. `{ success: bool, data: T, meta: {...} }`) for FastAPI; describe what Express api-server currently uses + migration date to conform (Day 27+).
  - § Standard error format: concrete field names — at least: `error.code` (machine-readable), `error.message` (user-facing i18n-ready), `error.details` (validation errors array), `error.trace_id` (correlation), `error.timestamp`. Include mapping to HTTP status codes.
  - § Versioning expectations: `/api/v1` prefix for all new FastAPI routes; note which existing routes don't have it (known exception); Express api-server: either same `/api/v1` or `/express/v1` with rationale.
  - § Validation boundaries — three explicit layers: entry validation (route handler / DTO), domain validation (agent/service), persistence constraints (DB/registry schemas). What is validated where + error escalation rules.
  - § How contracts are documented: docstrings → OpenAPI (FastAPI auto-generated), how Express api-server docs are kept, where to publish links (README + handbook).
- **Acceptance Criteria Addressed**: AC-4, AC-7
- **Test Requirements**:
  - `rule` TR-6.1: All 6 required sections exist. Evidence: heading scan of 6 exact section titles.
  - `rule` TR-6.2: Error format enumerates ≥ 4 concrete field names with `error.` prefix (code/message/details/trace_id etc.) + HTTP status code mapping table or list. Evidence: count of `error.` prefixed field names ≥ 4.

## Task 7: Write logging & configuration standard (Day 11)
- **Status**: `completed`
- **Priority**: high
- **Depends On**: Task 4 (correlation ID propagation rules must align with architecture call directions; config sources align with deploy target choices)
- **Description**:
  - Write `.trae/recovery/week2/11_logging_and_config_standard.md`.
  - § Required log fields (≥ 5): `timestamp` (ISO), `level`, `message`, `trace_id`/request_id, `module` / logger name, optional `user_id` / `case_id` where applicable.
  - § Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL (5 levels) — each with 1-sentence when-to-use guidance.
  - § Correlation / request ID behavior: `X-Request-ID` header behavior on the edge (frontend passes if present, backend generates if absent), downstream propagates to agents/RAG, appears in every log line.
  - § Where config is loaded from: Frontend Vite = `import.meta.env` + `.env.local` + defaults; Backend FastAPI = Pydantic `BaseSettings` + `.env` precedence; Express = `process.env` with documented env files; Docker = compose `environment:` block; platform (Netlify, Vercel, Replit) = platform env vars UI.
  - § How env vars are validated: Backend Python = Pydantic `Field(min_length=1)` for required (fail at startup, not call-time); Frontend = centralized `Env` schema validation (e.g. zod) at boot; Express = documented schema check on startup.
  - § How secrets are referenced without hardcoding: Only via env vars; `_KEY`, `_SECRET`, `_TOKEN` suffixes must never be logged or printed; explicit redaction rule in log formatters.
  - § Relationship to Week 1 infra inventory findings: explicitly call out the "backend keys default to empty string" issue from `05_infrastructure_inventory.md` as the problem this standard fixes.
- **Acceptance Criteria Addressed**: AC-4, AC-8
- **Test Requirements**:
  - `rule` TR-7.1: All 6 required sections (log fields, levels, correlation ID, config source, env-var validation, secrets handling) present. Evidence: heading scan of 6 exact section titles.
  - `rule` TR-7.2: Required log fields list has ≥ 5 entries; log levels section names ≥ 5 distinct levels. Evidence: bullet count in log fields ≥ 5; distinct level names ≥ 5.

## Task 8: Write engineering handbook (Day 12)
- **Status**: `completed`
- **Priority**: high
- **Depends On**: Tasks 4, 5, 6, 7 (handbook consolidates them — they must be complete first to avoid stale consolidation)
- **Description**:
  - Write `.trae/recovery/week2/12_engineering_handbook.md`.
  - Consolidate into a single short document (≤ 15 KB target; ≤ ~200 lines):
    1. Target architecture (condensed from `08_architecture_baseline.md`) — 1 decision + 1-shape promise + 3 bullet exceptions
    2. Code organization rules (condensed from `09_code_organization_standard.md`) — folder map, naming rules, import directions, shared-vs-local rule
    3. Interface rules (condensed from `10_api_contract_standard.md`) — envelope + error fields + validation boundaries
    4. Logging and config rules (condensed from `11_logging_and_config_standard.md`) — field list, 5-level quick-reference table, env validation rule
    5. PR and review rules — directly reuse/summarize the core rules of `02_control_rules.md` (branch prefixes, PR size table, reviewer checklist, no self-merge, owner approval) without contradicting any rule in §02
    6. Definition of done for a recovered module — exactly the 8-bullet list from the plan's § "Definition of done for a recovered module" (clear owner, boundary doc, dead/dup code reduced, naming aligned, critical-path tests exist, logging+errors follow standard, CI passes, unresolved issues documented)
  - Explicitly ban the phrase "best judgment" — use concrete rules; if a judgment area exists, say "ask Architecture Owner" instead of vague wording.
  - § How to use this handbook: link to the underlying full standard files (08, 09, 10, 11) so the handbook is TL;DR-friendly but the full detail is accessible.
- **Acceptance Criteria Addressed**: AC-4, AC-9
- **Test Requirements**:
  - `rule` TR-8.1: All 6 required sections present (architecture, code org, interface, logging/config, PR/review, DoD). Evidence: heading scan of 6 section headings.
  - `rubric` TR-8.2 (maps to AC-9): Conciseness, consolidation, specificity. Scale 1–5; anchors 1=≥25KB/best-judgment≥3, 3=≤20KB/4-of-6 sections/best-judgment≤2, 5=≤15KB/ALL 6 sections/DoD matches plan/zero best-judgment occurrences + PR rules do not contradict control rules. Threshold ≥ 4. Evidence: file size ≤ 20 KB; grep "best judgment" count = 0; manual cross-check DoD bullets against plan = 8/8 match; PR/rules summary headings match §02 headings.

## Task 9: Write detailed risk heatmap (Day 13)
- **Status**: `completed`
- **Priority**: high
- **Depends On**: Tasks 1, 2, 3, 4, 5, 6, 7 (scoring rationale must be consistent with every prior finding; scoring quality benefits from knowing all the standards)
- **Description**:
  - Write `.trae/recovery/week2/13_detailed_risk_heatmap.md`.
  - § Scoring rubric: define for each of the 7 dimensions what 1/3/5 means (e.g. business criticality: 1=no user ever lands here, 3=used by 1+ features but not core, 5=every case goes through it; ownership clarity: 1=unowned+disputed, 3=provisional, 5=named owner+no disputes).
  - § Scored table with ≥ 10 module rows, each with scores 1–5 on all 7 dimensions (business criticality, change frequency, defect history, ownership clarity, test quality, dependency complexity, runtime fragility). Plus an overall composite score (simple average or weighted avg with documented weights) and final 1-bucket assignment that must align with the bucket each module was assigned in `06_risk_heatmap.md` (AC-3 buckets). Any alignment change needs a § Re-classification Justification row.
  - § High-change + high-risk intersection: explicitly list modules that rank high (≥ 4/5) on BOTH change frequency AND overall risk — these feed Task 10.
  - § Low-value areas to exclude from Week 4 recovery effort: list ≥ 1 module (e.g. mockup-sandbox duplicate UI is messy but low business-criticality — explicitly exclude) with rationale.
  - § Methodology note: documented scoring heuristics so future rescoring is reproducible.
- **Acceptance Criteria Addressed**: AC-4, AC-10
- **Test Requirements**:
  - `rule` TR-9.1: Scored table has ≥ 10 rows × 7 scores each. Evidence: count of module rows ≥ 10; each row has 7 numeric scores.
  - `rule` TR-9.2: High-change + high-risk summary section AND low-value excluded list both present. Evidence: heading scan of 2 section headings; high-change section lists ≥ 1 module; low-value section names ≥ 1 module.
  - `rule` TR-9.3: Bucket-assignment consistency: for every module that appears in both `06_risk_heatmap.md` and this detailed heatmap, the bucket matches OR an explicit reclassification justification row exists. Evidence: cross-reference with TR-3.1 rows.

## Task 10: Choose top-3 recovery targets (Day 14)
- **Status**: `completed`
- **Priority**: high
- **Depends On**: Task 9 (3 targets must come from the high-change + high-risk intersection of TR-9.2)
- **Description**:
  - Write `.trae/recovery/week2/14_recovery_targets.md`.
  - § Selected Module List: exactly 3 modules. For each module include all 6 Day 14 fields in a table or structured blocks: (1) Owner (default to User interim if no real person), (2) Reason for selection (must reference composite score + plan rationale), (3) Key problems (3–5 bullets, concrete), (4) Expected recovery outcome (3–5 measurable bullets tying to the plan's "definition of done for a recovered module"), (5) Dependencies that must be coordinated (other modules / owners / CI gates), (6) Review date (suggest Day 27 for interim and Day 30 for final).
  - § Recovery scope per module: 1-paragraph scope + 1-paragraph explicitly OUT-of-scope (so recovery work doesn't turn into rewrites).
  - § Postponed modules: explicitly name the next-highest 3+ priority modules and why they are deferred (e.g. "too low risk / owner not available / blocked on target #1 cleanup").
  - § Exit check: "team knows exactly which modules get focused work first" — include a 1-line promise that no other module will receive Week-4 cleanup attention unless all 3 targets are already at definition-of-done and Recovery Lead approves an add.
- **Acceptance Criteria Addressed**: AC-4, AC-11
- **Test Requirements**:
  - `rule` TR-10.1: Exactly 3 selected modules with all 6 required fields each. Evidence: count of "Selected Module" sections = 3; each has all 6 fields (or a table with 6 columns × 3 rows).
  - `rule` TR-10.2: Postponed modules list exists with ≥ 1 entry and why-deferred reasoning. Evidence: section heading + rows.
  - `rule` TR-10.3: 3-for-3 mapping: each selected module appears in TR-9.2's high-change + high-risk intersection list (or a § Re-classification Justification row exists in Task 9 document for the mismatched entry). Evidence: cross-reference with Task 9 § High-change + high-risk module names.
