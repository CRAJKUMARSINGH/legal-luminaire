# Legal Luminaire - Test Case Matrix (31 Cases)

**Last Updated:** September 15, 2026

## Category-wise Distribution

| Category | Count | Case IDs |
|----------|-------|----------|
| Criminal & Forensic | 8 | TC-01 to TC-08 |
| Civil & Family | 6 | TC-09 to TC-14 |
| Writ & Constitutional | 4 | TC-15 to TC-18 |
| Commercial & Consumer | 3 | TC-19 to TC-21 |
| Infrastructure & Arbitration | 5 | TC-22 to TC-26 |
| **Serious Criminal Matters (New)** | **5** | **TC-27 to TC-31** |

## Infrastructure Arbitration Cases (Full Lifecycle)

| TC ID | Project | Contract Value | Total Claim | Verified Claims | Status | Demo Priority |
|-------|---------|----------------|-------------|------------------|--------|---------------|
| TC-22 | 300-Bed Hospital Building | ₹48.75 Cr | ₹19.84 Cr | 4/6 | Complete | High |
| TC-23 | 45 km National Highway | ₹112.65 Cr | ₹55.30 Cr | 4/6 | Complete + Expanded Claim | **Highest** |
| TC-24 | Medium Irrigation Dam | ₹87.40 Cr | ₹54.85 Cr | 4/5 | Complete | High |
| TC-25 | 220 kV GIS Substation | ₹68.25 Cr | ₹30.45 Cr | 4/5 | Complete + Expanded Claim | High |
| TC-26 | 185 Acres Township Landscape | ₹34.80 Cr | ₹20.75 Cr | 4/6 | Complete | Medium |

### Testing Checklist for Infrastructure Cases
- [x] Demo Mode loads full case without API key
- [x] Claim Matrix shows Fact-Fit Gate (Verified/Secondary/Pending)
- [x] Timeline + Contradiction Radar works
- [x] Hindi + English document generation
- [x] PDF output with watermark in Demo Mode
- [x] Standards Matrix (CPWD/FIDIC/IS codes) displays correctly

## Serious Criminal Matters Cases (Full Lifecycle)

| TC ID | Offence Category | Court | Key Legal Issues | Status | Demo Priority |
|-------|------------------|--------|------------------|--------|---------------|
| TC-27 | Murder (Section 302 BNS) | Sessions Court, Udaipur | Last-seen, dying declaration, FSL chain of custody, discharge | Complete | **Highest** |
| TC-28 | Attempt to Murder (Section 307 BNS) | Sessions Court, Jaipur | Injury certificates, intent vs knowledge, successive bail | Complete | High |
| TC-29 | Rape (Section 376 BNS) | Sessions Court, Delhi | Consent, medical evidence, 164 statement, cross-examination | Complete | High |
| TC-30 | POCSO | Special Court, Kota | Age determination, mandatory reporting, in-camera trial, compensation | Complete | High |
| TC-31 | Murder + Conspiracy (120B, 201 BNS) | Rajasthan High Court | Multiple accused, discharge applications, chain of custody | Complete | High |

### Testing Checklist for Criminal Cases
- [x] Demo Mode loads full case without API key
- [x] Evidence Matrix shows Fact-Fit Gate (Verified/Secondary/Pending/Fatal Error)
- [x] Timeline + Contradiction Radar works
- [x] Hindi + English document generation
- [x] PDF output with watermark in Demo Mode
- [x] Standards Matrix (FSL protocols, medical guidelines, BNSS/CrPC) displays correctly
- [x] Discharge Application under Section 227 BNSS generation
- [x] Bail Application under Section 439 BNSS generation
- [x] Cross-examination transcript extraction
- [x] Written arguments (defence + prosecution) generation

**Total Cases Now: 31**
**Infrastructure Arbitration Coverage: Strong**
**Serious Criminal Matters Coverage: Strong**
