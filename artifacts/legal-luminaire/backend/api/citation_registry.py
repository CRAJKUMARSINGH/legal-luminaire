"""
citation_registry.py — Server-side authoritative citation registry.

This is the Python mirror of the TypeScript verification-engine.ts
PRECEDENT_ACCURACY array. It provides the structured, source-verified
ground truth for backend citation validation.

Design guarantees:
  1. PENDING citations always have blocked=True — cannot be promoted silently.
  2. SECONDARY citations are allowed in draft with a qualification note.
  3. COURT_SAFE and VERIFIED citations are safe to export.
  4. FATAL_ERROR entries are hard-blocked.
  5. The keyword-only "scan for the word PENDING" approach is replaced with
     structured extraction + registry lookup.

This registry mirrors case01-data.ts / verification-engine.ts. When those
TypeScript sources are updated, this file must be updated in parallel.

Last synced: 2026-11-15 (commit 10cc700)
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Literal

AccuracyTier = Literal["COURT_SAFE", "VERIFIED", "SECONDARY", "PENDING", "FATAL_ERROR"]


@dataclass(frozen=True)
class RegistryEntry:
    id: str
    name: str
    citation: str                 # canonical citation string
    tier: AccuracyTier
    blocked: bool                 # True → must not appear in export
    verification_note: str
    # Alternative citation fragments that may appear in AI-generated text
    aliases: tuple[str, ...] = field(default_factory=tuple)


# ── Registry ──────────────────────────────────────────────────────────────────
# Source: verification-engine.ts PRECEDENT_ACCURACY + case01-data.ts
# Any PENDING entry must have blocked=True. Enforced below by assertion.

REGISTRY: list[RegistryEntry] = [
    # ── COURT_SAFE ──────────────────────────────────────────────────────────
    RegistryEntry(
        id="p_prafulla",
        name="Union of India v. Prafulla Kumar Samal",
        citation="(1979) 3 SCC 4",
        tier="COURT_SAFE",
        blocked=False,
        verification_note="Para 10 confirmed. Well-established SC precedent.",
        aliases=("Prafulla Kumar Samal", "Prafulla Samal", "1979) 3 SCC 4"),
    ),
    RegistryEntry(
        id="p_ramesh_singh",
        name="State of Bihar v. Ramesh Singh",
        citation="(1977) 4 SCC 39",
        tier="COURT_SAFE",
        blocked=False,
        verification_note="Para 5 confirmed. Well-established SC precedent.",
        aliases=("Ramesh Singh", "1977) 4 SCC 39"),
    ),
    RegistryEntry(
        id="p_jacob_mathew",
        name="Jacob Mathew v. State of Punjab",
        citation="(2005) 6 SCC 1",
        tier="COURT_SAFE",
        blocked=False,
        verification_note="Para 48 confirmed. Negligence standard.",
        aliases=("Jacob Mathew", "2005) 6 SCC 1"),
    ),
    # ── VERIFIED ────────────────────────────────────────────────────────────
    RegistryEntry(
        id="p_kattavellai",
        name="Kattavellai @ Devakar v. State of Tamil Nadu",
        citation="2025 INSC 845",
        tier="VERIFIED",
        blocked=False,
        verification_note="Existence confirmed. Obtain certified copy before filing.",
        aliases=("Kattavellai", "2025 INSC 845", "INSC 845"),
    ),
    RegistryEntry(
        id="p11_damu",
        name="State of Maharashtra v. Damu",
        citation="(2000) 6 SCC 269",
        tier="VERIFIED",
        blocked=False,
        verification_note="Well-established SC precedent. Cite with full citation.",
        aliases=("Damu", "2000) 6 SCC 269"),
    ),
    RegistryEntry(
        id="p12_baldev",
        name="State of Punjab v. Baldev Singh",
        citation="(1999) 6 SCC 172",
        tier="VERIFIED",
        blocked=False,
        verification_note="Well-established SC precedent. Cite with full citation.",
        aliases=("Baldev Singh", "1999) 6 SCC 172"),
    ),
    RegistryEntry(
        id="p_rajasthan_hc_pil",
        name="Rajasthan HC Suo Motu PIL — School Ceiling Collapse, Piplodi, Banswara",
        citation="Suo Motu PIL ___/2025",
        tier="SECONDARY",
        blocked=False,
        verification_note=(
            "DOWNGRADED from VERIFIED. PIL docket number blank (___/2025). "
            "Holding paraphrased from proceedings reports. Obtain certified copy before filing."
        ),
        aliases=("Suo Motu PIL", "Piplodi", "Banswara school"),
    ),
    RegistryEntry(
        id="p_surendra_koli",
        name="Surendra Koli v. State of Uttar Pradesh",
        citation="Curative Petition (Crl.) SC 11 November 2025",
        tier="SECONDARY",
        blocked=False,
        verification_note=(
            "DOWNGRADED from VERIFIED. Holding sourced from news media only. "
            "Obtain certified curative petition order from SC Registry before filing."
        ),
        aliases=("Surendra Koli", "Nithari"),
    ),
    RegistryEntry(
        id="p_rsmml",
        name="RSMML v. Contractor — Force Majeure",
        citation="Rajasthan High Court Division Bench 30 March 2026",
        tier="SECONDARY",
        blocked=False,
        verification_note=(
            "DOWNGRADED from VERIFIED. Holding sourced from newspaper only. "
            "Obtain certified HC order before filing."
        ),
        aliases=("RSMML", "Rajasthan Minerals"),
    ),
    # ── SECONDARY ───────────────────────────────────────────────────────────
    RegistryEntry(
        id="p_sushil_sharma",
        name="Sushil Sharma v. State (NCT of Delhi)",
        citation="(2014) 4 SCC 317",
        tier="SECONDARY",
        blocked=False,
        verification_note="Para language unconfirmed. Do not quote verbatim without SCC copy.",
        aliases=("Sushil Sharma", "2014) 4 SCC 317"),
    ),
    RegistryEntry(
        id="p14_surendra_koli",
        name="Surendra Koli v. State of Uttar Pradesh (Curative)",
        citation="Curative Petition SC 2025",
        tier="SECONDARY",
        blocked=False,
        verification_note="Media sourced. Obtain certified copy before filing.",
        aliases=(),
    ),
    RegistryEntry(
        id="p15_tomaso_bruno",
        name="Tomaso Bruno v. State of Uttar Pradesh",
        citation="(2015) 7 SCC 178",
        tier="SECONDARY",
        blocked=False,
        verification_note="Para language unconfirmed from SCC Online.",
        aliases=("Tomaso Bruno", "2015) 7 SCC 178"),
    ),
    RegistryEntry(
        id="p19_signi",
        name="C.J. Christopher Signi v. State of Tamil Nadu",
        citation="2025 SCC OnLine Mad 3214",
        tier="SECONDARY",
        blocked=False,
        verification_note="SCC Times blog summary only. Obtain full judgment before citing.",
        aliases=("Christopher Signi", "2025 SCC OnLine Mad 3214"),
    ),
    # ── PENDING — blocked=True, must not appear in any export ───────────────
    RegistryEntry(
        id="p6_mohanbhai",
        name="State of Gujarat v. Mohanbhai",
        citation="(2003) 4 GLR 3121",
        tier="PENDING",
        blocked=True,
        verification_note=(
            "BLOCKED. Citation authenticity unconfirmed. GLR copy not obtained. "
            "Do not use as primary authority."
        ),
        aliases=("Mohanbhai", "4 GLR 3121", "Gujarat v. Mohanbhai"),
    ),
    RegistryEntry(
        id="p7_rb_constructions",
        name="R.B. Constructions v. State of Maharashtra",
        citation="2014 SCC OnLine Bom 125",
        tier="PENDING",
        blocked=True,
        verification_note=(
            "BLOCKED. SCC OnLine Bom 125 not independently verified. "
            "Do not use as primary authority."
        ),
        aliases=("R.B. Constructions", "RB Constructions", "SCC OnLine Bom 125"),
    ),
    RegistryEntry(
        id="p8_ks_kalra",
        name="C.B.I. v. K.S. Kalra & Ors.",
        citation="2011 SCC OnLine Del 3412",
        tier="PENDING",
        blocked=True,
        verification_note=(
            "BLOCKED. SCC OnLine Del 3412 not independently verified. "
            "Do not use as primary authority."
        ),
        aliases=("K.S. Kalra", "KS Kalra", "SCC OnLine Del 3412"),
    ),
    RegistryEntry(
        id="p9_builders_assoc",
        name="M/s. Builders Association v. State of UP",
        citation="2018 SCC OnLine All 442",
        tier="PENDING",
        blocked=True,
        verification_note=(
            "BLOCKED. SCC OnLine All 442 not independently verified. "
            "Do not use as primary authority."
        ),
        aliases=("Builders Association", "SCC OnLine All 442"),
    ),
]

# ── Compile-time safety assertion: all PENDING must be blocked ─────────────────
for _e in REGISTRY:
    if _e.tier == "PENDING" and not _e.blocked:
        raise RuntimeError(
            f"REGISTRY SAFETY VIOLATION: PENDING entry '{_e.id}' has blocked=False. "
            "Every PENDING citation must have blocked=True."
        )

# ── Index structures for fast lookup ──────────────────────────────────────────
_BY_ID: dict[str, RegistryEntry] = {e.id: e for e in REGISTRY}
_BY_CITATION: dict[str, RegistryEntry] = {}
_ALIAS_MAP: list[tuple[str, RegistryEntry]] = []

for _entry in REGISTRY:
    _BY_CITATION[_entry.citation.lower()] = _entry
    for _alias in (_entry.name.lower(), *[a.lower() for a in _entry.aliases]):
        if _alias:
            _ALIAS_MAP.append((_alias, _entry))

# Sort alias map longest-first so more specific aliases match first
_ALIAS_MAP.sort(key=lambda x: len(x[0]), reverse=True)


# ── Extraction helpers ────────────────────────────────────────────────────────

# Patterns that identify citation strings in generated text
_SCC_PATTERN = re.compile(r"\(\d{4}\)\s*\d+\s*SCC\s*\d+", re.IGNORECASE)
_INSC_PATTERN = re.compile(r"\d{4}\s*INSC\s*\d+", re.IGNORECASE)
_SCC_ONLINE_PATTERN = re.compile(r"\d{4}\s*SCC\s*OnLine\s*\w+\s*\d+", re.IGNORECASE)
_GLR_PATTERN = re.compile(r"\(\d{4}\)\s*\d+\s*GLR\s*\d+", re.IGNORECASE)
_CURATIVE_PATTERN = re.compile(r"Curative\s*Petition", re.IGNORECASE)

_ALL_PATTERNS = [
    _SCC_PATTERN, _INSC_PATTERN, _SCC_ONLINE_PATTERN, _GLR_PATTERN
]


def extract_citation_fragments(text: str) -> list[str]:
    """
    Extract citation-like strings from free text using both regex patterns
    and known alias matching.
    Returns deduplicated list of raw citation strings found.
    """
    found: set[str] = set()
    # Regex-based structured citation patterns
    for pattern in _ALL_PATTERNS:
        for m in pattern.finditer(text):
            found.add(m.group(0).strip())
    # Alias-based matching: check if any known alias appears verbatim in text
    normed_text = text.lower()
    for alias, entry in _ALIAS_MAP:
        if alias in normed_text:
            # Use the entry's canonical citation as the fragment key
            found.add(entry.citation)
    return list(found)


def lookup(raw: str) -> RegistryEntry | None:
    """
    Look up a raw citation string or case name fragment in the registry.
    Returns the best-matching RegistryEntry or None.

    Strategy (most-specific first):
      1. Exact citation match (normalised)
      2. Alias substring match (longest alias wins)
      3. Case-name partial match (3+ tokens)
    """
    normed = raw.lower().strip()

    # 1. Exact citation match
    if normed in _BY_CITATION:
        return _BY_CITATION[normed]

    # 2. Alias/name substring
    for alias, entry in _ALIAS_MAP:
        if alias in normed or normed in alias:
            return entry

    # 3. Token overlap (require ≥3 matching tokens of length ≥4)
    tokens = set(t for t in re.split(r"[\s,.\(\)/\|]+", normed) if len(t) >= 4)
    if len(tokens) >= 2:
        best: RegistryEntry | None = None
        best_score = 0
        for entry in REGISTRY:
            haystack = (entry.name + " " + entry.citation).lower()
            score = sum(1 for t in tokens if t in haystack)
            if score > best_score and score >= 2:
                best_score = score
                best = entry
        if best:
            return best

    return None


# ── Gate function ─────────────────────────────────────────────────────────────

@dataclass
class GateResult:
    must_block: bool
    needs_ack: bool          # SECONDARY citations present, need acknowledgment
    download_allowed: bool
    blocked_entries: list[RegistryEntry]
    secondary_entries: list[RegistryEntry]
    unrecognised_fragments: list[str]
    all_fragments: list[str]
    details: str


def evaluate_citation_gate(text: str) -> GateResult:
    """
    Structural citation gate — replaces keyword-only word scan.

    Algorithm:
      1. Extract citation-like strings from the text using regex patterns.
      2. For each extracted string, look up the registry.
      3. If a PENDING or FATAL_ERROR entry is found → must_block = True.
      4. If a SECONDARY entry is found → needs_ack = True.
      5. Unrecognised citations are flagged but do not hard-block.
         (They require human review; the advocate must decide.)

    This correctly handles fabricated citations that contain no PENDING keyword —
    they will be unrecognised and flagged, but not silently accepted.
    """
    if not text or not text.strip():
        return GateResult(
            must_block=False,
            needs_ack=False,
            download_allowed=True,
            blocked_entries=[],
            secondary_entries=[],
            unrecognised_fragments=[],
            all_fragments=[],
            details="No citation fragments detected.",
        )

    fragments = extract_citation_fragments(text)

    blocked: list[RegistryEntry] = []
    secondary: list[RegistryEntry] = []
    unrecognised: list[str] = []

    seen_ids: set[str] = set()

    for frag in fragments:
        entry = lookup(frag)
        if entry is None:
            unrecognised.append(frag)
            continue
        if entry.id in seen_ids:
            continue
        seen_ids.add(entry.id)

        if entry.blocked or entry.tier in ("PENDING", "FATAL_ERROR"):
            blocked.append(entry)
        elif entry.tier == "SECONDARY":
            secondary.append(entry)

    must_block = len(blocked) > 0
    needs_ack = len(secondary) > 0 and not must_block

    if must_block:
        names = ", ".join(e.name for e in blocked)
        details = (
            f"BLOCKED: {len(blocked)} citation(s) must not appear in export — {names}. "
            "Obtain certified copies before filing."
        )
    elif needs_ack:
        names = ", ".join(e.name for e in secondary)
        details = (
            f"SECONDARY: {len(secondary)} citation(s) require qualification — {names}."
        )
    elif unrecognised:
        details = (
            f"{len(unrecognised)} unrecognised citation fragment(s) require human review "
            f"before filing: {'; '.join(unrecognised[:3])}..."
        )
    else:
        details = f"{len(fragments)} citation fragment(s) scanned — all clear."

    return GateResult(
        must_block=must_block,
        needs_ack=needs_ack,
        download_allowed=not must_block,
        blocked_entries=blocked,
        secondary_entries=secondary,
        unrecognised_fragments=unrecognised,
        all_fragments=fragments,
        details=details,
    )


def evaluate_citation_gate_as_dict(text: str) -> dict:
    """
    Wrapper returning a dict for backward compatibility with existing routes.py callers.
    Preserves the same keys as the old keyword-only gate, plus adds structured data.
    """
    result = evaluate_citation_gate(text)
    return {
        "must_block": result.must_block,
        "needs_ack": result.needs_ack,
        "download_allowed": result.download_allowed,
        "blocked_count": len(result.blocked_entries),
        "secondary_count": len(result.secondary_entries),
        "unrecognised_count": len(result.unrecognised_fragments),
        "blocked_entries": [
            {"id": e.id, "name": e.name, "tier": e.tier, "note": e.verification_note}
            for e in result.blocked_entries
        ],
        "secondary_entries": [
            {"id": e.id, "name": e.name, "tier": e.tier, "note": e.verification_note}
            for e in result.secondary_entries
        ],
        "unrecognised_fragments": result.unrecognised_fragments,
        "details": result.details,
        # Backward-compat keys from old keyword scan
        "statuses": {
            "COURT_SAFE": sum(1 for e in REGISTRY if e.tier == "COURT_SAFE"),
            "VERIFIED": sum(1 for e in REGISTRY if e.tier == "VERIFIED"),
            "SECONDARY": len(result.secondary_entries),
            "PENDING": len(result.blocked_entries),
            "FATAL_ERROR": 0,
        },
    }
