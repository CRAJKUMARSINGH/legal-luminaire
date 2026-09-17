# Week 3 — Day 21 Logging Migration Example

> Source: `detailed_recovery_plan.md` Day 21. Standard: `11_logging_and_config_standard.md`.

## Mandatory metadata

Application logs use: `timestamp`, `level`, `name` (module), `trace_id`, `message`.

Format (FastAPI recovered path):

```
%(asctime)s [%(levelname)s] %(name)s trace_id=%(trace_id)s %(message)s
```

Implemented in `api/logging_setup.py` + `TraceIdFilter`. `trace_id` comes from `X-Request-ID` via `RequestIdMiddleware`.

## What changed

- `main.py` calls `configure_logging()` instead of ad-hoc `basicConfig`.
- Every HTTP response gets `X-Request-ID`.
- Lifespan still logs whether OpenAI/Tavily are configured (**booleans only**, no key material).
- `LL_REQUIRE_LLM_KEYS` (default false) can fail boot when keys are missing.

## Noise

Do not log SSE token bodies. Seed/preload `print()` remains in `scripts/` and `preload_case01.py` (not request path). Uvicorn access log is still a second stream.

## Dashboards

There is no log aggregator (Week 1 infra). Local/CI grep on `trace_id=` is the operational search until G-4 adds a shipper.

## Exit check

A client can send `X-Request-ID` and find the same id on the response and in the error envelope.
