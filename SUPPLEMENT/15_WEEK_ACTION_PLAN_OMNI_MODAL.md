# 15-Week Action Plan: Omni-Modal Intelligence for Nascent Advocates (New Case Docs)

To make Legal Luminaire exceptionally versatile and resourceful for a "nascent advocate" (a newcomer or junior lawyer), we must eliminate the manual data entry bottleneck. 

By allowing them to upload raw artifacts (smartphone photos of FIRs, scanned PDF contracts, or scattered text), the system will act as a **Virtual Senior Advocate**—automatically reading, structuring, and instantiating a brand new digital case file from scratch.

---

## Phase 1: New Case Ingestion & Foundation (Weeks 1 - 4)
*Focus: Building the pipeline to securely accept raw files and automatically instantiate a brand new Digital Case File.*

### Week 1: Persistent Case Creation & Security [DONE]
- Migrate current `localStorage` state to PostgreSQL (via Drizzle ORM).
- Establish backend endpoints to generate new `caseInfo` objects automatically from raw inputs, ditching hardcoded data.
- Establish secure AWS S3 / Cloudflare R2 buckets for storing raw uploaded PDFs and Images.

### Week 2: PDF Parsing Engine [DONE]
- Integrate `pdf.js` or a server-side parser (e.g., `pdf2json`) to extract raw text and metadata from digital PDFs.
- Build a robust chunking algorithm to handle large, 100+ page case files without crashing the browser or hitting API limits.

### Week 3: Image OCR & Handwritten Text Recognition (HTR) [DONE]
- Integrate OCR capabilities (e.g., Google Cloud Vision API or AWS Textract) to read smartphone images and scanned (non-digital) PDFs.
- Support reading basic handwritten notes often found in margin notes or police panchnamas.

### Week 4: Omni-Modal Upload UI & Dropzone [DONE]
- Build the "Intelligent Dropzone" UI on the dashboard exclusively for **New Case Creation**.
- Support multi-file, drag-and-drop ingestion with live progress bars, processing states, and preview thumbnails for images/PDFs.

---

## Phase 2: Automated Legal Intelligence for New Cases (Weeks 5 - 9)
*Focus: Turning isolated pages from a new case into a structured legal strategy for junior lawyers.*

### Week 5: Document Classification & PII Redaction [DONE]
- Train the AI to auto-classify the upload for the newly created case board: Is this an FIR, a Bail Order, an NDPS Seizure Memo, or a Civil Contract?
- Implement auto-redaction (masking client names/Aadhar numbers) before sending the text to the deep-reasoning LLM.

### Week 6: "Nascent Advocate" Fact Extractor & Timeline Builder [DONE]
- Build an AI middleware that reads the extracted text and automatically populates the `Incident Type`, `Evidence Type`, and `Jurisdiction` fields used in your Case Data.
- Automatically generate a chronological event timeline from scattered text dates.

### Week 7: Legal Issue Spotting Engine [DONE]
- When an FIR or Police Report is uploaded, the AI automatically cross-references the IPC/BNS sections mentioned and highlights procedural defects (e.g., "Notice: Seizure memo lacks independent witness signatures").

### Week 8: The Explanation Layer (Tutorial Mode) [DONE]
- Add "Why does this matter?" tooltips for nascent advocates. If the AI flags a procedural defect, hovering over it will quote the relevant Supreme Court precedent explaining *why* the defect is legally actionable, actively training the junior.

### Week 9: Human-in-the-Loop Review UI [DONE]
- Create a split-screen UI: Original PDF/Image on the left, Extracted AI text/Timeline on the right.
- Allow the advocate to manually correct the AI, add missing dates, and approve the structure before the official Case Dashboard is launched.

---

## Phase 3: Drafting & Integration (Weeks 10 - 13)
*Focus: Completing the workflow from raw file to finished courtroom draft.*

### Week 10: Auto-Query Legal Research Engine [DONE]
- Connect the extracted facts directly to the AI Research Engine. 
- The system will immediately fetch the Top 5 highly relevant precedents based purely on the uploaded image or text.

### Week 11: One-Click Initial Draft Generation [DONE]
- Based on the classified document (e.g., FIR image), present a 1-click button: "Generate §439 Bail Application" or "Generate §250 Discharge Application."
- The Drafter auto-populates the specific dates, accused names, and jurisdictions extracted in Phase 2.

### Week 12: Advanced Safety Enforcement [DONE]
- Trigger the Citation Verification pipeline to ensure that no AI hallucinations were injected during the drafting of the specific facts.
- Block the final `.lex` or `.pdf` output if the draft relies on a fabricated precedent.

### Week 13: Court-Specific Formatting [DONE]
- Apply strict formatting rules depending on the state/jurisdiction extracted from the document. (e.g., Rajasthan High Court bolding conventions vs. Supreme Court margin rules).

---

## Phase 4: Chamber Workflow & Launch (Weeks 14 - 15)
*Focus: Making the app collaborative and production-ready.*

### Week 14: Multi-Lawyer Auth (Junior → Senior Review) [DONE]
- Implement role-based access. The nascent advocate uploads the image, the AI builds the new case dashboard and draft, and the Junior "Submits for Chamber Review."
- The Senior Advocate receives a notification, reviews the split-screen view, and approves the final draft.

### Week 15: Pen-Testing, Load Testing & Beta Launch [DONE]
- Conduct performance tests on massive 500-page PDF uploads to ensure OCR stability.
- Audit the OCR pipeline for regional language support (Hindi/Gujarati FIRs).
- Beta Launch to a hand-selected group of junior advocates.
