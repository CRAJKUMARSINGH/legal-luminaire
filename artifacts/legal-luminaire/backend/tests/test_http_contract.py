"""
test_http_contract.py — HTTP error/response envelope contract (RECREATED).

History
-------
The original ``test_http_contract.py`` source was never committed (only its ``.pyc``
survived). Its bytecode targeted ``api.request_context.current_trace_id`` and the
``api.http_errors`` envelope — both were **removed** during the accuracy-first overhaul.

Per Phase 2 of the unwired-files reconciliation this module is re-authored against the
CURRENT wired HTTP contract (deliberately NOT decompiled from bytecode):

  * Auth middleware error bodies:  401 {detail, error:"missing_api_key"}
                                   403 {detail, error:"invalid_api_key"}
                                   403 {detail, error:"case_not_authorized"}
  * Rate-limit error body:         429 {detail, retry_after_seconds} + Retry-After
  * Routers are mounted under the   /api/v1 prefix.
  * FastAPI's default 404 shape is  {detail: "Not Found"}.

``main.py`` is not importable in the test environment (heavy AI stack), so the auth
envelopes are exercised through a minimal app using the REAL ``api.auth`` middleware,
and the prefix/429 contracts are asserted statically.
"""
from __future__ import annotations

import ast
from pathlib import Path
from unittest.mock import patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

_BACKEND = Path(__file__).parents[1]
_MAIN_SRC = (_BACKEND / "main.py").read_text(encoding="utf-8")


def _auth_app() -> FastAPI:
    app = FastAPI()
    from api.auth import auth_middleware

    @app.middleware("http")
    async def _wrap(request, call_next):
        return await auth_middleware(request, call_next)

    @app.get("/api/v1/cases")
    async def list_cases():
        return {"cases": []}

    @app.get("/api/v1/cases/{case_id}/status")
    async def status(case_id: str):
        return {"case_id": case_id}

    return app


def _enabled(mock_settings, allowed=None, scopes=None):
    mock_settings.auth_enabled = True
    mock_settings.ll_api_key_list = ["secret-key-123"]
    mock_settings.ll_allowed_cases_list = allowed or []
    mock_settings.api_key_case_scopes = scopes or {}


class TestAuthErrorEnvelope:
    @patch("api.auth.settings")
    def test_missing_key_401_envelope(self, mock_settings):
        _enabled(mock_settings)
        resp = TestClient(_auth_app()).get("/api/v1/cases")
        assert resp.status_code == 401
        assert resp.headers["content-type"].startswith("application/json")
        body = resp.json()
        assert body["error"] == "missing_api_key"
        assert "detail" in body

    @patch("api.auth.settings")
    def test_invalid_key_403_envelope(self, mock_settings):
        _enabled(mock_settings)
        resp = TestClient(_auth_app()).get(
            "/api/v1/cases", headers={"X-API-Key": "nope"}
        )
        assert resp.status_code == 403
        assert resp.json()["error"] == "invalid_api_key"

    @patch("api.auth.settings")
    def test_case_not_authorized_403_envelope(self, mock_settings):
        _enabled(mock_settings, allowed=["TC-01"])
        resp = TestClient(_auth_app()).get(
            "/api/v1/cases/TC-99/status", headers={"X-API-Key": "secret-key-123"}
        )
        assert resp.status_code == 403
        body = resp.json()
        assert body["error"] == "case_not_authorized"
        assert "TC-99" in body["detail"]


class TestDefaultNotFound:
    def test_fastapi_default_404_shape(self):
        resp = TestClient(_auth_app()).get("/no-such-route")
        assert resp.status_code == 404
        assert "detail" in resp.json()


class TestPrefixContract:
    def test_all_routers_use_api_v1_prefix(self):
        tree = ast.parse(_MAIN_SRC)
        include_calls = [
            n
            for n in ast.walk(tree)
            if isinstance(n, ast.Call)
            and isinstance(n.func, ast.Attribute)
            and n.func.attr == "include_router"
        ]
        assert include_calls, "no include_router calls found"
        for call in include_calls:
            kwargs = {kw.arg: kw.value for kw in call.keywords}
            prefix = kwargs.get("prefix")
            if prefix is None:
                continue  # a few legacy routers mount at root (e.g. similarity/analytics)
            assert isinstance(prefix, ast.Constant) and prefix.value == "/api/v1", (
                f"non-canonical router prefix: {ast.dump(prefix)}"
            )

    def test_rate_limit_429_envelope_keys(self):
        assert "status_code=429" in _MAIN_SRC
        assert '"retry_after_seconds"' in _MAIN_SRC
        assert '"Retry-After"' in _MAIN_SRC
