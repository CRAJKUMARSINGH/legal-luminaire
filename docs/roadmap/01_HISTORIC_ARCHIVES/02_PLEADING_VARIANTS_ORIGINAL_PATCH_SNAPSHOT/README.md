# Pleading Chain Engine — Drop-in Patch v1.0

One subject → many connected drafts. This patch adds the **Pleading Chain Engine**
to Legal Luminaire: from a single Petition/Application drafted in Drafting Studio,
it generates *connected variants* — Rejoinder, Reply to Counter-Affidavit,
Supplementary Affidavit, Interim Application, Contempt, Review, Modification,
Execution, Appeal, Caveat, Written Statement, Written Arguments, and more —
using the *same matter context* (parties, case number, court, subject) with
complex but dynamic Indian legal terminology, for **all 50 subjects**.

It also wires **Citation Search → Add to Draft** with the existing
Fact-Fit Gate: citations below VERIFIED tier are blocked from insertion,
exactly like export is blocked today.

## File map

| Patch file | Drop into repo at | Purpose |
|---|---|---|
| `backend/routers/pleading_variants.py` | `artifacts/legal-luminaire/backend/routers/pleading_variants.py` | FastAPI routes: variant families, streaming generation, citation search |
| `backend/services/variant_engine.py` | `artifacts/legal-luminaire/backend/services/variant_engine.py` | Core engine: matter context + archetype prompt builder + Fact-Fit handoff |
| `backend/data/subject_variants.json` | `artifacts/legal-luminaire/backend/data/subject_variants.json` | 50-subject × variant-chain registry (bilingual EN/HI) |
| `frontend/src/pages/DraftVariantsPage.tsx` | `artifacts/legal-luminaire/src/pages/DraftVariantsPage.tsx` | Drafting Studio → "Spawn Variant" page with chain visualizer |
| `frontend/src/components/VariantChain.tsx` | `artifacts/legal-luminaire/src/components/VariantChain.tsx` | Matter-thread visual (base draft → connected variants) |
| `frontend/src/components/CitationAddToDraft.tsx` | `artifacts/legal-luminaire/src/components/CitationAddToDraft.tsx` | Citation search panel with tier-gated "Add to Draft" |
| `frontend/src/hooks/usePleadingVariants.ts` | `artifacts/legal-luminaire/src/hooks/usePleadingVariants.ts` | State + streaming hook |
| `frontend/src/lib/variantsApi.ts` | `artifacts/legal-luminaire/src/lib/variantsApi.ts` | Typed API client |
| `docs/action-plan-pleading-variants.md` | `docs/action-plan-pleading-variants.md` | Full 7-phase action plan |

## Install (≈ 20 minutes)

1. Copy the 9 files above into the paths shown.
2. **Backend** — in `backend/main.py`:
   ```python
   from routers import pleading_variants
   app.include_router(pleading_variants.router, prefix="/api")
   ```
3. **Routing** — in `src/routes.tsx` add a lazy route:
   ```tsx
   "/drafts/:caseId/variants": lazy(() => import("./pages/DraftVariantsPage")),
   ```
4. **Drafting Studio integration** — in the Drafting Studio page add:
   ```tsx
   <Link href={`/drafts/${caseId}/variants`} className="btn-primary">
     ⚡ Spawn Connected Variants
   </Link>
   ```
5. **Feature flag** — add to `VITE_FF` env table:
   ```
   VITE_FF_ENABLE_PLEADING_VARIANTS=true
   ```
6. **Run checks**
   ```
   pnpm run typecheck
   cd backend && pytest tests/test_variant_engine.py
   ```

## Architecture in one line

```
Draft (base) ──► extract matter context ──► variant archetype (per subject)
      │                (parties, court, S.no)          │
      │                                              ▼
      └────────◄── stream generated variant ◄── Anthropic Claude
                        │ citation slots
                        ▼
              Citation Search ──Add to Draft──► Fact-Fit Gate
                        (COURT_SAFE / VERIFIED only)
```
