# Legal Luminaire — Documentation Index

Searchable index of every documentation, evidence, spec, legal-source and rollback
artifact in the repository. Maintained as part of the
[unwired-files reconciliation](../audit-results/UNWIRED_FILES_RESOLUTION_REPORT.md).

- Generated: 2026-11-21
- Baseline commit: `c8f91cb`
- Companion manifest: [UNWIRED_FILES_MANIFEST.md](../audit-results/UNWIRED_FILES_MANIFEST.md)

> **Why this index exists instead of a mass `git mv`.** The scattered report
> collections (`audit-results/`, `design-deliverables/`, `final-deliverables/`,
> `artifacts/{audit,final,release,reports,…}`) are **historical release evidence**.
> Relocating them would either leave their many internal cross-references stale or
> require rewriting the records themselves — which the reconciliation directive
> forbids ("Do not delete unique historical evidence"). They are therefore
> **preserved in place** and made discoverable through this index.

---

## How to search

```bash
# Everything mentioning a term (docs + evidence + specs)
rg -i "citation gate" docs/ audit-results/ final-deliverables/ design-deliverables/ \
   artifacts/audit artifacts/final artifacts/release artifacts/reports \
   artifacts/self-assessment artifacts/legal artifacts/design artifacts/demo-outputs \
   .kiro .trae faq

# Find an ADR
rg -l "ADR-009" docs/adr

# Find release / security evidence
rg -il "rollback|security|release" audit-results final-deliverables

# Windows PowerShell equivalent (no ripgrep)
Get-ChildItem docs,audit-results,final-deliverables,design-deliverables -Recurse -Include *.md |
  Select-String -Pattern "citation gate" -List
```

---

## 1. Canonical instructions (authoritative — do not contradict)

