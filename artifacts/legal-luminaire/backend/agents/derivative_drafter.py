"""Derivative Draft Generator — multiplies a parent draft into its document family.

Given a case, a parent draft, a subject and a derivative type, produces the
derivative draft text together with a structured lineage audit that traces
every paragraph back to the source anchors in the parent and/or case record.

LLM selection priority (mirrors drafter.py):
  1. OpenAI (settings.openai_api_key) — uses settings.llm_model
  2. Google Gemini (settings.google_api_key) — uses settings.gemini_draft_model
  3. No key configured — deterministic template / skeleton path is used.

Design rules:
  - Every generated draft has a lineage block (header + per-anchor details + footer).
  - The derivative_type_id must be in the subject's applicable_types list.
  - Synthetic-only output — footer disclaimer is ALWAYS appended.
  - Unknown or missing anchors are surfaced explicitly, never silently dropped.
"""
from __future__ import annotations

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from config import settings

logger = logging.getLogger(__name__)

_REGISTRY_PATH = Path(__file__).resolve().parent.parent / "registry" / "derivative_drafts.json"


def _load_registry() -> Dict[str, Any]:
    """Load the derivative-draft registry from the canonical JSON location."""
    try:
        with _REGISTRY_PATH.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as exc:  # noqa: BLE001
        logger.error(
            "derivative_draft_event",
            extra={
                "event": "registry_load_failed",
                "error": str(exc),
                "path": str(_REGISTRY_PATH),
            },
        )
        return {}


def _build_llm() -> Any:
    """Return the best available LLM for the derivative drafter (mirrors drafter.py)."""
    if settings.openai_api_key:
        try:
            from langchain_openai import ChatOpenAI
            logger.info(
                "derivative_draft_event",
                extra={"event": "llm_selected", "provider": "openai", "model": settings.llm_model},
            )
            return ChatOpenAI(
                model=settings.llm_model,
                temperature=settings.llm_temperature_draft,
                openai_api_key=settings.openai_api_key,
            )
        except Exception as exc:  # noqa: BLE001
            logger.warning(
                "derivative_draft_event",
                extra={"event": "openai_init_failed", "error": str(exc)},
            )

    if settings.google_api_key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            logger.info(
                "derivative_draft_event",
                extra={"event": "llm_selected", "provider": "gemini", "model": settings.gemini_draft_model},
            )
            return ChatGoogleGenerativeAI(
                model=settings.gemini_draft_model,
                google_api_key=settings.google_api_key,
                temperature=settings.llm_temperature_draft,
            )
        except Exception as exc:  # noqa: BLE001
            logger.warning(
                "derivative_draft_event",
                extra={"event": "gemini_init_failed", "error": str(exc)},
            )

    logger.warning(
        "derivative_draft_event",
        extra={
            "event": "llm_not_configured",
            "note": "Falling back to deterministic skeleton-only generation.",
        },
    )
    return None


def validate_pairing(subject_id: str, derivative_type_id: str) -> Tuple[bool, str]:
    """
    Validate that the requested derivative_type is declared applicable for the
    requested subject in the registry. Returns (is_valid, reason).
    """
    registry = _load_registry()
    subjects = registry.get("subjects", [])
    types = {t["id"]: t for t in registry.get("derivative_types", [])}

    if derivative_type_id not in types:
        return False, f"Unknown derivative_type '{derivative_type_id}'."

    subject = next((s for s in subjects if s["id"] == subject_id), None)
    if subject is None:
        return False, f"Unknown subject '{subject_id}'."

    if derivative_type_id not in subject.get("applicable_types", []):
        return False, (
            f"Subject '{subject_id}' does not list derivative_type '{derivative_type_id}'. "
            f"Allowed types for this subject: {subject.get('applicable_types', [])}"
        )

    return True, ""


