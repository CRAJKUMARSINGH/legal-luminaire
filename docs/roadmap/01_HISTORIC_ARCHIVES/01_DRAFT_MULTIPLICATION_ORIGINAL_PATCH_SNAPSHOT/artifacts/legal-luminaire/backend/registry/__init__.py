"""Draft Multiplication Registry — derivative pleadings keyed to parent documents.

Loads the derivative-type taxonomy and the 50-subject applicability matrix
from derivative_drafts.json. Purely additive: nothing in the existing
drafting pipeline is modified by importing this package.
"""
from __future__ import annotations

import json
import os
from typing import Any, Dict, List, Optional

_REGISTRY_PATH = os.path.join(os.path.dirname(__file__), "derivative_drafts.json")

with open(_REGISTRY_PATH, "r", encoding="utf-8") as _f:
    REGISTRY: Dict[str, Any] = json.load(_f)

DERIVATIVE_TYPES: List[Dict[str, Any]] = REGISTRY["derivative_types"]
SUBJECTS: List[Dict[str, Any]] = REGISTRY["subjects"]

_BY_ID: Dict[str, Dict[str, Any]] = {d["id"]: d for d in DERIVATIVE_TYPES}


def get_derivative_type(type_id: str) -> Optional[Dict[str, Any]]:
    return _BY_ID.get(type_id)


def derivative_types_for_subject(subject_id: str) -> List[Dict[str, Any]]:
    """Return derivative types applicable to a given subject id."""
    for s in SUBJECTS:
        if s["id"] == subject_id:
            return [_BY_ID[t] for t in s["applicable_types"] if t in _BY_ID]
    return []


def default_subjects_for_type(type_id: str) -> List[str]:
    return [s["id"] for s in SUBJECTS if type_id in s["applicable_types"]]


def build_system_prompt(
    derivative_type: Dict[str, Any],
    subject_id: str,
    court: str = "",
) -> str:
    """Compose the drafting system prompt for a derivative document.

    Terminology, prayer focus and jurisdiction notes come from the registry
    (data), never from hardcoded per-case prompt branches.
    """
    subject = next((s for s in SUBJECTS if s["id"] == subject_id), None)
    subject_label = subject["label"] if subject else subject_id
    terminology = derivative_type.get("terminology", {})
    term_line = ", ".join(f"{k}: {v}" for k, v in terminology.items())
    return (
        f"You are a senior advocate drafting a {derivative_type['label']} "
        f"({derivative_type.get('hindi_label', '')}) — a derivative pleading that "
        f"must respond to, build upon, or extend an existing parent draft in the same case file.\n\n"
        f"PARENT RELATIONSHIP: {derivative_type['parent_relation']}\n"
        f"WHEN FILED: {derivative_type['when_filed']}\n"
        f"PRAYER FOCUS: {derivative_type['prayer_focus']}\n"
        f"SUBJECT MATTER: {subject_label}\n"
        f"COURT: {court or 'as per case file'}\n"
        f"JURISDICTION NOTES: {derivative_type.get('jurisdiction_notes', 'Standard Indian practice.')}\n"
        f"MANDATORY TERMINOLOGY: {term_line}\n\n"
        "STRUCTURE (MANDATORY):\n"
        "1. Court heading (as per case file court, correct cause-title)\n"
        "2. Document title (exact statutory / Order-Rule basis from registry)\n"
        "3. Recap of parent application + interlocutory history (one para, factual)\n"
        "4. Reply/response paragraphs numbered para-wise against the parent draft\n"
        "5. Grounds with VERIFIED citations only — every citation marked [VERIFIED] or [COURT_SAFE]\n"
        "6. Prayer (aligned to prayer_focus above)\n"
        "7. Verification + affidavit / declaration as applicable\n\n"
        "QUALITY RULES:\n"
        "1. Quote holdings VERBATIM from the supplied authority blocks only.\n"
        "2. Never invent a citation, section number, or IS/ASTM clause.\n"
        "3. Maintain consistency with the parent draft's facts, dates and party names.\n"
        "4. Cross-reference the parent draft as 'the aforesaid application/application dated ___'.\n"
    )


def authority_blocks_to_prompt(authority_blocks: List[Dict[str, Any]]) -> str:
    """Format citation-search authority blocks for injection into the draft prompt."""
    if not authority_blocks:
        return ""
    lines = ["\nVERIFIED AUTHORITY BLOCKS (use ONLY these precedents):"]
    for a in authority_blocks:
        lines.append(
            f"- [{a.get('id', 'unknown')}] {a.get('title', '')} "
            f"| Citation: {a.get('citation', 'n/a')} "
            f"| Holding: {a.get('holding', '')} "
            f"| Application: {a.get('application', '')}"
        )
    return "\n".join(lines)
