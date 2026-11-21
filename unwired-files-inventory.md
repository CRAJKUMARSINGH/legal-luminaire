# Unwired Files Inventory — Legal Luminaire

Inventory of files that exist in the working repository but are **not wired into the
running application** (`artifacts/legal-luminaire` frontend + Python backend) — i.e. content
that is either **code awaiting incorporation** or **guidance / evidence material**.

- Generated: 2026-11-21
- Baseline commit (HEAD): `c8f91cb` — "chore: remove duplicate enrichment docs and stale generated artifacts"
- Branch: `main` (in sync with `origin/main`, 0 ahead / 0 behind)
- Method: `git ls-files`, `git ls-files --others --ignored`, filesystem walk, import/reference grep.

## Legend

| Code | Meaning |
|------|---------|
| `[INCORPORATE]` | Code that should be wired into the app (or source recovered). |
| `[GUIDANCE]` | Documentation / reports / evidence worth keeping; not executed. |
| `[DATA]` | Bulk fixtures, demo case packs, generated legal outputs. |
| `[BRAND]` | Logo / marketing visual assets. |
| `[ORPHAN]` | Stale or source-less artifact — candidate for purge. |
| `[WIRED]` | Listed only to prove it is *not* part of this backlog. |

## Executive summary

| Area | Files | Category | Disposition |
|------|------:|----------|-------------|
| `backend/drafting/`, `backend/registry/` | 2 dirs (11 `.pyc`) | Orphan bytecode, **source missing** | `[ORPHAN]` / `[INCORPORATE]` |
| `backend/tests/` missing sources | 5 `.pyc` only | Test sources lost | `[ORPHAN]` / `[INCORPORATE]` |
| Root debug/audit debris | 16 | Local-only, now git-ignored | `[ORPHAN]` |
| `audit-results/` | 28 | Release/audit evidence | `[GUIDANCE]` |
| `design-deliverables/` | 9 | Design evidence | `[GUIDANCE]` |
| `final-deliverables/` | 13 | Release evidence | `[GUIDANCE]` |
| `artifacts/{audit,final,release,reports,self-assessment,legal,design,demo-outputs}` | 23 | Scattered report collections | `[GUIDANCE]` |
| `docs/` (tree) | ~102 | Project documentation / specs | `[GUIDANCE]` |
| `.kiro/specs`, `.kiro/steering`, `.trae/specs` | 28 | Kiro/Trae spec framework | `[GUIDANCE]` |
| `output_100426/` | 26 | Generated legal deliverables (Hemraj) | `[DATA]` |
| `logo-ideas/` | ~50 | Brand / showcase assets | `[BRAND]` |
| `faq/` | 2 | Forensic-testing FAQ copy | `[GUIDANCE]` |
| `scripts/` | 15 | Repo utility scripts (mostly one-off) | `[INCORPORATE]` / `[ORPHAN]` |
| `artifacts/api-server/` | pkg | Separate Express/Drizzle backend artifact | `[INCORPORATE]`? |
| `artifacts/mockup-sandbox/` | pkg | Replit UI mockup sandbox | `[ORPHAN]` |
| `ETERNAL_RESEARCH_CHILD/` | 4 | Research daemon | `[WIRED]` (see note) |

Wired areas **excluded** from this backlog: `artifacts/legal-luminaire/**` (the app),
`lib/**` (shared packages), `real_cases/**`, `sample_cases/**`, `test-assets/**`
(referenced by the app + backend seed scripts), `.github/**`, root config files.

---

## A. Not under version control (present on disk, absent from git)

### A1. Throwaway debug / audit debris — now git-ignored

These were added to `.gitignore` during the last sync. They are local-only and are
**not** part of the repo. Recommend deletion once no longer needed.

