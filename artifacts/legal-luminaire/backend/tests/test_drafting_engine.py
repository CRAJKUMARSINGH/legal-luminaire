"""Unit tests for the advocate-grade drafting generation layer."""
from __future__ import annotations

from drafting.catalog import TEMPLATES, resolve_legacy_draft_type
from drafting.conflicts import detect_conflicts
from drafting.engine import DraftGenerationSpec, build_generation_bundle, render_skeleton
from drafting.placeholders import info_required


def test_catalog_has_thirty_templates():
    assert len(TEMPLATES) == 30
    assert {t.category for t in TEMPLATES} == {"criminal", "civil"}
    assert sum(1 for t in TEMPLATES if t.starter) >= 5


def test_legacy_draft_types_map():
    assert resolve_legacy_draft_type("BAIL_439").id == "regular_bail"
    assert resolve_legacy_draft_type("DISCHARGE").id == "discharge"
    assert resolve_legacy_draft_type("BRIEF").id == "defence_brief"


def test_skeleton_keeps_placeholders_and_source_control():
    spec = DraftGenerationSpec(draft_type="DISCHARGE", language="en")
    bundle = build_generation_bundle({"title": "State v. Test"}, spec)
    text = bundle.skeleton
    assert "[Information required:" in text
    assert "SOURCE CONTROL" in text
    assert "VERIFICATION" in text
    assert "LIST OF ANNEXURES" in text
    assert "not filing-ready" in text.lower() or "NOT filing-ready" in text or "not filing-ready" in text
    assert bundle.filing_ready is False
    assert "Legal grounds" in " ".join(bundle.architecture) or "आधार" in " ".join(bundle.architecture)


def test_unknown_facts_are_not_invented_as_parties():
    spec = DraftGenerationSpec(template_id="regular_bail", language="en", document_stage="initial")
    bundle = build_generation_bundle({}, spec)
    assert "John Doe" not in bundle.skeleton
    assert info_required("applicant / plaintiff / accused name") in bundle.skeleton


def test_reply_stage_uses_para_wise_architecture():
    spec = DraftGenerationSpec(template_id="written_statement", document_stage="reply", language="en")
    bundle = build_generation_bundle({"court": "District Court, Udaipur"}, spec)
    joined = " ".join(bundle.architecture).lower()
    assert "para-wise" in joined
    assert "STAGE — REPLY" in bundle.skeleton


def test_conflicts_are_reported_not_resolved():
    warnings = detect_conflicts(
        [
            {"name": "FIR scan", "text": "FIR No. 12/2024 dated 01-01-2024 amount Rs. 50,000", "included": True},
            {"name": "typed", "text": "FIR No. 18/2024 dated 05-02-2024 amount Rs. 75,000", "included": True},
        ]
    )
    assert any("FIR" in w or "dates" in w or "amounts" in w for w in warnings)
    spec = DraftGenerationSpec(
        template_id="reply_legal_notice",
        language="en",
        pasted_text="Notice dated 01-01-2024 for Rs. 50,000",
        typed_facts="Notice dated 05-02-2024 for Rs. 75,000",
    )
    bundle = build_generation_bundle({}, spec)
    assert bundle.conflicts
    assert "Confirm the correct value" in bundle.skeleton


def test_bilingual_pairs_headings():
    spec = DraftGenerationSpec(template_id="discharge", language="bilingual")
    bundle = build_generation_bundle({"court": "Sessions Court"}, spec)
    assert " / " in bundle.skeleton
    assert "सत्यापन" in bundle.skeleton


def test_render_skeleton_includes_family_grounds():
    tmpl = resolve_legacy_draft_type("BAIL_439")
    text = render_skeleton(tmpl, "initial", "en", {"court_name": "Sessions Court, Udaipur"})
    assert "Custody and status of investigation" in text
    assert tmpl.provision_hint in text
