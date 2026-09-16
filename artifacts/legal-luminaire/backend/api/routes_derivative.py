"""Derivative Draft API — Draft Multiplication (Document Family) routes.

Additive router: mounts under /api/v1 via main.py registration.

Endpoints:
  GET  /api/v1/derivative/health                           — feature-flag health check
  GET  /api/v1/derivative/registry                         — full registry dump (50 subjects + 12 types)
  GET  /api/v1/derivative/subjects                         — same as /registry (alias for UI picker)
  GET  /api/v1/derivative/subject/{subject_id}/types       — list derivative_types applicable to a subject
  GET  /api/v1/derivative/types                            — list all 12 derivative types with stage hints
  POST /api/v1/case/{case_id}/derivative/generate          — generate ONE derivative draft
  POST /api/v1/case/{case_id}/derivative/family            — generate the WHOLE document family for a subject
  GET  /api/v1/case/{case_id}/derivative/family            — list stored family for a case (in-memory store)

Design rules enforced here:
  1. Flag-gated  — FEATURE_DERIVATIVE_DRAFTS must be "true" or write endpoints return 404.
                   /health + /registry + read-only listing endpoints ALWAYS respond regardless of flag.
  2. Pairing-gate — subject × derivative_type MUST be whitelisted in derivative_drafts.json applicable_types.
                    Invalid pairings never generate a draft; a clear bilingual error is returned.
  3. Lineage-everywhere — every response carries structured lineage (anchors + parent + subject metadata)
                          AND the rendered lineage block inside draft_content.
  4. SYNTHETIC     — is_synthetic: true on every payload; bilingual disclaimer on every response.
  5. LLM-graceful  — if no LLM is configured, deterministic skeleton drafts are produced; caller is notified.
  6. Rate-limited  — /generate + /family are in main.py heavy_markers; guarded by rate_limit_middleware.
"""
from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, HTTPException

from .case_manager import case_manager
from .models import (
    DerivativeAnchor,
    DerivativeAvailableTypesResponse,
    DerivativeFamilyRequest,
    DerivativeFamilyResponse,
    DerivativeGenerateRequest,
    DerivativeGenerateResponse,
    DerivativeLineage,
    DerivativeRegistryResponse,
    DerivativeSubjectInfo,
    DerivativeTypeInfo,
)

from ..agents.derivative_drafter import (
    build_document_family,
    generate_derivative_draft,
    list_all_subjects,
    list_available_derivatives,
    validate_pairing,
)

logger = logging.getLogger(__name__)

# ── Feature-flag guard ─────────────────────────────────────────────────────────
_FLAG_ON = os.getenv("FEATURE_DERIVATIVE_DRAFTS", "false").strip().lower() in (
    "1", "true", "yes", "on"
)

_SYNTHETIC_DISCLAIMER = (
    "All derivative drafts are SYNTHETIC/DEMO output only. "
    "Review every paragraph against the case record and current statute text before filing. "
    "/ सभी व्युत्पन्न ड्राफ्ट केवल संश्लेषित/डेमो आउटपुट हैं। "
    "दाखिल करने से पहले प्रत्येक पैराग्राफ को केस रिकॉर्ड और वर्तमान विधि-पाठ के साथ समीक्षा करें।"
)

# ── Router ─────────────────────────────────────────────────────────────────────
router = APIRouter(tags=["derivative_drafts"])

# ── In-memory family store (in production, use case_manager / database) ────────
_family_store: Dict[str, Dict[str, Any]] = {}


def _case_path(case_id: str) -> Path:
    from config import settings
    return settings.case_docs_path / case_id


def _load_family(case_id: str) -> Dict[str, Any]:
    """Load stored document-family for a case (from in-memory cache)."""
    return _family_store.get(case_id, {})


def _to_lineage(lineage_dict: Dict[str, Any]) -> DerivativeLineage:
    """Convert the agent's dict lineage to the Pydantic DerivativeLineage model."""
    anchors_raw = lineage_dict.get("anchors", []) or []
    anchors = [
        DerivativeAnchor(
            anchor_id=a.get("anchor_id", ""),
            anchor_ref=a.get("anchor_ref", ""),
            anchor_summary=a.get("anchor_summary", ""),
            page_refs=a.get("page_refs", ""),
            transform_strategy=a.get("transform_strategy", ""),
        )
        for a in anchors_raw
    ]
    return DerivativeLineage(
        generated_at=lineage_dict.get("generated_at", ""),
        case_id=lineage_dict.get("case_id", ""),
        parent=lineage_dict.get("parent", {}),
        derivative=lineage_dict.get("derivative", {}),
        subject=lineage_dict.get("subject", {}),
        anchors=anchors,
        is_synthetic=lineage_dict.get("is_synthetic", True),
    )


