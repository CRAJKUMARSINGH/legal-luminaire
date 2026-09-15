"""
Ask Copilot — routes_copilot.py
Week 5: Backend Contract & Guardrails

Endpoints:
  GET  /api/v1/copilot/health  — feature-flag state, always 200, never rate-limited
  POST /api/v1/copilot/ask     — read-only, citation-or-refuse Q&A over active case book

Implements the Vyaas contract:
  "It never invents matters, dates or orders;
   it only reads the book as it stands."

Design rules enforced here:
  1. Flag-gated  — FEATURE_ASK_COPILOT must be "true" or /ask returns 404.
                   /health always responds regardless of flag state.
  2. Read-only   — CopilotAskRequest uses extra="forbid"; no write fields accepted.
  3. Case-scoped — retrieval is strictly bounded to the supplied case_id.
  4. PENDING / FATAL_ERROR exclusion — such items are dropped before synthesis.
  5. Citation-or-refuse — every answer cites ≥ 1 real chunk, or a bilingual
     refusal is returned. A guessed answer is structurally impossible.
  6. Observability — per-question JSON log (latency, tokens, cost, refusal flag).
  7. Rate-limited — /copilot is in the heavy_markers list in main.py.
     Exception: /health is excluded from rate-limiting by main.py marker matching.
"""
from __future__ import annotations

import hashlib
import logging
import os
import time
from typing import List

from fastapi import APIRouter, HTTPException

from .models import (
    CopilotAskRequest,
    CopilotAskResponse,
    CopilotCitation,
    CopilotRefusal,
)
from ..rag.hybrid_search import hybrid_search as _hybrid_search
from ..rag.query_classifier import classify_query

logger = logging.getLogger(__name__)

# ── Constants ──────────────────────────────────────────────────────────────────
MIN_CONFIDENCE = 0.35          # below this → refusal
TOP_K_SYNTHESIS = 3            # top chunks used for answer synthesis
MAX_SNIPPET_LEN = 300          # citation snippet truncated to this length
COST_PER_TOKEN = 0.000_002     # USD estimate (gpt-4o-mini tier)

# Blocked verification tiers — these chunks MUST NOT appear as citations
_BLOCKED_TIERS = {"PENDING", "FATAL_ERROR"}

# Bilingual refusal reason — verbatim, never paraphrased
BILINGUAL_REFUSAL = (
    "Not found in this case book. / इस केस बुक में नहीं मिला।"
)

# ── Feature-flag guard ─────────────────────────────────────────────────────────
_FLAG_ON = os.getenv("FEATURE_ASK_COPILOT", "false").strip().lower() in (
    "1", "true", "yes", "on"
)

# ── Router ─────────────────────────────────────────────────────────────────────
router = APIRouter(prefix="/copilot", tags=["copilot"])


# ── Helpers ────────────────────────────────────────────────────────────────────

def _question_hash(question: str) -> str:
    """First 12 hex chars of SHA-256; used in logs — never stored as a key."""
    return hashlib.sha256(question.encode()).hexdigest()[:12]


