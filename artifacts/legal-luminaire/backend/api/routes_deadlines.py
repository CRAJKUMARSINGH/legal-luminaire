"""
routes_deadlines.py — Limitation & Deadline Engine API (Week 9)
================================================================

Endpoints:
  GET  /api/v1/case/{case_id}/deadlines         — full computed schedule for a case
  GET  /api/v1/case/{case_id}/deadlines/urgent  — only URGENT + OVERDUE items
  GET  /api/v1/deadlines/rules                  — list all loaded limitation rules
  GET  /api/v1/deadlines/health                 — feature flag state check

Design rules enforced here:
  1. Flag-gated   — FEATURE_DEADLINE_ENGINE must be "true" or endpoints return 404.
                    /health always responds regardless of flag state.
  2. Deterministic — all computation delegated to limitation_engine.py; no LLM path.
  3. Traceable    — every item carries rule_id, basis_en, basis_hi, source_note.
  4. SYNTHETIC    — is_synthetic: true on all items; disclaimer in every response.
  5. Rate-limited — /case/{id}/deadlines is in heavy_markers in main.py.
"""
from __future__ import annotations

import logging
import os
from datetime import date
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from .models import (
    DeadlineItem,
    DeadlineScheduleResponse,
)
from services.limitation_engine import (
    compute_for_case,
    load_rules,
    ComputedDeadline,
)

logger = logging.getLogger(__name__)

# ── Feature-flag guard ─────────────────────────────────────────────────────────
_FLAG_ON = os.getenv("FEATURE_DEADLINE_ENGINE", "false").strip().lower() in (
    "1", "true", "yes", "on"
)

_SYNTHETIC_DISCLAIMER = (
    "All dates and deadlines are SYNTHETIC/DEMO only. "
    "Verify every rule against current statute text before professional use. "
    "/ सभी तिथियाँ और समय-सीमाएँ संश्लेषित/डेमो हैं। "
    "व्यावसायिक उपयोग से पहले वर्तमान विधि-पाठ से सत्यापित करें।"
)

# ── Router ─────────────────────────────────────────────────────────────────────
router = APIRouter(tags=["deadlines"])


# ── Converters ────────────────────────────────────────────────────────────────

def _to_deadline_item(dl: ComputedDeadline) -> DeadlineItem:
    """Convert a ComputedDeadline dataclass to a Pydantic DeadlineItem."""
    return DeadlineItem(
        rule_id=dl.rule_id,
        case_id=dl.case_id,
        event_type=dl.event_type,
        event_date=dl.event_date.isoformat() if dl.event_date else None,
        due_date=dl.due_date.isoformat() if dl.due_date else None,
        days_remaining=dl.days_remaining,
        status=dl.status,
        name=dl.name,
        name_hi=dl.name_hi,
        basis_en=dl.basis_en,
        basis_hi=dl.basis_hi,
        statute=dl.statute,
        section=dl.section,
        source_note=dl.source_note,
        period_days=dl.period_days,
        period_basis=dl.period_basis,
        consequence=dl.consequence,
        consequence_hi=dl.consequence_hi,
        computed_at=dl.computed_at,
        is_synthetic=dl.is_synthetic,
        completed=dl.completed,
    )


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get(
    "/deadlines/health",
    summary="Deadline engine feature health check",
    response_model=dict,
    description=(
        "Returns the current activation state of the deadline_engine feature flag. "
        "Always responds 200 regardless of flag state. Never rate-limited."
    ),
)
async def deadlines_health() -> dict:
    """GET /api/v1/deadlines/health — always 200, flag-state report."""
    try:
        rules = load_rules()
        rule_count = len(rules)
    except Exception:
        rule_count = 0

    return {
        "feature": "deadline_engine",
        "enabled": _FLAG_ON,
        "rule_count": rule_count,
        "endpoints": [
            "GET /api/v1/case/{case_id}/deadlines",
            "GET /api/v1/case/{case_id}/deadlines/urgent",
            "GET /api/v1/deadlines/rules",
        ],
        "disclaimer": _SYNTHETIC_DISCLAIMER,
    }


@router.get(
    "/deadlines/rules",
    summary="List all limitation rules",
    response_model=dict,
    description=(
        "Returns the full versioned rule table. "
        "Every rule includes source_note and illustrative disclaimer. "
        "Gated behind FEATURE_DEADLINE_ENGINE."
    ),
)
async def list_rules() -> dict:
    """GET /api/v1/deadlines/rules — rule table dump."""
    if not _FLAG_ON:
        raise HTTPException(
            status_code=404,
            detail=(
                "Feature 'deadline_engine' is not enabled. "
                "Set FEATURE_DEADLINE_ENGINE=true to activate."
            ),
        )
    try:
        rules = load_rules()
    except Exception as exc:
        logger.error("Failed to load limitation rules: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Could not load rule table.")

    return {
        "rule_count": len(rules),
        "disclaimer": _SYNTHETIC_DISCLAIMER,
        "rules": [
            {
                "id": r.id,
                "name": r.name,
                "name_hi": r.name_hi,
                "statute": r.statute,
                "section": r.section,
                "event_type": r.event_type,
                "period_days": r.period_days,
                "period_basis": r.period_basis,
                "applies_to": r.applies_to,
                "extension_rule": r.extension_rule,
                "consequence": r.consequence,
                "consequence_hi": r.consequence_hi,
                "source_note": r.source_note,
                "blocked_from_draft": r.blocked_from_draft,
            }
            for r in rules
        ],
    }


