"""
Backend authentication and authorization tests — P2.

Tests the full authentication matrix:
  - Development mode (auth disabled): all requests pass
  - Production mode (auth enabled):
    - Anonymous (no key) → 401
    - Invalid key → 403
    - Valid key → 200
    - Health endpoint exempt → 200 without key
    - Case-level authorization: unauthorized case → 403
    - Case-level authorization: authorized case → 200
    - Auth cannot be bypassed via different paths

Uses a minimal FastAPI test app to avoid requiring OPENAI_API_KEY or ChromaDB.
"""
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock


def _build_test_app() -> FastAPI:
    """Build a minimal FastAPI app with the auth middleware and a few test routes."""
    app = FastAPI()
    from api.auth import auth_middleware

    @app.middleware("http")
    async def _wrap(request, call_next):
        return await auth_middleware(request, call_next)

    @app.get("/api/v1/health")
    async def health():
        return {"status": "ok"}

    @app.get("/api/v1/copilot/health")
    async def copilot_health():
        return {"flag": "on"}

    @app.post("/api/v1/cases/{case_id}/upload")
    async def upload(case_id: str):
        return {"case_id": case_id, "uploaded": True}

    @app.get("/api/v1/cases/{case_id}/status")
    async def status(case_id: str):
        return {"case_id": case_id, "status": "ok"}

    @app.post("/api/v1/cases/{case_id}/research")
    async def research(case_id: str):
        return {"case_id": case_id, "job_id": "test-123"}

    @app.get("/api/v1/cases")
    async def list_cases():
        return {"cases": []}

    @app.post("/api/v1/cases")
    async def create_case():
        return {"created": True}

    @app.delete("/api/v1/cases/{case_id}")
    async def delete_case(case_id: str):
        return {"deleted": case_id}

    return app


# ── Development mode (auth disabled) ──────────────────────────────────────────

class TestAuthDisabled:
    """When LL_API_KEY is empty, auth is disabled — backward compatible."""

    @patch("api.auth.settings")
    def test_no_key_needed_when_auth_disabled(self, mock_settings):
        mock_settings.auth_enabled = False
        app = _build_test_app()
        client = TestClient(app)

        resp = client.get("/api/v1/cases")
        assert resp.status_code == 200

    @patch("api.auth.settings")
    def test_health_accessible_without_key_when_disabled(self, mock_settings):
        mock_settings.auth_enabled = False
        app = _build_test_app()
        client = TestClient(app)

        resp = client.get("/api/v1/health")
        assert resp.status_code == 200


# ── Production mode (auth enabled) ────────────────────────────────────────────