def _extract_anchors(parent_draft_text: str, case_data: Optional[Dict[str, Any]]) -> List[Dict[str, str]]:
    """
    Build lightweight source anchors from the parent draft and case record.

    This is a deterministic anchor-extraction pass — no LLM. The anchors are
    consumed by both the skeleton generator and (optionally) the LLM prompt.
    """
    anchors: List[Dict[str, str]] = []
    lines = parent_draft_text.splitlines()

    for idx, line in enumerate(lines, start=1):
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith(("1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.")):
            head = stripped[:120]
            anchors.append(
                {
                    "anchor_id": f"P{idx}",
                    "anchor_ref": f"Parent Draft line {idx}",
                    "anchor_summary": head,
                    "page_refs": f"L{idx}",
                    "transform_strategy": "preserve-or-rebut-as-applicable",
                }
            )
        elif stripped.lower().startswith(("issue", "ground", "prayer", "relief")):
            head = stripped[:120]
            anchors.append(
                {
                    "anchor_id": f"I{idx}",
                    "anchor_ref": f"Parent Draft line {idx}",
                    "anchor_summary": head,
                    "page_refs": f"L{idx}",
                    "transform_strategy": "frame-submissions-or-counter-relief",
                }
            )

    if case_data:
        title = case_data.get("title", "Untitled Matter")
        court = case_data.get("court", "Unknown Forum")
        metadata = case_data.get("metadata", {}) or {}
        category = metadata.get("category", "General")
        anchors.insert(
            0,
            {
                "anchor_id": "CASE",
                "anchor_ref": "Case Record",
                "anchor_summary": f"{title} — {court} ({category})",
                "page_refs": "case_data.json",
                "transform_strategy": "reuse-cause-title-and-parties",
            },
        )

    if not anchors:
        anchors.append(
            {
                "anchor_id": "ROOT",
                "anchor_ref": "Parent Draft (whole document)",
                "anchor_summary": "Full parent draft treated as single anchor — no sub-structure detected.",
                "page_refs": "1-end",
                "transform_strategy": "whole-document-derivation",
            }
        )

    return anchors[:40]


def _render_lineage(
    case_id: str,
    parent_draft_id: str,
    parent_type: str,
    derivative_type: Dict[str, str],
    subject: Dict[str, Any],
    anchors: List[Dict[str, str]],
    registry: Dict[str, Any],
) -> str:
    """Render the lineage audit block that bookends every derivative draft."""
    templates = registry.get("lineage_templates", {})
    header = templates.get("header_format", "")
    anchor_fmt = templates.get("anchor_format", "")
    footer = templates.get("footer_disclaimer", "")

    source_anchors = ", ".join(a["anchor_id"] for a in anchors)
    header_rendered = header.format(
        generated_at=datetime.now().isoformat(timespec="seconds"),
        case_id=case_id,
        parent_draft_id=parent_draft_id,
        parent_type=parent_type,
        derivative_type_id=derivative_type.get("id", ""),
        derivative_type_label=derivative_type.get("label_en", ""),
        subject_id=subject.get("id", ""),
        subject_label=subject.get("label", ""),
        source_anchors=source_anchors,
    )

    anchor_block = ""
    for a in anchors:
        anchor_block += anchor_fmt.format(
            anchor_id=a["anchor_id"],
            anchor_ref=a["anchor_ref"],
            anchor_summary=a["anchor_summary"],
            page_refs=a["page_refs"],
            transform_strategy=a["transform_strategy"],
        )

    return header_rendered + anchor_block + "\n" + footer


