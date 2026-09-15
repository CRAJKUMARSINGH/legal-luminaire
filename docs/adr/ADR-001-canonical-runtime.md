# ADR-001: Canonical runtime

- **Status:** Accepted
- **Date:** 2026-09-15

## Decision

Legal Luminaire is one product with one canonical web application and one
canonical API:

- Web application: `artifacts/legal-luminaire`
- API: `artifacts/legal-luminaire/backend`
- API prefix: `/api/v1`
- Package manager: `pnpm`

The Express service in `artifacts/api-server`, the mockup sandbox, generated
outputs, and research daemons are not part of the production runtime. They may
remain in the repository temporarily, but they must not be treated as
alternative product backends.

## Consequences

- New frontend network calls must use the canonical API client.
- New product endpoints belong to the FastAPI service.
- Experimental and historical work must be explicitly marked and must not
  silently become a second runtime path.
- A later repository-layout migration may move the canonical web and API
  directories out of `artifacts/`; that move is intentionally separate from
  this runtime decision.