```
route-sweep.mjs
artifacts/legal-luminaire/backend/check_imports.py
artifacts/legal-luminaire/backend/scan_imports.py
artifacts/legal-luminaire/preview-audit/home-desktop-1440.png
artifacts/legal-luminaire/preview-audit/home-laptop-1024.png
artifacts/legal-luminaire/preview-audit/home-mobile-375.png
artifacts/legal-luminaire/preview-audit/home-tablet-768.png
artifacts/legal-luminaire/preview-audit/keyboard-focus.png
artifacts/legal-luminaire/preview-audit/preview-audit.mjs
artifacts/legal-luminaire/preview-audit/reduced-motion.png
artifacts/legal-luminaire/preview-audit/report.json
artifacts/legal-luminaire/preview-audit/route-about.png
artifacts/legal-luminaire/preview-audit/route-accuracy-academy.png
artifacts/legal-luminaire/preview-audit/route-how-to-use.png
artifacts/legal-luminaire/preview-audit/routes/F_Git_accuracy_academy.png
artifacts/legal-luminaire/preview-audit/routes/_accuracy_academy.png
artifacts/legal-luminaire/preview-audit/routes/report.json
```

Disposition: `[ORPHAN]` — safe to delete.

### A2. Orphan bytecode with **no source** — `[INCORPORATE]` (recover source)

These directories contain **only compiled `.pyc`** files. The `.py` sources have never
been committed (`git log` for these paths is empty) and nothing in the codebase imports
them. Either the source must be authored/recovered, or the bytecode purged.

```
artifacts/legal-luminaire/backend/drafting/__pycache__/architecture.cpython-314.pyc
artifacts/legal-luminaire/backend/drafting/__pycache__/blocks.cpython-314.pyc
artifacts/legal-luminaire/backend/drafting/__pycache__/catalog.cpython-314.pyc
artifacts/legal-luminaire/backend/drafting/__pycache__/conflicts.cpython-314.pyc
artifacts/legal-luminaire/backend/drafting/__pycache__/engine.cpython-314.pyc
artifacts/legal-luminaire/backend/drafting/__pycache__/grounds.cpython-314.pyc
artifacts/legal-luminaire/backend/drafting/__pycache__/placeholders.cpython-314.pyc
artifacts/legal-luminaire/backend/drafting/__pycache__/prompts.cpython-314.pyc
artifacts/legal-luminaire/backend/drafting/__pycache__/__init__.cpython-314.pyc
artifacts/legal-luminaire/backend/registry/__pycache__/derivative_drafts.cpython-314.pyc
artifacts/legal-luminaire/backend/registry/__pycache__/__init__.cpython-314.pyc
```

Implied (missing) sources: `drafting/{architecture,blocks,catalog,conflicts,engine,grounds,placeholders,prompts}.py`
and `registry/derivative_drafts.py`.

### A3. Test sources missing (only `.pyc` remain) — `[INCORPORATE]`

The tests directory is missing these test modules; their bytecode caches linger in
`backend/tests/__pycache__/`:

```
test_drafting_engine.py     (pyc present)
test_variant_engine.py      (pyc present)
test_health_route.py        (pyc present)
test_http_contract.py       (pyc present)
test_rate_limit.py          (pyc present)
```

Tracked tests actually present: `test_authentication.py`, `test_citation_registry.py`,
`test_copilot.py`, `test_deadline_engine.py`, `test_route_registry.py`,
`test_security_remediation.py`, `test_stadium_collapse_accuracy.py`,
`test_verification_syntax.py`.

---

## B. Tracked but not wired into the running app

### B1. Release / audit evidence collections (repo root) — `[GUIDANCE]`

