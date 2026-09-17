# Legal Luminaire TC Numbering and Folder Structure Baseline

**Version:** 1.0  
**Last Updated:** 2026-09-15  
**Status:** Architecture Baseline (Recovery Standard)  
**Reference Implementation:** TC-74 (Specific Performance) & TC-75 (Injunction)

---

## Purpose

This document establishes the single source-of-truth for TC (Test Case) numbering and folder structure across the entire Legal Luminaire case library. All case packs must follow this baseline to ensure consistency, prevent conflicts, and enable system integration.

---

## 1. TC Numbering System

### 1.1 TC Number Format
- **Format:** `TC-XX` where XX is a two-digit number (01-99)
- **Uniqueness:** Each TC number is unique across the entire library
- **Assignment:** TC numbers are assigned by Recovery Lead to prevent conflicts
- **Permanence:** Once assigned, TC numbers are never reused

### 1.2 TC Number Ranges by Vertical

| Vertical | TC Range | Current Usage | Available |
|----------|----------|---------------|-----------|
| Infrastructure Arbitration | TC-22 to TC-26 | 5 cases allocated | 0 available |
| Serious Criminal | TC-27 to TC-31 | 5 cases allocated | 0 available |
| Financial/Economic Crimes | TC-32 to TC-36 | 5 cases allocated | 0 available |
| Anti-Corruption/ACB | TC-37 to TC-41 | 5 cases allocated | 0 available |
| Cheque Dishonour | TC-42 to TC-46 | 5 cases allocated | 0 available |
| Theft/House-breaking | TC-47 to TC-51 | 5 cases allocated | 0 available |
| Cheating (420) | TC-52 to TC-56 | 5 cases allocated | 0 available |
| Defamation/Honour | TC-57 to TC-61 | 5 cases allocated | 0 available |
| Land/Title/Mutation | TC-62 to TC-66 | 5 cases allocated | 0 available |
| Property/Specific Performance | TC-67 to TC-71 | 5 cases allocated | 0 available |
| Civil Master | TC-72 to TC-86 | 15 cases allocated | 0 available |
| **Future Allocation** | TC-87 to TC-99 | 13 available | 13 available |

### 1.3 TC Assignment Process
1. Vertical owner identifies need for new case pack
2. Vertical owner submits request to Recovery Lead
3. Recovery Lead assigns next available TC number in vertical range
4. TC number is recorded in this document and RECOVERY_TRACKING_BOARD.md
5. Case pack created with assigned TC number

---

## 2. Folder Structure Baseline

### 2.1 Root Directory Structure
```
legal-luminaire/
├── real_cases/                          # Production case library
│   ├── [VERTICAL_ABBREV]_TC-XX_CASE_NAME_YYYY/
│   └── ...
├── sample_cases/                        # Demo/test cases
│   ├── functional/                      # Functional test cases
│   ├── edge/                            # Edge case scenarios
│   ├── marketing/                       # Marketing showcase cases
│   └── showcase/                        # Public showcase cases
└── docs/                                # Documentation
    ├── RECOVERY_TRACKING_BOARD.md
    ├── CASE_LIBRARY_OWNERSHIP.md
    ├── CASE_PACK_STANDARD.md
    ├── TC_NUMBERING_AND_FOLDER_STRUCTURE.md
    └── MARKETING_SHOWCASE_MAP.md
```

### 2.2 Case Folder Structure (Standard)
```
[VERTICAL_ABBREV]_TC-XX_CASE_NAME_YYYY/
├── 00_CASE_OVERVIEW.md                  # Case summary and context
├── Case_Facts_Timeline.md               # Chronological facts
├── Standards_Matrix_[Case_Type].md      # Legal standards compliance
├── Evidence_Matrix_Verified_Pending.md  # Evidence verification (Fact-Fit Gate)
├── Cross_Reference_Matrix_Detailed.lex  # Document/legal provision cross-references
├── Pre_Filing_Checklist_[Case_Type].md  # Pre-filing requirements checklist
│
├── PLAINT_[Case_Type].lex               # English version (flagship)
├── PLAINT_[Case_Type]_HINDI.lex         # Hindi version (flagship)
├── WRITTEN_ARGUMENTS_[Party].lex        # Written arguments
├── APPLICATION_ORDER_39_RULE_1_2.lex   # Interim application (English)
├── APPLICATION_ORDER_39_RULE_1_2_HINDI.lex # Interim application (Hindi)
├── CIVIL_JUDGMENT_DRAFT.lex             # Judgment draft
├── CROSS_EXAMINATION_KEY.lex            # Cross-examination guide
│
├── INPUT_DATA/                          # Raw input documents
│   ├── agreements/
│   ├── notices/
│   ├── evidence/
│   └── correspondences/
├── OUTPUTS/                             # Generated outputs
│   ├── drafts/
│   ├── filings/
│   └── court_documents/
├── Attached_Assets/                     # Supporting evidence
│   ├── documents/
│   ├── images/
│   └── media/
├── FAQ/                                 # Case-specific FAQs
│   ├── legal_questions.md
│   ├── procedural_questions.md
│   └── technical_questions.md
└── bibliography/                        # Legal citations
    ├── cases/
    ├── statutes/
    └── commentaries/
```