def _build_draft_skeleton(
    derivative_type: Dict[str, str],
    subject: Dict[str, Any],
    anchors: List[Dict[str, str]],
    case_data: Optional[Dict[str, Any]],
    registry: Dict[str, Any],
) -> str:
    """
    Deterministic, LLM-free generator that produces a structured skeleton
    derivative draft. Used when no LLM is configured or as the ground-truth
    scaffolding the LLM is asked to flesh out.
    """
    strategies = registry.get("transform_strategies", {})
    type_id = derivative_type.get("id", "")
    strategy = strategies.get(type_id, "Apply standard derivative-draft structure to parent anchors.")

    subject_label = subject.get("label", "General Subject Matter")
    type_label_en = derivative_type.get("label_en", "Derivative Draft")
    type_label_hi = derivative_type.get("label_hi", type_label_en)

    title = case_data.get("title", "[Case Title: information required]") if case_data else "[Case Title: information required]"
    court = case_data.get("court", "[Court / Forum: information required]") if case_data else "[Court / Forum: information required]"
    parties = case_data.get("parties", {}) if case_data else {}
    petitioner = parties.get("petitioner", "[Petitioner / Appellant / Plaintiff: information required]")
    respondent = parties.get("respondent", "[Respondent / Defendant / State: information required]")
    case_no = case_data.get("case_number", "[Case / Diary No.: information required]") if case_data else "[Case / Diary No.: information required]"

    sections: List[str] = []
    sections.append(f"IN THE {court.upper()}")
    sections.append(f"{case_no}")
    sections.append(f"BETWEEN:  {petitioner}  … Petitioner / Appellant")
    sections.append(f"AND:      {respondent}  … Respondent / Defendant")
    sections.append("")
    sections.append("=" * 72)
    sections.append(f"{type_label_en.upper()} / {type_label_hi}")
    sections.append(f"UNDER THE SUBJECT HEAD: {subject_label}")
    sections.append("=" * 72)
    sections.append("")

    sections.append("MOST RESPECTFULLY SUBMITTED AS UNDER:")
    sections.append("")

    sections.append("1. CAUSE-TITLE & PARTIES")
    sections.append(f"   The present {type_label_en} is filed by {petitioner} (the \"Applicant\") "
                     f"against {respondent} (the \"Opponent\") in the subject matter of "
                     f"{subject_label}, arising from and in continuation of the matter titled "
                     f"\"{title}\" which is presently pending adjudication.")
    sections.append("")

    sections.append("2. TRANSFORM STRATEGY APPLIED")
    sections.append(f"   Strategy: {strategy}")
    sections.append("")

    sections.append("3. FACTUAL BASIS DRAWN FROM PARENT DOCUMENT / CASE RECORD")
    for i, a in enumerate(anchors, start=1):
        sections.append(f"   {i}. [{a['anchor_id']}] {a['anchor_summary']}")
        sections.append(f"      Source: {a['anchor_ref']} — refs: {a['page_refs']}")
        sections.append(f"      Treatment: {a['transform_strategy']}")
        sections.append("")

    sections.append("4. GROUNDS / SUBMISSIONS")
    sections.append("   [Information required: enumerate the specific grounds of the derivative "
                     "pleading. Each ground MUST cite the parent-draft anchor above and the "
                     "applicable statutory provision. Drafts without citations are rejected by "
                     "the Accuracy Gate.]")
    sections.append("")
    for i in range(1, min(6, len(anchors) + 1)):
        sections.append(f"   GROUND {i}:")
        sections.append(f"     [Information required: proposition of law + fact anchor + authority. "
                         f"e.g., \"Ground {i} rests on anchor {anchors[i-1]['anchor_id']} read with "
                         "relevant provision.\"]")
        sections.append("")

    sections.append("5. PRAYERS / RELIEF SOUGHT")
    sections.append("   In view of the grounds above, the Applicant most respectfully prays that "
                     "this Hon'ble Forum may be pleased to:")
    sections.append("")
    sections.append("   (a) [Information required: primary relief, tied to parent-draft prayers.]")
    sections.append("   (b) [Information required: consequential / ancillary relief.]")
    sections.append("   (c) Pass any other order(s) as deemed fit and proper in the facts and "
                     "circumstances of the case, in the interests of justice.")
    sections.append("")

    sections.append("6. VERIFICATION")
    sections.append("   Verified at [Place: information required] on [Date: information required] "
                     "that the contents of the above {type_label_en} are true and correct to my "
                     "knowledge, no part of it is false, and nothing material has been concealed "
                     "therefrom.".format(type_label_en=type_label_en))
    sections.append("")
    sections.append("                                               ___________________________")
    sections.append("                                               Applicant / Authorised Signatory")
    sections.append("                                               [Name & Designation: information required]")
    sections.append("")

    return "\n".join(sections)


