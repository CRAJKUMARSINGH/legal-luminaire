"""Pleading Chain Engine tests — run with: cd backend && pytest."""
import json
from pathlib import Path

import pytest

from services import variant_engine as ve

BASE_DRAFT = """IN THE COURT OF DISTRICT JUDGE, GURUGRAM
Civil Suit No. 123 of 2026

ROOPAM KUMAR
    Versus
PITAMBARA INFRASTRUCTURE PVT. LTD.

APPLICATION UNDER ORDER 39 RULES 1 & 2 CPC
"""


def test_registry_has_50_subjects_and_variants():
    reg = json.loads(Path(ve.DATA_FILE).read_text(encoding="utf-8"))
    assert len(reg["subjects"]) == 50
    for sid, fam in reg["subjects"].items():
        ids = [v["id"] for v in fam["variants"]]
        assert "rejoinder" in ids and "supplementary_affidavit" in ids
        assert "contempt_application" in ids and "execution_application" in ids
        for v in fam["variants"]:
            assert v["glossary"] and v["citations"] and v["label"]["hi"]


def test_extract_matter_context():
    ctx = ve.extract_matter_context(BASE_DRAFT, "demo-1", "specific_performance")
    assert "GURUGRAM" in ctx.court.upper()
    assert "123 of 2026" in ctx.case_no
    assert any("ROOPAM" in p.upper() for p in ctx.petitioners)
    assert any("PITAMBARA" in r.upper() for r in ctx.respondents)


def test_archetype_prompt_has_glossary_and_slot_rule():
    fam = ve.subject_families("specific_performance")
    arch = next(a for a in fam["variants"] if a["id"] == "rejoinder")
    ctx = ve.extract_matter_context(BASE_DRAFT, "demo-1", "specific_performance")
    p = ve.build_archetype_prompt(ctx, arch)
    for term in arch["glossary"]:
        assert term in p
    assert "[[CITATION:n]]" in p
    assert "NEVER fabricate" in p
    assert "ROOPAM" in p  # matter context injected verbatim


def test_unknown_subject_raises():
    with pytest.raises(KeyError):
        ve.subject_families("not_a_subject")
