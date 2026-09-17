"""Matter families, document stages, and bilingual template catalog."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional


STAGE_IDS = (
    "initial",
    "reply",
    "rejoinder",
    "supplementary",
    "evidence",
    "written_submissions",
    "appeal_revision",
    "execution",
)

DOCUMENT_STAGES: List[Dict[str, str]] = [
    {"id": "initial", "label_en": "Initial application / petition / claim", "label_hi": "प्रारंभिक आवेदन / याचिका / दावा"},
    {"id": "reply", "label_en": "Reply / objection / written statement", "label_hi": "उत्तर / आपत्ति / लिखित बयान"},
    {"id": "rejoinder", "label_en": "Rejoinder / replication", "label_hi": "प्रत्युत्तर / प्रतिउत्तर"},
    {"id": "supplementary", "label_en": "Supplementary application / affidavit", "label_hi": "पूरक आवेदन / शपथपत्र"},
    {"id": "evidence", "label_en": "Evidence or document application", "label_hi": "साक्ष्य या दस्तावेज आवेदन"},
    {"id": "written_submissions", "label_en": "Written submissions", "label_hi": "लिखित प्रस्तुतियाँ"},
    {"id": "appeal_revision", "label_en": "Appeal / revision", "label_hi": "अपील / पुनरीक्षण"},
    {"id": "execution", "label_en": "Execution / compliance", "label_hi": "निष्पादन / अनुपालन"},
]


@dataclass(frozen=True)
class DraftTemplate:
    id: str
    category: str  # criminal | civil
    matter_family: str
    default_stage: str
    name_en: str
    name_hi: str
    purpose: str
    typical_use: str
    starter: bool
    provision_hint: str
    allowed_stages: tuple[str, ...]


CRIMINAL_STAGES = (
    "initial",
    "reply",
    "rejoinder",
    "supplementary",
    "evidence",
    "written_submissions",
    "appeal_revision",
)
CIVIL_STAGES = (
    "initial",
    "reply",
    "rejoinder",
    "supplementary",
    "evidence",
    "written_submissions",
    "appeal_revision",
    "execution",
)

TEMPLATES: List[DraftTemplate] = [
    DraftTemplate(
        "regular_bail", "criminal", "bail", "initial",
        "Regular Bail Application", "नियमित जमानत आवेदन",
        "Seek regular bail after arrest or surrender.",
        "Sessions / Magistrate custody matters.",
        True,
        "Confirm whether BNSS 480/483 or CrPC 437/439 applies to the forum and date of filing.",
        CRIMINAL_STAGES,
    ),
    DraftTemplate(
        "anticipatory_bail", "criminal", "anticipatory_bail", "initial",
        "Anticipatory Bail Application", "अग्रिम जमानत आवेदन",
        "Seek pre-arrest protection on demonstrated apprehension.",
        "When arrest is reasonably apprehended.",
        False,
        "Confirm BNSS 482 or CrPC 438 and the competent court.",
        CRIMINAL_STAGES,
    ),
    DraftTemplate(
        "discharge", "criminal", "discharge", "initial",
        "Discharge Application", "आरोपमुक्ति आवेदन",
        "Seek discharge on charge-sheet materials without a trial.",
        "After charge-sheet / before charge is framed.",
        True,
        "Confirm BNSS 250 / CrPC 227 (Sessions) or BNSS 262 / CrPC 239 (Magistrate).",
        CRIMINAL_STAGES,
    ),
    DraftTemplate(
        "criminal_complaint", "criminal", "criminal_complaint", "initial",
        "Criminal Complaint", "आपराधिक शिकायत",
        "Initiate a private criminal complaint.",
        "Magistrate complaint cases.",
        False,
        "Confirm complaint procedure under BNSS/CrPC for the alleged offence.",
        CRIMINAL_STAGES,
    ),
    DraftTemplate(
        "reply_criminal_complaint", "criminal", "criminal_complaint", "reply",
        "Reply to Criminal Complaint", "आपराधिक शिकायत का उत्तर",
        "Respond para-wise to a criminal complaint.",
        "After summons or notice to accused.",
        False,
        "Confine reply to numbered paragraphs of the complaint.",
        CRIMINAL_STAGES,
    ),
    DraftTemplate(
        "reply_show_cause", "criminal", "show_cause", "reply",
        "Reply to Show-Cause Notice", "कारण बताओ नोटिस का उत्तर",
        "Answer a show-cause notice without conceding unproven facts.",
        "Departmental, court, or investigating-agency notices.",
        True,
        "Quote the notice number and date exactly as approved, or use a placeholder.",
        ("reply", "rejoinder", "written_submissions"),
    ),
    DraftTemplate(
        "criminal_written_submissions", "criminal", "final_defence", "written_submissions",
        "Criminal Written Submissions", "आपराधिक मामले में लिखित प्रस्तुतियाँ",
        "Final written arguments on the record as it stands.",
        "After evidence or at the hearing of the application.",
        False,
        "Argue only from exhibited or admitted materials listed in sources.",
        ("written_submissions", "rejoinder"),
    ),
    DraftTemplate(
        "defence_brief", "criminal", "final_defence", "written_submissions",
        "Defence Brief", "बचाव पक्ष का संक्षिप्त विवरण",
        "Internal senior-counsel brief of facts, gaps and hearing strategy.",
        "Chamber preparation; not a pleading unless so directed.",
        True,
        "Mark the brief as internal unless the user asks for a filing version.",
        ("written_submissions", "initial"),
    ),
    DraftTemplate(
        "criminal_revision", "criminal", "criminal_revision", "appeal_revision",
        "Criminal Revision Petition", "आपराधिक पुनरीक्षण याचिका",
        "Challenge an inferior criminal order in revision.",
        "District Court or High Court revision.",
        False,
        "Identify the impugned order date, forum and limitation status with placeholders if unknown.",
        ("appeal_revision", "reply", "rejoinder", "written_submissions"),
    ),
    DraftTemplate(
        "criminal_appeal", "criminal", "criminal_appeal", "appeal_revision",
        "Criminal Appeal", "आपराधिक अपील",
        "Appeal against conviction, acquittal or sentence.",
        "Appellate criminal courts.",
        False,
        "State the judgment date and the precise relief (acquittal / sentence / bail pending appeal) only from approved facts.",
        ("appeal_revision", "reply", "rejoinder", "written_submissions"),
    ),
    DraftTemplate(
        "exemption_appearance", "criminal", "personal_appearance", "initial",
        "Application for Exemption from Personal Appearance", "व्यक्तिगत उपस्थिति से छूट का आवेदन",
        "Seek exemption from personal attendance on stated grounds.",
        "Routine or medical/professional inability to attend.",
        False,
        "Confirm BNSS/CrPC exemption provision applicable to the proceeding.",
        ("initial", "reply", "rejoinder"),
    ),
    DraftTemplate(
        "supply_documents", "criminal", "document_supply", "evidence",
        "Application for Supply of Documents", "दस्तावेज उपलब्ध कराने का आवेदन",
        "Seek supply or inspection of relied documents.",
        "When the prosecution/complainant list is incomplete.",
        False,
        "List only documents whose non-supply is supported by the record.",
        ("evidence", "reply", "rejoinder"),
    ),
    DraftTemplate(
        "recall_witness", "criminal", "witness_procedure", "evidence",
        "Application for Recall of Witness", "साक्षी को पुनः बुलाने का आवेदन",
        "Seek recall or re-examination of a witness.",
        "Where a specific gap in examination is identified.",
        False,
        "Name the witness and the precise point for recall; do not invent testimony.",
        ("evidence", "reply", "rejoinder"),
    ),
    DraftTemplate(
        "modify_bail_conditions", "criminal", "bail_conditions", "initial",
        "Application to Modify Bail Conditions", "जमानत शर्तों में संशोधन का आवेदन",
        "Relax or modify existing bail conditions.",
        "After bail is granted but conditions are unworkable.",
        False,
        "Recite the existing order date and conditions exactly, or placeholder them.",
        ("initial", "reply", "rejoinder"),
    ),
    DraftTemplate(
        "ni_complaint", "criminal", "cheque_dishonour", "initial",
        "Negotiable Instruments / Cheque-Bounce Complaint", "परक्राम्य लिखत / चेक बाउंस शिकायत",
        "Complaint for dishonour of cheque.",
        "NI Act / corresponding provision as in force.",
        False,
        "Confirm cheque number, amount, bank, demand-notice date and limitation from approved facts only.",
        CRIMINAL_STAGES,
    ),
    DraftTemplate(
        "legal_notice", "civil", "legal_notice", "initial",
        "Legal Notice", "कानूनी नोटिस",
        "Pre-action demand or statutory notice.",
        "Before suit, consumer complaint or arbitration.",
        True,
        "Do not threaten criminal process unless the approved facts disclose a criminal ingredient.",
        ("initial", "rejoinder"),
    ),
    DraftTemplate(
        "reply_legal_notice", "civil", "legal_notice", "reply",
        "Reply to Legal Notice", "कानूनी नोटिस का उत्तर",
        "Para-wise reply without admitting unproven claims.",
        "After receipt of a legal notice.",
        True,
        "Reply only to numbered paragraphs; reserve rights on unserved annexures.",
        ("reply", "rejoinder"),
    ),
    DraftTemplate(
        "plaint", "civil", "civil_suit", "initial",
        "Plaint / Civil Suit", "वादपत्र / दीवानी वाद",
        "Instituting pleading for a civil claim.",
        "Civil / commercial courts.",
        False,
        "Plead cause of action, jurisdiction, valuation and limitation from approved facts; placeholder the rest.",
        CIVIL_STAGES,
    ),
    DraftTemplate(
        "written_statement", "civil", "civil_suit", "reply",
        "Written Statement", "लिखित बयान",
        "Defence pleading: admit, deny, or put to proof.",
        "After summons in a civil suit.",
        True,
        "Use para-wise response. Preliminary objections first, then merits.",
        ("reply", "rejoinder", "supplementary"),
    ),
    DraftTemplate(
        "replication", "civil", "civil_suit", "rejoinder",
        "Replication / Rejoinder", "प्रत्युत्तर / प्रतिउत्तर",
        "Reply confined to new matter in the defence.",
        "After written statement or reply affidavit.",
        False,
        "Do not re-argue the entire plaint; answer only new facts and legal pleas.",
        ("rejoinder",),
    ),
    DraftTemplate(
        "interim_injunction", "civil", "interim_injunction", "initial",
        "Interim Injunction Application", "अंतरिम निषेधाज्ञा आवेदन",
        "Temporary restraint pending the suit.",
        "Order 39 style interlocutory relief — confirm CPC/commercial rules of the forum.",
        True,
        "Plead prima facie case, balance of convenience and irreparable injury only from approved facts.",
        ("initial", "reply", "rejoinder"),
    ),
    DraftTemplate(
        "permanent_injunction", "civil", "declaration", "initial",
        "Permanent Injunction Suit", "स्थायी निषेधाज्ञा वाद",
        "Perpetual injunction as final relief.",
        "Possession / interference disputes.",
        False,
        "Identify the property with the approved description; never invent survey numbers.",
        CIVIL_STAGES,
    ),
    DraftTemplate(
        "declaratory_suit", "civil", "declaration", "initial",
        "Declaratory Suit", "घोषणा वाद",
        "Declaration of legal character or right.",
        "Cloud on title or status disputes.",
        False,
        "State the precise declaration sought; do not expand relief beyond approved instructions.",
        CIVIL_STAGES,
    ),
    DraftTemplate(
        "specific_performance", "civil", "specific_performance", "initial",
        "Specific Performance Suit", "विशिष्ट निष्पादन वाद",
        "Compel performance of a concluded contract.",
        "Agreement to sell / unique contractual obligations.",
        False,
        "Plead readiness and willingness only if the approved facts support it.",
        CIVIL_STAGES,
    ),
    DraftTemplate(
        "money_recovery", "civil", "money_recovery", "initial",
        "Money Recovery Suit", "धन वसूली वाद",
        "Recover a quantified debt or dues.",
        "Loan, invoice, or contractual arrears.",
        False,
        "State principal, interest basis and calculation from approved figures only.",
        CIVIL_STAGES,
    ),
    DraftTemplate(
        "property_partition", "civil", "partition", "initial",
        "Property or Partition Suit", "संपत्ति / विभाजन वाद",
        "Partition or possession of joint property.",
        "Family / co-owner disputes.",
        False,
        "Schedule of property must come from approved sources; placeholder missing shares.",
        CIVIL_STAGES,
    ),
    DraftTemplate(
        "rent_eviction", "civil", "rent_eviction", "initial",
        "Rent and Eviction Proceeding", "किराया और बेदखली कार्यवाही",
        "Eviction, rent arrears or tenancy protection.",
        "Rent controller / civil court as applicable.",
        False,
        "Confirm the tenancy statute of the State; do not assume a uniform all-India rent code.",
        CIVIL_STAGES,
    ),
    DraftTemplate(
        "consumer_complaint", "civil", "consumer_dispute", "initial",
        "Consumer Complaint", "उपभोक्ता शिकायत",
        "Consumer forum complaint for deficiency or unfair practice.",
        "District / State / National Commission as per value.",
        False,
        "Plead pecuniary and territorial jurisdiction from approved invoice and address facts.",
        ("initial", "reply", "rejoinder", "written_submissions", "appeal_revision"),
    ),
    DraftTemplate(
        "arbitration_claim", "civil", "arbitration", "initial",
        "Arbitration Notice / Statement of Claim", "मध्यस्थता नोटिस / दावा विवरण",
        "Invoke arbitration or plead the claim before the tribunal.",
        "Contractual arbitration clauses.",
        False,
        "Recite the arbitration clause from the approved contract text; do not paraphrase a clause that is not in the record.",
        ("initial", "reply", "rejoinder", "written_submissions"),
    ),
    DraftTemplate(
        "civil_appeal", "civil", "civil_appeal", "appeal_revision",
        "Civil Appeal", "दीवानी अपील",
        "Appeal against a civil decree or order.",
        "First or second appeal as applicable.",
        False,
        "Identify the decree date, court and the precise challenge; placeholder limitation computation if dates are missing.",
        ("appeal_revision", "reply", "rejoinder", "written_submissions"),
    ),
]

_BY_ID = {t.id: t for t in TEMPLATES}

LEGACY_DRAFT_TYPE_MAP = {
    "BRIEF": "defence_brief",
    "DISCHARGE": "discharge",
    "BAIL_439": "regular_bail",
}


def get_template(template_id: str) -> DraftTemplate:
    if template_id not in _BY_ID:
        raise KeyError(f"Unknown template_id: {template_id}")
    return _BY_ID[template_id]


def list_templates(category: Optional[str] = None, starter_only: bool = False) -> List[DraftTemplate]:
    items = TEMPLATES
    if category:
        items = [t for t in items if t.category == category]
    if starter_only:
        items = [t for t in items if t.starter]
    return items


def resolve_legacy_draft_type(draft_type: str, template_id: Optional[str] = None) -> DraftTemplate:
    if template_id:
        return get_template(template_id)
    mapped = LEGACY_DRAFT_TYPE_MAP.get((draft_type or "").upper())
    if mapped:
        return get_template(mapped)
    if draft_type in _BY_ID:
        return get_template(draft_type)
    return get_template("discharge")


def template_as_dict(t: DraftTemplate) -> Dict:
    return {
        "id": t.id,
        "category": t.category,
        "matter_family": t.matter_family,
        "default_stage": t.default_stage,
        "name_en": t.name_en,
        "name_hi": t.name_hi,
        "purpose": t.purpose,
        "typical_use": t.typical_use,
        "starter": t.starter,
        "provision_hint": t.provision_hint,
        "allowed_stages": list(t.allowed_stages),
    }
