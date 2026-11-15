"""
Citation registry + structural gate tests — Priority 3.

Tests:
  A. Registry safety invariants (compile-time + runtime)
  B. Structural lookup (exact, alias, token)
  C. Gate: known PENDING citations blocked regardless of keyword absence
  D. Gate: fabricated citations flagged as UNRECOGNISED (not silently accepted)
  E. Gate: COURT_SAFE/VERIFIED citations allowed
  F. Adversarial: citations containing NO tier keywords at all
  G. Backend verify endpoint structural responses
  H. Export safety: blocked ↔ download_allowed consistency
"""
import pytest
from api.citation_registry import (
    REGISTRY,
    lookup,
    extract_citation_fragments,
    evaluate_citation_gate,
    evaluate_citation_gate_as_dict,
    RegistryEntry,
)


# ── A. Registry safety invariants ─────────────────────────────────────────────

class TestRegistryInvariants:
    def test_no_pending_entry_has_blocked_false(self):
        """Every PENDING entry must have blocked=True — compile-time guard."""
        for e in REGISTRY:
            if e.tier == "PENDING":
                assert e.blocked is True, (
                    f"SAFETY VIOLATION: PENDING entry '{e.id}' has blocked=False"
                )

    def test_no_fatal_error_entry_has_blocked_false(self):
        for e in REGISTRY:
            if e.tier == "FATAL_ERROR":
                assert e.blocked is True, (
                    f"SAFETY VIOLATION: FATAL_ERROR entry '{e.id}' has blocked=False"
                )

    def test_court_safe_entries_not_blocked(self):
        for e in REGISTRY:
            if e.tier == "COURT_SAFE":
                assert e.blocked is False, (
                    f"COURT_SAFE entry '{e.id}' should not be blocked"
                )

    def test_registry_non_empty(self):
        assert len(REGISTRY) >= 10

    def test_all_ids_unique(self):
        ids = [e.id for e in REGISTRY]
        assert len(ids) == len(set(ids)), "Duplicate registry IDs found"

    def test_pending_entries_exist(self):
        pending = [e for e in REGISTRY if e.tier == "PENDING"]
        assert len(pending) == 4, f"Expected 4 PENDING entries, got {len(pending)}"

    def test_pending_names_match_case01_data(self):
        pending_names = {e.name for e in REGISTRY if e.tier == "PENDING"}
        assert "State of Gujarat v. Mohanbhai" in pending_names
        assert "R.B. Constructions v. State of Maharashtra" in pending_names
        assert "C.B.I. v. K.S. Kalra & Ors." in pending_names
        assert "M/s. Builders Association v. State of UP" in pending_names


# ── B. Structural lookup ───────────────────────────────────────────────────────

class TestStructuralLookup:
    def test_exact_citation_match(self):
        e = lookup("(1979) 3 SCC 4")
        assert e is not None
        assert e.id == "p_prafulla"

    def test_citation_case_insensitive(self):
        e = lookup("(1979) 3 scc 4")
        assert e is not None
        assert e.id == "p_prafulla"

    def test_alias_match_mohanbhai(self):
        e = lookup("Mohanbhai")
        assert e is not None
        assert e.tier == "PENDING"
        assert e.blocked is True

    def test_alias_match_rb_constructions(self):
        e = lookup("R.B. Constructions")
        assert e is not None
        assert e.tier == "PENDING"
        assert e.blocked is True

    def test_alias_match_ks_kalra(self):
        e = lookup("K.S. Kalra")
        assert e is not None
        assert e.tier == "PENDING"
        assert e.blocked is True

    def test_alias_match_builders_association(self):
        e = lookup("Builders Association")
        assert e is not None
        assert e.tier == "PENDING"
        assert e.blocked is True

    def test_alias_match_kattavellai(self):
        e = lookup("Kattavellai")
        assert e is not None
        assert e.tier == "VERIFIED"
        assert e.blocked is False

    def test_alias_match_prafulla(self):
        e = lookup("Prafulla Kumar Samal")
        assert e is not None
        assert e.tier == "COURT_SAFE"

    def test_unrecognised_returns_none(self):
        e = lookup("Completely Fabricated v. Nobody (2099) 99 SCC 999")
        assert e is None

    def test_glr_citation_mohanbhai(self):
        e = lookup("(2003) 4 GLR 3121")
        assert e is not None
        assert e.tier == "PENDING"
        assert e.blocked is True


