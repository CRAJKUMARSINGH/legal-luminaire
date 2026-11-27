# Unwired Files Inventory — Legal Luminaire

Current-state inventory of files that exist in the working repository but are not reachable from the canonical application entry points, plus standalone guidance, evidence, and reference material.

- Generated: 2026-11-27
- Branch: `codex/code-junction-launch-hardening`
- HEAD: `08c5929`
- Canonical frontend entry: `artifacts/legal-luminaire/src/main.tsx`
- Canonical backend entry: `artifacts/legal-luminaire/backend/main.py`
- Method: static import graph traversal, Python AST import traversal, test-reachability traversal, Git/file inventory, and targeted reference searches.

## Companion reports

- [Unwired code inventory](unwired-code-inventory.md) — every runtime-unreachable source file, test-only module, utility, legacy package, and archived code file.
- [Guidance material inventory](guidance-material-inventory.md) — every retained pre-existing standalone Markdown/text document, grouped by incorporation value and disposition.

## What “unwired” means here

A file is considered runtime-unwired when no static import, dynamic import, `require()`, router registration, or Python import reaches it from the canonical frontend or backend entry point. This is intentionally stricter than “not deployed”:

- Test-only files are listed separately because they are wired to Vitest/pytest, not to the application runtime.
- Documentation and evidence are intentionally non-executable; they are inventoried so their guidance can be incorporated deliberately.
- Archived packages are already retired and should not be merged back into the canonical runtime.
- A nested duplicate `legal-luminaire/` Git checkout was present; it was removed on 2026-11-27 (see “Duplicate checkout and local-only material”).
- Dependency folders, virtual environments, build output, caches, and bytecode are excluded from the backlog.

## Executive summary

| Area | Current count | Classification | Recommended treatment |
|---|---:|---|---|
| Frontend source unreachable from runtime and tests | 52 | Prototypes, duplicates, utilities, unused UI primitives | Triage individually; most are not feature-complete |
| Backend source unreachable from runtime and tests | 10 | One unwired feature cluster, alternates, utilities, one empty file | Register-or-retire decision for derivative drafting; do not wire blindly |
| Frontend test-reachable but not runtime-reachable | 15 | 14 test files + `intake-schema.ts` | Keep tests; decide whether the schema belongs in runtime |
| Backend test-reachable but not runtime-reachable | 20 | Tests/package initializers + 2 production modules | Keep tests; resolve verification-module status |
| Legacy `lib/**` workspace files | 79 | Express/Drizzle-era API spec, clients, schemas | Not consumed by the canonical app; retain only with the retired stack |
| Archived package/script files | 93 | Retired Express API, mockup sandbox, retired scripts | Keep archived; do not reincorporate without a new ADR |
| Retained baseline standalone `.md`/`.txt` documents | 360 | 452 baseline documents minus 25 removed enrichment reports, 10 earlier test-document removals, 27 stale result/snapshot documents, and 30 redundant reports removed on 2026-11-27 | Keep only active functional material; see guidance report |
| Duplicate nested Git checkout | 0 | Independent repository at `legal-luminaire/` | **Removed 2026-11-27** — redundant clone (same remote/commit, no unique commits) |
| Missing drafting/registry source files | 11 | Source never committed; only historical bytecode evidence | Product decision: supersede or rebuild |

## Highest-priority findings

### 1. Derivative drafting is a complete but unregistered cluster

Cluster:

- `artifacts/legal-luminaire/backend/api/routes_derivative.py`
- `artifacts/legal-luminaire/backend/agents/derivative_drafter.py`

The code includes feature flags, pairing checks, lineage, synthetic labeling, and bilingual disclaimers. It still needs an explicit product decision, citation-gate integration, persistent family storage, and route tests before registration.

### 2. Alternate engines should be benchmarked, not silently swapped

- `backend/agents/fact_fit_engine.py` is an optimized alternate Fact-Fit implementation.
- `backend/rag/optimized_document_store.py` is an alternate RAG store.

Both are unreferenced. Compare correctness, latency, memory, offline behavior, and failure semantics against the wired implementations before any adoption.

### 3. The PDF helper is plausible future code, but export remains gated