### 2.3 Folder Naming Convention

#### Case Folder Format
- **Pattern:** `[VERTICAL_ABBREV]_TC-XX_CASE_NAME_YYYY`
- **Components:**
  - `VERTICAL_ABBREV`: 3-6 letter abbreviation (see Section 2.4)
  - `TC-XX`: Assigned TC number
  - `CASE_NAME`: Descriptive case name (underscores for spaces)
  - `YYYY`: Case year or template year

#### Examples
- `CIVIL_TC-74_SPECIFIC_PERFORMANCE_2026`
- `CRIM_TC-27_MURDER_SESSIONS_2026`
- `INFRA_TC-22_BUILDING_HOSPITAL_2026`
- `FIN_TC-32_BANK_FRAUD_2026`

### 2.4 Vertical Abbreviations (Standard)

| Vertical | Abbreviation | Example |
|----------|--------------|---------|
| Civil Law | CIVIL | CIVIL_TC-74_SPECIFIC_PERFORMANCE_2026 |
| Criminal Law | CRIM | CRIM_TC-27_MURDER_SESSIONS_2026 |
| Financial/Economic Crimes | FIN | FIN_TC-32_BANK_FRAUD_2026 |
| Anti-Corruption/ACB | ACB | ACB_TC-37_TRAP_CASE_2026 |
| Infrastructure Arbitration | INFRA_ARB | INFRA_ARB_TC-22_BUILDING_HOSPITAL_2026 |
| Cheque Dishonour | CHEQ | CHEQ_TC-42_DISHONOUR_2026 |
| Land/Title/Mutation | LAND | LAND_TC-62_TITLE_MUTATION_2026 |
| Property/Specific Performance | PROP | PROP_TC-67_PERFORMANCE_2026 |

---

## 3. File Naming Conventions

### 3.1 Documentation Files
- **Pattern:** `[DESCRIPTIVE_NAME].[ext]`
- **Examples:**
  - `00_CASE_OVERVIEW.md`
  - `Case_Facts_Timeline.md`
  - `Standards_Matrix_Specific_Performance.md`
  - `Evidence_Matrix_Verified_Pending.md`

### 3.2 Legal Document Files
- **Pattern:** `[DOCUMENT_TYPE]_[CASE_TYPE].[ext]`
- **Examples:**
  - `PLAINT_SPECIFIC_PERFORMANCE.lex`
  - `PLAINT_SPECIFIC_PERFORMANCE_HINDI.lex`
  - `APPLICATION_ORDER_39_RULE_1_2.lex`
  - `WRITTEN_ARGUMENTS_PLAINTIFF.lex`

### 3.3 Bilingual Files
- **Pattern:** `[DOCUMENT_TYPE]_[CASE_TYPE]_HINDI.[ext]`
- **Rule:** Hindi versions must include `_HINDI` suffix
- **Examples:**
  - `PLAINT_SPECIFIC_PERFORMANCE_HINDI.lex`
  - `APPLICATION_ORDER_39_RULE_1_2_HINDI.lex`

### 3.4 Supporting Files
- **Pattern:** `[DESCRIPTIVE_NAME].[ext]`
- **Examples:**
  - `CROSS_EXAMINATION_KEY.lex`
  - `CIVIL_JUDGMENT_DRAFT.lex`
  - `Pre_Filing_Checklist_SP.md`

---

## 4. Directory Placement Rules

### 4.1 Production Cases
- **Location:** `real_cases/`
- **Purpose:** Fully integrated, production-ready case packs
- **Criteria:** Meets CASE_PACK_STANDARD.md requirements
- **Status:** Tracked in RECOVERY_TRACKING_BOARD.md

### 4.2 Sample Cases
- **Location:** `sample_cases/`
- **Purpose:** Demo, test, and marketing cases
- **Sub-directories:**
  - `functional/`: Functional test cases
  - `edge/`: Edge case scenarios
  - `marketing/`: Marketing showcase cases
  - `showcase/`: Public showcase cases

### 4.3 Archive Cases
- **Location:** `archive/`
- **Purpose:** Deprecated or obsolete cases
- **Criteria:** Marked as deprecated in RECOVERY_TRACKING_BOARD.md
- **Status:** Not scanned by demo browser

---

## 5. Integration Requirements

### 5.1 Demo Browser Integration
- **Requirement:** Case folders must be in `real_cases/` directory
- **Structure:** Must follow folder structure baseline
- **Metadata:** Must include `00_CASE_OVERVIEW.md` for scanning
- **Category:** Must map to demo browser category filters

