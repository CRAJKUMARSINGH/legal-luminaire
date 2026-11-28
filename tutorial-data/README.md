# Rajasthan Tutorial Pairs — Legal Luminaire

Paired `input` → repository-draw corpus for Rajasthan **district court** and
**Rajasthan High Court** (Jodhpur principal seat / Jaipur bench) practitioners.

Every pair is `input` (what the user actually types, pastes, or hands over) and
`expected` (what the repository draws back). Nothing here is filing-ready.

> SYNTHETIC / DEMO. No real client, party, khasra, FIR or fee is reproduced.

## Why this exists

The fixtures in `artifacts/legal-luminaire/src/data/demo-cases/` teach the
*engine* to behave. This corpus teaches the *advocate* — beginner to senior — to
read what the engine refuses, and why. It is organised by three axes the rest of
the repo does not sort on:

- **stage** — `initial` · `reply` · `trial` · `appeal` · `mid-journey`
- **level** — `beginner` · `intermediate` · `advanced` · `expert`
- **forum** — district · High Court · revenue · RERA · commercial

`mid-journey` is the under-served case: a dissatisfied client arrives with a
half-file and wants the previous advocate replaced. `trial` exists so that trial
preparation (week 11, POCSO examination) is not blurred into `reply`.

## Static contract

The `expected` block is **gate-shaped, not answer-shaped**. It carries the gates
the engine applies — `citationGate`, `limitationGate`, a tier-tagged
`verification` list, a `chronology` with confidence, a `drafts` list where the
status is `blocked` / `review-needed` / `intake-only` rather than "ready", and a
`terminalOutcome`. BNSS/BSA 2023 come first, CrPC/IEA appear in parentheses as
`legacyEquivalent`, and anything not certain is tagged `PENDING` or `SECONDARY`
rather than given a confident number.

Three invariants hold across the whole corpus:

1. **No filing-ready.** No draft carries a `filing-ready` status. A pair that
   claims one fails validation.
2. **PENDING ⇔ blocked.** A verification entry tagged `PENDING` must be
   `blockedFromDraft: true`, and a non-`PENDING` entry must not be blocked.
3. **Body ⇔ productive.** A *productive* draft (`draft` / `review-needed` /
   `ready-for-supervising-advocate`) ships a `body`; a *dormant* draft
   (`blocked` / `intake-only` / `research-needed`) carries none.

## The output layer

Each productive draft carries a `body`: a worked example of what the engine
hands the advocate. It is **gate-shaped, not answer-shaped** — every authority
that is not already verified in that pair stays an explicit `[PENDING — …]`
hole, never a filled guess. The validator rejects a body that contains a
reporter citation (`(2019) 4 SCC 1`, `AIR 2019 SC 1`, `2019 INSC 45`,
`SCC OnLine`) so the corpus cannot smuggle in a fabricated authority.

Verdicts and their sources are checked too: every non-`PENDING` verification
entry that names a statute carries an official public `sourceUrl` (India Code,
`indiacode.nic.in`); case-law, practice and non-statutory propositions stay
`sourceUrl: null` with a `sourceUrlNote` explaining why.

Read the output two ways:

- **In the corpus** — `body` in each `pairs/*.json` file.
- **In the app** — `/tutorial-pairs`, expand a card to read the bodies, then
  **Open in Drafting Studio** (`/tutorial-pairs/:id`) to hand the same intake
  text to the live engine (`POST /legal/draft`) and watch it draw the same
  answer back — and refuse in the same places.

## Stage × level matrix

