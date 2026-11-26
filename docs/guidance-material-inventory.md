# Guidance Material Inventory — Legal Luminaire

Per-file inventory of standalone guidance, specifications, reports, evidence, case notes, fixtures, templates, and other non-executable text material in the working repository.

- Generated: 2026-11-26
- Branch/HEAD: `codex/code-junction-launch-hardening` @ `2e70ea2`
- Scope: 452 pre-existing tracked/untracked `.md` and `.txt` files, excluding two `requirements*.txt` dependency manifests.
- Companion: [Master inventory](unwired-files-inventory.md) · [Code inventory](unwired-code-inventory.md)

## How to use this inventory

Documentation is not expected to be imported by React or FastAPI. The purpose of this report is to distinguish:

- `KEEP_CANONICAL` — authoritative instructions, architecture, user/developer guidance, or open blockers.
- `KEEP_GUIDANCE` — specifications, task briefs, manuals, FAQs, and brand guidance worth retaining.
- `CONSOLIDATE` — unique guidance should be merged into a canonical document, then the duplicate can be archived.
- `KEEP_EVIDENCE` — historical audit/release/test evidence; preserve in place and do not rewrite history.
- `KEEP_DATA` — case material, fixtures, templates, or generated reference output; not executable guidance.
- `BLOCKED_REVIEW` — do not publish, wire, or reuse until legal/privacy/source review is complete.
- `ARCHIVE` — superseded or historical material that should remain discoverable but out of the active guidance path.

All paths are repository-relative. Each pre-existing text document appears exactly once in the per-file sections below. Non-Markdown companions are listed separately.

# 1. Priority incorporation and consolidation queue

| File | Why it matters | Disposition / next action |
|---|---|---|
| `CODE-JUNCTION/COMPREHENSIVE LAUNCH-READY TASK FOR.txt` | Primary phased launch-hardening brief | `KEEP_GUIDANCE`. Keep as the main task brief; fold completed items into the launch report and backlog. |
| `CODE-JUNCTION/lel# SYSTEM  ROLE DEFINITION.md` | Broad autonomous-agent role and architecture/triage criteria | `CONSOLIDATE`. Retain distinct architecture and triage criteria; discard generic role/autonomy boilerplate after merge. |
| `LAUNCH_HARDENING_REPORT.md` | Current launch status and restrictions | `KEEP_CANONICAL`. Preserve local modifications; keep this as the single current launch-status report. |
| `BASELINE.md` | Test/build/browser baseline | `KEEP_EVIDENCE`. Refresh only by adding a new dated baseline, not by rewriting old results. |
| `docs/blockers/P2-01-DRAFTING-PACKAGE-GAP.md` | Missing drafting package decision | `KEEP_CANONICAL`. Resolve supersede-vs-rebuild before any drafting-package work. |
| `docs/blockers/P2-02-PLEADING-VARIANTS.md` | Missing variants registry and unwired router | `KEEP_CANONICAL`. Resolve register-vs-retire; preserve 428 citation blocking, auth, and case scope. |
| `docs/blockers/SE-01-OIDC-CASE-ISOLATION.md` | Confidential-production identity/case-isolation blocker | `KEEP_CANONICAL`. Release-gating. |
| `docs/blockers/SE-08-CHROMADB-ADVISORIES.md` | Dependency exception lifecycle | `KEEP_CANONICAL`. Release-gating until exception is closed or formally accepted. |
| `docs/blockers/LEGAL-SOURCE-CLOSURE.md` | Court-use legal-source verification items | `KEEP_CANONICAL`. Release-gating for court-use exports. |
| `docs/APP_AUDIT_SCATTERED_CODE.md` | Earlier scattered-code audit | `CONSOLIDATE`. Some recommendations are already implemented; extract only remaining actions into current issues. |
| `docs/MODERNIZATION_PLAN.md` | Broad UX/architecture modernization plan | `CONSOLIDATE`. Reconcile against current routes/components before reuse. |
| `docs/INTAKE_EXAMPLES_51_HANDOFF.md` | Intake-example handoff | `KEEP_GUIDANCE`. Verify current fixture coverage and ownership before closing. |
| `docs/HARVEY_AI_INTEGRATION.md` | Unfinished Harvey integration guidance | `BLOCKED_REVIEW`. No Harvey source files are currently present; decide retire vs. rebuild. |
| `docs/DOCUMENTATION_INDEX.md` | Canonical documentation index | `KEEP_CANONICAL`. Keep links to these inventories and historical evidence. |
| `docs/adr/ADR-009-canonical-runtime.md` | Defines the only production web/API runtime | `KEEP_CANONICAL`. Use it to prevent legacy packages from becoming a second runtime. |
| `archive/unwired-recovery/README.md` | Missing-source and bytecode recovery record | `KEEP_EVIDENCE`. Preserve; pair with P2-01/P2-02 decisions. |
| `audit-results/UNWIRED_FILES_RESOLUTION_REPORT.md` | Prior reconciliation record | `KEEP_EVIDENCE`. Historical baseline; do not treat as current reachability. |
| `audit-results/UNWIRED_FILES_MANIFEST.md` | Prior per-file dispositions | `KEEP_EVIDENCE`. Historical baseline; current inventories supersede it for present-state decisions. |

# 2. Root, launch, and continuity documents

| File | Role | Disposition |
|---|---|---|
| `README.md` | Primary repository entry point and run commands | `KEEP_CANONICAL` |
| `BASELINE.md` | Launch verification baseline | `KEEP_EVIDENCE` |
| `CHANGELOG.md` | Product change history | `KEEP_CANONICAL`; append current changes |
| `CODE_OF_CONDUCT.md` | Community conduct | `KEEP_GUIDANCE` |
| `CONTRIBUTING.md` | Contribution workflow | `KEEP_GUIDANCE`; align with launch gate |
| `LAUNCH_HARDENING_REPORT.md` | Current launch decision, changes, and remaining work | `KEEP_CANONICAL`; locally modified |
| `ROADMAP.md` | Product roadmap and daemon patch target | `CONSOLIDATE` with current roadmap docs |
| `SECURITY.md` | Security policy | `KEEP_CANONICAL` |
| `ETERNAL_RESEARCH_CHILD/README.md` | Research daemon runbook and integration map | `KEEP_GUIDANCE`; fix missing `tsconfig.phase2.json` reference |
| `archive/unwired-recovery/README.md` | Archived bytecode/source-gap evidence | `KEEP_EVIDENCE` |

# 3. CODE-JUNCTION briefs

| File | Role | Disposition |
|---|---|---|
| `CODE-JUNCTION/COMPREHENSIVE LAUNCH-READY TASK FOR.txt` | Phased launch checklist and non-negotiable safety rules | `KEEP_GUIDANCE`; primary brief |
| `CODE-JUNCTION/lel# SYSTEM  ROLE DEFINITION.md` | Agent role, architecture, triage, and launch criteria | `CONSOLIDATE`; retain unique criteria only |

# 4. GitHub issue guidance

