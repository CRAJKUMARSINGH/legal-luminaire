"""Prayer, verification, annexure and source-control blocks."""

from __future__ import annotations

from typing import Iterable, List

from drafting.catalog import DraftTemplate
from drafting.placeholders import info_required

PLACEHOLDER_DEPONENT = info_required("name and capacity of deponent")
PLACEHOLDER_PLACE = info_required("place of verification")
PLACEHOLDER_DATE = info_required("date of verification")


def prayer_lines(template: DraftTemplate, language: str) -> List[str]:
    hi = language in ("hi", "bilingual")
    en = language in ("en", "bilingual")
    lines: List[str] = []

    prayers = {
        "regular_bail": (
            "Enlarge the applicant on regular bail in the above case on such terms as this Hon'ble Court may deem fit.",
            "आवेदक को उपरोक्त प्रकरण में नियमित जमानत पर ऐसे निबंधनों पर छोड़ने की कृपा करें जो यह माननीय न्यायालय उचित समझे।",
        ),
        "anticipatory_bail": (
            "Direct that in the event of arrest the applicant be released on anticipatory bail on such conditions as this Hon'ble Court may impose.",
            "यह निदेश दें कि गिरफ्तारी की स्थिति में आवेदक को अग्रिम जमानत पर ऐसे निबंधनों पर रिहा किया जाए जो यह माननीय न्यायालय अधिरोपित करे।",
        ),
        "discharge": (
            "Discharge the accused from the alleged offences on the charge-sheet materials, and pass such further orders as may be just.",
            "आरोप-पत्र की सामग्री के आधार पर अभियुक्त को कथित अपराधों से आरोपमुक्त करें तथा अन्य उचित आदेश पारित करें।",
        ),
        "reply_legal_notice": (
            "Treat this as a reply without prejudice. The notice-sender is called upon to withdraw unsubstantiated claims. All rights are reserved.",
            "इसे बिना पूर्वाग्रह के उत्तर माना जाए। नोटिस प्रेषक से निराधार दावे वापस लेने की अपेक्षा है। समस्त अधिकार सुरक्षित हैं।",
        ),
        "legal_notice": (
            "Comply with the demand stated above within [Information required: compliance period], failing which appropriate civil proceedings may be initiated strictly as advised, without prejudice.",
            "उपरोक्त मांग का पालन [Information required: compliance period] के भीतर करें, अन्यथा बिना पूर्वाग्रह सलाह के अनुसार समुचित दीवानी कार्यवाही की जा सकेगी।",
        ),
        "written_statement": (
            "Dismiss the suit with costs. Any other relief that this Hon'ble Court deems fit may be granted.",
            "वाद को खर्चे के साथ निरस्त करें। अन्य कोई अनुतोष जो यह माननीय न्यायालय उचित समझे, प्रदान किया जाए।",
        ),
        "interim_injunction": (
            "Grant an ad-interim injunction restraining the opposite party from [Information required: threatened act] till the hearing of the application.",
            "आवेदन की सुनवाई तक विपक्षी को [Information required: threatened act] से अवरुद्ध करते हुए अंतरिम निषेधाज्ञा प्रदान करें।",
        ),
        "defence_brief": (
            "INTERNAL: Identify the hearing ask (bail / discharge / acquittal / other) from instructions. Do not convert this brief into a prayer clause for filing unless asked.",
            "आंतरिक: सुनवाई में मांगी जाने वाली राहत निर्देशों से लें। बिना निर्देश इसे दाखिल प्रार्थना न बनाएँ।",
        ),
    }
    en_line, hi_line = prayers.get(
        template.id,
        (
            f"Grant the relief appropriate to a {template.name_en}, confined to the approved facts, and pass such further orders as may be just.",
            f"{template.name_hi} के अनुरूप, केवल अनुमोदित तथ्यों तक सीमित, उचित अनुतोष प्रदान करें।",
        ),
    )
    if en:
        lines.append(en_line)
    if hi:
        lines.append(hi_line)
    lines.append(
        "No additional relief should be inserted unless it appears in the approved instructions."
        if language == "en"
        else "अनुमोदित निर्देशों के बिना कोई अतिरिक्त अनुतोष न जोड़ा जाए।"
        if language == "hi"
        else "No additional relief / अतिरिक्त अनुतोष without approved instructions."
    )
    return lines