| ID | Stage | Level | Forum | Input kind (language / channel) | Terminal |
|----|-------|-------|-------|---------------------------------|----------|
| 01 | initial | beginner | district | query (hinglish / walk-in) | refer |
| 02 | initial | beginner | district | notice-text (en / whatsapp) | review |
| 03 | initial | intermediate | district | fir (en / walk-in) | proceed |
| 04 | reply | intermediate | district | reply-instruction (en / email) | review |
| 05 | initial | advanced | district | submit (en / counter) | hold |
| 06 | appeal | advanced | high-court | query (en / phone) | proceed |
| 07 | appeal | expert | high-court | handover (en / email) | hold |
| 08 | mid-journey | intermediate | district | handover (hinglish / whatsapp) | review |
| 09 | reply | advanced | high-court | reply-instruction (en / email) | hold |
| 10 | mid-journey | beginner | district | second-opinion (hinglish / walk-in) | refer |
| 11 | initial | expert | rera | demand (en / email) | proceed |
| 12 | reply | advanced | district | reply-instruction (hi / walk-in) | review |
| 13 | appeal | expert | revenue | handover (hinglish / walk-in) | hold |
| 14 | initial | beginner | revenue | query (hinglish / walk-in) | hold |
| 15 | initial | intermediate | district | query (hinglish / walk-in) | review |
| 16 | appeal | intermediate | revenue | handover (hinglish / walk-in) | hold |
| 17 | reply | advanced | district | reply-instruction (en / walk-in) | proceed |
| 18 | trial | expert | district | submit (hi / walk-in) | proceed |
| 19 | initial | beginner | district | notice-text (hi / walk-in) | refer |
| 20 | reply | intermediate | district | reply-instruction (hi / email) | review |
| 21 | appeal | advanced | high-court | query (hi / email) | hold |
| 22 | mid-journey | expert | district | handover (hi / walk-in) | hold |
| 23 | appeal | expert | high-court | reply-instruction (en / walk-in) | hold |
| 24 | appeal | expert | revenue | query (hi / walk-in) | proceed |
| 25 | initial | beginner | district | query (hinglish / walk-in) | review |
| 26 | reply | intermediate | commercial | reply-instruction (en / email) | review |
| 27 | initial | beginner | district | demand (hinglish / whatsapp) | hold |
| 28 | initial | beginner | district | query (hinglish / walk-in) | review |
| 29 | reply | advanced | district | query (en / email) | review |
| 30 | appeal | beginner | district | query (hinglish / walk-in) | review |

Coverage: 30 pairs, 14/20 stage × level cells filled, 128 verification entries,
3 languages (en 12 · hinglish 11 · hi 7). The `review` outcome dominates (11),
which is the point — most intakes need a supervising eye, not an export.

## File tree

```
tutorial-data/
├── README.md                       ← this file
├── index.json                      ← corpus manifest (id → file, stage, level, forum)
├── schema/
│   └── tutorial-pair.schema.json   ← JSON Schema (draft 2020-12) for one pair
├── pairs/                          ← 30 canonical pair files
│   ├── TP-RJ-01-kabza-forum-split.json
│   └── … TP-RJ-30-rent-tribunal-appeal-kota.json
└── GUIDE/                          ← the multi-file curriculum built on these pairs
    ├── 00-START-HERE.md … 03-rubric.md
    ├── weeks/week-01-…md … week-11-…md
    └── annex/A-…md … J-…md          (F-trap-index.md traces every pair id)
```

## Validate

The validator checks JSON validity, id format, enum membership, the two
invariants above, stage/level coverage, matrix density, and that every pair id is
reachable from `GUIDE/annex/F-trap-index.md`.

```
pnpm --filter @workspace/scripts run validate-tutorial-pairs
# or
pnpm tsx scripts/validate-tutorial-pairs.ts
```

A pair added to `pairs/` without a row in `F-trap-index.md` fails the build.

## Consumers

- JSON is the canonical store (`tutorial-data/pairs/*.json`).
- The UI bundle `artifacts/legal-luminaire/src/data/rajasthan-tutorial-pairs.ts`
  mirrors the JSON as a typed `TutorialPair[]` for the app; its shape is pinned
  by `src/data/tutorial-pair-types.ts`.
- `src/pages/TutorialPairsPage.tsx` (`/tutorial-pairs`) renders each pair and its
  worked-example bodies; `src/pages/TutorialPairDraftPage.tsx`
  (`/tutorial-pairs/:id`) hands the intake text to the live engine.
- `src/__tests__/tutorial-pairs.test.ts` re-runs the invariants against the
  bundle, so the app cannot drift from the corpus.

## Known gaps

- `family` and `portal` are declared in the types/schema but no pair uses them.
- Stage × level is sparse at `reply/beginner`, `reply/expert`, `trial/*` and
  `mid-journey/advanced`.
- The `GUIDE/` weeks stop at week 11; the extension set (TP-RJ-25…30) is indexed
  but not yet laid out as its own week.
