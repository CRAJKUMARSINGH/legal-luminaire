"""
test_drafting_engine.py — BLOCKED (documented skip stub; RECREATED placeholder).

History
-------
The original ``test_drafting_engine.py`` source was never committed (only its
``.cpython-314.pyc`` survived). Its bytecode targeted the ``backend/drafting/``
package — an "advocate-grade drafting generation layer" exposing, at minimum:
``architecture``, ``blocks``, ``catalog``, ``conflicts``, ``engine``, ``grounds``,
``placeholders``, ``prompts``, with a ~30-template catalog and
``engine.resolve_legacy_draft_type()`` (``BAIL_439 -> regular_bail``,
``DISCHARGE -> discharge``, ``BRIEF -> defence_brief``).

That package was **never committed to Git** and its ``.py`` sources cannot be
recovered. Python 3.14 bytecode cannot be reliably decompiled, and reconstructing
legal drafting logic by inference would risk fabricating legal content — explicitly
prohibited by the reconciliation directive ("Do not infer correctness from bytecode
alone").

Classification
--------------
**UNCERTAIN — required and missing (BLOCKER P2-01).**

The wired drafting path is ``api/routes_drafting.py`` (Gemini-prompt based; request
``draft_type`` in ``BRIEF | DISCHARGE | BAIL_439``), which supersedes the orphan
package at runtime.

This module is retained (not deleted) so the gap remains visible in CI. Every test
is skipped until the drafting-layer epic is either re-implemented deliberately from
trustworthy requirements or formally dropped — a product decision, not a
reconciliation action.
"""
from __future__ import annotations

import pytest

pytestmark = pytest.mark.skip(
    reason=(
        "BLOCKER P2-01: backend/drafting/ package was never committed; source "
        "unrecoverable and bytecode cannot be safely decompiled. Awaiting product "
        "decision (re-implement from requirements vs. formally drop the epic)."
    )
)


def test_drafting_catalog_exposes_templates():
    from drafting import catalog  # noqa: F401  (module absent today)

    assert catalog.TEMPLATES


def test_resolve_legacy_draft_type_mapping():
    from drafting.engine import resolve_legacy_draft_type

    assert resolve_legacy_draft_type("BAIL_439") == "regular_bail"
    assert resolve_legacy_draft_type("DISCHARGE") == "discharge"
    assert resolve_legacy_draft_type("BRIEF") == "defence_brief"


def test_skeleton_marks_not_filing_ready():
    from drafting import engine

    skeleton = engine.build_skeleton("regular_bail")
    assert "NOT filing-ready" in skeleton
    assert "SOURCE CONTROL" in skeleton
    assert "LIST OF ANNEXURES" in skeleton
