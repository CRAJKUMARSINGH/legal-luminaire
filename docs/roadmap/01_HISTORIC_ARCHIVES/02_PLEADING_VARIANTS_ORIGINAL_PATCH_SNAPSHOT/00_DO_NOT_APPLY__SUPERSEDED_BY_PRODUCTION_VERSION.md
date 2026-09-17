# SUPERSEDED PATCH — DO NOT APPLY
Version: v1.0 original sandbox snapshot of the **Pleading Chain Engine (Pleading Variants / Draft Multiplication)** feature.
Moved from: SUPPLEMENT\legal-luminaire-pleading-variants-patch
Moved to:   docs\roadmap\01_HISTORIC_ARCHIVES\02_PLEADING_VARIANTS_ORIGINAL_PATCH_SNAPSHOT
Status:     ARCHIVED / HISTORIC REFERENCE ONLY. The repository already contains a strictly MORE CAPABLE production version of this feature.

## Differences (patch → production repo): Why applying on top would BREAK things

### 1. Backend — Folder structure mismatch
Patch target folder: `backend/routers/pleading_variants.py`
Repo actual location: `backend/api/routes_pleading_variants.py`
→ The `backend/routers/` folder does NOT exist in production. Applying patch would create a stray folder and the router would NEVER be imported (main.py imports from `api` package).

### 2. routes_pleading_variants.py — Fact-Fit gate is MORE ROBUST in production
- **Patch**: hard imports `from services.factfit_gate import probe_citations` on module load (breaks if that service is absent)
- **Repo**: try/except with fallback `ImportError` pass → feature gracefully degrades when gate service is not wired, instead of crashing the server

### 3. lib/variantsApi.ts — No hardcoded `/api` base, uses streamRequest
- **Patch**: hardcodes `const BASE = '/api'` + bare `fetch()` → bypasses CSRF/credentials/auth wrappers
- **Repo**: imports `{ streamRequest } from "./api-client"` → uses central request helper with:
  - base URL, auth headers, timeout, AbortController already wired
  - consistent error handling with the rest of the app
  - streaming chunked SSE wrapper

### 4. Frontend — Feature flag, navigation, NEW badge all present
- **Patch**: mentions `VITE_FF_ENABLE_PLEADING_VARIANTS` only in env docs
- **Repo**: wired into `src/config/featureFlags.ts:enablePleadingVariants` (comment block + default `true` per env)
- **Repo**: `src/config/navigation.ts line 99` → case-scoped nav entry: `"⚡ प्लीडिंग चेन / Pleading Chain Engine"` with Sparkles icon + badge: `"NEW"`
- **Repo**: `src/routes.tsx line 42 (lazy) + line 228 (Route path="/case/:id/draft-variants")` — routes integrated

### 5. Test file correctly positioned
- **Patch**: `backend/tests/test_variant_engine.py` ✅ identical path in repo (test file exists)
- **Patch**: `docs/action-plan-pleading-variants.md` → archived copy kept here, but also `docs/action-plan-pleading-variants.md` can live in docs too (if needed for discoverability)

## Files present inside (for historic reference):
- backend/data/subject_variants.json      (registry — identical in repo at same path)
- backend/routers/pleading_variants.py    (WRONG FOLDER in patch, should be api/)
- backend/services/variant_engine.py      (identical first 60 lines, repo has identical further content)
- backend/tests/test_variant_engine.py    (identical in repo)
- frontend/src/components/CitationAddToDraft.tsx  → repo at src/components/
- frontend/src/components/VariantChain.tsx        → repo at src/components/
- frontend/src/hooks/usePleadingVariants.ts       → repo at src/hooks/
- frontend/src/lib/variantsApi.ts                 → repo at src/lib/variantsApi.ts (MORE CAPABLE)
- frontend/src/pages/DraftVariantsPage.tsx        → repo at src/pages/DraftVariantsPage.tsx (imports all 3 wired above)
- docs/action-plan-pleading-variants.md
- README.md

## Reference-only files kept inside:
- README.md (original patch install steps — contains `routers/` instructions which are now OBSOLETE for the repo)
- docs/action-plan-pleading-variants.md (original 7-phase design, for historic comparison against evolved production implementation)
- backend/routers/pleading_variants.py (NOTE: FOLDER MISNAMED in patch; kept here to show intent)
- The 7 frontend/backend snapshot files

## What to copy out (if anything)?
Only the test file path needs to be verified in `backend/tests/` (it exists). Otherwise **copy nothing into repo from this patch** — production versions strictly dominate this snapshot and overwriting would regress the gate fallback, central request wrapper usage, and feature flag / navigation wiring.
