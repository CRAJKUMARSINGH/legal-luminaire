# Patch Completion + Week 1 Recovery - Product Requirements Document

## Overview
- **Summary**: Complete application of two feature patches (Draft Multiplication & Pleading Chain Engine) and execute Week 1 (Days 1-7) of the 30-Day Detailed Recovery Plan to stop codebase drift, establish ownership, create inventories, and synthesize risk findings.
- **Purpose**: Per user instructions in `due task.txt` (treat as instructions) and `detailed_recovery_plan.md` (treat as request), ensure both patches are fully functional with no gaps, and establish the baseline controls needed before deeper recovery work.
- **Target Users**: Recovery lead, architecture owner, release owner, documentation owner, module owners, and all contributing engineers.

## Goals
1. Both patches (Draft Multiplication and Pleading Chain Engine) have zero missing files, correct router registration, passing compile checks, and a passing test suite.
2. The codebase has named owners for every major system area (frontend, backend, data, infra, auth, etc.).
3. A complete frontend, backend, and infrastructure inventory exists, with each module categorized as active/duplicated/deprecated/broken/unclear.
4. A first-pass risk heatmap, inconsistency list, and duplication list are published as markdown deliverables in the recovery folder.
5. Clear operating rules (branch policy, review policy, emergency change flow) are documented in a recovery handbook folder.

## Non-Goals
1. Full rewrite or refactor of any module (reserved for Week 3-4 of recovery).
2. Execution of Week 2-4 tasks (architecture direction, CI gates, module stabilization) — those are out of scope for this spec and require separate approval.
3. Any new feature work beyond patch completion and recovery deliverables.
4. Fixing all identified risks and inconsistencies this cycle; only cataloging and prioritizing them.

