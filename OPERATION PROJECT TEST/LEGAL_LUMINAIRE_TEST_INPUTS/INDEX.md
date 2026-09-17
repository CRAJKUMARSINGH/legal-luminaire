# LEGAL LUMINAIRE — Robotic Test Input Fixtures

> All content is 100% synthetic. No real persons, FIRs, or PII. Citations marked synthetic are fake and must never be treated as real law.

**Grounded in repo code:**
- Accepted upload types (`src/pages/AIDraftEngine.tsx`, `CaseIntakeAssistant.tsx`): `.pdf .doc .docx .md .txt .lex .jpg .jpeg .png`
- Max upload size: **50 MB** (`backend/api/routes_omni.py` `MAX_FILE_SIZE_MB = 50`) -> `I05` is ~57 MB by design
- Verify endpoint `POST /verify-citations`: binary verified True/False, exact match against `backend/rag/law_db.json`, else `Not found in database. Possible AI Hallucination.` -> real citation strings in `V05`/`V07`/`E04` sampled verbatim from `law_db.json`
- Fact-Fit Gate tiers: `COURT_SAFE / VERIFIED / SECONDARY / PENDING / FATAL_ERROR`; export disabled until every citation passes (README claim -> adversarial pack)

## Fixture Index

| File | Folder | Type | Size | Test Case | Expected Result | Notes |
|---|---|---|---|---|---|---|
| V01-Plea-Petition-Facts.md | `00_valid` | MD | 0.9 KB | TC-J2-001 | PASS | J2 draft plea: facts-only input for AI draft engine / safe-draft. |
| V02-FIR-TextExtract.txt | `00_valid` | TXT | 0.8 KB | TC-J4-001 | PASS | J4 new draft from user document (FIR text). |
| V03-Opponent-Legal-Notice.pdf | `00_valid` | PDF | 2.1 KB | TC-J4-002 | PASS | J4 opponent notice PDF -> reply drafting; also J5 citation-independent. |
| V04-UserDraft-VetMe.docx | `00_valid` | DOCX | 36.1 KB | TC-J3-001 | EXPECT_TIER_MIXED | J3 vet own draft: 1 real + 1 fabricated citation; must flag fake. |
| V05-Precedent-Set.json | `00_valid` | JSON | 0.3 KB | TC-J5-001 | EXPECT_TIER_MIXED | 4 citations verbatim from repo law_db + 1 fabricated. |
| V06-Contract-Breach-Summary.md | `00_valid` | MD | 0.5 KB | TC-J6-001 | PASS | J6 enrichment: feed -> deadlines -> chronology -> draft. |
| V07-Citations-List.txt | `00_valid` | TXT | 0.2 KB | TC-J5-002 | EXPECT_TIER_MIXED | 7 real + 2 fabricated -> robot compares count. |
| V08-Vet-CSV.csv | `00_valid` | CSV | 0.2 KB | TC-J5-003 | EXPECT_TIER_MIXED | CSV ingestion for vetting tooling. |
| V09-Bail-Facts.md | `00_valid` | MD | 0.5 KB | TC-J2-002 | PASS | J2 draft bail application from facts. |
| V10-Bilingual-HI-EN.md | `00_valid` | MD | 0.7 KB | TC-G12-001 | PASS | Bilingual + mixed-script robustness (EN/HI claim). |
| V11-Writ-Petition-Note.md | `00_valid` | MD | 0.6 KB | TC-J4-003 | PASS | J4 draft from notes; J6 enrichment (timeline). |
| I01-Empty.md | `01_invalid` | MD | 0.0 KB | TC-MAL-001 | EXPECT_ERROR | 0-byte file: reject with explicit error, no crash. |
| I02-Corrupt.pdf | `01_invalid` | PDF | 0.5 KB | TC-MAL-002 | EXPECT_ERROR | Truncated/garbage PDF: parser must fail gracefully. |
| I03-TextRenamed.pdf | `01_invalid` | PDF | 0.1 KB | TC-MAL-003 | EXPECT_ERROR_OR_FLAG | MIME spoof (.pdf ext, text content). |
| I04-BinaryGarbage.md | `01_invalid` | MD | 4.0 KB | TC-MAL-004 | EXPECT_ERROR | Random binary in .md — reject/escape, no crash. |
| I05-Oversize-55MB.txt | `01_invalid` | TXT | 56.08 MB | TC-MAL-005 | EXPECT_ERROR_MAX_50MB | >50MB (routes_omni cap) -> 'File too large (Max 50MB)'. |
| I06-PasswordProtected.pdf | `01_invalid` | PDF | 2.7 KB | TC-MAL-006 | EXPECT_ERROR | AES-256 encrypted (pw test123): explicit error. |
| I07-ScannedImageOnly.pdf | `01_invalid` | PDF | 39.2 KB | TC-G6-001 | EXPECT_OCR_GAP | Zero text layer; OCR roadmap-only -> graceful message. |
| I08-HtmlScriptInjection.md | `01_invalid` | MD | 0.3 KB | TC-MAL-007 | EXPECT_SAFE | XSS payload must render inert, never execute. |
| I09-NearEmpty.md | `01_invalid` | MD | 0.0 KB | TC-MAL-008 | EXPECT_WARN_OR_PASS | Near-empty -> warning, no hang, no fabrication. |
| E01-OCR-Noisy-FIR.md | `02_edge` | MD | 0.5 KB | TC-G9-001 | PASS_WITH_TOLERANCE | Intentional OCR noise (1/l, O/0); flag not hallucinate. |
| E02-Contradictory-Dates.md | `02_edge` | MD | 0.4 KB | TC-G8-001 | EXPECT_CONFLICT_FLAG | Limitation engine: conflicting dates surfaced. |
| E03-Unicode-Long-Filename-हिंदी-中文-Ελληνικά-0123456789-very-very-long-filename-to-test-length-limits-and-unicode-normalization-ABCDEFGHIJKLMNOPQRSTUVWXYZ.pdf | `02_edge` | PDF | 1.7 KB | TC-MAL-009 | PASS_OR_COLLISION | Unicode + very long filename: no crash / no path traversal. |
| E04-Citation-Format-Variants.txt | `02_edge` | TXT | 0.5 KB | TC-G3-001 | EXPECT_VARIANTS_FLAGGED | 8 format variants of a real citation + 2 fake. |
| E05-VeryLongDoc-4MB.txt | `02_edge` | TXT | 3.43 MB | TC-G9-002 | PERF_CHECK | 4MB single doc: ingest perf, no hang. |
| E06-Scan-Image.jpg | `02_edge` | JPG | 183.1 KB | TC-G9-003 | PASS_OR_OCR_GAP | JPG accepted type; OCR roadmap. |
| E07-Draft-Mixed-Tiers.md | `02_edge` | MD | 0.5 KB | TC-G11-001 | EXPECT_EXPORT_BLOCKED | Export-block security boundary across all export paths. |
| A01-FakeCitation.md | `03_adversarial` | MD | 0.5 KB | TC-ADV-001 | EXPECT_BLOCKED | Fabricated precedent cannot pass Fact-Fit Gate. |
| A02-PromptInjection-FIR.txt | `03_adversarial` | TXT | 0.5 KB | TC-ADV-002 | EXPECT_INJECTION_NEUTRALIZED | Prompt injection in user doc must not be obeyed. |
| A03-GateBypass-Draft.md | `03_adversarial` | MD | 0.3 KB | TC-ADV-003 | EXPECT_BLOCKED_ALL_PATHS | Export-bypass pack incl. devtools flip. |
| A04-CrossCase-Leak.json | `03_adversarial` | JSON | 0.3 KB | TC-ADV-004 | EXPECT_NO_LEAK | Case-scoped verify endpoint consistency. |
| J01-Simple-Case-Summary.md | `04_journey_inputs` | MD | 0.5 KB | TC-J1-001 | PASS_PLAIN_LANG | Basic journey: plain language, no jargon dead-ends. |
| J05-Vet-One-Paragraph.md | `04_journey_inputs` | MD | 0.4 KB | TC-J3-002 | EXPECT_FLAG_FAKE | Basic vetting: fake citation flagged with plain warning. |

## Robot usage rules
1. Upload order per suite: `00_valid` smoke -> `04_journey_inputs` -> `01_invalid` error paths -> `02_edge` -> `03_adversarial` last.
2. `EXPECT_ERROR*` must produce an explicit human-readable error — a silent hang IS the bug.
3. `EXPECT_BLOCKED*`: try ALL export surfaces (safe-draft, LDR/LPS print, discharge print) plus devtools UI-state flip; each attempt logged as `bypass-attempt-N`.
4. `EXPECT_OCR_GAP`: OCR is roadmap-only — a graceful 'no text extracted' message is correct current behavior (feature-not-added, not regression).
5. Never upload `I05` (~57 MB) to a shared CI worker without quota check.
