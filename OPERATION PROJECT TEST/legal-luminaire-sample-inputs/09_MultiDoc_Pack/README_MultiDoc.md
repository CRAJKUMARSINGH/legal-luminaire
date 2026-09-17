# Multi-Document Pack for End-to-End Robotic Testing

This folder is intended to be dropped as a set (or individually) onto the **Smart Document Ingest** (`/new-case-ingest`) page of Legal Luminaire.

**Recommended contents to include in a single test run:**

1. `../01_FIR/FIR_Hemraj_Stadium_Collapse.txt` (or .md)
2. `../02_FSL_Report/FSL_Report_Masonry_Mortar_IS_Error.txt`
3. `../03_Charge_Sheet/Charge_Sheet_Excerpt_Hemraj.txt`
4. `../05_Opponent_Petition/Prosecution_Complaint_Petition.txt`
5. `../08_Order_Sheets/Sample_Order_Sheet_Dates.txt`
6. Optional: `../07_Handwritten_Notes/Client_Handwritten_Notes_Simulated.txt` (for PII redaction test)

**Expected robotic test outcomes:**
- Case auto-classified as criminal negligence / structural failure defence
- Timeline / Chronology Studio populates with the key dates above
- FSL report triggers Forensic Standards flag (wrong IS code)
- Copilot can answer grounded questions about the case without inventing facts
- Discharge application / written submissions can be generated with correct standard citation
- Fact-Fit Gate blocks any unverified or PENDING citations
- Deadline Board shows relevant limitation windows

**Folder naming suggestion for the app:**
`CASE01_HEMRAJ_STADIUM_COLLAPSE_2025`

All documents remain synthetic.