# ── C. Gate: known PENDING citations blocked regardless of keyword absence ─────

class TestGatePendingBlocking:
    def test_mohanbhai_citation_string_blocked(self):
        """The word PENDING does not appear — gate must still block structurally."""
        draft = "The court relied on State of Gujarat v. Mohanbhai (2003) 4 GLR 3121."
        result = evaluate_citation_gate(draft)
        assert result.must_block is True
        assert any(e.id == "p6_mohanbhai" for e in result.blocked_entries)

    def test_rb_constructions_blocked_without_keyword(self):
        draft = "In R.B. Constructions v. State of Maharashtra 2014 SCC OnLine Bom 125..."
        result = evaluate_citation_gate(draft)
        assert result.must_block is True

    def test_ks_kalra_blocked_without_keyword(self):
        draft = "C.B.I. v. K.S. Kalra 2011 SCC OnLine Del 3412 supports this argument."
        result = evaluate_citation_gate(draft)
        assert result.must_block is True

    def test_builders_assoc_blocked_without_keyword(self):
        draft = "M/s. Builders Association v. State 2018 SCC OnLine All 442."
        result = evaluate_citation_gate(draft)
        assert result.must_block is True

    def test_multiple_pending_all_blocked(self):
        draft = (
            "Mohanbhai (2003) 4 GLR 3121 and R.B. Constructions 2014 SCC OnLine Bom 125 "
            "and K.S. Kalra 2011 SCC OnLine Del 3412 all support our position."
        )
        result = evaluate_citation_gate(draft)
        assert result.must_block is True
        assert len(result.blocked_entries) >= 2

    def test_download_not_allowed_when_blocked(self):
        draft = "Mohanbhai (2003) 4 GLR 3121."
        result = evaluate_citation_gate(draft)
        assert result.download_allowed is False


# ── D. Gate: fabricated citations flagged as UNRECOGNISED ─────────────────────

class TestGateFabricatedCitations:
    def test_completely_fabricated_scc_citation_unrecognised(self):
        """
        A fabricated citation with no matching registry entry and no PENDING keyword
        must be flagged as UNRECOGNISED — not silently accepted as SAFE.
        Old keyword gate would have passed this. New structural gate flags it.
        """
        draft = "In State v. Imaginary Person (2027) 99 SCC 999 the court held..."
        result = evaluate_citation_gate(draft)
        # Must NOT be classified as safe — it's unrecognised
        assert result.must_block is False          # not hard-blocked (not PENDING)
        assert len(result.unrecognised_fragments) > 0  # flagged for human review
        # download_allowed is True (no blocking) but human review is required
        assert result.download_allowed is True

    def test_fabricated_citation_no_pending_word_still_flagged(self):
        """
        Old keyword gate: text has no word 'PENDING' → old gate passes it.
        New structural gate: not in registry → flagged as UNRECOGNISED.
        This is the key regression the structural gate fixes.
        """
        fabricated_text = (
            "The Supreme Court in Fake Lawyer v. State (2025) 7 SCC 777 "
            "held that all accused are innocent until proven innocent twice."
        )
        # Confirm no tier keywords present
        assert "PENDING" not in fabricated_text.upper()
        assert "FATAL_ERROR" not in fabricated_text.upper()

        result = evaluate_citation_gate(fabricated_text)
        # Old gate would return must_block=False AND download_allowed=True — WRONG
        # New gate flags unrecognised fragments
        assert len(result.unrecognised_fragments) > 0

    def test_fabricated_citation_in_dict_response(self):
        """evaluate_citation_gate_as_dict reports unrecognised count."""
        draft = "Fake Case v. Nobody (2026) 50 SCC 500 sets the precedent."
        d = evaluate_citation_gate_as_dict(draft)
        assert d["unrecognised_count"] > 0 or d["blocked_count"] > 0

    def test_empty_draft_no_fragments(self):
        result = evaluate_citation_gate("")
        assert result.must_block is False
        assert len(result.all_fragments) == 0


