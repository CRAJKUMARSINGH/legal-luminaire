# CITATION EXPORT REGRESSION
**Master Enrichment Guide Phase B2 — verified 2026-11-16**

## Test evidence (fresh run, no exclusions)

`python -m pytest tests -q` → **170 passed** including:

- `test_citation_registry.py` — 41 tests ✅
- `test_verification_syntax.py` — 1 test ✅
- `test_security_remediation.py` — 18 tests ✅

## Invariants re-confirmed

| Invariant | Status | Basis |
|-----------|--------|-------|
| Client-submitted status/tier never authoritative | ✅ | Registry is a server-side module constant; export reads `entry.tier` only (`final-deliverables/CITATION_EXPORT_RECHECK.md` §1) |
| Stable registry IDs + provenance | ✅ | `RegistryEntry.id/name/citation/tier/blocked/verification_note/aliases` |
| Server-side re-evaluation on every export | ✅ | `_evaluate_citation_gate()` → `evaluate_citation_gate_as_dict()` on each draft export |
| SECONDARY not promoted to verified | ✅ | Recheck doc §4 |
| Restricted citations (p13/p14/p16) classifications | ✅ UNCHANGED | `git diff f92858d HEAD -- backend/` = 0 lines; design merge touched no backend files |
| Adversarial cases (unknown IDs, fabricated authorities, tampered requests) | ✅ | `final-deliverables/CITATION_GATE_ADVERSARIAL_RESULTS.md` |

## Not verified

- Live end-to-end export against a running backend + real LLM (requires deployment + API keys)
- Manual advocate review of restricted-source classifications (see `final-deliverables/LEGAL_SOURCE_REVIEW.md` — 11 items outstanding)

**Verdict:** No regression. Citation controls intact at merge SHA. Court-use export remains BLOCKED pending authoritative source copies.