#### `audit-results/` (28)
```
audit-results/API_AUTHORIZATION_MATRIX.md
audit-results/BEFORE_AFTER_SCREENSHOTS.md
audit-results/CITATION_EXPORT_REGRESSION.md
audit-results/CI_AND_STAGING_VERIFICATION.md
audit-results/DEPLOYMENT_SMOKE_AND_ROLLBACK.md
audit-results/DEPLOYMENT_VERIFICATION.md
audit-results/FINAL_RELEASE_DECISION.md
audit-results/FULL_TEST_RESULTS.md
audit-results/GITHUB_POLISH_REPORT.md
audit-results/LATEST_COMMIT.md
audit-results/LATEST_COMMIT_AND_MERGE_STATUS.md
audit-results/LEGAL_ACCURACY_VERIFICATION.md
audit-results/LEGAL_SOURCE_CLOSURE.md
audit-results/PERFORMANCE_RESULTS.md
audit-results/PLAYWRIGHT_ROUTE_INVENTORY.md
audit-results/PLAYWRIGHT_SCREENSHOTS_AND_RESULTS.md
audit-results/RELEASE_DECISION.md
audit-results/REMAINING_RISKS.md
audit-results/REMEDIATION_RECHECK.md
audit-results/ROUTE_AND_COMPONENT_COVERAGE.md
audit-results/ROUTE_BROWSER_COVERAGE.md
audit-results/SE01_AUTH_AND_CASE_ISOLATION.md
audit-results/SE08_CHROMADB_ADVISORY_REGISTER.md
audit-results/SECURITY_AND_CASE_ISOLATION.md
audit-results/SECURITY_VERIFICATION.md
audit-results/SIMULATED_USER_RESULTS.md
audit-results/TEST_EXECUTION.md
audit-results/UI_DESIGN_AUDIT.md
```

#### `design-deliverables/` (9)
```
design-deliverables/ACCESSIBILITY_AND_PERFORMANCE.md
design-deliverables/ACCESSIBILITY_REPORT.md
design-deliverables/BROWSER_NAVIGATION_RESULTS.md
design-deliverables/DESIGN_TOKENS.md
design-deliverables/LANDING_PAGE_DESIGN_AUDIT.md
design-deliverables/PERFORMANCE_COMPARISON.md
design-deliverables/REAL_RESPONSIVE_SCREENSHOTS.md
design-deliverables/RESPONSIVE_SCREENSHOTS.md
design-deliverables/VISUAL_CHANGELOG.md
```

#### `final-deliverables/` (13)
```
final-deliverables/AUTHORIZATION_TEST_RESULTS.md
final-deliverables/AUTH_BOUNDARY_REVIEW.md
final-deliverables/CITATION_EXPORT_RECHECK.md
final-deliverables/CITATION_GATE_ADVERSARIAL_RESULTS.md
final-deliverables/DEPLOYMENT_SMOKE_TESTS.md
final-deliverables/FINAL_SECURITY_CLOSURE.md
final-deliverables/FULL_TEST_EXECUTION.md
final-deliverables/LEGAL_SOURCE_REVIEW.md
final-deliverables/PRE_MERGE_AND_MERGE_REPORT.md
final-deliverables/PRODUCTION_READINESS.md
final-deliverables/RELEASE_CANDIDATE_MANIFEST.md
final-deliverables/ROLLBACK_RUNBOOK.md
final-deliverables/SECURITY_EXCEPTIONS.md
```

### B2. Scattered report collections under `artifacts/` — `[GUIDANCE]`

These sibling areas sit next to the app and are not used by it (only self-referenced).

```
artifacts/audit/BASELINE_RESULTS.md
artifacts/audit/FINDINGS_RECONCILIATION.md
artifacts/audit/LATEST_COMMIT.md
artifacts/audit/LEGAL_ACCURACY_RISKS.md
artifacts/audit/REMEDIATION_PLAN.md
artifacts/audit/REPOSITORY_INVENTORY.md
artifacts/audit/SECURITY_FINDINGS.md
artifacts/final/ARCHITECTURE.md
artifacts/final/CHANGELOG.md
artifacts/final/DEPLOYMENT_READINESS.md
artifacts/final/FEATURE_MATRIX.md
artifacts/final/LEGAL_VALIDATION.md
artifacts/final/OPEN_RISKS.md
artifacts/final/SECURITY_REPORT.md
artifacts/final/TEST_EVIDENCE.md
artifacts/release/RELEASE_READINESS.md
artifacts/reports/PHASE_EXECUTION_LOG.md
artifacts/self-assessment/SELF_ASSESSMENT_EVIDENCE.md
artifacts/legal/PENDING_CITATION_GUARD.md
artifacts/design/DESIGN_TOKENS.md
artifacts/demo-outputs/README.md
artifacts/demo-outputs/demo-03-accuracy-gate-report.md
artifacts/demo-outputs/demo-04-standards-matrix.md
```

