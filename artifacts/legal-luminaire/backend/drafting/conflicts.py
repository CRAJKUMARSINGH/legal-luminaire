"""Detect conflicting names, dates, amounts and section numbers across sources."""

from __future__ import annotations

import re
from typing import Dict, List

DATE_RE = re.compile(r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})\b")
AMOUNT_RE = re.compile(r"(?:Rs\.?|INR|₹)\s*([0-9][0-9,]*(?:\.\d{1,2})?)", re.I)
FIR_RE = re.compile(r"\bFIR(?:\s*No\.?)?\s*[:\-]?\s*([A-Za-z0-9_\/\-]+)", re.I)
SECTION_RE = re.compile(r"\b(?:u\/s|section|sec\.?)\s*([0-9]{1,4}[A-Z]?)", re.I)


def _values(pattern: re.Pattern, text: str) -> List[str]:
    return [m.group(1).strip() for m in pattern.finditer(text or "")]


def detect_conflicts(sources: List[Dict[str, str]]) -> List[str]:
    """Each source is {name, text}. Conflicts are reported, not resolved."""
    warnings: List[str] = []
    included = [s for s in sources if (s.get("included", True) and (s.get("text") or "").strip())]
    if len(included) < 2:
        return warnings

    def _cross(label: str, pattern: re.Pattern) -> None:
        bags: Dict[str, List[str]] = {}
        for src in included:
            found = sorted(set(_values(pattern, src.get("text", ""))))
            if found:
                bags[src.get("name") or "source"] = found
        unique = {tuple(v) for v in bags.values()}
        if len(unique) > 1:
            detail = "; ".join(f"{n}: {', '.join(v)}" for n, v in bags.items())
            warnings.append(
                f"Conflicting {label} across sources. Confirm the correct value before continuing. {detail}"
            )

    _cross("dates", DATE_RE)
    _cross("amounts", AMOUNT_RE)
    _cross("FIR numbers", FIR_RE)
    _cross("section numbers", SECTION_RE)
    return warnings