`backend/utils/pdf_engine.py` is unreferenced. It may support a future court-ready PDF path, but no export integration should proceed unless `PENDING` and `FATAL_ERROR` citations remain physically blocked and advocate-review disclosures are preserved.

### 4. Most frontend orphans are inventory, not ready features

The 52 frontend orphans include 36 unused shadcn/Radix primitives, legacy/alternate views, small hooks/formatters, and several prototype panels. They should be triaged as:

- reusable primitive — keep until a real consumer exists;
- prototype — promote only with route, API, tests, empty/error states, and feature-flag treatment;
- duplicate/legacy — retire;
- empty or trivial — delete if no planned consumer exists.

## Disposition legend

| Code | Meaning |
|---|---|
| `INCORPORATE` | Worth wiring after the listed prerequisites are satisfied |
| `BLOCKED_REVIEW` | Do not wire until a product, data, legal, or safety decision is recorded |
| `KEEP_TEST` | Intentional test-only code |
| `KEEP_GUIDANCE` | Standalone instructions/specification worth retaining |
| `KEEP_EVIDENCE` | Retained audit/release evidence; stale generic snapshots are removed when superseded |
| `KEEP_DATA` | Case, fixture, template, or generated reference material |
| `CONSOLIDATE` | Merge unique guidance into a canonical document, then delete the duplicate |
| `ARCHIVE` | Retired code or data kept for operational provenance; do not merge into the canonical runtime |
| `DELETE` | Empty, stale, or redundant candidate; confirm no planned consumer first |
| `WIRED_AUXILIARY` | Not part of the web request path, but intentionally connected to workspace tooling |

## Code backlog by area

### Backend runtime orphans

| File | Disposition | Next action |
|---|---|---|
| `backend/api/routes_derivative.py` | `BLOCKED_REVIEW` | Decide register vs. retire; add gate, persistence, auth, tests |
| `backend/agents/derivative_drafter.py` | `BLOCKED_REVIEW` | Treat as one feature cluster with its router |
| `backend/agents/fact_fit_engine.py` | `INCORPORATE` only after benchmark | Compare against canonical gate; never weaken blocking |
| `backend/rag/optimized_document_store.py` | `INCORPORATE` only after benchmark | Compare correctness and case isolation against wired store |
| `backend/utils/pdf_engine.py` | `INCORPORATE` behind gate | Integrate only into a gated export path with Devanagari tests |
| `backend/graph/neo4j_client.py` | `BLOCKED_REVIEW` | Optional future integration or retirement |
| `backend/api/regional_audit.py` | `KEEP_TEST` / script | Keep as an audit utility; do not import into runtime |
| `backend/api/stress_test_ingest.py` | `KEEP_TEST` / script | Keep as a standalone ingestion stress harness |
| `backend/scripts/generator.py` | `DELETE` | Empty file |
| `backend/scripts/seed_26_cases.py` | `INCORPORATE` as documented utility | Wire into setup/docs or retire; not application runtime |

### Frontend runtime orphans

| Group | Count | Disposition |
|---|---:|---|
| Feature prototypes/alternate views | 8 | Review for promotion or retirement |
| Duplicate/legacy layout and header | 2 | Retire or document why retained |
| Data/hooks/formatters | 6 | Keep only with a named consumer or planned use |
| Unused UI primitives | 36 | Design-system inventory; not automatically feature backlog |

See the code inventory for every path and a suggested integration point.

## Guidance and documentation backlog

The guidance report lists the 360 documents retained from the 452-document baseline. The main consolidation targets are:

1. ~~`CODE-JUNCTION/COMPREHENSIVE LAUNCH-READY TASK FOR.txt`~~ — primary launch brief (removed 2026-11-27; applied and folded into `LAUNCH_HARDENING_REPORT.md`).
2. ~~`CODE-JUNCTION/lel# SYSTEM  ROLE DEFINITION.md`~~ — consolidation candidate (removed 2026-11-27; distinct criteria consolidated).
3. `LAUNCH_HARDENING_REPORT.md` — current launch status; locally modified and must be preserved.
4. `docs/adr/ADR-010-gemini-direct-drafting.md` — closed drafting-package supersession decision.
5. `docs/adr/ADR-011-retire-pleading-chain.md` — closed Pleading Chain retirement decision.
6. `docs/APP_AUDIT_SCATTERED_CODE.md` — earlier code-health audit; some recommendations are already implemented.
7. `docs/MODERNIZATION_PLAN.md`, `docs/ROADMAP.md`, `docs/roadmap/`, and the CI-required Week 13 enrichment lock — reconcile current planning input before reuse.
8. `audit-results/`, `final-deliverables/`, `design-deliverables/`, and scattered `artifacts/*` — retain active controls, procedures, and current evidence; superseded reports have been removed.

