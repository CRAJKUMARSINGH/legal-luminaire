# Week 2 — Day 10 API Contract Standard

> Source: `detailed_recovery_plan.md` Week 2, Day 10. Aligns with `08_architecture_baseline.md` Application Services Layer (FastAPI AI/agent sub-layer + Express CRUD/ops sub-layer).
> Approved by: Architecture Owner (User, default).
> Open question from spec: both surfaces are treated as potentially public. New FastAPI routes use `/api/v1`. Express migrates to `/api/v1` with a documented exception until Day 27+.

---

## 1. Standard request structure

- **Content-Type:** `application/json` for JSON bodies. Multipart `multipart/form-data` only for ingest/upload (`/omni`, case file upload).
- **Charset:** UTF-8.
- **Request ID:** Clients may send `X-Request-ID` (UUID v4 string). If absent, the server generates one and echoes it on the response as `X-Request-ID`. The same value is `error.trace_id` and the log `trace_id` (see `11_logging_and_config_standard.md`).
- **Auth headers:** Not required today (no auth system — Week 1 finding). Do not invent ad-hoc `X-Api-Key` on a single route. Any future auth is a Shared Platform change approved by Architecture Owner + G-3 owner.
- **Collection pagination:** Prefer `limit` (default 20, max 100) and `offset` (default 0) query params. Cursor pagination (`cursor`, `limit`) is allowed for append-only logs; do not mix both styles on one resource.
- **Path params:** `case_id` remains the case identifier string used in the registry (do not invent a second `matterId` on new routes).
- **Idempotency:** POST endpoints that create drafts or trigger LLM work should accept optional `Idempotency-Key` when implemented; until then, clients must not retry blindly without checking the prior response.

---

## 2. Standard response structure

**Canonical envelope (FastAPI, all new routes and all routes touched in Week 3–4 recovery):**

```json
{
  "success": true,
  "data": {},
  "meta": {
    "trace_id": "uuid",
    "timestamp": "2026-09-14T16:00:00Z"
  }
}
```

- Success HTTP 2xx: `success` is `true`; `data` holds the payload (`object`, `array`, or `null`).
- `meta.trace_id` matches `X-Request-ID`.
- `meta.timestamp` is ISO-8601 UTC.
- List endpoints add `meta.limit`, `meta.offset`, `meta.total` when known.
- SSE/streaming endpoints are exempt from the JSON envelope; they must still send `X-Request-ID` on the initial response and include `trace_id` in the first SSE comment or event payload.

**Express api-server current practice:** handlers typically return the resource at the top level (no envelope) with HTTP status as the success signal. That remains an approved exception until **Day 27**. New Express routes written after this document **must** use the same envelope. A compatibility shim may accept both during migration; do not add a third envelope.

**Health endpoints** (`/api/v1/health`, Express `/health`) may return a small object `{ "status": "ok" }` without the full envelope. They must still set `X-Request-ID`.

---

## 3. Standard error format

