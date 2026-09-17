"""
Legal Luminaire â€” FastAPI Backend
Multi-agent legal research + RAG + zero-hallucination drafting
"""
from __future__ import annotations

import logging
import time
from collections import defaultdict
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from api.routes import router
from api.routes_omni import router as omni_router
from api.routes_cases import router as cases_router
from api.routes_drafting import router as drafting_router
from api.routes_search import router as search_router
from api.routes_oral import router as oral_router
from api.routes_lab import router as lab_router
from api.routes_collision import router as collision_router
from api.routes_auto_research import router as auto_research_router
from api.routes_verify import router as verify_router
from api.routes_legal_stream import router as legal_stream_router
from api.routes_similarity import router as similarity_router
from api.routes_analytics import router as analytics_router
from api.routes_graph import router as graph_router
# Week 5: Ask Copilot — read-only, citation-or-refuse, flag-gated
from api.routes_copilot import router as copilot_router
# Week 9: Limitation & Deadline Engine — deterministic, no LLM, flag-gated
from api.routes_deadlines import router as deadlines_router
# Week 10: Chronology Studio — source-cited timeline generation, flag-gated
from api.routes_chronology import router as chronology_router
# Draft Multiplication — derivative drafts (rejoinder, replication, etc.)
from api.routes_derivative import router as derivative_router

_harvey_router_available = False
try:
    from api.routes_harvey import router as harvey_router
    _harvey_router_available = True
except ImportError:
    logger = logging.getLogger(__name__)
    logger.info("routes_harvey not available (gitignored optional module) — skipping harvey router registration")

# â”€â”€ Logging â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


# â”€â”€ Rate limiter (simple in-memory) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
_request_counts: dict[str, list[float]] = defaultdict(list)


def _is_expensive_endpoint(path: str) -> bool:
    """Week 3: classify endpoints that deserve rate limiting (research, drafting, heavy RAG)."""
    heavy_markers = (
        "/research",
        "/ai-draft",
        "/drafting",
        "/discharge",
        "/chat",
        "/detect-contradictions",
        "/auto-research",
        "/upload-document",
        "/cases/",
        "/omni-ingest",
        "/preview-document",
        "/ingest",
        "/copilot",          # Week 5: Ask Copilot (expensive RAG + synthesis)
        "/deadlines",        # Week 9: Deadline Engine (rule computation per case)
        "/chronology",       # Week 10: Chronology Studio (document parsing + merging)
    )
    return any(m in path for m in heavy_markers)


def _check_rate_limit(client_ip: str) -> tuple[bool, int]:
    """Returns (allowed, retry_after_seconds)."""
    now = time.time()
    window = 60.0
    limit = settings.max_requests_per_minute
    timestamps = _request_counts[client_ip]
    _request_counts[client_ip] = [t for t in timestamps if now - t < window]
    if len(_request_counts[client_ip]) >= limit:
        oldest = _request_counts[client_ip][0]
        retry_after = int(window - (now - oldest)) + 1
        return False, max(1, retry_after)
    _request_counts[client_ip].append(now)
    return True, 0


# â”€â”€ Startup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure directories exist
    settings.chroma_path.mkdir(parents=True, exist_ok=True)
    settings.case_docs_path.mkdir(parents=True, exist_ok=True)
    logger.info(f"ChromaDB path: {settings.chroma_path.resolve()}")
    logger.info(f"Case docs path: {settings.case_docs_path.resolve()}")
    logger.info(f"OpenAI configured: {bool(settings.openai_api_key)}")
    logger.info(f"Tavily configured: {bool(settings.tavily_api_key)}")

    # Auto-preload Case 01 documents if OpenAI is configured
    if settings.openai_api_key:
        try:
            from preload_case01 import preload_hemraj_case
            result = preload_hemraj_case()
            if result.get("success"):
                logger.info(
                    f"Case01 preloaded: {result['files_indexed']} files, "
                    f"{result['total_chunks']} chunks"
                )
            else:
                logger.warning(f"Case01 preload skipped: {result.get('error')}")
        except Exception as e:
            logger.warning(f"Case01 preload failed (non-fatal): {e}")
    else:
        logger.info("OpenAI not configured â€” skipping Case01 preload")

    yield
    logger.info("Shutting down Legal Luminaire backend.")


# â”€â”€ App â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app = FastAPI(
    title="Legal Luminaire API",
    description="Zero-hallucination multi-agent legal research and drafting",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Week 3: Rate limit all expensive endpoints (research, drafting, heavy RAG, uploads)
    path = request.url.path
    if _is_expensive_endpoint(path):
        client_ip = request.client.host if request.client else "unknown"
        allowed, retry_after = _check_rate_limit(client_ip)
        if not allowed:
            headers = {"Retry-After": str(retry_after)}
            return JSONResponse(
                status_code=429,
                content={
                    "detail": (
                        f"Rate limit exceeded: max {settings.max_requests_per_minute} "
                        f"expensive requests/minute. Retry after {retry_after}s."
                    ),
                    "retry_after_seconds": retry_after,
                },
                headers=headers,
            )
    return await call_next(request)


app.include_router(router, prefix="/api/v1")
app.include_router(omni_router, prefix="/api/v1")
app.include_router(cases_router, prefix="/api/v1")
app.include_router(drafting_router, prefix="/api/v1")
app.include_router(search_router, prefix="/api/v1")
app.include_router(oral_router, prefix="/api/v1")
app.include_router(lab_router, prefix="/api/v1")
app.include_router(collision_router, prefix="/api/v1")
app.include_router(auto_research_router, prefix="/api/v1")
app.include_router(verify_router, prefix="/api/v1")
app.include_router(legal_stream_router, prefix="/api/legal")
app.include_router(similarity_router)
app.include_router(analytics_router)
app.include_router(graph_router)
# Week 5: Ask Copilot — POST /api/v1/copilot/ask
app.include_router(copilot_router, prefix="/api/v1")
# Week 9: Deadline Engine — GET /api/v1/case/{id}/deadlines + /api/v1/deadlines/rules
app.include_router(deadlines_router, prefix="/api/v1")
# Week 10: Chronology Studio — POST /api/v1/case/{id}/chronology/propose + actions
app.include_router(chronology_router, prefix="/api/v1")
app.include_router(derivative_router, prefix="/api/v1")
if _harvey_router_available:
    app.include_router(harvey_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "service": "Legal Luminaire API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/api/v1/health",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,
        log_level="info",
    )