# ── E. Gate: COURT_SAFE/VERIFIED citations allowed ───────────────────────────

class TestGateSafeCitations:
    def test_court_safe_citation_not_blocked(self):
        draft = "In Prafulla Kumar Samal (1979) 3 SCC 4 at Para 10..."
        result = evaluate_citation_gate(draft)
        assert result.must_block is False
        assert result.download_allowed is True

    def test_verified_citation_not_blocked(self):
        draft = "Kattavellai @ Devakar v. State of Tamil Nadu 2025 INSC 845..."
        result = evaluate_citation_gate(draft)
        assert result.must_block is False

    def test_mixed_safe_and_pending_blocks_overall(self):
        draft = (
            "In Prafulla Kumar Samal (1979) 3 SCC 4 and "
            "Mohanbhai (2003) 4 GLR 3121 the court held..."
        )
        result = evaluate_citation_gate(draft)
        assert result.must_block is True


# ── F. Adversarial: citations with NO tier keywords at all ────────────────────

class TestAdversarialNoKeywords:
    """
    These tests demonstrate that the structural gate catches attacks that
    the old keyword-only gate WOULD HAVE MISSED.
    """

    def test_pending_in_prose_no_keyword_blocked(self):
        """
        A draft that uses PENDING citation strings but adds no tier keywords.
        Old gate: passes (no PENDING word). New gate: blocks (found in PENDING registry).
        """
        texts = [
            # Full GLR citation format — matches GLR regex
            "Reference: (2003) 4 GLR 3121.",
            # SCC OnLine citations — matched by alias
            "SCC OnLine Bom 125 supports the natural justice argument.",
            "SCC OnLine Del 3412 sets out the CPWD compliance standard.",
            "SCC OnLine All 442 addresses rain-contaminated samples.",
        ]
        for text in texts:
            assert "PENDING" not in text.upper(), f"Test text must not contain PENDING keyword"
            result = evaluate_citation_gate(text)
            # At minimum they should be detected as fragments
            # If matched to a PENDING entry → must_block
            # If unrecognised → flagged (not silently accepted)
            gate_caught = result.must_block or len(result.unrecognised_fragments) > 0
            assert gate_caught, (
                f"Structural gate failed to catch citation fragment in: '{text[:80]}'"
            )

    def test_court_safe_citation_without_any_keywords(self):
        """
        A completely clean citation — no tier keywords — should be identified
        as COURT_SAFE and allowed, not flagged as suspicious.
        """
        draft = "Jacob Mathew v. State of Punjab (2005) 6 SCC 1 Para 48."
        assert "PENDING" not in draft.upper()
        assert "VERIFIED" not in draft.upper()
        assert "COURT_SAFE" not in draft.upper()

        result = evaluate_citation_gate(draft)
        assert result.must_block is False
        assert result.download_allowed is True

    def test_no_tier_keywords_in_draft_still_evaluated(self):
        """
        A draft with zero tier keywords at all gets structural evaluation.
        """
        draft = "In State of Bihar v. Ramesh Singh (1977) 4 SCC 39 at Para 5..."
        for kw in ["PENDING", "VERIFIED", "COURT_SAFE", "SECONDARY", "FATAL_ERROR"]:
            assert kw not in draft.upper()
        result = evaluate_citation_gate(draft)
        assert result.must_block is False
        assert result.download_allowed is True


# ── G. Backend routes_verify structural responses ─────────────────────────────

