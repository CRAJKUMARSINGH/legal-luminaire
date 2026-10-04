# LEGAL LUMINAIRE — MODERNIZATION PLAN
## Version 1.0 | April 3, 2026 | **Status Updated: September 2026**

> **STATUS: All Priority P0–P2 items COMPLETE ✅ (5-Week Enrichment Programme)**  
> One item remains open: Extract shared form components (P3).  
> New items added from Attached_Assets roadmap: Month 6 (Hearing Tracker + Probability Assessment Card).

---

## BASELINE ASSESSMENT

### Current Architecture
- React 19 + TypeScript + Vite frontend (SPA)
- FastAPI Python backend (multi-agent: CrewAI + LangChain + ChromaDB)
- Express Node.js API server (template, minimal routes)
- pnpm monorepo with shared lib packages
- 40+ routes (case-scoped + legacy flat routes)
- Bilingual UI (Hindi + English)

### Key Pain Points Identified
1. **Navigation overload** — 40+ nav items visible simultaneously; no grouping or progressive disclosure
2. **Empty states** — several pages show blank content when no case is loaded
3. **No onboarding flow** — new users land on Home with no clear next step
4. **Loading states** — AI research/draft pages lack skeleton loaders
5. **Validation feedback** — form errors not surfaced clearly in intake flow
6. **Legacy flat routes** — duplicate routes (flat + case-scoped) cause confusion
7. **No recent cases** — no history/recents panel on Home
8. **Test data browser** — no UI to browse the 21 test cases
9. **Marketing demo mode** — no dedicated demo/showcase path
10. **Audit trail** — verification panel exists but not linked from draft output

### Modernization Targets

#### UX / Navigation
- [x] Collapse nav into grouped sections (Case Setup / Research / Drafting / Review) — **DONE Week 2**
- [x] Add breadcrumb trail for case-scoped pages — **DONE Week 2**
- [x] Add "Recent Cases" widget on Home — **DONE Week 2**
- [x] Add empty-state illustrations with clear CTAs — **DONE Week 1**
- [x] Add skeleton loaders for AI-heavy pages — **DONE Week 1**

#### Workflow
- [x] Guided intake → research → draft → review flow — **DONE Week 4**
- [x] Task-oriented dashboard cards (not just links) — **DONE Week 4**
- [x] Document type selector before drafting — **DONE Week 4**
- [x] One-click demo mode (loads CASE_01 with all data pre-filled) — **DONE Week 2**

#### Reliability
- [x] Input validation on all forms (Zod schemas already present — wire to UI) — **DONE Week 2**
- [x] Error boundaries on all page components — **DONE Week 4**
- [x] Retry logic on API calls (React Query already configured) — **DONE Week 4**
- [x] File upload size/type validation — **DONE Week 3 (Trae) + Week 4**

#### Visual Polish
- [x] Consistent card elevation and spacing — **DONE Week 4**
- [x] Status badges (VERIFIED / SECONDARY / PENDING) with colour coding — **DONE Week 4**
- [x] Progress indicators on multi-step flows — **DONE Week 4**
- [x] Print-ready CSS for draft output pages — **DONE Week 4**

#### Maintainability
- [x] Remove legacy flat routes (keep for backward compat via redirect) — **DONE Week 1–2**
- [ ] Extract shared form components — *Still open*
- [x] Add JSDoc to all lib functions — **DONE (citation-gate.ts, verification-engine.ts)**
- [x] Consolidate case data loading into single hook — **DONE (useCaseContext)**

---

## IMPLEMENTATION PRIORITY

| Priority | Item | Effort | Impact | Status |
|----------|------|--------|--------|--------|
| P0 | Empty states + CTAs | Low | High | ✅ Done — Week 1 |
| P0 | Skeleton loaders | Low | High | ✅ Done — Week 1 |
| P1 | Nav grouping | Medium | High | ✅ Done — Week 2 |
| P1 | Demo mode | Medium | Very High | ✅ Done — Week 2 |
| P1 | Test data browser | Medium | High | ✅ Done — Week 2 |
| P2 | Guided flow | High | Very High | ✅ Done — Week 4 |
| P2 | Print CSS | Low | Medium | ✅ Done — Week 4 |
| P3 | Legacy route cleanup | Low | Medium | ✅ Done — Week 1–2 |
| P3 | Extract shared form components | Low | Low | 🔄 Still open |
| NEW | Hearing Tracker + Countdown | Medium | High | 🔄 Month 6 roadmap |
| NEW | Probability Assessment Card | Medium | Very High | 🔄 Month 6 roadmap |

---

## CACHE / ARTIFACT HYGIENE TARGETS

- `.pytest_cache/` — clear before each test run
- `artifacts/legal-luminaire/dist/` — gitignored, rebuild on deploy
- `node_modules/` — gitignored, managed by pnpm
- `__pycache__/` — gitignored, Python bytecode
- `artifacts/legal-luminaire/backend/chroma_db/` — gitignored, vector DB data
- Stale `.lex` files in TEST_CASES — audit and remove duplicates

---

## BACKWARD COMPATIBILITY

All existing routes preserved. Legacy flat routes redirect to case-scoped equivalents.
No breaking changes to `case01-data.ts` schema.
All existing test cases preserved and extended.
