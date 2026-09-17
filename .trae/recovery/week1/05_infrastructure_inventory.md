# Week 1 — Infrastructure & Environment Inventory

**Date:** 2026-09-14

## Executive Summary

Two primary deployment targets exist: **Netlify** (recommended per ADR-007 and docs) and **Vercel** (secondary), with an additional **Replit** platform config, **Docker Compose** local full-stack setup, and an optional Python/FastAPI backend. The biggest operational gap is **no formal staging environment**, no explicit release owner/rollback owner, and no automated monitoring or alerting for production deployments.

## Environments Discovered

| Environment | How discovered (files) | Config source (.env? hard-coded?) | Secret handling | Deploy method | Rollback method | Monitoring setup | Notes |
|---|---|---|---|---|---|---|---|
| **Local (dev)** | `RUN.bat`, `start.sh`, `start.bat`, `docker-compose.yml`, `package.json` scripts | `.env` file (backend), `process.env` with defaults (frontend), `.env.local` for Vite flags | `.env.example` template provided; `OPENAI_API_KEY`, `TAVILY_API_KEY`, etc. via user-supplied `.env` | Manual: `pnpm run dev`, `python main.py`, `docker compose up` | Git revert + feature flags (`docs/ROLLBACK_PLAN.md`) | No monitoring; console logs only | Primary day-to-day environment |
| **Netlify (prod)** | `netlify.toml`, `DEPLOY_AND_MULTI_CASE_GUIDE.md`, `docs/adr/ADR-007-ci-gates-release-lock.md`, README badge | `netlify.toml` env vars (`NODE_VERSION=22`, `PNPM_VERSION=10`, `CI=true`); build-env only, no runtime backend keys | No secrets in config; API keys for backend not configured on Netlify (frontend is static SPA) | GitHub → Netlify auto-deploy on `main` | Revert PR + re-deploy; feature flags for new features | No explicit APM/alerting; Netlify built-in deploy logs only | **Recommended production target per ADR-007**. FROZEN config per ADR. |
| **Vercel (prod alt)** | Root `vercel.json`, `artifacts/legal-luminaire/vercel.json` | `buildCommand` + `outputDirectory` in vercel.json; SPA rewrites configured | No secrets in config files | Vercel dashboard import → auto-deploy | Vercel rollback (previous deployment) | No evidence of Vercel monitoring config | Secondary target; documented in deploy guide |
| **Replit** | `.replit`, `.replitignore`, artifact `.toml` files | `modules = ["nodejs-24", "postgresql-16"]`, `deploymentTarget = "autoscale"`, `postMerge` script | No secrets hardcoded | Replit platform auto-build | Replit version history | Replit built-in platform monitoring | Legacy/supplementary host |
| **Docker Compose (local full-stack)** | `docker-compose.yml`, `Dockerfile.optimized` (backend), `Dockerfile.frontend.optimized` | Compose env vars: `OPENAI_API_KEY`, `TAVILY_API_KEY` from host `.env`; `VITE_API_URL`, `CORS_ORIGINS`, `REDIS_URL` hardcoded in compose | Secrets pass-through from host `.env` to backend container | `docker compose up --build` | `docker compose down` + revert image | Container healthchecks only (curl endpoints) | Full-stack incl. Redis, ChromaDB volumes |
| **Staging** | — | — | — | — | — | — | **No evidence found — Not established** |
| **CI (GitHub Actions)** | `.github/workflows/ci.yml`, `security-audit.yml` | Ubuntu-latest runner, Node 22, Python 3.11, pnpm 10 | No secrets; only `contents: read` permission | Push/PR/workflow_dispatch triggers | N/A (ephemeral) | Workflow run logs + status badges | Mandatory gate per ADR-007 |

## CI/CD Workflows

