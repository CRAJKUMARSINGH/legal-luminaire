# Patch Completion + Week 1 Recovery - Implementation Plan

## Task 1: Copy missing test_variant_engine.py to backend/tests/
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Copy `E:\Rajkumar\legal-luminaire\SUPPLEMENT\legal-luminaire-pleading-variants-patch\backend\tests\test_variant_engine.py` to `E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\backend\tests\test_variant_engine.py
  - Verify file copies with identical content (no import path mismatches)
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `rule` TR-1.1: File exists at `artifacts/legal-luminaire/backend/tests/test_variant_engine.py` with size > 0 bytes; evidence: Glob + dir listing
  - `rule` TR-1.2: File is Python parseable via `python -m py_compile`; evidence: py_compile exit code 0
- **Notes**: This is the only confirmed missing file from initial inventory.

## Task 2: Verify Draft Multiplication patch file inventory and routing
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1 (soft dep — runs alongside, no hard coupling)
- **Description**:
  - Confirm all 6 new Draft Multiplication files exist at correct paths:
    1. `backend/registry/__init__.py`
    2. `backend/registry/derivative_drafts.json`
    3. `backend/agents/derivative_drafter.py`
    4. `backend/api/routes_derivative.py`
    5. `src/lib/draft-family.ts`
    6. `src/pages/DraftFamilyPanel.tsx`
  - Confirm registration edits in `backend/main.py`: import + include_router
  - Confirm registration edits in `src/routes.tsx`: lazy DraftFamilyPanel + route /case/:id/draft-family
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `rule` TR-2.1: All 6 files exist; evidence: Glob output listing each path
  - `rule` TR-2.2: `from api.routes_derivative import router as derivative_router` is present in main.py line ~39
  - `rule` TR-2.3: `app.include_router(derivative_router, prefix="/api/v1")` is present in main.py
  - `rule` TR-2.4: `const DraftFamilyPanel = lazy(() => import("@/pages/DraftFamilyPanel"))` present in routes.tsx
  - `rule` TR-2.5: Route `<Route path="/case/:id/draft-family"` present in routes.tsx
- **Notes**: If any file is missing, copy from SUPPLEMENT/draft-multiplication-patch/ matching path.

## Task 3: Verify Pleading Chain Engine patch file inventory and routing
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1 (hard dep — test file must exist)
- **Description**:
  - Confirm all 9 adapted Pleading Chain files exist:
    1. `backend/api/routes_pleading_variants.py` (adapted from routers/)
    2. `backend/services/variant_engine.py`
    3. `backend/data/subject_variants.json`
    4. `src/pages/DraftVariantsPage.tsx`
    5. `src/components/VariantChain.tsx`
    6. `src/components/CitationAddToDraft.tsx`
    7. `src/hooks/usePleadingVariants.ts`
    8. `src/lib/variantsApi.ts`
    9. `backend/tests/test_variant_engine.py` (Task 1 deliverable)
  - Confirm registration edits:
    - main.py: import + include_router for pleading_variants_router
    - routes.tsx: lazy DraftVariantsPage + route /case/:id/draft-variants
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `rule` TR-3.1: All 9 files exist; evidence: Glob
  - `rule` TR-3.2: `from api.routes_pleading_variants import router as pleading_variants_router` present in main.py
  - `rule` TR-3.3: `app.include_router(pleading_variants_router, prefix="/api")` present in main.py
  - `rule` TR-3.4: `const DraftVariantsPage = lazy(() => import("@/pages/DraftVariantsPage"))` in routes.tsx
  - `rule` TR-3.5: Route `<Route path="/case/:id/draft-variants"` present in routes.tsx
- **Notes**: Adapted path api/ folder convention (not routers/) matches existing codebase; do not change to routers/.

## Task 4: Run backend compile + import verification
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 1, 2, 3 (all files must be in place)
- **Description**:
  - From `artifacts/legal-luminaire/backend/`, run:
    - `python -m py_compile` on: registry/__init__.py, agents/derivative_drafter.py, api/routes_derivative.py, api/routes_pleading_variants.py, services/variant_engine.py, main.py, tests/test_variant_engine.py
    - Python import sanity check: `python -c "import sys; sys.path.insert(0,'.'); from api.routes_derivative import router; from api.routes_pleading_variants import router as r2; from services.variant_engine import VariantEngine; print('IMPORT OK')"`
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `rule` TR-4.1: py_compile exit code 0 for every file; evidence: "PY_COMPILE OK"
  - `rule` TR-4.2: Import sanity check prints "IMPORT OK" and exit code 0; evidence: bash output
- **Notes**: If ImportError occurs on variant_engine (e.g., missing data/ folder in sys.path), fix import paths in test or in variant_engine.py relative imports.

## Task 5: Run frontend TS/TSX parse verification
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 2, 3
- **Description**:
  - From `artifacts/legal-luminaire/`, parse each relevant file with esbuild:
    - src/lib/draft-family.ts, src/pages/DraftFamilyPanel.tsx, src/pages/DraftVariantsPage.tsx, src/components/VariantChain.tsx, src/components/CitationAddToDraft.tsx, src/hooks/usePleadingVariants.ts, src/lib/variantsApi.ts, src/routes.tsx
  - Use: `npx -y esbuild <file> --loader:.ts=ts --outfile=/dev/null` (or NUL on Windows) — any parse error free result
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `rule` TR-5.1: esbuild exit code 0 on all 8 files with no stderr errors; evidence: "ESBUILD CHECK DONE" / no errors
- **Notes**: If import "@/" aliases are not resolved by esbuild parse-only; that's expected. Only syntax errors matter.

## Task 6: Create recovery folder structure + base files
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None (independent of Tasks 1-5)
- **Description**:
  - Create `.trae/recovery/week1/` directory
  - Create empty placeholder markdown files for all deliverables:
    - 01_roles_and_ownership.md
    - 02_control_rules.md
    - 03_frontend_inventory.md
    - 04_backend_inventory.md
    - 05_infrastructure_inventory.md
    - 06_risk_heatmap.md
    - 07_inconsistencies_and_duplication.md
- **Acceptance Criteria Addressed**: AC-5, AC-6, AC-7, AC-8, AC-9, AC-10 (file-existence prerequisite layer)
- **Test Requirements**:
  - `rule` TR-6.1: Directory `.trae/recovery/week1/` exists with all 7 markdown files present
- **Notes**: Placeholders will be populated in Tasks 7-12.

## Task 7: Write Recovery Roles & Ownership document (Days 1-2)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 6
- **Description**:
  - Populate `01_roles_and_ownership.md` with:
    - Recovery Lead: User (default; note this in doc)
    - Architecture Owner: User (default)
    - Release Owner: User (default; or mark UNOWNED with note)
    - Documentation Owner: User (default)
    - Ownership matrix rows:
      - Frontend applications + shared UI
      - Backend services + agents + APIs
      - Data layer + RAG + DB
      - Auth + identity + config
      - Deployment + infra + CI/CD
      - Docs + product specs
    - Mark each area with a named owner or explicit "UNOWNED — gap to resolve"
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `rule` TR-7.1: File contains all 4 lead roles + 6 area matrix rows; evidence: Read tool output
  - `rubric` TR-7.2: Clarity of ownership (scale 1-5, anchors 1=vague 3=names present 5=each row has explicit owner-or-gap rationale; threshold >=4)
- **Notes**: Per Assumptions in spec.md, if no team named, default = user. Do not fabricate team members.

## Task 8: Write Control Rules document (Day 3)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 6
- **Description**:
  - Populate `02_control_rules.md` with 3 sections:
    - **Branch Policy**: `main` = only source of truth. Allowed branch names: `feat/...`, `fix/...`, `recovery/...`, `hotfix/...`. PR size guidance: < 400 LOC preferred, > 1000 requires recovery lead approval.
    - **Review Policy**: 1 mandatory reviewer from ownership matrix. No merge if CI red. Large PRs (> 1k LOC) = 2 reviewers.
    - **Emergency Change Flow**: Hotfix only for production outage. Recovery Lead + Release Owner must both approve. Post-hoc review within 24h.
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `rule` TR-8.1: 3 sections present with required sub-points; evidence: Read tool file content
- **Notes**: Base content adapted from `detailed_recovery_plan.md` Days 1-3 rules.

## Task 9: Explore and populate Frontend Inventory (Day 4)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 6
- **Description**:
  - Explore `artifacts/legal-luminaire/src/` tree: pages/, components/, lib/, hooks/, features/, config/, context/, data/, routes.tsx, App.tsx
  - Explore `artifacts/api-server/` and `artifacts/mockup-sandbox/` as separate modules
  - For each module, record: name, path, status (active/duplicated/deprecated/broken/unclear), framework, state mgmt, routing, shared UI, build tooling
  - Identify duplicates: e.g., multiple Button.tsx, overlapping functionality, multiple lib/ doing the same thing
  - Write findings to `03_frontend_inventory.md`
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `rule` TR-9.1: Inventory covers pages/ (>= 30 pages listed), components/ui/, lib/, hooks/, features/, config/, context/, data/; evidence: Read + file size
  - `rubric` TR-9.2: Inventory quality per AC-7 rubric (scale 1-5, threshold >=4)
- **Notes**: Use LS + Glob + Read for exploration. This task is exploration-heavy.

## Task 10: Explore and populate Backend Inventory (Day 5)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 6
- **Description**:
  - Explore `artifacts/legal-luminaire/backend/`: api/, agents/, services/, registry/, data/, rag/, graph/, drafting/, tests/, scripts/, utils/, main.py, config.py
  - Record per service/router/agent: purpose, upstream/downstream, DB/queue, auth, logging, health status, overlaps/duplicates
  - Write to `04_backend_inventory.md`
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `rule` TR-10.1: Inventory covers all api/routes_*.py files (>= 15 routers listed), all agents/*.py, services/, rag/, graph/, drafting/, tests/; evidence: file content
  - `rubric` TR-10.2: Inventory quality per AC-8 rubric (scale 1-5, threshold >=4)
- **Notes**: Map dependencies:
  - Cross-reference routers import tree (who imports whom for upstream/downstream.

## Task 11: Explore and populate Infrastructure Inventory (Day 6)
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 6
- **Description**:
  - Explore repo root for CI (docker-compose.yml, .github/workflows/, Dockerfiles*, requirements.txt, package.json, vercel.json, nginx.conf, start.bat, start.sh
  - List environments found: local, vercel deploy, docker. any "dev/staging/prod honestly "Not established" if unknown
  - Capture: config source (.env.example, secret handling, deploy method, rollback, monitoring, mismatches, manual steps
  - Write to `05_infrastructure_inventory.md`
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `rule` TR-11.1: File explicitly list every environment found plus docker-compose, github workflows, Dockerfile*, requirements.txt, package.json vercel references, start scripts; evidence: Read output
  - `rubric` TR-11.2: Inventory quality per AC-9 rubric (scale 1-5, threshold >=4)
- **Notes**: Do not invent staging

## Task 12: Synthesize Risk Heatmap + Inconsistencies/Duplication (Day 7)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 9, 10, 11 (hard dep on inventories
- **Description**:
  - From inventory data:
    - `06_risk_heatmap.md`: Build 4 quadrants (business-critical & unstable, business-critical & stable, low-criticality & messy, unknown-risk) with actual module names
    - `07_inconsistencies_and_duplication.md`: List naming, folder structure, API, error-handling, logging, config, auth/session, test-quality inconsistencies; duplication list with at least 3 concrete duplicates from inventories
- **Acceptance Criteria Addressed**: AC-10
- **Test Requirements**:
  - `rule` TR-12.1: Risk heatmap 4 quadrants each populated with >= 2+ module names from inventories; evidence: Read
  - `rule` TR-12.2: Inconsistency list covers >= 8 of 8 required categories (naming, folders, API, error handling, logging, config, auth, test quality
  - `rule` TR-12.3: Duplication list >= 3 concrete items with paths
- **Notes**: Tie every listed items to real inventory findings; no generic content.
