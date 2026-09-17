# Legal Luminaire Case Pack Standard

**Version:** 1.0  
**Last Updated:** 2026-09-15  
**Status:** Active Recovery Standard  
**Quality Gate Reference:** TC-74 (Specific Performance) & TC-75 (Injunction)

---

## Purpose

This standard defines the minimum requirements for all Legal Luminaire case packs to ensure consistency, quality, and integrability across the case library. All new case packs must meet these standards before integration into the demo browser system.

---

## 1. Folder Structure & Naming Convention

### TC Numbering Scheme
- Format: `TC-XX` where XX is a sequential number (01-99)
- TC numbers are unique across the entire case library
- TC numbers are assigned by Recovery Lead to prevent conflicts

### Folder Naming Convention
- Format: `[VERTICAL_ABBREV]_TC-XX_CASE_NAME_YYYY`
- Example: `CIVIL_TC-74_SPECIFIC_PERFORMANCE_2026`
- Year should reflect the case year or template year

### Vertical Abbreviations
- `CIVIL` - Civil Law (includes property, contract, family)
- `CRIM` - Criminal Law (serious offenses)
- `FIN` - Financial/Economic Crimes
- `ACB` - Anti-Corruption Bureau
- `INFRA` - Infrastructure Arbitration
- `CHEQ` - Cheque Dishonour
- `LAND` - Land/Title/Mutation
- `PROP` - Property/Specific Performance

---

## 2. Required Files & Structure

### 2.1 Core Documentation (Mandatory)
```
TC-XX_CASE_NAME_YYYY/
├── 00_CASE_OVERVIEW.md                    # Case summary and context
├── Case_Facts_Timeline.md                 # Chronological facts
├── Standards_Matrix_[Case_Type].md        # Legal standards compliance
├── Evidence_Matrix_Verified_Pending.md    # Evidence verification with Fact-Fit Gate
├── Cross_Reference_Matrix_Detailed.lex    # Document/legal provision cross-references
└── Pre_Filing_Checklist_[Case_Type].md    # Pre-filing requirements checklist
```

### 2.2 Bilingual Flagship Documents (Mandatory)
- **English versions** (primary language)
- **Hindi versions** (secondary language) for flagship documents only

#### Flagship Documents by Case Type

**Civil Cases:**
- `PLAINT_[Case_Type].lex` (English)
- `PLAINT_[Case_Type]_HINDI.lex` (Hindi)
- `WRITTEN_ARGUMENTS_[Party].lex` (English)
- `APPLICATION_ORDER_39_RULE_1_2.lex` (English + Hindi)
- `CIVIL_JUDGMENT_DRAFT.lex` (English)

**Criminal Cases:**
- `FIR_REPORT_[Case_Type].lex` (English)
- `CHARGE_SHEET_[Case_Type].lex` (English)
- `ARGUMENTS_PROSECUTION.lex` (English)
- `ARGUMENTS_DEFENSE.lex` (English)
- `JUDGMENT_DRAFT.lex` (English)

**Arbitration Cases:**
- `ARBITRATION_NOTICE.lex` (English)
- `STATEMENT_OF_CLAIM.lex` (English)
- `COUNTER_CLAIM.lex` (English)
- `ARBITRAL_AWARD_DRAFT.lex` (English)

### 2.3 Supporting Structure (Mandatory)
```
├── INPUT_DATA/                            # Raw input documents
├── OUTPUTS/                               # Generated outputs
├── Attached_Assets/                        # Supporting evidence and documents
├── FAQ/                                   # Case-specific FAQs
└── bibliography/                          # Legal citations and references
```

---

## 3. Content Standards

### 3.1 Case Overview (00_CASE_OVERVIEW.md)
- Case type and vertical classification
- Key legal issues involved
- Applicable laws and sections
- Parties and jurisdiction
- Procedural posture
- Relief sought

### 3.2 Standards Matrix
Must include:
- Applicable legal provisions (Section/Act)
- Compliance status for each provision
- Remarks on interpretation/application
- Fact-Fit Gate integration

### 3.3 Evidence Matrix (Fact-Fit Gate)
Must include:
- Evidence item description
- Source of evidence
- Verification tier (COURT_SAFE, VERIFIED, PENDING, SECONDARY)
- Fact-Fit Score (0-100)
- Allow/Block/Qualified decision
- Remarks and justification

#### Verification Tiers
- **COURT_SAFE**: Primary evidence, court-admissible without controversy
- **VERIFIED**: Secondary evidence with independent verification
- **PENDING**: Evidence requiring additional verification
- **SECONDARY**: Supporting evidence, not primary proof

#### Fact-Fit Score Guidelines
- **90-100**: Court-safe, use without qualification
- **70-89**: Use with caution/qualification
- **50-69**: Qualified use, address weaknesses
- **Below 50**: Block from primary use, address in arguments

### 3.4 Cross-Reference Matrix
Must include:
- Document references with key sections
- Legal provision references with application
- Evidence cross-references with witness/court observations
- Status indicators for each reference

### 3.5 Pre-Filing Checklist
Must include:
- Document verification items
- Legal requirement checks
- Procedural compliance items
- Fact-Fit Gate confirmation
- Bilingual readiness check
- Client approval verification

---

## 4. Bilingual Requirements

### 4.1 Mandatory Bilingual Documents
The following documents MUST have both English and Hindi versions:
- Plaint (Civil cases)
- Order 39 Applications (Civil cases)
- Key interim applications
- Consumer-facing documents

