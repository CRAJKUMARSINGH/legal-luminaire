# Week 3 — Day 20 Error Handling Standard (applied)

> Source: `detailed_recovery_plan.md` Day 20. Contract: `10_api_contract_standard.md`.

## Canonical categories

| `error.code` | HTTP | Meaning |
|--------------|------|---------|
| `VALIDATION_ERROR` | 400 | Entry DTO failed |
| `NOT_FOUND` | 404 | Missing resource |
| `RATE_LIMITED` | 429 | Expensive-route limiter |
| `HTTP_ERROR` | other 4xx | Generic HTTPException |
| `INTERNAL_ERROR` | 5xx | Unexpected (not yet a global handler) |

Fields: `error.code`, `error.message`, `error.details`, `error.trace_id`, `error.timestamp`.

## Representation across boundaries

- FastAPI `HTTPException` and request validation now convert to the envelope via `api/http_errors.py` (`register_error_handlers`).
- Rate limiter in `main.py` returns the same envelope (`RATE_LIMITED`).
- Health success remains `HealthResponse` without envelope (Day 10 health exception).
- Express stays unenveloped until Day 27 (EXC-1).

Translation happens **only** in Application Services (handlers + exception handlers). Agents must not raise `HTTPException`.

## First modules updated

- `backend/api/http_errors.py` (new)
- `backend/main.py` (handlers + 429)
- `backend/tests/test_http_contract.py`

Existing routers that still raise `HTTPException(detail="string")` now emit the envelope automatically. Routers that pass a dict `detail` keep `detail.code` if present.

## Exit check

A 404 from a recovered FastAPI route is not a bare string; it is the envelope with `trace_id`.