| Workflow file | Path | Purpose (CI? security?) | Triggers (push / PR / schedule) | Checks run (build? lint? test? typecheck?) | Required to pass before merge? | Gaps |
|---|---|---|---|---|---|---|
| `ci.yml` | `.github/workflows/ci.yml` | **CI + release gate** (mandatory per ADR-007) | `pull_request`, `push` (main only), `workflow_dispatch` | Frontend: install, typecheck (libs + frontend), Vitest suite, Vite build, SPA integrity (index.html, _redirects, assets dir), Week 1–4 + W13 smoke-tests (flags, specs, routes, ADRs, protected files, netlify CSP). Backend: Python `compileall` syntax check. | **Yes** — ADR-007: "failing typecheck or build is a hard block — no exceptions" | 1. Backend has no unit tests run (only syntax compile); 2. No lint step (eslint/prettier not automated); 3. No end-to-end/integration tests; 4. `security-audit.yml` step: references `requirements-streamlit.txt` (file does not exist in repo) causing potential audit job failure |
| `security-audit.yml` | `.github/workflows/security-audit.yml` | **Dependency security audit** | `pull_request`, `push` (main), `schedule` (Mon 02:30 UTC cron), `workflow_dispatch` | Node: `pnpm audit --audit-level high`. Python: `pip-audit -r backend/requirements.txt` + `pip-audit -r requirements-streamlit.txt` | Not explicitly a branch protection rule, but runs on every PR | 1. References non-existent `requirements-streamlit.txt` → python_audit job will fail; 2. No SBOM generation; 3. No SAST (code-level scanning like CodeQL/Semgrep); 4. No secret scanning configured |

## Containerization & Deploy Targets

| Artifact | Path | Deploy target (Vercel? Docker? local?) | Healthcheck defined? | Exposed ports | Reverse proxy | Rollback strategy | Notes |
|---|---|---|---|---|---|---|---|
| `docker-compose.yml` | Root | **Local full-stack** (dev/CI) | Yes: Redis (`redis-cli ping`), Frontend (`curl /health` on :5173), Backend (`curl /api/v1/health` on :8000) | `6379` (Redis), `5173` (Frontend), `8000` (Backend) | None direct (Nginx inside frontend container only) | `docker compose down` + rebuild | 3 named volumes: `chroma_data`, `case_docs`, `redis_data` |
| `Dockerfile.optimized` | `artifacts/legal-luminaire/backend/` | Docker / Compose | Yes: `HEALTHCHECK` via curl to `:8000/api/v1/health` (30s interval, 60s start) | `8000` | N/A | Rebuild from earlier commit | Multi-stage (builder + runtime), non-root user, venv copy, Python 3.11-slim |
| `Dockerfile.frontend.optimized` | `artifacts/legal-luminaire/` | Docker / Compose | Yes: `HEALTHCHECK` curl `:5173/` (30s interval, 5s start) | `5173` | Nginx (internal to container — serves built SPA) | Rebuild + redeploy | Multi-stage: Node 18 build → Nginx alpine; port mismatch note: healthcheck/EXPOSE use 5173 but nginx.conf also listens 5173 |
| `vercel.json` | Root | **Vercel (root-level deploy)** | No | 443 (Vercel-managed) | Vercel edge network | Vercel deployment revert | SPA rewrite `/* → /index.html`. Build command: `cd artifacts/legal-luminaire && npm install --ignore-scripts && npm run build`. Output dir: `artifacts/legal-luminaire/dist` |
| `vercel.json` | `artifacts/legal-luminaire/` | **Vercel (subdir deploy)** | No | 443 (Vercel-managed) | Vercel edge network | Vercel deployment revert | SPA rewrite only. Build/output not defined in this file (expected to pick up defaults) |
| `nginx.conf` | `artifacts/legal-luminaire/` | Inside Docker frontend image OR standalone Nginx | N/A (passive) | `5173` (nginx listen) | Nginx itself (static SPA + /health endpoint + gzip + security headers + caching) | Rebuild image or reload nginx config | Full headers: X-Frame-Options, CSP, X-XSS, Referrer-Policy, Permissions-Policy. gzip enabled. 20M body size. Cache: 1y for assets, 1h for HTML |
| `netlify.toml` | Root | **Netlify (PRIMARY — ADR-007 FROZEN)** | No explicit healthcheck definition | 443 (Netlify-managed) | Netlify CDN + SPA redirect (`/* → /index.html 200`) | Netlify deploy revert (UI), PR revert | Per ADR-007: frozen. CSP + X-Frame + X-Content-Type + Referrer headers. `--no-frozen-lockfile` due to Windows→Linux lockfile mismatch. Publish dir: `artifacts/legal-luminaire/dist/public` |
| `.replit` | Root | **Replit platform** | No explicit | Replit managed | Replit router (`router = "application"`, `deploymentTarget = "autoscale"`) | Replit version history | Node 24 + PostgreSQL 16 modules; 3 artifacts registered; postMerge hook |

