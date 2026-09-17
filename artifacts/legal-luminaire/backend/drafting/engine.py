"""Assemble skeleton, prompts and structured warnings for a draft run."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from drafting.architecture import STAGE_INSTRUCTIONS, architecture_for
from drafting.blocks import annexure_block, prayer_lines, source_control_block, verification_block
from drafting.catalog import DraftTemplate, resolve_legacy_draft_type
from drafting.conflicts import detect_conflicts
from drafting.grounds import grounds_for_family
from drafting.placeholders import apply_placeholders, collect_placeholders, info_required, missing_core_fields
from drafting.prompts import build_human_prompt, build_system_prompt


@dataclass
class DraftGenerationSpec:
    draft_type: str = "DISCHARGE"
    template_id: Optional[str] = None
    document_stage: Optional[str] = None
    language: str = "hi"
    additional_notes: str = ""
    typed_facts: str = ""
    pasted_text: str = ""
    approved_facts: Optional[Dict[str, str]] = None
    sources: Optional[List[Dict[str, str]]] = None
    known_documents: Optional[List[str]] = None


@dataclass
class GenerationBundle:
    template: DraftTemplate
    stage: str
    language: str
    facts: Dict[str, str]
    conflicts: List[str]
    placeholders: List[str]
    skeleton: str
    system_prompt: str
    human_prompt: str
    architecture: List[str]
    approved_sources: List[str]
    excluded_sources: List[str]
    filing_ready: bool = False
    extra: Dict[str, Any] = field(default_factory=dict)


def _case_facts(case_data: Dict[str, Any], spec: DraftGenerationSpec) -> Dict[str, str]:
    timeline = case_data.get("timeline") or []
    first_date = ""
    if timeline:
        first_date = str(timeline[0].get("date") or "")
    accused = case_data.get("accused_names") or []
    facts = {
        "court_name": str(case_data.get("court") or ""),
        "case_number": str(case_data.get("case_no") or case_data.get("caseNo") or ""),
        "applicant_name": str((accused[0] if accused else "") or case_data.get("title") or ""),
        "opposite_party": str(case_data.get("complainant") or case_data.get("opposite_party") or ""),
        "incident_date": first_date,
        "sections_invoked": str(case_data.get("charges") or case_data.get("sections") or ""),
        "relief_sought": "",
        "case_title": str(case_data.get("title") or ""),
        "brief": str(case_data.get("brief") or ""),
    }
    if spec.approved_facts:
        for k, v in spec.approved_facts.items():
            if v is not None and str(v).strip():
                facts[str(k)] = str(v).strip()
    return apply_placeholders(facts)


def _context_str(case_data: Dict[str, Any], facts: Dict[str, str], spec: DraftGenerationSpec) -> str:
    lines = [
        f"Case title: {facts.get('case_title')}",
        f"Court: {facts.get('court_name')}",
        f"Case number: {facts.get('case_number')}",
        f"Applicant / accused: {facts.get('applicant_name')}",
        f"Opposite party: {facts.get('opposite_party')}",
        f"Sections: {facts.get('sections_invoked')}",
        f"Brief: {facts.get('brief')}",
        "",
        "Timeline / facts:",
    ]
    for e in case_data.get("timeline") or []:
        grounding = f" (Grounding: {e['grounding']})" if e.get("grounding") else ""
        lines.append(f"- {e.get('date', info_required('event date'))}: {e.get('title', info_required('event title'))}{grounding}")
    grounding = case_data.get("forensic_grounding") or []
    if grounding:
        lines.append("")
        lines.append("Forensic standards / gaps (use only as pleaded if present in this list):")
        for g in grounding:
            lines.append(f"- {g.get('code')}: {g.get('title')}")
            viol = g.get("violations") or []
            if viol:
                lines.append(f"  Violations: {', '.join(viol)}")
    if spec.typed_facts:
        lines += ["", "Typed facts (user-approved):", spec.typed_facts]
    if spec.pasted_text:
        lines += ["", "Pasted text (user-approved):", spec.pasted_text]
    return "\n".join(lines)


def _heading(sec_heading_en: str, sec_heading_hi: str, language: str) -> str:
    if language == "hi":
        return sec_heading_hi
    if language == "bilingual":
        return f"{sec_heading_en} / {sec_heading_hi}"
    return sec_heading_en


def render_skeleton(
    template: DraftTemplate,
    stage: str,
    language: str,
    facts: Dict[str, str],
    *,
    known_documents: Optional[List[str]] = None,
    approved_sources: Optional[List[str]] = None,
    excluded_sources: Optional[List[str]] = None,
    conflicts: Optional[List[str]] = None,
) -> str:
    sections = architecture_for(template, stage)
    grounds = grounds_for_family(template.matter_family)
    parts: List[str] = [
        template.name_en if language == "en" else f"{template.name_en} / {template.name_hi}",
        "",
        f"IN THE COURT OF {facts.get('court_name')}",
        f"{facts.get('applicant_name')}    … Applicant / Plaintiff / Accused",
        "versus",
        f"{facts.get('opposite_party')}    … Opposite Party / State / Defendant",
        f"Case / FIR / Suit No.: {facts.get('case_number')}",
        f"Provisions (confirm): {facts.get('sections_invoked')} — {template.provision_hint}",
        "",
        STAGE_INSTRUCTIONS.get(stage, STAGE_INSTRUCTIONS[template.default_stage]),
        "",
    ]
    for sec in sections:
        parts.append(_heading(sec.heading_en, sec.heading_hi, language).upper())
        parts.append(sec.instruction)
        if sec.id == "facts":
            parts.append(f"Incident / cause of action: {facts.get('incident_date')}")
            brief = facts.get("brief") or ""
            parts.append(brief if brief.strip() else info_required("narrative of approved facts"))
        elif sec.id == "grounds":
            for i, g in enumerate(grounds, 1):
                title = g.title_en if language == "en" else f"{g.title_en} / {g.title_hi}"
                parts.append(f"Ground {i}. {title}")
                parts.append(f"   {g.instruction}")
                if g.required_facts:
                    for fkey in g.required_facts:
                        val = facts.get(fkey)
                        parts.append(f"   - {fkey}: {val if val else info_required(fkey.replace('_', ' '))}")
        elif sec.id == "prayer":
            for line in prayer_lines(template, language):
                parts.append(f"  {line}")
        elif sec.id == "verification":
            parts.append(verification_block(language))
        elif sec.id == "annexures":
            parts.append(annexure_block(language, known_documents or []))
        elif sec.id == "source_control":
            continue
        parts.append("")

    placeholders = collect_placeholders("\n".join(parts))
    for key, label in missing_core_fields(facts):
        token = info_required(label)
        if token not in placeholders:
            placeholders.append(token)
        _ = key
    parts.append(
        source_control_block(
            language,
            approved_sources or [],
            excluded_sources or [],
            placeholders,
            conflicts or [],
        )
    )
    return "\n".join(parts).strip() + "\n"


def build_generation_bundle(case_data: Dict[str, Any], spec: DraftGenerationSpec) -> GenerationBundle:
    template = resolve_legacy_draft_type(spec.draft_type, spec.template_id)
    stage = spec.document_stage or template.default_stage
    if stage not in template.allowed_stages:
        stage = template.default_stage
    language = spec.language if spec.language in ("en", "hi", "bilingual") else "hi"

    facts = _case_facts(case_data or {}, spec)
    sources = list(spec.sources or [])
    if spec.typed_facts:
        sources.append({"name": "typed_facts", "text": spec.typed_facts, "included": True})
    if spec.pasted_text:
        sources.append({"name": "pasted_text", "text": spec.pasted_text, "included": True})
    if facts.get("brief") and not str(facts["brief"]).startswith("[Information required"):
        sources.append({"name": "case_brief", "text": facts["brief"], "included": True})

    conflicts = detect_conflicts(sources)
    approved_sources = [s.get("name") or "source" for s in sources if s.get("included", True)]
    excluded_sources = [s.get("name") or "source" for s in sources if s.get("included", True) is False]

    skeleton = render_skeleton(
        template,
        stage,
        language,
        facts,
        known_documents=spec.known_documents or [],
        approved_sources=approved_sources,
        excluded_sources=excluded_sources,
        conflicts=conflicts,
    )
    placeholders = collect_placeholders(skeleton)
    context = _context_str(case_data or {}, facts, spec)
    system_prompt = build_system_prompt(template, stage, language)
    human_prompt = build_human_prompt(
        template=template,
        context=context,
        notes=spec.additional_notes or "",
        typed_facts=spec.typed_facts or "",
        pasted_text=spec.pasted_text or "",
        skeleton=skeleton,
        conflicts=conflicts,
    )
    architecture = [
        f"{s.heading_en} / {s.heading_hi}" for s in architecture_for(template, stage)
    ]
    return GenerationBundle(
        template=template,
        stage=stage,
        language=language,
        facts=facts,
        conflicts=conflicts,
        placeholders=placeholders,
        skeleton=skeleton,
        system_prompt=system_prompt,
        human_prompt=human_prompt,
        architecture=architecture,
        approved_sources=approved_sources,
        excluded_sources=excluded_sources,
        filing_ready=False,
    )
