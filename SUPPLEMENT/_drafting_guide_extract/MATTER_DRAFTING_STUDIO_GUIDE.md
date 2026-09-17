# Legal Luminaire: Matter-Specific Drafting Studio Guide

## Correct product definition

Legal Luminaire should provide a **matter-specific legal drafting workspace**.

The user selects:

1. A criminal or civil matter type
2. A ready-to-use legal template
3. The drafting language: **Hindi or English**
4. The case material to use as context

The system then prepares an editable draft that is updated for the specific matter. The user remains responsible for reviewing, correcting and approving the final document.

This is not primarily a side-by-side translation tool. A side-by-side comparison view may be added later, but the core workflow is drafting one case in one selected language.

## Recommended feature name

**Matter Drafting Studio**

Suggested navigation:

> Drafting → Matter Drafting Studio

Suggested primary action:

> **Create a Matter-Specific Draft**

## Supported input methods

The user should be able to provide case information through:

- Uploaded case-related images
- Uploaded PDFs
- Pasted text
- Text typed directly into the drafting window
- A combination of the above sources

### Image and PDF handling

Uploaded files should be processed through a clear extraction step:

1. Detect whether the file contains selectable text.
2. Use OCR for scanned images or scanned PDFs.
3. Show the extracted text to the user.
4. Allow the user to correct extraction errors.
5. Preserve the original file as a source reference.
6. Use only approved extracted content in the draft context.

The user should never have to trust invisible OCR or extraction. The extracted text must be reviewable before drafting.

## Core user workflow

### Step 1 — Choose the matter category

Offer clear categories rather than a long undifferentiated template list.

The template picker should show the English and Hindi names together on every card. This keeps the interface understandable for advocates working across both languages.

### Criminal template catalog — 15 templates

| # | English template | हिंदी template |
|---:|---|---|
| 1 | Regular Bail Application | नियमित जमानत आवेदन |
| 2 | Anticipatory Bail Application | अग्रिम जमानत आवेदन |
| 3 | Discharge Application | आरोपमुक्ति आवेदन |
| 4 | Criminal Complaint | आपराधिक शिकायत |
| 5 | Reply to Criminal Complaint | आपराधिक शिकायत का उत्तर |
| 6 | Reply to Show-Cause Notice | कारण बताओ नोटिस का उत्तर |
| 7 | Criminal Written Submissions | आपराधिक मामले में लिखित प्रस्तुतियाँ |
| 8 | Defence Brief | बचाव पक्ष का संक्षिप्त विवरण |
| 9 | Criminal Revision Petition | आपराधिक पुनरीक्षण याचिका |
| 10 | Criminal Appeal | आपराधिक अपील |
| 11 | Application for Exemption from Personal Appearance | व्यक्तिगत उपस्थिति से छूट का आवेदन |
| 12 | Application for Supply of Documents | दस्तावेज उपलब्ध कराने का आवेदन |
| 13 | Application for Recall of Witness | साक्षी को पुनः बुलाने का आवेदन |
| 14 | Application to Modify Bail Conditions | जमानत शर्तों में संशोधन का आवेदन |
| 15 | Negotiable Instruments / Cheque-Bounce Complaint | परक्राम्य लिखत / चेक बाउंस शिकायत |

### Civil and commercial template catalog — 15 templates

| # | English template | हिंदी template |
|---:|---|---|
| 1 | Legal Notice | कानूनी नोटिस |
| 2 | Reply to Legal Notice | कानूनी नोटिस का उत्तर |
| 3 | Plaint / Civil Suit | वादपत्र / दीवानी वाद |
| 4 | Written Statement | लिखित बयान |
| 5 | Replication / Rejoinder | प्रत्युत्तर / प्रतिउत्तर |
| 6 | Interim Injunction Application | अंतरिम निषेधाज्ञा आवेदन |
| 7 | Permanent Injunction Suit | स्थायी निषेधाज्ञा वाद |
| 8 | Declaratory Suit | घोषणा वाद |
| 9 | Specific Performance Suit | विशिष्ट निष्पादन वाद |
| 10 | Money Recovery Suit | धन वसूली वाद |
| 11 | Property or Partition Suit | संपत्ति / विभाजन वाद |
| 12 | Rent and Eviction Proceeding | किराया और बेदखली कार्यवाही |
| 13 | Consumer Complaint | उपभोक्ता शिकायत |
| 14 | Arbitration Notice / Statement of Claim | मध्यस्थता नोटिस / दावा विवरण |
| 15 | Civil Appeal | दीवानी अपील |

