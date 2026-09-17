"""Matter-family-specific ground scaffolds.

These are pleading themes and instructions, not holdings and not a substitute
for research. Unknown law and unknown facts must remain placeholders.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


@dataclass(frozen=True)
class GroundScaffold:
    id: str
    title_en: str
    title_hi: str
    instruction: str
    required_facts: tuple[str, ...]


def _g(gid: str, en: str, hi: str, instruction: str, *facts: str) -> GroundScaffold:
    return GroundScaffold(gid, en, hi, instruction, facts)


BAIL = [
    _g("role_attributed", "Role attributed in the accusation", "आरोप में आरोपित भूमिका",
       "Plead the role actually attributed in the FIR/charge-sheet. Do not minimise a role that the approved record attributes. If the role is unclear, placeholder it.",
       "alleged_role", "sections_invoked"),
    _g("custody_and_investigation", "Custody and status of investigation", "हिरासत और जांच की स्थिति",
       "State arrest date, period in custody and whether investigation is stated to be complete — only from approved facts. Never invent a custody period.",
       "arrest_date", "custody_status", "investigation_status"),
    _g("flight_and_tampering", "Flight risk, influence and evidence-tampering", "फरार होने, प्रभाव डालने या साक्ष्य बिगाड़ने का जोखिम",
       "Address roots, passport, prior absconding, and alleged influence only if those facts are in the approved record. If silent, write that no such allegation is on record, or placeholder.",
       "residence", "prior_process"),
    _g("parity", "Parity with co-accused", "सह-आरोपी के साथ समता",
       "Raise parity only if a named co-accused has been enlarged on bail on comparable allegations. Placeholder the co-accused name and order date if unknown. Do not invent a bail order.",
       "co_accused_bail_order"),
    _g("conditions", "Willingness to abide by conditions", "शर्तों का पालन करने की सहमति",
       "Offer attendance, bond, and non-contact conditions appropriate to the forum. Do not promise facts (employment, surety names) that are not approved.",
       "surety_particulars"),
    _g("statutory_forum", "Competent provision and forum", "सक्षम प्रावधान और न्यायालय",
       "Name BNSS or CrPC provision only if confirmed for the filing date. Otherwise: [Information required: applicable bail provision and competent court].",
       "applicable_provision", "court_name"),
]

ANTICIPATORY = [
    _g("apprehension", "Reasonable apprehension of arrest", "गिरफ्तारी की युक्तियुक्त आशंका",
       "Plead the concrete basis for apprehension (notice, raids, threats) from approved facts. Do not invent an impending arrest.",
       "basis_of_apprehension"),
    _g("cooperation", "Cooperation with investigation", "जांच में सहयोग",
       "State actual cooperation (appearance, documents produced) only if sourced. Offer future cooperation as an undertaking, not as a past fact.",
       "cooperation_facts"),
    *BAIL[:3],
    BAIL[-1],
]

DISCHARGE = [
    _g("no_prima_facie", "No prima facie case on the charge-sheet materials", "आरोप-पत्र की सामग्री पर प्रथम दृष्टया मामला नहीं",
       "Work only from the charge-sheet, relied documents and statements as approved. Do not introduce defence evidence. If the charge-sheet is not in the sources, placeholder it.",
       "charge_sheet_date", "relied_documents"),
    _g("ingredients", "Essential ingredients of the alleged offence", "कथित अपराध के आवश्यक घटक",
       "Take each invoked section from the approved list and test ingredients against pleaded facts. Do not add sections. Do not recast the prosecution case.",
       "sections_invoked"),
    _g("personal_role", "Absence of personal or vicarious role", "व्यक्तिगत या प्रतिनिधिक भूमिका का अभाव",
       "If the accused is sought to be tied by office, contract or company position, plead the actual role from the record. Do not invent a job description.",
       "alleged_role"),
    _g("scientific_foundation", "Scientific or documentary foundation", "वैज्ञानिक या दस्तावेजी आधार",
       "Raise lab, sampling, chain-of-custody or standard-selection defects only when the approved forensic/record materials support them. Quote IS/ASTM clause numbers only if supplied and verified. Otherwise placeholder the standard.",
       "forensic_gaps"),
    _g("sanction_or_bar", "Legal bar, sanction or want of jurisdiction", "विधिक वर्जन, मंजूरी या अधिकारिता का अभाव",
       "Plead a statutory bar only if the approved facts identify the missing sanction or the wrong forum. Do not assume a sanction defect.",
       "sanction_status"),
    _g("internal_inconsistency", "Internal inconsistency of relied materials", "आधार सामग्री की आंतरिक असंगति",
       "Point to conflicting dates, quantities or attributions already present in approved sources. Do not silently pick one version.",
       "conflicting_facts"),
]

SHOW_CAUSE = [
    _g("notice_scope", "Scope of the notice", "नोटिस की सीमा",
       "Restate the allegations actually made in the notice. Do not answer uncharged insinuations as if they were charges.",
       "notice_number", "notice_date"),
    _g("factual_reply", "Factual reply without admission", "बिना स्वीकृति के तथ्यात्मक उत्तर",
       "Deny or explain each allegation with sourced facts. Mark unknown items as [Information required: …].",
       "alleged_facts"),
    _g("jurisdiction_process", "Jurisdiction and process", "अधिकारिता और प्रक्रिया",
       "Raise competence, limitation or hearing defects only if supported. Request a personal hearing if instructed.",
       "issuing_authority"),
]

CHEQUE = [
    _g("statutory_ingredients", "Statutory ingredients of dishonour", "अनादर के सांविधिक घटक",
       "Plead drawer, payee, cheque particulars, presentation, dishonour memo, demand notice and cause of action only from approved instruments.",
       "cheque_number", "cheque_amount", "dishonour_date", "demand_notice_date"),
    _g("limitation_and_service", "Limitation and service of notice", "परिसीमा और नोटिस की तामील",
       "Compute limitation only with approved dates. If a date is missing, placeholder the entire computation rather than guessing.",
       "demand_notice_date", "complaint_date"),
    _g("legally_enforceable_debt", "Legally enforceable debt or liability", "विधिक रूप से प्रवर्तनीय ऋण या दायित्व",
       "For a defence reply, put the debt to proof unless approved facts admit it. For a complaint, plead the liability from approved transactions only.",
       "underlying_transaction"),
]

COMPLAINT_CRIMINAL = [
    _g("cognizable_facts", "Facts constituting the offence", "अपराध गठित करने वाले तथ्य",
       "Narrate only sourced facts. Name the offence sections as invoked by instructions, not as a legal conclusion beyond the record.",
       "incident_date", "sections_invoked"),
    _g("jurisdiction", "Territorial and cognizance jurisdiction", "क्षेत्रीय और संज्ञान अधिकारिता",
       "Place of occurrence and the magistrate/court must come from approved facts or placeholders.",
       "place_of_occurrence", "court_name"),
]

REVISION_APPEAL = [
    _g("impugned_order", "The impugned order", "आक्षेपित आदेश",
       "Identify court, date, operative portion. Quote only if the order text is an approved source.",
       "impugned_order_date", "impugned_court"),
    _g("error_of_law", "Error of law or jurisdiction", "विधि या अधिकारिता की त्रुटि",
       "State the precise legal error. Do not re-argue pure facts unless the remedy permits. No invented precedents.",
       "grounds_of_challenge"),
    _g("limitation", "Limitation and condonation", "परिसीमा और विलंब क्षमा",
       "If dates are incomplete, placeholder the limitation calculation. Do not invent a sufficient-cause affidavit.",
       "judgment_date", "filing_date"),
]

LEGAL_NOTICE = [
    _g("contract_or_wrong", "Cause of action", "वाद कारण",
       "Recite the contract, invoice, notice history or civil wrong from approved facts. Quantify only approved amounts.",
       "cause_of_action_date", "amount_claimed"),
    _g("demand", "Clear demand and timeline", "स्पष्ट मांग और समय",
       "State the amount or act demanded and a reasonable compliance period. Do not invent a statutory period unless the statute is identified in instructions.",
       "amount_claimed"),
    _g("consequences", "Intended civil consequences", "अनुध्यात दीवानी परिणाम",
       "Reserve the right to sue, claim interest or costs as instructed. Do not threaten arrest or criminal prosecution unless the approved facts disclose a criminal ingredient and the user so instructs.",
    ),
]

REPLY_NOTICE = [
    _g("without_prejudice", "Reply without prejudice and without admission", "बिना पूर्वाग्रह और बिना स्वीकृति के उत्तर",
       "Open by reserving rights. Do not admit quantum, liability or service unless approved.",
    ),
    _g("para_wise_notice", "Para-wise traversal", "पैरावार खंडन",
       "Answer each notice paragraph. If annexures were not served, say so rather than guessing their contents.",
       "notice_date"),
    _g("positive_defence", "Positive defence, if any", "सकारात्मक बचाव, यदि हो",
       "Plead set-off, limitation, want of privity, or payment only from approved facts. Otherwise omit.",
       "defence_facts"),
]

PLAINT_CIVIL = [
    _g("jurisdiction_valuation", "Jurisdiction, valuation and court fee", "अधिकारिता, मूल्यांकन और न्यायालय शुल्क",
       "Plead territorial, pecuniary and subject-matter jurisdiction from approved facts. Placeholder valuation if unknown. Do not invent court-fee figures.",
       "valuation", "cause_of_action_place"),
    _g("cause_of_action", "Cause of action and limitation", "वाद कारण और परिसीमा",
       "Date of cause of action must be sourced. If several dates exist and conflict, stop and warn rather than picking one.",
       "cause_of_action_date"),
    _g("reliefs", "Reliefs sought", "मांगी गई राहतें",
       "List only instructed reliefs. Do not add injunctions, declarations or mesne profits unless asked.",
    ),
]

WRITTEN_STATEMENT = [
    _g("maintainability", "Maintainability and preliminary bars", "पोषणीयता और प्रारंभिक वर्जन",
       "Limitation, undervaluation, non-joinder, arbitration clause, or want of notice — only if sourced.",
    ),
    _g("para_wise_plaint", "Para-wise reply to the plaint", "वादपत्र का पैरावार उत्तर",
       "Admit / deny / put to proof. Specific denial of amounts, dates and property descriptions.",
    ),
    _g("additional_pleas", "Additional pleas", "अतिरिक्त अभिवचन",
       "Set-off, counter-claim or special defence only with approved facts and quantified figures.",
       "defence_facts"),
]

INJUNCTION = [
    _g("prima_facie", "Prima facie case", "प्रथम दृष्टया मामला",
       "Tie the right claimed to approved title/possession documents. Placeholder missing title deeds.",
       "property_description"),
    _g("balance", "Balance of convenience", "सुविधा का संतुलन",
       "Explain comparative hardship from approved facts, not rhetoric.",
    ),
    _g("irreparable", "Irreparable injury", "अपूरणीय क्षति",
       "Identify the specific act threatened. Do not invent ongoing construction, alienation or dispossession.",
       "threatened_act"),
]

MONEY = [
    _g("ledger", "Amount due", "देय राशि",
       "Principal, credits and interest basis from approved accounts. Placeholder any unproven interest rate.",
       "amount_claimed", "interest_basis"),
    _g("default", "Default and demand", "व्यतिक्रम और मांग",
       "Date of default and prior demands from approved correspondence.",
       "default_date"),
]

CONSUMER = [
    _g("consumer_status", "Status as consumer", "उपभोक्ता की हैसियत",
       "Plead consideration and purpose of the service/goods from the invoice. Do not assume commercial-purpose exclusion or inclusion.",
       "invoice_particulars"),
    _g("deficiency", "Deficiency or unfair practice", "कमी या अनुचित व्यापार व्यवहार",
       "Describe the defect or delay from approved facts. Quantify loss only with sourced figures.",
       "deficiency_facts"),
]

ARBITRATION = [
    _g("clause", "Arbitration agreement", "मध्यस्थता करार",
       "Quote the clause from the approved contract. If the clause text is missing: [Information required: arbitration clause text].",
       "arbitration_clause"),
    _g("seat_and_claims", "Seat, applicable rules and claims", "स्थान, नियम और दावे",
       "Seat, language and quantified claims only from the contract and approved instructions.",
       "amount_claimed"),
]

EXECUTION = [
    _g("decree", "Executable decree or order", "निष्पादनीय डिक्री या आदेश",
       "Recite the operative portion, date and amount remaining due from approved facts.",
       "decree_date", "amount_claimed"),
    _g("mode", "Mode of execution", "निष्पादन की रीति",
       "Attachment, arrest, delivery of possession or other mode — only as instructed. Do not choose a coercive mode by default.",
    ),
]

GROUNDS_BY_FAMILY: Dict[str, List[GroundScaffold]] = {
    "bail": BAIL,
    "anticipatory_bail": ANTICIPATORY,
    "discharge": DISCHARGE,
    "show_cause": SHOW_CAUSE,
    "cheque_dishonour": CHEQUE,
    "criminal_complaint": COMPLAINT_CRIMINAL,
    "quashing": DISCHARGE,
    "closure_report": COMPLAINT_CRIMINAL,
    "criminal_revision": REVISION_APPEAL,
    "criminal_appeal": REVISION_APPEAL,
    "personal_appearance": [
        _g("cause", "Cause for exemption", "छूट का कारण",
           "Plead the date of hearing and the reason (illness, distance, counsel undertaking) from approved facts.",
           "hearing_date", "exemption_cause"),
    ],
    "document_supply": [
        _g("relevance", "Relevance of the withheld documents", "रोके गए दस्तावेजों की प्रासंगिकता",
           "Name each document from the charge-sheet list or notice. Do not invent document titles.",
           "document_list"),
    ],
    "witness_procedure": [
        _g("recall_point", "Specific point for recall", "पुनः बुलाए जाने का विशिष्ट बिंदु",
           "Identify the witness, prior examination date and the omitted question area from the record.",
           "witness_name"),
    ],
    "bail_conditions": [
        _g("existing_order", "Existing bail order and hardship", "विद्यमान जमानत आदेश और कठिनाई",
           "Recite conditions verbatim from the order or placeholder them. Explain the practical hardship from approved facts.",
           "bail_order_date"),
    ],
    "final_defence": DISCHARGE,
    "legal_notice": LEGAL_NOTICE,
    "civil_suit": PLAINT_CIVIL,
    "interim_injunction": INJUNCTION,
    "declaration": INJUNCTION[:1] + PLAINT_CIVIL,
    "specific_performance": [
        _g("contract", "Concluded contract", "संपन्न संविदा",
           "Plead execution, consideration and remaining obligation from the approved agreement.",
           "agreement_date"),
        _g("readiness", "Readiness and willingness", "तत्परता और इच्छा",
           "Plead readiness only if approved facts support continuous willingness. Otherwise placeholder.",
        ),
    ],
    "money_recovery": MONEY,
    "property_dispute": INJUNCTION,
    "partition": [
        _g("jointness", "Jointness and shares", "संयुक्तता और अंश",
           "Plead genealogy and shares from approved facts. Placeholder unknown shares rather than equalising by assumption.",
           "property_description"),
    ],
    "rent_eviction": [
        _g("tenancy", "Tenancy and default", "किरायेदारी और व्यतिक्रम",
           "Rent, arrears and the State tenancy statute from approved facts. Do not assume a ground of eviction.",
           "rent_amount", "default_date"),
    ],
    "consumer_dispute": CONSUMER,
    "contract_dispute": MONEY,
    "arbitration": ARBITRATION,
    "commercial_dispute": MONEY,
    "civil_appeal": REVISION_APPEAL,
    "execution": EXECUTION,
}


def grounds_for_family(matter_family: str) -> List[GroundScaffold]:
    return GROUNDS_BY_FAMILY.get(matter_family, PLAINT_CIVIL)
