# Action Plan — Pleading Chain Engine (Draft Multiplication)

**Goal.** One drafted pleading → a family of connected, matter-threaded drafts
across all 50 subjects, with Citation Search → Add to Draft, all tier-gated.

**Branch:** `feat/pleading-chain-engine`

---

## Phase 0 — Domain model (Day 1)

Define the four core entities (keep them plain dicts/TS types first, persist later):

| Entity | Fields |
|---|---|
| `MatterContext` | caseId, subject, court, parties (petitioner/respondent arrays), caseNo, stage |
| `VariantArchetype` | id, label {en, hi}, kind (subsequent/defence/interlocutory/execution/appeal), terminology glossary, citation requirements, preserves[] |
| `DraftNode` | id, caseId, parentDraftId?, archetypeId?, title, contentMd, status |
| `PleadingChain` | rootDraftId, nodes[] (a matter-threaded tree) |

**Key rule:** every variant *inherits* the MatterContext of its root draft and
may only be spawned from a draft that has passed (or has zero citations under)
the Fact-Fit Gate.

## Phase 1 — Subject × Variant registry (Days 1–3)

* `backend/data/subject_variants.json` ships with this patch: **50 subjects**,
  each with a base pleading set + 8–14 connected variants.
* Each variant entry carries: bilingual label, glossary of 5–10 terms of art
  (e.g. *rejoinder*: "sur-rejoinder", "replication", "strictly confined to
  counter-affidavit"), and `citation_requirements` (statutes almost always
  needed — e.g. Contempt → Art. 129/215, S.2(b) Contempt of Courts Act 1971;
  Review → Or.47 R.1 CPC).
* Governance: legal-domain requests update this JSON only — no code changes.

## Phase 2 — Backend engine (Days 3–6)

1. `services/variant_engine.py`
   - `extract_matter_context(base_draft_md)` — regex + heading parser (IN THE
     COURT OF…, …Versus…, CASE NO.).
   - `build_archetype_prompt(context, archetype)` — assembles a strict prompt:
     preserve matter context verbatim, use glossary terms of art, output
     headings in Indian court format, leave `[[CITATION:n]]` slots where
     citations are legally required.
   - `stream_variant(...)` — Anthropic streaming, chunked to the client.
2. `routers/pleading_variants.py`
   - `GET /api/variants/families?subject=` — variant tree for a subject.
   - `POST /api/variants/generate` — SSE stream of generated variant.
   - `POST /api/variants/save-node` — persists DraftNode to the chain.
   - `GET /api/citations/search?q=` — citation search (reuse existing RAG index).
3. **Gate handoff:** before *streaming starts*, run the base draft through the
   existing Fact-Fit probe. If any citation is PENDING/FATAL_ERROR → 428 error,
   frontend shows "Resolve gate first" (consistent with export-blocking rule).

## Phase 3 — Drafting Studio integration (Days 6–9)

1. `DraftVariantsPage.tsx` — new route `/drafts/:caseId/variants`.
2. "⚡ Spawn Connected Variants" button in Drafting Studio → opens page with
   base draft pre-loaded.
3. `VariantChain.tsx` — horizontal chain visual: base → children; click a node
   to edit in the existing editor (open as new draft pre-filled).
4. Bilingual labels (EN/HI) for every variant name — reuse i18n keys.

## Phase 4 — Citation Search → Add to Draft (Days 9–11)

1. `CitationAddToDraft.tsx` — search panel beside the editor.
2. Each result shows the Fact-Fit tier chip (COURT_SAFE/VERIFIED/SECONDARY/PENDING).
3. **Add to Draft button is disabled for PENDING/FATAL_ERROR** — same
   non-optional philosophy as export.
4. Insertion replaces the nearest `[[CITATION:n]]` slot, or appends a
   "Authorities cited" paragraph if no slot remains.
5. After insertion, re-run the citation probe on the draft (hook exists).

## Phase 5 — Terminology depth (Days 11–14)

* Per-variant glossary prompts: instruct the model to use terms of art *and
  explain none of them inline* (court style), but surface a hover glossary in
  the UI for junior advocates.
* "Complex but dynamic" requirement: glossary is versioned per archetype;
  updates are data-only.

## Phase 6 — Tests & CI (Days 14–16)

* `backend/tests/test_variant_engine.py` — matter-context extraction on 26
  synthetic demo cases; archetype prompt contains all glossary terms; gate
  428 behaviour.
* Frontend Vitest: chain reducer, tier-gated insert logic, i18n label coverage.
* Extend `.github/workflows` with `flag-lint` check for
  `VITE_FF_ENABLE_PLEADING_VARIANTS`.

## Phase 7 — Rollout

* Ship behind `VITE_FF_ENABLE_PLEADING_VARIANTS=false` → dogfood on 3 synthetic
  cases → enable in production.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Hallucinated citations inside variants | `[[CITATION:n]]` slots + mandatory Citation Search fill (Phase 4) + export gate unchanged |
| Matter-context drift between variants | MatterContext is extracted once, stored, injected verbatim; diff-check on save |
| 50-subject terminology quality | Legal-domain review workflow on `subject_variants.json` (CONTRIBUTING.md template) |