Note: `artifacts/docs/`, `artifacts/security/`, `artifacts/testing/` exist but are empty.

### B3. Documentation tree `docs/` (~102) — `[GUIDANCE]`

Root documents:
```
docs/APP_AUDIT_SCATTERED_CODE.md
docs/CACHE_HYGIENE.md
docs/COMPLETION_REPORT.md
docs/DEVELOPER_GUIDE.md
docs/FEATURE_FLAGS_MATRIX_W13.md
docs/FEATURE_FLAGS_REFERENCE.md
docs/HARVEY_AI_INTEGRATION.md
docs/HYBRID_DIFF_ONLY_REPORT.md
docs/HYBRID_FEATURE_COMPARISON_MATRIX.md
docs/hybrid_feature_matrix_export.csv
docs/HYBRID_MERGE_AUDIT_AND_ROLLBACK_PLAN.md
docs/INDEX.md
docs/INTAKE_EXAMPLES_51_HANDOFF.md
docs/MERGER_EXECUTION_SUMMARY.md
docs/MODERNIZATION_PLAN.md
docs/PHASE1_FEATURE_AUDIT_MATRIX.md
docs/PHASE2_COMPLETE.md
docs/PHASE2_COMPLETION_REPORT.md
docs/PHASE2_STATUS.txt
docs/ROLLBACK_PLAN.md
docs/SELF_ASSESSMENT.md
docs/USER_MANUAL.md
docs/VIDEO_MANUAL_SCRIPT.md
```

