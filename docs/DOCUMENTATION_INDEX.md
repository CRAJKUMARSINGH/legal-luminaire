# Legal Luminaire — Documentation Index

Searchable index of retained documentation, active evidence, specifications,
legal-source records, and rollback procedures.

- Generated: 2026-11-21
- Baseline commit: `c8f91cb`
- Current-state inventories refreshed: 2026-11-27 at `08c5929`
- Current inventories: [Master unwired-files inventory](unwired-files-inventory.md) · [Code inventory](unwired-code-inventory.md) · [Guidance material inventory](guidance-material-inventory.md)

> **Retention rule.** Keep documentation only when it serves an active functional
> purpose: CI/build/runtime consumers, canonical indexes, current release decisions,
> or current security, legal, citation, and deployment controls. Stale result
> snapshots and generated bundles are removed when superseded.

---

## How to search

```bash
# Everything mentioning a term (docs + evidence + specs)
rg -i "citation gate" docs/ audit-results/ final-deliverables/ design-deliverables/ \
   artifacts/audit artifacts/final artifacts/reports \
   artifacts/self-assessment artifacts/legal artifacts/demo-outputs \
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
| [ADR-010](adr/ADR-010-gemini-direct-drafting.md) | Supersede the unrecovered drafting package | Accepted |
| [ADR-011](adr/ADR-011-retire-pleading-chain.md) | Retire the unreleased Pleading Chain | Accepted |

Companion ADRs live under [docs/integration/](integration/) (feature-flag, local-first
redaction, copilot read-only, no-live-court-APIs).

## 3. Specifications (Kiro / Trae framework)

The `.kiro/specs/` feature packs are fully written but unwired. Per
`Legal kiro 26.txt` (C1) three were **promoted** to the active enhancement queue
on 2026-11-27; the rest stay valid guidance but are **parked** for later. Each
pack is `requirements.md` + `design.md` + `tasks.md` (CI-checked by `spec-lint`).

| Spec pack | Role | Status |
|---|---|---|
| [.kiro/specs/citation-deeplink/](../.kiro/specs/citation-deeplink/) | Every citation opens its source document | **ACTIVE** (promoted 2026-11-27) |
| [.kiro/specs/deadline-engine/](../.kiro/specs/deadline-engine/) | Deterministic limitation / deadline engine | **ACTIVE** (promoted 2026-11-27) |
| [.kiro/specs/accuracy-academy/](../.kiro/specs/accuracy-academy/) | Accuracy-training walkthrough | **ACTIVE** (promoted 2026-11-27) |
| [.kiro/specs/ask-copilot/](../.kiro/specs/ask-copilot/) | Grounded ask-copilot | Parked |
| [.kiro/specs/chronology-studio/](../.kiro/specs/chronology-studio/) | Chronology studio | Parked |
| [.kiro/specs/redaction-studio/](../.kiro/specs/redaction-studio/) | Redaction studio | Parked |
| [.kiro/specs/smart-drop/](../.kiro/specs/smart-drop/) | Smart document intake | Parked |
| [.kiro/specs/standards-explorer/](../.kiro/specs/standards-explorer/) | Standards explorer | Parked |
| [.trae/specs/kiro-max-reach-polish/](../.trae/specs/kiro-max-reach-polish/) | Polish spec + tasks | Parked |

Additional reference sets: [docs/task-specs/](task-specs/) (accuracy-gate /
demo-mode) and [docs/roadmap/](roadmap/) (6-month roadmap & omni-modal status).

## 4. Release / audit evidence

### 4.1 Current baseline and controls

| Document | Focus |
|---|---|
| [RELEASE_READINESS.md](RELEASE_READINESS.md) · [LAUNCH_HARDENING_REPORT.md](../LAUNCH_HARDENING_REPORT.md) | Canonical current test/build and launch baseline |
| [API_AUTHORIZATION_MATRIX.md](../audit-results/API_AUTHORIZATION_MATRIX.md) | Current API authorization coverage and residual gaps |
| [unwired-files-inventory.md](unwired-files-inventory.md) · [unwired-code-inventory.md](unwired-code-inventory.md) · [guidance-material-inventory.md](guidance-material-inventory.md) | Current unwired-file, code, and guidance inventories |
| [docs/blockers/](blockers/) — [P2-01](blockers/P2-01-DRAFTING-PACKAGE-GAP.md) · [P2-02](blockers/P2-02-PLEADING-VARIANTS.md) · [SE-01](blockers/SE-01-OIDC-CASE-ISOLATION.md) · [SE-08](blockers/SE-08-CHROMADB-ADVISORIES.md) · [LEGAL-11](blockers/LEGAL-SOURCE-CLOSURE.md) | Three open blockers and two closed decision records. [ADR-010](adr/ADR-010-gemini-direct-drafting.md) supersedes P2-01 and [ADR-011](adr/ADR-011-retire-pleading-chain.md) retires P2-02. |

Dated audit, test, browser, and deployment snapshots were removed after their
active controls were consolidated into the current blockers, release baseline,
and procedures below.

### 4.2 `final-deliverables/` (active controls and procedures)

| Document | Focus |
|---|---|
| [ROLLBACK_RUNBOOK.md](../final-deliverables/ROLLBACK_RUNBOOK.md) | **Rollback procedure** |
| [SECURITY_EXCEPTIONS.md](../final-deliverables/SECURITY_EXCEPTIONS.md) · [AUTH_BOUNDARY_REVIEW.md](../final-deliverables/AUTH_BOUNDARY_REVIEW.md) | Security exceptions and browser/backend boundary |
| [LEGAL_SOURCE_REVIEW.md](../final-deliverables/LEGAL_SOURCE_REVIEW.md) | Legal-source review |
| [DEPLOYMENT_SMOKE_TESTS.md](../final-deliverables/DEPLOYMENT_SMOKE_TESTS.md) | Deployment smoke specification |

### 4.3 `design-deliverables/`

Current design-token guidance is retained in
[DESIGN_TOKENS.md](../design-deliverables/DESIGN_TOKENS.md). Dated browser and
accessibility result snapshots were removed; outstanding runtime checks are
tracked in [Release Readiness](RELEASE_READINESS.md).

### 4.4 Scattered `artifacts/` guidance and data

[Architecture](../artifacts/final/ARCHITECTURE.md), demo-output guidance, and legal
control guidance remain in place. Superseded audit, release, phase-log, and
self-assessment reports were removed; current status lives in the launch and
release-readiness baselines above.

## 5. Rollback & recovery procedures

| Path | Procedure |
|---|---|
| [docs/ROLLBACK_PLAN.md](ROLLBACK_PLAN.md) | General rollback plan |
| [docs/HYBRID_MERGE_AUDIT_AND_ROLLBACK_PLAN.md](HYBRID_MERGE_AUDIT_AND_ROLLBACK_PLAN.md) | Merge audit + rollback |
| [final-deliverables/ROLLBACK_RUNBOOK.md](../final-deliverables/ROLLBACK_RUNBOOK.md) | Release rollback runbook |
| [final-deliverables/DEPLOYMENT_SMOKE_TESTS.md](../final-deliverables/DEPLOYMENT_SMOKE_TESTS.md) | Deployment smoke specification |

## 6. Legal-source & case material

| Path | Notes |
|---|---|
| [docs/case-docs/](case-docs/) | Arbitration/masterpiece case documents (`.lex` + Hindi) |
| [docs/accuracy-governance/](accuracy-governance/) | Accuracy rules |
| [artifacts/legal/PENDING_CITATION_GUARD.md](../artifacts/legal/PENDING_CITATION_GUARD.md) | Pending-citation guard |
| [output_100426/](../output_100426/) | Generated court-ready deliverables (**confidential — not for publication / court-use export; see resolution report §6**) |
| [Construction material testing](../faq/construction-material-testing.md) | FAQ copy |
| [Forensic construction testing](../faq/forensic-construction-testing.md) | FAQ copy |

## 7. Dispositions

Every retained path above is assigned a disposition in the current inventories:
`KEEP_CANONICAL`, `KEEP_GUIDANCE`, `KEEP_EVIDENCE`, `KEEP_DATA`, `CONSOLIDATE`,
`BLOCKED_REVIEW`, or `DELETE`.

| Area | Disposition |
|---|---|
| `docs/**`, `.kiro/**`, `.trae/**` | KEEP_CANONICAL / KEEP_GUIDANCE |
| `audit-results/**` | KEEP_EVIDENCE for the current authorization matrix only; dated snapshots removed |
| `final-deliverables/**` | KEEP_GUIDANCE / KEEP_EVIDENCE for active runbooks, smoke specification, security controls, and legal-source records |
| `design-deliverables/**` | KEEP_GUIDANCE for current design tokens |
| `artifacts/{audit,final,reports,self-assessment,legal,demo-outputs}/**` | KEEP_GUIDANCE / KEEP_DATA for retained architecture, demo, and legal material; stale reports removed |
| `faq/**` | KEEP_GUIDANCE |
| `output_100426/**` | KEEP_EVIDENCE (confidential — no publish/court-use export) |
| `logo-ideas/**` | KEEP_EVIDENCE (selected brand assets) / ARCHIVE (unused variants) |

### Operator scripts

| Path | Disposition |
|---|---|
| [Discharge generators](../output_100426/README.md) | Keep the three generators at the documented paths for reproducibility of historical outputs. |
| [Markdown duty scan](../scripts/scan_markdown_duty.py) | Keep as a manual inventory tool. A successful exit records completion of the scan, so it is unsuitable as a Markdown compliance gate. |
| [Demo seeder](../scripts/seed-demo-data.ts) | Keep as an operator tool. The [README](../README.md#production-status-and-launch-checks) documents the command. Its loopback contract test checks the multipart upload and indexing response. |

> **Script triage — `Legal kiro 26.txt` B1/B2 (2026-11-27).** B1 proposed
> archiving the three discharge generators to `archive/retired-scripts/`;
> **declined** — they stay canonical at `scripts/` per
> [output_100426/README.md](../output_100426/README.md#L7-L13) and are kept for
> reproducibility of the historical PDFs. B2 proposed adding
> `scan_markdown_duty.py` to CI as a lint gate; **declined** — it stays a manual
> inventory tool. `seed-demo-data.ts` remains an operator tool wired through the
> README. No files were moved.