def _to_generate_response(
    result: Dict[str, Any],
    case_id: str,
    subject_id: str,
    derivative_type_id: str,
) -> DerivativeGenerateResponse:
    """Map an agent generate_derivative_draft result to the Pydantic response model."""
    success = bool(result.get("success"))
    lineage_payload = result.get("lineage")
    lineage = _to_lineage(lineage_payload) if lineage_payload and success else None
    pairing_ok, _ = validate_pairing(subject_id, derivative_type_id)
    return DerivativeGenerateResponse(
        success=success,
        case_id=case_id,
        subject_id=subject_id,
        derivative_type_id=derivative_type_id,
        draft_content=result.get("draft_content", "") if success else "",
        lineage=lineage,
        pairing_valid=pairing_ok,
        is_synthetic=True,
        disclaimer=_SYNTHETIC_DISCLAIMER,
        error=result.get("error"),
    )


# ── Health & Read-Only Registry Endpoints ──────────────────────────────────────
# These endpoints NEVER require the feature flag to be ON. They exist so the UI
# picker can query the registry metadata even while the feature is disabled.

@router.get(
    "/derivative/health",
    summary="Derivative Draft feature health check",
    response_model=dict,
    description=(
        "Returns the activation state of the derivative_drafts feature flag together "
        "with registry metadata counts. Always responds 200 regardless of flag state."
    ),
)
async def derivative_health() -> dict:
    """GET /api/v1/derivative/health — always 200, flag-state report."""
    info = list_all_subjects()
    return {
        "feature": "derivative_drafts",
        "enabled": _FLAG_ON,
        "registry_version": info.get("registry_version", "unknown"),
        "subjects_count": info.get("subjects_count", 0),
        "derivative_types_count": info.get("derivative_types_count", 0),
        "endpoints": [
            "GET  /api/v1/derivative/health",
            "GET  /api/v1/derivative/registry",
            "GET  /api/v1/derivative/subjects",
            "GET  /api/v1/derivative/types",
            "GET  /api/v1/derivative/subject/{subject_id}/types",
            "POST /api/v1/case/{case_id}/derivative/generate",
            "POST /api/v1/case/{case_id}/derivative/family",
            "GET  /api/v1/case/{case_id}/derivative/family",
        ],
        "write_endpoints_require_flag": (
            "All POST endpoints require FEATURE_DERIVATIVE_DRAFTS=true."
        ),
        "disclaimer": _SYNTHETIC_DISCLAIMER,
    }


@router.get(
    "/derivative/registry",
    summary="Dump the full derivative-draft registry",
    response_model=DerivativeRegistryResponse,
    description=(
        "Returns the complete registry: 50 subjects (with applicable_types lists) "
        "+ 12 derivative_types (with bilingual labels, stage hints, and typical "
        "delay windows). Always responds regardless of FEATURE_DERIVATIVE_DRAFTS flag."
    ),
)
async def get_registry() -> DerivativeRegistryResponse:
    """GET /api/v1/derivative/registry — full registry dump for UI picker."""
    info = list_all_subjects()
    if not info.get("success"):
        return DerivativeRegistryResponse(
            success=False,
            error=info.get("error", "Registry load failed."),
            disclaimer=_SYNTHETIC_DISCLAIMER,
        )

    subjects = [
        DerivativeSubjectInfo(
            id=s.get("id", ""),
            label=s.get("label", ""),
            applicable_types=s.get("applicable_types", []),
        )
        for s in info.get("subjects", [])
    ]
    types = [
        DerivativeTypeInfo(
            id=t.get("id", ""),
            label_en=t.get("label_en", ""),
            label_hi=t.get("label_hi", ""),
            parent_anchor=t.get("parent_anchor", ""),
            stage_hint=t.get("stage_hint", ""),
            typical_delay_days=int(t.get("typical_delay_days", 0)),
        )
        for t in info.get("derivative_types", [])
    ]

    return DerivativeRegistryResponse(
        success=True,
        registry_version=info.get("registry_version", ""),
        registry_description=info.get("registry_description", ""),
        last_updated=info.get("last_updated", ""),
        subjects_count=info.get("subjects_count", 0),
        derivative_types_count=info.get("derivative_types_count", 0),
        subjects=subjects,
        derivative_types=types,
        disclaimer=_SYNTHETIC_DISCLAIMER,
    )


@router.get(
    "/derivative/subjects",
    summary="Alias of /derivative/registry (UI picker convenience)",
    response_model=DerivativeRegistryResponse,
    description="Alias for GET /api/v1/derivative/registry — returns the full subjects + types listing.",
)
async def list_subjects_alias() -> DerivativeRegistryResponse:
    return await get_registry()


