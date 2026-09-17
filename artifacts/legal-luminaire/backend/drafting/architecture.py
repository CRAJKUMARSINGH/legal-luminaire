"""Pleading architecture: mandatory sections by template family and stage."""

from __future__ import annotations

from dataclasses import dataclass
from typing import List

from drafting.catalog import DraftTemplate


@dataclass(frozen=True)
class PleadingSection:
    id: str
    heading_en: str
    heading_hi: str
    instruction: str
    required: bool = True


COMMON_OPENING: List[PleadingSection] = [
    PleadingSection(
        "cause_title",
        "Cause title / court heading",
        "न्यायालय शीर्षक",
        "Name the court and forum exactly as approved. If unknown, insert [Information required: court and forum]. Never invent a roster, coram or case number.",
    ),
    PleadingSection(
        "parties",
        "Memo of parties",
        "पक्षकारों का विवरण",
        "List parties with capacity (applicant/accused/plaintiff/defendant). Preserve spellings from approved sources. Flag conflicts instead of choosing a spelling.",
    ),
    PleadingSection(
        "subject",
        "Subject, provision and case particulars",
        "विषय, प्रावधान और प्रकरण विवरण",
        "State the document type and the statutory provision as a confirmed or placeholder reference. Include FIR / suit / notice numbers only if approved.",
    ),
]

FACTS = PleadingSection(
    "facts",
    "Narrative of facts",
    "प्रकरण के तथ्य",
    "Chronological facts drawn only from approved sources. Each material fact should remain traceable. Missing dates, amounts and names become visible placeholders.",
)

GROUNDS = PleadingSection(
    "grounds",
    "Legal grounds",
    "आधार",
    "Plead matter-family grounds that the approved facts can support. Do not invent authorities. Where a proposition needs a citation, write [Information required: verified authority for this proposition].",
)

PRAYER = PleadingSection(
    "prayer",
    "Prayer / relief",
    "प्रार्थना",
    "Ask only for reliefs that fit the template and instructions. Do not add damages, discharge, or quashing unless the selected template and facts support them.",
)

VERIFICATION = PleadingSection(
    "verification",
    "Verification",
    "सत्यापन",
    "Standard verification of the deponent/counsel with place, date and capacity as placeholders if unknown.",
)

ANNEXURES = PleadingSection(
    "annexures",
    "List of annexures",
    "संलग्नक सूची",
    "Index only documents that exist in approved sources or that the user has instructed to attach. Leave lettered placeholders for missing exhibits rather than fabricating exhibit numbers.",
)

SOURCE_CONTROL = PleadingSection(
    "source_control",
    "Source control and counsel certificate",
    "स्रोत नियंत्रण और अधिवक्ता प्रमाण",
    "Close with a source-control block listing approved sources, unresolved placeholders, citation-status reminder, and that the draft is not filing-ready.",
)

REPLY_CORE: List[PleadingSection] = [
    PleadingSection(
        "preliminary_objections",
        "Preliminary objections / reservations",
        "प्रारंभिक आपत्तियाँ",
        "Raise jurisdiction, limitation, maintainability, non-joinder, or notice defects only if the approved facts support them. Otherwise omit rather than invent.",
        False,
    ),
    PleadingSection(
        "para_wise",
        "Para-wise reply",
        "पैरावार उत्तर",
        "Answer each numbered paragraph: admitted / denied / not admitted and put to strict proof / needs no reply. Do not introduce a parallel narrative except to explain a denial.",
    ),
]

REJOINDER_CORE: List[PleadingSection] = [
    PleadingSection(
        "scope",
        "Scope of rejoinder",
        "प्रत्युत्तर की सीमा",
        "Confine the rejoinder to new facts or new legal pleas in the opposing reply. Do not restate the entire original pleading.",
    ),
    PleadingSection(
        "reply_to_new_matter",
        "Reply to new matter",
        "नए तथ्यों का उत्तर",
        "Deal seriatim with new allegations. Silence on a new material allegation is not permitted; use a placeholder if instructions are missing.",
    ),
]


STAGE_INSTRUCTIONS = {
    "initial": (
        "STAGE — INITIAL PLEADING: Open a positive case. State facts, grounds and prayer completely. "
        "Do not write in reply style. Do not assume the opponent's defences."
    ),
    "reply": (
        "STAGE — REPLY / OBJECTION / WRITTEN STATEMENT: Prefer para-wise structure. "
        "Admit only what is truly admitted. Put unproved facts to strict proof. "
        "Do not volunteer a new positive case except as a set-off, counter-claim or statutory defence supported by instructions."
    ),
    "rejoinder": (
        "STAGE — REJOINDER / REPLICATION: Answer only new matter. "
        "Do not enlarge the original cause of action. Do not introduce fresh documents unless identified as a supplementary annexure with a placeholder if the exhibit is missing."
    ),
    "supplementary": (
        "STAGE — SUPPLEMENTARY APPLICATION / AFFIDAVIT: Recite the pending proceeding, state why the additional fact or document could not be placed earlier, and annex the new material. "
        "Do not rewrite the parent pleading."
    ),
    "evidence": (
        "STAGE — EVIDENCE / DOCUMENT APPLICATION: Identify the precise document, witness or inspection sought, its relevance to a pleaded issue, and the prejudice if refused. "
        "Do not narrate the entire case again."
    ),
    "written_submissions": (
        "STAGE — WRITTEN SUBMISSIONS: Argue from the existing record. Head each proposition, tie it to an exhibit or deposition if cited, and close with the exact relief. "
        "No new evidence. No unverified authorities."
    ),
    "appeal_revision": (
        "STAGE — APPEAL / REVISION: Recite the impugned order, the court below, and the precise error of law or jurisdiction. "
        "Do not retry disputed facts unless the selected remedy permits it. Compute limitation only from approved dates."
    ),
    "execution": (
        "STAGE — EXECUTION / COMPLIANCE: Recite the executable decree or order, the amount or act due, and the mode of execution sought. "
        "Do not reopen merits."
    ),
}


def architecture_for(template: DraftTemplate, stage: str) -> List[PleadingSection]:
    stage = stage if stage in STAGE_INSTRUCTIONS else template.default_stage
    sections = list(COMMON_OPENING)

    if stage == "reply":
        sections.extend(REPLY_CORE)
        sections.append(FACTS)
        sections.append(GROUNDS)
    elif stage == "rejoinder":
        sections.extend(REJOINDER_CORE)
        sections.append(GROUNDS)
    elif stage == "written_submissions":
        sections.append(FACTS)
        sections.append(GROUNDS)
        sections.append(
            PleadingSection(
                "record_map",
                "Record map",
                "अभिलेख मानचित्र",
                "Map each proposition to an approved exhibit, deposition or order. If the exhibit number is unknown, use [Information required: exhibit number].",
            )
        )
    elif stage in ("evidence", "supplementary"):
        sections.append(FACTS)
        sections.append(
            PleadingSection(
                "specific_relief_body",
                "Specific request",
                "विशिष्ट निवेदन",
                "State the limited procedural request. Keep the body short and record-linked.",
            )
        )
    else:
        sections.append(FACTS)
        sections.append(GROUNDS)

    if template.id == "defence_brief":
        sections.append(
            PleadingSection(
                "hearing_strategy",
                "Hearing strategy (internal)",
                "सुनवाई रणनीति (आंतरिक)",
                "Mark this section INTERNAL. Identify forensic or procedural gaps, suggested cross-examination themes, and risks. Do not present it as a court filing unless asked.",
                False,
            )
        )

    sections.extend([PRAYER, VERIFICATION, ANNEXURES, SOURCE_CONTROL])
    return sections