## Start Scripts & Local Development

| Script | Path | What it starts | Env vars needed | Known quirks | Reliability notes |
|---|---|---|---|---|---|
| `RUN.bat` | Root | Launches **2 separate windows**: (1) API server (`artifacts/api-server` build + start on :8000), (2) Frontend dev server (`pnpm run dev` on :5173) | Backend: `NODE_ENV=development` (set inline). No explicit `.env` loading for api-server. | Windows-only (`start` cmd). Uses `pnpm run build` every startup → slow on repeated runs. Starts artifacts/api-server (Express) not the Python/FastAPI backend — **potential confusion**. | Script is simple window spawning, no error propagation between windows. |
| `start.sh` | `artifacts/legal-luminaire/backend/` | Python FastAPI backend via `python main.py` (port 8000) | Requires `.env` file (script hard-exits if missing). Auto-creates venv, pip installs. | Cross-platform venv activate fallback (`bin/activate` then `Scripts/activate`). `pip install -r requirements.txt -q` on every start (quiet but slow). | Good guard: validates `.env` existence. Uses `set -e`. |
| `start.bat` | `artifacts/legal-luminaire/backend/` | Windows equivalent of start.sh: Python FastAPI backend (`python main.py`) | Requires `.env` file (hard-exits if missing + `pause` prompt). Auto-creates venv, pip installs. | `pause` at end keeps window open. Runs `pip install -q` every boot. | Windows-only. Reliable syntax (uses `call` for venv activation). |
| `pnpm run dev` (frontend) | Root → `artifacts/legal-luminaire/package.json` | Vite dev server via `vite --host 0.0.0.0` | `VITE_BACKEND_URL` (optional, default `http://127.0.0.1:8000`). `VITE_FF_*` flags via `.env.local` | `--host 0.0.0.0` exposes to LAN (security consideration for untrusted networks). | Standard Vite dev experience. HMR enabled. |
| `pnpm run dev` (api-server) | `artifacts/api-server/package.json` | Builds (`node ./build.mjs` → esbuild) then runs compiled Express API (`node --enable-source-maps ./dist/index.mjs`) | `NODE_ENV=development` (inline). `PORT` (default auto-bind per Replit). | Builds on every dev start (not watch mode). | Uses esbuild (fast). Source maps enabled. |
| `docker compose up` | Root docker-compose.yml | Full stack: Redis + Frontend (nginx) + Backend (uvicorn) | Host `.env` must have `OPENAI_API_KEY` + `TAVILY_API_KEY` (passed to backend). Frontend `VITE_API_URL=http://backend:8000/api/v1` (container DNS) | Compose-level healthchecks + `depends_on` with `condition: service_healthy`. 60s backend start_period. | Most reproducible local setup. Docker layer caching reduces subsequent boot time. |
| `pnpm test` | `artifacts/legal-luminaire/package.json` | Vitest test runner (`vitest run`) | N/A (stubbed data only, no backend calls in tests) | N/A | 349 tests in README; 144 mentioned in DEVELOPER_GUIDE — inconsistency noted. |

## Config & Secrets Handling

### .env.example Present?

**Yes.** Located at: `artifacts/legal-luminaire/backend/.env.example`

### Variables Referenced in `.env.example`

