# API Authorization Matrix

Middleware: `backend/api/auth.py::auth_middleware` (single choke point).

| Path class | Auth required | Case scoping | Status |
|---|---|---|---|
| `/api/v1/health`, `/api/v1/copilot/health`, `/`, `/docs`, `/openapi.json`, `/redoc` | No (exempt) | n/a | VERIFIED |
| All other `/api/v1/**` | `X-API-Key` in `LL_API_KEY` list | `LL_API_KEY_SCOPES` per-key → else `LL_ALLOWED_CASES` global → else all | VERIFIED (28 auth tests) |
| `/api/v1/cases/{id}/**` | Yes | Per-key scope map, fail-closed; `case01` demo bypass | VERIFIED |
| Case IDs in body/query/job payloads | **Not extracted** — only path param checked | GAP: non-path case references unscoped | NOT VERIFIED |
| WebSocket endpoints | Middleware coverage unclear | NOT VERIFIED | NOT TESTED |
| Background job status/download by ID | Job→case binding unverified | NOT VERIFIED | NOT TESTED |

Known residual: authorization is path-param based; endpoints accepting
case_id in request bodies need audit (follow-up).