| File | Role | Disposition |
|---|---|---|
| `.github/ISSUE_TEMPLATE/bug_report.md` | Bug intake template | `KEEP_GUIDANCE` |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Feature intake template | `KEEP_GUIDANCE` |
| `.github/ISSUE_TEMPLATE/legal-domain-request.md` | Legal-domain request template | `KEEP_GUIDANCE`; require source/verification fields |

# 5. Kiro and Trae specifications

These are process guidance rather than runtime code. Kiro specs are CI-checked according to the documentation index. Keep requirements/design/tasks together; mark completed tasks explicitly instead of deleting the design history.

## 5.1 Kiro specs — 24 files

```text
.kiro/specs/accuracy-academy/design.md
.kiro/specs/accuracy-academy/requirements.md
.kiro/specs/accuracy-academy/tasks.md
.kiro/specs/ask-copilot/design.md
.kiro/specs/ask-copilot/requirements.md
.kiro/specs/ask-copilot/tasks.md
.kiro/specs/chronology-studio/design.md
.kiro/specs/chronology-studio/requirements.md
.kiro/specs/chronology-studio/tasks.md
.kiro/specs/citation-deeplink/design.md
.kiro/specs/citation-deeplink/requirements.md
.kiro/specs/citation-deeplink/tasks.md
.kiro/specs/deadline-engine/design.md
.kiro/specs/deadline-engine/requirements.md
.kiro/specs/deadline-engine/tasks.md
.kiro/specs/redaction-studio/design.md
.kiro/specs/redaction-studio/requirements.md
.kiro/specs/redaction-studio/tasks.md
.kiro/specs/smart-drop/design.md
.kiro/specs/smart-drop/requirements.md
.kiro/specs/smart-drop/tasks.md
.kiro/specs/standards-explorer/design.md
.kiro/specs/standards-explorer/requirements.md
.kiro/specs/standards-explorer/tasks.md
```

Disposition: `KEEP_GUIDANCE`.

## 5.2 Kiro steering — 2 files

| File | Role | Disposition |
|---|---|---|
| `.kiro/steering/accuracy-rules.md` | Accuracy-first steering rules | `KEEP_CANONICAL` |
| `.kiro/steering/legal-luminaire-protected-files.md` | Protected-file list | `KEEP_CANONICAL` |

## 5.3 Trae spec — 2 files

```text
.trae/specs/kiro-max-reach-polish/spec.md
.trae/specs/kiro-max-reach-polish/tasks.md
```

Disposition: `KEEP_GUIDANCE`; reconcile completed polish tasks with current UI before reuse.

# 6. Canonical `docs/` tree

## 6.1 Root documentation — 25 files

| File | Role | Disposition |
|---|---|---|
| `docs/APP_AUDIT_SCATTERED_CODE.md` | Scattered-code audit | `CONSOLIDATE`; partially implemented |
| `docs/CACHE_HYGIENE.md` | Build/cache hygiene rules | `KEEP_CANONICAL` |
| `docs/COMPLETION_REPORT.md` | Historical completion report | `KEEP_EVIDENCE` |
| `docs/DEVELOPER_GUIDE.md` | Developer onboarding/conventions | `KEEP_CANONICAL` |
| `docs/DOCUMENTATION_INDEX.md` | Documentation discovery index | `KEEP_CANONICAL` |
| `docs/FEATURE_FLAGS_MATRIX_W13.md` | CI-checked feature-flag matrix | `KEEP_CANONICAL` |
| `docs/FEATURE_FLAGS_REFERENCE.md` | Feature-flag reference | `KEEP_CANONICAL` |
| `docs/HARVEY_AI_INTEGRATION.md` | Unfinished Harvey integration | `BLOCKED_REVIEW` |
| `docs/HYBRID_DIFF_ONLY_REPORT.md` | Historical hybrid diff report | `KEEP_EVIDENCE` |
| `docs/HYBRID_FEATURE_COMPARISON_MATRIX.md` | Hybrid feature comparison | `KEEP_EVIDENCE`; reconcile before reuse |
| `docs/HYBRID_MERGE_AUDIT_AND_ROLLBACK_PLAN.md` | Merge audit/rollback plan | `KEEP_GUIDANCE`; verify commands against current stack |
| `docs/INDEX.md` | Short documentation entry point | `KEEP_CANONICAL` |
| `docs/INTAKE_EXAMPLES_51_HANDOFF.md` | Intake fixture handoff | `KEEP_GUIDANCE` |
| `docs/MERGER_EXECUTION_SUMMARY.md` | Historical merge summary | `KEEP_EVIDENCE` |
| `docs/MODERNIZATION_PLAN.md` | Modernization plan | `CONSOLIDATE` |
| `docs/PHASE1_FEATURE_AUDIT_MATRIX.md` | Phase-1 feature audit | `KEEP_EVIDENCE` |
| `docs/PHASE2_COMPLETE.md` | Phase-2 completion note | `KEEP_EVIDENCE` |
| `docs/PHASE2_COMPLETION_REPORT.md` | Phase-2 completion report | `KEEP_EVIDENCE` |
| `docs/PHASE2_STATUS.txt` | Phase-2 status snapshot | `KEEP_EVIDENCE` |
| `docs/RELEASE_READINESS.md` | Release-readiness assessment | `CONSOLIDATE` with current launch report |
| `docs/ROLLBACK_PLAN.md` | General rollback plan | `KEEP_GUIDANCE`; validate current commands |
| `docs/SELF_ASSESSMENT.md` | Product self-assessment | `CONSOLIDATE`; dated evidence, not current truth |
| `docs/USER_MANUAL.md` | End-user manual | `KEEP_CANONICAL` |
| `docs/VIDEO_MANUAL_SCRIPT.md` | Demo video manual | `KEEP_GUIDANCE`; align with current routes |
| `docs/unwired-files-inventory.md` | Current master unwired-file inventory | `KEEP_CANONICAL`; refreshed by this task |

## 6.2 Accuracy governance — 1 file

| File | Role | Disposition |
|---|---|---|
| `docs/accuracy-governance/ACCURACY_RULES.md` | Accuracy governance rules | `KEEP_CANONICAL` |

## 6.3 Architecture Decision Records — 9 files

| File | Role | Disposition |
|---|---|---|
| `docs/adr/ADR-001-accuracy-first-architecture.md` | Accuracy-first architecture | `KEEP_CANONICAL` |
| `docs/adr/ADR-002-local-first-fallback.md` | Local-first fallback | `KEEP_CANONICAL` |
| `docs/adr/ADR-003-feature-flags-all-new-features.md` | Feature-flag policy | `KEEP_CANONICAL` |
| `docs/adr/ADR-004-monorepo-pnpm-workspace.md` | Monorepo/package-manager decision | `KEEP_CANONICAL` |
| `docs/adr/ADR-005-bilingual-hindi-english.md` | Bilingual product decision | `KEEP_CANONICAL` |
| `docs/adr/ADR-006-synthetic-data-only.md` | Synthetic-data policy | `KEEP_CANONICAL` |
| `docs/adr/ADR-007-ci-gates-release-lock.md` | CI/release gate decision | `KEEP_CANONICAL` |
| `docs/adr/ADR-008-competition-readiness-lock.md` | Competition-readiness lock | `KEEP_CANONICAL` |
| `docs/adr/ADR-009-canonical-runtime.md` | Canonical web/API runtime | `KEEP_CANONICAL` |