## Matter coverage by procedural stage

The 30 templates above should not be treated as 30 isolated documents. The
better design is:

> **Matter family → document stage → language → source material → review**

This allows the same matter to develop through its actual procedural life
without forcing the advocate to start from a blank template each time.

### Common document stages

Show only the stages that make sense for the selected matter family:

| Stage | English label | हिंदी label |
|---:|---|---|
| 1 | Initial application / petition / claim | प्रारंभिक आवेदन / याचिका / दावा |
| 2 | Reply / objection / written statement | उत्तर / आपत्ति / लिखित बयान |
| 3 | Rejoinder / replication | प्रत्युत्तर / प्रतिउत्तर |
| 4 | Supplementary application / affidavit | पूरक आवेदन / शपथपत्र |
| 5 | Evidence or document application | साक्ष्य या दस्तावेज आवेदन |
| 6 | Written submissions | लिखित प्रस्तुतियाँ |
| 7 | Appeal / revision | अपील / पुनरीक्षण |
| 8 | Execution / compliance | निष्पादन / अनुपालन |

### Criminal matter families and stages

| Matter family | Initial document | Reply / objection | Rejoinder or later document |
|---|---|---|---|
| Bail | Bail application / जमानत आवेदन | Prosecution reply / अभियोजन उत्तर | Rejoinder and written submissions / प्रत्युत्तर व लिखित प्रस्तुतियाँ |
| Anticipatory bail | Anticipatory bail application / अग्रिम जमानत आवेदन | State or complainant objection / राज्य या शिकायतकर्ता की आपत्ति | Rejoinder / प्रत्युत्तर |
| Discharge | Discharge application / आरोपमुक्ति आवेदन | Prosecution reply / अभियोजन उत्तर | Rejoinder and written submissions / प्रत्युत्तर व लिखित प्रस्तुतियाँ |
| Quashing | Quashing petition / कार्यवाही निरस्तीकरण याचिका | Counter-affidavit / reply / जवाबी शपथपत्र या उत्तर | Rejoinder / प्रत्युत्तर |
| Criminal complaint | Complaint / आपराधिक शिकायत | Accused response or objection / आरोपी का उत्तर या आपत्ति | Rejoinder or protest response / प्रत्युत्तर |
| Closure report | Protest petition / विरोध याचिका | Investigating agency reply / जांच एजेंसी का उत्तर | Rejoinder / प्रत्युत्तर |
| Show-cause proceeding | Reply to show-cause notice / कारण बताओ नोटिस का उत्तर | Departmental or prosecution response / विभागीय या अभियोजन उत्तर | Rejoinder / प्रत्युत्तर |
| Cheque dishonour | Complaint under negotiable instruments law / परक्राम्य लिखत कानून के अंतर्गत शिकायत | Accused reply or defence / आरोपी का उत्तर या बचाव | Rejoinder or written submissions / प्रत्युत्तर या लिखित प्रस्तुतियाँ |
| Criminal revision | Revision petition / आपराधिक पुनरीक्षण याचिका | Reply or objection / उत्तर या आपत्ति | Rejoinder and written submissions / प्रत्युत्तर व लिखित प्रस्तुतियाँ |
| Criminal appeal | Criminal appeal / आपराधिक अपील | Respondent reply / प्रतिवादी का उत्तर | Rejoinder and written submissions / प्रत्युत्तर व लिखित प्रस्तुतियाँ |
| Personal appearance | Exemption application / उपस्थिति से छूट आवेदन | Prosecution or complainant objection / अभियोजन या शिकायतकर्ता की आपत्ति | Reply to objection / आपत्ति का उत्तर |
| Document supply | Application for documents or inspection / दस्तावेज या निरीक्षण आवेदन | Reply to document application / दस्तावेज आवेदन का उत्तर | Rejoinder / प्रत्युत्तर |
| Witness procedure | Recall-witness application / साक्षी पुनः बुलाने का आवेदन | Objection to recall / पुनः बुलाने पर आपत्ति | Reply to objection / आपत्ति का उत्तर |
| Bail conditions | Modification or relaxation application / जमानत शर्त संशोधन या शिथिलीकरण आवेदन | State or complainant objection / राज्य या शिकायतकर्ता की आपत्ति | Rejoinder / प्रत्युत्तर |
| Final defence | Defence brief or written submissions / बचाव विवरण या लिखित प्रस्तुतियाँ | Prosecution written response / अभियोजन लिखित उत्तर | Rejoinder submissions / प्रत्युत्तर प्रस्तुतियाँ |