def verification_block(language: str) -> str:
    body_en = (
        "I, {deponent}, do hereby verify that the contents of the foregoing paragraphs "
        "are true and correct to my knowledge derived from the approved case record "
        "and believed to be true. No part of it is false and nothing material has been concealed. "
        "Verified at {place} on {date}."
    ).format(deponent=PLACEHOLDER_DEPONENT, place=PLACEHOLDER_PLACE, date=PLACEHOLDER_DATE)
    body_hi = (
        "मैं, {deponent}, सत्यापित करता/करती हूँ कि पूर्ववर्ती पैराग्राफों की अंतर्वस्तु "
        "अनुमोदित अभिलेख से प्राप्त मेरे ज्ञान में सत्य है। कोई भाग असत्य नहीं है और कोई तात्त्विक तथ्य छिपाया नहीं गया है। "
        "सत्यापन स्थान {place} दिनांक {date}।"
    ).format(deponent=PLACEHOLDER_DEPONENT, place=PLACEHOLDER_PLACE, date=PLACEHOLDER_DATE)
    if language == "hi":
        return "सत्यापन / VERIFICATION\n\n" + body_hi
    if language == "bilingual":
        return "VERIFICATION / सत्यापन\n\n" + body_en + "\n\n" + body_hi
    return "VERIFICATION\n\n" + body_en


def annexure_block(language: str, known_documents: Iterable[str]) -> str:
    docs = [d.strip() for d in known_documents if d and str(d).strip()]
    heading = "LIST OF ANNEXURES / संलग्नक सूची" if language == "bilingual" else (
        "संलग्नक सूची" if language == "hi" else "LIST OF ANNEXURES"
    )
    lines = [heading, ""]
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if not docs:
        lines.append(f"Annexure-A  {info_required('first supporting document and its date')}")
        lines.append(f"Annexure-B  {info_required('second supporting document and its date')}")
        lines.append(
            "Do not invent exhibit numbers, FIR annexure marks, or document titles."
        )
        return "\n".join(lines)
    for i, doc in enumerate(docs):
        letter = letters[i] if i < len(letters) else str(i + 1)
        lines.append(f"Annexure-{letter}  {doc}")
    lines.append(
        f"Annexure-{letters[min(len(docs), 25)]}  {info_required('any further exhibit actually available')}"
    )
    return "\n".join(lines)


def source_control_block(
    language: str,
    approved_sources: List[str],
    excluded_sources: List[str],
    placeholders: List[str],
    conflicts: List[str],
) -> str:
    heading = "SOURCE CONTROL / स्रोत नियंत्रण" if language != "hi" else "स्रोत नियंत्रण"
    lines = [
        "=" * 64,
        heading,
        "=" * 64,
        "Facts in this draft may be taken only from approved sources.",
        "Do not invent parties, dates, amounts, sections, or authorities.",
        "",
        "Approved sources:",
    ]
    if approved_sources:
        lines.extend(f"  - {s}" for s in approved_sources)
    else:
        lines.append(f"  - {info_required('at least one approved source of facts')}")
    lines.append("")
    lines.append("Excluded / unapproved sources (not used):")
    if excluded_sources:
        lines.extend(f"  - {s}" for s in excluded_sources)
    else:
        lines.append("  - None listed.")
    lines += ["", "Unresolved placeholders:"]
    if placeholders:
        lines.extend(f"  - {p}" for p in placeholders[:40])
    else:
        lines.append("  - None detected in the structured matter fields.")
    lines += ["", "Source conflicts:"]
    if conflicts:
        lines.extend(f"  - {c}" for c in conflicts)
    else:
        lines.append("  - None detected by the structured checker.")
    lines += [
        "",
        "Citation rule: insert only authorities supplied in the verified/Court-safe context.",
        "Otherwise keep [Information required: verified authority for this proposition].",
        "",
        "COUNSEL CERTIFICATE: This is an AI-assisted draft. It is not filing-ready.",
        "An advocate must review facts, law, forum, limitation, court-fee and prayer before use.",
        "अधिवक्ता प्रमाण: यह प्रारूप दाखिल करने योग्य नहीं है जब तक अधिवक्ता समीक्षा पूरी न हो।",
        "=" * 64,
    ]
    return "\n".join(lines)