## 6.4 Open blockers — 5 files

| File | Role | Disposition |
|---|---|---|
| `docs/blockers/LEGAL-SOURCE-CLOSURE.md` | Court-use source-verification blocker | `KEEP_CANONICAL` |
| `docs/blockers/P2-01-DRAFTING-PACKAGE-GAP.md` | Missing drafting package | `KEEP_CANONICAL` |
| `docs/blockers/P2-02-PLEADING-VARIANTS.md` | Missing variants registry/unwired route | `KEEP_CANONICAL` |
| `docs/blockers/SE-01-OIDC-CASE-ISOLATION.md` | Identity/case-isolation blocker | `KEEP_CANONICAL` |
| `docs/blockers/SE-08-CHROMADB-ADVISORIES.md` | ChromaDB advisory exception | `KEEP_CANONICAL` |

## 6.5 Case-document library guide — 1 file

| File | Role | Disposition |
|---|---|---|
| `docs/case-docs/MISC_CASE_DOCUMENT_LIBRARY.md` | Misc case-document library guide | `KEEP_GUIDANCE`; validate against current templates |

## 6.6 Enrichment wave logs — 26 files

These are historical implementation/handoff logs. Extract any still-open action into the current roadmap or issue tracker, then retain the logs as evidence. Do not treat their completion claims as current verification.

```text
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
```

Disposition: `KEEP_EVIDENCE` with `CONSOLIDATE` for any unfinished guidance.

## 6.7 Governance exception — 1 file

| File | Role | Disposition |
|---|---|---|
| `docs/governance/REVIEW_EXCEPTION_PR-007.md` | Review exception record | `KEEP_EVIDENCE`; confirm expiry/closure |

## 6.8 Integration plans and wave logs — 14 files

| File | Role | Disposition |
|---|---|---|
| `docs/integration/ACCURACY_OVERHAUL_IMPLEMENTATION_PLAN.md` | Accuracy overhaul plan | `CONSOLIDATE`; extract remaining work |
| `docs/integration/ACCURACY_OVERHAUL_PROGRESS_REPORT.md` | Accuracy overhaul progress | `KEEP_EVIDENCE` |
| `docs/integration/ADR-001-feature-flags.md` | Integration feature-flag ADR | `KEEP_GUIDANCE` |
| `docs/integration/ADR-002-local-first-redaction-before-ai.md` | Redaction ADR | `KEEP_CANONICAL` |
| `docs/integration/ADR-003-copilot-read-only-grounded.md` | Copilot ADR | `KEEP_CANONICAL` |
| `docs/integration/ADR-004-no-live-court-apis.md` | No-live-court-API ADR | `KEEP_CANONICAL` |
| `docs/integration/ENRICHMENT_INTEGRATION_12WEEK_SUMMARY.md` | Integration summary | `KEEP_EVIDENCE` |
| `docs/integration/WEEK01_KIRO_COMPLETION.md` | Week-01 completion log | `KEEP_EVIDENCE` |
| `docs/integration/WEEK05_KIRO_COMPLETION.md` | Week-05 completion log | `KEEP_EVIDENCE` |
| `docs/integration/WEEK06_DEVIN_COMPLETION.md` | Week-06 completion log | `KEEP_EVIDENCE` |
| `docs/integration/WEEK08_ANTIGRAVITY_AUDIT.md` | Week-08 audit | `KEEP_EVIDENCE` |
| `docs/integration/WEEK09_KIRO_COMPLETION.md` | Week-09 completion log | `KEEP_EVIDENCE` |
| `docs/integration/WEEK10_DEVIN_COMPLETION.md` | Week-10 completion log | `KEEP_EVIDENCE` |
| `docs/integration/WEEK12_ANTIGRAVITY_FINAL.md` | Week-12 final log | `KEEP_EVIDENCE` |

## 6.9 Marketing guidance — 4 files

| File | Role | Disposition |
|---|---|---|
| `docs/marketing/DEMO_SCRIPT_90SEC_TC23_HIGHWAY.md` | 90-second demo script | `KEEP_GUIDANCE`; validate demo claims |
| `docs/marketing/INFRA_ARB_SHOWCASE_TC22_TO_TC26.md` | Infrastructure arbitration showcase | `KEEP_GUIDANCE`; keep synthetic labels |
| `docs/marketing/MARKETING_SHOWCASE_MAP.md` | Showcase mapping | `CONSOLIDATE` with current demo-case registry |
| `docs/marketing/MARKETING_TASK_SPEC.md` | Marketing task specification | `KEEP_GUIDANCE`; extract unfinished actions |

## 6.10 Roadmaps — 2 files

| File | Role | Disposition |
|---|---|---|
| `docs/roadmap/15_WEEK_OMNI_MODAL_STATUS.md` | 15-week status snapshot | `KEEP_EVIDENCE`; reconcile with current roadmap |
| `docs/roadmap/6_MONTH_ROADMAP.md` | Six-month roadmap | `CONSOLIDATE` with root `ROADMAP.md` |

## 6.11 Submission guidance — 6 files

| File | Role | Disposition |
|---|---|---|
| `docs/submission/DRAFT_SUBMISSION.md` | Draft submission narrative | `KEEP_GUIDANCE`; update claims before reuse |
| `docs/submission/JUDGE_WALKTHROUGH.md` | Judge walkthrough | `KEEP_GUIDANCE`; validate current demo path |
| `docs/submission/STATUTORY_FEATURE_PARITY.md` | Statutory feature parity | `BLOCKED_REVIEW`; legal/source review required |
| `docs/submission/VIDEO_SCRIPT_60SEC.md` | 60-second video script | `KEEP_GUIDANCE` |
| `docs/submission/WHY_THIS_WINS.md` | Submission positioning | `CONSOLIDATE`; remove unsupported claims |
| `docs/submission/vibecode-submit-workflow.md` | Submission workflow | `KEEP_GUIDANCE`; verify platform steps |

## 6.12 Task specifications — 2 files

| File | Role | Disposition |
|---|---|---|
| `docs/task-specs/ACCURACY_GATE_TASK_SPEC.md` | Accuracy-gate task specification | `KEEP_GUIDANCE` |
| `docs/task-specs/DEMO_MODE_TASK_SPEC.md` | Demo-mode task specification | `KEEP_GUIDANCE` |

## 6.13 Testing guidance — 4 files

| File | Role | Disposition |
|---|---|---|
| `docs/testing/ROBUSTNESS_REPORT.md` | Robustness test report | `KEEP_EVIDENCE` |
| `docs/testing/SYNTHETIC_TEST_DATA_GUIDE.md` | Synthetic test-data rules | `KEEP_CANONICAL` |
| `docs/testing/TEST_CASE_MATRIX_21.md` | 21-case test matrix | `KEEP_EVIDENCE`; reconcile with 26-case matrix |
| `docs/testing/TEST_CASE_MATRIX_26.md` | 26-case test matrix | `KEEP_GUIDANCE`; align with current fixtures |