| Path | Role | Status |
|---|---|---|
| [docs/DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | Developer onboarding & conventions | Canonical |
| [docs/USER_MANUAL.md](USER_MANUAL.md) | End-user manual | Canonical |
| [docs/INDEX.md](INDEX.md) | Existing docs entry point | Canonical |
| [docs/CACHE_HYGIENE.md](CACHE_HYGIENE.md) | Build/cache hygiene rules | Canonical |
| [docs/FEATURE_FLAGS_REFERENCE.md](FEATURE_FLAGS_REFERENCE.md) | Feature-flag reference | Canonical |
| [docs/FEATURE_FLAGS_MATRIX_W13.md](FEATURE_FLAGS_MATRIX_W13.md) | Flag matrix (CI-checked) | Canonical — CI gate |
| [docs/VIDEO_MANUAL_SCRIPT.md](VIDEO_MANUAL_SCRIPT.md) | Demo video script | Canonical |
| [.kiro/steering/accuracy-rules.md](../.kiro/steering/accuracy-rules.md) | Accuracy-first steering rules | Canonical |
| [.kiro/steering/legal-luminaire-protected-files.md](../.kiro/steering/legal-luminaire-protected-files.md) | Protected-file list | Canonical |
| [docs/accuracy-governance/ACCURACY_RULES.md](accuracy-governance/ACCURACY_RULES.md) | Accuracy governance rules | Canonical |

## 2. Architecture Decision Records (ADRs)

| ADR | Title | Status |
|---|---|---|
| [ADR-001](adr/ADR-001-accuracy-first-architecture.md) | Accuracy-first architecture | Accepted |
| [ADR-002](adr/ADR-002-local-first-fallback.md) | Local-first fallback | Accepted |
| [ADR-003](adr/ADR-003-feature-flags-all-new-features.md) | Feature flags for all new features | Accepted |
| [ADR-004](adr/ADR-004-monorepo-pnpm-workspace.md) | Monorepo / pnpm workspace | Accepted |
| [ADR-005](adr/ADR-005-bilingual-hindi-english.md) | Bilingual Hindi/English | Accepted |
| [ADR-006](adr/ADR-006-synthetic-data-only.md) | Synthetic data only | Accepted |
| [ADR-007](adr/ADR-007-ci-gates-release-lock.md) | CI gates / release lock | Accepted |
| [ADR-008](adr/ADR-008-competition-readiness-lock.md) | Competition readiness lock | Accepted |
| [ADR-009](adr/ADR-009-canonical-runtime.md) | **Canonical runtime** (web app = `artifacts/legal-luminaire`, API = its `backend`) | Accepted |

Companion ADRs live under [docs/integration/](integration/) (feature-flag, local-first
redaction, copilot read-only, no-live-court-APIs).

## 3. Specifications (Kiro / Trae framework)

| Path | Role |
|---|---|
| [.kiro/specs/](../.kiro/specs/) | 8 spec packs (`requirements.md` + `design.md` + `tasks.md`) — CI-checked by `spec-lint` |
| [.trae/specs/kiro-max-reach-polish/](../.trae/specs/kiro-max-reach-polish/) | Polish spec + tasks |
| [docs/task-specs/](task-specs/) | Accuracy-gate / demo-mode task specs |
| [docs/roadmap/](roadmap/) | 6-month roadmap & omni-modal status |

## 4. Release / audit evidence

### 4.1 `audit-results/` (canonical audit evidence)

| Document | Focus |
|---|---|
| [FINAL_RELEASE_DECISION.md](../audit-results/FINAL_RELEASE_DECISION.md) · [RELEASE_DECISION.md](../audit-results/RELEASE_DECISION.md) | Go/no-go decisions |
| [FULL_TEST_RESULTS.md](../audit-results/FULL_TEST_RESULTS.md) · [TEST_EXECUTION.md](../audit-results/TEST_EXECUTION.md) | Test evidence |
| [SECURITY_VERIFICATION.md](../audit-results/SECURITY_VERIFICATION.md) · [SECURITY_AND_CASE_ISOLATION.md](../audit-results/SECURITY_AND_CASE_ISOLATION.md) · [SE01_AUTH_AND_CASE_ISOLATION.md](../audit-results/SE01_AUTH_AND_CASE_ISOLATION.md) | Security & case isolation |
| [SE08_CHROMADB_ADVISORY_REGISTER.md](../audit-results/SE08_CHROMADB_ADVISORY_REGISTER.md) | Vulnerability exception register (SE-08) |
| [LEGAL_SOURCE_CLOSURE.md](../audit-results/LEGAL_SOURCE_CLOSURE.md) · [LEGAL_ACCURACY_VERIFICATION.md](../audit-results/LEGAL_ACCURACY_VERIFICATION.md) | Legal-source records |
| [CITATION_EXPORT_REGRESSION.md](../audit-results/CITATION_EXPORT_REGRESSION.md) | Citation-export regression evidence |
| [DEPLOYMENT_SMOKE_AND_ROLLBACK.md](../audit-results/DEPLOYMENT_SMOKE_AND_ROLLBACK.md) · [DEPLOYMENT_VERIFICATION.md](../audit-results/DEPLOYMENT_VERIFICATION.md) | Deploy + rollback |
| [REMAINING_RISKS.md](../audit-results/REMAINING_RISKS.md) | Open risks |
| [PLAYWRIGHT_ROUTE_INVENTORY.md](../audit-results/PLAYWRIGHT_ROUTE_INVENTORY.md) · [PLAYWRIGHT_SCREENSHOTS_AND_RESULTS.md](../audit-results/PLAYWRIGHT_SCREENSHOTS_AND_RESULTS.md) · [ROUTE_*.md](../audit-results/) | Playwright route sweep |
| [UNWIRED_FILES_MANIFEST.md](../audit-results/UNWIRED_FILES_MANIFEST.md) · [UNWIRED_FILES_RESOLUTION_REPORT.md](../audit-results/UNWIRED_FILES_RESOLUTION_REPORT.md) | **This reconciliation** |

### 4.2 `final-deliverables/` (release-candidate pack)

| Document | Focus |
|---|---|
| [RELEASE_CANDIDATE_MANIFEST.md](../final-deliverables/RELEASE_CANDIDATE_MANIFEST.md) | RC manifest |
| [PRODUCTION_READINESS.md](../final-deliverables/PRODUCTION_READINESS.md) | Production readiness |
| [ROLLBACK_RUNBOOK.md](../final-deliverables/ROLLBACK_RUNBOOK.md) | **Rollback procedure** |
| [FINAL_SECURITY_CLOSURE.md](../final-deliverables/FINAL_SECURITY_CLOSURE.md) · [SECURITY_EXCEPTIONS.md](../final-deliverables/SECURITY_EXCEPTIONS.md) · [AUTH_BOUNDARY_REVIEW.md](../final-deliverables/AUTH_BOUNDARY_REVIEW.md) · [AUTHORIZATION_TEST_RESULTS.md](../final-deliverables/AUTHORIZATION_TEST_RESULTS.md) | Security closure |
| [CITATION_EXPORT_RECHECK.md](../final-deliverables/CITATION_EXPORT_RECHECK.md) · [CITATION_GATE_ADVERSARIAL_RESULTS.md](../final-deliverables/CITATION_GATE_ADVERSARIAL_RESULTS.md) | Citation gate |
| [LEGAL_SOURCE_REVIEW.md](../final-deliverables/LEGAL_SOURCE_REVIEW.md) | Legal-source review |
| [FULL_TEST_EXECUTION.md](../final-deliverables/FULL_TEST_EXECUTION.md) · [DEPLOYMENT_SMOKE_TESTS.md](../final-deliverables/DEPLOYMENT_SMOKE_TESTS.md) · [PRE_MERGE_AND_MERGE_REPORT.md](../final-deliverables/PRE_MERGE_AND_MERGE_REPORT.md) | Test / merge evidence |

### 4.3 `design-deliverables/`

Accessibility, performance, responsive screenshots and design tokens —
see [design-deliverables/](../design-deliverables/).

### 4.4 Scattered `artifacts/` evidence collections (preserved in place)

`artifacts/audit/`, `artifacts/final/`, `artifacts/release/`, `artifacts/reports/`,
`artifacts/self-assessment/`, `artifacts/legal/`, `artifacts/design/`,
`artifacts/demo-outputs/` — earlier-phase evidence packs (baseline results, repository
inventory, security findings, architecture, changelog, demo outputs). See §7 for
dispositions.

## 5. Rollback & recovery procedures

| Path | Procedure |
|---|---|
| [docs/ROLLBACK_PLAN.md](ROLLBACK_PLAN.md) | General rollback plan |
| [docs/HYBRID_MERGE_AUDIT_AND_ROLLBACK_PLAN.md](HYBRID_MERGE_AUDIT_AND_ROLLBACK_PLAN.md) | Merge audit + rollback |
| [final-deliverables/ROLLBACK_RUNBOOK.md](../final-deliverables/ROLLBACK_RUNBOOK.md) | Release rollback runbook |
| [audit-results/DEPLOYMENT_SMOKE_AND_ROLLBACK.md](../audit-results/DEPLOYMENT_SMOKE_AND_ROLLBACK.md) | Deploy smoke + rollback |

## 6. Legal-source & case material

| Path | Notes |
|---|---|
| [docs/case-docs/](case-docs/) | Arbitration/masterpiece case documents (`.lex` + Hindi) |
| [docs/accuracy-governance/](accuracy-governance/) | Accuracy rules |
| [artifacts/legal/PENDING_CITATION_GUARD.md](../artifacts/legal/PENDING_CITATION_GUARD.md) | Pending-citation guard |
| [output_100426/](../output_100426/) | Generated court-ready deliverables (**confidential — not for publication / court-use export; see resolution report §6**) |
| [faq/](../faq/) | Forensic-testing FAQ copy |

## 7. Dispositions

Every path above is assigned exactly one disposition in
[UNWIRED_FILES_RESOLUTION_REPORT.md](../audit-results/UNWIRED_FILES_RESOLUTION_REPORT.md):
`KEEP_RUNTIME`, `KEEP_TEST`, `KEEP_DOCUMENTATION`, `KEEP_EVIDENCE`, `INCORPORATE`,
`ARCHIVE`, `DELETE`, `BLOCKED_REVIEW`.

| Area | Disposition |
|---|---|
| `docs/**`, `.kiro/**`, `.trae/**` | KEEP_DOCUMENTATION |
| `audit-results/**`, `final-deliverables/**`, `design-deliverables/**` | KEEP_EVIDENCE |
| `artifacts/{audit,final,release,reports,self-assessment,legal,design,demo-outputs}/**` | KEEP_EVIDENCE |
| `faq/**` | KEEP_DOCUMENTATION |
| `output_100426/**` | KEEP_EVIDENCE (confidential — no publish/court-use export) |
| `logo-ideas/**` | KEEP_EVIDENCE (selected brand assets) / ARCHIVE (unused variants) |
