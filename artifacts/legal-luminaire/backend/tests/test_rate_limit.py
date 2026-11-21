"""
test_rate_limit.py — expensive-endpoint rate-limit contract (RECREATED).

History
-------
The original ``test_rate_limit.py`` source was never committed (only its ``.pyc``
survived). Its bytecode targeted ``api.rate_limit.RateLimiter`` /
``is_expensive_endpoint`` — that module was **removed**; only a string reference to
the limiter remains in ``main.py``.

Per Phase 2 of the unwired-files reconciliation, this module is re-authored against
the CURRENT wired limiter (deliberately NOT decompiled from bytecode). The runtime
now implements a simple in-memory limiter inside ``main.py``:

  * ``_is_expensive_endpoint(path)`` — classifies research / drafting / heavy RAG /
    copilot / deadlines / chronology / upload paths.
  * ``_check_rate_limit(client_ip)`` -> ``(allowed, retry_after)`` over a 60s window.
  * ``rate_limit_middleware`` — returns HTTP 429 + ``Retry-After`` when exceeded.

``main.py`` is not importable in the test environment (it pulls the heavy AI stack),
so the real functions are extracted from source via AST and executed in an isolated
namespace. This exercises the ACTUAL production code, not a reimplementation.
"""
from __future__ import annotations

import ast
import asyncio
import json
import time
from collections import defaultdict
from pathlib import Path
from types import SimpleNamespace

from fastapi.responses import JSONResponse

_BACKEND = Path(__file__).parents[1]
_MAIN_SRC = (_BACKEND / "main.py").read_text(encoding="utf-8")

_WANTED = {"_is_expensive_endpoint", "_check_rate_limit", "rate_limit_middleware"}


def _load_limiter(limit: int = 3):
    """Extract and exec the real limiter functions from main.py (decorators stripped)."""
    tree = ast.parse(_MAIN_SRC)
    funcs = []
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in _WANTED:
            node.decorator_list = []  # drop @app.middleware("http") so no app is needed
            funcs.append(node)
    mod = ast.Module(body=funcs, type_ignores=[])
    ns = {
        "time": time,
        "defaultdict": defaultdict,
        "JSONResponse": JSONResponse,
        "settings": SimpleNamespace(max_requests_per_minute=limit),
        "_request_counts": defaultdict(list),
    }
    exec(compile(mod, "main.py", "exec"), ns)  # noqa: S102 - executing repo-owned source
    return ns


def _fake_request(path: str = "/api/v1/cases/TC-01/research", host: str = "9.9.9.9"):
    return SimpleNamespace(
        url=SimpleNamespace(path=path),
        client=SimpleNamespace(host=host),
    )


async def _ok(_request):
    return JSONResponse({"ok": True}, status_code=200)


# ── Endpoint classification ───────────────────────────────────────────────────

class TestExpensiveClassification:
    def test_expensive_markers_cover_required_areas(self):
        is_expensive = _load_limiter()["_is_expensive_endpoint"]
        for path in [
            "/api/v1/cases/TC-01/research",
            "/api/v1/cases/TC-01/upload",
            "/api/v1/copilot/ask",
            "/api/v1/case/TC-01/deadlines",
            "/api/v1/case/TC-01/chronology/propose",
            "/api/v1/auto-research",
            "/api/v1/omni-ingest",
        ]:
            assert is_expensive(path) is True, path

    def test_cheap_paths_not_limited(self):
        is_expensive = _load_limiter()["_is_expensive_endpoint"]
        for path in ["/api/v1/health", "/"]:
            assert is_expensive(path) is False, path


# ── Window behaviour ──────────────────────────────────────────────────────────

class TestRateWindow:
    def test_allows_up_to_limit_then_blocks(self):
        check = _load_limiter(limit=3)["_check_rate_limit"]
        for _ in range(3):
            allowed, retry = check("1.2.3.4")
            assert allowed is True
            assert retry == 0
        allowed, retry = check("1.2.3.4")
        assert allowed is False
        assert retry >= 1

    def test_clients_are_isolated(self):
        check = _load_limiter(limit=2)["_check_rate_limit"]
        assert check("a")[0] is True
        assert check("a")[0] is True
        assert check("a")[0] is False
        assert check("b")[0] is True  # separate bucket

    def test_window_expiry_frees_capacity(self):
        ns = _load_limiter(limit=2)
        fake = {"t": 1_000_000.0}
        # the extracted function's globals ARE this namespace, so this rebinds `time`
        ns["time"] = SimpleNamespace(time=lambda: fake["t"])
        check = ns["_check_rate_limit"]
        assert check("x")[0] is True
        assert check("x")[0] is True
        assert check("x")[0] is False
        fake["t"] += 61.0  # advance past the 60s window
        assert check("x")[0] is True


# ── Middleware contract ───────────────────────────────────────────────────────

class TestMiddlewareEnvelope:
    def test_middleware_blocks_with_429_envelope(self):
        ns = _load_limiter(limit=1)
        middleware = ns["rate_limit_middleware"]
        req = _fake_request()

        first = asyncio.run(middleware(req, _ok))
        assert first.status_code == 200

        second = asyncio.run(middleware(req, _ok))
        assert second.status_code == 429
        assert second.headers.get("Retry-After")
        body = json.loads(second.body)
        assert body["retry_after_seconds"] >= 1
        assert "Rate limit exceeded" in body["detail"]

    def test_cheap_path_passes_through(self):
        ns = _load_limiter(limit=0)  # even with a zero budget
        middleware = ns["rate_limit_middleware"]
        resp = asyncio.run(middleware(_fake_request(path="/api/v1/health"), _ok))
        assert resp.status_code == 200
