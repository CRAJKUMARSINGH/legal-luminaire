# Week 2 — Day 11 Logging and Configuration Standard

> Source: `detailed_recovery_plan.md` Week 2, Day 11. Aligns with `08_architecture_baseline.md` call directions and `05_infrastructure_inventory.md`.
> Approved by: Architecture Owner (User, default). G-3 (Auth/Config) remains interim User.

This standard exists in part to close the Week 1 finding that **backend keys default to empty string**, so the process boots and fails later on the first LLM call instead of at startup.

---

## 1. Required log fields

Every application log line (FastAPI named logger, Express Pino, future SPA error reporter) must include:

| Field | Rule |
|-------|------|
| `timestamp` | ISO-8601 UTC |
| `level` | One of DEBUG, INFO, WARNING, ERROR, CRITICAL |
| `message` | Short event text; no secrets |
| `trace_id` | Request correlation ID (same as `X-Request-ID`) |
| `module` | Logger name (`backend.api.routes_drafting`, `api-server.routes.cases`) |

Add when the context exists:

| Field | Rule |
|-------|------|
| `case_id` | Registry case id |
| `user_id` | Reserved; omit until auth exists (do not invent a fake user) |
| `route` | HTTP method + path template |
| `status_code` | On request completion |

FastAPI target format (JSON one object per line in recovered modules). Until a JSON formatter lands, a key=value text line that contains all required fields is acceptable: `timestamp=... level=INFO module=... trace_id=... message=...`.

Uvicorn access logs remain a second stream (Day 7 inconsistency). Recovered modules must still emit the application log with `trace_id` so operators can join the two streams.

---

## 2. Log levels

| Level | When to use |
|-------|-------------|
| DEBUG | Local diagnosis: payload shapes, prompt token counts **without** prompt text or document bodies |
| INFO | Normal successful operations: request start/end, draft generated, cache hit/miss |
| WARNING | Recoverable degradation: Redis down so cache skipped, Neo4j fallback to networkx, missing optional TC folder |
| ERROR | Request failed; include `trace_id` and exception type; not the API key |
| CRITICAL | Process cannot continue: failed boot validation, disk full, Chroma unopenable at startup |

Do not log at INFO on every token of an SSE stream. Do not use `print()` or `console.log` on the request path in recovered modules (scripts under `scripts/` and `_check*.py` remain noisy until deleted).

---

## 3. Correlation / request ID behavior

1. Edge (FastAPI middleware and Express middleware): read `X-Request-ID`. If missing or not a 1–128 char token, generate UUID v4.
2. Set response header `X-Request-ID` to that value.
3. Bind `trace_id` on the logging context for the request lifetime (contextvars in Python; Pino child logger in Express).
4. Downstream: agents, RAG, drafting functions accept `trace_id` as an argument or read the contextvar. Every log line inside the call includes it.
5. Frontend: when a shared `fetch` wrapper exists, send `X-Request-ID` and surface it on error toasts. Until that wrapper exists, backend-generated IDs still appear on responses. Do not generate a second unrelated ID in the page.

SSE: send `trace_id` on the HTTP response and in the first event.

---

## 4. Where configuration is loaded from

| Runtime | Source (later entries override earlier only if the platform documents that; do not invent extra files) |
|---------|--------------------------------------------------------------------------------------------------------|
| Frontend Vite | Defaults in code → `.env` / `.env.local` via `import.meta.env` → Netlify/Vercel env UI for production |
| FastAPI | `config.py` Pydantic `BaseSettings` with `env_file=.env` → process environment → Compose `environment:` → platform env UI |
| Express | `process.env` plus documented `.env` for local; no secrets in `src/` |
| Docker Compose | `environment:` and `env_file:` on the service |
| Netlify / Vercel / Replit | Platform env vars UI |

`REDIS_URL` default in `config.py` (`localhost`) vs Compose (`redis://redis:6379/0`) is a known mismatch (Day 7). Local-without-Compose must treat Redis as optional (WARNING, continue). Compose must set `REDIS_URL` explicitly.

Frontend must ship `.env.example` listing every `VITE_*` key (Week 1 gap). Backend already has `backend/.env.example`; it must match `Settings` field names (required vs optional).

Package manager for installs remains **pnpm** in-repo. Do not add a new env that switches to npm except the existing Vercel exception (documented in infra inventory).

---

## 5. How env vars are validated

**FastAPI:** Required secrets and URLs use Pydantic `Field(min_length=1)` (or equivalent constraint) so **boot fails** if they are missing. Do not default `openai_api_key`, `google_api_key`, or other LLM keys to `""`. Optional integrations (Neo4j, Redis, Harvey) may be optional **fields** with `None` default, not empty string, and code must branch on `None`.

**Frontend:** One boot-time schema (zod or equivalent) in `config/` validates `VITE_BACKEND_URL` and known `VITE_FF_*` flags. Missing backend URL in production is a boot error; in local dev it may default to `http://localhost:8000` and log WARNING.

**Express:** Startup checks required env against a documented list; missing required keys `process.exit(1)` with a message that does not print other secrets.

Empty-string defaults in `config.py` are the problem this section forbids for **required** keys. Changing `config.py` is Week 3–4 work on the FastAPI root recovery target; this document is the rule those PRs must follow.

---

## 6. How secrets are referenced without hardcoding

- Secrets exist only in env vars / platform secret stores / local `.env` (gitignored).
- Names use suffixes `_KEY`, `_SECRET`, `_TOKEN`, `_PASSWORD`.
- Never commit live values. `.env.example` uses empty placeholders.
- Log formatters **redact** any field whose name matches those suffixes and any string that looks like `sk-` / bearer tokens.
- Do not interpolate secrets into URLs that get logged.
- Do not put keys in `featureFlags.ts`, client bundles, or README screenshots.

CORS `allow_origins=["*"]` is not a secret issue; it is an auth/session issue (Day 7 §7) and stays until G-3 work — do not "fix" it inside a logging PR.

---

## 7. Relationship to Week 1 infra findings

| Finding | This standard's rule |
|---------|----------------------|
| `config.py` defaults keys to `""` | Required keys fail boot (`Field(min_length=1)` / no empty default) |
| `.env.example` marks keys required while Settings does not | Settings and `.env.example` must agree |
| `start.bat` vs `start.sh` different servers/log formats | Prefer `uvicorn` on both; application JSON/kv logs still required |
| Express Pino JSON vs FastAPI text | FastAPI recovered modules move toward JSON lines with the same field names as Pino |
| `print()` in preload/seed scripts | Allowed in `scripts/`; forbidden on request path in recovered modules |
| No frontend `.env.example` | Add it; do not discover flags only via `SystemFlagsPage` |
| CI does not run pytest | Out of scope here; Week 3 Day 15. Logging still required so when pytest runs, assertions can inspect `trace_id` |

---

## 8. Exit check

The team knows where config comes from (table in §4) and how logs are written (§1–§3). Missing required LLM keys fail at startup, not on the first `/ai-draft` call.
