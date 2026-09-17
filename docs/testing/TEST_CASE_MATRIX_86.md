# Legal Luminaire - Test Case Matrix (86 Cases)

**Last Updated:** September 15, 2026

## Category-wise Distribution

| Category | Count | Case IDs |
|----------|-------|----------|
| Criminal & Forensic | 8 | TC-01 to TC-08 |
| Civil & Family | 6 | TC-09 to TC-14 |
| Writ & Constitutional | 4 | TC-15 to TC-18 |
| Commercial & Consumer | 3 | TC-19 to TC-21 |
| Infrastructure & Arbitration | 5 | TC-22 to TC-26 |
| Serious Criminal Matters | 5 | TC-27 to TC-31 |
| **Civil Disputes (Complete Suite)** | **15** | **TC-72 to TC-86** |
| Financial Crimes | 2 | FIN-01, FIN-02 |

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

## Civil Disputes Cases (Complete Suite)

| TC ID | Category | Court | Key Legal Issues | Status | Demo Priority |
|-------|----------|--------|------------------|--------|---------------|
| TC-72 | Title + Declaration | Civil Court, Jaipur | Title documents, limitation, adverse possession | Complete | High |
| TC-73 | Possession (Recover) | Civil Court, Udaipur | Section 6 SRA, mesne profits, illegal dispossession | Complete | High |
| TC-74 | Specific Performance | Civil Court, Kota | Section 16 SRA, time essence, readiness & willingness | Complete | **Highest** |
| TC-75 | Permanent + Temporary Injunction | Civil Court, Rajasthan | Order 39 Rules 1 & 2, prima facie case, balance of convenience | Complete | **Highest** |
| TC-76 | Partition (Preliminary + Final) | Civil Court, Jaipur | Metes & bounds, preliminary decree, final decree, accounts | Complete | High |
| TC-77 | Recovery of Money (Civil) | Civil Court, Delhi | Interest calculation, limitation, acknowledgement | Complete | High |
| TC-78 | Partnership Dissolution + Accounts | Civil Court, Udaipur | Partnership Act, goodwill valuation, asset distribution | Complete | Medium |
| TC-79 | Mortgage Redemption/Foreclosure | Civil Court, Rajasthan | Transfer of Property Act, mortgage accounts, foreclosure | Complete | Medium |
| TC-80 | Landlord-Tenant/Eviction | Civil Court, Kota | Rent control/TP Act, bona-fide need, arrears | Complete | High |
| TC-81 | Builder-Buyer/RERA Hybrid | Civil Court/RERA/Consumer | RERA + civil specific performance, delayed possession | Complete | High |
| TC-82 | Succession/Probate/Letters of Administration | Civil Court, Delhi | Indian Succession Act, will challenge, caveatable interest | Complete | Medium |
| TC-83 | Tort/Damages (Negligence/Nuisance) | Civil Court, Rajasthan | Negligence, quantum assessment, permanent injunction | Complete | Medium |
| TC-84 | Declaration + Permanent Injunction (Easement) | Civil Court, Udaipur | Easements Act, prescription, right of way, light and air | Complete | Medium |
| TC-85 | Consumer Dispute (Goods/Services) | Consumer Forum, District Commission | Consumer Protection Act, deficiency of service, compensation | Complete | High |
| TC-86 | Hybrid Civil + Criminal Overlay | Civil Court + Sessions Court | Stay of civil/criminal, concurrent findings, CBT FIR | Complete | High |

### Testing Checklist for Civil Cases
- [x] Demo Mode loads full case without API key
- [x] Evidence Matrix shows Fact-Fit Gate (Verified/Secondary/Pending/Fatal Error)
- [x] Timeline + Contradiction Radar works
- [x] Hindi + English document generation
- [x] PDF output with watermark in Demo Mode
- [x] Standards Matrix (CPC, Limitation Act, SRA, TP Act, Evidence Act) displays correctly
- [x] Plaint generation with proper valuation and court fee
- [x] Temporary injunction under Order 39 Rules 1 & 2 generation
- [x] Written arguments (plaintiff + defendant) generation
- [x] Cross-reference matrix for document references

**Total Cases Now: 86**
**Infrastructure Arbitration Coverage: Strong**
**Serious Criminal Matters Coverage: Strong**
**Civil Disputes Coverage: Complete**