# 7. Audit, release, and design evidence

Preserve these files in place. They are historical evidence, not current runtime documentation. Link to them from the documentation index instead of moving them and breaking internal references.

## 7.1 `audit-results/` — 30 files

| File | Focus | Disposition |
|---|---|---|
| `audit-results/API_AUTHORIZATION_MATRIX.md` | API authorization coverage | `KEEP_EVIDENCE` |
| `audit-results/BEFORE_AFTER_SCREENSHOTS.md` | UI before/after evidence | `KEEP_EVIDENCE` |
| `audit-results/CITATION_EXPORT_REGRESSION.md` | Citation-export regression | `KEEP_EVIDENCE` |
| `audit-results/CI_AND_STAGING_VERIFICATION.md` | CI/staging verification | `KEEP_EVIDENCE` |
| `audit-results/DEPLOYMENT_SMOKE_AND_ROLLBACK.md` | Deploy smoke/rollback | `KEEP_EVIDENCE` |
| `audit-results/DEPLOYMENT_VERIFICATION.md` | Deployment verification | `KEEP_EVIDENCE` |
| `audit-results/FINAL_RELEASE_DECISION.md` | Final release decision | `KEEP_EVIDENCE` |
| `audit-results/FULL_TEST_RESULTS.md` | Full test results | `KEEP_EVIDENCE` |
| `audit-results/GITHUB_POLISH_REPORT.md` | GitHub polish report | `KEEP_EVIDENCE` |
| `audit-results/LATEST_COMMIT.md` | Commit snapshot | `KEEP_EVIDENCE` |
| `audit-results/LATEST_COMMIT_AND_MERGE_STATUS.md` | Commit/merge snapshot | `KEEP_EVIDENCE` |
| `audit-results/LEGAL_ACCURACY_VERIFICATION.md` | Legal accuracy verification | `KEEP_EVIDENCE` |
| `audit-results/LEGAL_SOURCE_CLOSURE.md` | Legal-source closure evidence | `KEEP_EVIDENCE` |
| `audit-results/PERFORMANCE_RESULTS.md` | Performance results | `KEEP_EVIDENCE` |
| `audit-results/PLAYWRIGHT_ROUTE_INVENTORY.md` | Playwright route inventory | `KEEP_EVIDENCE` |
| `audit-results/PLAYWRIGHT_SCREENSHOTS_AND_RESULTS.md` | Browser screenshots/results | `KEEP_EVIDENCE` |
| `audit-results/RELEASE_DECISION.md` | Release decision | `KEEP_EVIDENCE` |
| `audit-results/REMAINING_RISKS.md` | Open-risk snapshot | `KEEP_EVIDENCE`; reconcile with blockers |
| `audit-results/REMEDIATION_RECHECK.md` | Remediation recheck | `KEEP_EVIDENCE` |
| `audit-results/ROUTE_AND_COMPONENT_COVERAGE.md` | Route/component coverage | `KEEP_EVIDENCE` |
| `audit-results/ROUTE_BROWSER_COVERAGE.md` | Browser route coverage | `KEEP_EVIDENCE`; refresh sweep separately |
| `audit-results/SE01_AUTH_AND_CASE_ISOLATION.md` | Auth/case-isolation evidence | `KEEP_EVIDENCE` |
| `audit-results/SE08_CHROMADB_ADVISORY_REGISTER.md` | ChromaDB exception register | `KEEP_EVIDENCE` |
| `audit-results/SECURITY_AND_CASE_ISOLATION.md` | Security/case isolation | `KEEP_EVIDENCE` |
| `audit-results/SECURITY_VERIFICATION.md` | Security verification | `KEEP_EVIDENCE` |
| `audit-results/SIMULATED_USER_RESULTS.md` | Simulated-user results | `KEEP_EVIDENCE` |
| `audit-results/TEST_EXECUTION.md` | Test execution evidence | `KEEP_EVIDENCE` |
| `audit-results/UI_DESIGN_AUDIT.md` | UI design audit | `KEEP_EVIDENCE` |
| `audit-results/UNWIRED_FILES_MANIFEST.md` | Prior unwired-file manifest | `KEEP_EVIDENCE`; historical |
| `audit-results/UNWIRED_FILES_RESOLUTION_REPORT.md` | Prior reconciliation report | `KEEP_EVIDENCE`; historical |

## 7.2 `design-deliverables/` — 9 files

| File | Focus | Disposition |
|---|---|---|
| `design-deliverables/ACCESSIBILITY_AND_PERFORMANCE.md` | Accessibility/performance | `KEEP_EVIDENCE` |
| `design-deliverables/ACCESSIBILITY_REPORT.md` | Accessibility report | `KEEP_EVIDENCE` |
| `design-deliverables/BROWSER_NAVIGATION_RESULTS.md` | Browser navigation | `KEEP_EVIDENCE` |
| `design-deliverables/DESIGN_TOKENS.md` | Design tokens | `CONSOLIDATE` with current token source |
| `design-deliverables/LANDING_PAGE_DESIGN_AUDIT.md` | Landing-page audit | `KEEP_EVIDENCE` |
| `design-deliverables/PERFORMANCE_COMPARISON.md` | Performance comparison | `KEEP_EVIDENCE` |
| `design-deliverables/REAL_RESPONSIVE_SCREENSHOTS.md` | Responsive screenshot evidence | `KEEP_EVIDENCE` |
| `design-deliverables/RESPONSIVE_SCREENSHOTS.md` | Responsive screenshots | `KEEP_EVIDENCE` |
| `design-deliverables/VISUAL_CHANGELOG.md` | Visual changelog | `KEEP_EVIDENCE` |

## 7.3 `final-deliverables/` — 13 files

| File | Focus | Disposition |
|---|---|---|
| `final-deliverables/AUTHORIZATION_TEST_RESULTS.md` | Authorization tests | `KEEP_EVIDENCE` |
| `final-deliverables/AUTH_BOUNDARY_REVIEW.md` | Auth boundary review | `KEEP_EVIDENCE` |
| `final-deliverables/CITATION_EXPORT_RECHECK.md` | Citation-export recheck | `KEEP_EVIDENCE` |
| `final-deliverables/CITATION_GATE_ADVERSARIAL_RESULTS.md` | Adversarial gate results | `KEEP_EVIDENCE` |
| `final-deliverables/DEPLOYMENT_SMOKE_TESTS.md` | Deployment smoke tests | `KEEP_EVIDENCE` |
| `final-deliverables/FINAL_SECURITY_CLOSURE.md` | Security closure | `KEEP_EVIDENCE` |
| `final-deliverables/FULL_TEST_EXECUTION.md` | Full test execution | `KEEP_EVIDENCE` |
| `final-deliverables/LEGAL_SOURCE_REVIEW.md` | Legal-source review | `KEEP_EVIDENCE` |
| `final-deliverables/PRE_MERGE_AND_MERGE_REPORT.md` | Pre-merge/merge evidence | `KEEP_EVIDENCE` |
| `final-deliverables/PRODUCTION_READINESS.md` | Production readiness | `KEEP_EVIDENCE`; reconcile with launch report |
| `final-deliverables/RELEASE_CANDIDATE_MANIFEST.md` | RC manifest | `KEEP_EVIDENCE` |
| `final-deliverables/ROLLBACK_RUNBOOK.md` | Rollback runbook | `KEEP_GUIDANCE`; validate current commands |
| `final-deliverables/SECURITY_EXCEPTIONS.md` | Security exceptions | `KEEP_EVIDENCE`; track closure |

