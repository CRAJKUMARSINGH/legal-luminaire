"""
Backend Drafting Routes — Week 4/11 Drafting Engine
Generates Case Briefs, Discharge, and Bail Applications using Gemini.
"""
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import Optional
import os
import logging
from api.case_manager import case_manager
from api.court_styles import get_style_for_court
from api.redaction_utils import redact_indian_pii

router = APIRouter()
logger = logging.getLogger(__name__)

class DraftRequest(BaseModel):
    case_id: str
    draft_type: str  # "BRIEF" | "DISCHARGE" | "BAIL_439"
    additional_notes: Optional[str] = ""

class DraftResponse(BaseModel):
    success: bool
    draft_content: str
    error: Optional[str] = None

async def _generate_draft_impl(case_id: str, draft_type: str, additional_notes: Optional[str] = ""):
    """Internal implementation shared by both path-param and body-param routes."""
    logger.info(
        "case_event",
        extra={
            "event": "draft_start",
            "case_id": case_id,
            "draft_type": draft_type,
        }
    )

    case_data = case_manager.get_case(case_id)
    if not case_data:
        logger.warning(
            "case_event",
            extra={"event": "draft_case_not_found", "case_id": case_id}
        )
        raise HTTPException(status_code=404, detail="Case not found.")

    gemini_key = os.environ.get("GOOGLE_API_KEY", "")
    if not gemini_key:
        logger.warning(
            "case_event",
            extra={"event": "draft_gemini_not_configured", "case_id": case_id}
        )
        return DraftResponse(
            success=False,
            draft_content="",
            error="GOOGLE_API_KEY not set. Cannot generate AI draft."
        )

    case_title = case_data.get("title", "Untitled")
    court = case_data.get("court", "Unknown")
    timeline = case_data.get("timeline", [])
    grounding = case_data.get("forensic_grounding", [])
    brief = case_data.get("brief", "")

    context_str = f"Case: {case_title}\nCourt: {court}\nBrief: {brief}\n\nTimeline/Facts:\n"
    for e in timeline:
        grounding_note = f" (Grounding: {e['grounding']})" if e.get("grounding") else ""
        context_str += f"- {e.get('date', 'Unknown')}: {e.get('title', 'Unknown')}{grounding_note}\n"

    if grounding:
        context_str += "\nForensic Standards/Gaps:\n"
        for g in grounding:
            context_str += f"- {g['code']}: {g['title']}\n  Violations: {', '.join(g['violations'])}\n"

    if draft_type == "BRIEF":
        system_prompt = (
            "You are a senior legal strategist in India. Generate a professional 'Senior Advocate Brief'. "
            "It must be concise, highlighting the core facts, current status, and the most critical forensic gaps for a cross-examination strategy."
        )
    elif draft_type == "DISCHARGE":
        system_prompt = (
            "You are a senior criminal lawyer in India. Generate a formal 'Application for Discharge' under CrPC/BNS context. "
            "Emphasize the failure to follow Indian Standards (BIS/IS) mentioned in the context. "
            "Use standard Indian court formatting (In the Court of..., State vs..., Application for Discharge under Section...)."
        )
    elif draft_type == "BAIL_439":
        system_prompt = (
            "You are a senior criminal lawyer in India. Generate a formal 'Bail Application under Section 439 of CrPC' (or Section 483 of BNSS). "
            "Focus on the 'Nascent Advocate' priority: ensure all extracted names, dates, and jurisdictions are correctly placed. "
            "Argue that the accused is entitled to bail because of procedural inconsistencies and the lack of flight risk."
        )
    else:
        system_prompt = "You are a senior legal assistant. Generate a professional legal memo based on the context."

    style_info = get_style_for_court(court)
    system_prompt += f"\n\n{style_info['prompt_fragment']}"
    system_prompt += "\nFormat the output with clear headers and bullet points."

    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.prompts import ChatPromptTemplate

        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=gemini_key,
            temperature=0.3,
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "Context:\n{context}\n\nAdditional Guidance: {notes}\n\nGenerate the draft now.")
        ])

        chain = prompt | llm
        result = chain.invoke({
            "context": redact_indian_pii(context_str),
            "notes": redact_indian_pii(additional_notes or ""),
        })

        logger.info(
            "case_event",
            extra={
                "event": "draft_complete",
                "case_id": case_id,
                "draft_type": draft_type,
                "draft_length": len(result.content),
            }
        )

        return DraftResponse(success=True, draft_content=result.content)
    except Exception as e:
        logger.error(
            "case_event",
            extra={
                "event": "draft_failed",
                "case_id": case_id,
                "error": str(e),
            }
        )
        return DraftResponse(success=False, draft_content="", error=str(e))


@router.post("/generate-draft", response_model=DraftResponse)
async def generate_draft(req: DraftRequest):
    """Generate a legal document draft based on Case Data and Week 3 Grounding.
    Legacy route: case_id provided in request body.
    Prefer /cases/{case_id}/generate-draft for new integrations."""
    return await _generate_draft_impl(req.case_id, req.draft_type, req.additional_notes)


@router.post("/cases/{case_id}/generate-draft", response_model=DraftResponse)
async def generate_draft_for_case(
    case_id: str,
    draft_type: str = Body(..., embed=False, description="BRIEF | DISCHARGE | BAIL_439"),
    additional_notes: Optional[str] = Body(default="", embed=False),
):
    """Generate a legal document draft for a specific case.
    Week 2 multi-case route: case_id provided via URL path.
    Backward compatible with both URL param and request body."""
    return await _generate_draft_impl(case_id, draft_type, additional_notes)
