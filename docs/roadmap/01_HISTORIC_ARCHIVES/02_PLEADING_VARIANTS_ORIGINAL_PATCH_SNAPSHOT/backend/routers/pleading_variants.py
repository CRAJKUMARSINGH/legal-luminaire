"""Pleading Chain Engine - FastAPI routes.

Routes
  GET  /api/variants/subjects            -> all 50 subject labels (bilingual)
  GET  /api/variants/families            -> base pleadings + variant tree per subject
  POST /api/variants/matter-context      -> extract MatterContext from a draft
  POST /api/variants/generate            -> SSE stream of the generated variant
  POST /api/citations/search             -> citation search over the RAG index
                                           (Add-to-Draft feed, tier-tagged)
Gate rule: generation is refused (428) if the base draft has PENDING/FATAL_ERROR
citations - identical philosophy to the export block.
"""
from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from services import variant_engine as ve
from services.factfit_gate import probe_citations  # existing gate service

router = APIRouter(prefix="/variants", tags=["pleading-variants"])


class MatterContextIn(BaseModel):
    base_draft_md: str
    case_id: str
    subject: str


class GenerateIn(BaseModel):
    base_draft_md: str
    case_id: str
    subject: str
    archetype_id: str


@router.get("/subjects")
def subjects():
    return ve.list_subjects()


@router.get("/families")
def families(subject: str):
    try:
        fam = ve.subject_families(subject)
    except KeyError as e:
        raise HTTPException(404, str(e))
    return fam


@router.post("/matter-context")
def matter_context(body: MatterContextIn):
    ctx = ve.extract_matter_context(body.base_draft_md, body.case_id, body.subject)
    return ctx.__dict__


@router.post("/generate")
def generate(body: GenerateIn):
    fam = ve.subject_families(body.subject)
    archetype = next((a for a in fam["variants"] if a["id"] == body.archetype_id), None)
    if not archetype:
        raise HTTPException(404, f"archetype '{body.archetype_id}' not found for subject")

    # --- Fact-Fit Gate handoff: non-optional, same rule as export ---
    report = probe_citations(body.base_draft_md)
    blocked = [c for c in report.get("citations", []) if c["tier"] in ("PENDING", "FATAL_ERROR")]
    if blocked:
        raise HTTPException(
            428,
            detail={
                "error": "GATE_BLOCK",
                "message": "Resolve Fact-Fit Gate on the base draft before spawning variants.",
                "blocked": blocked,
            },
        )

    ctx = ve.extract_matter_context(body.base_draft_md, body.case_id, body.subject)

    def sse():
        try:
            for chunk in ve.stream_variant(body.base_draft_md, ctx, archetype):
                yield f"data: {json.dumps({'delta': chunk})}\n\n"
            yield f"data: {json.dumps({'done': True, 'citation_slots': len(archetype['citations'])})}\n\n"
        except Exception as exc:  # stream errors surface to client as SSE event
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"

    return StreamingResponse(sse(), media_type="text/event-stream")


# ---- Citation Search feed for "Add to Draft" ----

class CitationSearchIn(BaseModel):
    q: str
    limit: int = 10


@router.post("/citations/search")
def citation_search(body: CitationSearchIn):
    """Search the indexed case book / RAG store. Every hit carries its
    Fact-Fit tier; the frontend disables Add-to-Draft below VERIFIED."""
    from services.rag_store import hybrid_search  # existing RAG service

    hits = hybrid_search(body.q, k=body.limit)
    out = []
    for h in hits:
        tier = probe_citations(h["text"])["tier"] if h.get("requires_probe") else h.get("tier", "VERIFIED")
        out.append({
            "id": h["id"],
            "title": h["title"],
            "citation": h["citation"],
            "snippet": h["snippet"],
            "tier": tier,  # COURT_SAFE / VERIFIED / SECONDARY / PENDING / FATAL_ERROR
            "insertable": tier in ("COURT_SAFE", "VERIFIED"),  # hard rule
        })
    return {"results": out}
