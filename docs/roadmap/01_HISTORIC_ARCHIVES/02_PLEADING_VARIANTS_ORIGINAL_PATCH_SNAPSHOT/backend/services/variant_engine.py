"""Pleading Chain Engine - core service.

One drafted pleading -> a matter-threaded family of connected variants.
Design invariants:
  * MatterContext is extracted ONCE from the root draft and injected verbatim.
  * Variants may only be generated for a draft that passes the Fact-Fit Gate
    (or contains zero citations). No exceptions - same rule as export.
  * Citations inside generated variants are emitted as [[CITATION:n]] slots
    that MUST be filled via Citation Search ("Add to Draft"), keeping the
    Fact-Fit Gate non-optional end to end.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
from typing import Any, Iterator

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "subject_variants.json"

IN_THE_COURT_RE = re.compile(r"IN\s+THE\s+(?:HON[\w'’]*\s+)?(COURT\s+OF[^\n]+)", re.I)
VERSUS_RE = re.compile(r"\n\s*(?:VERSUS|VS\.?)\s*\n", re.I)
CASE_NO_RE = re.compile(r"(?:C[A-Z]*\.?\s*(?:NO|NUMBER)[.:]?\s*[^\n]+)", re.I)


@dataclass
class MatterContext:
    case_id: str
    subject: str
    court: str = ""
    case_no: str = ""
    petitioners: list[str] = field(default_factory=list)
    respondents: list[str] = field(default_factory=list)
    stage: str = "pleading"


@lru_cache(maxsize=1)
def load_registry() -> dict[str, Any]:
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def subject_families(subject: str) -> dict[str, Any]:
    reg = load_registry()
    fam = reg["subjects"].get(subject)
    if fam is None:
        raise KeyError(f"Unknown subject '{subject}'. Valid: {sorted(reg['subjects'])}")
    return fam


def extract_matter_context(base_draft_md: str, case_id: str, subject: str) -> MatterContext:
    """Parse parties / court / case number out of the root draft. Deterministic,
    regex-based - no model call, so it cannot hallucinate the matter thread."""
    ctx = MatterContext(case_id=case_id, subject=subject)
    m = IN_THE_COURT_RE.search(base_draft_md)
    if m:
        ctx.court = m.group(1).strip()
    m = CASE_NO_RE.search(base_draft_md)
    if m:
        ctx.case_no = m.group(0).strip()
    vs = VERSUS_RE.search(base_draft_md)
    if vs:
        head = base_draft_md[: vs.start()]
        tail = base_draft_md[vs.end() :]
        ctx.petitioners = [p.strip(" .,\n") for p in re.split(r"\n\s*(?:AND|&)\s*\n", head) if p.strip() and "COURT" not in p.upper()][:6]
        ctx.respondents = [r.strip(" .,\n") for r in re.split(r"\n\s*(?:AND|&)\s*\n", tail) if r.strip()][:6]
        ctx.petitioners = [next((l for l in p.splitlines() if l.strip()), p) for p in ctx.petitioners if p]
        ctx.respondents = [next((l for l in r.splitlines() if l.strip()), r) for r in ctx.respondents if r]
    return ctx


def build_archetype_prompt(ctx: MatterContext, archetype: dict[str, Any]) -> str:
    """Strict system prompt: preserve matter context, use terms of art,
    leave citation slots where the registry demands authorities."""
    glossary = ", ".join(archetype["glossary"])
    reqs = "; ".join(archetype["citations"])
    return f"""You are an Indian litigation drafting assistant inside Legal Luminaire.

INVIOLABLE CONSTRAINTS
1. Preserve the following Matter Context VERBATIM in the caption of the draft:
   - Court: {ctx.court or 'as in the base draft'}
   - Case No.: {ctx.case_no or 'as in the base draft'}
   - Petitioner(s): {', '.join(ctx.petitioners) or 'as in the base draft'}
   - Respondent(s): {', '.join(ctx.respondents) or 'as in the base draft'}
2. Draft ONLY the variant requested: {archetype['label']['en']} ({archetype['label']['hi']}).
3. Use the terminology of art precisely and naturally: {glossary}.
   Do not define these terms inline - this is court drafting, not a textbook.
4. Wherever an authority is legally required (ordinarily: {reqs}),
   emit the literal slot marker [[CITATION:n]] (n = 1,2,3...) instead of
   inventing any case name, section, or citation. NEVER fabricate citations.
5. Follow Indian court format: cause title, diary/case number line, prayer.
6. Output Markdown only. No commentary, no meta text.

VARIANT KIND: {archetype['kind']} | STAGE: {archetype['stage']}"""


def user_prompt(base_draft_md: str, archetype: dict[str, Any]) -> str:
    return (
        f"BASE DRAFT (the root pleading of this matter):\n---\n{base_draft_md[:12000]}\n---\n\n"
        f"Now draft the connected variant: {archetype['label']['en']}. "
        "It must read as a natural successor to the base draft in the SAME matter."
    )


# ---- streaming: Anthropic Claude (matches existing backend dependency) ----

def stream_variant(base_draft_md: str, ctx: MatterContext, archetype: dict[str, Any]) -> Iterator[str]:
    import anthropic  # already a backend dependency

    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env
    with client.messages.stream(
        model="claude-sonnet-5",
        max_tokens=6000,
        system=build_archetype_prompt(ctx, archetype),
        messages=[{"role": "user", "content": user_prompt(base_draft_md, archetype)}],
    ) as s:
        for text in s.text_stream:
            yield text


def remaining_citation_slots(draft_md: str, archetype: dict[str, Any]) -> int:
    filled = len(set(re.findall(r"\[\[CITATION:(\d+)\]\]", draft_md)))
    return max(0, len(archetype["citations"]) - filled)


def list_subjects() -> list[dict[str, Any]]:
    reg = load_registry()
    return [{"id": k, "label": v["label"]} for k, v in reg["subjects"].items()]
