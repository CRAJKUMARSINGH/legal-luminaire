"""Day 20/21 contract tests — no LLM, no full main:app import."""
from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient
from pydantic import BaseModel

from api.http_errors import register_error_handlers
from api.logging_setup import configure_logging
from api.request_context import RequestIdMiddleware, current_trace_id
from config import Settings


configure_logging()


class EchoIn(BaseModel):
    case_id: str


def _app() -> FastAPI:
    app = FastAPI()
    app.add_middleware(RequestIdMiddleware)
    register_error_handlers(app)

    @app.get("/ping")
    def ping():
        return {"ok": True, "trace_id": current_trace_id()}

    @app.get("/missing")
    def missing():
        raise HTTPException(status_code=404, detail="Case not found")

    @app.post("/echo")
    def echo(body: EchoIn):
        return {"case_id": body.case_id}

    return app


def test_request_id_echoed_from_header():
    client = TestClient(_app())
    res = client.get("/ping", headers={"X-Request-ID": "test-trace-001"})
    assert res.status_code == 200
    assert res.headers["X-Request-ID"] == "test-trace-001"
    assert res.json()["trace_id"] == "test-trace-001"


def test_request_id_generated_when_absent():
    client = TestClient(_app())
    res = client.get("/ping")
    assert res.status_code == 200
    assert res.headers.get("X-Request-ID")
    assert res.json()["trace_id"] == res.headers["X-Request-ID"]


def test_http_exception_uses_error_envelope():
    client = TestClient(_app())
    res = client.get("/missing", headers={"X-Request-ID": "err-1"})
    assert res.status_code == 404
    body = res.json()
    assert body["success"] is False
    assert body["data"] is None
    assert body["error"]["code"] == "NOT_FOUND"
    assert body["error"]["message"] == "Case not found"
    assert body["error"]["trace_id"] == "err-1"
    assert "timestamp" in body["error"]
    assert body["error"]["details"] == []


def test_validation_error_uses_error_envelope():
    client = TestClient(_app())
    res = client.post("/echo", json={})
    assert res.status_code == 400
    body = res.json()
    assert body["error"]["code"] == "VALIDATION_ERROR"
    assert isinstance(body["error"]["details"], list)
    assert len(body["error"]["details"]) >= 1


def test_boot_secrets_pass_when_flag_off():
    s = Settings(ll_require_llm_keys=False, openai_api_key="")
    s.assert_boot_secrets()


def test_boot_secrets_fail_when_flag_on_and_key_missing():
    s = Settings(ll_require_llm_keys=True, openai_api_key="")
    try:
        s.assert_boot_secrets()
    except RuntimeError as exc:
        assert "OPENAI_API_KEY" in str(exc)
    else:
        raise AssertionError("expected RuntimeError")
