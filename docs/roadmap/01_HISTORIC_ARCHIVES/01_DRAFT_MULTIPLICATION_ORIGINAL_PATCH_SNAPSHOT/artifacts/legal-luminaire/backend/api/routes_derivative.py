"""Derivative Draft API — Draft Multiplication (Document Family) routes.

Additive router: mounts under /api/v1 via main.py registration.
Provides:
  GET  /api/v1/derivative-types?subject_id=...   — registry listing
  GET  /api/v1/subjects                          — 50-subject taxonomy
  POST /api/v1/cases/{case_id}/derivative-drafts  — generate one derivative draft
  GET  /api/v1/cases/{case_id}/draft-family      — full lineage tree for the case
"""
from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from api.case_manager import case_manager
from config import settings
from registry import DERIVATIVE_TYPES, SUBJECTS, derivative_types_for_subject
from agents.derivative_drafter import generate_derivative_draft

router = APIRouter()
logger = logging.getLogger(__name__)


def _family_store_path(case_id: str):
    """Persist draft-family lineage next to case_data.json (same JSON store)."""
    # Same sanitization as JSONCaseRepository._get_case_file (path-traversal safe)
    safe_id = "".join(c for c in case_id if c.isalnum() or c in ("-", "_")).strip()
    if not safe_id:
        safe_id = "unknown-case"
    return settings.case_docs_path / safe_id / "draft_family.json"


def _load_family(case_id: str) -> List[Dict[str, Any]]:
    path = _family_store_path(case_id)
    if not path.exists():
        return []
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:  # noqa: BLE001
        logger.error("draft_family_read_error: %s", e)
        return []


def _save_family(case_id: str, family: List[Dict[str, Any]]) -> bool:
    path = _family_store_path(case_id)
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("w", encoding="utf-8") as f:
            json.dump(family, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:  # noqa: BLE001
        logger.error("draft_family_write_error: %s", e)
        return False


class AuthorityBlock(BaseModel):
    """Mirrors the frontend Authority (src/data/citations.ts) shape."""
    id: str
    kind: Optional[str] = "case"
    title: str = ""
    citation: Optional[str] = ""
    court: Optional[str] = ""
    year: Optional[int] = None
    holding: Optional[str] = ""
    application: Optional[str] = ""


class DerivativeDraftRequest(BaseModel):
    subject_id: str = Field(..., description="One of the 50 subject ids from the registry")
    derivative_type_id: str = Field(..., description="rejoinder | replication | counter_affidavit | ...")
    parent_draft_id: Optional[str] = Field(default=None, description="Draft-family id of the parent document")
    authority_blocks: List[AuthorityBlock] = Field(
        default_factory=list,
        description="Citation-search authority blocks piped in from the client-side Citation Search",
    )
    additional_notes: Optional[str] = ""


class DerivativeDraftResponse(BaseModel):
    success: bool
    draft_id: Optional[str] = None
    draft_content: str
    lineage: Optional[Dict[str, Any]] = None
    citations_extracted: List[str] = Field(default_factory=list)
    error: Optional[str] = None


@router.get("/derivative-types")
async def list_derivative_types(subject_id: Optional[str] = None):
    """List derivative document types, optionally filtered by subject applicability."""
    if subject_id:
        return {"success": True, "types": derivative_types_for_subject(subject_id)}
    return {"success": True, "types": DERIVATIVE_TYPES}


@router.get("/subjects")
async def list_subjects():
    """List all 50 litigation subjects with their applicable derivative types."""
    return {"success": True, "subjects": SUBJECTS}


@router.post("/cases/{case_id}/derivative-drafts", response_model=DerivativeDraftResponse)
async def create_derivative_draft(case_id: str, req: DerivativeDraftRequest):
    case_data = case_manager.get_case(case_id)
    if not case_data:
        raise HTTPException(status_code=404, detail="Case not found.")

    family = _load_family(case_id)
    parent_draft = next((d for d in family if d.get("id") == req.parent_draft_id), None)
    if req.parent_draft_id and not parent_draft:
        raise HTTPException(status_code=404, detail="Parent draft not found in case draft family.")

    result = generate_derivative_draft(
        case_data=case_data,
        subject_id=req.subject_id,
        derivative_type_id=req.derivative_type_id,
        parent_draft=parent_draft,
        additional_notes=req.additional_notes or "",
        authority_blocks=[a.model_dump() for a in req.authority_blocks],
    )

    if not result["success"]:
        return DerivativeDraftResponse(success=False, draft_content="", error=result["error"])

    draft_id = f"{req.derivative_type_id}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    record = {
        "id": draft_id,
        "title": f"{result['lineage']['derivative_type_label']} — {case_data.get('title', 'Untitled')}",
        "draft_type": req.derivative_type_id,
        "subject_id": req.subject_id,
        "content": result["draft_content"],
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "lineage": result["lineage"],
        "review_status": "DRAFT",
    }
    family.append(record)
    _save_family(case_id, family)

    return DerivativeDraftResponse(
        success=True,
        draft_id=draft_id,
        draft_content=result["draft_content"],
        lineage=result["lineage"],
        citations_extracted=result["lineage"]["citations_extracted"],
    )


@router.get("/cases/{case_id}/draft-family")
async def get_draft_family(case_id: str):
    case_data = case_manager.get_case(case_id)
    if not case_data:
        raise HTTPException(status_code=404, detail="Case not found.")
    return {"success": True, "family": _load_family(case_id)}
