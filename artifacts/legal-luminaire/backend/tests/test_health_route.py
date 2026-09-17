"""Health router tests — does not import agents or RAG."""
from fastapi import FastAPI
from fastapi.testclient import TestClient

from api.http_errors import abort, register_error_handlers
from api.request_context import RequestIdMiddleware
from api.routes_health import router as health_router


def _app() -> FastAPI:
    app = FastAPI()
    app.add_middleware(RequestIdMiddleware)
    register_error_handlers(app)
    app.include_router(health_router, prefix="/api/v1")

    @app.get("/gone")
    def gone():
        abort(404, "Case not found.", code="NOT_FOUND")

    return app


def test_health_ok_and_request_id():
    client = TestClient(_app())
    res = client.get("/api/v1/health", headers={"X-Request-ID": "health-1"})
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert "openai_configured" in body
    assert res.headers["X-Request-ID"] == "health-1"


def test_abort_503_upstream():
    from api.http_errors import UPSTREAM_UNAVAILABLE

    app = FastAPI()
    app.add_middleware(RequestIdMiddleware)
    register_error_handlers(app)

    @app.get("/down")
    def down():
        abort(503, "OPENAI_API_KEY not configured.", code=UPSTREAM_UNAVAILABLE)

    res = TestClient(app).get("/down")
    assert res.status_code == 503
    assert res.json()["error"]["code"] == "UPSTREAM_UNAVAILABLE"


def test_abort_helper_envelope():
    client = TestClient(_app())
    res = client.get("/gone", headers={"X-Request-ID": "abort-1"})
    assert res.status_code == 404
    err = res.json()["error"]
    assert err["code"] == "NOT_FOUND"
    assert err["message"] == "Case not found."
    assert err["trace_id"] == "abort-1"
