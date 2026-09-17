# Legal Luminaire — Sample Input Documents for Robotic Testing

**Version**: 1.0  
**Purpose**: Ready-to-use synthetic input documents for executing the Master Test Plan.  
**All content is 100% synthetic**. No real persons, cases, or PII.  
**Primary Scenario**: Fictional “Hemraj Stadium Gallery Collapse” criminal case (defence side) involving defective masonry mortar and forensic standards error.

---

## Directory Structure & Mapping to Test Suites

| Folder | Document(s) | Primary Test Suites | Recommended Personas | Notes |
|--------|-------------|---------------------|----------------------|-------|
| `01_FIR/` | `FIR_Hemraj_Stadium_Collapse.txt` + `.md` | 4.5 Source-Document → New Draft<br>4.7 Chronology / Limitation<br>4.1 Curiosity | Basic → Advanced | Classic FIR format (BNSS/CrPC style). Contains key dates for timeline extraction. |
| `02_FSL_Report/` | `FSL_Report_Masonry_Mortar_IS_Error.pdf` (text version also) | 4.8 Forensic Standards<br>4.5 New Draft<br>4.6 Citation / Fact-Fit | Intermediate → Advanced | **Contains the classic trap**: incorrectly cites IS 1199:2018 (fresh concrete) instead of IS 2250:1981 (masonry mortar). Perfect for testing Standards Explorer + enrichment. |
| `03_Charge_Sheet/` | `Charge_Sheet_Excerpt_Hemraj.txt` | 4.5 New Draft<br>4.7 Chronology | Intermediate → Advanced | Partial charge-sheet with sections under BNSS / IPC equivalents. |
| `04_Legal_Notice/` | `Show_Cause_Notice_Contractor.txt` | 4.5 New Draft (Reply)<br>4.2 Fresh Drafting (Reply) | Basic → Intermediate | Show-cause style notice useful for reply drafting tests. |
| `05_Opponent_Petition/` | `Prosecution_Complaint_Petition.txt` | 4.5 New Draft (Defence Reply / Discharge)<br>4.3 Vetting | Intermediate → Advanced | Opponent-side pleading. Use for “create defence reply from opponent petition”. |
| `06_User_Drafts/` | `Weak_Discharge_Application_Draft.md`<br>`User_Bail_Application_Draft.txt` | 4.3 Draft Vetting<br>4.4 Draft Enrichment | Basic → Advanced | Intentionally weak / incomplete drafts for the system to critique, score, and enrich. |
| `07_Handwritten_Notes/` | `Client_Handwritten_Notes_Simulated.txt` | 4.5 Ingest + OCR simulation<br>4.9 PII Redaction | Basic → Intermediate | Simulated messy handwritten notes (with some PII-like tokens for redaction testing). |
| `08_Order_Sheets/` | `Sample_Order_Sheet_Dates.txt` | 4.7 Chronology / Deadline Board | Intermediate → Advanced | Pure date-rich order sheet for limitation engine testing. |
| `09_MultiDoc_Pack/` | `README_MultiDoc.md` + copies of key docs | 4.5 Multi-document ingestion<br>Full case workflow | All personas | Drop the entire folder contents (or zip) onto Smart Ingest for end-to-end robotic tests. |

---

## Recommended Robotic Usage Flow

1. **Curiosity / Exploration** → Start with any single document (especially FIR or FSL).
2. **Source → New Draft** → Upload FIR + FSL + Charge Sheet together.
3. **Forensic Standards Trap** → Feed only the FSL Report and ask for discharge application / written submissions focusing on scientific evidence.
4. **Vetting / Enrichment** → Paste or upload a draft from `06_User_Drafts/`.
5. **Reply Drafting** → Use Legal Notice or Opponent Petition as input.
6. **Timeline / Limitation** → Use Order Sheets + FIR dates.
7. **PII / Redaction** → Use Handwritten Notes (contains deliberate fake mobile / Aadhaar-like strings).
8. **Full Case** → Use everything in `09_MultiDoc_Pack/`.

---

## File Formats Provided

- `.txt` / `.md` — Universal, easiest for robotic copy-paste or direct upload.
- One PDF version of the critical FSL Report (for testing PDF ingestion).
- All documents are plain-text friendly so they work even if OCR is limited.

---

## How to Use in Testing

- **Live Demo**: https://legal-luminaire.netlify.app → go to `/new-case-ingest` and drop files.
- **Local**: Same flow after `pnpm dev`.
- For pure text testing: copy content into the Copilot or intake text box.
- Always note the **Expected Trap** (especially the IS standard error) in your test evidence.

---

**Generated for robotic execution of the Legal Luminaire Master Test Plan.**  
All documents are designed to surface accuracy, grounding, Fact-Fit Gate behaviour, and missing-feature gaps.
