"""
SSE streaming draft endpoint — matches frontend `use-draft-stream.ts` (POST /api/legal/draft).
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import re
import time
from collections.abc import AsyncIterator

from fastapi import APIRouter
from pydantic import BaseModel, Field
from fastapi.responses import StreamingResponse

from api.citation_registry import evaluate_citation_gate_as_dict
from api.redaction_utils import redact_indian_pii
from config import settings
from rag.document_store import case_has_documents, get_retriever

logger = logging.getLogger(__name__)

router = APIRouter()


def _evaluate_citation_gate(text: str) -> dict:
    gate = evaluate_citation_gate_as_dict(text)
    normalized = (text or "").upper()
    statuses = {
        tier: len(re.findall(rf"\b{tier}\b", normalized))
        for tier in ("COURT_SAFE", "VERIFIED", "SECONDARY", "PENDING", "FATAL_ERROR")
    }
    for entry in gate["blocked_entries"] + gate["secondary_entries"]:
        tier = entry["tier"]
        if tier in statuses:
            statuses[tier] += 1
    gate["statuses"] = statuses
    gate["must_block"] = gate["must_block"] or bool(statuses["PENDING"] or statuses["FATAL_ERROR"])
    gate["needs_ack"] = bool(statuses["SECONDARY"]) and not gate["must_block"]
    gate["download_allowed"] = not gate["must_block"]
    return gate


class HybridDraftRequest(BaseModel):
    sessionId: int = Field(..., ge=1, description="Numeric session from hybrid UI (maps to case01, case02, …)")
    query: str = Field(..., min_length=1)
    draftType: str = "discharge_application"
    language: str = "hindi"


def _session_to_case_id(session_id: int) -> str:
    return f"case{int(session_id):02d}"


def _sse(obj: dict) -> str:
    return f"data: {json.dumps(obj, ensure_ascii=False)}\n\n"


def _build_user_query(body: HybridDraftRequest) -> str:
    return (
        f"{body.query.strip()}\n\n"
        f"[Draft type: {body.draftType}. Output language preference: {body.language}.]"
    )


def _retrieve_context(case_id: str, query: str) -> str:
    if not case_has_documents(case_id):
        return "[No documents uploaded for this case. Using query only.]"
    try:
        retriever = get_retriever(case_id, k=10)
        docs = retriever.invoke(query)
        return "\n\n---\n\n".join(
            redact_indian_pii(f"[Source: {d.metadata.get('source_file', 'unknown')}]\n{d.page_content}")
            for d in docs
        )
    except Exception as error:
        logger.warning("RAG retrieval failed for %s (%s)", case_id, type(error).__name__)
        return "[Case documents could not be retrieved.]"


def _chunk_text(text: str, size: int = 280) -> list[str]:
    if not text:
        return []
    chunks: list[str] = []
    i = 0
    while i < len(text):
        chunks.append(text[i : i + size])
        i += size
    return chunks


def _run_crew_blocking(user_query: str, case_context: str) -> dict:
    from agents.crew import run_legal_crew

    result = run_legal_crew(
        query=user_query,
        case_context=case_context,
        incident_type="construction wall collapse forensic mortar sampling",
        evidence_type="material sampling forensic lab report chain of custody",
        mode="draft",
    )
    citation_gate = _evaluate_citation_gate(result.get("draft", ""))
    result["citation_gate"] = citation_gate
    if citation_gate["must_block"]:
        result["success"] = False
        result["draft"] = ""
        block_msg = (
            "Citation gate blocked output due to unresolved "
            f"PENDING={citation_gate['statuses']['PENDING']} or "
            f"FATAL_ERROR={citation_gate['statuses']['FATAL_ERROR']}."
        )
        result["error"] = f"{result.get('error', '')} {block_msg}".strip()
    return result


async def _draft_event_stream(body: HybridDraftRequest) -> AsyncIterator[str]:
    case_id = _session_to_case_id(body.sessionId)
    user_query = redact_indian_pii(_build_user_query(body))
    draft_id = int(hashlib.sha256(f"{case_id}:{time.time()}:{user_query[:200]}".encode()).hexdigest()[:12], 16) % (
        2**31 - 1
    )

    yield _sse({"stage": "researcher", "message": f"Case {case_id}: retrieving documents & facts…"})

    if not settings.openai_api_key:
        yield _sse(
            {
                "stage": "error",
                "message": "OPENAI_API_KEY not configured. Add it to backend/.env",
                "error": "OPENAI_API_KEY not configured",
                "done": True,
            }
        )
        return

    yield _sse({"stage": "verifier", "message": "Verifying citations & standards context…"})

    case_context = await asyncio.to_thread(_retrieve_context, case_id, user_query)

    yield _sse({"stage": "drafter", "message": "Running multi-agent drafting pipeline…"})

    result = await asyncio.to_thread(_run_crew_blocking, user_query, case_context)

    if not result.get("success"):
        err = result.get("error") or "Draft generation failed"
        yield _sse({"stage": "error", "message": err, "error": err, "done": True})
        return

    draft_text = result.get("draft") or ""
    for piece in _chunk_text(draft_text):
        yield _sse({"stage": "streaming", "content": piece})

    yield _sse(
        {
            "stage": "complete",
            "message": "Generation complete",
            "content": draft_text,
            "draftId": draft_id,
            "done": True,
        }
    )


@router.post("/draft")
async def stream_legal_draft(body: HybridDraftRequest):
    return StreamingResponse(
        _draft_event_stream(body),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