# 8. Scattered `artifacts/` evidence and app-level guides

## 8.1 Evidence and guides — 28 files

| File | Role | Disposition |
|---|---|---|
| `artifacts/audit/BASELINE_RESULTS.md` | Earlier baseline | `KEEP_EVIDENCE` |
| `artifacts/audit/FINDINGS_RECONCILIATION.md` | Findings reconciliation | `KEEP_EVIDENCE` |
| `artifacts/audit/LATEST_COMMIT.md` | Commit snapshot | `KEEP_EVIDENCE` |
| `artifacts/audit/LEGAL_ACCURACY_RISKS.md` | Legal accuracy risks | `KEEP_EVIDENCE` |
| `artifacts/audit/REMEDIATION_PLAN.md` | Remediation plan | `CONSOLIDATE`; extract remaining work |
| `artifacts/audit/REPOSITORY_INVENTORY.md` | Earlier repository inventory | `KEEP_EVIDENCE` |
| `artifacts/audit/SECURITY_FINDINGS.md` | Security findings | `KEEP_EVIDENCE` |
| `artifacts/demo-outputs/README.md` | Demo-output guide | `KEEP_GUIDANCE` |
| `artifacts/demo-outputs/demo-03-accuracy-gate-report.md` | Accuracy-gate demo output | `KEEP_EVIDENCE` |
| `artifacts/demo-outputs/demo-04-standards-matrix.md` | Standards-matrix demo output | `KEEP_EVIDENCE` |
| `artifacts/design/DESIGN_TOKENS.md` | Earlier design tokens | `CONSOLIDATE` with current token source |
| `artifacts/final/ARCHITECTURE.md` | Earlier architecture | `KEEP_EVIDENCE`; reconcile with ADR-009 |
| `artifacts/final/CHANGELOG.md` | Earlier changelog | `KEEP_EVIDENCE` |
| `artifacts/final/DEPLOYMENT_READINESS.md` | Earlier deployment readiness | `KEEP_EVIDENCE` |
| `artifacts/final/FEATURE_MATRIX.md` | Earlier feature matrix | `KEEP_EVIDENCE` |
| `artifacts/final/LEGAL_VALIDATION.md` | Legal validation | `KEEP_EVIDENCE` |
| `artifacts/final/OPEN_RISKS.md` | Earlier open risks | `KEEP_EVIDENCE` |
| `artifacts/final/SECURITY_REPORT.md` | Security report | `KEEP_EVIDENCE` |
| `artifacts/final/TEST_EVIDENCE.md` | Test evidence | `KEEP_EVIDENCE` |
| `artifacts/legal-luminaire/DEPLOY_AND_MULTI_CASE_GUIDE.md` | Deployment/multi-case guide | `KEEP_GUIDANCE`; validate current runtime |
| `artifacts/legal-luminaire/MULTI_CASE_IMPLEMENTATION.md` | Multi-case implementation notes | `CONSOLIDATE` with current architecture |
| `artifacts/legal-luminaire/docs/VIDEO_MANUAL_SCRIPT.md` | App-level video manual | `CONSOLIDATE` with `docs/VIDEO_MANUAL_SCRIPT.md` |
| `artifacts/legal-luminaire/docs/marketing/INFRA_ARB_SHOWCASE.md` | App-level showcase guide | `CONSOLIDATE` with `docs/marketing/` |
| `artifacts/legal-luminaire/src/data/PEETAMBARA_NOTICE_REPLY_v1.md` | Draft/source notice reply | `KEEP_DATA`; legal/source review before reuse |
| `artifacts/legal/PENDING_CITATION_GUARD.md` | Pending-citation guard guidance | `KEEP_CANONICAL` |
| `artifacts/release/RELEASE_READINESS.md` | Earlier release readiness | `KEEP_EVIDENCE` |
| `artifacts/reports/PHASE_EXECUTION_LOG.md` | Phase execution log | `KEEP_EVIDENCE` |
| `artifacts/self-assessment/SELF_ASSESSMENT_EVIDENCE.md` | Self-assessment evidence | `KEEP_EVIDENCE` |

## 8.2 Uploaded case material — 35 files

These are case/source documents, not product guidance. Keep them as case data with confidentiality and synthetic-label controls. They are not imported by the frontend; the backend may read `uploaded_cases/` at runtime.

```text
artifacts/legal-luminaire/backend/uploaded_cases/TC-01/Argument_Bank_And_Annexure_Builder.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-01/Case_Facts_Timeline.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-01/Case_Law_Matrix_Verified_Pending.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-01/Comprehensive_Legal_Defence_Report_Stadium_Collapse.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-01/DEEPsEARCH.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-01/DEFENCE_REPLY_FINAL_v3.pdf.txt
artifacts/legal-luminaire/backend/uploaded_cases/TC-01/Forensic_Protocol_Checklist.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-01/Legal_Case_References_Brief_Notes.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-01/Standards_Matrix_IS_ASTM_NABL.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-01/VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-22/Case_Facts_Timeline.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-22/Claim_Matrix_Verified_Pending.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-22/STANDING_COMMITTEE_MINUTES_01.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-22/Standards_Matrix_CPWD_FIDIC_IS.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-23/Case_Facts_Timeline.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-23/Claim_Matrix_Verified_Pending.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-23/STANDING_COMMITTEE_MINUTES_01.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-23/Standards_Matrix_CPWD_FIDIC_IS.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-24/Case_Facts_Timeline.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-24/Claim_Matrix_Verified_Pending.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-24/STANDING_COMMITTEE_MINUTES_01.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-24/Standards_Matrix_CPWD_FIDIC_IS.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-25/Case_Facts_Timeline.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-25/Claim_Matrix_Verified_Pending.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-25/STANDING_COMMITTEE_MINUTES_01.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-25/Standards_Matrix_CPWD_FIDIC_IS.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-26/Case_Facts_Timeline.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-26/Claim_Matrix_Verified_Pending.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-26/STANDING_COMMITTEE_MINUTES_01.md
artifacts/legal-luminaire/backend/uploaded_cases/TC-26/Standards_Matrix_CPWD_FIDIC_IS.md
artifacts/legal-luminaire/backend/uploaded_cases/imaginary_case_01/VIDEO_MANUAL_SCRIPT-2059.md
artifacts/legal-luminaire/backend/uploaded_cases/imaginary_case_01/VIDEO_MANUAL_SCRIPT.md
artifacts/legal-luminaire/backend/uploaded_cases/imaginary_case_03/Case_Facts_Timeline.md
artifacts/legal-luminaire/backend/uploaded_cases/imaginary_case_04/Claim_Matrix_Verified_Pending.md
artifacts/legal-luminaire/backend/uploaded_cases/imaginary_case_05/Standards_Matrix_CPWD_FIDIC_IS.md
```

