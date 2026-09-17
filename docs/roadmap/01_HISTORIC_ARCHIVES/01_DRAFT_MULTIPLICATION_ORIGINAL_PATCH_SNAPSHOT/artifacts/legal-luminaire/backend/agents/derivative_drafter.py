"""Derivative Draft Generator — multiplies a parent draft into its document family.

Given a case, a parent draft, a subject and a derivative type, produces the
derived pleading using the registry's terminology + authority blocks piped
in from Citation Search. Purely additive to routes_drafting.py.
"""
from __future__ import annotations

import logging
import os
import re
from typing import Any, Dict, List, Optional

from registry import (
    build_system_prompt,
    authority_blocks_to_prompt,
    get_derivative_type,
)

logger = logging.getLogger(__name__)

CITATION_MARKER_RE = re.compile(
    r"(\bAIR\s+\d{4}\s+[A-Z]+\s+\d+)|"
    r"(\(\d{4}\)\s*\d+\s*[A-Z]+\s+\d+)|"
    r"(\b\d{4}\s*\(\d+\)\s*[A-Z]+\s*\d+)|"
    r"(\b[0-9]{1,3}\s*[A-Z]{2,}\s*\d{3,4}\b)"
)


def extract_citations(text: str) -> List[str]:
    """Extract likely citations from a draft body for verification."""
    matches = CITATION_MARKER_RE.findall(text)
    flat = [m for tup in matches for m in tup if m]
    return sorted(set(flat))


def generate_derivative_draft(
    case_data: Dict[str, Any],
    subject_id: str,
    derivative_type_id: str,
    parent_draft: Optional[Dict[str, Any]] = None,
    additional_notes: str = "",
    authority_blocks: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """Build the prompt context and generate a derivative draft via Gemini.

    Returns a dict: {success, draft_content, lineage, error}.
    The lineage record is persisted by the caller (routes_derivative).
    """
    dtype = get_derivative_type(derivative_type_id)
    if not dtype:
        return {"success": False, "draft_content": "", "lineage": None,
                "error": f"Unknown derivative type '{derivative_type_id}'."}

    gemini_key = os.environ.get("GOOGLE_API_KEY", "")
    if not gemini_key:
        return {"success": False, "draft_content": "", "lineage": None,
                "error": "GOOGLE_API_KEY not set. Cannot generate AI draft."}

    court = case_data.get("court", "")
    case_title = case_data.get("title", "Untitled")
    timeline = case_data.get("timeline", [])

    context_str = f"Case: {case_title}\nCourt: {court}\n"
    brief = case_data.get("brief", "")
    if brief:
        context_str += f"Brief: {brief}\n"
    if timeline:
        context_str += "\nTimeline/Facts:\n"
        for e in timeline:
            grounding_note = f" (Grounding: {e['grounding']})" if e.get("grounding") else ""
            context_str += f"- {e.get('date', 'Unknown')}: {e.get('title', 'Unknown')}{grounding_note}\n"

    if parent_draft:
        context_str += (
            "\nPARENT DRAFT (the document this derivative responds to / extends):\n"
            f"- Title: {parent_draft.get('title', 'Untitled')}\n"
            f"- Type: {parent_draft.get('draft_type', 'unknown')}\n"
            f"- Generated: {parent_draft.get('generated_at', 'unknown')}\n"
            f"- Body (verbatim, maintain consistency):\n{parent_draft.get('content', '')[:6000]}\n"
        )

    context_str += authority_blocks_to_prompt(authority_blocks or [])

    system_prompt = build_system_prompt(dtype, subject_id, court=court)

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
            ("human", "Context:\n{context}\n\nAdditional Guidance: {notes}\n\nGenerate the derivative draft now."),
        ])
        chain = prompt | llm
        result = chain.invoke({"context": context_str, "notes": additional_notes})

        draft_text = result.content
        citations_found = extract_citations(draft_text)

        lineage = {
            "derivative_type_id": derivative_type_id,
            "derivative_type_label": dtype["label"],
            "subject_id": subject_id,
            "parent_draft_id": (parent_draft or {}).get("id"),
            "authority_ids": [a.get("id") for a in (authority_blocks or [])],
            "citations_extracted": citations_found,
        }
        logger.info(
            "case_event",
            extra={"event": "derivative_draft_complete",
                   "case_id": case_data.get("id", "unknown"),
                   "derivative_type": derivative_type_id,
                   "draft_length": len(draft_text)},
        )
        return {"success": True, "draft_content": draft_text, "lineage": lineage, "error": None}
    except Exception as e:  # noqa: BLE001
        logger.error("case_event", extra={"event": "derivative_draft_failed", "error": str(e)})
        return {"success": False, "draft_content": "", "lineage": None, "error": str(e)}