class TestAuthEnabled:
    """When LL_API_KEY is set, all non-health endpoints require authentication."""

    @patch("api.auth.settings")
    def test_anonymous_request_rejected_401(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = []
        app = _build_test_app()
        client = TestClient(app)

        resp = client.get("/api/v1/cases")
        assert resp.status_code == 401
        assert resp.json()["error"] == "missing_api_key"

    @patch("api.auth.settings")
    def test_invalid_key_rejected_403(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = []
        app = _build_test_app()
        client = TestClient(app)

        resp = client.get("/api/v1/cases", headers={"X-API-Key": "wrong-key"})
        assert resp.status_code == 403
        assert resp.json()["error"] == "invalid_api_key"

    @patch("api.auth.settings")
    def test_valid_key_accepted_200(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = []
        app = _build_test_app()
        client = TestClient(app)

        resp = client.get("/api/v1/cases", headers={"X-API-Key": "secret-key-123"})
        assert resp.status_code == 200

    @patch("api.auth.settings")
    def test_health_exempt_from_auth(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = []
        app = _build_test_app()
        client = TestClient(app)

        # Health should work without a key
        resp = client.get("/api/v1/health")
        assert resp.status_code == 200

    @patch("api.auth.settings")
    def test_copilot_health_exempt_from_auth(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = []
        app = _build_test_app()
        client = TestClient(app)

        resp = client.get("/api/v1/copilot/health")
        assert resp.status_code == 200

    @patch("api.auth.settings")
    def test_upload_protected(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = []
        app = _build_test_app()
        client = TestClient(app)

        # Without key → 401
        resp = client.post("/api/v1/cases/TC-01/upload")
        assert resp.status_code == 401

        # With valid key → 200
        resp = client.post(
            "/api/v1/cases/TC-01/upload",
            headers={"X-API-Key": "secret-key-123"},
        )
        assert resp.status_code == 200

    @patch("api.auth.settings")
    def test_research_protected(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = []
        app = _build_test_app()
        client = TestClient(app)

        resp = client.post("/api/v1/cases/TC-01/research")
        assert resp.status_code == 401

        resp = client.post(
            "/api/v1/cases/TC-01/research",
            headers={"X-API-Key": "secret-key-123"},
        )
        assert resp.status_code == 200

    @patch("api.auth.settings")
    def test_delete_case_protected(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = []
        app = _build_test_app()
        client = TestClient(app)

        resp = client.delete("/api/v1/cases/TC-01")
        assert resp.status_code == 401

        resp = client.delete(
            "/api/v1/cases/TC-01",
            headers={"X-API-Key": "secret-key-123"},
        )
        assert resp.status_code == 200


# ── Case-level authorization ──────────────────────────────────────────────────

class TestCaseAuthorization:
    """When LL_ALLOWED_CASES is set, API key can only access listed cases."""

    @patch("api.auth.settings")
    def test_authorized_case_accessible(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = ["TC-01", "TC-22"]
        app = _build_test_app()
        client = TestClient(app)

        resp = client.get(
            "/api/v1/cases/TC-01/status",
            headers={"X-API-Key": "secret-key-123"},
        )
        assert resp.status_code == 200

    @patch("api.auth.settings")
    def test_unauthorized_case_blocked_403(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = ["TC-01"]
        app = _build_test_app()
        client = TestClient(app)

        resp = client.get(
            "/api/v1/cases/TC-99/status",
            headers={"X-API-Key": "secret-key-123"},
        )
        assert resp.status_code == 403
        assert resp.json()["error"] == "case_not_authorized"

    @patch("api.auth.settings")
    def test_case01_always_allowed(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = ["TC-22"]
        app = _build_test_app()
        client = TestClient(app)

        # case01 is always allowed (demo case)
        resp = client.get(
            "/api/v1/cases/case01/status",
            headers={"X-API-Key": "secret-key-123"},
        )
        assert resp.status_code == 200

    @patch("api.auth.settings")
    def test_empty_allowed_cases_means_all(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = []
        app = _build_test_app()
        client = TestClient(app)

        resp = client.get(
            "/api/v1/cases/ANY-CASE/status",
            headers={"X-API-Key": "secret-key-123"},
        )
        assert resp.status_code == 200


# ── Bypass prevention ─────────────────────────────────────────────────────────

class TestAuthBypassPrevention:
    """Authentication cannot be bypassed through alternative paths."""

    @patch("api.auth.settings")
    def test_multiple_keys_accepted(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["key-1", "key-2", "key-3"]
        mock_settings.ll_allowed_cases_list = []
        app = _build_test_app()
        client = TestClient(app)

        for key in ["key-1", "key-2", "key-3"]:
            resp = client.get("/api/v1/cases", headers={"X-API-Key": key})
            assert resp.status_code == 200

    @patch("api.auth.settings")
    def test_empty_key_string_rejected(self, mock_settings):
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = []
        app = _build_test_app()
        client = TestClient(app)

        resp = client.get("/api/v1/cases", headers={"X-API-Key": ""})
        assert resp.status_code == 401

    @patch("api.auth.settings")
    def test_case_id_in_different_endpoints_all_checked(self, mock_settings):
        """Case authorization applies to upload, research, status, and delete."""
        mock_settings.auth_enabled = True
        mock_settings.ll_api_key_list = ["secret-key-123"]
        mock_settings.ll_allowed_cases_list = ["TC-01"]
        app = _build_test_app()
        client = TestClient(app)

        # TC-01 is allowed
        for method, path in [
            ("GET", "/api/v1/cases/TC-01/status"),
            ("POST", "/api/v1/cases/TC-01/upload"),
            ("POST", "/api/v1/cases/TC-01/research"),
            ("DELETE", "/api/v1/cases/TC-01"),
        ]:
            resp = client.request(method, path, headers={"X-API-Key": "secret-key-123"})
            assert resp.status_code == 200, f"{method} {path} failed"

        # TC-99 is not allowed
        for method, path in [
            ("GET", "/api/v1/cases/TC-99/status"),
            ("POST", "/api/v1/cases/TC-99/upload"),
            ("POST", "/api/v1/cases/TC-99/research"),
            ("DELETE", "/api/v1/cases/TC-99"),
        ]:
            resp = client.request(method, path, headers={"X-API-Key": "secret-key-123"})
            assert resp.status_code == 403, f"{method} {path} should be blocked"


# ── Config integration ────────────────────────────────────────────────────────

class TestAuthConfigIntegration:
    """Verify the config.py auth settings work correctly."""

    def test_auth_disabled_by_default(self):
        from config import Settings
        s = Settings()
        assert s.ll_api_key == ""
        assert s.auth_enabled is False

    def test_auth_enabled_when_key_set(self):
        from config import Settings
        s = Settings(ll_api_key="my-key")
        assert s.auth_enabled is True
        assert "my-key" in s.ll_api_key_list

    def test_multiple_keys_parsed(self):
        from config import Settings
        s = Settings(ll_api_key="key1,key2,key3")
        assert s.ll_api_key_list == ["key1", "key2", "key3"]

    def test_allowed_cases_parsed(self):
        from config import Settings
        s = Settings(ll_allowed_cases="TC-01, TC-22,TC-35")
        assert s.ll_allowed_cases_list == ["TC-01", "TC-22", "TC-35"]

    def test_empty_allowed_cases_list(self):
        from config import Settings
        s = Settings(ll_allowed_cases="")
        assert s.ll_allowed_cases_list == []
