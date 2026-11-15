"""
Backend Citation Verification Route — Structural Registry Check.

Replaced the previous law_db.json string-match approach with the structured
citation_registry.py lookup. The registry is the authoritative Python mirror
of the TypeScript verification-engine.ts PRECEDENT_ACCURACY array.

Verification tiers:
  COURT_SAFE   — certified copy + para confirmed → safe to export
  VERIFIED     — existence confirmed on official source → safe with note
  SECONDARY    — credible secondary source → allowed with qualification
  PENDING      — unverified → BLOCKED from all exports
  FATAL_ERROR  — fabricated/mismatched → BLOCKED
  UNRECOGNISED — not in registry → requires human review before filing
"""
from __future__ import annotations

import logging
from typing import List, Optional

from fastapi import APIRouter, Body
from pydantic import BaseModel, Field

from api.citation_registry import REGISTRY, lookup, extract_citation_fragments

router = APIRouter()
logger = logging.getLogger(__name__)


class VerifyRequest(BaseModel):
    citations: List[str]
    case_id: Optional[str] = Field(
        default=None,
        description="Optional case context for verification scope",
    )


class CitationStatus(BaseModel):
    citation: str
    tier: str                        # COURT_SAFE/VERIFIED/SECONDARY/PENDING/FATAL_ERROR/UNRECOGNISED
    blocked: bool                    # True → must not appear in filed documents
    verified: bool                   # True when tier is COURT_SAFE or VERIFIED
    registry_id: Optional[str]       # Registry entry id if matched
    details: Optional[str]           # Verification note or reason
    source_note: str                 # Human-readable explanation


class VerifyResponse(BaseModel):
    success: bool
    results: List[CitationStatus]
    all_verified: bool
    has_blocked: bool
    has_secondary: bool
    has_unrecognised: bool
    export_safe: bool                # True only when no PENDING/FATAL_ERROR/UNRECOGNISED
    source_note: str = (
        "Verified against internal citation registry. "
        "This is not a live check against Manupatra or SCC Online. "
        "Court-safe export requires COURT_SAFE or VERIFIED tier with no BLOCKED citations."
    )


async def _verify_citations_impl(
    citations: List[str],
    case_id: Optional[str] = None,
) -> VerifyResponse:
    """
    Structural citation verification against the authoritative registry.

    For each supplied citation string:
      1. Look up in registry by exact citation, alias, or token overlap.
      2. Return tier, blocked status, and verification note.
      3. UNRECOGNISED = not in registry → human review required.
    """
    logger.info(
        "case_event",
        extra={
            "event": "citation_verify_start",
            "case_id": case_id or "unspecified",
            "citations_count": len(citations),
        },
    )

    results: list[CitationStatus] = []
    has_blocked = False
    has_secondary = False
    has_unrecognised = False

    for cite in citations:
        cite_stripped = cite.strip()
        entry = lookup(cite_stripped)

        if entry is None:
            has_unrecognised = True
            results.append(CitationStatus(
                citation=cite_stripped,
                tier="UNRECOGNISED",
                blocked=False,
                verified=False,
                registry_id=None,
                details="Not found in citation registry. Human review required before filing.",
                source_note=(
                    "Citation not in registry. Possible fabrication, spelling variation, "
                    "or citation not yet added. Verify against Manupatra/SCC Online before use."
                ),
            ))
            continue

        if entry.blocked or entry.tier in ("PENDING", "FATAL_ERROR"):
            has_blocked = True
        elif entry.tier == "SECONDARY":
            has_secondary = True

        results.append(CitationStatus(
            citation=cite_stripped,
            tier=entry.tier,
            blocked=entry.blocked,
            verified=entry.tier in ("COURT_SAFE", "VERIFIED"),
            registry_id=entry.id,
            details=entry.verification_note,
            source_note=(
                f"Matched registry entry '{entry.id}'. "
                f"Tier: {entry.tier}. "
                + ("BLOCKED from export." if entry.blocked else "")
            ),
        ))

    all_verified = all(r.verified for r in results)
    export_safe = not has_blocked and not has_unrecognised

    verified_count = sum(1 for r in results if r.verified)
    logger.info(
        "case_event",
        extra={
            "event": "citation_verify_complete",
            "case_id": case_id or "unspecified",
            "verified_count": verified_count,
            "total_count": len(results),
            "has_blocked": has_blocked,
            "has_secondary": has_secondary,
            "has_unrecognised": has_unrecognised,
            "export_safe": export_safe,
        },
    )

    return VerifyResponse(
        success=True,
        results=results,
        all_verified=all_verified,
        has_blocked=has_blocked,
        has_secondary=has_secondary,
        has_unrecognised=has_unrecognised,
        export_safe=export_safe,
    )


@router.post("/verify-citations", response_model=VerifyResponse)
async def verify_citations(req: VerifyRequest):
    """
    Structurally verify a list of citations against the authoritative registry.
    Returns tier, blocked status, and verification note for each citation.
    Legacy route: optional case_id in request body.
    """
    return await _verify_citations_impl(req.citations, req.case_id)


@router.post("/cases/{case_id}/verify-citations", response_model=VerifyResponse)
async def verify_citations_for_case(
    case_id: str,
    citations: List[str] = Body(..., embed=False),
):
    """
    Verify citations within a specific case context.
    Week 2 multi-case route: case_id provided via URL path.
    """
    return await _verify_citations_impl(citations, case_id)
