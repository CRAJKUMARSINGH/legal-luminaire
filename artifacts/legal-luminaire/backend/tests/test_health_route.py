"""
test_health_route.py — backend health-endpoint contract (RECREATED).

History
-------
The original ``test_health_route.py`` source was never committed (only its
``.cpython-314.pyc`` survived). Its bytecode targeted ``api.routes_health``,
``RequestIdMiddleware`` and ``register_error_handlers`` — **none of which exist in
the current runtime** (removed during the accuracy-first overhaul).

Per Phase 2 of the unwired-files reconciliation, this module is re-authored against
the CURRENT wired health surface — deliberately NOT decompiled from bytecode:

  GET /api/v1/health          -> api.routes.health()          (response_model=HealthResponse)
  GET /api/v1/copilot/health  -> api.routes_copilot.health()  (dict: flag state, always 200)

Both are auth-exempt (api.auth._EXEMPT_PATHS) and never rate-limited.

The heavy AI stack (``api.routes`` pulls langchain/Chroma) is not importable in the
test environment, so the endpoint is exercised through a minimal FastAPI app that
mounts the *real* ``HealthResponse`` model, while the wiring is asserted statically.
"""
from __future__ import annotations

import ast
from pathlib import Path

from fastapi import FastAPI
from fastapi.testclient import TestClient

from api.auth import _is_exempt
from api.models import HealthResponse

_API_DIR = Path(__file__).parents[1] / "api"
_BACKEND = Path(__file__).parents[1]


def _health_app() -> FastAPI:
    """Minimal app mounting the real HealthResponse contract."""
    app = FastAPI()

    @app.get("/api/v1/health", response_model=HealthResponse)
    async def health() -> HealthResponse:
        return HealthResponse(
            status="ok",
            openai_configured=False,
            tavily_configured=False,
            chroma_ready=True,
        )

    return app


def _expensive_markers() -> tuple[str, ...]:
    """Statically extract the heavy-marker tuple from main._is_expensive_endpoint."""
    tree = ast.parse((_BACKEND / "main.py").read_text(encoding="utf-8"))
    for node in tree.body:
        if isinstance(node, ast.FunctionDef) and node.name == "_is_expensive_endpoint":
            for inner in ast.walk(node):
                if isinstance(inner, ast.Assign) and isinstance(inner.value, ast.Tuple):
                    return tuple(
                        e.value for e in inner.value.elts if isinstance(e, ast.Constant)
                    )
    raise AssertionError("heavy_markers tuple not found in _is_expensive_endpoint")


class TestHealthModel:
    def test_exact_field_set(self):
        assert set(HealthResponse.model_fields) == {
            "status",
            "openai_configured",
            "tavily_configured",
            "chroma_ready",
        }

    def test_roundtrip(self):
        r = HealthResponse(
            status="ok",
            openai_configured=True,
            tavily_configured=False,
            chroma_ready=True,
        )
        assert r.model_dump()["status"] == "ok"


class TestHealthEndpoint:
    def test_returns_200_and_ok(self):
        resp = TestClient(_health_app()).get("/api/v1/health")
        assert resp.status_code == 200
        body = resp.json()
        assert body["status"] == "ok"
        assert set(body) == {
            "status",
            "openai_configured",
            "tavily_configured",
            "chroma_ready",
        }

    def test_declared_on_router_with_response_model(self):
        src = (_API_DIR / "routes.py").read_text(encoding="utf-8")
        assert '@router.get("/health", response_model=HealthResponse)' in src

    def test_copilot_health_declared(self):
        src = (_API_DIR / "routes_copilot.py").read_text(encoding="utf-8")
        assert '"/copilot/health"' in src


class TestHealthAccessPolicy:
    def test_health_paths_are_auth_exempt(self):
        assert _is_exempt("/api/v1/health")
        assert _is_exempt("/api/v1/copilot/health")

    def test_health_paths_are_not_rate_limited(self):
        markers = _expensive_markers()
        assert "/health" not in markers
        assert not any("/health" in m for m in markers)
