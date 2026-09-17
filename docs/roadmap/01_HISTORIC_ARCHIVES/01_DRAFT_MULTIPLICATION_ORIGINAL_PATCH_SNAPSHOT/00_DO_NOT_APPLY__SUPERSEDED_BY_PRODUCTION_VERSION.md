# SUPERSEDED PATCH — DO NOT APPLY
Version: v1.0 original sandbox snapshot of Draft Multiplication (Document Family / Derivative Drafts) — delivered in patch form.
Moved from: SUPPLEMENT\draft-multiplication-patch
Moved to:   docs\roadmap\01_HISTORIC_ARCHIVES\01_DRAFT_MULTIPLICATION_ORIGINAL_PATCH_SNAPSHOT
Status:     ARCHIVED / HISTORIC REFERENCE. The repository already contains a strictly MORE CAPABLE production version of this feature.
Why archived:
  - Backend derivative_drafter.py in repo has: multi-LLM priority (OpenAI → Gemini → deterministic skeleton fallback), build_document_family batch API, validate_pairing gate, structured anchors lineage.
  - Backend routes_derivative.py in repo uses a DIFFERENT path contract (/derivative/health, /case/{id}/derivative/generate, /case/{id}/derivative/family — 9 routes vs patch's 4). Applying patch breaks routing.
  - Frontend draft-family.ts uses apiFetch() (no hardcoded localhost:8000), draftFamilyClient typed object, stage colors, subject auto-detect sniffer, 263 lines of evolved client code.
  - Frontend DemoCaseBrowser & navigation already wire DraftFamilyPanel via featureFlags.enableDerivativeDrafts.
Applying this patch on top will: duplicate routes, overwrite multi-LLM fallback with gemini-only, hardcode localhost API calls, remove the NEW sidebar badge.
Reference-only files kept inside:
  - CHANGES.diff (1020-line canonical diff, historic record of intended API surface)
  - APPLY.md    (original install steps, reference)
  - ACTION_PLAN.md (original roadmap, for historical comparison against evolved production version)
  - artifacts/… (snapshot of 8 original patch files — do NOT copy into repo)