@router.get(
    "/derivative/types",
    summary="List all 12 derivative types with bilingual labels and stage hints",
    response_model=DerivativeRegistryResponse,
    description=(
        "Returns the derivative_types table only (12 entries) with English+Hindi labels, "
        "parent stage anchors, stage_hint (when in the litigation lifecycle each type is "
        "filed), and typical_delay_days (illustrative filing window after parent stage)."
    ),
)
async def list_derivative_types() -> DerivativeRegistryResponse:
    """GET /api/v1/derivative/types — derivative_types table for UI picker chips."""
    info = list_all_subjects()
    if not info.get("success"):
        return DerivativeRegistryResponse(
            success=False,
            error=info.get("error", "Registry load failed."),
            disclaimer=_SYNTHETIC_DISCLAIMER,
        )
    types = [
        DerivativeTypeInfo(
            id=t.get("id", ""),
            label_en=t.get("label_en", ""),
            label_hi=t.get("label_hi", ""),
            parent_anchor=t.get("parent_anchor", ""),
            stage_hint=t.get("stage_hint", ""),
            typical_delay_days=int(t.get("typical_delay_days", 0)),
        )
        for t in info.get("derivative_types", [])
    ]
    return DerivativeRegistryResponse(
        success=True,
        registry_version=info.get("registry_version", ""),
        derivative_types_count=len(types),
        derivative_types=types,
        disclaimer=_SYNTHETIC_DISCLAIMER,
    )


@router.get(
    "/derivative/subject/{subject_id}/types",
    summary="List derivative_types applicable to a given subject",
    response_model=DerivativeAvailableTypesResponse,
    description=(
        "Returns only the derivative_types whitelisted for the given subject in "
        "registry:derivative_drafts.json:subjects[].applicable_types. Use this before "
        "calling /generate to ensure the UI only offers valid pairings."
    ),
)
async def get_available_types(subject_id: str) -> DerivativeAvailableTypesResponse:
    """GET /api/v1/derivative/subject/{subject_id}/types."""
    info = list_available_derivatives(subject_id)
    if not info.get("success"):
        return DerivativeAvailableTypesResponse(
            success=False,
            error=info.get("error", f"Unknown subject '{subject_id}'."),
        )

    types = [
        DerivativeTypeInfo(
            id=t.get("id", ""),
            label_en=t.get("label_en", ""),
            label_hi=t.get("label_hi", ""),
            parent_anchor=t.get("parent_anchor", ""),
            stage_hint=t.get("stage_hint", ""),
            typical_delay_days=int(t.get("typical_delay_days", 0)),
        )
        for t in info.get("available_types", [])
    ]

    return DerivativeAvailableTypesResponse(
        success=True,
        subject=info.get("subject"),
        available_types=types,
        registry_version=info.get("registry_version", ""),
    )


# ── Write Endpoints (flag-gated) ──────────────────────────────────────────────

def _require_flag() -> None:
    """Raise HTTPException 404 if the feature flag is not enabled."""
    if not _FLAG_ON:
        raise HTTPException(
            status_code=404,
            detail=(
                "Feature 'derivative_drafts' is not enabled. "
                "Set FEATURE_DERIVATIVE_DRAFTS=true to activate POST endpoints."
                " / सुविधा 'derivative_drafts' सक्रिय नहीं है। "
                "POST एंडपॉइंट्स को सक्रिय करने के लिए FEATURE_DERIVATIVE_DRAFTS=true सेट करें।"
            ),
        )