Failed responses (4xx/5xx) use HTTP status **and** this JSON body (FastAPI immediately for recovered modules; Express by Day 27):

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "CASE_NOT_FOUND",
    "message": "Case TC-01 was not found.",
    "details": [],
    "trace_id": "uuid",
    "timestamp": "2026-09-14T16:00:00Z"
  },
  "meta": {
    "trace_id": "uuid",
    "timestamp": "2026-09-14T16:00:00Z"
  }
}
```

Required `error.` fields:

| Field | Purpose |
|-------|---------|
| `error.code` | Machine-readable uppercase snake, stable for clients |
| `error.message` | Human-readable; English first; i18n-ready (no concatenated exception traces) |
| `error.details` | Array of field errors `{ "field": "case_id", "issue": "required" }` or empty array |
| `error.trace_id` | Same as `X-Request-ID` / log `trace_id` |
| `error.timestamp` | ISO-8601 UTC |

Do not return a bare string as FastAPI `HTTPException.detail`. Do not return an untyped dict without `code` and `message`. Existing string-detail routes are known drift (Day 7 §4); they change when that router is in a recovery PR.

### HTTP status mapping

| HTTP | When | Example `error.code` |
|------|------|----------------------|
| 400 | Entry validation failed | `VALIDATION_ERROR` |
| 404 | Resource missing | `CASE_NOT_FOUND`, `ROUTE_NOT_FOUND` |
| 409 | Conflict / registry mismatch | `REGISTRY_CONFLICT` |
| 413 | Upload too large | `PAYLOAD_TOO_LARGE` |
| 415 | Unsupported media type | `UNSUPPORTED_MEDIA_TYPE` |
| 429 | Rate limit | `RATE_LIMITED` |
| 500 | Unexpected server failure | `INTERNAL_ERROR` |
| 502 / 503 | Downstream LLM, Neo4j, Redis, Chroma unavailable | `UPSTREAM_UNAVAILABLE` |
| 501 | Not implemented / flag off | `NOT_IMPLEMENTED` |

LLM refusals that are product behavior (citation-or-refuse) are **200** with `data.refused: true`, not 500.

---

## 4. Versioning expectations

- **New FastAPI routes:** prefix `/api/v1/...`. Include via `app.include_router(..., prefix="/api/v1")` unless the router already embeds that prefix once (do not double-prefix).
- **Existing FastAPI routes** without `/api/v1` (several routers use `/api` or bare paths): known exception; do not mass-rename in this recovery month. New endpoints on those routers still add `/api/v1` when adding a new router file.
- **Express:** target `/api/v1/...` for new routes. Existing `/health`, `/cases`, `/drafts` without `/v1` remain until Day 27. Do not introduce `/express/v1` — that would be a third public prefix. Path-based split between FastAPI and Express is an ops/nginx concern (EXC-1), not a URL-product split.
- **Breaking changes:** add a new path or a new field; do not reuse a field with a new meaning. Removing a field requires Architecture Owner approval and a changelog note.

---

## 5. Validation boundaries

| Layer | Where | What is validated | On failure |
|-------|-------|-------------------|------------|
| **Entry** | FastAPI route + Pydantic DTO; Express route + schema (zod or equivalent) | Types, required fields, `limit`/`offset` ranges, upload MIME and size | HTTP 400 `VALIDATION_ERROR` with `error.details` |
| **Domain** | `agents/`, `services/`, `drafting/` | Legal/business rules (limitation dates, variant chain preconditions, citation-or-refuse) | Raise a domain error; route translates to 400/409/200-refused. Do not raise `HTTPException` inside agents. |
| **Persistence** | Registry JSON schema, Chroma/SQLite constraints, filesystem path safety | IDs exist, no path traversal, schema parity Python↔TS | 404 / 409 / 500 `REGISTRY_CONFLICT` or `INTERNAL_ERROR` |

Escalation: entry errors never reach the LLM. Domain errors never leak stack traces in `error.message`. Persistence errors log the exception at ERROR with `trace_id`; clients see `INTERNAL_ERROR` unless the case is a clean 404.

---

## 6. How contracts are documented

- **FastAPI:** OpenAPI from route signatures and Pydantic models. Keep docstrings on each route (summary + error codes). Publish the OpenAPI URL in the backend README when the server runs (`/docs`, `/openapi.json`).
- **Express:** Until OpenAPI exists, each route file starts with a comment block: method, path, request fields, response envelope, error codes. Day 27 review decides whether to generate OpenAPI for Express or freeze CRUD and document only FastAPI.
- **Frontend clients:** `src/lib/*-client.ts` is the contract consumer. Do not scatter raw `fetch` in pages for new endpoints.
- **Handbook + README:** link this file and the running `/docs` URL. Do not keep a third handwritten endpoint list that can drift.

---

## 7. Exit check

Two teams implementing adjacent services produce compatible interfaces if they use the envelope, the five `error.*` fields, `/api/v1` for new FastAPI work, and the three validation layers. Express remaining unenveloped is dated (Day 27), not open-ended.
