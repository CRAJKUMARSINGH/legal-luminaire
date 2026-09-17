**Present App / Project Status Review + Guided Due Tasks**

Based on the full conversation history and all generated packs, here is a clear status of **Legal Luminaire** enrichment work and the concrete next actions. The attached 30-Day Recovery Checklist is treated as the operating model for keeping the growing case library controlled, consistent, and owned.

### 1. Present Status Snapshot (as of now)

| Area | Status | Notes |
|------|--------|-------|
| **Infrastructure Arbitration** | Outline ready | TC-22–26 defined (Building, Road, Dam, Electrical, Landscape). Full document sets not yet expanded. |
| **Serious Criminal** | Strong | TC-27 Murder full pack delivered earlier; TC-28–31 outlined; POCSO (TC-30) reviewed but not fully expanded. |
| **Financial / Economic Crimes** | Outline ready | `grokscam.md` (TC-32–36) |
| **Anti-Corruption / ACB** | Outline ready | `grokacb.md` (TC-37–41) |
| **Cheque Dishonour** | Outline ready | `grokchq.md` (TC-42–46) |
| **Theft / House-breaking** | Outline ready | `groktheft.md` (TC-47–51) |
| **Cheating (420)** | Outline ready | `grok420.md` (TC-52–56) |
| **Defamation / Honour** | Outline ready | `grokpride.md` (TC-57–61) |
| **Land / Title / Mutation** | Outline ready | `grokland.md` (TC-62–66) |
| **Property / Specific Performance** | Outline ready | `grokproperty.md` (TC-67–71) |
| **Complete Civil Master** | Strong outline | `grokcivil.md` (TC-72–86 – 15 categories + exhaustive document list) |
| **Detailed Full Packs** | Delivered | TC-74 Specific Performance (English + Hindi Plaint, Order 39, Arguments, Cross, Judgment, Matrices) + TC-75 Permanent/Temporary Injunction (full parallel set) |

**Overall maturity**
- Documentation coverage is now broad (criminal + civil + infrastructure).
- Only **two** cases have production-grade, copy-paste-ready full document sets (TC-74 & TC-75).
- All other verticals are still at the “compendium / skeleton” stage.
- No evidence yet of actual folder creation inside a live `Sample_cases/` or demo-browser scan path (the sandbox only contains the generated zips and markdowns).
- Marketing / TEST_CASE_MATRIX / browser category filters have been described but not yet updated in any live repo.

This matches the early “regain control” phase of the recovery checklist: many pieces exist, ownership and consistency are not yet enforced, and risk of fragmentation is real if more packs are generated without integration.

### 2. Mapping to the 30-Day Recovery Checklist

**Current position ≈ Day 1–7 (Regain Control) + partial Day 8–14 (Define Target Shape)**

Completed / in good shape:
- High-level module inventory of legal verticals exists (the various `grok*.md` files).
- Clear naming pattern for folders and TC numbers is established.
- Fact-Fit Gate + Standards Matrix pattern is consistent across packs.

Still open (highest priority):
- No single source-of-truth location for all case folders.
- No named owner for each vertical.
- No enforced PR / review / CI rules around adding new case packs.
- Duplication risk (land vs property vs civil master all touch similar documents).
- Demo browser filters and marketing maps not yet synchronized.

### 3. Guided Due Tasks (Immediate + Sequenced)

Apply the recovery rules strictly: **small changes only, one owner per vertical, document every decision, no new packs without integration**.

#### Immediate (next 48 hours) – Regain Control
1. **Freeze further full-set drafting** until the two delivered packs (TC-74, TC-75) are integrated into the real repository.
2. **Name a Recovery / Case-Library Lead** (one person).
3. **Create the physical folder structure** for TC-74 and TC-75 exactly as specified and drop the files from the zip.
4. **Assign owners**:
   - Civil (Specific Performance + Injunction + master) → Owner A
   - Serious Criminal → Owner B
   - Infrastructure Arbitration → Owner C
   - Financial / ACB / Cheque → Owner D
5. **Update the live tracking board** with the four recovery buckets:
   - `broken now` (any case that cannot be scanned by the demo browser)
   - `risky but working` (outlines only)
   - `duplicate/inconsistent` (overlapping land / property / civil documents)
   - `unknown/unowned` (everything without a named owner)

#### Next 7 days – Define Target Shape & Enforce Gates
6. Choose and document the **single target folder layout** (Hemraj-style) and TC numbering scheme as the architecture baseline.
7. Write a one-page “Case Pack Standard” (naming, required matrices, bilingual rule, Fact-Fit Gate mandatory).
8. Update:
   - `MARKETING_SHOWCASE_MAP.md`
   - `TEST_CASE_MATRIX_*.md` (expand to current total)
   - Demo-browser category filters (“Civil – Specific Performance”, “Civil – Injunction”, “Serious Criminal”, “Infrastructure Arbitration”, etc.)
9. Make the first two integrated cases (TC-74, TC-75) the quality gate examples. Any future pack must match their depth and structure.

#### Following 2 weeks – Recover Critical Modules
10. Expand only the **top 3 priority cases** next (recommended order):
    - TC-27 Murder (already partially done – finish bilingual + remaining documents)
    - TC-32 Bank Fraud or TC-37 ACB Trap (highest commercial demo value)
    - TC-62 Title + Mutation or TC-72 Title Declaration
11. For each expanded case: create folder → drop full set → update matrices → mark owner → add to marketing map.
12. After three full packs are live, reopen limited new vertical drafting under the new rules only.

### 4. Exit Criteria for This Recovery Sprint (aligned with checklist)

The case-library part of Legal Luminaire is considered under control when:
- [ ] One architecture baseline and folder standard exists and is documented
- [ ] Every major vertical has a named owner
- [ ] TC-74 and TC-75 are live in the demo browser
- [ ] TEST_CASE_MATRIX and MARKETING_SHOWCASE_MAP are synchronized
- [ ] No new case pack is added without the required matrices + bilingual flagship documents
- [ ] A new contributor can see exactly where a new TC folder belongs and what files it must contain

### 5. Recommended Immediate Reply / Action

Reply with one of these so work stays controlled:

- `Integrate TC-74 and TC-75 now` → I will give you the exact copy-paste commands / folder tree for the live repo
- `Draft next full set: TC-27` (or TC-32 / TC-37 / TC-62)
- `Produce ownership + recovery board template`
- `Update MARKETING_SHOWCASE_MAP and TEST_CASE_MATRIX skeletons`

We stay inside the recovery rules: small, owned, reviewed, documented changes only. No more uncontrolled expansion.