@router.post(
    "/case/{case_id}/derivative/generate",
    response_model=DerivativeGenerateResponse,
    summary="Generate ONE derivative draft for a specific subject × type pairing",
    description=(
        "Takes a parent draft text, subject_id, and derivative_type_id. "
        "Validates the pairing is whitelisted in the registry; extracts anchors; "
        "builds a skeleton; optionally fleshes out via LLM. Returns the draft text "
        "with a rendered lineage audit block AND a structured lineage payload for "
        "the UI tree view. Gated behind FEATURE_DERIVATIVE_DRAFTS."
    ),
)
async def generate_derivative(
    case_id: str,
    request: DerivativeGenerateRequest,
) -> DerivativeGenerateResponse:
    """POST /api/v1/case/{case_id}/derivative/generate."""
    _require_flag()

    if case_id != request.case_id:
        raise HTTPException(
            status_code=422,
            detail=f"case_id in path ('{case_id}') does not match body ('{request.case_id}').",
        )

    # Pairing gate — explicit, before any work is done.
    pairing_valid, pairing_reason = validate_pairing(
        request.subject_id, request.derivative_type_id
    )
    if not pairing_valid:
        return DerivativeGenerateResponse(
            success=False,
            case_id=case_id,
            subject_id=request.subject_id,
            derivative_type_id=request.derivative_type_id,
            pairing_valid=False,
            is_synthetic=True,
            disclaimer=_SYNTHETIC_DISCLAIMER,
            error=(
                f"Invalid subject × derivative_type pairing: {pairing_reason} "
                f"/ अमान्य विषय × व्युत्पन्न-प्रकार युग्म: {pairing_reason}"
            ),
        )

    case_data = case_manager.get_case(case_id)  # may be None; agent handles it gracefully.

    try:
        result = generate_derivative_draft(
            case_id=case_id,
            parent_draft_id=request.parent_draft_id,
            parent_type=request.parent_type,
            parent_draft_text=request.parent_draft_text,
            subject_id=request.subject_id,
            derivative_type_id=request.derivative_type_id,
            case_data=case_data,
            use_llm=request.use_llm,
        )
    except Exception as exc:  # noqa: BLE001
        logger.error(
            "derivative_draft_event",
            extra={
                "event": "generate_endpoint_failed",
                "case_id": case_id,
                "subject_id": request.subject_id,
                "derivative_type_id": request.derivative_type_id,
                "error": str(exc),
            },
            exc_info=True,
        )
        return DerivativeGenerateResponse(
            success=False,
            case_id=case_id,
            subject_id=request.subject_id,
            derivative_type_id=request.derivative_type_id,
            pairing_valid=True,
            is_synthetic=True,
            disclaimer=_SYNTHETIC_DISCLAIMER,
            error=f"Derivative draft generation failed: {exc}",
        )

    return _to_generate_response(
        result,
        case_id=case_id,
        subject_id=request.subject_id,
        derivative_type_id=request.derivative_type_id,
    )


@router.post(
    "/case/{case_id}/derivative/family",
    response_model=DerivativeFamilyResponse,
    summary="Generate the WHOLE document family (all applicable types) for a subject",
    description=(
        "Builds every derivative_type whitelisted for the chosen subject — i.e. the "
        "entire document family in one call. Results are keyed by derivative_type_id "
        "and stored in the in-memory family store for GET retrieval. "
        "Gated behind FEATURE_DERIVATIVE_DRAFTS."
    ),
)
async def generate_family(
    case_id: str,
    request: DerivativeFamilyRequest,
) -> DerivativeFamilyResponse:
    """POST /api/v1/case/{case_id}/derivative/family."""
    _require_flag()

    if case_id != request.case_id:
        raise HTTPException(
            status_code=422,
            detail=f"case_id in path ('{case_id}') does not match body ('{request.case_id}').",
        )

    case_data = case_manager.get_case(case_id)

    try:
        result = build_document_family(
            case_id=case_id,
            parent_draft_id=request.parent_draft_id,
            parent_type=request.parent_type,
            parent_draft_text=request.parent_draft_text,
            subject_id=request.subject_id,
            case_data=case_data,
            use_llm=request.use_llm,
        )
    except Exception as exc:  # noqa: BLE001
        logger.error(
            "derivative_draft_event",
            extra={
                "event": "family_endpoint_failed",
                "case_id": case_id,
                "subject_id": request.subject_id,
                "error": str(exc),
            },
            exc_info=True,
        )
        return DerivativeFamilyResponse(
            success=False,
            case_id=case_id,
            subject_id=request.subject_id,
            parent_draft_id=request.parent_draft_id,
            is_synthetic=True,
            disclaimer=_SYNTHETIC_DISCLAIMER,
            error=f"Document family generation failed: {exc}",
        )

    # Store for the GET endpoint
    if result.get("success"):
        _family_store[case_id] = {
            "subject_id": request.subject_id,
            "parent_draft_id": request.parent_draft_id,
            "stored_at": result.get("generated_at"),
            "family": result.get("family", {}),
        }

    return DerivativeFamilyResponse(
        success=bool(result.get("success")),
        case_id=case_id,
        subject_id=request.subject_id,
        parent_draft_id=request.parent_draft_id,
        generated_at=result.get("generated_at", ""),
        total_types=result.get("total_types", 0),
        success_count=result.get("success_count", 0),
        failed_types=result.get("failed_types", []),
        family=result.get("family", {}),
        is_synthetic=True,
        disclaimer=_SYNTHETIC_DISCLAIMER,
        error=result.get("error"),
    )


@router.get(
    "/case/{case_id}/derivative/family",
    response_model=dict,
    summary="Retrieve the stored document family for a case",
    description=(
        "Returns the stored document family last produced by POST /family for the "
        "given case_id (404 if none has been generated yet). "
        "Gated behind FEATURE_DERIVATIVE_DRAFTS."
    ),
)
async def get_family(case_id: str) -> dict:
    """GET /api/v1/case/{case_id}/derivative/family."""
    _require_flag()

    case_data = case_manager.get_case(case_id)
    if not case_data:
        raise HTTPException(status_code=404, detail="Case not found.")
    return {"success": True, "family": _load_family(case_id)}
