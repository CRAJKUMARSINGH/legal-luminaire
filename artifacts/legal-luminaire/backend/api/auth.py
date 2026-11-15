"""
Backend authentication and authorization middleware.

When LL_API_KEY is set (non-empty), all non-health endpoints require an
X-API-Key header matching one of the accepted keys.  When LL_API_KEY is empty
(development mode), auth is DISABLED and all requests pass through — backward
compatible with existing local-dev workflows.

Case-level authorization: when LL_ALLOWED_CASES is set, the API key may only
access the specified case IDs.  An empty LL_ALLOWED_CASES means all cases are
accessible (backward compatible).

Endpoints exempt from authentication:
  GET  /api/v1/health
  GET  /api/v1/copilot/health
  GET  /                      (root info)
  GET  /docs                  (OpenAPI swagger)
  GET  /openapi.json          (OpenAPI schema)
  GET  /redoc                 (ReDoc docs)
"""
from __future__ import annotations

import logging
import re
from typing import Optional

from fastapi import Request
from fastapi.responses import JSONResponse

from config import settings

logger = logging.getLogger(__name__)

# ── Paths exempt from authentication ───────────────────────────────────────────
# These are read-only, non-sensitive endpoints that must always be reachable
# for health checks and API discovery.
_EXEMPT_PATHS: set[str] = {
    "/",
    "/docs",
    "/openapi.json",
    "/redoc",
    "/api/v1/health",
    "/api/v1/copilot/health",
}

# Regex to extract case_id from path parameters like /api/v1/cases/TC-01/upload
_CASE_ID_PATTERN = re.compile(r"/api/v1/cases/([^/]+)")


def _extract_case_id(path: str) -> Optional[str]:
    """Extract case_id from a path like /api/v1/cases/TC-01/upload."""
    match = _CASE_ID_PATTERN.search(path)
    return match.group(1) if match else None


def _is_exempt(path: str) -> bool:
    """Check if a path is exempt from authentication."""
    # Exact match
    if path in _EXEMPT_PATHS:
        return True
    # Prefix match for docs/redoc static assets
    if path.startswith("/docs") or path.startswith("/redoc"):
        return True
    return False


async def auth_middleware(request: Request, call_next):
    """
    FastAPI middleware: enforce API key authentication.

    When auth is disabled (LL_API_KEY empty), all requests pass through.
    When auth is enabled:
      - Exempt paths (health, docs) pass without a key.
      - All other paths require X-API-Key matching an accepted key.
      - Case-level authorization: if LL_ALLOWED_CASES is set, the case_id in
        the path must be in the allowed list.
    """
    if not settings.auth_enabled:
        # Development mode — auth disabled (backward compatible)
        return await call_next(request)

    path = request.url.path

    # Exempt paths don't need authentication
    if _is_exempt(path):
        return await call_next(request)

    # Extract the API key from the header
    api_key = request.headers.get("X-API-Key", "")

    # Validate the API key
    if not api_key:
        logger.warning(
            "AUTH: missing X-API-Key header on %s %s",
            request.method, path,
        )
        return JSONResponse(
            status_code=401,
            content={
                "detail": "Authentication required. Provide X-API-Key header.",
                "error": "missing_api_key",
            },
        )

    if api_key not in settings.ll_api_key_list:
        logger.warning(
            "AUTH: invalid API key on %s %s (key prefix: %s...)",
            request.method, path, api_key[:8],
        )
        return JSONResponse(
            status_code=403,
            content={
                "detail": "Invalid API key.",
                "error": "invalid_api_key",
            },
        )

    # Case-level authorization: check if the requested case is allowed
    case_id = _extract_case_id(path)
    if case_id and settings.ll_allowed_cases_list:
        # Special case: "case01" is always allowed (demo case)
        if case_id not in settings.ll_allowed_cases_list and case_id != "case01":
            logger.warning(
                "AUTH: API key not authorized for case '%s' on %s %s",
                case_id, request.method, path,
            )
            return JSONResponse(
                status_code=403,
                content={
                    "detail": f"Not authorized to access case '{case_id}'.",
                    "error": "case_not_authorized",
                },
            )

    # Auth passed — attach the validated key to request state for audit logging
    request.state.api_key_validated = True
    return await call_next(request)