**Required API keys:**
- `OPENAI_API_KEY` (GPT-4o agents + embeddings)
- `TAVILY_API_KEY` (real-time web citation verification)

**Optional API keys:**
- `SERPER_API_KEY` (fallback web search)
- `GOOGLE_API_KEY` (Gemini Omni-Modal ingestion)
- `SCC_ONLINE_API_KEY` (live legal DB — SCC Online)
- `MANUPATRA_API_KEY` (live legal DB — Manupatra)
- `HARVEY_API_KEY`, `HARVEY_REGION`, `HARVEY_ENABLED`, `HARVEY_MODEL`, `HARVEY_INCLUDE_CITATIONS` (Harvey.ai integration)

**Paths & runtime:**
- `CHROMA_PERSIST_DIR`, `CASE_DOCS_DIR`
- `API_HOST`, `API_PORT`, `CORS_ORIGINS`
- `LLM_MODEL`, `LLM_TEMPERATURE_RESEARCH`, `LLM_TEMPERATURE_DRAFT`
- `EMBEDDING_MODEL`, `EMBEDDING_MODEL_LOCAL`
- `MAX_REQUESTS_PER_MINUTE`, `MAX_TOKENS_PER_REQUEST`
- `HALLUCINATION_THRESHOLD` (circuit breaker 0.0–1.0)

### Frontend Env Vars (not in `.env.example`, but referenced in code/docs):
- `VITE_BACKEND_URL` (default `http://127.0.0.1:8000`)
- `VITE_FF_<flag_name>` — 8 integration flags + 3 hybrid flags (per SystemFlagsPage)
  - `VITE_FF_REDACTION_STUDIO`, `VITE_FF_SMART_DROP`, `VITE_FF_ASK_COPILOT`, `VITE_FF_CITATION_DEEPLINK`, `VITE_FF_DEADLINE_ENGINE`, `VITE_FF_CHRONOLOGY_STUDIO`, `VITE_FF_STANDARDS_EXPLORER`, `VITE_FF_ACCURACY_ACADEMY`
  - Note: featureFlags.ts uses snake_case flag names, SystemFlagsPage references them as `VITE_FF_<UPPER_SNAKE>`
- `VITE_FF_HYBRID_STANDARDS_VALIDITY`, `VITE_FF_HYBRID_SESSION_WORKSPACE`, `VITE_FF_HYBRID_DRAFT_VIEWER`

### Hardcoded Secrets Anywhere Found?

**No actual hardcoded secrets detected** (no `sk-...` or real API keys committed). Grep scan found only variable assignments with empty defaults in `config.py`.

However, the **following have hardcoded empty-string defaults** in `backend/config.py` which means no runtime validation of required keys:
- `openai_api_key: str = ""` (line 7)
- `tavily_api_key: str = ""` (line 8)
- All other keys default `= ""`

This means the backend will start without API keys and fail silently at call-time rather than startup.

### ENV Var Validation Present?

**Backend (Python):** Partial. Uses `pydantic-settings` `BaseSettings` (type coercion + `.env` auto-load) but **all keys default to empty string** — no `Field(..., min_length=1)` or startup validation to fail-fast if required keys (`OPENAI_API_KEY`, `TAVILY_API_KEY`) are missing.

**Frontend (Vite/TS):** No. `VITE_*` env vars are read via `import.meta.env` inline with optional chaining/defaults. No zod or centralized schema validation at boot. Feature flag system in `featureFlags.ts` defaults to `false` (safe) but doesn't validate env var shape.

**api-server (Node/Express):** Minor — `process.env["PORT"]` is read and cast, no DATABASE_URL validation (though the db lib in SUPPLEMENT does check `if (!process.env.DATABASE_URL)`).

## Mismatches & Hidden Manual Steps

