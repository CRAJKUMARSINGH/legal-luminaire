"""
test_variant_engine.py — Pleading Chain Engine (services.variant_engine)
========================================================================

Recreated during the unwired-files reconciliation (Phase 2).

Provenance
----------
Only a bytecode cache (``test_variant_engine.cpython-314*.pyc``) survived in
``backend/tests/__pycache__/`` while the ``.py`` source was never committed.
That bytecode was archived under ``archive/unwired-recovery/``.  This file is
NOT a decompilation: it is authored against the current *wired* implementation
``backend/services/variant_engine.py`` so the deterministic layer is covered by
a regression test.

Coverage
--------
  D01 — extract_matter_context carries case_id / subject
  D02 — "IN THE COURT OF ..." caption captured into MatterContext.court
  D03 — "CASE NO." line captured into MatterContext.case_no
  D04 — respondent block after VERSUS captured
  D05 — build_archetype_prompt preserves the matter context verbatim
  D06 — build_archetype_prompt forbids citation fabrication + emits [[CITATION:n]]
  D07 — build_archetype_prompt embeds the archetype glossary + required citations
  D08 — remaining_citation_slots counts unfilled slots
  D09 — remaining_citation_slots never goes negative when over-filled
  D10 — remaining_citation_slots is 0 when every slot is filled

Registry-dependent APIs (``load_registry`` / ``subject_families`` /
``list_subjects``) resolve ``DATA_FILE = backend/data/subject_variants.json``,
which is absent from the repository (BLOCKER P2-02).  Those cases are skipped
rather than dropped so the gap stays visible.
"""
from __future__ import annotations

import pytest

from services import variant_engine as ve

BASE_DRAFT = """IN THE COURT OF THE JUDICIAL MAGISTRATE, UDAIPUR
CRIMINAL CASE NO. 123 OF 2026

RAMESH KUMAR
AND
SURESH KUMAR
VERSUS
STATE OF RAJASTHAN
"""

ARCHETYPE = {
    "id": "regular_bail",
    "kind": "bail",
    "stage": "pleading",
    "label": {"en": "Regular Bail Application", "hi": "नियमित जमानत आवेदन"},
    "glossary": ["grounds for bail", "flight risk"],
    "citations": ["S. 439 CrPC", "S. 483 BNSS"],
}


def _ctx():
    return ve.extract_matter_context(BASE_DRAFT, "TC-01", "criminal")


def test_d01_context_carries_identity():
    ctx = _ctx()
    assert ctx.case_id == "TC-01"
    assert ctx.subject == "criminal"


def test_d02_court_captured():
    assert _ctx().court.upper().startswith("COURT OF")


def test_d03_case_number_captured():
    assert "123 OF 2026" in _ctx().case_no.upper()


def test_d04_respondent_captured():
    assert any("STATE OF RAJASTHAN" in r for r in _ctx().respondents)


def test_d05_prompt_preserves_matter_context():
    ctx = _ctx()
    prompt = ve.build_archetype_prompt(ctx, ARCHETYPE)
    assert ctx.court in prompt
    assert ctx.case_no in prompt
    assert "STATE OF RAJASTHAN" in prompt


def test_d06_prompt_forbids_fabrication_and_emits_slots():
    prompt = ve.build_archetype_prompt(_ctx(), ARCHETYPE)
    assert "NEVER fabricate citations" in prompt
    assert "[[CITATION:n]]" in prompt


def test_d07_prompt_embeds_glossary_and_requirements():
    prompt = ve.build_archetype_prompt(_ctx(), ARCHETYPE)
    assert "grounds for bail" in prompt
    assert "S. 439 CrPC" in prompt
    assert "Regular Bail Application" in prompt


def test_d08_remaining_slots_counts_unfilled():
    assert ve.remaining_citation_slots("text [[CITATION:1]] only", ARCHETYPE) == 1


def test_d09_remaining_slots_never_negative():
    draft = "[[CITATION:1]] [[CITATION:2]] [[CITATION:3]] [[CITATION:4]]"
    assert ve.remaining_citation_slots(draft, ARCHETYPE) == 0


def test_d10_remaining_slots_zero_when_all_filled():
    assert ve.remaining_citation_slots("[[CITATION:1]] [[CITATION:2]]", ARCHETYPE) == 0


# ── Registry-dependent coverage (blocked: DATA_FILE missing) ──────────────────

requires_registry = pytest.mark.skipif(
    not ve.DATA_FILE.is_file(),
    reason="backend/data/subject_variants.json missing (BLOCKER P2-02)",
)


@requires_registry
def test_registry_lists_subjects():
    assert ve.list_subjects()


@requires_registry
def test_unknown_subject_raises_keyerror():
    with pytest.raises(KeyError):
        ve.subject_families("__definitely_not_a_subject__")
