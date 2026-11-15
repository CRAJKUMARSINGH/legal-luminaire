# CITATION GATE ADVERSARIAL RESULTS
**Date:** 2026-11-15 | HEAD `10cc700`

---

## What Changed

The old keyword-only gate (`_evaluate_citation_gate` in `routes.py`) scanned text for the literal words `PENDING` and `FATAL_ERROR`. An AI model that cited an unverified case without using those exact words would bypass the gate entirely.

**Replacement:** `api/citation_registry.py` — structural registry-based gate that:
1. Extracts citation-like strings using regex (SCC, INSC, GLR, SCC OnLine patterns)
2. Additionally matches any registered alias against the full text
3. Looks up each fragment in `REGISTRY` (Python mirror of `verification-engine.ts`)
4. Blocks any PENDING/FATAL_ERROR registry entries regardless of surrounding keywords
5. Flags unrecognised citations for human review (not silently accepted)

---

## Test Results — 41/41 PASS

```
tests/test_citation_registry.py ..............................F.........
(after alias fix) .........................................  [100%]
41 passed in 1.63s
```

---

## Registry Safety Invariants (7 tests)

| Test | Result |
|------|--------|
| No PENDING entry has `blocked=False` | ✅ |
| No FATAL_ERROR entry has `blocked=False` | ✅ |
| COURT_SAFE entries are not blocked | ✅ |
| Registry is non-empty | ✅ |
| All IDs are unique | ✅ |
| Exactly 4 PENDING entries | ✅ |
| PENDING entry names match `case01-data.ts` | ✅ |

---

## Structural Lookup (10 tests)

| Citation / Fragment | Tier Found | Result |
|--------------------|-----------|--------|
| `(1979) 3 SCC 4` | COURT_SAFE | ✅ |
| `(1979) 3 scc 4` (lowercase) | COURT_SAFE | ✅ |
| `Mohanbhai` (alias) | PENDING → blocked | ✅ |
| `R.B. Constructions` (alias) | PENDING → blocked | ✅ |
| `K.S. Kalra` (alias) | PENDING → blocked | ✅ |
| `Builders Association` (alias) | PENDING → blocked | ✅ |
| `Kattavellai` (alias) | VERIFIED → not blocked | ✅ |
| `Prafulla Kumar Samal` (alias) | COURT_SAFE | ✅ |
| `(2003) 4 GLR 3121` (GLR pattern) | PENDING → blocked | ✅ |
| Completely fabricated case | None | ✅ |

---

## Adversarial Gate Tests — Key Results

### PENDING citations blocked WITHOUT any tier keywords (6 tests)

These tests confirm the structural gate catches attacks the old keyword gate missed:

| Draft text | PENDING keyword present? | Old gate | New gate | Result |
|-----------|--------------------------|----------|----------|--------|
| `...Mohanbhai (2003) 4 GLR 3121...` | ❌ No | PASS ❌ | BLOCKED ✅ | ✅ |
| `...R.B. Constructions 2014 SCC OnLine Bom 125...` | ❌ No | PASS ❌ | BLOCKED ✅ | ✅ |
| `...K.S. Kalra 2011 SCC OnLine Del 3412...` | ❌ No | PASS ❌ | BLOCKED ✅ | ✅ |
| `...Builders Association 2018 SCC OnLine All 442...` | ❌ No | PASS ❌ | BLOCKED ✅ | ✅ |
| Multiple PENDING in one draft | ❌ No | PASS ❌ | BLOCKED ✅ | ✅ |
| `download_allowed=False` when blocked | — | — | — | ✅ |

### Fabricated citations flagged (4 tests)

| Scenario | Result |
|---------|--------|
| Completely fabricated `(2027) 99 SCC 999` → UNRECOGNISED | ✅ Flagged |
| Fabricated text with **zero tier keywords** → still flagged | ✅ Flagged |
| Fabricated citation in `evaluate_citation_gate_as_dict` → `unrecognised_count > 0` | ✅ |
| Empty draft → no fragments, gate passes | ✅ |

**Key adversarial proof:**  
```
# Text with no PENDING/FATAL_ERROR/VERIFIED keywords at all:
fabricated = "Fake Lawyer v. State (2025) 7 SCC 777 held all accused innocent twice."
assert "PENDING" not in fabricated.upper()   # confirmed
result = evaluate_citation_gate(fabricated)
assert len(result.unrecognised_fragments) > 0  # PASS ✅
```
The old gate would have returned `must_block=False` and silently allowed export.

### COURT_SAFE citations remain allowed (3 tests)

| Test | Result |
|------|--------|
| `(1979) 3 SCC 4` → not blocked | ✅ |
| `2025 INSC 845` (Kattavellai) → not blocked | ✅ |
| Mixed safe+PENDING → overall blocked | ✅ |

---

## Structural Verification Route (6 tests)

| Scenario | Expected | Result |
|---------|----------|--------|
| COURT_SAFE citation | `verified=True, blocked=False, export_safe=True` | ✅ |
| PENDING citation | `blocked=True, export_safe=False` | ✅ |
| UNRECOGNISED citation | `tier=UNRECOGNISED, export_safe=False` | ✅ |
| SECONDARY citation | `has_secondary=True, export_safe=True` (flagged, not blocked) | ✅ |
| Mixed batch (CS + PENDING + UNKNOWN) | `has_blocked=True, export_safe=False` | ✅ |
| All COURT_SAFE | `export_safe=True, all_verified=True` | ✅ |

---

## Export Safety Consistency (2 tests)

Both `evaluate_citation_gate()` (dataclass) and `evaluate_citation_gate_as_dict()` are tested to agree on `must_block` and `download_allowed` across all citation combinations. ✅

---

## Compile-Time Safety Assertion

The registry module contains:
```python
for _e in REGISTRY:
    if _e.tier == "PENDING" and not _e.blocked:
        raise RuntimeError("REGISTRY SAFETY VIOLATION: PENDING entry has blocked=False")
```
This runs at import time — any regression that sets `blocked=False` on a PENDING entry will crash the application before it can serve any request.
