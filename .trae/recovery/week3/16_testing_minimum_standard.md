# Week 3 — Day 16 Testing Minimum Standard

> Source: `detailed_recovery_plan.md` Day 16.

## Critical flows that must have tests

| Flow | Minimum |
|------|---------|
| SPA boot / routing types | Existing Vitest + CI route/flag smoke greps |
| Deadline computation | `tests/test_deadline_engine.py` (in CI) |
| Draft skeleton / catalog | `tests/test_drafting_engine.py` (in CI) |
| Pleading variant registry | `tests/test_variant_engine.py` (local; EXC-CI-PYTEST-VARIANTS until Day 30) |
| HTTP error envelope + `X-Request-ID` | `tests/test_http_contract.py` (in CI) |
| Copilot citation-or-refuse | `tests/test_copilot.py` (local / Day 30 CI — EXC-CI-PYTEST-COPILOT) |
| Case store hydrate | Week 4 Target 3 — not yet required |

## Changed-code rule

A PR that changes runtime code must include **at least one** of:

1. A new or updated unit test that fails without the change, or
2. A CI smoke grep/assert that the new symbol or route exists, or
3. An explicit note in the PR that the path is untested, with Recovery Lead approval (exception register).

Recovery markdown under `.trae/recovery/` does not need tests.

## Refactors without tests

Allowed only if: no behavior change **and** existing CI still covers the module **and** the PR risk is Low.

High-risk modules (Day 14 targets) still need smoke coverage around the change (this week: HTTP contract tests for FastAPI root/routes).

## Exit check

Recovery work uses this rule: smoke pytest + frontend Vitest on every PR; copilot pytest stays local until Day 30.
