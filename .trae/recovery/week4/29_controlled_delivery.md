# Week 4 — Day 29 Recovery-to-normal transition

> Source: `detailed_recovery_plan.md` Day 29.

## Freeze

The Day 1–29 **non-critical feature freeze** lifts for work that follows the handbook.

Still frozen without Recovery Lead written approval:

- New frameworks, runtimes, or architectural patterns
- Direct pushes to `main`
- Merges with red CI
- Self-merge
- Giant PRs (>1000 LOC) without Recovery Lead approval

## Rules that stay on

- Branch prefixes and review policy: `02_control_rules.md`
- PR template: `.github/PULL_REQUEST_TEMPLATE.md`
- CODEOWNERS: `.github/CODEOWNERS`
- CI: typecheck, Vitest, Vite build, compileall, smoke pytest
- Architecture: ADR-011–015 and the engineering handbook

## Exceptions remain rare

Open rows in `02_control_rules.md` §4 expire Day 30 unless re-approved. Do not add silent bypasses.

## Exit check

Feature work may resume **under these rules**, not the pre-recovery merge habit.
