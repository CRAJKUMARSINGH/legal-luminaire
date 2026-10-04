# ETERNAL_RESEARCH_CHILD — Legal Luminaire Research Daemon

Background research daemon synchronized for **artifacts/legal-luminaire**.

Every 15 minutes it wakes up, picks a random file from `real_cases/`,
analyses it for legal engine refinements, and asks for your approval before
anything is changed.

---

## How to Run (from workspace root)

```powershell
# Start the 15-minute research daemon
pnpm daemon

# Regenerate researchImprovements.generated.ts (Phase 2 feed for the UI)
pnpm daemon:sync

# Watch mode (auto-restarts on file change)
pnpm daemon:dev
```

Or directly from inside this folder:
```powershell
cd ETERNAL_RESEARCH_CHILD
pnpm install
pnpm start          # daemon
pnpm sync           # regenerate UI feed
```

---

## What It Does

| Step | Action |
|------|--------|
| 1 | Scans `real_cases/` for `.md .lex .txt` files |
| 2 | Runs an app health check (all protected + patchable files present?) |
| 3 | Picks one file at random and pattern-matches its content |
| 4 | Generates a typed proposal (category + target file + code hint) |
| 5 | Asks `y/N` — **never modifies anything without explicit approval** |
| 6 | Logs every finding to `research_findings.log` (tracked in git — audit trail) |
| 7 | Sleeps 15 minutes, repeats |

Run with `--autopilot` or `-y` flag to auto-acknowledge all findings:
```powershell
tsx ETERNAL_RESEARCH_CHILD/research_daemon.ts --autopilot
```

---

## Proposal Categories

| Category | Source asset type | Target file |
|----------|-------------------|-------------|
| `CITATION_GATE_RULE` | Citation risk plans | `citation-gate.ts` |
| `PRECEDENT_UPGRADE` | Case law files, Kattavellai | `case01-data.ts` |
| `STANDARD_CORRECTION` | IS/ASTM/BIS standards | `case01-data.ts` |
| `VERIFICATION_RECLASSIFY` | Verification plans | `case01-data.ts` |
| `DEMO_CASE_ENRICHMENT` | Arbitration drafts | `infra-arb-cases.ts` |
| `FACT_FIT_THRESHOLD` | Scoring docs | `fact_fit_engine.py` |
| `ROADMAP_ITEM` | Logbooks, action plans | `ROADMAP.md` |
| `ACCURACY_RULE` | Prompts, master prompts | `accuracy-rules.md` |
| `DRAFTING_GROUND` | Any legal document | `case01-data.ts` |

---

## Protected vs Patchable

**Protected** (propose only — apply manually):
- `src/lib/case01-data.ts`
- `src/lib/citation-gate.ts`
- `src/lib/verification-engine.ts`
- `src/context/CaseContext.tsx`
- `src/App.tsx`

**Patchable** (propose + apply with `y` approval):
- `src/data/all-demo-cases.ts`
- `src/data/demo-cases/infra-arb-cases.ts`
- `src/lib/case-templates.ts`
- `backend/agents/fact_fit_engine.py`
- `backend/agents/standards_verifier.py`
- `ROADMAP.md`

---

## Phase 2: Improvement Lab Feed

`phase2_improvement_pipeline.ts` scans `real_cases/` and `research_findings.log`,
classifies useful material, and writes a review-only feed to:

```
artifacts/legal-luminaire/src/data/researchImprovements.generated.ts
```

The React app displays that feed at:
- **Route**: `/improvement-lab`
- **Nav label**: "Improvement Lab" (Research section, badge: P2)
- **Component**: `ResearchImprovementView.tsx`

The feed is deliberately conservative:
- Active-matter or privileged signals → `BLOCKED_ACTIVE_MATTER`
- Citations/standards without confirmed source → `NEEDS_SOURCE_CHECK`
- Each proposal carries LAB-style pass criteria
- Output is a review queue, not automatic legal advice

---

## Sources Tracked

| Folder | Contents |
|--------|----------|
| `real_cases/` | CASE01_HEMRAJ, CASE02_PITAMBARA, TC-22..TC-26 infra arb |
| `research_findings.log` | Daemon approval/skip log (audit trail) |

> `Attached_Assets/` has been cleared (all content actioned into codebase).  
> The daemon now draws exclusively from `real_cases/`.

---

## Accuracy Rules Enforced

All proposals follow `.kiro/steering/accuracy-rules.md`:
- Holdings must be **verbatim** — paraphrasing forbidden
- PENDING citations must have `blockedFromDraft: true`
- Every new precedent must carry `status / statusNote / sourceUrl / tags`
- IS 1199:2018 → fresh concrete only (never hardened masonry mortar)
- IS 2250:1981 → correct standard for masonry mortar
- Fact-Fit Gate: score ≥ 70 = exact, 50–69 = analogous, 30–49 = weak, < 30 = rejected

---

## After Applying a Proposal

```powershell
pnpm --filter @workspace/legal-luminaire run typecheck
pnpm --filter @workspace/legal-luminaire test
```

---

## Full Integration Map

```
ETERNAL_RESEARCH_CHILD/
  research_daemon.ts         ← 15-min cycle, reads real_cases/
  phase2_improvement_pipeline.ts  ← writes to ↓
  research_findings.log      ← audit trail (tracked in git)

artifacts/legal-luminaire/src/
  data/researchImprovements.generated.ts  ← UI data feed
  components/views/ResearchImprovementView.tsx  ← renders feed
  routes.tsx                 ← /improvement-lab route
  config/navigation.ts       ← nav entry (Research section, badge P2)

ROADMAP.md                   ← daemon's primary patchable target
pnpm-workspace.yaml          ← includes ETERNAL_RESEARCH_CHILD
package.json (root)          ← pnpm daemon / pnpm daemon:sync scripts
.gitignore                   ← excludes dist/ + node_modules/
                               research_findings.log is TRACKED (intentional)
```