## Missing material that is not represented by a current source file

| Missing path/material | Status | Required decision |
|---|---|---|
| `backend/drafting/{__init__,architecture,blocks,catalog,conflicts,engine,grounds,placeholders,prompts}.py` | Never committed; historical bytecode only | Supersede via ADR or rebuild deliberately from requirements |
| `backend/registry/{__init__,derivative_drafts}.py` | Superseded predecessor evidence | Keep archived; do not reconstruct by inference |
| `ETERNAL_RESEARCH_CHILD/tsconfig.phase2.json` | Referenced by package script but absent | Add the config or correct the script before relying on daemon typecheck |

The former Pleading Chain registry, gate, and retrieval gaps were closed by ADR-011 when that unreleased feature was retired. They are not current source requirements.

## Archived and legacy code

- `archive/retired-packages/api-server/` — 20 files; retired Express/Drizzle backend.
- `archive/retired-packages/mockup-sandbox/` — 69 files; retired Replit-era mockup.
- `archive/retired-scripts/` — 4 files; retired one-off scripts.
- `lib/` — 79 files; legacy API/spec/client/database workspace packages not imported by the canonical frontend or FastAPI backend.
- `scripts/post-merge.sh` still invokes the legacy `db push` path and is not part of the canonical runtime.

These are inventory/archive decisions, not incorporation tasks, unless a new architecture decision explicitly revives them.

## Duplicate checkout and local-only material

- `legal-luminaire/` was a separate nested Git repository at canonical commit `08c5929`; it was **removed on 2026-11-27** after confirmation (redundant clone: same remote, same commit, no unique commits).
- `.kilo/worktrees/succulent-buffer/` is a linked worktree at detached HEAD `8903cde`; it is tooling metadata, not product backlog.
- `.pytest_cache/`, `.ruff_cache/`, `node_modules/`, virtual environments, `dist/`, and `__pycache__/` are local generated material and are excluded.
- The old debug/audit debris listed in the 2026-11-21 inventory is no longer present in the current non-dependency working-tree scan.

## Verified as wired or intentionally auxiliary

| Area | Why it is not in the actionable backlog |
|---|---|
| `artifacts/legal-luminaire/src/**` reachable from `main.tsx` | Canonical frontend runtime |
| `artifacts/legal-luminaire/backend/**` reachable from `main.py` | Canonical FastAPI runtime |
| `src/data/researchImprovements.generated.ts` | Imported by `ResearchImprovementView.tsx`; `/improvement-lab` is wired |
| `ETERNAL_RESEARCH_CHILD/**` | Root `pnpm daemon*` scripts invoke it; it writes the wired improvement feed |
| `real_cases/**` | Referenced by demo-case paths, template library, and backend seeding utility |
| `output_100426/**` | Several files are referenced by the template library; retain as source/reference data |
| `.github/**`, root workspace/config files | CI, deployment, and workspace infrastructure |

## Recommended order of work

1. **Decide whether to register or retire derivative drafting.** Do not wire the router before the decision and safety prerequisites are complete.
2. **Benchmark alternate engines** against canonical implementations; adopt only with parity tests.
3. **Triage frontend prototypes** by named user journey; retire duplicates and unused primitives with no planned consumer.
4. **Consolidate launch guidance** into the primary brief and current launch report; keep one current test/build baseline and retain only actively referenced evidence.
5. **Document or retire utility scripts and legacy packages**; avoid creating a second runtime.
6. **Nested checkout resolved** — the redundant `legal-luminaire/` clone was removed on 2026-11-27 after explicit approval; no synchronization is now required.

## Nested checkout disposition

The nested `legal-luminaire/` repository (a redundant duplicate clone at canonical commit `08c5929`, same remote, no unique commits) was **removed on 2026-11-27** after explicit user approval. The root repository is now the single working tree.
