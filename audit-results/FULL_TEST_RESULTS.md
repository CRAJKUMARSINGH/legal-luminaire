# FULL TEST RESULTS
**Master Enrichment Guide Phase C — executed 2026-11-16**

All commands run with no `--passWithNoTests`, `--ignore`, `--skip`, or exclusion flags.

## Frontend — `artifacts/legal-luminaire`

```
./node_modules/.bin/vitest run        → 14 files, 388 passed, 0 failed (7.6s)
../../node_modules/.bin/tsc -p tsconfig.json --noEmit  → 0 errors
./node_modules/.bin/vite build --config vite.config.ts → success (~115 chunks)
```

Re-verified on merged `main` @ `e55c0c7`: 388/388 again (5.1s).

## Backend — `artifacts/legal-luminaire/backend`

```
./.venv/Scripts/python.exe -m pytest tests -q  → 170 passed, 1 warning (langchain-community deprecation, pre-existing)
```

All 8 test files collected: authentication(22), citation_registry(41), copilot(34), deadline_engine(50), route_registry(1), security_remediation(18), stadium_collapse_accuracy(3), verification_syntax(1).

## Python 3.11 compatibility (production Docker = python:3.11-slim)

```
ast.parse(feature_version=(3,11)) over all backend .py → 0 incompatible files
```
(after fixes on `fix/legal-luminaire-release-gates` `bb95884`; before fix: 2 files failed — the exact CI errors)

## Lint / security checks

- ESLint: **not configured** in repo (no config, no script) — N/A
- `pnpm audit --audit-level high`: blocked in CI by lockfile drift → fixed on fix branch; 19 pre-existing npm findings already documented
- `pip-audit`: chromadb 1.5.9 ×5 PYSEC, no fix available → SE-08

## Coverage measurement

NOT VERIFIED — no coverage instrumentation run (`vitest run --coverage` exists but was not executed; pytest-cov not configured).

**Totals: 558 tests, 0 failures, 0 exclusions.**
