# DEPLOYMENT SMOKE AND ROLLBACK
**Master Enrichment Guide — deployment safety, 2026-11-16**

## Deployment status

| Item | Status |
|------|--------|
| Netlify deploy of merged `main` | NOT VERIFIED — no new deploy triggered by this work |
| Preview build | ✅ `vite build` succeeds locally; `vite preview` serves all tested routes |
| SPA fallback | ✅ Verified — direct refresh of `/about`, `/how-to-use`, `/accuracy-academy` returns 200 |
| Production credentials in client bundle | ✅ None — scanned `dist/public/assets/*.js` |
| `LL_API_KEY` / env vars | Server-side only; never shipped to client (SE-01 documents shared-key model) |
| API auth enforced | ✅ `test_authentication.py` 22/22 — backend unchanged by merge |
| Citation export restrictions | ✅ `test_citation_registry.py` 41/41 — backend unchanged |
| Backend changes in merge | ✅ Zero — `git diff f92858d HEAD -- backend/` empty |

## Smoke tests still required on a live deploy

From `final-deliverables/DEPLOYMENT_SMOKE_TESTS.md` — must run against a real Netlify preview before production promotion:

- [ ] Landing page loads with hero, nav, footer at all breakpoints
- [ ] `/api/legal/*` proxy reaches backend; unauthenticated request → 401/403
- [ ] Case selection works; citation verification endpoint responds
- [ ] Draft export blocked for restricted citations (adversarial fixture)
- [ ] No console errors in production build

## Rollback

Three options documented in `final-deliverables/PRE_MERGE_AND_MERGE_REPORT.md` §10 and `final-deliverables/ROLLBACK_RUNBOOK.md`:

- **A — Netlify:** republish previous successful deploy (instant, preferred)
- **B — Git revert:** `git revert aeb6421 --no-edit && git push` (clean, preserves history)
- **C — Reset:** `git reset --hard f92858d && git push --force-with-lease` (last resort only)

Design changes are purely visual (1 TSX + 1 CSS + docs); backend/legal controls are untouched, so rollback risk is limited to appearance.
