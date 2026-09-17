# LEGAL LUMINAIRE — ROBOTIC TESTER INPUT PACK (v1.0)
All documents are 100% SYNTHETIC and fictional. No real person, case, FIR, or PII is represented.
Pack ID: LL-TP-001 | Companion to TEST_PLAN.md | Live demo: https://legal-luminaire.netlify.app

## HOW THIS PACK WORKS
1. Every document below has a unique Document ID. Test cases in TEST_PLAN.md reference these IDs —
   never substitute your own documents.
2. Each document ends with a "KEY TEST ANCHORS" block: these are the exact dates, names, and
   citations the app MUST extract or catch. If the app gets an anchor wrong, file a bug.
3. Persona key: P1 = layperson (basic legal knowledge) | P2 = junior advocate/paralegal |
   P3 = senior counsel. The "Primary personas" column tells you who should run tests with that file.

## DOCUMENT INDEX

| # | Document ID | File | What it is | Feeds test-plan sections | Primary personas |
|---|---|---|---|---|---|
| 01 | FIR-001 | 01_FIR/FIR_001_StadiumCollapse_FIR_excerpt.txt | Synthetic FIR excerpt (stadium collapse, State v. Hemraj demo case). Two-accused party extraction + date traps. | 4.2 Ingest, 4.6 Chronology, 4.8 New draft (Intent #5) | P1, P2 |
| 02 | NOTICE-001 | 02_LEGAL_NOTICE/NOTICE_001_Recovery_Demand.txt | Synthetic legal notice: indemnity demand, Rs. 85 lakh, 15-day window. Trigger date 01.04.2026. | 4.2 Ingest, 4.5 Limitation, 4.8 Draft reply (Intent #2) | P1, P2 |
| 03 | OPPPET-001 | 03_OPPONENT_PETITION/OPPPET_001_BailOpposition_with_citations.txt | Opponent's bail-opposition reply with 3 real-format citations + embedded dates. Citation-tier oracle input. | 4.3 Copilot, 4.4 Fact-Fit Gate, 4.8 Vetting/citation search (Intents #5, #6) | P2, P3 |
| 04 | TRAP-001 | 04_TRAP_DRAFT/TRAPDRAFT_001_WrittenStatement_flawed.txt | THE TRAP DOCUMENT: written statement containing (1) a fabricated citation, (2) a weak limitation argument with a WRONG trigger date, (3) a missing limitation computation. | 4.4 Gate, 4.8 Vet (Intent #3), Enrich (Intent #4), 4.5 Limitation | P2, P3 |
| 05 | PII-001/002/003 | 05_PII_TEST/PII_001_Instructions_and_Documents.txt | PII redaction suite: English PII checklist, Hindi-embedded PII (PII-002), footnote-hidden PII (PII-003). Includes known-limitation note for scanned PDFs (roadmap gap, not a bug). | 4.2 Redaction, 4.11 Robustness, Section 6 PII leak vectors | P1, P2 |
| 06 | HIN-001 | 06_HINDI_INPUT/HIN_001_Copilot_test_inputs.txt | 5 scripted Copilot questions (Q1–Q5) in Hindi/Hinglish with expected behaviors, + translation spot-check string list for section 4.10. | 4.3 Copilot, 4.10 Bilingual | P1, P2, P3 |
| 07 | LIM-001 | 07_LIMITATION_SCENARIOS/LIM_001_Computation_test_cases.txt | Hand-computed limitation ORACLES (L1–L5): expected dates the engine must match. Any mismatch = CRITICAL. | 4.5 Limitation Engine, Deadline Board, Section 6 wrong-date sabotage | P2, P3 |
| 08 | ADV-001 | 08_ADVERSARIAL_PROMPTS/ADV_001_Copilot_attack_scripts.txt | 8 verbatim adversarial attack scripts (A1–A8): hallucination traps, PII exfiltration attempt, 6-step export gate bypass, language pivot. | 4.4 Gate enforcement, Section 6 Adversarial, 4.3 Copilot | P3 (P2 may run A7) |

## QUICK MAP: USER INTENT -> WHICH FILES TO USE
| User intent | Files |
|---|---|
| 1. Curiosity / exploration | FIR-001 (browse demo case demo-1), ADV-001 A6 |
| 2. Draft reply to plea/notice | NOTICE-001 + OPPPET-001 |
| 3. Vet own draft | TRAP-001 + OPPPET-001 |
| 4. Enrich own draft | TRAP-001 + LIM-001 |
| 5. New draft from FIR/notice/opponent petition | FIR-001 + NOTICE-001 + OPPPET-001 |
| 6. Citation search / verification | OPPPET-001 (3 citations) + TRAP-001 (1 fake) |

## KNOWN LIMITATIONS — DO NOT LOG AS BUGS (log as roadmap gaps)
- Scanned image PDFs with no text layer: no PII detection / no text extraction (OCR is roadmap).
- Features behind flags (Citation Graph, Judge Analytics, Case Similarity, Chamber Mode) are
  roadmap items; absence is expected.
- Backend-dependent behavior (Copilot streaming/RAG) without ANTHROPIC_API_KEY: record observed
  behavior only.