@router.get(
    "/case/{case_id}/deadlines",
    response_model=DeadlineScheduleResponse,
    summary="Compute full deadline schedule for a case",
    description=(
        "Deterministic deadline computation from the case's synthetic event dates "
        "and the versioned limitation rule table. No LLM in the computation path. "
        "Every item carries rule_id + bilingual basis string. "
        "Items where event date is missing return status='CANNOT_COMPUTE'. "
        "Gated behind FEATURE_DEADLINE_ENGINE."
    ),
)
async def get_case_deadlines(
    case_id: str,
    reference_date: Optional[str] = Query(
        default=None,
        description=(
            "ISO-8601 reference date for 'days_remaining' calculation (YYYY-MM-DD). "
            "Defaults to server date. Useful for testing and demo scenarios."
        ),
    ),
) -> DeadlineScheduleResponse:
    """
    GET /api/v1/case/{case_id}/deadlines

    Returns the complete computed deadline schedule for the specified synthetic case.

    Pipeline:
      1. Flag check
      2. Parse optional reference_date
      3. Load case event dates from uploaded_cases/<case_id>/<case_id>_Deadline_Events.json
      4. Load limitation rules from services/limitation_rules.json
      5. Compute all deadlines (deterministic, no LLM)
      6. Build DeadlineScheduleResponse with disclaimer
    """
    if not _FLAG_ON:
        raise HTTPException(
            status_code=404,
            detail=(
                "Feature 'deadline_engine' is not enabled. "
                "Set FEATURE_DEADLINE_ENGINE=true to activate."
            ),
        )

    # Parse optional reference_date
    today: Optional[date] = None
    if reference_date:
        try:
            today = date.fromisoformat(reference_date)
        except ValueError:
            raise HTTPException(
                status_code=422,
                detail=(
                    f"Invalid reference_date '{reference_date}'. "
                    "Expected ISO-8601 format: YYYY-MM-DD."
                ),
            )

    # Compute
    try:
        computed = compute_for_case(case_id=case_id, today=today)
    except Exception as exc:
        logger.error(
            "Deadline computation failed for case %s: %s", case_id, exc, exc_info=True
        )
        raise HTTPException(
            status_code=500,
            detail=f"Deadline computation failed for case '{case_id}'. Please retry.",
        )

    items = [_to_deadline_item(dl) for dl in computed]

    # Summary counts
    status_counts: dict[str, int] = {}
    for item in items:
        status_counts[item.status] = status_counts.get(item.status, 0) + 1

    return DeadlineScheduleResponse(
        case_id=case_id,
        computed_at=(today or date.today()).isoformat(),
        total=len(items),
        status_counts=status_counts,
        items=items,
        disclaimer=_SYNTHETIC_DISCLAIMER,
    )


@router.get(
    "/case/{case_id}/deadlines/urgent",
    response_model=DeadlineScheduleResponse,
    summary="Fetch only urgent and overdue deadlines for a case",
    description=(
        "Filters the full deadline schedule to URGENT (≤14 days) and OVERDUE items only. "
        "Useful for dashboard summary panels. "
        "Gated behind FEATURE_DEADLINE_ENGINE."
    ),
)
async def get_urgent_deadlines(
    case_id: str,
    reference_date: Optional[str] = Query(
        default=None,
        description="ISO-8601 reference date (YYYY-MM-DD). Defaults to server date.",
    ),
) -> DeadlineScheduleResponse:
    """
    GET /api/v1/case/{case_id}/deadlines/urgent

    Returns only URGENT and OVERDUE deadlines from the full computed schedule.
    """
    if not _FLAG_ON:
        raise HTTPException(
            status_code=404,
            detail=(
                "Feature 'deadline_engine' is not enabled. "
                "Set FEATURE_DEADLINE_ENGINE=true to activate."
            ),
        )

    today: Optional[date] = None
    if reference_date:
        try:
            today = date.fromisoformat(reference_date)
        except ValueError:
            raise HTTPException(
                status_code=422,
                detail=f"Invalid reference_date '{reference_date}'. Expected YYYY-MM-DD.",
            )

    try:
        computed = compute_for_case(case_id=case_id, today=today)
    except Exception as exc:
        logger.error(
            "Urgent deadline fetch failed for case %s: %s", case_id, exc, exc_info=True
        )
        raise HTTPException(
            status_code=500,
            detail=f"Deadline computation failed for case '{case_id}'. Please retry.",
        )

    urgent_items = [
        _to_deadline_item(dl)
        for dl in computed
        if dl.status in {"URGENT", "OVERDUE"}
    ]

    status_counts: dict[str, int] = {}
    for item in urgent_items:
        status_counts[item.status] = status_counts.get(item.status, 0) + 1

    return DeadlineScheduleResponse(
        case_id=case_id,
        computed_at=(today or date.today()).isoformat(),
        total=len(urgent_items),
        status_counts=status_counts,
        items=urgent_items,
        disclaimer=_SYNTHETIC_DISCLAIMER,
    )