Sub-trees:
```
docs/accuracy-governance/ACCURACY_RULES.md

docs/adr/ADR-001-accuracy-first-architecture.md
docs/adr/ADR-002-local-first-fallback.md
docs/adr/ADR-003-feature-flags-all-new-features.md
docs/adr/ADR-004-monorepo-pnpm-workspace.md
docs/adr/ADR-005-bilingual-hindi-english.md
docs/adr/ADR-006-synthetic-data-only.md
docs/adr/ADR-007-ci-gates-release-lock.md
docs/adr/ADR-008-competition-readiness-lock.md
docs/adr/ADR-009-canonical-runtime.md

docs/case-docs/ARBITRATION_CLAIM_AND_DECISION_500_700.lex
docs/case-docs/ARBITRATION_CLAIM_AND_DECISION_500_700_HINDI.lex
docs/case-docs/MASTERPIECE_ARBITRATION_CLAIM_PETITION_WITH_DECREE_STAY_HC_PENDENCY.lex
docs/case-docs/MISC_CASE_DOCUMENT_LIBRARY.md

docs/enrichment/ENRICHMENT_5WEEK_SUMMARY.md
docs/enrichment/WEEK01_KIRO_INTAKE_EXAMPLES.md
docs/enrichment/WEEK13_KIRO_COMPETITION_LOCK.md
docs/enrichment/WEEK14_DEVIN_DEMO_POLISH.md
docs/enrichment/WEEK15_TRAE_ACCURACY_HARDEN.md
docs/enrichment/WEEK16_ANTIGRAVITY_RELEASE.md
docs/enrichment/WEEK1_ANTIGRAVITY_HANDOFF.md
docs/enrichment/WEEK1_DEVIN_AUDIT.md
docs/enrichment/WEEK1_KIRO_COMPLETION.md
docs/enrichment/WEEK1_TRAE_BACKEND_NOTE.md
docs/enrichment/WEEK2_ANTIGRAVITY_UX_AUDIT.md
docs/enrichment/WEEK2_DEVIN_COMPLETION.md
docs/enrichment/WEEK2_KIRO_SUPPORT.md
docs/enrichment/WEEK2_TRAE_BACKEND_NOTE.md
docs/enrichment/WEEK3_ANTIGRAVITY_ACCURACY_AUDIT.md
docs/enrichment/WEEK3_DEVIN_UI_NOTE.md
docs/enrichment/WEEK3_KIRO_SUPPORT.md
docs/enrichment/WEEK3_TRAE_COMPLETION.md
docs/enrichment/WEEK4_ANTIGRAVITY_COMPLETION.md
docs/enrichment/WEEK4_DEVIN_GUIDED_FLOW.md
docs/enrichment/WEEK4_KIRO_SUPPORT.md
docs/enrichment/WEEK4_TRAE_OBSERVABILITY.md
docs/enrichment/WEEK5_ANTIGRAVITY_FINAL.md
docs/enrichment/WEEK5_DEVIN_DOCS.md
docs/enrichment/WEEK5_KIRO_FINAL_CHECK.md
docs/enrichment/WEEK5_TRAE_BACKEND_FINAL.md

docs/integration/ACCURACY_OVERHAUL_IMPLEMENTATION_PLAN.md
docs/integration/ACCURACY_OVERHAUL_PROGRESS_REPORT.md
docs/integration/ADR-001-feature-flags.md
docs/integration/ADR-002-local-first-redaction-before-ai.md
docs/integration/ADR-003-copilot-read-only-grounded.md
docs/integration/ADR-004-no-live-court-apis.md
docs/integration/ENRICHMENT_INTEGRATION_12WEEK_SUMMARY.md
docs/integration/WEEK01_KIRO_COMPLETION.md
docs/integration/WEEK05_KIRO_COMPLETION.md
docs/integration/WEEK06_DEVIN_COMPLETION.md
docs/integration/WEEK08_ANTIGRAVITY_AUDIT.md
docs/integration/WEEK09_KIRO_COMPLETION.md
docs/integration/WEEK10_DEVIN_COMPLETION.md
docs/integration/WEEK12_ANTIGRAVITY_FINAL.md

docs/marketing/DEMO_SCRIPT_90SEC_TC23_HIGHWAY.md
docs/marketing/INFRA_ARB_SHOWCASE_TC22_TO_TC26.md
docs/marketing/MARKETING_SHOWCASE_MAP.md
docs/marketing/MARKETING_TASK_SPEC.md

docs/roadmap/15_WEEK_OMNI_MODAL_STATUS.md
docs/roadmap/6_MONTH_ROADMAP.md

docs/submission/DRAFT_SUBMISSION.md
docs/submission/JUDGE_WALKTHROUGH.md
docs/submission/STATUTORY_FEATURE_PARITY.md
docs/submission/vibecode-submit-workflow.md
docs/submission/VIDEO_SCRIPT_60SEC.md
docs/submission/WHY_THIS_WINS.md
docs/submission/screenshots/01_home_dashboard.png
docs/submission/screenshots/02_smart_ingest_redaction.png
docs/submission/screenshots/03_grounded_copilot.png
docs/submission/screenshots/04_chronology_studio.png
docs/submission/screenshots/05_deadline_board.png
docs/submission/screenshots/06_standards_explorer.png
docs/submission/screenshots/07_accuracy_academy.png

docs/task-specs/ACCURACY_GATE_TASK_SPEC.md
docs/task-specs/DEMO_MODE_TASK_SPEC.md

docs/testing/ROBUSTNESS_REPORT.md
docs/testing/SYNTHETIC_TEST_DATA_GUIDE.md
docs/testing/TEST_CASE_MATRIX_21.md
docs/testing/TEST_CASE_MATRIX_26.md
```

### B4. Spec / steering framework — `[GUIDANCE]`

```
.kiro/specs/accuracy-academy/{requirements.md,design.md,tasks.md}
.kiro/specs/ask-copilot/{requirements.md,design.md,tasks.md}
.kiro/specs/chronology-studio/{requirements.md,design.md,tasks.md}
.kiro/specs/citation-deeplink/{requirements.md,design.md,tasks.md}
.kiro/specs/deadline-engine/{requirements.md,design.md,tasks.md}
.kiro/specs/redaction-studio/{requirements.md,design.md,tasks.md}
.kiro/specs/smart-drop/{requirements.md,design.md,tasks.md}
.kiro/specs/standards-explorer/{requirements.md,design.md,tasks.md}
.kiro/steering/accuracy-rules.md
.kiro/steering/legal-luminaire-protected-files.md
.trae/specs/kiro-max-reach-polish/spec.md
.trae/specs/kiro-max-reach-polish/tasks.md
```