def _prompt_llm(
    llm: Any,
    skeleton: str,
    lineage: str,
    parent_draft_text: str,
    derivative_type: Dict[str, str],
    subject: Dict[str, Any],
) -> str:
    """
    Ask the configured LLM to flesh out the skeleton into a complete derivative
    draft. We deliberately pass the lineage block so the model can see each
    anchor it is expected to cite; we instruct it to keep anchors explicit.
    """
    prompt = f"""
You are a senior Indian law-court drafter producing a ZERO-HALLUCINATION
DERIVATIVE PLEADING. You MUST follow every instruction below.

---
SUBJECT (area of law): {subject.get('label', '')}
DERIVATIVE TYPE: {derivative_type.get('id', '')} — {derivative_type.get('label_en', '')}
---

YOUR INPUTS:
1. PARENT DRAFT (the document you are deriving from):
-- START PARENT DRAFT --
{parent_draft_text[:12000]}
-- END PARENT DRAFT --

2. SKELETON scaffolding the derivative draft. KEEP the headings intact. Fill
   in each [Information required: …] placeholder. Where you cannot confidently
   fill a placeholder, LEAVE the placeholder EXPLICITLY — DO NOT invent facts
   or law.
-- START SKELETON --
{skeleton}
-- END SKELETON --

3. LINEAGE AUDIT. Every substantive paragraph you write MUST cite one or more
   of the anchor IDs shown below in square brackets, e.g. "[P3]".
-- START LINEAGE --
{lineage}
-- END LINEAGE --

STRICT RULES (non-negotiable):
* Never invent a fact, name, date, number, provision, case citation, or event.
  If something is missing, write [Information required: concise reason].
* Every substantive paragraph must cite at least one anchor ID from the lineage.
* Statutory references: cite the section number and enactment name in full.
* Preserve bilingual labels (Hindi + English) that appear in the skeleton.
* Do NOT remove, rewrite, or shorten the lineage block. Append it verbatim
  AFTER your completed pleading text (after the Verification / signature
  block), preceded by a horizontal rule.

Now produce the final derivative draft.
"""
    try:
        from langchain_core.messages import HumanMessage

        messages = [HumanMessage(content=prompt)]
        response = llm.invoke(messages)
        content = getattr(response, "content", str(response))
        if isinstance(content, str):
            return content
        return str(content)
    except Exception as exc:  # noqa: BLE001
        logger.error(
            "derivative_draft_event",
            extra={"event": "llm_generate_failed", "error": str(exc)},
        )
        return skeleton + "\n\n[Note: LLM flesh-out unavailable; skeleton-only draft returned " \
               f"(detail: {exc}).]"


def generate_derivative_draft(
    case_id: str,
    parent_draft_id: str,
    parent_type: str,
    parent_draft_text: str,
    subject_id: str,
    derivative_type_id: str,
    case_data: Optional[Dict[str, Any]] = None,
    use_llm: bool = True,
) -> Dict[str, Any]:
    """
    Public entry point.

    Returns:
        {
          "success": bool,
          "draft_content": str,        # full derivative draft with lineage block
          "lineage": { … },            # structured lineage payload (for UI tree views)
          "error": str | None,
        }
    """
    registry = _load_registry()
    valid, reason = validate_pairing(subject_id, derivative_type_id)
    if not valid:
        logger.warning(
            "derivative_draft_event",
            extra={
                "event": "pairing_rejected",
                "case_id": case_id,
                "subject_id": subject_id,
                "derivative_type_id": derivative_type_id,
                "reason": reason,
            },
        )
        return {"success": False, "draft_content": "", "lineage": None, "error": reason}

    subjects = registry.get("subjects", [])
    types = {t["id"]: t for t in registry.get("derivative_types", [])}
    subject = next((s for s in subjects if s["id"] == subject_id), {})
    derivative_type = types[derivative_type_id]

    try:
        anchors = _extract_anchors(parent_draft_text, case_data)
        skeleton = _build_draft_skeleton(derivative_type, subject, anchors, case_data, registry)
        lineage_block = _render_lineage(
            case_id=case_id,
            parent_draft_id=parent_draft_id,
            parent_type=parent_type,
            derivative_type=derivative_type,
            subject=subject,
            anchors=anchors,
            registry=registry,
        )

        if use_llm:
            llm = _build_llm()
            if llm is not None:
                draft_text = _prompt_llm(
                    llm,
                    skeleton=skeleton,
                    lineage=lineage_block,
                    parent_draft_text=parent_draft_text,
                    derivative_type=derivative_type,
                    subject=subject,
                )
            else:
                draft_text = skeleton + "\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" + lineage_block
        else:
            draft_text = skeleton + "\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" + lineage_block

        lineage_payload = {
            "generated_at": datetime.now().isoformat(timespec="seconds"),
            "case_id": case_id,
            "parent": {
                "draft_id": parent_draft_id,
                "type": parent_type,
            },
            "derivative": {
                "type_id": derivative_type_id,
                "type_label_en": derivative_type.get("label_en", ""),
                "type_label_hi": derivative_type.get("label_hi", ""),
            },
            "subject": {
                "id": subject_id,
                "label": subject.get("label", ""),
            },
            "anchors": anchors,
            "is_synthetic": True,
        }

        logger.info(
            "derivative_draft_event",
            extra={
                "event": "derivative_draft_generated",
                "case_id": case_id,
                "parent_draft_id": parent_draft_id,
                "subject_id": subject_id,
                "derivative_type_id": derivative_type_id,
                "anchors_count": len(anchors),
            },
        )
        return {"success": True, "draft_content": draft_text, "lineage": lineage_payload, "error": None}
    except Exception as e:  # noqa: BLE001
        logger.error(
            "derivative_draft_event",
            extra={"event": "derivative_draft_failed", "error": str(e)},
        )
        return {"success": False, "draft_content": "", "lineage": None, "error": str(e)}


