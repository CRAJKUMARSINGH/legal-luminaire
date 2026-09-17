# LEGAL LUMINAIRE — KIRO DETAILED 5-WEEK IMPLEMENTATION GUIDE
**Version**: 1.0 | Professional Grade | Accuracy-First  
**Agent**: Kiro (AWS Kiro / Spec-Driven Development)  
**Role**: Reliability Baseline • Type Safety • Dependency Hygiene • CI • Netlify Production Lock Specialist  
**Repo**: https://github.com/CRAJKUMARSINGH/LEGAL_LUMINAIRE  
**Primary Principle**: Never break accuracy rules, Fact-Fit Gate, verification tiers, IS-standard logic, or synthetic sample cases. Netlify production files must remain committed and functional after every change.

---

## STANDING RULES FOR KIRO (APPLY EVERY WEEK)

1. Work only on the scope assigned to the current week.
2. Prefer minimal, high-confidence, reversible diffs.
3. Always run `pnpm install --frozen-lockfile` and full typecheck + build before committing.
4. After any change that touches build or routing, verify clean-clone Netlify deploy still succeeds.
5. Preserve bilingual (Hindi + English) UI strings.
6. Never introduce real case data.
7. End every week by writing the required completion / support file under `docs/enrichment/`.
8. Conventional commit messages only.
9. If a task conflicts with accuracy rules → stop and document the conflict; do not proceed.

---

## WEEK 1 — PRIMARY OWNERSHIP  
**Theme**: Foundation, Reliability & Netlify Production Lock

### Objectives
- Make builds fully reproducible.
- Lock Netlify production configuration so a clean clone deploys correctly.
- Deliver P0 UX reliability (empty states + skeleton loaders).
- Establish minimal CI baseline.

### Detailed Tasks (execute strictly in order)

#### 1.1 Dependency Hygiene & Reproducibility
- Audit every dependency in `artifacts/legal-luminaire/package.json` and root `package.json`.
- Remove any remaining `"*"` wildcards or catalog-only unresolved references that prevent frozen installs.
- Pin exact versions where necessary.
- Delete `node_modules` and `pnpm-lock.yaml` (if present), then regenerate:
  ```
  pnpm install
  ```
- Commit the new clean `pnpm-lock.yaml`.
- Verify:
  ```
  pnpm install --frozen-lockfile
  pnpm run typecheck
  pnpm --filter @workspace/legal-luminaire run build
  ```

#### 1.2 Netlify Production Files — Hard Lock
- Open and harden **root** `netlify.toml`:
  - Build command must use the pnpm workspace correctly.
  - Publish directory must be exactly: `artifacts/legal-luminaire/dist/public`
  - SPA redirects: `/*` → `/index.html` status 200
  - Environment: `NODE_VERSION = "22"`, `PNPM_VERSION = "10"`
- Open and align `artifacts/legal-luminaire/netlify.toml` so it does not conflict (prefer root config).
- Ensure any required `_redirects` file exists inside the public/publish path and is committed.
- Document the exact clean-clone Netlify steps in both root `README.md` and `artifacts/legal-luminaire/DEPLOY_AND_MULTI_CASE_GUIDE.md`.

#### 1.3 Empty States + CTAs (P0)
- Identify every page that currently shows blank content when no case is loaded.
- Add professional empty states with:
  - Clear illustration / icon
  - Short bilingual explanation
  - Primary CTA (e.g. “Load Demo Case”, “Upload Documents”, “Browse Test Cases”)
- Pages that must be covered: Home, Case List / Selector, Research, Draft, Verification.

#### 1.4 Skeleton Loaders (P0)
- Add skeleton loaders for every AI-heavy or data-fetching page:
  - Research results
  - Draft generation
  - Verification report
  - Timeline / cross-reference matrix
- Use consistent shimmer / pulse styling that matches the existing design system.

#### 1.5 Minimal CI Scaffold
- Create `.github/workflows/ci.yml` (or equivalent) that runs on push / PR:
  - `pnpm install --frozen-lockfile`
  - Typecheck
  - Frontend build
  - Backend syntax / import check (python -m py_compile or equivalent)
- Ensure CI fails fast on type errors or build failures.

#### 1.6 Documentation & Completion
- Update root README “Deploy” section with precise Netlify instructions.
- Create `docs/enrichment/` folder if it does not exist.
- Write detailed completion report:
  ```
  docs/enrichment/WEEK1_KIRO_COMPLETION.md
  ```
  Include: files changed, commands run, Netlify verification result, known residual risks, hand-off notes for Devin.

### Week 1 Acceptance Criteria
- [ ] `pnpm install --frozen-lockfile` succeeds on clean clone
- [ ] Full typecheck + build succeeds
- [ ] Netlify deploy from clean clone produces working SPA with correct routing
- [ ] Empty states and skeleton loaders are visible and bilingual
- [ ] CI workflow exists and is green
- [ ] `WEEK1_KIRO_COMPLETION.md` committed

---

## WEEK 2 — SUPPORT ROLE
**Theme**: UX Navigation, Demo Mode & Multi-Case Data Layer (Devin Primary)

### Detailed Tasks
1. Review Devin’s navigation grouping PR for:
   - TypeScript strictness
   - Route conflicts with existing case-scoped and legacy routes
   - Missing type definitions for new case data structures
2. Ensure every new route still works with Netlify SPA redirects.
3. Add any missing TypeScript interfaces / types required by the new case data layer.
4. Extend CI to cover the new case-selector paths (at least typecheck + build).
5. Write support note:
   ```
   docs/enrichment/WEEK2_KIRO_SUPPORT.md
   ```

### Acceptance
- No new TypeScript errors introduced.
- Netlify SPA routing remains intact.
- Support note committed.

---

## WEEK 3 — SUPPORT ROLE
**Theme**: Document Pipeline & Accuracy Controls (Trae Primary)

### Detailed Tasks
1. Review Trae’s upload → indexing PR for type safety and proper error handling on the frontend side.
2. Ensure upload progress states, error messages, and success feedback are fully typed and user-friendly.
3. If feasible, add a minimal document-ingestion smoke test to CI.
4. Write support note:
   ```
   docs/enrichment/WEEK3_KIRO_SUPPORT.md
   ```

### Acceptance
- Frontend remains type-safe after pipeline changes.
- Support note committed.

---

## WEEK 4 — SUPPORT ROLE
**Theme**: Guided Workflow & Observability (Antigravity / Devin Primary)

### Detailed Tasks
1. Ensure all new guided-flow routes are fully type-safe.
2. Confirm legacy flat routes redirect correctly without breaking existing bookmarks or deep links.
3. Verify CI still covers the expanded route surface.
4. Write support note:
   ```
   docs/enrichment/WEEK4_KIRO_SUPPORT.md
   ```

### Acceptance
- Typecheck remains green.
- Support note committed.

---

## WEEK 5 — FINAL RELIABILITY LOCK
**Theme**: Production Release Hygiene

### Detailed Tasks
1. Final full dependency and lockfile audit.
2. Confirm CI is completely green on main.
3. Prepare release tag checklist (what must be true before tagging).
4. Write final check report:
   ```
   docs/enrichment/WEEK5_KIRO_FINAL_CHECK.md
   ```

### Acceptance
- CI green.
- Final check file committed.
- Ready for Antigravity to tag the release.

---

## FINAL NOTES FOR KIRO
You are the reliability gatekeeper.  
If anything threatens reproducibility, type safety, or Netlify production deployability, you have authority to block the week until it is fixed.  
Always leave the repository in a state where a fresh clone + Netlify connect produces a working production demo.  
End of Kiro Guide.
