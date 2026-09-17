# APPLY.md — Draft Multiplication (Document Family) Patch

Additive, non-breaking patch for `legal-luminaire`. It multiplies one parent
draft (petition/application) into its full document family — rejoinder,
replication, counter-affidavit, supplementary application, amendment
application, interim/stay application, review, appeal, caveat, execution,
restoration, additional evidence — across a 50-subject registry, with
Citation Search authority blocks piped into every derived draft.

**Verified against repo state:** Python 3.12 `py_compile` clean on all touched
backend files; registry unit-test passes (12 derivative types × 50 subjects,
all cross-references valid); changed TS/TSX files pass esbuild parse.

---

## 1. File-by-file changes

| # | File | Status | Purpose |
|---|------|--------|---------|
| 1 | `artifacts/legal-luminaire/backend/registry/__init__.py` | NEW | Registry loader: derivative types, 50-subject matrix, system-prompt builder, authority-block formatter |
| 2 | `artifacts/legal-luminaire/backend/registry/derivative_drafts.json` | NEW | The data: 12 derivative pleading types (terminology, when-filed, prayer focus, jurisdiction notes) + 50 subjects with applicability matrix |
| 3 | `artifacts/legal-luminaire/backend/agents/derivative_drafter.py` | NEW | Generator agent: builds parent-child context, injects authority blocks, calls Gemini, extracts citations for verification |
| 4 | `artifacts/legal-luminaire/backend/api/routes_derivative.py` | NEW | API router (4 endpoints, see §3) with draft-family lineage persisted next to `case_data.json` |
| 5 | `artifacts/legal-luminaire/backend/main.py` | MODIFIED (+3 lines) | Import + `app.include_router(derivative_router, prefix="/api/v1")` |
| 6 | `artifacts/legal-luminaire/src/lib/draft-family.ts` | NEW | Typed frontend client for the 4 endpoints |
| 7 | `artifacts/legal-luminaire/src/pages/DraftFamilyPanel.tsx` | NEW | "Draft Multiplication" studio page: subject picker → derivative-type picker → parent draft picker → Citation Search authority picker → generate → family tree |
| 8 | `artifacts/legal-luminaire/src/routes.tsx` | MODIFIED (+3 lines) | Lazy route `/case/:id/draft-family` |

Nothing existing is modified beyond the two 3-line registration edits.
Rollback = delete the 6 new files + revert the 2 small edits (or
`git checkout -- artifacts/legal-luminaire/backend/main.py artifacts/legal-luminaire/src/routes.tsx`).

## 2. Apply steps

```bash
cd legal-luminaire                      # repo root
# the patch zip contains artifacts/... paths relative to repo root
unzip draft-multiplication-patch.zip -d .

# backend deps: nothing new required (uses existing langchain-google-genai, pydantic, fastapi)
# frontend deps: nothing new required (reuses wouter, lucide-react, existing ui components)
```

Run / verify:

```bash
# Backend
cd artifacts/legal-luminaire/backend
python -m py_compile registry/__init__.py agents/derivative_drafter.py api/routes_derivative.py main.py
uvicorn main:app --reload    # then open http://localhost:8000/docs → see /derivative-types, /subjects

# Frontend
cd ..
pnpm dev
# In the app: open any case → navigate to /case/<case-id>/draft-family
```

## 3. New API endpoints (all under `/api/v1`)

| Method | Path | What it does |
|--------|------|--------------|
| GET | `/derivative-types?subject_id=` | List 12 derivative types; filter by subject applicability |
| GET | `/subjects` | List all 50 subjects with their applicable derivative types |
| POST | `/cases/{case_id}/derivative-drafts` | Generate one derivative draft (subject + type + parent draft + authority blocks + notes). Returns draft, lineage, extracted citations |
| GET | `/cases/{case_id}/draft-family` | Full lineage tree for the case (parent/child, authority ids, citations) |

## 4. How Drafting Studio + Citation Search are used together

1. **Parent first:** generate the petition/application in the existing
   Drafting Studio (`/case/:id/drafting`) as today — untouched.
2. **Multiply:** open `/case/:id/draft-family`. Pick the subject (e.g.
   `criminal_discharge`); the panel auto-filters which versions apply.
3. **Parent linkage:** pick the parent draft from the family tree — the
   derivative generator receives the parent's verbatim body and must maintain
   consistency of facts, dates, party names, and cross-references.
4. **Citation Search hook:** type in the authority box — it reuses the exact
   client-side search engine (`src/lib/search.ts`) behind Citation Search, and
   picked authorities travel to the backend as **authority blocks**
   (title/citation/holding/application). The draft prompt restricts the model
   to ONLY those precedents, marked `[VERIFIED]`/`[COURT_SAFE]`.
5. **Safety chain preserved:** every derived draft's citations are extracted
   server-side (`citations_extracted`) and can be run through the existing
   `/verify-citations` pipeline exactly like Drafting Studio drafts.

## 5. Rollback

```bash
git checkout -- artifacts/legal-luminaire/backend/main.py artifacts/legal-luminaire/src/routes.tsx
rm artifacts/legal-luminaire/backend/registry/__init__.py \
   artifacts/legal-luminaire/backend/registry/derivative_drafts.json \
   artifacts/legal-luminaire/backend/agents/derivative_drafter.py \
   artifacts/legal-luminaire/backend/api/routes_derivative.py \
   artifacts/legal-luminaire/src/lib/draft-family.ts \
   artifacts/legal-luminaire/src/pages/DraftFamilyPanel.tsx
```