### 5.2 Category Mapping
| Vertical | Demo Browser Category | TC Range |
|----------|----------------------|----------|
| Civil Law | Civil – Specific Performance | TC-74 |
| Civil Law | Civil – Injunction | TC-75 |
| Civil Law | Civil – Title Declaration | TC-72 |
| Criminal Law | Serious Criminal – Murder | TC-27 |
| Criminal Law | Serious Criminal – POCSO | TC-30 |
| Financial | Financial – Bank Fraud | TC-32 |
| Infrastructure | Infrastructure Arbitration | TC-22 to TC-26 |

### 5.3 System Integration Points
- **RECOVERY_TRACKING_BOARD.md:** Case status and ownership
- **TEST_CASE_MATRIX:** Comprehensive case listing
- **MARKETING_SHOWCASE_MAP:** Marketing categorization
- **Demo Browser:** Category filters and scanning

---

## 6. Migration Path

### 6.1 Existing Cases
Current cases in `real_cases/` that don't follow the baseline:
- `CASE01_HEMRAJ_STATE_2025` → Should be migrated to `CIVIL_TC-01_HEMRAJ_STATE_2025`
- `CASE02_PITAMBARA_ROOPAM_2026` → Should be migrated to `CIVIL_TC-02_PITAMBARA_ROOPAM_2026`
- Current numbered cases (CIVIL_01, CRIM_01, etc.) → Should be aligned with TC system

### 6.2 Migration Priority
1. TC-74 and TC-75 (already follow baseline partially)
2. High-priority vertical cases (TC-27, TC-32, TC-37)
3. Remaining existing cases
4. Archive non-compliant legacy cases

### 6.3 Migration Process
1. Assign TC numbers from appropriate range
2. Rename folders to baseline convention
3. Restructure internal folders if needed
4. Update all documentation references
5. Test demo browser integration
6. Update tracking documentation

---

## 7. Change Management

### 7.1 Standard Modifications
- **Authority:** Recovery Lead
- **Process:** Proposal → Review → Approval → Implementation
- **Impact Assessment:** Required for any structural changes
- **Communication:** Update all stakeholders on changes

### 7.2 TC Number Changes
- **Policy:** TC numbers are permanent once assigned
- **Exceptions:** Only for data corruption or system errors
- **Process:** Document reason, update all references, communicate changes

### 7.3 Folder Structure Changes
- **Policy:** Structure changes require version bump
- **Impact:** Must assess migration requirements for existing cases
- **Rollback:** Must maintain backward compatibility during transition

---

## 8. Validation & Compliance

### 8.1 Automated Validation
- Folder name pattern validation
- TC number uniqueness check
- Required file presence check
- File naming convention validation

### 8.2 Manual Validation
- Legal accuracy of document names
- Appropriate vertical assignment
- TC range compliance
- Integration readiness assessment

### 8.3 Compliance Checklist
- [ ] Folder name follows baseline convention
- [ ] TC number assigned and unique
- [ ] Vertical abbreviation correct
- [ ] Required folders present
- [ ] Required files present
- [ ] File naming conventions followed
- [ ] Bilingual files properly suffixed
- [ ] Integration metadata complete

---

## 9. Troubleshooting

### 9.1 Common Issues
- **TC Number Conflicts:** Contact Recovery Lead for reassignment
- **Folder Naming Errors:** Use rename command with proper pattern
- **Missing Required Files:** Refer to CASE_PACK_STANDARD.md
- **Integration Failures:** Check structure and metadata

### 9.2 Support Process
1. Consult this documentation
2. Check CASE_PACK_STANDARD.md
3. Review RECOVERY_TRACKING_BOARD.md
4. Contact vertical owner for vertical-specific issues
5. Contact Recovery Lead for structural issues

---

## 10. Future Considerations

### 10.1 Scalability
- Current TC numbering supports 99 cases
- Future expansion may require 3-digit TC numbers
- Consider vertical-based prefixing for larger libraries

### 10.2 Internationalization
- Folder structure currently supports English and Hindi
- Future languages may require additional naming conventions
- Consider language code suffixes for multi-language support

### 10.3 System Integration
- Future integrations may require additional metadata
- Consider standardized metadata files (e.g., `case_metadata.json`)
- Plan for API-based case access and management

---

## Appendix A: Quick Reference

### Folder Creation Command
```bash
# Example: Creating TC-74 Specific Performance case
mkdir -p "real_cases/CIVIL_TC-74_SPECIFIC_PERFORMANCE_2026"
cd "real_cases/CIVIL_TC-74_SPECIFIC_PERFORMANCE_2026"
mkdir -p INPUT_DATA/{agreements,notices,evidence,correspondences}
mkdir -p OUTPUTS/{drafts,filings,court_documents}
mkdir -p Attached_Assets/{documents,images,media}
mkdir -p FAQ
mkdir -p bibliography/{cases,statutes,commentaries}
```

### TC Number Validation
- Check uniqueness in RECOVERY_TRACKING_BOARD.md
- Verify vertical range assignment
- Confirm not in existing use

### Structure Validation
- Verify all required folders present
- Check file naming conventions
- Validate bilingual file suffixes

---

**This baseline is effective immediately. All new case packs must follow this structure. Existing cases should be migrated during the recovery period.**