- **Package manager inconsistency in deploy paths:** Root `pnpm-workspace.yaml` + all scripts are `pnpm` (and preinstall hook blocks `npm`). However: (1) root `vercel.json` uses `npm install --ignore-scripts` inside `artifacts/legal-luminaire` subpath; (2) deploy guide documents `npm install` for subdir Netlify fallback. This means lockfile resolution and dependency resolution will differ between the two paths.
- **`--no-frozen-lockfile` forced on Netlify** (`netlify.toml` env `PNPM_FLAGS="--no-frozen-lockfile"`) because Windows-generated `pnpm-lock.yaml` has `ignoredOptionalDependencies` that break Linux builds. This means **Netlify builds are not reproducible** (direct contradiction of ADR-007's CI gate which uses `--frozen-lockfile`).
- **Backend duality confusion:** `RUN.bat` starts `artifacts/api-server` (Node/Express on :8000), but `docker-compose.yml` and `backend/start.*` start the Python/FastAPI backend (also on :8000). Both bind the same port; different stacks. Docs do not clarify which backend to use when.
- **`security-audit.yml` references `requirements-streamlit.txt`** which does not exist in the repo. The Python audit step (`pip-audit -r requirements-streamlit.txt`) will **fail** on every run unless this is removed or the file is added.
- **Port mismatch in frontend Docker healthcheck:** `Dockerfile.frontend.optimized` HEALTHCHECK uses `curl -f http://localhost:5173/`; nginx.conf listens on 5173. This matches, but is an unusual port (Nginx default is 80) — if the conf is modified to 80, healthcheck silently breaks.
- **Netlify CSP allows `ws://localhost:*` (wildcard)** in Content-Security-Policy `connect-src`. This is overly permissive for a production CSP (should scope to specific port or be dev-only via env).
- **Backend `REDIS_URL` default vs compose inconsistency:** `config.py` default: `redis://localhost:6379/0`. `docker-compose.yml` env: `redis://redis:6379/0`. Works because Docker uses service name `redis` as DNS; but if someone runs `python main.py` manually without Redis, it will crash.
- **Backend has no automated test run in CI.** CI runs `python -m compileall` (syntax-only). Backend includes pytest deps in `requirements.txt` and `tests/` directory exists with `conftest.py` + `test_copilot.py`, but CI never runs `pytest`.
- **Frontend `.env.example` missing.** A backend `.env.example` exists, but there is no frontend equivalent documenting the 11+ `VITE_FF_*` flags + `VITE_BACKEND_URL` pattern. Users must read `SystemFlagsPage.tsx` or docs to discover them.
- **`vercel.json` exists in two locations** (root and subdir) with different build commands. Both are valid paths but no documentation clarifies when to use which.
- **No database migration infrastructure present.** Despite the pnpm workspace having `lib/db/` (Drizzle ORM), no CI step or start script runs `drizzle-kit migrate` / `push`.

## Risk Ranking for Infra

1. **🔴 CRITICAL — No release owner, no explicit production rollback owner, and no staging environment.** ADR-007 defines CI gates and frozen `netlify.toml`, and `docs/ROLLBACK_PLAN.md` documents 3 rollback methods (feature flags, git branch revert, full deploy rollback). However, there is no named Release Owner (per `01_roles_and_ownership.md` gap), no on-call rotation, no canary deploy process, and no staging environment for pre-prod validation. A bad merge to `main` auto-deploys to Netlify and the rollback plan assumes manual intervention by a person whose identity is undefined.

2. **🟠 HIGH — Reproducibility gap between CI and Netlify build.** CI uses `pnpm install --frozen-lockfile` (ADR-007 requirement #1). Netlify is forced to use `--no-frozen-lockfile` (via `PNPM_FLAGS` env var) due to Windows vs Linux lockfile platform differences. This means a successful CI pass on a reproducible graph does **not** guarantee Netlify gets the same dependency tree, creating latent "works in CI, breaks in prod" risk.

3. **🟠 HIGH — No monitoring, no backend production deployment path, and partial test coverage in CI.** The "production" deploy target (Netlify) hosts only a static frontend SPA — the FastAPI backend with RAG, multi-agent, and citation verification features has **no documented production deploy path** and **no tests run in CI** (only syntax check). No application monitoring (APM), error tracking (Sentry), uptime checks, or alerting webhooks exist for any environment.