### B5. Generated legal deliverables `output_100426/` (26) — `[DATA]`

Court-ready artefacts for the Hemraj / Pitambara matters and TC-22…TC-26 infra cases.
Referenced only by its own `README.md`.

```
output_100426/README.md
output_100426/ANNEXURE_PDF_NAMES_MASTER.txt
output_100426/AWARD_TC22_HOSPITAL.txt
output_100426/AWARD_TC23_HIGHWAY.txt
output_100426/CLAIM_TC22_HOSPITAL_FULL.txt
output_100426/CLAIM_TC22_HOSPITAL_HINDI.txt
output_100426/CLAIM_TC23_HIGHWAY_FULL.txt
output_100426/CLAIM_TC23_HIGHWAY_HINDI.txt
output_100426/CLAIM_TC24_DAM_FULL.txt
output_100426/CLAIM_TC25_SUBSTATION_FULL.txt
output_100426/CLAIM_TC26_LANDSCAPE_FULL.txt
output_100426/CRIMINAL_APPEAL_HC_2026.txt
output_100426/CROSS_REF_MATRIX_TC22_HOSPITAL.txt
output_100426/CROSS_REF_MATRIX_TC23_HIGHWAY.txt
output_100426/CROSS_REF_MATRIX_TC24_DAM.txt
output_100426/CROSS_REF_MATRIX_TC25_SUBSTATION.txt
output_100426/CROSS_REF_MATRIX_TC26_LANDSCAPE.txt
output_100426/DISCHARGE_APPLICATION_HEMRAJ_COURT_READY.pdf
output_100426/DISCHARGE_APPLICATION_HEMRAJ_COURT_READY.txt
output_100426/DISCHARGE_APPLICATION_HEMRAJ_v4.pdf
output_100426/DISCHARGE_APPLICATION_HEMRAJ_v4.txt
output_100426/DISCHARGE_APPLICATION_HEMRAJ_v5.pdf
output_100426/DISCHARGE_APPLICATION_HEMRAJ_v5_ENGLISH.pdf
output_100426/DISCHARGE_APPLICATION_HEMRAJ_v5_PRINT.html
output_100426/NOTICE_REPLY_PITAMBARA_PRINT.html
output_100426/SECTION_37_APPEAL_TC23_HIGHWAY.txt
```

### B6. Brand / showcase assets `logo-ideas/` (~50) — `[BRAND]`

```
logo-ideas/about the project.md
logo-ideas/key features.md
logo-ideas/key features.txt
logo-ideas/logo 02.jpg
logo-ideas/logo video form.mp4
logo-ideas/logo-01.htm
logo-ideas/logo-raj.png
logo-ideas/legal-luminaire-showcase/README.md
logo-ideas/legal-luminaire-showcase/SHOWCASE_DESCRIPTION.md
logo-ideas/legal-luminaire-showcase/SHOWCASE_UPLOAD_GUIDE.md
logo-ideas/legal-luminaire-showcase/gallery/01-home-onboarding.png
logo-ideas/legal-luminaire-showcase/gallery/02-demo-cases.png
logo-ideas/legal-luminaire-showcase/gallery/03-case-intake.png
logo-ideas/legal-luminaire-showcase/gallery/04-case-dashboard.png
logo-ideas/legal-luminaire-showcase/gallery/05-citation-research.png
logo-ideas/legal-luminaire-showcase/gallery/06-ai-research.png
logo-ideas/legal-luminaire-showcase/gallery/07-grounded-copilot.png
logo-ideas/legal-luminaire-showcase/gallery/08-verification-gate.png
logo-ideas/legal-luminaire-showcase/gallery/09-safe-draft-citation-gate.png
logo-ideas/legal-luminaire-showcase/gallery/10-drafting-engine.png
logo-ideas/legal-luminaire-showcase/gallery/11-chronology-studio.png
logo-ideas/legal-luminaire-showcase/gallery/12-deadline-board.png
logo-ideas/legal-luminaire-showcase/gallery/13-standards-explorer.png
logo-ideas/legal-luminaire-showcase/gallery/14-accuracy-academy.png
logo-ideas/legal-luminaire-showcase/gallery/15-filing-checklist.png
logo-ideas/legal-luminaire-showcase/logo/verified-beacon-lockup.png
logo-ideas/legal-luminaire-showcase/logo/verified-beacon-lockup.svg
logo-ideas/legal-luminaire-showcase/logo/verified-beacon.png
logo-ideas/legal-luminaire-showcase/logo/verified-beacon.svg
logo-ideas/logo-01_files/… (23 CSS/JS/HTM capture assets — scraped page dump)
```