### 4.2 Bilingual Quality Standards
- Hindi versions must be legally accurate, not machine translations
- Legal terminology must use standard Hindi legal terms
- Both versions must be consistent in content and structure
- Format and layout should mirror between versions

### 4.3 Optional Bilingual Documents
- Written arguments (may be English-only for complex legal reasoning)
- Judgment drafts (may be English-only for precedent value)
- Internal working documents

---

## 5. Quality Gates

### 5.1 Fact-Fit Gate (Mandatory)
- All evidence must pass through Fact-Fit Gate scoring
- Evidence below score 50 must be blocked from primary use
- PENDING tier evidence must be resolved before finalization
- COURT_SAFE evidence must constitute majority of key facts

### 5.2 Standards Compliance (Mandatory)
- All applicable legal provisions must be identified
- Compliance status must be assessed for each provision
- Non-compliance must be addressed in legal strategy
- Standards Matrix must be complete before filing

### 5.3 Document Completeness (Mandatory)
- All flagship documents must be present
- All supporting matrices must be complete
- Pre-filing checklist must be fully checked
- Cross-references must be consistent

### 5.4 Integration Readiness (Mandatory)
- Folder structure must follow naming convention
- All files must use standard naming
- Metadata must be complete
- Owner assignment must be confirmed

---

## 6. Review Process

### 6.1 Self-Review (Case Creator)
- Verify all mandatory files are present
- Check Fact-Fit Gate scores
- Validate bilingual document quality
- Ensure naming convention compliance

### 6.2 Vertical Owner Review
- Check against vertical-specific requirements
- Identify duplication risks with other verticals
- Validate legal accuracy and completeness
- Approve or reject with specific feedback

### 6.3 Recovery Lead Review
- Verify compliance with Case Pack Standard
- Check integration readiness
- Assess duplication/consistency issues
- Final approval for demo browser integration

---

## 7. Integration Process

### 7.1 Pre-Integration Checklist
- [ ] All mandatory files present and complete
- [ ] Fact-Fit Gate applied to all evidence
- [ ] Standards Matrix complete
- [ ] Bilingual flagship documents ready
- [ ] Vertical owner approval obtained
- [ ] Recovery Lead approval obtained
- [ ] No duplication conflicts identified
- [ ] Folder structure follows naming convention

### 7.2 Integration Steps
1. Create TC folder in `real_cases/` directory
2. Copy all files maintaining structure
3. Update RECOVERY_TRACKING_BOARD.md
4. Update TEST_CASE_MATRIX
5. Update MARKETING_SHOWCASE_MAP
6. Configure demo browser category filters
7. Test demo browser scanning and display

### 7.3 Post-Integration Verification
- Demo browser successfully scans case
- All documents display correctly
- Category filters work as expected
- Cross-references are functional
- No broken links or missing files

---

## 8. Maintenance & Updates

### 8.1 Version Control
- All case packs must be in git repository
- Significant updates require version bump
- Change log must be maintained in case folder

### 8.2 Quality Assurance
- Annual review of all case packs
- Update legal standards as laws change
- Refresh evidence matrices with new precedents
- Maintain bilingual accuracy

### 8.3 Deprecation Process
- Obsolete cases must be marked in RECOVERY_TRACKING_BOARD.md
- Deprecation reason must be documented
- Alternative cases must be identified
- Demo browser must exclude deprecated cases

---

## 9. Exceptions & Waivers

### 9.1 Exception Process
- Exception requests must be submitted to Recovery Lead
- Must include justification and impact assessment
- Requires vertical owner endorsement
- Temporary exceptions must have review date

### 9.2 Permanent Waivers
- Only granted for fundamental structural changes
- Requires consensus of all vertical owners
- Must update this standard accordingly
- Must document rationale permanently

---

## 10. Compliance Metrics

### 10.1 Success Criteria
A case pack is considered compliant when:
- All mandatory files are present (100%)
- Fact-Fit Gate applied to all evidence (100%)
- Standards Matrix complete (100%)
- Bilingual flagship documents ready (100%)
- Demo browser integration successful (100%)

### 10.2 Quality Metrics
- COURT_SAFE evidence percentage > 70%
- Fact-Fit average score > 75
- Standards compliance > 90%
- Document completeness > 95%

---

## 11. Contact & Support

### Standard Maintenance
- **Standard Owner:** Recovery Lead
- **Review Cycle:** Quarterly
- **Feedback:** Submit via project issue tracker

### Implementation Support
- **Technical Integration:** Contact technical team
- **Legal Accuracy:** Consult vertical owners
- **Process Questions:** Contact Recovery Lead

---

## Appendix A: Quick Reference Checklist

**Before Submitting Case Pack:**
- [ ] Folder name follows convention: `[VERTICAL_ABBREV]_TC-XX_CASE_NAME_YYYY`
- [ ] All 6 core documentation files present
- [ ] Bilingual flagship documents ready (as required)
- [ ] Fact-Fit Gate applied with scores
- [ ] Standards Matrix complete
- [ ] Cross-Reference Matrix complete
- [ ] Pre-Filing Checklist fully checked
- [ ] Supporting folders created (INPUT_DATA, OUTPUTS, etc.)
- [ ] Vertical owner approval obtained
- [ ] No duplication conflicts identified

---

## Appendix B: Document Templates

Templates for each required document type are maintained in:
- `docs/templates/` directory
- Annotated with required sections
- Include example content from TC-74/TC-75
- Updated based on feedback and usage

---

**This standard is effective immediately. All new case packs must comply. Existing case packs should be brought into compliance during the recovery period.**