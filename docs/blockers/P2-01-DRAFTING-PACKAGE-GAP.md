# P2-01 — Drafting Package Gap
**Priority:** P2  
**Status:** CLOSED — superseded under [ADR-010](../adr/ADR-010-gemini-direct-drafting.md)

**Opened:** 2026-11-21  
**Owner:** Backend engineering  
**Linked commit:** `0abe110` (reconciliation — bytecode archived, test stub created)

---

## What is missing

The inventory and options below record the original investigation. ADR-010 records the supersession decision and the current scope. Live-provider validation and court-use release gates are tracked separately.

Nine Python source files were never committed. Their `.cpython-314.pyc` bytecodes
were found in `__pycache__/` and archived to
`archive/unwired-recovery/bytecode/drafting/` and `.../registry/`.

| Missing file | Inferred purpose (from bytecode class/function names) |
|---|---|
| `drafting/__init__.py` | Package init |
| `drafting/architecture.py` | `DraftingArchitecture` — routing table from draft type to builder |
| `drafting/blocks.py` | `DraftBlock`, `HeaderBlock`, `BodyBlock` — composable draft sections |
| `drafting/catalog.py` | ~30-template catalog; `resolve_legacy_draft_type()` mapping |
| `drafting/conflicts.py` | Conflict detection between draft sections |
| `drafting/engine.py` | `DraftingEngine.build()` — orchestrator; highest-priority missing module |
| `drafting/grounds.py` | Legal grounds generation from supported facts |
| `drafting/placeholders.py` | Safe placeholder validation, `[[CITATION:n]]` slot management |
| `drafting/prompts.py` | Prompt templates with grounding and injection defences |
| `registry/__init__.py` | Package init |
| `registry/derivative_drafts.py` | Draft registration, provenance, version tracking |

**None of the above were ever committed to Git** (`git log --all --diff-filter=D`
returns nothing for these paths). The `.py` sources cannot be recovered.

---

## What the runtime does today

`api/routes_drafting.py` is the complete wired path:

```
POST /api/v1/generate-draft           (legacy body-param)
POST /api/v1/cases/{case_id}/generate-draft  (preferred path-param)
```

It accepts `draft_type ∈ {BRIEF, DISCHARGE, BAIL_439}`, loads case data,
builds a context string from the case timeline and forensic grounding,
selects a system prompt, and calls `gemini-1.5-flash` via LangChain.

The separate Pleading Chain variant engine was retired under ADR-011 and is no longer part of the runtime.

**The Gemini-direct path is fully functional for synthetic demo use.**

---

## Gap assessment

| Capability | Gemini-direct path | Missing package |
|---|---|---|
| Generate BRIEF / DISCHARGE / BAIL_439 | ✅ Wired | Would have added composable blocks |
| Template catalog (~30 templates) | ❌ Not present | Would have mapped legacy draft types |
| Conflict detection between sections | ❌ Not present | Missing |
| Placeholder validation / slot management | ⚠️ Prompt-level only | Would have been centralised; Pleading Chain retired |
| Prompt injection defence (structural) | ❌ Not present — relies on LLM | Would have used XML delimiters |
| Provenance / version tracking of drafts | ❌ Not present | Missing (registry/) |
| Grounded-only generation (no fabrication) | ⚠️ Prompt-level only | Would have been enforced structurally |

---

## Acceptance criteria

This blocker is resolved when **one** of the following is true:

### Option A — Formally supersede the package

A product decision documents that:
1. The Gemini-direct path (`routes_drafting.py`) is permanently canonical.
2. The ~30-template catalog is not needed (or is replaced by the existing
   `DraftTemplateLibraryPage` on the frontend).
3. Conflict detection, structural placeholder validation and prompt injection
   defence are accepted as out-of-scope for the current release.

Evidence: a signed-off ADR (suggested: `docs/adr/ADR-010-gemini-direct-drafting.md`).  
Test gate: `test_drafting_engine.py` skip stub is updated to `SKIP — superseded` and
the test file documents the ADR number.

### Option B — Rebuild the package from requirements

1. Each of the 9 modules is implemented from documented requirements
   (not inferred from bytecode).
2. `test_drafting_engine.py` covers: grounded drafting, missing-facts rejection,
   citation blocking, placeholder validation, conflict detection.
3. Prompt injection defence uses structural XML delimiters per SE guide §5.
4. `registry/derivative_drafts.py` tracks provenance and version.
5. All 388 frontend tests continue to pass; backend suite passes without exclusions.

---

## Recommended next action

**Decide Option A or B in the next sprint planning session.**

Option A is lower-risk for the current release cycle: the Gemini path works,
the frontend tests all pass, and the template library is already on the frontend.
Option B is correct if the richer structural layer is needed before court-use
exports are enabled.

The `test_drafting_engine.py` skip stub in the backend test suite makes this
gap visible in CI until the decision is recorded.

---

## Rollback / recovery

The bytecodes are preserved locally in `archive/unwired-recovery/bytecode/`.
They are **not tracked in Git** — `.gitignore` (`*.py[cod]`) excludes compiled
Python, so the archive exists only in the reconciliation working copy. If a
future decompiler targets Python 3.14 reliably, partial recovery may be
possible — but the accuracy rules prohibit deploying inferred legal logic
without independent test verification.
