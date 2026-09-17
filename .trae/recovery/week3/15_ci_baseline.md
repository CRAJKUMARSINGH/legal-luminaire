# Week 3 — Day 15 Enforced CI Baseline

> Source: `detailed_recovery_plan.md` Day 15. Complements ADR-007.

## What is now mandatory on every PR / push to `main`

| Gate | Where | Pass condition |
|------|--------|----------------|
| Governance script | `frontend` job | `scripts/check-governance.sh` |
| Frozen lockfile install | `frontend` job | `pnpm install --frozen-lockfile` |
| Typecheck (lint gate) | `frontend` job | `pnpm run typecheck:libs` + SPA `typecheck` |
| Vitest | `frontend` job | `pnpm --filter @workspace/legal-luminaire run test` |
| Vite build + SPA integrity | `frontend` job | build + `dist/public` checks |
| Python compile | `backend` job | `python -m compileall artifacts/legal-luminaire/backend` |
| Backend smoke pytest | `backend` job | `test_http_contract`, `test_deadline_engine`, `test_drafting_engine` |

There is **no ESLint config** in the SPA. **Typecheck is the lint gate** until Day 30 (EXC-CI-ESLINT).

## Temporary exceptions (time-boxed)

| ID | What | Why | Expires |
|----|------|-----|---------|
| EXC-CI-ESLINT | No `eslint` job | Would be a new toolchain (recovery: no new pattern without approval). Typecheck covers the Day 15 lint intent. | Day 30 |
| EXC-CI-PYTEST-VARIANTS | `tests/test_variant_engine.py` not in CI | Registry grew to 52 subjects and caption regex tests fail against current drafts. Fix is Week 4 / Day 30, not a silent assert change. | Day 30 |
| EXC-CI-EXPRESS | `artifacts/api-server` not in CI | Not canonical product (ADR-009 / CONTRIBUTING). | Day 30 |
| EXC-CI-STREAMLIT-AUDIT | `requirements-streamlit.txt` audit skipped when file missing | File does not exist; job was failing every run. | Day 30 or until file is added |

## Branch protection (human step)

Release Owner (interim: Recovery Lead) must mark these GitHub checks required on `main`:

- `Frontend typecheck (lint gate) + test + build`
- `Backend compile + smoke pytest`

Do not allow bypass without a row in `02_control_rules.md` §4.

## Exit check

Code cannot merge with red CI once those checks are required. The workflow already fails the job on pytest/typecheck/build failure.