### Civil and commercial matter families and stages

| Matter family | Initial document | Reply / objection | Rejoinder or later document |
|---|---|---|---|
| Civil suit | Plaint / वादपत्र | Written statement / लिखित बयान | Replication / प्रतिउत्तर |
| Legal notice | Legal notice / कानूनी नोटिस | Reply to legal notice / कानूनी नोटिस का उत्तर | Rejoinder notice / प्रत्युत्तर नोटिस |
| Interim injunction | Injunction application / निषेधाज्ञा आवेदन | Objection or reply / आपत्ति या उत्तर | Rejoinder / प्रत्युत्तर |
| Declaration | Declaratory suit / घोषणा वाद | Written statement / लिखित बयान | Replication / प्रतिउत्तर |
| Specific performance | Specific-performance suit / विशिष्ट निष्पादन वाद | Defence or objection / बचाव या आपत्ति | Replication / प्रतिउत्तर |
| Money recovery | Recovery suit / धन वसूली वाद | Written statement or set-off / लिखित बयान या समायोजन दावा | Replication / प्रतिउत्तर |
| Property dispute | Property or possession suit / संपत्ति या कब्जा वाद | Written statement / लिखित बयान | Replication and document application / प्रतिउत्तर व दस्तावेज आवेदन |
| Partition | Partition suit / विभाजन वाद | Written statement / लिखित बयान | Replication / प्रतिउत्तर |
| Rent and eviction | Eviction or rent proceeding / बेदखली या किराया कार्यवाही | Reply or written statement / उत्तर या लिखित बयान | Rejoinder / प्रत्युत्तर |
| Consumer dispute | Consumer complaint / उपभोक्ता शिकायत | Written version / लिखित उत्तर | Rejoinder / प्रत्युत्तर |
| Contract dispute | Contract claim or suit / संविदा दावा या वाद | Defence or reply / बचाव या उत्तर | Replication / प्रतिउत्तर |
| Arbitration | Notice or statement of claim / नोटिस या दावा विवरण | Statement of defence / बचाव विवरण | Rejoinder and counterclaim reply / प्रत्युत्तर व प्रतिदावा उत्तर |
| Commercial dispute | Pre-institution notice or claim / पूर्व-संस्थागत नोटिस या दावा | Defence or reply / बचाव या उत्तर | Replication / प्रतिउत्तर |
| Civil appeal | Civil appeal / दीवानी अपील | Respondent reply / प्रतिवादी का उत्तर | Rejoinder and written submissions / प्रत्युत्तर व लिखित प्रस्तुतियाँ |
| Execution | Execution application / निष्पादन आवेदन | Objection to execution / निष्पादन पर आपत्ति | Reply to objection / आपत्ति का उत्तर |

This structure covers the normal progression from initiating document to
response, rejoinder and final submissions, while still allowing matter-specific
templates for evidence, documents, appeals and execution.

These are template families, not universal legal forms. Each template must be reviewed for the relevant court, jurisdiction, statute and procedural rules before being presented as ready for filing.

The first release should launch with a smaller verified set:

- Regular Bail Application / नियमित जमानत आवेदन
- Discharge Application / आरोपमुक्ति आवेदन
- Legal Notice / कानूनी नोटिस
- Reply to Legal Notice / कानूनी नोटिस का उत्तर
- Written Statement / लिखित बयान

Expand the catalog after advocates test the first five workflows.

### Step 2 — Select the drafting language

Provide three clear output choices:

- **English**
- **हिंदी**
- **Bilingual paired draft — द्विभाषी संयुक्त प्रारूप**

For English or Hindi mode, the selected language controls the draft output, headings, labels and standard explanatory text.

In Bilingual paired mode, generate both language versions from the same approved matter record. The two versions must remain linked section by section and must not be generated as unrelated drafts.

The template card, field labels, help text and review warnings should display English and Hindi together where practical. The user should not need to change the interface language merely to understand a template.

Do not silently translate legal names, citations, section numbers, case numbers or technical standards. Preserve canonical legal references and flag them for review when necessary.

### Step 3 — Add case material

Show four input options:

- `Upload Image`
- `Upload PDF`
- `Paste Text`
- `Type Case Facts`

Allow multiple sources in one matter. Each source should appear in a source list with:

- File or source name
- Source type
- Extraction status
- Review status
- Inclusion or exclusion control

### Step 4 — Review extracted case facts

Before drafting, show a structured review area containing:

- Parties
- Court and jurisdiction
- Case number
- Relevant dates
- Alleged facts
- Procedural history
- Applicable sections
- Documents and evidence
- Relief or prayer requested
- Missing or uncertain information

The user should be able to edit the facts before generation.

### Step 5 — Generate the draft

The drafting engine should:

- Apply the selected template
- Use only the approved matter context
- Preserve source-linked facts
- Identify missing information with placeholders
- Avoid inventing facts, authorities or evidence
- Apply the selected language
- Mark uncertain sections for review

### Step 6 — Review and verify

The generated draft should pass through the existing accuracy workflow:

- Citation verification
- Fact-Fit review
- Names, dates and number consistency
- Source traceability
- Missing-information warnings
- Pre-filing checklist

No draft should be presented as filing-ready merely because it was generated successfully.

### Step 7 — Edit and export

Provide:

- Editable draft window
- Save draft
- Version history
- Print-ready PDF
- Editable document export where supported
- Source and verification summary
- Return to the matter workspace

## Recommended interface

The reference workflow is a strong fit for Legal Luminaire as an interaction model. It presents template cards and grouped fields on the left while updating a print-ready document preview on the right. It also keeps `History`, `Reset`, `Print / PDF` and editable-document export visible.

Use that clarity, but adapt the content to criminal and civil matters.

### Left panel — Matter setup

- Step 1: Matter and template
- Step 2: Language and document details
- Step 3: Source files and extracted facts
- Step 4: Review and verification

### Centre or right panel — Live drafting preview

- Live document preview while the user completes the form
- Editable legal document after generation
- Section navigation
- Placeholder warnings
- Insert or revise section
- Save version

### Accuracy panel

- Source references
- Citation status
- Fact consistency warnings
- Unresolved placeholders
- Pre-filing checklist

On a wide desktop screen, use a **form on the left and document preview on the right**. On smaller screens, stack the form above the preview.

This is clearer than placing two full language editors side by side. The user is drafting one selected-language document while still seeing the source and verification information.

## Interaction patterns to adopt from the reference

### 1. Template cards first

Show a small set of large selectable cards before showing detailed fields. Each card should include:

- Template name
- Criminal or civil category
- One-line purpose
- Typical use

Example:

> **Discharge Application**  
> Criminal · Request for discharge based on case facts and applicable law

Do not expose every template and every field at once.

### 2. Progressive field groups

Reveal fields in short, numbered sections:

1. **Choose template**
2. **Matter details**
3. **Case facts and sources**
4. **Review and draft**

The reference application keeps the form understandable by grouping fields under headings such as template selection, letter details and document-specific details. Legal Luminaire should use the same approach for court, parties, dates, sections, facts, evidence and relief.

### 3. Live preview

As the user enters information, update a document preview immediately.

The preview should show:

- Selected language
- Document heading
- Court and party details
- Subject or relief
- Draft sections
- Visible placeholders for missing information

The preview must never hide uncertainty. Use a clear marker such as:

> `[Information required: date of last hearing]`

### 4. Persistent utility actions

Keep these actions visible at the top:

- `History`
- `Reset`
- `Save draft`
- `Print / PDF`
- `Export editable document`

`Reset` must ask for confirmation before removing entered information. `History` should restore earlier saved versions rather than silently replacing the current draft.

### 5. Focused language output

The reference workflow demonstrates a focused single-document output. Legal Luminaire should provide:

- `English`
- `हिंदी`
- `Bilingual paired draft — द्विभाषी संयुक्त प्रारूप`

English and Hindi mode produce one selected-language document. Bilingual paired mode produces both language versions from the same approved matter record, with linked sections and shared warnings.

Do not make users manage two unrelated editors. If both versions are shown, use a controlled paired preview with:

- English section
- Hindi section
- Shared source and citation status
- One synchronized list of unresolved issues

The user should always know which version is being edited and which content is shared from the canonical matter record.

## Matter-specific update model

The draft should be updated from the user's actual case material, not only from a generic template.

Use this priority order:

1. User-approved typed facts
2. User-approved extracted text
3. Verified structured matter data
4. Template language
5. General drafting guidance

