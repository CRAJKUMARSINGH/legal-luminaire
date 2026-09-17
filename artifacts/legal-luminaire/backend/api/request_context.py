"""Request correlation (Day 11 / Day 21)."""
from __future__ import annotations

import uuid
from contextvars import ContextVar

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

trace_id_var: ContextVar[str] = ContextVar("trace_id", default="-")

HEADER_NAME = "X-Request-ID"


def current_trace_id() -> str:
    return trace_id_var.get("-")


def _normalize_request_id(raw: str | None) -> str:
    if raw is None:
        return str(uuid.uuid4())
    value = raw.strip()
    if not value or len(value) > 128:
        return str(uuid.uuid4())
    return value


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        rid = _normalize_request_id(request.headers.get(HEADER_NAME))
        token = trace_id_var.set(rid)
        try:
            response = await call_next(request)
            response.headers[HEADER_NAME] = rid
            return response
        finally:
            trace_id_var.reset(token)
