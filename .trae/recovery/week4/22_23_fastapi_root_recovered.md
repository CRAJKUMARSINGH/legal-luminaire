# Week 4 — Days 22–23: FastAPI root recovered

> Target 1 from `14_recovery_targets.md`. Owner: User (interim G-3). Review: Day 27 / Day 30.

## Module boundary

| In | Out |
|----|-----|
| `backend/main.py` — composition root only | Prompts, RAG, CrewAI, drafting templates |
| `backend/config.py` — env + `assert_boot_secrets` | Route handlers |
| `backend/api/logging_setup.py`, `request_context.py`, `http_errors.py`, `rate_limit.py` | Domain agents |
| Lifespan: mkdir chroma/docs, optional Case01 preload | Request-path `print()` |

Callers: `start.bat` / `start.sh` / Docker `uvicorn main:app`. Downstream: included routers only.

## Cleanup (part 1 + 2)

- `_check*.py` / `_inspect*.py` moved to `backend/scripts/` (not imported by `main.py`).
- Rate limiter extracted from `main.py` to `api/rate_limit.py` (testable without agents).
- Health extracted to `api/routes_health.py`.
- Logging + `X-Request-ID` + envelope handlers remain on the app.
- `start.bat` and `start.sh` both run `python -m uvicorn main:app --reload`.
- `LL_REQUIRE_LLM_KEYS` fail-fast (default false).

## Hidden coupling kept

- Lifespan still imports `preload_case01` when OpenAI is set (RAG write at boot).
- CORS `allow_origins` from settings; still no auth (Day 7 §7).
- Dual backend EXC-1 unchanged.

## Tests

`test_http_contract.py`, `test_rate_limit.py`, `test_health_route.py` (CI).

## Unresolved

- Empty-string LLM keys still boot unless `LL_REQUIRE_LLM_KEYS=true`.
- Uvicorn access log is a second format.
- JSON one-line logs not shipped.

## Exit check

The composition root is thinner than before: middleware + includes + lifespan. Debug CLIs are off the request path.
