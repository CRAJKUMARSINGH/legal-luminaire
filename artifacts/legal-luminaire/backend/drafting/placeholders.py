"""Visible placeholders for unknown facts — never silent invention."""

from __future__ import annotations

import re
from typing import Dict, List, Tuple

PLACEHOLDER_RE = re.compile(r"\[Information required:[^\]]+\]")

CORE_FIELDS = (
    ("court_name", "court and forum"),
    ("case_number", "case / FIR / suit / notice number"),
    ("applicant_name", "applicant / plaintiff / accused name"),
    ("opposite_party", "opposite party / State / complainant name"),
    ("incident_date", "date of incident or cause of action"),
    ("sections_invoked", "statutory sections invoked"),
    ("relief_sought", "precise relief instructed by the advocate"),
)


def info_required(label: str) -> str:
    clean = " ".join(label.split())
    return f"[Information required: {clean}]"


def collect_placeholders(text: str) -> List[str]:
    return list(dict.fromkeys(PLACEHOLDER_RE.findall(text or "")))


def missing_core_fields(facts: Dict[str, str]) -> List[Tuple[str, str]]:
    missing = []
    for key, label in CORE_FIELDS:
        value = (facts.get(key) or "").strip()
        if not value or value.startswith("[Information required"):
            missing.append((key, label))
    return missing


def apply_placeholders(facts: Dict[str, str]) -> Dict[str, str]:
    filled = dict(facts)
    for key, label in CORE_FIELDS:
        raw = (filled.get(key) or "").strip()
        if not raw:
            filled[key] = info_required(label)
    return filled
