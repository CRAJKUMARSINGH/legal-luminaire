# 📦 LEGAL LUMINAIRE ROBOTIC TEST DOSSIER (BENCHMARK SUITE v2026.1)
Target Repository: https://github.com/CRAJKUMARSINGH/legal-luminaire
Live Application: https://legal-luminaire.netlify.app

## 📋 CATALOGUE OF INPUT ASSETS

| ID | File Location | Document Classification | Key Legal Points / Traps Included | Target Robotic Test Scenario |
|:---|:---|:---|:---|:---|
| **DOC-01** | `01_police_and_criminal/DOC-01_FIR_BNS_Cyber_Fraud.txt` | Police FIR under BNS 2023 & IT Act | Financial fraud (Rs 14.82 Cr), IP logs, BNSS 35(3) notice, timeline events | Chronology Studio date extraction; Grounded Copilot cross-check; Anticipatory Bail drafting |
| **DOC-02** | `02_civil_and_notices/DOC-02_Legal_Notice_NI_Act_138.txt` | S. 138 NI Act Statutory Demand Notice | Rs 85 Lakhs cheque bounce, 15-day cure window, statutory limitation trigger | Reply to Legal Notice; Limitation Act statutory calculator; Defense strategy formulation |
| **DOC-03** | `03_pleadings_and_petitions/DOC-03_Opponent_Commercial_Plaint_Saket.txt` | Commercial Suit Plaint (CPC O.VII R.1) | Trade secret theft, code exfiltration, urgent ex-parte injunction prayer | Written Statement generation; S.12A Commercial Courts Act mediation objection; Counter-claim |
| **DOC-04** | `04_drafts_for_vetting/DOC-04_Flawed_Bail_Petition_For_Vetting.txt` | Unvetted Bail Application with deliberate hallucinations | Hallucinated citation (Rameshwar v. State), misquoted ratio (Vijay Madanlal), 45-day default bail error | **Fact-Fit Gate Adversarial Test**: Verify deterministic blocking of export, tier assignment (`FATAL_ERROR`), and limitation error flagging |
| **DOC-05** | `05_forensic_and_evidence/DOC-05_FSL_Digital_Evidence_Section63BSA.txt` | CFSL Digital Forensic Examination Report | Hash value mismatch (SHA-256), chain of custody breach, defective S.63 BSA certificate | Forensic Standards Explorer (ISO/IEC 27037:2012); S.63 BSA objection motion; Cross-examination question generation |

---

## 🤖 ROBOTIC TEST RUNNER MATRIX
- **Persona 1: Curiosity Explorer (Basic)**: Probes UI, runs broad questions on DOC-01, checks conversational clarity and bilingual English/Hindi output.
- **Persona 2: Drafting Paralegal (Intermediate)**: Feeds DOC-01, DOC-02, and DOC-03; executes petition/reply generation; inspects legal formatting, prayer clauses, and grounds.
- **Persona 3: Appellate Litigator / Adversarial Probe (Advanced)**: Feeds DOC-04 and DOC-05; tests Fact-Fit Gate export blocking, tries citation bypass, runs Limitation Act holiday calculation, and queries Forensic Standards Explorer for ISO/IS clause violations.
