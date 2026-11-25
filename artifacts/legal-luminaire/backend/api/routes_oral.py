"""
Backend Oral Arguments & Cross-Examination Routes — Week 7
Generates tactical cross-examination questions and oral arguments.
"""
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import Optional, List
import os
import logging
from api.case_manager import case_manager
from api.redaction_utils import redact_indian_pii

router = APIRouter()
logger = logging.getLogger(__name__)

class CrossExamRequest(BaseModel):
    case_id: str
    witness_type: str  # "IO" | "FSL_EXPERT" | "SEIZURE_WITNESS"
    additional_context: Optional[str] = ""

class CrossExamResponse(BaseModel):
    success: bool
    questions: List[str]
    strategy_note: str
    error: Optional[str] = None

@router.post("/generate-cross-exam", response_model=CrossExamResponse)
async def generate_cross_exam(req: CrossExamRequest):
    """Generate tactical cross-examination questions based on Case Forensic Gaps."""
    case_data = case_manager.get_case(req.case_id)
    if not case_data:
        raise HTTPException(status_code=404, detail="Case not found.")

    gemini_key = os.environ.get("GOOGLE_API_KEY", "")
    if not gemini_key:
        return CrossExamResponse(
            success=False, questions=[], strategy_note="", 
            error="GOOGLE_API_KEY not set."
        )

    # ── Prepare Context ────────────────────────────────────────────────────────
    grounding = case_data.get("forensic_grounding", [])
    timeline = case_data.get("timeline", [])
    
    context_str = f"Witness to be examined: {req.witness_type}\n\nForensic Standards/Gaps identified in Case:\n"
    for g in grounding:
        context_str += f"- {g['code']}: {g['title']}\n  Violations: {', '.join(g['violations'])}\n"

    # ── Select Prompt ──────────────────────────────────────────────────────────
    system_prompt = (
        "You are a top criminal defense lawyer in India specializing in forensic evidence. "
        f"Generate 10 critical cross-examination questions for a {redact_indian_pii(req.witness_type)}. "
        "The questions must be 'leading questions' designed to expose procedural lapses in sampling, "
        "seizure, or lab testing based on the Indian Standards (BIS/IS) provided in the context. "
        "Output each question starting with 'Q: '. "
        "Also provide a 'Strategy Note' on how to destroy the witness's credibility regarding the forensic report."
    )

    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.prompts import ChatPromptTemplate
        
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=gemini_key,
            temperature=0.4,
        )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "Context:\n{context}\n\nAdditional Guidance: {notes}\n\nGenerate the questions and strategy note.")
        ])
        
        chain = prompt | llm
        result = chain.invoke({
            "context": redact_indian_pii(context_str),
            "notes": redact_indian_pii(req.additional_context or ""),
        })
        
        lines = result.content.split("\n")
        questions = [l.replace("Q: ", "").strip() for l in lines if l.startswith("Q: ")]
        
        # Strategy note is usually the rest
        strategy_note = "\n".join([l for l in lines if not l.startswith("Q: ") and l.strip()])

        return CrossExamResponse(
            success=True, 
            questions=questions, 
            strategy_note=strategy_note
        )
    except Exception as e:
        logger.error(f"Cross-exam generation failed: {e}")
        return CrossExamResponse(success=False, questions=[], strategy_note="", error=str(e))
