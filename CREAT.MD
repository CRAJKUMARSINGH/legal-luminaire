# CREAT.MD — Rolling continuity log

### Session: 2026-11-27 — Launch baseline re-verification + landing-link fix

Re-ran the CODE-JUNCTION launch baseline against `fa4918b`. Protected folders (`Attached_Assets`, `CODE-JUNCTION`) are intact and untouched. Workspace typecheck is clean, all 388 frontend tests pass, and the production build succeeds (entry 616.05 kB minified / 183.16 kB gzipped). Fixed one broken landing-page link (`/demo-cases` → `/demo-browser` in `PremiumHeroBanner`) and confirmed every remaining landing-page link resolves to a defined route. Backend pytest and Ruff could not run: both backend venvs reference missing interpreters and the system Python is the non-functional Windows Store alias. See [the launch hardening report](LAUNCH_HARDENING_REPORT.md).