Disposition: `KEEP_DATA`; verify confidentiality, provenance, and citation status before reuse.

# 9. FAQ and brand guidance

## 9.1 FAQ — 2 files

| File | Role | Disposition |
|---|---|---|
| `faq/construction-material-testing.md` | Construction-material testing FAQ | `KEEP_GUIDANCE`; source review before publication |
| `faq/forensic-construction-testing.md` | Forensic testing FAQ | `KEEP_GUIDANCE`; source review before publication |

## 9.2 Brand/showcase documents — 6 files

| File | Role | Disposition |
|---|---|---|
| `logo-ideas/about the project.md` | Brand/project narrative | `CONSOLIDATE` with current README/marketing copy |
| `logo-ideas/key features.md` | Feature copy | `CONSOLIDATE`; remove stale claims |
| `logo-ideas/key features.txt` | Duplicate feature copy | `CONSOLIDATE`; archive after merge |
| `logo-ideas/legal-luminaire-showcase/README.md` | Showcase guide | `KEEP_GUIDANCE` |
| `logo-ideas/legal-luminaire-showcase/SHOWCASE_DESCRIPTION.md` | Showcase description | `CONSOLIDATE` with current marketing copy |
| `logo-ideas/legal-luminaire-showcase/SHOWCASE_UPLOAD_GUIDE.md` | Showcase upload instructions | `KEEP_GUIDANCE`; verify platform steps |

# 10. Generated legal/reference output — 20 text files

Several `output_100426/` files are referenced by `src/data/draft-template-library.ts`, but the app generally inserts a repo-path reference rather than fetching the file. Treat the folder as source/reference data, not as a court-ready export pipeline.

**Restriction:** the documentation index marks this folder confidential and not for publication or court-use export. Preserve that restriction until legal/privacy review says otherwise.

```text
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
output_100426/DISCHARGE_APPLICATION_HEMRAJ_COURT_READY.txt
output_100426/DISCHARGE_APPLICATION_HEMRAJ_v4.txt
output_100426/README.md
output_100426/SECTION_37_APPEAL_TC23_HIGHWAY.txt
```

Disposition: `KEEP_DATA` / `BLOCKED_REVIEW` for publication or filing use.

# 11. Real case packs — 53 text files

These packs are referenced by demo-case paths, the template library, and the backend seeder. They are data, not guidance. Real-case material must remain confidential and clearly separated from synthetic demos.

```text
real_cases/CASE01_HEMRAJ_STATE_2025/Argument_Bank_And_Annexure_Builder.md
real_cases/CASE01_HEMRAJ_STATE_2025/Attached_Assets/grok_01042026.md
real_cases/CASE01_HEMRAJ_STATE_2025/Case_Facts_Timeline.md
real_cases/CASE01_HEMRAJ_STATE_2025/Case_Law_Matrix_Verified_Pending.md
real_cases/CASE01_HEMRAJ_STATE_2025/Comprehensive_Legal_Defence_Report_Stadium_Collapse.md
real_cases/CASE01_HEMRAJ_STATE_2025/DEEPsEARCH.md
real_cases/CASE01_HEMRAJ_STATE_2025/DEFENCE_REPLY_FINAL_v3.pdf.txt
real_cases/CASE01_HEMRAJ_STATE_2025/FAQ/Q01_Reserve_Sample_Retesting_Rights.md
real_cases/CASE01_HEMRAJ_STATE_2025/FAQ/Q02_PostConstruction_Forensic_Reserve_Sample.md
real_cases/CASE01_HEMRAJ_STATE_2025/FAQ/Q02_PostConstruction_Forensic_Sample_Reserve_Retesting.md
real_cases/CASE01_HEMRAJ_STATE_2025/Forensic_Protocol_Checklist.md
real_cases/CASE01_HEMRAJ_STATE_2025/HEMRAJ_ANNEXURE_A_TO_X_PDF_CHECKLIST.md
real_cases/CASE01_HEMRAJ_STATE_2025/HEMRAJ_MISSING_ANNEXURE_WEB_SEARCH_REPORT.md
real_cases/CASE01_HEMRAJ_STATE_2025/Legal_Case_References_Brief_Notes.md
real_cases/CASE01_HEMRAJ_STATE_2025/Standards_Matrix_IS_ASTM_NABL.md
real_cases/CASE01_HEMRAJ_STATE_2025/VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md
real_cases/CASE01_HEMRAJ_STATE_2025/bibliography/Bibliography_Index.md
real_cases/CASE01_HEMRAJ_STATE_2025/bibliography/Full_Case_References.md
real_cases/CASE01_HEMRAJ_STATE_2025/bibliography/Kattavellai_Supreme_Court_DNA_Guidelines_2025.md
real_cases/CASE01_HEMRAJ_STATE_2025/bibliography/caselaws/Forensics_Building_Samples_RHC_Citations.md
real_cases/CASE01_HEMRAJ_STATE_2025/bibliography/caselaws/Kattavellai_Supreme_Court_DNA_Guidelines_2025.md
real_cases/CASE01_HEMRAJ_STATE_2025/bibliography/caselaws/Uttarakhand_HC_Chain_Custody_Defects_2026.md
real_cases/CASE01_HEMRAJ_STATE_2025/bibliography/forensic_defense_report.md
real_cases/CASE01_HEMRAJ_STATE_2025/bibliography/manuals/Surface_Contamination_Technical_Manual.md
real_cases/CASE01_HEMRAJ_STATE_2025/bibliography/standards/ASTM_C780_Mortar_Sampling_Standards.md
real_cases/CASE01_HEMRAJ_STATE_2025/bibliography/standards/IS_1199_Concrete_Sampling_Methods.md
real_cases/CASE01_HEMRAJ_STATE_2025/bibliography/standards/IS_3535_Cement_Sampling_Methods.md
real_cases/CASE01_HEMRAJ_STATE_2025/bibliography/standards/IS_4031_Cement_Testing_Methods.md
real_cases/CASE02_PITAMBARA_ROOPAM_2026/FINAL_DRAFT_REPLY.md
real_cases/CASE02_PITAMBARA_ROOPAM_2026/PROMPT.txt
real_cases/CASE02_PITAMBARA_ROOPAM_2026/REPLY_TO_NOTICE_DRAFT.md
real_cases/CASE02_PITAMBARA_ROOPAM_2026/REPLY_TO_NOTICE_FINAL_v2.md
real_cases/CASE02_PITAMBARA_ROOPAM_2026/REPLY_TO_NOTICE_HINDI_v1.md
real_cases/INFRA_ARB_01_BUILDING_HOSPITAL_2026/Case_Facts_Timeline.md
real_cases/INFRA_ARB_01_BUILDING_HOSPITAL_2026/Claim_Matrix_Verified_Pending.md
real_cases/INFRA_ARB_01_BUILDING_HOSPITAL_2026/STANDING_COMMITTEE_MINUTES_01.md
real_cases/INFRA_ARB_01_BUILDING_HOSPITAL_2026/Standards_Matrix_CPWD_FIDIC_IS.md
real_cases/INFRA_ARB_02_ROAD_HIGHWAY_2026/Case_Facts_Timeline.md
real_cases/INFRA_ARB_02_ROAD_HIGHWAY_2026/Claim_Matrix_Verified_Pending.md
real_cases/INFRA_ARB_02_ROAD_HIGHWAY_2026/STANDING_COMMITTEE_MINUTES_01.md
real_cases/INFRA_ARB_02_ROAD_HIGHWAY_2026/Standards_Matrix_CPWD_FIDIC_IS.md
real_cases/INFRA_ARB_03_DAM_IRRIGATION_2026/Case_Facts_Timeline.md
real_cases/INFRA_ARB_03_DAM_IRRIGATION_2026/Claim_Matrix_Verified_Pending.md
real_cases/INFRA_ARB_03_DAM_IRRIGATION_2026/STANDING_COMMITTEE_MINUTES_01.md
real_cases/INFRA_ARB_03_DAM_IRRIGATION_2026/Standards_Matrix_CPWD_FIDIC_IS.md
real_cases/INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026/Case_Facts_Timeline.md
real_cases/INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026/Claim_Matrix_Verified_Pending.md
real_cases/INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026/STANDING_COMMITTEE_MINUTES_01.md
real_cases/INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026/Standards_Matrix_CPWD_FIDIC_IS.md
real_cases/INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026/Case_Facts_Timeline.md
real_cases/INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026/Claim_Matrix_Verified_Pending.md
real_cases/INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026/STANDING_COMMITTEE_MINUTES_01.md
real_cases/INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026/Standards_Matrix_CPWD_FIDIC_IS.md
```

