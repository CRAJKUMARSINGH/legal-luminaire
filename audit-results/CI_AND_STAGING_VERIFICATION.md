# CI & Staging Verification

| Check | Status | Evidence |
|---|---|---|
| `ci` workflow (backend syntax 3.11, frontend typecheck+build) | ✅ PASS on main | run 44016901898 (pre-8903cde; rerun pending on new commit) |
| `security-audit` (pnpm audit 0 vulns; pip-audit w/ SE-08 exceptions) | ✅ PASS | run 44016902038 |
| Netlify deploy preview | ✅ live | deploy-preview-5 |
| Frontend vitest | ✅ 388/388 | last run post-merge |
| Backend pytest | ✅ 176/176 (incl. 6 new auth-scope tests) | local .venv run 2026-11-17 |
| tsc --noEmit | ✅ 0 errors | post-zod4 verified |
| Route sweep | ✅ 102/102 | preview-audit/routes/report.json |
| axe-core / Lighthouse | NOT TESTED | tooling not installed |
| Staging smoke w/ live backend | NOT TESTED | backend not deployed to staging |
| OIDC sign-in/out staging test | BLOCKED | SE-01 not implemented |
