"""
PII redaction utilities for Legal Luminaire.

Masks sensitive Indian personal identifiers before any text is passed to an LLM,
stored in logs, or returned in API responses.

Covered identifiers:
  - Aadhaar (12-digit, with or without spaces/hyphens)
  - PAN Card (AAAAA9999A format)
  - Indian mobile numbers (+91 / 0 prefix or standalone 10-digit starting 6-9)
  - Email addresses
  - Indian passport numbers (1 uppercase letter + 7 digits)
  - Voter ID / EPIC numbers (3 uppercase letters + 7 digits)

Intentionally NOT redacted:
  - Full names — required for case-timeline coherence in AI context
  - Case numbers / docket numbers — not PII

Note on bank accounts: a generic 9–18 digit redaction pattern produces too many
false positives against case numbers, section references and dates.  Bank account
numbers are not redacted by this utility; they should be handled at the document
intake layer where context is available.
"""

import re


# ── Compiled patterns (order matters — more specific first) ───────────────────

_PATTERNS: list[tuple[str, re.Pattern, str]] = [
    # Aadhaar: 12 digits, optionally formatted as XXXX XXXX XXXX or XXXX-XXXX-XXXX
    (
        "aadhaar",
        re.compile(r"\b\d{4}[ \-]?\d{4}[ \-]?\d{4}\b"),
        "[AADHAAR-REDACTED]",
    ),
    # PAN: exactly 5 uppercase letters + 4 digits + 1 uppercase letter
    (
        "pan",
        re.compile(r"\b[A-Z]{5}\d{4}[A-Z]\b"),
        "[PAN-REDACTED]",
    ),
    # Indian mobile: optional +91 / 0 prefix, then 10 digits starting with 6-9
    (
        "phone",
        re.compile(r"(\+91[\-\s]?|0)?[6-9]\d{9}\b"),
        "[PHONE-REDACTED]",
    ),
    # Email addresses (RFC 5321 simplified)
    (
        "email",
        re.compile(r"\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b"),
        "[EMAIL-REDACTED]",
    ),
    # Indian passport: 1 uppercase letter + 7 digits (e.g. A1234567)
    # Word-boundary anchored to avoid matching inside longer numbers.
    (
        "passport",
        re.compile(r"\b[A-Z][0-9]{7}\b"),
        "[PASSPORT-REDACTED]",
    ),
    # Voter ID / EPIC: 3 uppercase letters + 7 digits (e.g. ABC1234567)
    (
        "voter_id",
        re.compile(r"\b[A-Z]{3}[0-9]{7}\b"),
        "[VOTERID-REDACTED]",
    ),
]


def redact_indian_pii(text: str) -> str:
    """
    Mask all detected Indian PII in *text* and return the redacted string.

    Applies patterns in order: Aadhaar → PAN → Phone → Email → Passport → VoterID.
    Names are intentionally kept to preserve case-timeline coherence.
    """
    if not text:
        return ""

    for _name, pattern, replacement in _PATTERNS:
        text = pattern.sub(replacement, text)

    return text


def audit_redaction_risk(text: str) -> dict:
    """
    Return a dict with the count of each PII pattern found in *text*.

    Does not redact — use redact_indian_pii() for that.
    Useful for pre-flight risk assessment before logging or storage.
    """
    if not text:
        return {name: 0 for name, _, _ in _PATTERNS}

    return {
        name: len(pattern.findall(text))
        for name, pattern, _ in _PATTERNS
    }