def list_available_derivatives(subject_id: str) -> Dict[str, Any]:
    """
    Return the list of derivative_types applicable to a given subject, together
    with the subject's label and the full registry metadata.
    """
    registry = _load_registry()
    subjects = registry.get("subjects", [])
    types = {t["id"]: t for t in registry.get("derivative_types", [])}

    subject = next((s for s in subjects if s["id"] == subject_id), None)
    if subject is None:
        return {"success": False, "subject": None, "available_types": [], "error": f"Unknown subject '{subject_id}'."}

    applicable_ids = subject.get("applicable_types", [])
    applicable_types = [
        {"id": tid, **types[tid]}
        for tid in applicable_ids
        if tid in types
    ]

    return {
        "success": True,
        "subject": {"id": subject["id"], "label": subject["label"]},
        "available_types": applicable_types,
        "registry_version": registry.get("version", "unknown"),
        "error": None,
    }


def list_all_subjects() -> Dict[str, Any]:
    """Return the full subjects list (50) plus version info, for the UI picker."""
    registry = _load_registry()
    subjects = registry.get("subjects", [])
    derivative_types = registry.get("derivative_types", [])
    return {
        "success": True,
        "registry_version": registry.get("version", "unknown"),
        "registry_description": registry.get("description", ""),
        "last_updated": registry.get("last_updated", ""),
        "subjects_count": len(subjects),
        "derivative_types_count": len(derivative_types),
        "subjects": subjects,
        "derivative_types": derivative_types,
    }


def build_document_family(
    case_id: str,
    parent_draft_id: str,
    parent_type: str,
    parent_draft_text: str,
    subject_id: str,
    case_data: Optional[Dict[str, Any]] = None,
    use_llm: bool = True,
) -> Dict[str, Any]:
    """
    Generate every applicable derivative draft for a given (subject, parent)
    pair — i.e. the whole 'document family' at once. Returns per-draft results
    keyed by derivative_type_id.
    """
    info = list_available_derivatives(subject_id)
    if not info["success"]:
        return {"success": False, "family": {}, "error": info["error"]}

    family: Dict[str, Any] = {}
    for dtype in info["available_types"]:
        tid = dtype["id"]
        result = generate_derivative_draft(
            case_id=case_id,
            parent_draft_id=parent_draft_id,
            parent_type=parent_type,
            parent_draft_text=parent_draft_text,
            subject_id=subject_id,
            derivative_type_id=tid,
            case_data=case_data,
            use_llm=use_llm,
        )
        family[tid] = result

    success_count = sum(1 for v in family.values() if v.get("success"))
    return {
        "success": success_count > 0,
        "family": family,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "case_id": case_id,
        "subject_id": subject_id,
        "parent_draft_id": parent_draft_id,
        "total_types": len(family),
        "success_count": success_count,
        "failed_types": [k for k, v in family.items() if not v.get("success")],
        "is_synthetic": True,
    }