If sources conflict, the system should stop and show a conflict warning instead of choosing silently.

Example warning:

> Two uploaded documents contain different hearing dates. Please confirm the correct date before continuing.

## Three-week implementation plan

### Week 1 — Matter intake and template foundation

**Goal:** Create one reliable drafting path.

- Define the matter and template data model.
- Add criminal and civil category grouping.
- Add language selection for Hindi or English.
- Implement image, PDF, pasted-text and typed-facts inputs.
- Add extraction preview and user correction.
- Start with one criminal template and one civil template.
- Build the basic editable drafting window.
- Keep the feature behind a feature flag.

### Week 2 — Contextual drafting and accuracy

**Goal:** Make generated documents specific to the selected matter.

- Connect approved case facts to the drafting engine.
- Add source-linked facts and section references.
- Add missing-information placeholders.
- Add conflict detection for names, dates, amounts and legal sections.
- Connect Citation Gate and Fact-Fit review.
- Add Hindi and English output rules.
- Add bilingual paired output from the same approved matter record.
- Test with image, PDF, pasted-text and manually typed inputs.
- Test both clean and poor-quality OCR.

### Week 3 — Review, export and controlled release

**Goal:** Make the workflow safe and usable for daily legal work.

- Add version history.
- Add pre-filing checklist integration.
- Add PDF and editable-document export.
- Add source and verification summary.
- Add two or three additional criminal and civil templates.
- Test long documents and mixed Hindi-English source material.
- Add one Accuracy Academy exercise using an intentionally incomplete case.
- Capture screenshots for the showcase.
- Release to a small group of advocate reviewers before wider rollout.

## Recommended first release

Do not build every template at once.

Start with:

### Criminal

**Discharge Application**

### Civil

**Reply to Legal Notice**

These two templates cover different drafting structures and will test whether the system can handle both factual pleadings and formal correspondence.

After advocate feedback, add bail applications, written submissions, rejoinders and other daily-use documents.

## Accuracy and safety rules

- Never invent missing case facts.
- Never silently resolve conflicting source information.
- Never hide OCR uncertainty.
- Never treat an uploaded image as verified merely because text was extracted.
- Preserve names, dates, amounts, case numbers and legal sections exactly unless the user confirms a correction.
- Keep every generated factual assertion traceable to a user-approved source.
- Clearly distinguish template text, extracted facts and AI-generated drafting.
- Require human review before export or filing.
- Use synthetic or redacted data for demos.

## Acceptance criteria

The first prototype is ready for advocate feedback when:

- A user can select a criminal or civil matter.
- A user can choose Hindi or English.
- A user can optionally request a bilingual paired draft.
- A user can upload an image or PDF, paste text or type facts.
- Extracted text is visible and editable before generation.
- The selected template is updated with matter-specific facts.
- Missing facts become visible placeholders rather than invented content.
- Conflicting dates, names or amounts produce warnings.
- Citations and authorities pass through the existing verification workflow.
- English and Hindi versions share the same source and citation status.
- The draft remains editable after generation.
- The user can save and export the reviewed document.

## What the reference app contributes

Use the reference application only for interaction ideas such as:

- Clear step-by-step input
- A focused drafting window
- Structured form fields
- Review before generation
- Visible status and export actions

Do not copy its branding, code, text or domain-specific subject matter. Legal Luminaire's domain remains matter-specific criminal and civil legal drafting.

## Showcase wording after implementation

> **Matter Drafting Studio** helps advocates prepare criminal and civil legal documents in Hindi, English or a linked bilingual format from real case context. Users can choose a verified template, upload case-related images or PDFs, paste source text or type facts directly into the workspace. Legal Luminaire extracts and organizes the matter, highlights missing or conflicting information, and produces editable drafts that remain connected to their sources and verification checks.

## Recommended positioning

Present the feature as:

> **Matter-specific legal drafting from documents, images and facts.**

Do not present it as:

- Automatic legal decision-making
- Unreviewed document generation
- A generic translation tool
- A replacement for advocate judgment
- A bank-communication module

The strongest product promise is:

> **Choose the matter. Add the evidence. Draft in Hindi, English or both. Review before filing.**

## References

- Legal Luminaire repository: https://github.com/CRAJKUMARSINGH/legal-luminaire
- Reference interaction pattern: https://pwd-tools-priyanka.netlify.app/bank-communication