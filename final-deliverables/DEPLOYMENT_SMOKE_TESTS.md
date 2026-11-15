# DEPLOYMENT SMOKE TESTS
**Guide 1 §6 — Staging Smoke Test Specification**  
**Date:** 2026-11-15

This document specifies the smoke tests that MUST pass on a live deployed instance
before the release candidate is promoted. Commands are illustrative; adjust URLs and
credentials for the actual deployment environment.

---

## Pre-conditions

- Frontend deployed to Netlify (or equivalent) at a known HTTPS URL
- Backend running with `LL_API_KEY`, `APP_ENV=production`, `OPENAI_API_KEY` set
- `CORS_ORIGINS` explicitly set to the frontend URL (no `*`)

---

## 1. Health check

```bash
curl -sf https://BACKEND_URL/api/v1/health | python -m json.tool
# Expected: {"status": "ok", "openai_configured": true, ...}
```

**Gate:** Returns 200. `openai_configured` is true.

## 2. Unauthenticated request blocked

```bash
curl -sf -o /dev/null -w "%{http_code}" https://BACKEND_URL/api/v1/cases
# Expected: 401
```

**Gate:** Returns 401 when `LL_API_KEY` is set and no header is provided.

## 3. Invalid key rejected

```bash
curl -sf -o /dev/null -w "%{http_code}" \
  -H "X-API-Key: wrong-key" \
  https://BACKEND_URL/api/v1/cases
# Expected: 403
```

## 4. Valid key accepted

```bash
curl -sf -H "X-API-Key: $LL_API_KEY" https://BACKEND_URL/api/v1/cases
# Expected: 200
```

## 5. SPA deep-link refresh

```bash
curl -sf -o /dev/null -w "%{http_code}" https://FRONTEND_URL/case/TC-01/dashboard
# Expected: 200 (Netlify SPA redirect serves index.html)
```

**Gate:** Returns 200. SPA routing handles the path client-side.

## 6. Security headers present

```bash
curl -sI https://FRONTEND_URL/ | grep -E "X-Frame|X-Content|Content-Security|Strict-Transport|Permissions-Policy"
# Expected: all five headers present
```

## 7. CORS wildcard not present in production

```bash
curl -sI -H "Origin: https://evil.example.com" https://BACKEND_URL/api/v1/health | grep -i "access-control-allow-origin"
# Expected: header absent OR value is the specific frontend URL, NOT *
```

## 8. Citation gate rejects PENDING citation

```bash
curl -sf -X POST -H "Content-Type: application/json" \
  -H "X-API-Key: $LL_API_KEY" \
  -d '{"citations": ["(2003) 4 GLR 3121"]}' \
  https://BACKEND_URL/api/v1/verify-citations | python -m json.tool
# Expected: results[0].tier = "PENDING", results[0].blocked = true, export_safe = false
```

## 9. No secrets in JS bundle

```bash
curl -sf https://FRONTEND_URL/assets/index-*.js | grep -c "LL_API_KEY"
# Expected: 0
```

## 10. Backend does not expose admin/debug endpoints

```bash
curl -sf -o /dev/null -w "%{http_code}" https://BACKEND_URL/admin
curl -sf -o /dev/null -w "%{http_code}" https://BACKEND_URL/debug
# Expected: 404 or 422 (not 200)
```

---

## Status

**NOT YET RUN** — no live deployment URL was available at audit time.  
These tests must be run and results recorded with:
- Exact deployment URL
- Deployment SHA (must match `010b7a7`)
- Timestamp
- Exit codes and response bodies

Do not declare production-ready until all 10 gates pass on a deployed instance.
