# Week 13 — Competition Readiness Lock

- **Status:** Complete
- **Date:** 2026-09-12
- **Required by:** `.github/workflows/ci.yml` and `docs/adr/ADR-008-competition-readiness-lock.md`

## Purpose

This file exists to satisfy the Week 13 competition-lock path contract. CI checks that this file exists; no runtime code, test, or build script parses its contents.

## Canonical lock inputs

| Requirement | Canonical source |
|---|---|
| ADR-001 through ADR-008 | `docs/adr/` |
| Week 13–16 scope and non-negotiables | `docs/adr/ADR-008-competition-readiness-lock.md` |
| Feature-flag inventory and defaults | `docs/FEATURE_FLAGS_MATRIX_W13.md` |
| Judge walkthrough | `docs/submission/JUDGE_WALKTHROUGH.md` |
| Content Security Policy | `netlify.toml` |
| Week 13 smoke tests | `.github/workflows/ci.yml` |

## CI contract

The Week 13 job is authoritative for the enforced checks: ADR presence, feature-flag matrix presence/date, competition-readiness document presence, CSP header, and protected-source integrity. Do not duplicate that gate logic in this document.

## Retention

Keep this file only while CI or ADR-008 references its path. If both references are removed, this file can be deleted. Historical narrative, scores, demo copy, and later-week handoffs are intentionally omitted.
