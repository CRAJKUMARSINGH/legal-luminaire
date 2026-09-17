"""Canonical HTTP error envelope (Day 10 / Day 20)."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from api.request_context import current_trace_id

# error.code values used by recovered modules
VALIDATION_ERROR = "VALIDATION_ERROR"
RATE_LIMITED = "RATE_LIMITED"
INTERNAL_ERROR = "INTERNAL_ERROR"
NOT_FOUND = "NOT_FOUND"
HTTP_GENERIC = "HTTP_ERROR"
UPSTREAM_UNAVAILABLE = "UPSTREAM_UNAVAILABLE"


def _utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def error_body(
    *,
    code: str,
    message: str,
    status_code: int,
    details: list[dict[str, Any]] | None = None,
    trace_id: str | None = None,
) -> dict[str, Any]:
    tid = trace_id or current_trace_id()
    ts = _utc_now()
    return {
        "success": False,
        "data": None,
        "error": {
            "code": code,
            "message": message,
            "details": details or [],
            "trace_id": tid,
            "timestamp": ts,
        },
        "meta": {
            "trace_id": tid,
            "timestamp": ts,
        },
    }


def error_response(
    status_code: int,
    *,
    code: str,
    message: str,
    details: list[dict[str, Any]] | None = None,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content=error_body(code=code, message=message, status_code=status_code, details=details),
        headers=headers,
    )


def _code_for_status(status_code: int) -> str:
    if status_code == 404:
        return NOT_FOUND
    if status_code == 422 or status_code == 400:
        return VALIDATION_ERROR
    if status_code == 429:
        return RATE_LIMITED
    if status_code == 503:
        return UPSTREAM_UNAVAILABLE
    if status_code >= 500:
        return INTERNAL_ERROR
    return HTTP_GENERIC


def _message_from_detail(detail: Any) -> tuple[str, list[dict[str, Any]]]:
    if isinstance(detail, str):
        return detail, []
    if isinstance(detail, dict):
        code_msg = detail.get("message") or detail.get("detail") or str(detail)
        return str(code_msg), [{"field": k, "issue": str(v)} for k, v in detail.items() if k not in ("message", "code")]
    if isinstance(detail, list):
        details = []
        for item in detail:
            if isinstance(item, dict):
                loc = ".".join(str(p) for p in item.get("loc", []) if p != "body")
                details.append({"field": loc or "body", "issue": str(item.get("msg", item))})
            else:
                details.append({"field": "body", "issue": str(item)})
        return "Request validation failed.", details
    return str(detail), []


def abort(status_code: int, message: str, *, code: str | None = None) -> None:
    """Raise HTTPException in envelope-friendly dict form. Routes must not raise bare strings."""
    resolved = code or _code_for_status(status_code)
    raise HTTPException(status_code=status_code, detail={"code": resolved, "message": message})


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def http_exception_handler(_request: Request, exc: HTTPException) -> JSONResponse:
        message, details = _message_from_detail(exc.detail)
        code = HTTP_GENERIC
        if isinstance(exc.detail, dict) and isinstance(exc.detail.get("code"), str):
            code = exc.detail["code"]
        else:
            code = _code_for_status(exc.status_code)
        return error_response(
            exc.status_code,
            code=code,
            message=message,
            details=details,
            headers=dict(exc.headers or {}),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(_request: Request, exc: RequestValidationError) -> JSONResponse:
        message, details = _message_from_detail(exc.errors())
        return error_response(400, code=VALIDATION_ERROR, message=message, details=details)
