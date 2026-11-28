# CREAT.MD — Rolling continuity log

Newest entries first. This file is the project's session chat log and is refreshed automatically every 12 minutes by a scheduled task (see [README.md](README.md) §Standing Orders). Prior entries are never deleted.

### Session: 2026-11-29 — Tutorial corpus real outputs + standing orders

- **"Make it produce real outputs"** — shipped a gate-shaped `body` for every productive draft across all 30 tutorial pairs (66 bodies, 689–2108 chars). Each opens with a `SYNTHETIC / DEMO — gate-shaped worked example; NOT filing-ready` header; unverified authority stays an explicit `[PENDING — …]` hole. Dormant drafts carry no body.
- Populated **82** statute entries with official India Code `sourceUrl`s; 46 left `null` (43 PENDING + 3 non-statute). No third-party domains.
- Wired the engine hand-off: added `initialQuery` / `initialDraftType` / `initialLanguage` props to `artifacts/legal-luminaire/src/components/draft-generator.tsx`, created `artifacts/legal-luminaire/src/pages/TutorialPairDraftPage.tsx` (route `/tutorial-pairs/:id`), and linked it from `TutorialPairsPage.tsx`.
- Regenerated the UI bundle from canonical JSON, updated the validator, tests, and `tutorial-data/README.md`. Static verification: `pairs=30 bodies=66 sourceUrls=82`, bundle mirrors JSON. Node/pnpm absent on this host, so verification is static.
- **Standing orders recorded** (see [README.md](README.md) §Standing Orders): (1) keep this session chat log in `CREAT.MD`, refreshed every 12 minutes; (2) keep folders always, even when empty; (3) protected folders `Attached_Assets/` and `CODE-JUNCTION/` must always exist and never be altered adversely.

### Session: 2026-11-27 — Launch baseline re-verification + landing-link fix

Re-ran the CODE-JUNCTION launch baseline against `fa4918b`. Protected folders (`Attached_Assets`, `CODE-JUNCTION`) are intact and untouched. Workspace typecheck is clean, all 388 frontend tests pass, and the production build succeeds (entry 616.05 kB minified / 183.16 kB gzipped). Fixed one broken landing-page link (`/demo-cases` → `/demo-browser` in `PremiumHeroBanner`) and confirmed every remaining landing-page link resolves to a defined route. Backend pytest and Ruff could not run: both backend venvs reference missing interpreters and the system Python is the non-functional Windows Store alias. See [the launch hardening report](LAUNCH_HARDENING_REPORT.md).