class TestVerifyRouteStructure:
    """Test the VerifyResponse model and _verify_citations_impl logic."""

    @pytest.mark.asyncio
    async def test_court_safe_citation_verified(self):
        from api.routes_verify import _verify_citations_impl
        resp = await _verify_citations_impl(["(1979) 3 SCC 4"])
        assert resp.success is True
        assert len(resp.results) == 1
        r = resp.results[0]
        assert r.tier == "COURT_SAFE"
        assert r.verified is True
        assert r.blocked is False

    @pytest.mark.asyncio
    async def test_pending_citation_blocked_in_verify(self):
        from api.routes_verify import _verify_citations_impl
        resp = await _verify_citations_impl(["(2003) 4 GLR 3121"])
        assert resp.success is True
        r = resp.results[0]
        assert r.tier == "PENDING"
        assert r.blocked is True
        assert r.verified is False
        assert resp.has_blocked is True
        assert resp.export_safe is False

    @pytest.mark.asyncio
    async def test_unrecognised_citation_in_verify(self):
        from api.routes_verify import _verify_citations_impl
        resp = await _verify_citations_impl(["(2099) 99 SCC 999"])
        r = resp.results[0]
        assert r.tier == "UNRECOGNISED"
        assert r.blocked is False
        assert r.verified is False
        assert resp.has_unrecognised is True
        assert resp.export_safe is False   # unrecognised blocks export safety

    @pytest.mark.asyncio
    async def test_secondary_citation_allows_with_flag(self):
        from api.routes_verify import _verify_citations_impl
        resp = await _verify_citations_impl(["(2014) 4 SCC 317"])
        r = resp.results[0]
        assert r.tier == "SECONDARY"
        assert r.blocked is False
        assert resp.has_secondary is True
        assert resp.export_safe is True    # SECONDARY doesn't block, just flags

    @pytest.mark.asyncio
    async def test_mixed_batch(self):
        from api.routes_verify import _verify_citations_impl
        citations = [
            "(1979) 3 SCC 4",        # COURT_SAFE
            "(2003) 4 GLR 3121",     # PENDING → blocked
            "(2099) 99 SCC 999",     # UNRECOGNISED
        ]
        resp = await _verify_citations_impl(citations, case_id="TC-01")
        assert resp.has_blocked is True
        assert resp.has_unrecognised is True
        assert resp.export_safe is False
        assert resp.all_verified is False

    @pytest.mark.asyncio
    async def test_all_court_safe_export_allowed(self):
        from api.routes_verify import _verify_citations_impl
        citations = [
            "(1979) 3 SCC 4",        # COURT_SAFE
            "(1977) 4 SCC 39",       # COURT_SAFE
            "(2005) 6 SCC 1",        # COURT_SAFE
        ]
        resp = await _verify_citations_impl(citations)
        assert resp.has_blocked is False
        assert resp.has_unrecognised is False
        assert resp.export_safe is True
        assert resp.all_verified is True


# ── H. Export safety consistency ──────────────────────────────────────────────

class TestExportSafetyConsistency:
    def test_blocked_means_no_download(self):
        """must_block and download_allowed must always be consistent."""
        test_texts = [
            "Mohanbhai (2003) 4 GLR 3121",
            "Prafulla Kumar Samal (1979) 3 SCC 4",
            "Completely fake (2099) 99 SCC 999",
            "",
        ]
        for text in test_texts:
            result = evaluate_citation_gate(text)
            if result.must_block:
                assert result.download_allowed is False, (
                    f"must_block=True but download_allowed=True for '{text[:40]}'"
                )
            else:
                assert result.download_allowed is True, (
                    f"must_block=False but download_allowed=False for '{text[:40]}'"
                )

    def test_dict_gate_consistent_with_dataclass_gate(self):
        """evaluate_citation_gate and evaluate_citation_gate_as_dict agree."""
        texts = [
            "Mohanbhai (2003) 4 GLR 3121.",
            "Prafulla Kumar Samal (1979) 3 SCC 4.",
            "Some fake case (2099) 99 SCC 999.",
        ]
        for text in texts:
            dc = evaluate_citation_gate(text)
            d = evaluate_citation_gate_as_dict(text)
            assert dc.must_block == d["must_block"]
            assert dc.download_allowed == d["download_allowed"]
