/**
 * Infrastructure Arbitration Demo Cases — TC-22 to TC-26
 * Full document bundles (lex/md) live under repo `real_cases/INFRA_ARB_*` folders.
 * Full lifecycle: Work Order → Disputes → Notices → Standing Committee
 * → Arbitration → Award → Execution
 *
 * Integrated with Artemis-II Accuracy Rules:
 * - All claims carry Fact-Fit Gate scores
 * - VERIFIED / SECONDARY / PENDING status per accuracy-rules.md
 * - PENDING claims blockedFromDraft: true
 */

import type { CaseRecord } from "@/lib/case-store";

export const INFRA_ARB_CASES: CaseRecord[] = [
  {
    id: "TC-22",
    title: "[DEMO] Hospital Building Arbitration — RMSCL vs Contractor",
    court: "High Court of Rajasthan at Jodhpur (Sec 11 A&C Act)",
    caseNo: "ARB/2026/TC-22",
    brief: "Construction of 300-bed district hospital at Udaipur. Employer (RMSCL) delayed site handover by 45 days, issued 3 variation orders without pricing, and failed to pay 3 RA bills for 4-7 months. Contractor claims ₹19.84 Cr. Termination declared illegal.",
    createdAt: "2026-02-10T00:00:00.000Z",
    files: [
      { name: "CLAIM_TC22_HOSPITAL_FULL.txt", size: 28, type: "claim-statement" },
      { name: "CLAIM_TC22_HOSPITAL_HINDI.txt", size: 32, type: "claim-statement-hindi" },
      { name: "AWARD_TC22_HOSPITAL.txt", size: 12, type: "arbitral-award" },
      { name: "CROSS_REF_MATRIX_TC22_HOSPITAL.txt", size: 18, type: "cross-reference-matrix" },
      { name: "Work_Order_RMSCL_2024_25_Works_4782_05May2024.pdf", size: 185, type: "annexure", annexure: "1" },
      { name: "Possession_Certificate_20May2024_45Day_Delay.pdf", size: 95, type: "annexure", annexure: "2" },
      { name: "Variation_Order_1_OT_Slab_01Nov2024.pdf", size: 120, type: "annexure", annexure: "3" },
      { name: "Variation_Order_2_ICU_Wing_15Dec2024.pdf", size: 135, type: "annexure", annexure: "4" },
      { name: "Variation_Order_3_Generator_Room_01Feb2025.pdf", size: 110, type: "annexure", annexure: "5" },
      { name: "RA_Bills_3_4_5_Pending_4_to_7_Months.pdf", size: 420, type: "annexure", annexure: "6" },
      { name: "EOT_1_Grant_Letter_90_Days.pdf", size: 85, type: "annexure", annexure: "7" },
      { name: "EOT_2_Grant_Letter_120_Days.pdf", size: 90, type: "annexure", annexure: "8" },
      { name: "Standing_Committee_Minutes_08Jan2026_RMSCL.pdf", size: 210, type: "annexure", annexure: "9" },
      { name: "Legal_Notice_12Dec2025_Contractor_to_RMSCL.pdf", size: 155, type: "annexure", annexure: "10" },
      { name: "Termination_Notice_15Jan2026_RMSCL.pdf", size: 140, type: "annexure", annexure: "11" },
      { name: "Joint_Measurement_Books_VO1_VO2_VO3.pdf", size: 380, type: "annexure", annexure: "12" },
    ],
    case_type: "other",
    status: "Arbitration Invoked",
    charges: ["Arbitration & Conciliation Act 1996", "CPWD GCC 2020", "Sec 11(6)"],
    metadata: {
      category: "Infrastructure Arbitration",
      complexity: "High",
      estimatedDuration: "12-18 months",
      requiredResources: ["CPWD GCC 2020", "FIDIC Red Book", "IS 456:2000"],
    },
    caseLaw: [
      {
        case: "M/s. K.N. Sathyapalan v. State of Kerala",
        court: "Supreme Court of India",
        useForDefence: "Employer's delay in site handover entitles contractor to full compensation.",
        status: "SECONDARY",
        action: "Search Indian Kanoon: 'K.N. Sathyapalan State of Kerala Supreme Court' — obtain certified copy + para number from SCC Online before filing.",
        fitScore: 88,
        citation: "Verify on SCC Online",
        holding: "Employer's delay in handing over site entitles contractor to compensation for idle resources.",
      },
      {
        case: "Chennai Metro Rail Ltd. v. M/s. Afcons Infrastructure Ltd.",
        court: "Supreme Court of India",
        useForDefence: "Delay in possession = breach of contract — contractor entitled to compensation.",
        status: "SECONDARY",
        action: "Search Indian Kanoon: 'Chennai Metro Rail Afcons Infrastructure Supreme Court' — obtain certified copy before filing.",
        fitScore: 85,
        citation: "Verify on SCC Online",
        holding: "Delay in handing over possession of site constitutes breach of contract entitling contractor to damages.",
      },
      {
        case: "RSMML v. Contractor — Force Majeure Cannot Be Invoked Selectively",
        court: "Rajasthan High Court — Division Bench",
        useForDefence: "Contractor cannot be penalised for delays that the State's own records acknowledged as employer default.",
        status: "VERIFIED",
        action: "Obtain certified copy from Rajasthan HC registry — PinkCityPost report 30 March 2026 confirms existence.",
        fitScore: 85,
        citation: "Rajasthan HC Division Bench, 30 March 2026",
        holding: "A contractor cannot be penalised for delays that the State's own note-sheets acknowledged as force majeure/employer default.",
      },
    ],
    timeline: [
      { id: 1, title: "Work Order Issued", description: "₹48.75 Cr, 18 months", status: "completed", date: "2024-05-05" },
      { id: 2, title: "Site Handover Delayed (45 days)", description: "Scheduled 05.05.2024 → Actual 20.05.2024", status: "completed", date: "2024-05-20", note: "EMPLOYER DEFAULT — 45 days delay" },
      { id: 3, title: "Variation Orders Issued (3 nos.)", description: "OT slab + ICU wing + Generator room — ₹6.15 Cr", status: "completed", date: "2024-11-01" },
      { id: 4, title: "RA Bills 3-5 Unpaid (4-7 months)", description: "₹8.45 Cr pending", status: "completed", date: "2025-01-01", note: "EMPLOYER DEFAULT — payment delay" },
      { id: 5, title: "Termination Notice", description: "RMSCL terminates for slow progress", status: "completed", date: "2026-01-15", note: "ILLEGAL — 2 valid EOTs in force" },
      { id: 6, title: "Arbitration Invoked", description: "Sec 11(6) application filed", status: "completed", date: "2026-02-10" },
    ],
    strategy: [
      { id: "s1", title: "Site Handover Delay", description: "45-day delay by RMSCL — GCC Clause 5 violated. Full compensation ₹4.82 Cr.", status: "active", priority: "high" },
      { id: "s2", title: "Variation Orders Unpaid", description: "3 VOs issued in writing — ₹6.15 Cr due. Joint measurements confirm execution.", status: "active", priority: "high" },
      { id: "s3", title: "Termination Illegal", description: "2 valid EOTs in force. Employer cannot terminate for delay caused by own defaults.", status: "active", priority: "high" },
      { id: "s4", title: "Payment Delays", description: "RA Bills 3-5 pending 4-7 months — GCC Clause 7 violated.", status: "active", priority: "medium" },
    ],
    standards: [
      { code: "CPWD GCC 2020 Cl. 5", title: "Site Possession", applicability: "correct", keyClause: "Site to be handed over within 15 days of Work Order", violation: "45-day delay by RMSCL", sourceUrl: "https://cpwd.gov.in", confidence: "VERIFIED" },
      { code: "CPWD GCC 2020 Cl. 10CC", title: "Price Escalation", applicability: "correct", keyClause: "WPI-based escalation for extended contract period", violation: "Not paid despite extended period", sourceUrl: "https://cpwd.gov.in", confidence: "VERIFIED" },
      { code: "CPWD GCC 2020 Cl. 12", title: "Variations", applicability: "correct", keyClause: "Variations to be priced before execution", violation: "3 VOs issued without prior pricing", sourceUrl: "https://cpwd.gov.in", confidence: "VERIFIED" },
    ],
    collisions: [
      { id: "col1", type: "contradiction", description: "RMSCL Standing Committee minutes acknowledge pending RA bills (admission of liability) while simultaneously recommending termination.", evidence_a: "Standing Committee Minutes 08.01.2026", evidence_b: "Termination Notice 15.01.2026", severity: "high" },
      { id: "col2", type: "contradiction", description: "RMSCL claims slow progress but fails to mention its own 45-day site handover delay in termination notice.", evidence_a: "Termination Notice 15.01.2026", evidence_b: "Possession Certificate 20.05.2024", severity: "high" },
    ],
  },

  {
    id: "TC-23",
    title: "[DEMO] NH-758 Highway Arbitration — NHAI vs Contractor",
    court: "High Court of Rajasthan at Jodhpur (Sec 11 A&C Act)",
    caseNo: "ARB/2026/TC-23",
    brief: "Construction of 45 km 2-lane NH-758 extension worth ₹112.65 Cr. NHAI delayed site possession by 78 days (forest clearance + farmer protests). Contractor claims ₹55.30 Cr. NHAI recommended illegal blacklisting. Award: ₹41.65 Cr in contractor's favour.",
    createdAt: "2026-03-05T00:00:00.000Z",
    files: [],
    case_type: "other",
    status: "Award Passed",
    charges: ["Arbitration & Conciliation Act 1996", "FIDIC Red Book 2017", "NHAI GCC 2022"],
    metadata: {
      category: "Infrastructure Arbitration",
      complexity: "Very High",
      estimatedDuration: "18-24 months",
      requiredResources: ["FIDIC Red Book 2017", "NHAI GCC 2022", "MoRTH Specs", "IRC:SP:84-2019"],
    },
    caseLaw: [
      {
        case: "Union of India v. Pramod Kumar",
        court: "Supreme Court of India",
        useForDefence: "Employer's delay in site possession entitles contractor to full compensation including idle machinery and overhead.",
        status: "SECONDARY",
        action: "Search Indian Kanoon: 'Union of India Pramod Kumar site possession contractor' — obtain certified copy + para from SCC Online before filing.",
        fitScore: 90,
        citation: "Verify on SCC Online",
        holding: "Employer's delay in giving possession of site entitles contractor to full compensation for idle resources and overhead.",
      },
      {
        case: "NHAI v. ITD Cementation India Ltd.",
        court: "Delhi High Court",
        useForDefence: "NHAI liable for delay in site possession caused by land acquisition failure — contractor entitled to compensation.",
        status: "SECONDARY",
        action: "Search Delhi HC records: 'NHAI ITD Cementation site possession land acquisition' — obtain certified copy before filing.",
        fitScore: 92,
        citation: "Verify on Delhi HC website",
        holding: "NHAI is liable for delay in site possession where the delay is caused by NHAI's failure to complete land acquisition.",
      },
      {
        case: "Erusian Equipment & Chemicals Ltd. v. State of West Bengal",
        court: "Supreme Court of India",
        useForDefence: "Blacklisting without hearing violates Article 14 — unconstitutional.",
        status: "VERIFIED",
        action: "Cite with full citation: (1975) 1 SCC 70. Well-established SC precedent.",
        fitScore: 85,
        citation: "(1975) 1 SCC 70",
        holding: "Blacklisting of a contractor without giving an opportunity of hearing violates Article 14 of the Constitution.",
      },
      {
        case: "RSMML v. Contractor — Force Majeure Cannot Be Invoked Selectively",
        court: "Rajasthan High Court — Division Bench",
        useForDefence: "Contractor cannot be penalised for delays that the State's own records acknowledged as employer default.",
        status: "VERIFIED",
        action: "Obtain certified copy from Rajasthan HC registry — PinkCityPost report 30 March 2026 confirms existence.",
        fitScore: 85,
        citation: "Rajasthan HC Division Bench, 30 March 2026",
        holding: "A contractor cannot be penalised for delays that the State's own note-sheets acknowledged as force majeure/employer default.",
      },
    ],
    timeline: [
      { id: 1, title: "LOA Issued", description: "₹112.65 Cr, 24 months", status: "completed", date: "2024-06-10" },
      { id: 2, title: "Site Possession Delayed (78 days)", description: "Forest clearance + farmer protests", status: "completed", date: "2024-09-12", note: "EMPLOYER DEFAULT — 78 days delay" },
      { id: 3, title: "Variation Orders (2 nos.)", description: "Retaining wall + extra earthwork — ₹11.40 Cr", status: "completed", date: "2025-01-01" },
      { id: 4, title: "RA Bills 4-6 Unpaid (5-8 months)", description: "₹22.85 Cr pending", status: "completed", date: "2025-04-01", note: "EMPLOYER DEFAULT" },
      { id: 5, title: "Termination + Blacklisting", description: "NHAI terminates and recommends 3-year blacklisting", status: "completed", date: "2026-02-20", note: "ILLEGAL — valid EOT in force" },
      { id: 6, title: "Arbitration Invoked", description: "Sec 11(6) application filed", status: "completed", date: "2026-03-05" },
      { id: 7, title: "Award: ₹41.65 Cr", description: "Tribunal awards ₹41.65 Cr + 8.5% interest. Blacklisting set aside.", status: "completed", date: "2026-12-20" },
    ],
    strategy: [
      { id: "s1", title: "78-Day Possession Delay", description: "NHAI issued LOA knowing forest clearance was pending — FIDIC 2.1 violated. Full compensation ₹14.85 Cr.", status: "active", priority: "high" },
      { id: "s2", title: "Blacklisting Illegal", description: "Blacklisting disproportionate and without due process — set aside by Tribunal.", status: "active", priority: "high" },
      { id: "s3", title: "Variation Orders", description: "2 VOs issued in writing — ₹11.40 Cr due. Joint measurements confirm execution.", status: "active", priority: "high" },
      { id: "s4", title: "FIDIC 20.2 Notice", description: "42 emails constitute adequate notice. NHAI had actual knowledge of delay.", status: "active", priority: "medium" },
    ],
    standards: [
      { code: "FIDIC Sub-Cl. 2.1", title: "Right of Access to Site", applicability: "correct", keyClause: "Employer to give contractor right of access to site within time stated in contract", violation: "78-day delay — forest clearance not obtained before LOA", sourceUrl: "https://fidic.org", confidence: "VERIFIED" },
      { code: "FIDIC Sub-Cl. 8.4", title: "Extension of Time", applicability: "correct", keyClause: "Contractor entitled to EOT for Employer's delays", violation: "EOT granted but LD still levied", sourceUrl: "https://fidic.org", confidence: "VERIFIED" },
      { code: "NHAI GCC 2022 Cl. 10CC", title: "Price Escalation", applicability: "correct", keyClause: "WPI-based escalation for bitumen, steel, cement, labour", violation: "Not paid despite extended period", sourceUrl: "https://nhai.gov.in", confidence: "VERIFIED" },
    ],
    collisions: [
      { id: "col1", type: "contradiction", description: "NHAI claims 'no delay in site possession' but Forest Dept. letters confirm clearance was pending for 78 days after LOA.", evidence_a: "NHAI Termination Notice 20.02.2026", evidence_b: "Forest Dept. Clearance Letter 12.09.2024", severity: "high" },
      { id: "col2", type: "contradiction", description: "NHAI Standing Committee minutes recommend blacklisting but do not mention NHAI's own 78-day possession delay.", evidence_a: "Standing Committee Minutes 12.02.2026", evidence_b: "Possession Certificate 12.09.2024", severity: "high" },
      { id: "col3", type: "contradiction", description: "NHAI claims contractor failed to give FIDIC 20.2 notice but 42 emails on record prove actual knowledge.", evidence_a: "NHAI's Defence", evidence_b: "42 emails 15.06.2024 to 10.09.2024", severity: "medium" },
    ],
  },

  {
    id: "TC-24",
    title: "[DEMO] Banas Dam Arbitration — WRD vs Contractor",
    court: "High Court of Rajasthan at Jodhpur (Sec 11 A&C Act)",
    caseNo: "ARB/2026/TC-24",
    brief: "Construction of medium irrigation dam across River Banas, Rajsamand. Unforeseeable geological conditions (hard rock + swelling clay) not in tender bore logs. IIT Jodhpur expert confirms conditions unforeseeable. Contractor claims ₹54.85 Cr under FIDIC 4.12.",
    createdAt: "2026-03-05T00:00:00.000Z",
    files: [],
    case_type: "other",
    status: "Arbitration Invoked",
    charges: ["Arbitration & Conciliation Act 1996", "FIDIC Red Book 2017", "CPWD GCC 2020"],
    metadata: {
      category: "Infrastructure Arbitration",
      complexity: "Very High",
      estimatedDuration: "18-24 months",
      requiredResources: ["FIDIC Red Book 2017", "IS 6512:1987", "IS 1893:2016", "CPWD Hydraulic Specs"],
    },
    caseLaw: [
      {
        case: "FIDIC Sub-Clause 4.12 — Unforeseeable Physical Conditions",
        court: "International Arbitration Precedent",
        useForDefence: "Contractor entitled to compensation for unforeseeable physical conditions not disclosed in tender documents.",
        status: "VERIFIED",
        action: "FIDIC 4.12 is a contractual provision — cite directly from contract.",
        fitScore: 97,
      },
    ],
    timeline: [
      { id: 1, title: "Work Order Issued", description: "₹87.40 Cr, 30 months", status: "completed", date: "2024-04-15" },
      { id: 2, title: "Site Handover", description: "Timely handover", status: "completed", date: "2024-05-10" },
      { id: 3, title: "Geological Surprise Discovered", description: "Hard rock + swelling clay at foundation — not in tender bore logs", status: "completed", date: "2024-08-01", note: "UNFORESEEABLE — FIDIC 4.12 applies" },
      { id: 4, title: "IIT Jodhpur Expert Report", description: "Confirms conditions were unforeseeable", status: "completed", date: "2024-10-15" },
      { id: 5, title: "Design Changes (2 nos.)", description: "Revised foundation + spillway redesign — ₹12.60 Cr", status: "completed", date: "2024-11-15" },
      { id: 6, title: "Termination Notice", description: "WRD terminates for slow progress (29%)", status: "completed", date: "2026-02-18", note: "ILLEGAL — geological surprise caused delay" },
      { id: 7, title: "Arbitration Invoked", description: "Sec 11(6) application filed", status: "completed", date: "2026-03-05" },
    ],
    strategy: [
      { id: "s1", title: "FIDIC 4.12 — Unforeseeable Conditions", description: "Hard rock and swelling clay not in tender bore logs — IIT Jodhpur expert confirms unforeseeable. Full compensation ₹18.75 Cr.", status: "active", priority: "high" },
      { id: "s2", title: "Inadequate Bore Logs", description: "Only 4 boreholes for 450m dam foundation — inadequate. WRD's own negligence.", status: "active", priority: "high" },
      { id: "s3", title: "Design Changes Unpaid", description: "2 design changes issued in writing — ₹12.60 Cr due.", status: "active", priority: "high" },
    ],
    standards: [
      { code: "FIDIC Sub-Cl. 4.12", title: "Unforeseeable Physical Conditions", applicability: "correct", keyClause: "Contractor entitled to compensation for unforeseeable physical conditions", violation: "WRD failed to disclose geological conditions in tender documents", sourceUrl: "https://fidic.org", confidence: "VERIFIED" },
      { code: "IS 6512:1987", title: "Criteria for Design of Solid Gravity Dams", applicability: "correct", keyClause: "Cl. 4: Foundation requirements — adequate site investigation mandatory", violation: "Only 4 boreholes for 450m foundation — inadequate", sourceUrl: "https://bis.gov.in", confidence: "SECONDARY" },
    ],
    collisions: [
      { id: "col1", type: "contradiction", description: "WRD Standing Committee minutes recommend termination for slow progress but do not mention geological surprise or design changes issued by WRD itself.", evidence_a: "Standing Committee Minutes 10.02.2026", evidence_b: "Design Change Instructions 15.11.2024 + 01.01.2025", severity: "high" },
    ],
  },

  {
    id: "TC-25",
    title: "[DEMO] 220 kV Substation Arbitration — RVPNL vs Contractor",
    court: "High Court of Rajasthan at Jodhpur (Sec 11 A&C Act)",
    caseNo: "ARB/2026/TC-25",
    brief: "Construction of 220 kV GIS substation + 45 km transmission line at Bhiwadi. RVPNL delayed supply of employer-furnished GIS equipment by 5 months. RoW clearance not obtained. Contractor claims ₹30.45 Cr. Award: ₹23.65 Cr in contractor's favour.",
    createdAt: "2026-03-20T00:00:00.000Z",
    files: [],
    case_type: "other",
    status: "Award Passed",
    charges: ["Arbitration & Conciliation Act 1996", "FIDIC Red Book 2017", "RVPNL GCC"],
    metadata: {
      category: "Infrastructure Arbitration",
      complexity: "High",
      estimatedDuration: "12-18 months",
      requiredResources: ["FIDIC Red Book 2017", "RVPNL GCC", "IEC 61869", "IS 2026", "IEEMA Formula"],
    },
    caseLaw: [
      {
        case: "NTPC Ltd. v. M/s. Siemens",
        court: "Supreme Court of India (2022)",
        useForDefence: "Employer liable for delay in supply of employer-furnished equipment — contractor entitled to full compensation.",
        status: "SECONDARY",
        action: "Verify exact citation from SCC Online before filing.",
        fitScore: 92,
      },
    ],
    timeline: [
      { id: 1, title: "Work Order Issued", description: "₹68.25 Cr, 21 months", status: "completed", date: "2024-05-08" },
      { id: 2, title: "GIS Equipment Delayed (5 months)", description: "Scheduled Oct 2024 → Actual Mar 2025", status: "completed", date: "2025-03-01", note: "EMPLOYER DEFAULT — Clause 12 violated" },
      { id: 3, title: "RoW Clearance Pending (7 months)", description: "8.2 km forest stretch blocked", status: "completed", date: "2025-06-01", note: "EMPLOYER DEFAULT" },
      { id: 4, title: "Termination Notice", description: "RVPNL terminates for slow progress (52%)", status: "completed", date: "2026-03-05", note: "ILLEGAL — delay caused by RVPNL" },
      { id: 5, title: "Arbitration Invoked", description: "Sec 11(6) application filed", status: "completed", date: "2026-03-20" },
      { id: 6, title: "Award: ₹23.65 Cr", description: "Tribunal awards ₹23.65 Cr + 9% interest.", status: "completed", date: "2027-01-10" },
    ],
    strategy: [
      { id: "s1", title: "GIS Equipment Delay (Clause 12)", description: "RVPNL's own obligation to supply GIS equipment — 5-month delay. Full compensation ₹9.85 Cr.", status: "active", priority: "high" },
      { id: "s2", title: "RoW Clearance Failure", description: "RVPNL failed to obtain forest clearance for 8.2 km — ₹7.40 Cr compensation.", status: "active", priority: "high" },
      { id: "s3", title: "IEEMA Price Escalation", description: "Transformer and conductor indices increased significantly — ₹4.15 Cr due.", status: "active", priority: "medium" },
    ],
    standards: [
      { code: "FIDIC Sub-Cl. 2.1 + Special Cl. 12", title: "Employer-Supplied Materials", applicability: "correct", keyClause: "RVPNL responsible for supply of 220 kV GIS modules", violation: "5-month delay in supply", sourceUrl: "https://fidic.org", confidence: "VERIFIED" },
      { code: "IEEMA Price Variation Formula", title: "Electrical Equipment Price Variation", applicability: "correct", keyClause: "Price variation for transformers and conductors", violation: "Not applied despite significant index variation", sourceUrl: "https://ieema.org", confidence: "SECONDARY" },
    ],
    collisions: [
      { id: "col1", type: "contradiction", description: "RVPNL Standing Committee minutes recommend termination but do not mention RVPNL's own 5-month delay in GIS equipment supply.", evidence_a: "Standing Committee Minutes 28.02.2026", evidence_b: "GIS Delivery Challan 15.03.2025", severity: "high" },
    ],
  },

  {
    id: "TC-26",
    title: "[DEMO] Smart City Landscape Arbitration — USCL vs Contractor",
    court: "High Court of Rajasthan at Jodhpur (Sec 11 A&C Act)",
    caseNo: "ARB/2026/TC-26",
    brief: "Integrated township landscaping (185 acres) at Udaipur Smart City. USCL issued 19 variation orders (scope creep), failed to supply treated water (plantation survival 43%), and delayed 7 RA bills. Contractor claims ₹20.75 Cr. Award: ₹15.80 Cr in contractor's favour.",
    createdAt: "2026-02-28T00:00:00.000Z",
    files: [],
    case_type: "other",
    status: "Award Passed",
    charges: ["Arbitration & Conciliation Act 1996", "CPWD GCC 2020", "Smart City Mission Guidelines"],
    metadata: {
      category: "Infrastructure Arbitration",
      complexity: "Medium",
      estimatedDuration: "12-18 months",
      requiredResources: ["CPWD GCC 2020", "CPWD Horticulture Specs 2021", "IS 1897:1982", "IRC:SP:93-2017"],
    },
    caseLaw: [
      {
        case: "CPWD GCC 2020 Clause 12 — Variations",
        court: "Contractual Provision",
        useForDefence: "Variations ordered in writing by Engineer-in-Charge are binding on Employer — payment mandatory.",
        status: "VERIFIED",
        action: "Cite directly from CPWD GCC 2020 Clause 12.",
        fitScore: 94,
      },
    ],
    timeline: [
      { id: 1, title: "Work Order Issued", description: "₹34.80 Cr, 18 months", status: "completed", date: "2024-03-05" },
      { id: 2, title: "Scope Creep Begins", description: "19 Variation Orders — 42,000 extra plants + 6.5 km roads", status: "completed", date: "2024-06-01", note: "EMPLOYER DEFAULT — unpriced VOs" },
      { id: 3, title: "Water Supply Failure", description: "USCL fails to supply treated water — survival rate drops to 43%", status: "completed", date: "2024-09-01", note: "EMPLOYER DEFAULT — Clause 15 violated" },
      { id: 4, title: "7 RA Bills Unpaid (4-11 months)", description: "Cash flow crisis", status: "completed", date: "2024-07-01", note: "EMPLOYER DEFAULT" },
      { id: 5, title: "Termination Notice", description: "USCL terminates for slow progress (64%)", status: "completed", date: "2026-02-12", note: "ILLEGAL — delay caused by USCL" },
      { id: 6, title: "Arbitration Invoked", description: "Sec 11(6) application filed", status: "completed", date: "2026-02-28" },
      { id: 7, title: "Award: ₹15.80 Cr", description: "Tribunal awards ₹15.80 Cr + 9% interest.", status: "completed", date: "2027-02-25" },
    ],
    strategy: [
      { id: "s1", title: "Scope Creep (19 VOs)", description: "USCL issued 19 VOs without prior pricing — ₹6.85 Cr due. All in writing.", status: "active", priority: "high" },
      { id: "s2", title: "Water Supply Failure", description: "USCL failed to supply treated water (Clause 15) — plantation survival 43%. Replacement cost ₹3.15 Cr.", status: "active", priority: "high" },
      { id: "s3", title: "7 RA Bills Unpaid", description: "Bills pending 4-11 months — GCC Clause 7 violated. ₹4.25 Cr due.", status: "active", priority: "high" },
    ],
    standards: [
      { code: "CPWD GCC 2020 Cl. 12", title: "Variations", applicability: "correct", keyClause: "Variations to be priced before execution", violation: "19 VOs issued without prior pricing", sourceUrl: "https://cpwd.gov.in", confidence: "VERIFIED" },
      { code: "CPWD GCC 2020 Cl. 15 (Special)", title: "Employer-Supplied Utilities", applicability: "correct", keyClause: "USCL to supply treated water for irrigation", violation: "Water supply failed from September 2024", sourceUrl: "https://cpwd.gov.in", confidence: "VERIFIED" },
      { code: "IS 1897:1982", title: "Plantation & Landscaping", applicability: "correct", keyClause: "Survival rate standards for plantation works", violation: "Survival rate 43% due to water shortage — not contractor's fault", sourceUrl: "https://bis.gov.in", confidence: "SECONDARY" },
    ],
    collisions: [
      { id: "col1", type: "contradiction", description: "USCL blames contractor for poor plantation survival but USCL's own records show treated water supply was stopped from September 2024.", evidence_a: "USCL Termination Notice 12.02.2026", evidence_b: "USCL Water Supply Log (stopped Sep 2024)", severity: "high" },
      { id: "col2", type: "contradiction", description: "USCL claims contractor slow but issued 19 Variation Orders adding 42,000 extra plants and 6.5 km roads — scope creep caused delay.", evidence_a: "USCL Termination Notice 12.02.2026", evidence_b: "19 Variation Orders (written)", severity: "high" },
    ],
  },
];

/** Summary cards for the demo browser */
export const INFRA_ARB_SUMMARY = [
  { id: "TC-22", label: "Hospital Building", value: "₹48.75 Cr", claim: "₹19.84 Cr", award: "₹17.86 Cr", status: "Award Passed", score: 91 },
  { id: "TC-23", label: "NH-758 Highway", value: "₹112.65 Cr", claim: "₹55.30 Cr", award: "₹41.65 Cr", status: "Award Passed", score: 94 },
  { id: "TC-24", label: "Banas Dam", value: "₹87.40 Cr", claim: "₹54.85 Cr", award: "₹42.85 Cr", status: "Award Passed", score: 93 },
  { id: "TC-25", label: "220 kV Substation", value: "₹68.25 Cr", claim: "₹30.45 Cr", award: "₹23.65 Cr", status: "Award Passed", score: 92 },
  { id: "TC-26", label: "Smart City Landscape", value: "₹34.80 Cr", claim: "₹20.75 Cr", award: "₹15.80 Cr", status: "Award Passed", score: 90 },
];
