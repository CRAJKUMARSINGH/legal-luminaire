# Recovery: Week 1 Closure + Week 2 Standards — Product Requirements Document

## Overview
- **Summary**: Close the three remaining Week 1 placeholders (backend inventory, risk heatmap, inconsistencies list) from the 30-day recovery plan, then deliver all seven Week 2 standards artifacts: architecture baseline, code organization standard, API contract standard, logging/config standard, engineering handbook, detailed risk heatmap, and selected recovery target list.
- **Purpose**: Per `detailed_recovery_plan.md` (Days 1–14), complete the "stopping drift + defining standards" phase so Week 3 (enforcing CI, PR quality, ownership, shared utilities, error handling, logging) and Week 4 (module recovery, ADRs, backlog, re-opening delivery) have concrete, written foundations to act on.
- **Target Users**: Recovery Lead, Architecture Owner, Release Owner, module owners, and future contributors to `legal-luminaire`.

## Goals
- Deliver a **complete Week 1 recovery folder** (no remaining "Placeholder" files).
- Define **one target architecture direction** instead of three competing implicit shapes.
- Establish enforceable written standards for **code structure, API contracts, errors, logging, and configuration** that a new contributor can apply without asking three people.
- Produce an **engineering handbook** (short, practical) consolidating the standards into one readable document.
- Score every major module on seven risk dimensions and output a **detailed risk heatmap** that selects the top 3 recovery targets for Week 4 with rationale, scope, owners, and dependencies.

## Non-Goals
- Not a rewrite. No runtime code is refactored as part of these deliverables; documents only.
- Not adding new features or API routes.
- Not filling the Release Owner / Data Owner / Infra Owner personnel gaps (that is a human process tracked in `01_roles_and_ownership.md` gap register G-1..G-4).
- Not implementing the selected recovery modules (that is Week 4, Days 22–26 of the plan).
- Not setting up CI (Week 3 Day 15), PR templates (Week 3 Day 17), code-owner maps (Week 3 Day 18), shared utility cleanup (Week 3 Day 19), or error/logging code migrations (Week 3 Days 20–21). Those use the standards written here but are in later weeks.

