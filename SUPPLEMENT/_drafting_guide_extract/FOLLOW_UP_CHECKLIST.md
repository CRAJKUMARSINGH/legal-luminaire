# Legal Luminaire Matter Drafting Studio
# Immediate-use and follow-up checklist

## Product definition

The feature is a matter-specific drafting workspace for criminal and civil
legal work. It is not a banking module and it is not an unrestricted
translation tool.

The user should be able to:

1. Choose a criminal or civil matter family.
2. Choose the document stage.
3. Choose English, Hindi or a bilingual paired output.
4. Upload images or PDFs, paste text or type facts.
5. Review extracted information.
6. Generate an editable, source-linked draft.
7. Review warnings and citations.
8. Save, export and continue the matter later.

## Immediate implementation order

### Phase 1 — Minimum useful workflow

- [ ] Add `Matter Drafting Studio` under Drafting.
- [ ] Add template cards with English and Hindi names.
- [ ] Add two verified starter templates:
  - [ ] Regular Bail Application / नियमित जमानत आवेदन
  - [ ] Reply to Legal Notice / कानूनी नोटिस का उत्तर
- [ ] Add document-stage selection:
  - [ ] Initial application or pleading
  - [ ] Reply or objection
  - [ ] Rejoinder or replication
- [ ] Add language selection:
  - [ ] English
  - [ ] हिंदी
  - [ ] Bilingual paired draft
- [ ] Add typed facts input.
- [ ] Add pasted text input.
- [ ] Add PDF upload.
- [ ] Add image upload and OCR preview.
- [ ] Add editable extracted-facts review.
- [ ] Generate an editable draft from approved facts.

### Phase 2 — Accuracy and matter continuity

- [ ] Add source list with inclusion and exclusion controls.
- [ ] Link every generated factual assertion to an approved source.
- [ ] Detect conflicting names, dates, amounts and section numbers.
- [ ] Display missing information as visible placeholders.
- [ ] Connect the Citation Gate.
- [ ] Connect the Fact-Fit review.
- [ ] Add pre-filing checklist items.
- [ ] Add version history.
- [ ] Add save-and-resume matter state.

### Phase 3 — Daily-use expansion

- [ ] Add the remaining criminal matter families.
- [ ] Add the remaining civil and commercial matter families.
- [ ] Add supplementary applications and affidavits.
- [ ] Add evidence and document applications.
- [ ] Add written submissions.
- [ ] Add appeal, revision and execution workflows where applicable.
- [ ] Add PDF export.
- [ ] Add editable-document export.
- [ ] Add a source and verification summary with every export.

## Starter validation set

Use synthetic or fully redacted matters only.

### Criminal

- [ ] Regular Bail Application
- [ ] Discharge Application
- [ ] Reply to Show-Cause Notice

### Civil and commercial

- [ ] Reply to Legal Notice
- [ ] Written Statement
- [ ] Interim Injunction Application

### Input coverage

- [ ] Clean text PDF
- [ ] Scanned PDF
- [ ] Photograph of a document
- [ ] Pasted case facts
- [ ] Manually typed facts
- [ ] Mixed Hindi-English source material
- [ ] Conflicting dates in two sources
- [ ] Missing party name
- [ ] Unclear OCR amount

## Advocate review script

Ask each reviewer to complete one matter without assistance.

1. Select a matter family.
2. Select initial application, reply or rejoinder.
3. Choose English, Hindi or bilingual paired output.
4. Add the case source.
5. Correct extracted facts.
6. Generate the draft.
7. Find the warnings.
8. Edit one section.
9. Save a version.
10. Export the reviewed draft.

Record:

- [ ] Could the reviewer find the correct template?
- [ ] Were English and Hindi labels understandable?
- [ ] Was the document stage obvious?
- [ ] Did the reviewer trust the extracted text too quickly?
- [ ] Were missing facts visible?
- [ ] Were conflicting facts understandable?
- [ ] Did the reviewer understand the citation status?
- [ ] Could the reviewer return to an earlier version?
- [ ] Was the export clearly marked as requiring professional review?

## Release acceptance criteria

Do not call the feature ready for filing or production use until:

- [ ] No missing fact is silently invented.
- [ ] No conflicting source is silently resolved.
- [ ] OCR text is reviewable before generation.
- [ ] The selected language is visible throughout the workflow.
- [ ] Bilingual output uses one shared matter record.
- [ ] Names, dates, amounts and legal sections are checked.
- [ ] Citation status is visible before export.
- [ ] The generated document remains editable.
- [ ] Original source files are preserved.
- [ ] Demo data contains no real client information.
- [ ] An advocate has reviewed each starter workflow.

## Showcase update after implementation

Only update the public showcase after the feature works in the live application.

Suggested feature text:

> **Matter Drafting Studio** helps advocates prepare criminal and civil legal documents in Hindi, English or a linked bilingual format. Users choose a matter family and document stage, upload images or PDFs, paste source text or type facts, review the extracted information and generate an editable draft connected to its sources and verification checks.

Do not claim:

- Automatic legal correctness
- Filing readiness without advocate review
- Complete coverage of every Indian court or procedure
- Verified OCR without user confirmation
- Production maturity before testing

## Follow-up questions for advocates

1. Which three document types do you prepare most often?
2. Which document stage causes the most rework: initial draft, reply or rejoinder?
3. Which facts are most often lost during drafting?
4. Which Hindi legal terms need a preferred glossary?
5. Which source documents are most commonly scanned or photographed?
6. What must be visible before you would trust an AI-assisted draft?

## Working rule

> Choose the matter. Choose the stage. Add the evidence. Draft in Hindi, English or both. Review before filing.