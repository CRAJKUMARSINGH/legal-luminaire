# Recovery announcement (Day 1)

**Date:** 2026-09-14  
**Recovery Lead (interim):** User / GitHub `@CRAJKUMARSINGH`  
**Architecture Owner (interim):** same  
**Release Owner:** unfilled (G-1) — Recovery Lead acts as interim  
**Documentation Owner (interim):** same

## Why

Multiple agents shipped features, prototypes, and a second backend without one merge path. We are pausing drift so we can keep one product: SPA + FastAPI in `artifacts/legal-luminaire`.

## What changes until Day 29 (2026-10-13)

- Non-critical **feature** merges to `main` are frozen (`feat/` needs written Recovery Lead approval).
- Allowed: recovery docs, CI/governance, critical hotfixes (`hotfix/` + emergency flow), and explicitly approved patch completion.
- PRs must use `.github/PULL_REQUEST_TEMPLATE.md` and stay within size rules.
- CI must be green. Governance script + frontend typecheck/test/build + backend compile + smoke pytest.

## What still counts as urgent

- Production outage or data-loss (emergency flow in `.trae/recovery/week1/02_control_rules.md`)
- Broken `main` / red CI
- Security / secret leak
- Citation-gate or accuracy-rule breakage

## Who approves exceptions

Only the Recovery Lead, written as a row in the exception register (`02_control_rules.md` §4). Hidden bypasses are not allowed.

## Shipping branch

`main` is the only source of truth. There is no second “real” product branch.