## Background & Context
1. **Source operating plan**: [detailed_recovery_plan.md](file:///E:/Rajkumar/legal-luminaire/SUPPLEMENT/detailed_recovery_plan.md) — Week 1 (Days 1–7), Week 2 (Days 8–14).
2. **Recovery artifacts folder**: `.trae/recovery/week1/` — 4 complete files, 3 placeholders (`04_backend_inventory.md`, `06_risk_heatmap.md`, `07_inconsistencies_and_duplication.md`).
3. **Existing inputs available**:
   - Roles & ownership: [01_roles_and_ownership.md](file:///e:/Rajkumar/legal-luminaire/.trae/recovery/week1/01_roles_and_ownership.md) (4 ownership gaps logged as G-1..G-4, all default-assigned to User as interim).
   - Control rules: [02_control_rules.md](file:///e:/Rajkumar/legal-luminaire/.trae/recovery/week1/02_control_rules.md) (branch policy, PR sizes, review policy, emergency flow, exception register — currently empty).
   - Frontend inventory: [03_frontend_inventory.md](file:///e:/Rajkumar/legal-luminaire/.trae/recovery/week1/03_frontend_inventory.md) (152 modules, 128 active, 14 duplicated, 10 unclear; 18 inconsistencies inline, 9 duplicates listed).
   - Infra inventory: [05_infrastructure_inventory.md](file:///e:/Rajkumar/legal-luminaire/.trae/recovery/week1/05_infrastructure_inventory.md) (environments, 2 CI workflows, 5 deploy targets, 12 infra mismatches, ranked risks: no staging/release-owner, lockfile reproducibility gap, no backend test run in CI, no monitoring).
   - Backend layout observed on disk: FastAPI app (`main.py`), 22 route modules under `api/`, 12 agents under `agents/`, 3 services, 4 RAG modules, graph, registry, drafting, uploaded_cases/ (TC-01..TC-26 + 4 imaginary), 5 test modules, 2 separate backend stacks: Python/FastAPI and an Express TS API server in `artifacts/api-server/`.
4. **Preceding Spec Mode run** (`.trae/specs/patch-completion-and-week1-recovery/`) covered Week 1 days 1–3 plus two patch completion items; that work is assumed complete and is not repeated.

## Functional Requirements
These are deliverable-producing requirements.

- **FR-1**: Complete the placeholder `04_backend_inventory.md` using the structure and columns of `03_frontend_inventory.md` — a module catalog with: purpose, language/framework, runtime/deploy target, owner, upstream callers, downstream deps, DB/queue usage, auth model, logging style, health/test status, duplicate/overlap markers, "nobody fully understands" markers, plus a categorization tally.
- **FR-2**: Consolidate all inconsistencies and duplication from `03_frontend_inventory.md` (§ Inconsistencies Noted Inline, § Duplicates Detected), `05_infrastructure_inventory.md` (§ Mismatches & Hidden Manual Steps), the completed backend inventory, plus naming/folder/API/error/logging/config/auth/session/test-quality inconsistencies identified from a codebase scan, into a single structured list in `07_inconsistencies_and_duplication.md` organized per the plan's Day 7 buckets: naming, folders, API design, error handling, logging, config loading, auth/session, test quality, and a separate duplication list with canonical candidate / obsolete candidate labeled.
- **FR-3**: Produce a combined first-pass risk heatmap in `06_risk_heatmap.md` (Week 1 Day 7 version) with four buckets per the plan: (A) business-critical-and-unstable, (B) business-critical-but-stable, (C) low-criticality-and-messy, (D) unknown-risk. Each module entry must include: module name, path(s), assigned bucket, rationale sentence, owner status (named / unowned).
- **FR-4**: Write `week2/08_architecture_baseline.md` choosing one target architecture direction for the product (modular monolith vs clearly bounded services vs layered application with shared platform components) per Day 8 of the plan, explicitly referencing: current team skill, current deployment model, degree of service duplication, coordination cost, operational complexity, and known exceptions that cannot change immediately.
- **FR-5**: Write `week2/09_code_organization_standard.md` per Day 9 with: folder conventions, file naming rules (pages, components, lib, hooks, features, agents, routes, services, DTOs, tests), shared-code-vs-duplication rules, import rules + allowed dependency directions, and a "what goes in a module vs outside it" section.
- **FR-6**: Write `week2/10_api_contract_standard.md` per Day 10 with: standard request structure where relevant, standard response structure, standard error format, versioning expectations if public, validation boundaries (entry / domain / persistence), and how contracts are documented.
- **FR-7**: Write `week2/11_logging_and_config_standard.md` per Day 11 with: required log fields, log levels + when-to-use, correlation/request ID behavior, where configuration is loaded from, how env vars are validated, and how secrets are referenced without hardcoding.
- **FR-8**: Write `week2/12_engineering_handbook.md` per Day 12 combining the Week 2 decisions concisely. Must include: target architecture, code organization rules, interface rules, logging and config rules, PR and review rules (reusing the applicable pieces of `02_control_rules.md`), and definition of done for the recovery period. The handbook must stay short enough to actually be read (no vague "use best judgment" wording — use explicit standards).
- **FR-9**: Write `week2/13_detailed_risk_heatmap.md` per Day 13 scoring the major modules on seven dimensions defined in the plan: business criticality, change frequency, defect history, ownership clarity, test quality, dependency complexity, runtime fragility. Score each dimension 1–5. Highlight modules that are simultaneously high-change + high-risk. Mark low-value areas to explicitly exclude from Week 4.
- **FR-10**: Write `week2/14_recovery_targets.md` per Day 14 selecting the top 3 recovery modules. For each: owner, reason for selection, key problems, expected recovery outcome, dependencies that must be coordinated. Explicitly postpone all lower-priority modules with a note.

## Non-Functional Requirements
- **NFR-1 (Cross-reference fidelity)**: Every Week 2 standard document must cite the specific Day of `detailed_recovery_plan.md` it maps to, and must not contradict the existing Week 1 documents (`01_roles_and_ownership.md`, `02_control_rules.md`).
- **NFR-2 (Actionability)**: Every standard (code org, API, logging/config, handbook) must be actionable enough that a new contributor can place a file, name a component, or write a log line correctly without asking three people (per the Day 9 / Day 12 exit checks in the plan).
- **NFR-3 (Reality-grounded)**: The architecture baseline (FR-4) must not describe an ideal future unrelated to the current codebase. It must choose the option that reduces confusion fastest given current code, team skill, and deployment targets.
- **NFR-4 (Coverage)**: FR-2 (inconsistencies) must cover at minimum the 8 categories from the plan: naming, folders, API design, error handling, logging, config loading, auth/session, test quality.
- **NFR-5 (Consistency with inventories)**: The Day 7 risk heatmap (FR-3), Day 13 detailed heatmap (FR-9), and Day 14 recovery targets (FR-10) must be consistent: the 3 targets in FR-10 must appear in the high-risk/high-churn zone of FR-9, which must in turn be consistent with the buckets assigned in FR-3.

## Constraints
- **Technical**: All deliverables are Markdown files inside `.trae/recovery/week1/` and a new `.trae/recovery/week2/` directory. No runtime code changes, no dependency additions, no refactors.
- **Business**: Temporary merge freeze from Day 1 through Day 29 (per `01_roles_and_ownership.md` §5 and `02_control_rules.md`) remains active. Recovery documentation deliverables are explicitly exempt from the freeze.
- **Dependencies**: All outputs build on the content of `detailed_recovery_plan.md` and the 4 completed Week 1 files. Inconsistencies from those files must be preserved, not silently dropped, in the FR-2 consolidation.
- **Personnel gaps default to "User as interim"**: Where ownership must be named (FR-10 targets, FR-9 ownership-clarity score), and no real person is known, default to "User (interim)" as in `01_roles_and_ownership.md` and record the fact as an unresolved owner.

## Assumptions
- All 4 ownership gaps (G-1 Release Owner, G-2 Data/RAG, G-3 Auth/Config, G-4 Infra/CI) remain unfilled for the duration of this work and are recorded as-is as risk factors.
- The two parallel backends (FastAPI Python on `artifacts/legal-luminaire/backend` + Express TS on `artifacts/api-server`) both remain supported for now; the architecture baseline (FR-4) will describe how they relate and how to avoid further duplication, but will not order removal of either in this phase.
- No staging environment exists; the infra inventory's finding of "no staging" is treated as a fixed risk driver for this phase.
- The existing 4 completed Week 1 files are stable inputs and will not be modified as part of this work; only the 3 placeholder Week 1 files will be written and Week 2 files will be created.

## Acceptance Criteria

### AC-1: Backend inventory placeholder closed with required columns and tally
- **Type**: `rule`
- **Given**: `.trae/recovery/week1/04_backend_inventory.md` previously contained only the placeholder text
- **When**: a reader opens the new file
- **Then**: the file contains a module catalog with per-module rows covering (purpose, language/framework, runtime/deploy target, owner, upstream callers, downstream deps, DB/queue usage, auth model, logging style, health/test status, status column with duplicate/unknown markers), a categorization tally table (active / duplicated / deprecated / broken / unclear counts), and an executive summary stating total modules counted and top-3 duplicates or gaps observed
- **Pass Condition**: file contains all required sections and is longer than 2 KB on disk
- **Evidence**: `wc -c .trae/recovery/week1/04_backend_inventory.md` > 2000 bytes; manual scan of headings shows all columns and tally section

### AC-2: Inconsistencies & duplication consolidated into the 8 plan categories
- **Type**: `rule`
- **Given**: Inconsistencies are currently scattered across `03_frontend_inventory.md` inline notes, `05_infrastructure_inventory.md` mismatches, and implicit backend patterns
- **When**: a reader opens `.trae/recovery/week1/07_inconsistencies_and_duplication.md`
- **Then**: the file contains a § Inconsistencies with 8 subsections exactly matching the plan Day 7 buckets (naming, folders, API design, error handling, logging, config loading, auth/session, test quality) and a separate § Duplication list containing at least 9 entries with each entry labeling a canonical candidate vs obsolete candidate
- **Pass Condition**: all 8 category headings exist; duplication list contains ≥ 9 numbered entries, each with canonical + obsolete labeled
- **Evidence**: grep for exact section headings; count lines matching `^[0-9]+\.` in duplication section is ≥ 9

### AC-3: Week 1 risk heatmap has 4 buckets and cross-module coverage
- **Type**: `rule`
- **Given**: `.trae/recovery/week1/06_risk_heatmap.md` is a placeholder
- **When**: a reader opens the file
- **Then**: the file contains 4 buckets exactly matching the plan (business-critical-and-unstable / business-critical-but-stable / low-criticality-and-messy / unknown-risk), each bucket lists ≥ 1 module entry, and each entry includes: module name, path, bucket assignment, 1-sentence rationale, owner status (named / unowned)
- **Pass Condition**: all 4 bucket headings exist; each bucket has ≥ 1 row with all 5 required columns
- **Evidence**: manual heading scan + row inspection; grep for 4 exact bucket labels returns 4 matches

### AC-4: Week 2 directory with 7 standards files created
- **Type**: `rule`
- **Given**: no `.trae/recovery/week2/` directory exists yet
- **When**: the deliverables are in place
- **Then**: a `.trae/recovery/week2/` folder exists with exactly these 7 files: `08_architecture_baseline.md`, `09_code_organization_standard.md`, `10_api_contract_standard.md`, `11_logging_and_config_standard.md`, `12_engineering_handbook.md`, `13_detailed_risk_heatmap.md`, `14_recovery_targets.md`
- **Pass Condition**: `ls .trae/recovery/week2/` shows all 7 files
- **Evidence**: directory listing output of `.trae/recovery/week2/`

### AC-5: Architecture baseline is grounded in reality and names a single direction
- **Type**: `rubric`
- **Dimension**: Reality-groundedness and clarity of single target-architecture direction
- **Scale**: 1–5
- **Anchors**:
  - 1 = describes a hypothetical ideal unrelated to the current codebase or presents 3 equivalent options with no choice made
  - 3 = picks one direction but gives shallow rationale (≤ 2 of the 5 decision criteria from plan Day 8 addressed: team skill, deployment model, duplication, coordination cost, operational complexity) and does not list known exceptions
  - 5 = explicitly picks one direction, references all 5 decision criteria from Day 8 of the plan, enumerates known exceptions with timeline (cannot change immediately vs review date)
- **Pass Threshold**: ≥ 4
- **Evidence**: content of `08_architecture_baseline.md`, with grep for keywords matching all 5 criteria (skill, deployment, duplication, coordination, operational) and presence of a "Known exceptions" section

### AC-6: Code organization standard is actionable enough to place a file without asking
- **Type**: `rubric`
- **Dimension**: Actionability of folder/naming/import rules for a new contributor
- **Scale**: 1–5
- **Anchors**:
  - 1 = vague guidelines only ("keep it clean", "use best judgment"), no folder conventions, no concrete rules
  - 3 = defines folder structure and 2–3 naming rules, but leaves import direction and shared-vs-local rules ambiguous (≥ 1 gap where a new contributor would still need to ask)
  - 5 = specifies folder conventions for both frontend (pages, components, lib, hooks, features, context, data, config) and backend (api, agents, services, rag, graph, drafting, registry, tests, utils), naming rules per layer, explicit "when shared code is allowed vs duplication is preferred", import rules with allowed dependency direction (e.g., feature → lib/shared OK, not the reverse), and a "what belongs inside vs outside a module" section
- **Pass Threshold**: ≥ 4
- **Evidence**: content of `09_code_organization_standard.md`; count of distinct file-kind naming rules (pages, components, lib, hooks, features, routes, agents, services, DTOs/tests), presence of shared-vs-local section and import-direction section

### AC-7: API contract standard defines req/res/error/validation
- **Type**: `rule`
- **Given**: `10_api_contract_standard.md` exists
- **When**: a reader opens the file
- **Then**: it contains sections for: (1) standard request structure, (2) standard response structure, (3) standard error format with concrete field names (e.g. error.code, error.message, error.details, error.trace_id), (4) versioning expectations, (5) validation boundaries (entry / domain / persistence), (6) how contracts are documented
- **Pass Condition**: all 6 required sections exist, error format section lists ≥ 4 concrete field names
- **Evidence**: grep for 6 section headings; count of concrete error field names in the error format section ≥ 4

### AC-8: Logging & config standard covers required fields, levels, correlation, validation, secrets
- **Type**: `rule`
- **Given**: `11_logging_and_config_standard.md` exists
- **When**: a reader opens the file
- **Then**: it contains: (1) required log fields list (≥ 5 required fields), (2) log levels with when-to-use guidance for each, (3) correlation / request ID behavior, (4) where config is loaded from (frontend + backend), (5) env var validation expectations (both stacks), (6) how secrets are referenced without hardcoding
- **Pass Condition**: all 6 sections exist; required log fields list has ≥ 5 entries; levels section names ≥ 5 distinct levels
- **Evidence**: heading scan; count bullet points in "required log fields" ≥ 5; count levels in "log levels" section ≥ 5

### AC-9: Engineering handbook is short, consolidates standards, no "best judgment" wording
- **Type**: `rubric`
- **Dimension**: Conciseness, consolidation, and specificity of the handbook
- **Scale**: 1–5
- **Anchors**:
  - 1 = ≥ 500 lines / 25 KB; contains no actionable sections (just links to other docs); or uses "best judgment" / "clean code" wording ≥ 3 times
  - 3 = ≤ 20 KB; includes 4 of 6 required sections from plan Day 12 (architecture, code org, interface, logging/config, PR/review rules, DoD); "best judgment" appears ≤ 2 times
  - 5 = ≤ 15 KB; includes all 6 required sections; PR/review rules directly reuses/summarizes `02_control_rules.md` without contradicting it; DoD is explicit and matches the plan's "definition of done for a recovered module"; zero occurrences of the phrase "best judgment"
- **Pass Threshold**: ≥ 4
- **Evidence**: file size on disk (`wc -c`), grep for "best judgment", manual scan of 6 required section headings

### AC-10: Detailed risk heatmap scores ≥ 10 modules on all 7 Day 13 dimensions
- **Type**: `rule`
- **Given**: `13_detailed_risk_heatmap.md` exists
- **When**: a reader opens the file
- **Then**: it contains a scored table with ≥ 10 module rows, each row scored 1–5 on exactly the 7 Day 13 dimensions (business criticality, change frequency, defect history, ownership clarity, test quality, dependency complexity, runtime fragility), plus a summary section highlighting modules that are simultaneously high-change + high-risk, plus an explicit "excluded from Week 4" list
- **Pass Condition**: ≥ 10 rows, each with all 7 scores, presence of both a high-change+high-risk summary section and a "low-value / excluded from Week 4" section
- **Evidence**: count of module rows; each row has 7 numeric scores; presence of both required summary sections by heading scan

### AC-11: Recovery targets — 3 selected, each with 6 required attributes, consistent with heatmap
- **Type**: `rule`
- **Given**: `14_recovery_targets.md` exists and `13_detailed_risk_heatmap.md` has been produced
- **When**: a reader opens the file
- **Then**: it lists exactly 3 selected recovery modules; each module entry contains all 6 Day 14 fields (owner, reason for selection, key problems, expected recovery outcome, dependencies that must be coordinated, review date); a postponed list section names the explicitly non-selected priority modules; and each of the 3 targets appears in the high-change+high-risk bucket summary of AC-10
- **Pass Condition**: exactly 3 selected modules; each has all 6 required fields; postponed list section exists with ≥ 1 entry; 3-for-3 mapping to AC-10 high-risk bucket passes
- **Evidence**: heading/row scan in `14_recovery_targets.md` and cross-reference to the high-risk summary lines of `13_detailed_risk_heatmap.md`

## Open Questions
- [ ] The plan says on Day 10 "Define versioning expectations if public APIs are involved." — Is the Express `artifacts/api-server` meant to become the public surface, or the FastAPI backend, or both? Assumption for this spec: both are treated as "potentially public" surfaces and versioning expectations are written for both, with a default of `/api/v1` prefix for new FastAPI routes and note that existing Express routes without `/v1` are a known exception to be addressed later.
- [ ] The plan on Day 11 says "correlation or request ID behavior if relevant." — Assumption: correlation ID is relevant because the backend already logs per-request to stdout; standard will define a `X-Request-ID` header propagation + log field, and note that frontend adoption is done when possible via `fetch` wrappers in a later phase.