## Background & Context
The project `legal-luminaire` is a React/TypeScript/Vite frontend + FastAPI backend legal AI platform. Two feature patches were prepared in `E:\Rajkumar\legal-luminaire\SUPPLEMENT\`:
- **draft-multiplication-patch**: Document Family (derivative drafts) — 8 files, 2 routing edits.
- **legal-luminaire-pleading-variants-patch**: Pleading Chain Engine — 9 files, 2 routing edits, 1 feature flag.

Preliminary inspection shows most patch files are already present in the codebase, but at least `test_variant_engine.py` is missing from `backend/tests/`, and feature flag `VITE_FF_ENABLE_PLEADING_VARIANTS` needs verification. No structured ownership, inventories, or risk heatmaps currently exist.

The `detailed_recovery_plan.md` at `E:\Rajkumar\legal-luminaire\SUPPLEMENT\detailed_recovery_plan.md` defines the 30-day recovery framework. This spec covers **Week 1 only (Days 1-7)** plus **patch gap completion**.

## Functional Requirements
- **FR-1 (Patch Gap Fix)**: Every file listed in both patch APPLY/README maps must exist in the codebase at the correct adapted path, with correct content matching each patch's intent.
- **FR-2 (Router Registration)**: Both `derivative_router` (Draft Multiplication) and `pleading_variants_router` (Pleading Chain Engine) must be correctly imported and registered in `backend/main.py` with the correct prefixes, and both corresponding frontend lazy routes must exist in `src/routes.tsx`.
- **FR-3 (Test File)**: The test `test_variant_engine.py` must be present in `artifacts/legal-luminaire/backend/tests/` and importable.
- **FR-4 (Recovery Roles)**: A recovery roles document must name a Recovery Lead, Architecture Owner, Release Owner, Documentation Owner, and initial Module Owners for each major area.
- **FR-5 (Control Rules)**: Three operating rules documents must exist: Branch Policy, Review Policy, and Emergency Change Flow.
- **FR-6 (Frontend Inventory)**: A frontend module inventory must exist, listing every frontend app/module, categorizing each as active/duplicated/deprecated/broken/unclear, and recording framework, state management, routing, shared UI usage, and build tooling.
- **FR-7 (Backend Inventory)**: A backend inventory must exist, listing every service/API/worker/job, recording language/framework/runtime/deployment target/owner, and for each service: purpose, upstream callers, downstream deps, DB/queue usage, auth model, logging style, health/test status.
- **FR-8 (Infra Inventory)**: An infrastructure inventory must exist, listing every environment (local/dev/staging/prod), config source, secret handling, deploy/rollback method, monitoring setup, and identifying mismatches and hidden manual steps.
- **FR-9 (Risk Heatmap)**: A first-pass risk heatmap must categorize modules/areas as: business-critical-and-unstable, business-critical-but-stable, low-criticality-and-messy, unknown-risk.
- **FR-10 (Inconsistency & Duplication Lists)**: Published lists of top naming/folder/API/error/logging/config/auth/test inconsistencies, and top duplicate modules/utilities/services.

## Non-Functional Requirements
- **NFR-1 (Compile Check)**: All backend Python files touched by the patches must pass `python -m py_compile` without errors.
- **NFR-2 (Type Check)**: All frontend TS/TSX files touched by the patches must pass esbuild parse (no syntax errors).
- **NFR-3 (Importability)**: Every new backend module must be importable without ImportError in the current Python environment.
- **NFR-4 (Deliverable Location)**: All recovery deliverables (roles, rules, inventories, heatmaps) must be stored as markdown files under `.trae/recovery/week1/` in the repo root, with clear filenames.
- **NFR-5 (Traceability)**: Every acceptance criterion must link to evidence (file existence, command exit code 0, file content snippet).
- **NFR-6 (No Breaking Changes)**: Patch completion must remain additive; no existing code paths may be removed or altered beyond the documented router registrations.

## Constraints
- **Technical**: Existing code uses React + wouter routing, FastAPI, feature flags in `config/featureFlags.ts`. All patch routes must follow existing patterns (lazy imports, `/api/v1` or `/api` prefix conventions matching existing peers).
- **Business**: The temporary merge freeze declared in Day 1 applies; no features outside this spec's scope may be merged during execution.
- **Dependencies**: Python tests require pytest; frontend typecheck requires pnpm/esbuild. Both must be available in the environment.

## Assumptions
1. The adapted paths for Pleading Chain Engine (`api/routes_pleading_variants.py` instead of `routers/pleading_variants.py`, and route `/case/:id/draft-variants` instead of `/drafts/:caseId/variants`) are intentional and correct for this codebase's conventions.
2. The user acts as the approver for recovery roles and rules if no explicit team exists.
3. If production/environments don't exist yet, inventories will honestly record "N/A" or "Not established" rather than fabricating details.
4. LLM credentials (if needed for smoke tests) are not required for this spec; compile and import checks suffice.

## Acceptance Criteria

### AC-1: Draft Multiplication patch files all present at correct paths
- **Type**: `rule`
- **Given**: The 6 new Draft Multiplication files listed in APPLY.md
- **When**: Each expected path is checked for file existence
- **Then**: All 6 new files exist AND main.py imports derivative_router AND routes.tsx has lazy import + /case/:id/draft-family route
- **Pass Condition**: Every path returns file-exists; both routing edits are present.
- **Evidence**: File listing output of Glob tool + grep hits in main.py and routes.tsx.

### AC-2: Pleading Chain Engine patch files all present at correct adapted paths
- **Type**: `rule`
- **Given**: The 9 Pleading Chain files mapped in README.md
- **When**: Each adapted path (api/routes_pleading_variants.py, services/variant_engine.py, data/subject_variants.json, pages/DraftVariantsPage.tsx, components/VariantChain.tsx, components/CitationAddToDraft.tsx, hooks/usePleadingVariants.ts, lib/variantsApi.ts, tests/test_variant_engine.py) is checked
- **Then**: All 9 files exist, main.py imports pleading_variants_router, routes.tsx has lazy import + /case/:id/draft-variants route
- **Pass Condition**: Every path returns file-exists; both routing edits present.
- **Evidence**: Glob file listing + grep hits.

### AC-3: Backend compile and import clean
- **Type**: `rule`
- **Given**: All backend files touched by both patches
- **When**: `python -m py_compile` is run on registry/__init__.py, agents/derivative_drafter.py, api/routes_derivative.py, api/routes_pleading_variants.py, services/variant_engine.py, main.py, and test_variant_engine.py
- **Then**: All compile without error; and a `python -c "import sys; sys.path.insert(0,'.'); from api.routes_derivative import router; from api.routes_pleading_variants import router as r2; from services.variant_engine import VariantEngine; print('OK')"` succeeds from `backend/`
- **Pass Condition**: Exit code 0 on all commands.
- **Evidence**: Bash command output showing "PY_COMPILE OK" and "OK" print.

### AC-4: Frontend parse clean
- **Type**: `rule`
- **Given**: lib/draft-family.ts, pages/DraftFamilyPanel.tsx, pages/DraftVariantsPage.tsx, components/VariantChain.tsx, components/CitationAddToDraft.tsx, hooks/usePleadingVariants.ts, lib/variantsApi.ts, routes.tsx
- **When**: Each file is parsed with esbuild (loader ts or tsx)
- **Then**: Zero syntax errors on every file
- **Pass Condition**: esbuild exit code 0, no stderr errors
- **Evidence**: ESBUILD CHECK DONE output

### AC-5: Recovery roles document published
- **Type**: `rule`
- **Given**: Week 1 Day 1-2 recovery
- **When**: `.trae/recovery/week1/01_roles_and_ownership.md` is checked
- **Then**: File exists; contains named Recovery Lead, Architecture Owner, Release Owner, Documentation Owner; contains an ownership matrix for frontend, backend, data, auth, infra, docs with named owners or visible "UNOWNED" gaps.
- **Pass Condition**: File exists; all 4 lead roles + 6 area matrix rows present.
- **Evidence**: File content via Read tool.

### AC-6: Control rules documents published
- **Type**: `rule`
- **Given**: Week 1 Day 3 recovery
- **When**: `.trae/recovery/week1/02_control_rules.md` is checked
- **Then**: File exists; contains Branch Policy (source-of-truth branch, naming conventions, PR size guidance), Review Policy (mandatory review expectations), Emergency Change Flow (who can override, when)
- **Pass Condition**: All three rule sections present in file.
- **Evidence**: File content via Read tool.

### AC-7: Frontend inventory published
- **Type**: `rubric`
- **Dimension**: Completeness and accuracy of frontend module inventory
- **Scale**: 1-5
- **Anchors**: 1 = no inventory or entirely fabricated; 3 = lists major modules but misses categorization or metadata fields; 5 = every module found, categorized (active/duplicated/deprecated/broken/unclear), with framework, state mgmt, routing, shared UI, build tooling recorded, and inconsistencies/duplications noted inline.
- **Pass Threshold**: >= 4
- **Evidence**: File `.trae/recovery/week1/03_frontend_inventory.md` exists and can be read.

### AC-8: Backend inventory published
- **Type**: `rubric`
- **Dimension**: Completeness and accuracy of backend inventory
- **Scale**: 1-5
- **Anchors**: 1 = no inventory or fabricated; 3 = lists major services misses per-service metadata; 5 = every API router, agent, service, worker, scheduled job listed; each has purpose, upstream/downstream, DB/queue, auth, logging, health status recorded, duplicates/overlaps marked.
- **Pass Threshold**: >= 4
- **Evidence**: File `.trae/recovery/week1/04_backend_inventory.md` exists and can be read.

### AC-9: Infrastructure inventory published
- **Type**: `rubric`
- **Dimension**: Honesty and completeness of infra/environment inventory
- **Scale**: 1-5
- **Anchors**: 1 = missing or made up; 3 = names environments but misses config/secret/deploy details; 5 = every available environment listed, honestly records "Not established" where unknown, captures config source, secret handling, deploy/rollback, monitoring, mismatches, and manual steps.
- **Pass Threshold**: >= 4
- **Evidence**: File `.trae/recovery/week1/05_infrastructure_inventory.md` exists and can be read.

### AC-10: Risk + inconsistencies + duplication deliverables published
- **Type**: `rule`
- **Given**: Week 1 Day 7 synthesis
- **When**: `.trae/recovery/week1/06_risk_heatmap.md`, `.trae/recovery/week1/07_inconsistencies_and_duplication.md` are checked
- **Then**: Both files exist; risk heatmap has at least the 4 required quadrants populated with actual module names from inventories; inconsistency list covers at least naming, folders, API design, errors, logging, config, auth, test quality; duplication list has at least 3 concrete duplicated items.
- **Pass Condition**: Both files exist with required structure populated from real inventory data.
- **Evidence**: File contents via Read tool.

## Open Questions
- [ ] Who should be named in the Recovery Roles document? If no team is specified, default = user as Recovery Lead + Architecture Owner, and mark unowned areas explicitly.
- [ ] Is the adapted route path `/case/:id/draft-variants` (instead of patch's `/drafts/:caseId/variants`) the correct pattern for this repo? Assume yes unless user overrides.
- [ ] Is `api/routes_pleading_variants.py` (instead of patch's `routers/pleading_variants.py`) the correct folder convention? Assume yes unless user overrides.
