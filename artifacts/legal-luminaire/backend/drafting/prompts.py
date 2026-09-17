"""System and human prompts for advocate-grade generation."""

from __future__ import annotations

from drafting.architecture import STAGE_INSTRUCTIONS, architecture_for
from drafting.blocks import annexure_block, prayer_lines, source_control_block, verification_block
from drafting.catalog import DraftTemplate
from drafting.grounds import grounds_for_family
from drafting.placeholders import info_required


SAFETY_RULES = """
HARD SAFETY RULES (non-negotiable):
1. Never invent missing case facts (names, dates, amounts, FIR/suit numbers, roles).
2. Never invent case law, paragraph numbers, IS/ASTM clauses, or statutory text.
3. Never silently resolve conflicting sources; list the conflict and stop that assertion.
4. Never hide uncertainty. Use the exact marker: [Information required: <what is missing>].
5. Never treat OCR or extracted text as verified unless the user marked it approved.
6. Preserve names, dates, amounts, case numbers and legal sections exactly as approved.
7. Do not present the draft as filing-ready. The advocate remains responsible.
8. Do not silently translate citations, section numbers, case numbers or technical standards.
9. If a fact is not in APPROVED MATTER CONTEXT, it does not enter the pleading as a fact.
10. Template language is scaffolding only; it cannot supply a missing fact.
"""


def language_rules(language: str) -> str:
    if language == "hi":
        return (
            "LANGUAGE: Draft the pleading in chaste, formal Hindi legal register suitable for "
            "Indian district, sessions and High Courts. Keep citations, section numbers, "
            "IS codes, case numbers and party spellings in their canonical form."
        )
    if language == "bilingual":
        return (
            "LANGUAGE: Produce a bilingual paired draft from ONE matter record. "
            "For every section, output the English text immediately followed by the Hindi text. "
            "The two versions must share the same placeholders, parties, dates, amounts and citations. "
            "Do not generate two unrelated drafts."
        )
    return (
        "LANGUAGE: Draft in formal Indian English pleading style. "
        "Keep Hindi proper names as in the record. Do not translate citations or section numbers."
    )


def build_system_prompt(template: DraftTemplate, stage: str, language: str) -> str:
    sections = architecture_for(template, stage)
    grounds = grounds_for_family(template.matter_family)
    stage_key = stage if stage in STAGE_INSTRUCTIONS else template.default_stage

    section_lines = []
    for i, sec in enumerate(sections, 1):
        heading = sec.heading_en if language == "en" else f"{sec.heading_en} / {sec.heading_hi}"
        section_lines.append(f"{i}. {heading}\n   {sec.instruction}")

    ground_lines = []
    for g in grounds:
        need = ", ".join(g.required_facts) if g.required_facts else "none specified"
        title = g.title_en if language == "en" else f"{g.title_en} / {g.title_hi}"
        ground_lines.append(
            f"- {title}\n  Instruction: {g.instruction}\n  Needed facts: {need}. "
            f"If missing, write {info_required(need if need != 'none specified' else g.title_en)}."
        )

    return f"""You are a senior Indian advocate drafting a court-usable pleading scaffold.

PRODUCT: Legal Luminaire Matter Drafting Studio — matter-specific criminal and civil drafting.
This is not a translation tool and not automatic legal decision-making.

TEMPLATE: {template.name_en} / {template.name_hi}
CATEGORY: {template.category}
MATTER FAMILY: {template.matter_family}
DOCUMENT STAGE: {stage_key}
PROVISION HINT (confirm; do not assume): {template.provision_hint}

{language_rules(language)}

{SAFETY_RULES}

{STAGE_INSTRUCTIONS[stage_key]}

PLEADING ARCHITECTURE (use these sections in order; do not omit required sections):
{chr(10).join(section_lines)}

MATTER-FAMILY GROUNDS (plead a ground only if the approved facts can support it; otherwise placeholder or omit):
{chr(10).join(ground_lines)}

PRAYER (confine to these asks unless the user instructed additional relief):
{chr(10).join('- ' + p for p in prayer_lines(template, language))}

After the prayer, include a verification block equivalent to:
{verification_block(language)}

Then an annexure index. Then the source-control / counsel-certificate section.

QUALITY:
- Intense, precise, advocate-grade — but never at the cost of inventing law or facts.
- Headings in the selected language.
- Numbered grounds.
- Quote a holding only if the verified context supplies the exact quote.
- Mark every uncertain sentence for review.
""".strip()


def build_human_prompt(
    *,
    template: DraftTemplate,
    context: str,
    notes: str,
    typed_facts: str,
    pasted_text: str,
    skeleton: str,
    conflicts: list[str],
) -> str:
    conflict_block = "\n".join(conflicts) if conflicts else "None detected by the structured checker."
    return f"""APPROVED MATTER CONTEXT (canonical; highest priority after user-approved typed facts):
{context or info_required("approved matter context")}

USER-APPROVED TYPED FACTS:
{typed_facts or "(none)"}

USER-APPROVED PASTED TEXT:
{pasted_text or "(none)"}

ADDITIONAL ADVOCATE NOTES (instructions, not facts unless they state a fact):
{notes or "(none)"}

SOURCE CONFLICTS — do not silently choose a version:
{conflict_block}

ARCHITECTURE SKELETON (fill; keep every placeholder that you cannot source):
{skeleton}

Generate the draft now. Keep unknown facts as {info_required("…")} rather than inventing law or facts.
""".strip()


def format_annexures_and_sources(
    language: str,
    documents: list[str],
    approved_sources: list[str],
    excluded_sources: list[str],
    placeholders: list[str],
    conflicts: list[str],
) -> str:
    return (
        annexure_block(language, documents)
        + "\n\n"
        + source_control_block(language, approved_sources, excluded_sources, placeholders, conflicts)
    )