Disposition: `KEEP_DATA`; confidential/source-controlled.

# 12. Synthetic sample cases — 62 text files

The UI references the `sample_cases/` root as a synthetic-spec library, but individual files are not directly imported. Keep them as fixtures/specifications. If the product should expose file-level content, add an explicit loader and tests rather than assuming the directory is wired.

```text
sample_cases/README.md
sample_cases/edge/TC-E01-ocr-noisy-text.md
sample_cases/edge/TC-E02-contradictory-dates.md
sample_cases/edge/TC-E03-missing-party-names.md
sample_cases/edge/TC-E04-duplicate-annexures.md
sample_cases/edge/TC-E05-mixed-hindi-english.md
sample_cases/edge/TC-E06-unsupported-format.md
sample_cases/edge/TC-E07-adversarial-fake-citation.md
sample_cases/functional/TC-01-building-collapse.md
sample_cases/functional/TC-02-ndps-bail.md
sample_cases/functional/TC-03-ni-act-discharge.md
sample_cases/functional/TC-04-domestic-violence-bail.md
sample_cases/functional/TC-05-cyber-fraud-bail.md
sample_cases/functional/TC-06-land-acquisition-writ.md
sample_cases/functional/TC-07-medical-negligence-discharge.md
sample_cases/functional/TC-08-road-accident-bail.md
sample_cases/functional/TC-09-forest-offence-bail.md
sample_cases/functional/TC-10-arms-act-discharge.md
sample_cases/functional/TC-11-pc-act-bribery-discharge.md
sample_cases/functional/TC-12-murder-bail.md
sample_cases/functional/TC-13-pocso-discharge.md
sample_cases/functional/TC-14-gst-fraud-bail.md
sample_cases/functional/TC-15-environment-writ.md
sample_cases/functional/TC-16-landlord-tenant.md
sample_cases/functional/TC-17-service-matter-writ.md
sample_cases/functional/TC-18-marketing-demo-polished.md
sample_cases/functional/TC-19-contract-dispute.md
sample_cases/functional/TC-20-family-maintenance.md
sample_cases/functional/TC-21-election-petition.md
sample_cases/functional/TC-22-infra-arb-building-hospital.md
sample_cases/functional/TC-23-infra-arb-road-highway.md
sample_cases/functional/TC-24-infra-arb-dam-irrigation.md
sample_cases/functional/TC-25-infra-arb-electrical-substation.md
sample_cases/functional/TC-26-infra-arb-landscape-township.md
sample_cases/functional/expected-outputs/TC-01-expected-output.md
sample_cases/functional/expected-outputs/TC-02-expected-output.md
sample_cases/functional/expected-outputs/TC-03-expected-output.md
sample_cases/functional/expected-outputs/TC-E07-expected-output.md
sample_cases/marketing/DEMONSTRATION_CASES/SUCCESS_STORY_1.md
sample_cases/marketing/DEMONSTRATION_CASES/SUCCESS_STORY_2.md
sample_cases/marketing/PERFORMANCE_METRICS/ACCURACY_BENCHMARKS.md
sample_cases/misc_documents/LEGAL_TEMPLATES/AGREEMENT_TEMPLATE.md
sample_cases/misc_documents/LEGAL_TEMPLATES/COURT_PETITION_TEMPLATE.md
sample_cases/misc_documents/LEGAL_TEMPLATES/LEGAL_NOTICE_TEMPLATE.md
sample_cases/showcase/README.md
sample_cases/showcase/showcase-01-building-collapse.md
sample_cases/showcase/showcase-02-ndps-bail.md
sample_cases/showcase/showcase-03-accuracy-gate-demo.md
sample_cases/showcase/showcase-04-breadth-demo.md
sample_cases/stress/TC-E08-large-bundle.md
sample_cases/stress/TC-E09-near-empty-input.md
sample_cases/stress/TC-E10-conflicting-contract-refs.md
sample_cases/stress/TC-E11-survey-mismatch.md
sample_cases/stress/TC-E12-conflicting-loss-figures.md
sample_cases/test-cases/CASE02_RAMESH_STATE_2025/case-brief.md
sample_cases/test-cases/CASE02_RAMESH_STATE_2025/expected-outputs/bail_application_draft.txt
sample_cases/test-cases/CASE02_RAMESH_STATE_2025/input-documents/FIR_234_2024.txt
sample_cases/test-cases/CASE03_APEX_SUNIL_2025/case-brief.md
sample_cases/test-cases/CASE03_APEX_SUNIL_2025/input-documents/complaint_CC1892_2023.txt
sample_cases/test-cases/CASE04_STATE_VIKRAM_2025/case-brief.md
sample_cases/test-cases/CASE05_PRIYA_STATE_2025/case-brief.md
sample_cases/test-cases/CASE06_LANDOWNERS_STATE_2025/case-brief.md
```

Disposition: `KEEP_DATA`; synthetic labeling required.

# 13. Test assets and templates — 51 text files

These are fixture/template material. No direct backend import was found in the current scan; they may be consumed manually or by future tests. Keep them as test/reference data and add explicit test references where intended.

