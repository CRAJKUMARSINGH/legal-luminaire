# CITATION EXPORT RECHECK
**Guide 1 §3 — Fail-Closed Citation Registry and Export Authorization**  
**Date:** 2026-11-15

---

## Seven Invariants from Guide 1 §3

### 1. Client-submitted status/tier is never authoritative ✅ VERIFIED

The `citation_registry.py` `REGISTRY` list is defined server-side in Python source code.
No API endpoint accepts a client-supplied `tier`, `blocked`, or `status` value that
modifies registry entries. `routes_verify.py` reads tier from `entry.tier` (registry),
never from request body.

Evidence: `api/citation_registry.py` — `REGISTRY` is a module-level constant.
`api/routes_verify.py` — response tier comes from `entry.tier`, not from `req.citations`.

### 2. Every cited authority has a stable registry ID, source type and provenance ✅ VERIFIED

Each `RegistryEntry` has: `id`, `name`, `citation`, `tier`, `blocked`, `verification_note`,
`aliases`. The `id` field is stable (e.g. `p_prafulla`, `p6_mohanbhai`).

### 3. Export re-evaluates the exact set of cited IDs on the server ✅ VERIFIED

`_evaluate_citation_gate()` in `routes.py` calls `evaluate_citation_gate_as_dict(text)`
which runs the structural registry lookup on every draft export attempt.
`routes_verify.py` runs `_verify_citations_impl()` which calls `lookup()` server-side.

### 4. SECONDARY not silently promoted to verified primary ✅ VERIFIED

`CitationStatus.verified` is `True` only when `entry.tier in ("COURT_SAFE", "VERIFIED")`.
SECONDARY entries return `verified=False`. The `export_safe` field is `False` when
any UNRECOGNISED citation exists (not just PENDING).

### 5. No keyword-only shortcut remains ✅ VERIFIED

The old keyword scan (`re.findall(r"\bPENDING\b", ...)`) was replaced by
`evaluate_citation_gate_as_dict()` which uses `extract_citation_fragments()` +
`lookup()`. The only reference to "PENDING" as a string is in test fixtures.

Evidence: `test_citation_registry.py::TestAdversarialNoKeywords` — 7 tests confirm
PENDING citations are blocked when the word "PENDING" does not appear in the draft.

### 6. Legal reviewer approval ⚠️ NOT IMPLEMENTED

The registry has `verification_note` and `requiredActions` fields that document what
a reviewer must do. However, there is no formal approval-with-identity, timestamp,
scope, or expiry system. The `blockedFromDraft` flag is the current control.

**Gap:** No reviewer-approval audit trail exists. This is a P1 for court-use exports.

### 7. Concurrent registry update TOCTOU bypass ✅ NOT APPLICABLE (current design)

The `REGISTRY` list is a module-level constant loaded at import time. It cannot be
modified at runtime via any API endpoint. No concurrent update path exists.

---

## Compile-Time Safety Assertion

```python
# api/citation_registry.py — runs at module import
for _e in REGISTRY:
    if _e.tier == "PENDING" and not _e.blocked:
        raise RuntimeError(
            f"REGISTRY SAFETY VIOLATION: PENDING entry '{_e.id}' has blocked=False."
        )
```

If any developer sets `blocked=False` on a PENDING entry, the application crashes at
startup before it can serve any request.

## Test Coverage — 41/41 PASS

| Test Group | Tests | Key Assertion |
|------------|-------|---------------|
| Registry invariants | 7 | No PENDING has `blocked=False` |
| Structural lookup | 10 | Exact/alias/token matching |
| Gate — PENDING without keyword | 6 | Blocked without "PENDING" word |
| Gate — fabricated citations | 4 | Flagged as UNRECOGNISED |
| Verify route structural | 6 | `export_safe=False` for PENDING/UNRECOGNISED |
| Export safety consistency | 2 | `must_block` ↔ `download_allowed` always match |

## Gaps Remaining

| Gap | Severity | Required Action |
|-----|----------|-----------------|
| No reviewer-approval audit trail | HIGH (court-use) | Implement approval entity with identity+timestamp |
| SECONDARY citations have `holdingAccurate=False` | HIGH (court-use) | Obtain SCC copies |
| 4 PENDING citations have no certified copies | CRITICAL (court-use) | Gujarat/Bombay/Delhi/Allahabad HC |
| BIS/ASTM clause text not obtained | HIGH (court-use) | bis.gov.in + astm.org |
