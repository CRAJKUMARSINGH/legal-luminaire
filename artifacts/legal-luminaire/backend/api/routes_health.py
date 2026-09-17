"""Liveness probe — no RAG, no agents, no LLM."""
from __future__ import annotations

from fastapi import APIRouter

from config import settings
from api.models import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """GET /api/v1/health — success body is HealthResponse (Day 10 health exception)."""
    chroma_ok = True
    try:
        settings.chroma_path.mkdir(parents=True, exist_ok=True)
    except Exception:
        chroma_ok = False

    return HealthResponse(
        status="ok",
        openai_configured=bool(settings.openai_api_key),
        tavily_configured=bool(settings.tavily_api_key),
        chroma_ready=chroma_ok,
    )
