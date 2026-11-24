# P2-02 — Pleading Variants: missing registry data and unwired routes
**Priority:** P2
**Status:** OPEN — requires an explicit *register-or-retire* decision; targeted browser regression passed and the full route sweep is pending
**Opened:** 2026-11-21
**Owner:** Backend engineering (feature decision) + Frontend engineering (route sweep)
**Linked commits:** `0abe110` (reconciliation — tests recreated, gap first recorded),
`4d12b78` / `47273bd` (blocker tracking, PR #6)

---

## What is missing

The pleading-variants feature is **half-present**. Two independent gaps exist, and
neither has ever worked in a committed build.

### Gap A — `backend/data/subject_variants.json` does not exist

`services/variant_engine.py` resolves its registry at import-time-relative path:

```python
DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "subject_variants.json"
# → backend/data/subject_variants.json
```

That file **does not exist anywhere in the repository** (`git log --all` shows it was
never committed; `Glob **/subject_variants*.json` → no match). Every registry-backed
call therefore raises `FileNotFoundError` at `load_registry()`:

- `load_registry()` — `DATA_FILE.read_text()`
- `subject_families(subject)` — `reg["subjects"].get(subject)`
- `list_subjects()` — `[{"id": k, "label": v["label"]} for k, v in reg["subjects"].items()]`

### Gap B — `api/routes_pleading_variants.py` is not registered

`api/routes_pleading_variants.py` defines a complete router
(`APIRouter(prefix="/variants", tags=["pleading-variants"])`) with five routes:

| Route | Handler | Registry-dependent? |
|---|---|---|
| `GET  /variants/subjects` | `list_subjects()` | ✅ yes |
| `GET  /variants/families?subject=` | `subject_families()` | ✅ yes |
| `POST /variants/matter-context` | `extract_matter_context()` | ❌ no (pure text) |
| `POST /variants/generate` (SSE) | `subject_families()` + Fact-Fit Gate (428) | ✅ yes |
| `POST /variants/citations/search` | `rag_store.hybrid_search` | ❌ no |

**`main.py` imports and registers 17 routers; `routes_pleading_variants` is not among
them.** There is no `include_router` for it. Consequently the entire `/api/v1/variants/*`
surface returns `404` — Gap A is currently latent because the code that would hit the
missing JSON is unreachable.

> The router contains the same non-optional citation discipline as export: `POST
> /variants/generate` refuses with **HTTP 428** when the base draft has `PENDING` /
> `FATAL_ERROR` citations. Any decision to wire the router must preserve that gate.

---

## Intended behaviour and schema (`subject_variants.json`)

The file is the data layer for the Pleading Chain Engine: one drafted pleading expands
into a matter-threaded family of connected variants.

**Inferred schema (from the consumer code — not invented):**

```jsonc
{
  "subjects": {
    "<subject-id>": {                       // e.g. "criminal", "civil"
      "label": { "en": "…", "hi": "…" },    // read by list_subjects()
      "variants": [
        {
          "id":            "<archetype-id>", // e.g. "regular_bail"
          "label":         { "en": "…", "hi": "…" },
          "kind":          "<bail|civil|…>",
          "stage":         "<pleading|…>",
          "glossary":      ["…"],            // embedded into the prompt
          "citations":     ["S. 439 CrPC", "…"] // drives [[CITATION:n]] slot count
        }
      ]
    }
  }
}
```

**Consumers:**

- `services/variant_engine.py` — `load_registry`, `subject_families`, `list_subjects`,
  `build_archetype_prompt` (reads `label`, `glossary`, `citations`), `stream_variant`.
- `api/routes_pleading_variants.py` — all registry-backed routes above.
- Frontend `src/pages/DraftVariantsPage.tsx` — calls `variantsApi.subjects()` and expects
  a list of `{ id, label }`.
- Backend tests `tests/test_variant_engine.py` — 2 registry-gated tests currently **skip**
  (`test_registry_lists_subjects`, `test_unknown_subject_raises_keyerror`) via
  `@pytest.mark.skipif(not ve.DATA_FILE.is_file(), …)`.

The `archive/unwired-recovery/README.md` records that the predecessor `registry/` bytecode
(`SUPERSEDED`, now `services/variant_engine.py`) also expected `DATA_FILE =
subject_variants.json`, so the data gap is **pre-existing**, not introduced by the
reconciliation.

---

## Live browser defect

The previous `DraftVariantsPage.tsx` request for subjects rejected without a handler
when the endpoint returned 404. The page now handles the rejection and shows an
unavailable state. A targeted browser check of the built app passed for a mocked
404, an empty subject list, and a populated subject list, with no uncaught errors.

The previous Playwright route sweep records `/case/:id/draft-variants` as a non-pass.
Re-run the full sweep to refresh that release evidence.

---

## Acceptance criteria

This blocker is resolved only when **all** of the following hold:

1. **Decision recorded.** A product/engineering decision explicitly states whether the
   pleading-variants feature is **registered** (wired + data supplied) or **retired**
   (routes removed / deliberately disabled, frontend page removed or gated with a clear
   "not available" state). "Left half-wired" is not an accepted resolution.
2. **Data (if registered).** `backend/data/subject_variants.json` exists and validates
   against the schema above; every `subject` referenced by the frontend resolves; every
   `variant.citations` entry is a real, court-checkable authority (no fabricated law).
3. **Routing (if registered).** `routes_pleading_variants` is **intentionally**
   registered in `main.py`, or (if retired) is removed so no dead router remains.
4. **Controls preserved.** The Fact-Fit Gate remains non-optional: `POST
   /variants/generate` still returns 428 on `PENDING`/`FATAL_ERROR` citations, and the
   existing auth + per-key case-scoping (`LL_API_KEY` / `LL_API_KEY_SCOPES`) continues to
   apply to every newly exposed route.
5. **Test gap closed.** The 2 registry-gated skips in `tests/test_variant_engine.py` are
   either un-skipped and passing (registered path) or replaced by an explicit
   superseded/retired assertion. Backend suite passes with no silent skips.
6. **Browser defect fixed.** `DraftVariantsPage.tsx` handles the failure path (`.catch`
   with a user-visible error state and no unhandled rejection), verified by the route
   sweep reporting `/case/:id/draft-variants` as a pass.

---

## Evidence required

| Evidence | Source |
|---|---|
| Decision record (ADR or issue) — register vs. retire | `docs/adr/` or linked issue |
| JSON schema validity of `subject_variants.json` (or "not applicable — retired") | validator / test output |
| Router registration diff, or removal diff | `main.py` diff |
| 428 gate + auth/case-scoping still enforced on new routes | `test_variant_engine.py` + `test_http_contract.py` green |
| Backend suite green with no silent skips | `pytest` output |
| Route sweep pass for `/case/:id/draft-variants`, 0 unhandled rejections | `route-sweep` report |

---

## Release impact

| Release | Impact |
|---|---|
| **Synthetic-data demo / staging** | The Draft Variants page shows an unavailable state when the registry cannot load. The demo can proceed while the variants registration decision remains open. |
| **Confidential production** | Not a security blocker on its own (the surface is unreachable), but SE-01 remains the gating blocker. |
| **Court-use exports** | Remains blocked by SE-01 + the 11 legal-source items; P2-02 adds no export path (router is unwired), so it does not alter that decision. |

**Preserved restrictions:** confidential production stays blocked by **SE-01**; court-use
exports stay blocked pending **SE-01** + verification of all **11** legal-source items.
Nothing in this blocker lifts either restriction.

---

## Recommended next action

1. **Decide register vs. retire** in the next planning session (pair with the P2-01
   drafting-package decision — both concern the drafting surface).
2. **Re-run the full browser route sweep** to update the historical route result.
3. **Do not** wire the router or author `subject_variants.json` until the decision is
   made and real (non-fabricated) citation authorities are available.

---

## Explicit prohibition for this documentation patch

This document is **documentation only**. It must **not**:

- enable or register `routes_pleading_variants` in `main.py`;
- create or invent `subject_variants.json` content or any legal variant data;
- alter authentication, the citation gate, or any export restriction.

---

## Rollback / recovery

No code or data is changed by this patch — it is advisory. If a future register/retire
implementation is later reverted, `git revert` of **that** change restores the current
half-wired state; this blocker document remains valid until criterion 1 (a recorded
decision) is met.