def _estimate_tokens(text: str) -> int:
    """Rough estimate: 1 token ≈ 4 chars (GPT tokeniser heuristic)."""
    return max(1, len(text) // 4)


def _truncate(text: str, max_len: int = MAX_SNIPPET_LEN) -> str:
    if len(text) <= max_len:
        return text
    return text[:max_len - 1] + "…"


def _is_blocked(metadata: dict) -> bool:
    """Return True if this chunk's verification tier is blocked from citations."""
    tier = metadata.get("verification_tier", "")
    return tier in _BLOCKED_TIERS


def _build_refusal(latency_ms: int, session_id: str | None) -> CopilotAskResponse:
    return CopilotAskResponse(
        answer="",
        citations=[],
        refusal=CopilotRefusal(reason=BILINGUAL_REFUSAL),
        latency_ms=latency_ms,
        session_id=session_id,
    )


def _log_copilot_event(
    *,
    case_id: str,
    session_id: str | None,
    question: str,
    retrieved_items: int,
    refusal: bool,
    latency_ms: int,
    tokens_estimated: int,
    cost_usd_estimated: float,
) -> None:
    """
    Write a single-line JSON observability record via the standard logger.
    Non-blocking — caller does not await this.

    Fields consumed downstream for monitoring / cost tracking:
      event, case_id, session_id, question_hash, retrieved_items, refusal,
      latency_ms, tokens_estimated, cost_usd_estimated, timestamp
    """
    import datetime, json

    record = {
        "event": "copilot_ask",
        "case_id": case_id,
        "session_id": session_id,
        "question_hash": _question_hash(question),
        "retrieved_items": retrieved_items,
        "refusal": refusal,
        "latency_ms": latency_ms,
        "tokens_estimated": tokens_estimated,
        "cost_usd_estimated": round(cost_usd_estimated, 8),
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
    }
    logger.info("COPILOT_EVENT %s", json.dumps(record, ensure_ascii=False))


def _synthesise_answer(chunks: list, question: str) -> str:
    """
    Build a plain-text answer from the top retrieved chunks.

    Week 5 implementation: deterministic extractive summary.
    Week 6+ can upgrade this to an LLM call with the chunks as context.

    Strategy: join the top-N chunk texts, separated by a brief provenance note.
    This is grounded, deterministic, and requires no API key.
    """
    parts: list[str] = []
    for i, chunk in enumerate(chunks[:TOP_K_SYNTHESIS], start=1):
        content = chunk.document.page_content.strip()
        source = chunk.document.metadata.get("source", f"chunk-{i}")
        parts.append(f"[{i}] (Source: {source})\n{content}")
    return "\n\n".join(parts)


def _build_citations(chunks: list) -> List[CopilotCitation]:
    """Convert SearchResult objects into CopilotCitation objects."""
    citations: List[CopilotCitation] = []
    for chunk in chunks[:TOP_K_SYNTHESIS]:
        meta = chunk.document.metadata
        # Determine citation type from metadata; default to "document"
        # "deadline" added Week 9: cites the deterministic engine's rule_id + basis.
        raw_type = meta.get("citation_type", meta.get("type", "document"))
        if raw_type not in {"document", "timeline", "register", "standard", "deadline"}:
            raw_type = "document"

        citation_id = (
            meta.get("doc_id")
            or meta.get("source")
            or meta.get("file_name")
            or f"chunk-{chunk.rank}"
        )
        snippet = _truncate(chunk.document.page_content.strip())
        citations.append(
            CopilotCitation(type=raw_type, id=str(citation_id), snippet=snippet)
        )
    return citations


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get(
    "/copilot/health",
    summary="Copilot feature health check",
    description=(
        "Returns the current activation state of the ask_copilot feature flag. "
        "Always available regardless of flag state — never rate-limited. "
        "Useful for frontend feature-detection and CI smoke tests."
    ),
    response_model=dict,
)
async def health() -> dict:
    """
    GET /api/v1/copilot/health

    Returns:
      {
        "feature": "ask_copilot",
        "enabled": true|false,
        "endpoint": "POST /api/v1/copilot/ask",
        "refusal_default": "<bilingual string>",
        "min_confidence": 0.35
      }

    Does NOT require FEATURE_ASK_COPILOT=true — always responds 200.
    Intended for frontend feature detection, monitoring, and CI smoke tests.
    """
    return {
        "feature": "ask_copilot",
        "enabled": _FLAG_ON,
        "endpoint": "POST /api/v1/copilot/ask",
        "refusal_default": BILINGUAL_REFUSAL,
        "min_confidence": MIN_CONFIDENCE,
    }


@router.post(
    "/ask",
    response_model=CopilotAskResponse,
    summary="Ask a question about the active case book",
    description=(
        "Read-only, citation-or-refuse copilot. "
        "Every answer cites ≥ 1 existing case-book item. "
        "Returns a bilingual refusal when no supporting item exists. "
        "Gated behind FEATURE_ASK_COPILOT env var."
    ),
)
async def ask(body: CopilotAskRequest) -> CopilotAskResponse:
    """
    POST /api/v1/copilot/ask

    Pipeline (see design.md for full diagram):
      1.  Flag check
      2.  Input already validated by Pydantic (CopilotAskRequest, extra="forbid")
      3.  Rate limit enforced upstream by main.py middleware
      4.  Query classification → k_retrieval
      5.  Hybrid retrieval scoped to case_id
      6.  PENDING / FATAL_ERROR filter
      7.  Confidence gate
      8.  Answer synthesis
      9.  Zero-citation guard
      10. Observability log
      11. Return CopilotAskResponse
    """
    # ── 1. Flag check ──────────────────────────────────────────────────────────
    if not _FLAG_ON:
        raise HTTPException(
            status_code=404,
            detail=(
                "Feature 'ask_copilot' is not enabled. "
                "Set FEATURE_ASK_COPILOT=true to activate."
            ),
        )

    t_start = time.perf_counter()

    # ── 4. Query classification ────────────────────────────────────────────────
    profile = classify_query(body.question)
    k = profile.k_retrieval

    # ── 5. Hybrid retrieval (case-scoped) ──────────────────────────────────────
    try:
        raw_results = await _hybrid_search.hybrid_search(
            case_id=body.case_id,
            query=body.question,
            k=k,
        )
    except Exception as exc:
        logger.error(
            "Copilot retrieval error case_id=%s: %s", body.case_id, exc, exc_info=True
        )
        raise HTTPException(status_code=500, detail="Retrieval failed. Please retry.")

    # ── 6. PENDING / FATAL_ERROR exclusion ────────────────────────────────────
    filtered = [r for r in raw_results if not _is_blocked(r.document.metadata)]

    latency_ms = int((time.perf_counter() - t_start) * 1000)

    # ── 7. Confidence gate ────────────────────────────────────────────────────
    if not filtered:
        _log_copilot_event(
            case_id=body.case_id,
            session_id=body.session_id,
            question=body.question,
            retrieved_items=0,
            refusal=True,
            latency_ms=latency_ms,
            tokens_estimated=0,
            cost_usd_estimated=0.0,
        )
        return _build_refusal(latency_ms, body.session_id)

    max_score = max(r.combined_score for r in filtered)
    if max_score < MIN_CONFIDENCE:
        _log_copilot_event(
            case_id=body.case_id,
            session_id=body.session_id,
            question=body.question,
            retrieved_items=len(filtered),
            refusal=True,
            latency_ms=latency_ms,
            tokens_estimated=0,
            cost_usd_estimated=0.0,
        )
        return _build_refusal(latency_ms, body.session_id)

    # ── 8. Answer synthesis ───────────────────────────────────────────────────
    top_chunks = sorted(filtered, key=lambda r: r.combined_score, reverse=True)[
        :TOP_K_SYNTHESIS
    ]
    answer_text = _synthesise_answer(top_chunks, body.question)

    # ── 9. Zero-citation guard ────────────────────────────────────────────────
    citations = _build_citations(top_chunks)
    if not citations:
        latency_ms = int((time.perf_counter() - t_start) * 1000)
        _log_copilot_event(
            case_id=body.case_id,
            session_id=body.session_id,
            question=body.question,
            retrieved_items=len(filtered),
            refusal=True,
            latency_ms=latency_ms,
            tokens_estimated=0,
            cost_usd_estimated=0.0,
        )
        return _build_refusal(latency_ms, body.session_id)

    # ── 10. Observability log ─────────────────────────────────────────────────
    latency_ms = int((time.perf_counter() - t_start) * 1000)
    tokens_est = _estimate_tokens(answer_text) + _estimate_tokens(body.question)
    cost_est = tokens_est * COST_PER_TOKEN

    _log_copilot_event(
        case_id=body.case_id,
        session_id=body.session_id,
        question=body.question,
        retrieved_items=len(filtered),
        refusal=False,
        latency_ms=latency_ms,
        tokens_estimated=tokens_est,
        cost_usd_estimated=cost_est,
    )

    # ── 11. Return ────────────────────────────────────────────────────────────
    return CopilotAskResponse(
        answer=answer_text,
        citations=citations,
        refusal=None,
        latency_ms=latency_ms,
        session_id=body.session_id,
    )