### B7. Forensic-testing FAQ copy `faq/` (2) — `[GUIDANCE]`

```
faq/construction-material-testing.md
faq/forensic-construction-testing.md
```

### B8. Utility scripts `scripts/` (15) — `[INCORPORATE]` / `[ORPHAN]`

One-off generators and maintenance helpers; not invoked by the app build/runtime
(only `autopilot-one-hour.ps1` orchestrates workspace commands).

```
scripts/audit_scatter.ts
scripts/autopilot-one-hour.ps1
scripts/clean.ps1
scripts/generate_discharge_english.py
scripts/generate_discharge_pdf.py
scripts/gen_discharge_v4.py
scripts/gen_discharge_v5.py
scripts/load_test_sim.py
scripts/package.json
scripts/post-merge.sh
scripts/scan_markdown_duty.py
scripts/seed-demo-data.ts
scripts/tsconfig.json
scripts/_gen.py
scripts/src/hello.ts
```

Note: the four `*discharge*` / `gen_discharge_*` scripts overlap the backend
drafting routes and the `output_100426/` PDFs — candidate to fold into the app or retire.

### B9. Standalone workspace packages not part of the deployed app

```
artifacts/api-server/        [INCORPORATE]? — Express + Drizzle + @workspace/db backend.
                             Wired only to .replit + autopilot script; app uses the
                             Python backend instead. Decide: adopt or retire.
artifacts/mockup-sandbox/    [ORPHAN]      — Vite UI mockup sandbox (Replit artifact).
                             Referenced only by .replit + autopilot script.
```

---

## Appendix — Verified as wired (NOT in backlog)

| Area | Why it is wired |
|------|-----------------|
| `artifacts/legal-luminaire/**` | The deployed frontend + Python backend. |
| `lib/{api-spec,api-zod,api-client-react,db}` | Shared workspace packages. |
| `real_cases/**` | Served by `src/data/case-pack-paths.ts`, `all-demo-cases.ts`, `DemoCaseBrowser.tsx`, `backend/repo_paths.py`, `preload_case01.py`, `seed_26_cases.py`. |
| `sample_cases/**` | Demo/test packs consumed by the app demo browser. |
| `test-assets/**` | Fixtures referenced by `docs/testing/*` and backend tests. |
| `ETERNAL_RESEARCH_CHILD/**` | Wired via root `pnpm daemon*` scripts; writes `src/data/researchImprovements.generated.ts` consumed at `/improvement-lab`. |
| `.github/**`, root configs | CI, deploy, workspace config. |

> Note on `ETERNAL_RESEARCH_CHILD`: it is wired, but only as an offline daemon. Its
> generated feed `artifacts/legal-luminaire/src/data/researchImprovements.generated.ts`
> is the live integration point — if the daemon is not run, that feed goes stale.

---

## Suggested order of work

1. **Recover or purge orphan code** (A2/A3): the `drafting` / `registry` modules and the
   5 missing test files. This is the only genuinely *broken* gap.
2. **Decide on `artifacts/api-server`** (B9): adopt into the stack or delete.
3. **Consolidate report collections** (B1/B2): merge `audit-results/`,
   `design-deliverables/`, `final-deliverables/`, and `artifacts/{audit,final,release,
   reports,self-assessment,legal,design,demo-outputs}` into a single `docs/reports/` tree.
4. **Triage `scripts/` generators** (B8): fold reusable ones into the backend, retire the rest.
5. **Retire debris** (A1): delete the git-ignored debug/audit files when done.