```text
test-assets/marketing-test-cases/README.md
test-assets/marketing-test-cases/client-success-stories.md
test-assets/marketing-test-cases/competitive-analysis.md
test-assets/marketing-test-cases/performance-metrics.md
test-assets/marketing-test-cases/testimonials.md
test-assets/misc-case-docs/README.md
test-assets/misc-case-docs/brief-for-senior-counsel-template.md
test-assets/misc-case-docs/brief_for_senior_counsel_template.md
test-assets/misc-case-docs/compliance_note_template.md
test-assets/misc-case-docs/document_deficiency_memo.md
test-assets/misc-case-docs/evidence-checklist-template.md
test-assets/misc-case-docs/evidence_checklist_template.md
test-assets/misc-case-docs/hearing_note_template.md
test-assets/misc-case-docs/investigation-gap-note-template.md
test-assets/misc-case-docs/investigation_gap_note_template.md
test-assets/misc-case-docs/list-of-dates-template.md
test-assets/misc-case-docs/list_of_dates_template.md
test-assets/misc-case-docs/rejoinder_starter.md
test-assets/misc-case-docs/synopsis-template.md
test-assets/misc-case-docs/synopsis_template.md
test-assets/misc-case-docs/written_submission_starter.md
test-assets/synthetic-inputs/README.md
test-assets/synthetic-inputs/accident_claim_brief.md
test-assets/synthetic-inputs/adversarial-fake-citation.md
test-assets/synthetic-inputs/affidavit_support_note.md
test-assets/synthetic-inputs/arbitration_brief.md
test-assets/synthetic-inputs/bail-application-facts.md
test-assets/synthetic-inputs/bail_application_facts.md
test-assets/synthetic-inputs/civil-case-notes.md
test-assets/synthetic-inputs/civil_case_notes.md
test-assets/synthetic-inputs/construction-defect-report.md
test-assets/synthetic-inputs/construction_defect_report.md
test-assets/synthetic-inputs/consumer_complaint_summary.md
test-assets/synthetic-inputs/contract_breach_summary.md
test-assets/synthetic-inputs/contradictory-dates.md
test-assets/synthetic-inputs/criminal_complaint_summary.md
test-assets/synthetic-inputs/insurance_claim_note.md
test-assets/synthetic-inputs/labour_dispute_note.md
test-assets/synthetic-inputs/miscellaneous_petition_brief.md
test-assets/synthetic-inputs/mixed-hindi-english.md
test-assets/synthetic-inputs/municipal_compliance_note.md
test-assets/synthetic-inputs/near-empty-input.md
test-assets/synthetic-inputs/ocr-noisy-fir.md
test-assets/synthetic-inputs/property_dispute_brief.md
test-assets/synthetic-inputs/public_safety_complaint.md
test-assets/synthetic-inputs/regulatory_showcause_reply.md
test-assets/synthetic-inputs/service_matter_brief.md
test-assets/synthetic-inputs/structural_failure_incident.md
test-assets/synthetic-inputs/tax_notice_response.md
test-assets/synthetic-inputs/tender_dispute_note.md
test-assets/synthetic-inputs/writ_petition_note.md
```

Disposition: `KEEP_DATA`. Duplicate hyphen/underscore template pairs should be consolidated only after references are checked.

# 14. Non-Markdown guidance and evidence companions

These files are not part of the 452-document text count but are relevant standalone guidance/evidence/data material.

## 14.1 `docs/` companions — 11 files

```text
docs/case-docs/ARBITRATION_CLAIM_AND_DECISION_500_700.lex
docs/case-docs/ARBITRATION_CLAIM_AND_DECISION_500_700_HINDI.lex
docs/case-docs/MASTERPIECE_ARBITRATION_CLAIM_PETITION_WITH_DECREE_STAY_HC_PENDENCY.lex
docs/hybrid_feature_matrix_export.csv
docs/submission/screenshots/01_home_dashboard.png
docs/submission/screenshots/02_smart_ingest_redaction.png
docs/submission/screenshots/03_grounded_copilot.png
docs/submission/screenshots/04_chronology_studio.png
docs/submission/screenshots/05_deadline_board.png
docs/submission/screenshots/06_standards_explorer.png
docs/submission/screenshots/07_accuracy_academy.png
```

Disposition: `KEEP_DATA` / `KEEP_EVIDENCE`.

## 14.2 `output_100426/` binary/print companions — 6 files

```text
output_100426/DISCHARGE_APPLICATION_HEMRAJ_COURT_READY.pdf
output_100426/DISCHARGE_APPLICATION_HEMRAJ_v4.pdf
output_100426/DISCHARGE_APPLICATION_HEMRAJ_v5.pdf
output_100426/DISCHARGE_APPLICATION_HEMRAJ_v5_ENGLISH.pdf
output_100426/DISCHARGE_APPLICATION_HEMRAJ_v5_PRINT.html
output_100426/NOTICE_REPLY_PITAMBARA_PRINT.html
```

Disposition: `KEEP_DATA` / `BLOCKED_REVIEW`; same confidentiality and court-use restrictions as the text outputs.

## 14.3 Brand/showcase assets — 22 files

```text
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
logo-ideas/logo 02.jpg
logo-ideas/logo video form.mp4
logo-ideas/logo-raj.png
```

Disposition: `KEEP_EVIDENCE`; mark selected brand assets and archive unused variants.

# 15. Exclusions and generated inventory reports

## Not guidance / not backlog

- `artifacts/legal-luminaire/backend/requirements.txt`
- `artifacts/legal-luminaire/backend/requirements313.txt`
- `node_modules/**`, virtual environments, `dist/**`, `__pycache__/**`, `.pytest_cache/**`, `.ruff_cache/**`
- `.kilo/worktrees/succulent-buffer/**` — linked worktree metadata
- `legal-luminaire/**` — duplicate nested Git checkout; counted once in the master inventory

## Reports generated by this task

- `docs/unwired-files-inventory.md` — refreshed master inventory.
- `docs/unwired-code-inventory.md` — new detailed code inventory.
- `docs/guidance-material-inventory.md` — this new detailed guidance inventory.

The two new companion reports are outputs of this inventory and are not included in the 452 pre-existing-document count.

# 16. Recommended documentation work

1. Keep `LAUNCH_HARDENING_REPORT.md` as the single current launch-status document.
2. Merge unique CODE-JUNCTION role/triage guidance into the primary brief or canonical architecture docs; archive the generic role preamble.
3. Reconcile `MODERNIZATION_PLAN.md`, root `ROADMAP.md`, `docs/roadmap/`, and enrichment/integration logs into one current roadmap.
4. Preserve audit/final/design evidence in place; link it from `DOCUMENTATION_INDEX.md` instead of moving it.
5. Resolve P2-01/P2-02 and keep their blocker documents canonical until acceptance criteria are met.
6. Validate FAQs, statutory parity, marketing claims, and legal-source material before publication or court use.
7. Keep real cases and `output_100426/` confidential; keep synthetic fixtures clearly labeled.
8. Add explicit loaders/tests if `sample_cases/`, `test-assets/`, or template files are intended to become user-visible runtime content.
