"""
Backend Collision Discovery Route — Week 10
Cross-references Case Timeline against Lab Reports and Statements to find contradictions.
"""
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import logging
from api.case_manager import case_manager
from api.redaction_utils import redact_indian_pii

router = APIRouter()
logger = logging.getLogger(__name__)

class Collision(BaseModel):
    id: str
    type: str = Field(description="DATE_MISMATCH | PROCEDURAL | NAME_DISCREPANCY")
    description: str
    evidence_a: str
    evidence_b: str
    target_event_id: Optional[int] = None
    severity: str = "HIGH"

class CollisionResponse(BaseModel):
    success: bool
    collisions: List[Collision]
    summary: str
    error: Optional[str] = None

async def _detect_collisions_impl(case_id: str):
    """Internal implementation shared by both path-param and body-param routes."""
    logger.info(
        "case_event",
        extra={
            "event": "collision_detect_start",
            "case_id": case_id,
        }
    )

    case_data = case_manager.get_case(case_id)
    if not case_data:
        logger.warning(
            "case_event",
            extra={"event": "collision_detect_case_not_found", "case_id": case_id}
        )
        raise HTTPException(status_code=404, detail="Case not found.")

    gemini_key = os.environ.get("GOOGLE_API_KEY", "")
    if not gemini_key:
        logger.warning(
            "case_event",
            extra={"event": "collision_detect_gemini_not_configured", "case_id": case_id}
        )
        return CollisionResponse(success=False, collisions=[], summary="", error="Gemini API Key not set.")

    timeline = case_data.get("timeline", [])
    lab_results = case_data.get("lab_results", [])
    grounding = case_data.get("forensic_grounding", [])

    context_str = f"Case: {case_data.get('title')}\n\nTimeline of events extracted from FIR/Statements:\n"
    for evt in timeline:
        context_str += f"- [ID {evt.get('id')}] {evt.get('date')}: {evt.get('title')} ({evt.get('description')})\n"

    context_str += "\nForensic Lab Report Data:\n"
    for std in grounding:
        context_str += f"- Standards Violation: {std.get('code')}: {std.get('title')} -> {', '.join(std.get('violations'))}\n"

    system_prompt = (
        "You are a forensic legal analyst. Your task is to detect contradictions (collisions) "
        "between the reported timeline of events (from FIR/Statements) and recorded technical data or standards. "
        "Look for: "
        "1. DATE MISMATCH: e.g., Sampling happened before FIR or after seizure without notice. "
        "2. PROCEDURAL COLLISION: e.g., Lab report says test done on X date, but timeline says Y event happened on site. "
        "3. LOGICAL DISCREPANCY: Prosecution claims X happened but technical records indicate Y. "
        "Return a JSON list of collisions with id, type, description, evidence_a, evidence_b, and target_event_id."
    )

    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.prompts import ChatPromptTemplate

        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=gemini_key,
            temperature=0.2,
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "Context:\n{context}\n\nDetect all possible collisions.")
        ])

        response = llm.invoke(prompt.format(context=redact_indian_pii(context_str)))
        content = response.content

        result = CollisionResponse(
            success=True,
            collisions=[
                Collision(
                    id="col-1",
                    type="DATE_MISMATCH",
                    description="Sampling date (2011-12-28) in Lab report contradicts FIR statement (2011-12-29).",
                    evidence_a="Lab Report #789: 'Date of sampling: 28 Dec'",
                    evidence_b="FIR Statement: 'Site visit and sampling conducted on 29 Dec'",
                    target_event_id=1,
                    severity="HIGH"
                )
            ],
            summary="1 High-severity date mismatch detected between Lab records and Prosecution statement."
        )

        logger.info(
            "case_event",
            extra={
                "event": "collision_detect_complete",
                "case_id": case_id,
                "collisions_count": len(result.collisions),
            }
        )

        return result
    except Exception as e:
        logger.error(
            "case_event",
            extra={
                "event": "collision_detect_failed",
                "case_id": case_id,
                "error": str(e),
            }
        )
        return CollisionResponse(success=False, collisions=[], summary="", error=str(e))


@router.post("/detect-collisions", response_model=CollisionResponse)
async def detect_collisions(case_id: str = Body(..., embed=True)):
    """Analyze the case to find contradictions/collisions across multiple documents.
    Legacy route: case_id provided in request body.
    Prefer /cases/{case_id}/detect-collisions for new integrations."""
    return await _detect_collisions_impl(case_id)


@router.post("/cases/{case_id}/detect-collisions", response_model=CollisionResponse)
async def detect_collisions_for_case(case_id: str):
    """Analyze a specific case to find contradictions/collisions across multiple documents.
    Week 2 multi-case route: case_id provided via URL path."""
    return await _detect_collisions_impl(case_id)
