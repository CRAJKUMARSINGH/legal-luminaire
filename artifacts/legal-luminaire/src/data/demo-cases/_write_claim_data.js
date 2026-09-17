// Temporary writer script — delete after use
const fs = require('fs');
const path = require('path');

const TARGET = path.join(__dirname, 'infra-arb-claim-data.ts');

const CONTENT = `/**
 * Infrastructure Arbitration — Full Claim Statement Data (TC-22 to TC-26)
 * Source: SUPPLEMENT/ARBITRATE.MD (expanded claim statements)
 *
 * Each case contains:
 *   - Project metadata
 *   - Structured claims with Fact-Fit Gate scores + FIDIC/CPWD clause references
 *   - Hindi claim summaries
 *   - Pre-filing checklist items
 *   - Contradiction radar entries
 *
 * Accuracy Rules (accuracy-rules.md):
 *   VERIFIED   = contemporary records + contract clause confirmed
 *   SECONDARY  = formula/calculation-based — needs further substantiation
 *   PENDING    = needs expert report / primary document
 */

export type ClaimStatus = "VERIFIED" | "SECONDARY" | "PENDING";

export type ClaimItem = {
  claimNo: number;
  title: string;
  titleHindi: string;
  amount: number;
  factFitScore: number;
  status: ClaimStatus;
  clause: string;
  clauseSource: string;
  facts: string[];
  factsHindi: string[];
  calculation: string;
  evidence: string[];
  precedents: string[];
  warning?: string;
};

export type InfraArbCase = {
  id: string;
  caseCode: string;
  projectName: string;
  projectNameHindi: string;
  contractValue: number;
  contractor: string;
  employer: string;
  employerShort: string;
  court: string;
  totalClaim: number;
  awardAmount: number;
  invocationDate: string;
  arbitrationClause: string;
  claims: ClaimItem[];
  preFilingChecklist: string[];
  preFilingChecklistHindi: string[];
  keyContradicton: string;
  demoBadge: string;
};

export const INFRA_ARB_CLAIM_DATA: InfraArbCase[] = [
  // TC-22: HOSPITAL BUILDING
  {
    id: "TC-22",
    caseCode: "INFRA_ARB_01_BUILDING_HOSPITAL_2026",
    projectName: "Construction of 300-Bed District Hospital at Udaipur, Rajasthan",
    projectNameHindi: "उदयपुर में 300 बेड जिला अस्पताल का निर्माण",
    contractValue: 48.75,
    contractor: "M/s. Rajputana Builders Pvt. Ltd.",
    employer: "Rajasthan Medical Services Corporation Ltd.",
    employerShort: "RMSCL",
    court: "High Court of Rajasthan at Jodhpur",
    totalClaim: 19.84,
    awardAmount: 14.28,
    invocationDate: "10.02.2026",
    arbitrationClause: "CPWD GCC 2020 Clause 25 + Arbitration & Conciliation Act, 1996",
    claims: [
      {
        claimNo: 1,
        title: "Compensation for Delay in Site Handover (45 Days)",
        titleHindi: "साइट हैंडओवर में 45 दिन की देरी के लिए मुआवजा",
        amount: 4.82,
        factFitScore: 94,
        status: "VERIFIED",
        clause: "GCC Clause 5 + GCC Clause 10CC",
        clauseSource: "CPWD GCC 2020",
        facts: [
          "Work Order issued 05.05.2024 — site handover required within 15 days.",
          "Actual handover: 20.05.2024 — delay of 45 days.",
          "Contractor mobilised resources immediately after Work Order.",
          "RMSCL's own records acknowledge the delay.",
        ],
        factsHindi: [
          "कार्यादेश 05.05.2024 — 15 दिन में हैंडओवर अपेक्षित था।",
          "वास्तविक हैंडओवर: 20.05.2024 — 45 दिन की देरी।",
          "ठेकेदार ने तुरंत संसाधन जुटाए।",
          "RMSCL के अभिलेख देरी स्वीकार करते हैं।",
        ],
        calculation: "Establishment ₹72L/month × 1.5 months = ₹1.08 Cr | Idle Machinery ₹1.85 Cr | Labour ₹95L | Productivity ₹94L | Total: ₹4.82 Crore",
        evidence: [
          "Work Order RMSCL/2024-25/Works/4782 dated 05.05.2024",
          "Site Possession Certificate dated 20.05.2024",
          "45 Daily Progress Reports",
          "Mobilisation records",
        ],
        precedents: [
          "M/s. K.N. Sathyapalan v. State of Kerala (SC) — SECONDARY",
          "RSMML v. Contractor, Rajasthan HC Div. Bench 30.03.2026 — VERIFIED",
        ],
      },
      {
        claimNo: 2,
        title: "Variation & Extra Items (3 Variation Orders)",
        titleHindi: "परिवर्तन एवं अतिरिक्त मदें (3 परिवर्तन आदेश)",
        amount: 6.15,
        factFitScore: 88,
        status: "VERIFIED",
        clause: "GCC Clause 12",
        clauseSource: "CPWD GCC 2020",
        facts: [
          "3 written Variation Orders: OT slab, ICU wing extension, generator room.",
          "All extra works executed on written instructions.",
          "Joint measurements conducted and signed by both parties.",
        ],
        factsHindi: [
          "3 लिखित परिवर्तन आदेश: OT स्लैब, ICU विंग, जनरेटर रूम।",
          "सभी अतिरिक्त कार्य लिखित निर्देश पर।",
          "संयुक्त माप दोनों पक्षों द्वारा हस्ताक्षरित।",
        ],
        calculation: "OT Slab ₹2.10 Cr | ICU Wing ₹2.45 Cr | Generator Room ₹1.60 Cr | Total: ₹6.15 Crore",
        evidence: [
          "3 Variation Orders (written, signed by Engineer-in-Charge)",
          "Joint Measurement Books (JMB)",
          "Site photographs",
        ],
        precedents: [
          "CPWD GCC 2020 Clause 12 — Contractual provision (VERIFIED)",
          "Tarapore & Co. v. State of Orissa (1994) — SECONDARY",
        ],
      },
      {
        claimNo: 3,
        title: "Price Escalation (Clause 10CC)",
        titleHindi: "मूल्य वृद्धि (खंड 10CC)",
        amount: 3.94,
        factFitScore: 91,
        status: "VERIFIED",
        clause: "GCC Clause 10CC",
        clauseSource: "CPWD GCC 2020",
        facts: [
          "Contract period extended by 210 days (EOT-1 + EOT-2).",
          "WPI indices show significant escalation.",
          "CPWD Clause 10CC mandates price escalation for extended contracts.",
        ],
        factsHindi: [
          "संविदा अवधि 210 दिन बढ़ाई गई।",
          "WPI सूचकांक में वृद्धि।",
          "CPWD खंड 10CC अनिवार्य मूल्य वृद्धि का प्रावधान करता है।",
        ],
        calculation: "WPI variation May 2024 to March 2026: Steel +14.2%, Cement +11.8%, Labour +18.5% | Per Clause 10CC formula | Total: ₹3.94 Crore",
        evidence: [
          "OEA WPI indices (base year 2011-12)",
          "EOT-1 and EOT-2 orders",
          "Clause 10CC calculation sheet",
        ],
        precedents: [
          "CPWD GCC 2020 Clause 10CC — Contractual provision (VERIFIED)",
        ],
      },
      {
        claimNo: 4,
        title: "Idle Labour & Machinery",
        titleHindi: "निष्क्रिय श्रमिक एवं यंत्र",
        amount: 2.18,
        factFitScore: 76,
        status: "SECONDARY",
        clause: "GCC Clause 5 + Contract Act Sec. 73",
        clauseSource: "CPWD GCC 2020 + Indian Contract Act, 1872",
        facts: [
          "Machinery and labour idle during RMSCL's 45-day delay.",
          "Log books show machinery deployed but unutilised.",
          "Wage registers confirm labour on rolls.",
        ],
        factsHindi: [
          "RMSCL की देरी में यंत्र और श्रमिक निष्क्रिय रहे।",
          "लॉग बुक में अप्रयुक्त यंत्र।",
          "वेतन रजिस्टर में श्रमिक उपस्थित।",
        ],
        calculation: "3 cranes + 4 mixers @ ₹8.5L/day × 45 days = ₹38.25L | Labour (120) @ ₹850/day × 45 = ₹45.9L | Establishment ₹1.34 Cr | Total: ₹2.18 Crore",
        evidence: [
          "Machinery log books",
          "Wage registers",
          "Site photographs of idle equipment",
        ],
        precedents: [
          "McDermott International Inc. v. Burn Standard Co. (2006) 11 SCC 181 — SECONDARY",
        ],
        warning: "SECONDARY — GPS records and machinery hire certificates required before filing.",
      },
      {
        claimNo: 5,
        title: "Loss of Profit (Hudson Formula)",
        titleHindi: "लाभ की हानि (हडसन फार्मूला)",
        amount: 2.75,
        factFitScore: 45,
        status: "PENDING",
        clause: "Section 73, Indian Contract Act 1872",
        clauseSource: "Indian Contract Act, 1872",
        facts: [
          "Unexecuted work value: ~₹28 Cr at termination.",
          "Profit margin in tender: 8%.",
          "Illegal termination deprived contractor of completing contract.",
        ],
        factsHindi: [
          "समाप्ति पर अनिष्पादित कार्य: ~₹28 करोड़।",
          "टेंडर लाभ मार्जिन: 8%।",
          "अवैध समाप्ति से पूर्णता का लाभ नहीं मिला।",
        ],
        calculation: "Hudson Formula: 8% × ₹28 Cr × 18/24 months = ₹2.75 Crore (estimated)",
        evidence: [
          "Audited accounts showing profit margin",
          "Expert accountant's certificate",
        ],
        precedents: [
          "Hudson Formula — established arbitration principle (SECONDARY)",
        ],
        warning: "PENDING — Audited accounts and expert accountant's certificate required. Do not present without professional certification.",
      },
    ],
    preFilingChecklist: [
      "Work Order RMSCL/2024-25/Works/4782 dated 05.05.2024 — certified copy",
      "Site Possession Certificate dated 20.05.2024 — original",
      "3 Variation Orders with signatures — originals",
      "Joint Measurement Books (JMB) — originals",
      "RA Bills 3-5 with submission dates and acknowledgements",
      "RMSCL payment refusal correspondence",
      "Standing Committee Minutes 08.01.2026 — certified copy",
      "Termination Notice 15.01.2026 — certified copy",
      "EOT-1 and EOT-2 orders — certified copies",
      "WPI indices from OEA (base year 2011-12)",
      "Machinery log books + GPS reports",
      "Wage registers for idle period",
      "K.N. Sathyapalan judgment — certified copy (SCC Online)",
      "RSMML v. Contractor (Rajasthan HC 30.03.2026) — certified copy",
    ],
    preFilingChecklistHindi: [
      "कार्यादेश RMSCL/2024-25/Works/4782 दि. 05.05.2024 — प्रमाणित प्रति",
      "साइट कब्जा प्रमाण-पत्र दि. 20.05.2024 — मूल",
      "3 परिवर्तन आदेश हस्ताक्षर सहित — मूल",
      "RA बिल 3-5 प्रस्तुति तिथि और रसीद सहित",
      "स्थायी समिति मिनट 08.01.2026 — प्रमाणित प्रति",
      "समाप्ति नोटिस 15.01.2026 — प्रमाणित प्रति",
      "OEA से WPI सूचकांक",
    ],
    keyContradicton: "RMSCL Standing Committee Minutes (08.01.2026) direct Finance to clear pending bills — admission of liability — while simultaneously recommending termination 7 days later.",
    demoBadge: "₹48.75 Cr • 300-Bed Hospital • 91% Verified",
  },

  // TC-23: NH-758 HIGHWAY
  {
    id: "TC-23",
    caseCode: "INFRA_ARB_02_ROAD_HIGHWAY_2026",
    projectName: "Construction of 45 km 2-Lane NH-758 Extension, Rajasthan",
    projectNameHindi: "राजस्थान में 45 किमी NH-758 विस्तार का निर्माण",
    contractValue: 112.65,
    contractor: "M/s. Rajputana Infra Projects Pvt. Ltd.",
    employer: "National Highways Authority of India",
    employerShort: "NHAI",
    court: "High Court of Rajasthan at Jodhpur",
    totalClaim: 55.30,
    awardAmount: 41.65,
    invocationDate: "05.03.2026",
    arbitrationClause: "FIDIC Red Book 2017 Sub-Clause 20.6 + Arbitration & Conciliation Act, 1996",
    claims: [
      {
        claimNo: 1,
        title: "Compensation for Delayed Site Possession (78 Days)",
        titleHindi: "साइट कब्जा देने में 78 दिन की देरी के लिए मुआवजा",
        amount: 14.85,
        factFitScore: 96,
        status: "VERIFIED",
        clause: "FIDIC Sub-Clause 2.1 (Right of Access to Site) + Sub-Clause 8.4 (EOT)",
        clauseSource: "FIDIC Red Book 2017",
        facts: [
          "LOA issued 10.06.2024 — site possession required within 15 days (by 25.06.2024).",
          "Actual possession: 12.09.2024 — delay of 78 days due to forest clearance and farmer agitation.",
          "NHAI issued LOA knowing forest clearance was not obtained.",
          "42 emails sent by contractor (15.06.2024 to 10.09.2024) — NHAI had actual knowledge.",
          "Contractor mobilised hotmix plant, cranes and crew immediately after LOA.",
        ],
        factsHindi: [
          "LOA 10.06.2024 — 15 दिन में कब्जा अपेक्षित।",
          "वास्तविक कब्जा: 12.09.2024 — 78 दिन की देरी।",
          "NHAI ने वन अनुमति बिना LOA जारी किया।",
          "ठेकेदार ने 42 ईमेल भेजे — NHAI को जानकारी थी।",
        ],
        calculation: "Establishment ₹1.25 Cr/month × 2.6 months = ₹3.25 Cr | Machinery ₹85L/month × 2.6 = ₹2.21 Cr | Labour ₹45L/month × 2.6 = ₹1.17 Cr | Lost Productivity 18% = ₹5.22 Cr | Blocked chainage = ₹3.00 Cr | Total: ₹14.85 Crore",
        evidence: [
          "LOA No. NHAI/PIU-Udaipur/NH-758/2024-25/1123 dated 10.06.2024",
          "Possession Certificate dated 12.09.2024",
          "Forest Dept. Clearance Letter dated 10.09.2024",
          "42 emails with timestamps",
          "47 Daily Progress Reports",
        ],
        precedents: [
          "Union of India v. Pramod Kumar (SC) — SECONDARY",
          "NHAI v. ITD Cementation India Ltd. (Delhi HC) — SECONDARY",
          "Erusian Equipment v. West Bengal (1975) 1 SCC 70 — VERIFIED",
        ],
      },
      {
        claimNo: 2,
        title: "Price Escalation (NHAI GCC Clause 10CC / WPI)",
        titleHindi: "मूल्य वृद्धि (NHAI GCC खंड 10CC / WPI)",
        amount: 9.75,
        factFitScore: 93,
        status: "VERIFIED",
        clause: "NHAI GCC 2022 Clause 10CC",
        clauseSource: "NHAI GCC 2022",
        facts: [
          "Contract period extended from 24 to 31 months.",
          "WPI indices for bitumen, steel, cement and labour increased significantly.",
          "NHAI GCC 2022 Clause 10CC mandates WPI-based escalation.",
        ],
        factsHindi: [
          "संविदा अवधि 24 से 31 माह बढ़ी।",
          "WPI सूचकांक में महत्वपूर्ण वृद्धि।",
          "NHAI GCC खंड 10CC अनिवार्य मूल्य वृद्धि।",
        ],
        calculation: "WPI base June 2024 to March 2026: Bitumen +22%, Steel +16%, Cement +12%, Labour +19% | On ₹69.50 Cr unexecuted | Total: ₹9.75 Crore",
        evidence: [
          "WPI indices from OEA",
          "EOT-1 order",
          "10CC calculation sheet",
        ],
        precedents: [
          "NHAI GCC 2022 Clause 10CC — Contractual provision (VERIFIED)",
        ],
      },
      {
        claimNo: 3,
        title: "Extra Items & Variation Orders",
        titleHindi: "अतिरिक्त मदें एवं परिवर्तन आदेश",
        amount: 11.40,
        factFitScore: 89,
        status: "VERIFIED",
        clause: "FIDIC Sub-Clause 13.1 (Variations)",
        clauseSource: "FIDIC Red Book 2017",
        facts: [
          "Engineer issued 2 VOs: retaining wall CH 12+450 to 13+200, extra earthwork for alignment change.",
          "All works executed on written instructions, joint measurements signed.",
        ],
        factsHindi: [
          "2 परिवर्तन आदेश: रिटेनिंग वॉल CH 12+450-13+200, अलाइनमेंट बदलाव।",
          "लिखित निर्देश पर कार्य, संयुक्त माप हस्ताक्षरित।",
        ],
        calculation: "Retaining Wall (780m × 6.5m, M20): ₹7.80 Cr | Extra Earthwork (22,500 cum): ₹3.60 Cr | Total: ₹11.40 Crore",
        evidence: [
          "2 Variation Orders (written, signed by Engineer)",
          "Joint Measurement Books",
          "Revised alignment drawings",
        ],
        precedents: [
          "FIDIC Sub-Clause 13.1 — Contractual provision (VERIFIED)",
        ],
      },
      {
        claimNo: 4,
        title: "Idle Machinery & Labour",
        titleHindi: "निष्क्रिय यंत्र एवं श्रमिक",
        amount: 6.25,
        factFitScore: 82,
        status: "VERIFIED",
        clause: "FIDIC Sub-Clause 8.4 + General Damages",
        clauseSource: "FIDIC Red Book 2017",
        facts: [
          "Hotmix plant, cold milling machine, paver idle during 78-day delay.",
          "92 persons on payroll during idle period.",
          "GPS logs confirm location without work.",
        ],
        factsHindi: [
          "78 दिन की देरी में हॉटमिक्स, कोल्ड मिलिंग, पेवर निष्क्रिय।",
          "92 कर्मचारी वेतन पर।",
          "GPS लॉग स्थान की पुष्टि।",
        ],
        calculation: "Hotmix ₹1.85L/day × 78 = ₹1.44 Cr | Milling ₹95K/day × 78 = ₹74.1L | Paver ₹85K/day × 78 = ₹66.3L | Labour (92) ₹850/day × 78 = ₹60.96L | Other ₹2.80 Cr | Total: ₹6.25 Crore",
        evidence: [
          "Machinery log books with GPS reports",
          "Wage registers (92 persons)",
          "Site photographs",
        ],
        precedents: [
          "J.G. Engineers v. Union of India (2011) 5 SCC 758 — SECONDARY",
        ],
      },
      {
        claimNo: 5,
        title: "Loss of Profit & Overhead (Hudson Formula)",
        titleHindi: "लाभ एवं ओवरहेड की हानि (हडसन फार्मूला)",
        amount: 8.90,
        factFitScore: 68,
        status: "SECONDARY",
        clause: "Section 73, Indian Contract Act 1872",
        clauseSource: "Indian Contract Act, 1872",
        facts: [
          "Unexecuted work at termination: ₹69.50 Cr.",
          "Tender profit margin: 8%.",
          "Illegal termination deprived contractor of completing contract.",
        ],
        factsHindi: [
          "समाप्ति पर अनिष्पादित कार्य: ₹69.50 करोड़।",
          "टेंडर लाभ मार्जिन: 8%।",
        ],
        calculation: "Hudson Formula: 8% × ₹69.50 Cr × (7/24) = ₹8.90 Crore",
        evidence: [
          "Audited accounts showing 8% margin",
          "Expert accountant's certificate",
        ],
        precedents: [
          "Hudson Formula — established arbitration principle (SECONDARY)",
        ],
        warning: "SECONDARY — Audited accounts + expert opinion required. Plead as alternative to claims 1-4.",
      },
      {
        claimNo: 6,
        title: "Unforeseeable Geological Conditions (BC Soil)",
        titleHindi: "अप्रत्याशित भूगर्भीय स्थितियाँ (काली मिट्टी)",
        amount: 4.15,
        factFitScore: 51,
        status: "PENDING",
        clause: "FIDIC Sub-Clause 4.12 (Unforeseeable Physical Conditions)",
        clauseSource: "FIDIC Red Book 2017",
        facts: [
          "Highly expansive black cotton soil at CH 32+500 to 38+200.",
          "Tender geotechnical report did not disclose BC soil.",
          "CBR value 2.4% vs 5% specified — additional treatment required.",
        ],
        factsHindi: [
          "CH 32+500-38+200 पर काली मिट्टी।",
          "टेंडर रिपोर्ट में उल्लेख नहीं।",
          "CBR 2.4% बनाम 5% निर्धारित।",
        ],
        calculation: "Special treatment 5.7 km: ₹2.85 Cr | Expert investigation: ₹45L | Additional material: ₹85L | Total: ₹4.15 Crore",
        evidence: [
          "Independent geotechnical expert report",
          "Revised soil tests vs tender bore logs",
          "NHAI approval of additional treatment",
        ],
        precedents: [
          "FIDIC Sub-Clause 4.12 — Contractual provision",
        ],
        warning: "PENDING — Independent geotechnical expert report required before filing.",
      },
    ],
    preFilingChecklist: [
      "LOA NHAI/PIU-Udaipur/NH-758/2024-25/1123 dated 10.06.2024 — certified copy",
      "Possession Certificate dated 12.09.2024 — original",
      "Forest Dept. Clearance Letter dated 10.09.2024 — certified copy",
      "42 emails indexed bundle",
      "47 Daily Progress Reports",
      "2 Variation Orders — originals",
      "Joint Measurement Books — originals",
      "WPI indices from OEA",
      "GPS tracker reports + machinery log books",
      "Wage registers (92 persons)",
      "EOT-1 order — certified copy",
      "Standing Committee Minutes 12.02.2026 — certified copy",
      "Termination Notice 20.02.2026 — certified copy",
      "Erusian Equipment v. West Bengal (1975) 1 SCC 70 — certified copy",
      "FIDIC Red Book 2017 Clause 4.12 — official text",
    ],
    preFilingChecklistHindi: [
      "LOA NHAI/PIU-Udaipur/NH-758/2024-25/1123 दि. 10.06.2024 — प्रमाणित प्रति",
      "कब्जा प्रमाण-पत्र दि. 12.09.2024 — मूल",
      "वन विभाग अनुमति पत्र — प्रमाणित प्रति",
      "42 ईमेल — अनुक्रमित बंडल",
      "OEA से WPI सूचकांक",
    ],
    keyContradicton: "NHAI Standing Committee Minutes (12.02.2026) recommend blacklisting without mentioning NHAI's own 78-day possession delay — confirmed by Forest Dept. Clearance Letter dated 12.09.2024.",
    demoBadge: "₹112.65 Cr • NH Highway • 94% Verified",
  },

  // TC-24: DAM IRRIGATION
  {
    id: "TC-24",
    caseCode: "INFRA_ARB_03_DAM_IRRIGATION_2026",
    projectName: "Construction of Medium Irrigation Dam across River Banas, Rajsamand",
    projectNameHindi: "राजसमंद में बनास नदी पर मध्यम सिंचाई बांध का निर्माण",
    contractValue: 87.40,
    contractor: "M/s. Rajasthan Construction Consortium",
    employer: "Water Resources Department, Govt. of Rajasthan",
    employerShort: "WRD",
    court: "High Court of Rajasthan at Jodhpur",
    totalClaim: 54.85,
    awardAmount: 42.85,
    invocationDate: "05.03.2026",
    arbitrationClause: "FIDIC Red Book 2017 + CPWD GCC 2020",
    claims: [
      {
        claimNo: 1,
        title: "Compensation for Unforeseeable Geological Conditions",
        titleHindi: "अप्रत्याशित भूगर्भीय स्थितियों के लिए मुआवजा",
        amount: 18.75,
        factFitScore: 97,
        status: "VERIFIED",
        clause: "FIDIC Sub-Clause 4.12 (Unforeseeable Physical Conditions)",
        clauseSource: "FIDIC Red Book 2017",
        facts: [
          "Hard rock and swelling clay at foundation not in tender bore logs.",
          "WRD had only 4 boreholes for 450m foundation — inadequate per IS 6512:1987.",
          "IIT Jodhpur expert confirms conditions were unforeseeable.",
          "FIDIC 4.12 notice given within 28 days.",
        ],
        factsHindi: [
          "नींव में भारी चट्टान और स्फीत मिट्टी — टेंडर बोरलॉग में नहीं।",
          "WRD ने 450 मीटर के लिए केवल 4 बोरहोल किए।",
          "IIT जोधपुर विशेषज्ञ ने स्थितियाँ अप्रत्याशित पाईं।",
          "28 दिन में FIDIC 4.12 नोटिस दिया।",
        ],
        calculation: "Rock blasting ₹8.45 Cr | Clay grouting ₹6.20 Cr | Extended overhead (6m) ₹2.85 Cr | Investigation ₹85L | Redesign ₹40L | Total: ₹18.75 Crore",
        evidence: [
          "Tender bore logs (4 boreholes) — WRD documents",
          "IIT Jodhpur Geotechnical Expert Report",
          "Revised foundation drawing by WRD",
          "FIDIC 4.12 notice with WRD acknowledgement",
        ],
        precedents: [
          "FIDIC Sub-Clause 4.12 — Contractual provision (VERIFIED)",
        ],
      },
      {
        claimNo: 2,
        title: "Design Changes by WRD (2 Instructions)",
        titleHindi: "WRD द्वारा 2 डिज़ाइन परिवर्तन",
        amount: 12.60,
        factFitScore: 92,
        status: "VERIFIED",
        clause: "FIDIC Sub-Clause 13.1 (Variations)",
        clauseSource: "FIDIC Red Book 2017",
        facts: [
          "WRD issued 2 design changes: revised foundation depth (+3.5m) and spillway redesign.",
          "Both certified and implemented by contractor.",
          "Joint measurements before and after.",
        ],
        factsHindi: [
          "WRD ने 2 डिज़ाइन परिवर्तन जारी किए: नींव गहराई और स्पिलवे।",
          "दोनों प्रमाणित और क्रियान्वित।",
          "संयुक्त माप।",
        ],
        calculation: "Foundation depth increase ₹7.40 Cr | Spillway redesign ₹5.20 Cr | Total: ₹12.60 Crore",
        evidence: [
          "Design Change Instruction WRD/DAM/2024/DC-01",
          "Design Change Instruction WRD/DAM/2025/DC-02",
          "Joint measurement sheets",
        ],
        precedents: [
          "FIDIC Sub-Clause 13.1 — Contractual provision (VERIFIED)",
        ],
      },
      {
        claimNo: 3,
        title: "Delay in Approval of Materials",
        titleHindi: "सामग्री अनुमोदन में विलंब",
        amount: 7.85,
        factFitScore: 85,
        status: "VERIFIED",
        clause: "FIDIC Sub-Clause 7.1 + Sub-Clause 8.4",
        clauseSource: "FIDIC Red Book 2017",
        facts: [
          "WRD took avg. 4.5 months to approve material submissions (28 days required).",
          "20 material submissions; 17 delayed 60-180 days.",
        ],
        factsHindi: [
          "WRD को अनुमोदन में औसतन 4.5 माह लगे (28 दिन अपेक्षित)।",
          "20 में से 17 प्रस्तुतियों में 60-180 दिन की देरी।",
        ],
        calculation: "Idle batching plant ₹2.85 Cr | Labour + overhead ₹3.40 Cr | Price escalation ₹1.60 Cr | Total: ₹7.85 Crore",
        evidence: [
          "Material submission register with dates",
          "WRD approval letters with dates",
        ],
        precedents: [
          "FIDIC Sub-Clause 7.1 + 8.4 — Contractual provisions (VERIFIED)",
        ],
      },
      {
        claimNo: 4,
        title: "Idle Plant & Machinery (6.5 Months)",
        titleHindi: "निष्क्रिय संयंत्र एवं यंत्र (6.5 माह)",
        amount: 9.40,
        factFitScore: 81,
        status: "VERIFIED",
        clause: "FIDIC Sub-Clause 8.4 + General Damages",
        clauseSource: "FIDIC Red Book 2017",
        facts: [
          "Dam equipment idle during geological investigation and design changes.",
          "Idle period: 6.5 months (195 days).",
          "Log books confirm nil utilisation.",
        ],
        factsHindi: [
          "भूगर्भीय जाँच और डिज़ाइन परिवर्तन के दौरान यंत्र निष्क्रिय।",
          "निष्क्रिय अवधि: 6.5 माह।",
          "लॉग बुक शून्य उपयोग की पुष्टि।",
        ],
        calculation: "Batching plant ₹1.45L/day × 195 = ₹2.83 Cr | Pumps (10) ₹35K/day × 195 = ₹68.25L | Shuttering ₹1.20L/day × 195 = ₹2.34 Cr | Crane ₹95K/day × 195 = ₹1.85 Cr | Other = ₹1.70 Cr | Total: ₹9.40 Crore",
        evidence: [
          "Equipment log books (195 days)",
          "Daily site reports",
          "Photographs of idle equipment",
        ],
        precedents: [
          "McDermott International v. Burn Standard Co. (2006) 11 SCC 181 — SECONDARY",
        ],
      },
      {
        claimNo: 5,
        title: "Loss of Profit",
        titleHindi: "लाभ की हानि",
        amount: 6.25,
        factFitScore: 55,
        status: "SECONDARY",
        clause: "Section 73, Indian Contract Act 1872",
        clauseSource: "Indian Contract Act, 1872",
        facts: [
          "Unexecuted work: ~₹60 Cr at termination.",
          "Tender profit margin: 8%.",
        ],
        factsHindi: [
          "समाप्ति पर अनिष्पादित: ~₹60 करोड़।",
          "टेंडर लाभ मार्जिन: 8%।",
        ],
        calculation: "Hudson Formula: 8% × ₹60 Cr × (9/30) = ₹6.25 Crore (estimated)",
        evidence: [
          "Audited accounts showing 8% margin",
          "Expert accountant's certificate",
        ],
        precedents: [
          "Hudson Formula — established arbitration principle (SECONDARY)",
        ],
        warning: "SECONDARY — Audited accounts and expert opinion required.",
      },
    ],
    preFilingChecklist: [
      "Work Order WRD/2024-25/Dam/478 dated 15.04.2024 — certified copy",
      "IIT Jodhpur Geotechnical Expert Report — certified copy",
      "Tender bore logs (4 boreholes) — certified copy from WRD",
      "FIDIC 4.12 Notice with WRD acknowledgement",
      "Design Change Instructions DC-01 and DC-02 — originals",
      "Before/after joint measurements for design changes",
      "Material submission register with WRD approval dates",
      "Equipment log books (195 days)",
      "IS 6512:1987 — certified copy",
      "Termination Notice 18.02.2026 — certified copy",
      "WRD Standing Committee Minutes 10.02.2026 — certified copy",
    ],
    preFilingChecklistHindi: [
      "कार्यादेश WRD/2024-25/Dam/478 दि. 15.04.2024 — प्रमाणित प्रति",
      "IIT जोधपुर भूतकनीकी विशेषज्ञ रिपोर्ट",
      "FIDIC 4.12 नोटिस WRD पावती सहित",
      "डिज़ाइन परिवर्तन DC-01 और DC-02 — मूल",
    ],
    keyContradicton: "WRD Standing Committee Minutes (10.02.2026) recommend termination for slow progress but do not mention the 2 design change instructions issued by WRD itself — which caused 6+ months delay.",
    demoBadge: "₹87.40 Cr • Irrigation Dam • 93% Verified",
  },

  // TC-25: 220 KV SUBSTATION
  {
    id: "TC-25",
    caseCode: "INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026",
    projectName: "220 kV GIS Substation + 45 km Transmission Line at Bhiwadi",
    projectNameHindi: "भिवाड़ी में 220 kV GIS सब-स्टेशन + 45 किमी पारेषण लाइन",
    contractValue: 68.25,
    contractor: "M/s. Rajputana Powertech Pvt. Ltd.",
    employer: "Rajasthan Rajya Vidyut Prasaran Nigam Ltd.",
    employerShort: "RVPNL",
    court: "High Court of Rajasthan at Jodhpur",
    totalClaim: 30.45,
    awardAmount: 23.65,
    invocationDate: "20.03.2026",
    arbitrationClause: "FIDIC Red Book 2017 + RVPNL GCC + Arbitration & Conciliation Act, 1996",
    claims: [
      {
        claimNo: 1,
        title: "Delay in Supply of 220 kV GIS Equipment (5 Months)",
        titleHindi: "220 kV GIS उपकरण आपूर्ति में 5 माह की देरी",
        amount: 9.85,
        factFitScore: 95,
        status: "VERIFIED",
        clause: "FIDIC Sub-Clause 2.1 + RVPNL Special Conditions Clause 12",
        clauseSource: "FIDIC Red Book 2017 + RVPNL GCC",
        facts: [
          "Special Conditions Clause 12 — RVPNL responsible for GIS equipment.",
          "GIS scheduled October 2024 — actual delivery March 2025 (5-month delay).",
          "42 correspondence emails confirm RVPNL's actual knowledge.",
          "Contractor mobilised civil team immediately but could not proceed without GIS.",
        ],
        factsHindi: [
          "विशेष शर्त खंड 12 — RVPNL GIS उपकरण के लिए जिम्मेदार।",
          "GIS अक्टूबर 2024 → मार्च 2025 — 5 माह की देरी।",
          "42 ईमेल — RVPNL को जानकारी।",
        ],
        calculation: "Establishment ₹72L/month × 5 = ₹3.60 Cr | Tower machinery ₹95L/month × 5 = ₹4.75 Cr | Manpower (45) ₹1.20 Cr | Productivity ₹30L | Total: ₹9.85 Crore",
        evidence: [
          "Work Order RVPNL/2024-25/220kV/2890 dated 08.05.2024",
          "Special Conditions Clause 12",
          "RVPNL PO to GIS supplier",
          "GIS delivery challans (March 2025)",
          "42 emails indexed",
        ],
        precedents: [
          "NTPC Ltd. v. M/s. Siemens (SC 2022) — SECONDARY",
          "FIDIC Special Conditions Clause 12 — VERIFIED",
        ],
      },
      {
        claimNo: 2,
        title: "Delay in Right of Way & Forest Clearance (7 Months)",
        titleHindi: "RoW एवं वन अनुमति में 7 माह की देरी",
        amount: 7.40,
        factFitScore: 93,
        status: "VERIFIED",
        clause: "FIDIC Sub-Clause 2.1 + Sub-Clause 19.1",
        clauseSource: "FIDIC Red Book 2017",
        facts: [
          "8.2 km stretch — forest clearance RVPNL's responsibility.",
          "7-month delay in clearance.",
          "Multiple tower locations blocked by farmers.",
        ],
        factsHindi: [
          "8.2 किमी खंड — वन अनुमति RVPNL की जिम्मेदारी।",
          "7 माह की देरी।",
          "किसानों ने टॉवर स्थल रोके।",
        ],
        calculation: "Stringing equipment ₹1.85 Cr | Labour (92 days) ₹2.95 Cr | Overhead ₹2.60 Cr | Total: ₹7.40 Crore",
        evidence: [
          "Revenue correspondence for RoW",
          "Forest Dept. clearance order (late)",
          "Police complaints for blockade",
        ],
        precedents: [
          "FIDIC Sub-Clause 2.1 + 19.1 — Contractual provisions (VERIFIED)",
        ],
      },
      {
        claimNo: 3,
        title: "Price Escalation (IEEMA + Clause 10CC)",
        titleHindi: "मूल्य वृद्धि (IEEMA + खंड 10CC)",
        amount: 4.15,
        factFitScore: 90,
        status: "VERIFIED",
        clause: "IEEMA Price Variation Formula + RVPNL GCC Clause 10CC",
        clauseSource: "RVPNL GCC + IEEMA",
        facts: [
          "Period extended 21 to 32 months.",
          "IEEMA transformer +18.5%, conductor +22.3%.",
        ],
        factsHindi: [
          "अवधि 21 से 32 माह बढ़ी।",
          "IEEMA ट्रांसफार्मर +18.5%, कंडक्टर +22.3%।",
        ],
        calculation: "IEEMA indices on ₹38.50 Cr electrical work | Total: ₹4.15 Crore",
        evidence: [
          "IEEMA published price indices (base May 2024)",
          "RVPNL GCC IEEMA formula clause",
        ],
        precedents: [
          "IEEMA Price Variation Formula — Contractual provision (VERIFIED)",
        ],
      },
      {
        claimNo: 4,
        title: "Idle Machinery & Labour",
        titleHindi: "निष्क्रिय यंत्र एवं श्रमिक",
        amount: 5.25,
        factFitScore: 87,
        status: "VERIFIED",
        clause: "FIDIC Sub-Clause 8.4 + General Damages",
        clauseSource: "FIDIC Red Book 2017",
        facts: [
          "Tower erection and stringing equipment idle 5+7 months combined.",
          "GPS logs confirm site without work.",
        ],
        factsHindi: [
          "यंत्र 5+7 माह निष्क्रिय।",
          "GPS लॉग स्थान पुष्टि।",
        ],
        calculation: "Crane ₹1.25L/day × 150 = ₹1.88 Cr | Stringing ₹95K/day × 150 = ₹1.43 Cr | Crew (60) ₹1.20K/day × 150 = ₹1.08 Cr | Other ₹86L | Total: ₹5.25 Crore",
        evidence: [
          "Equipment log books + GPS",
          "Wage registers (60 crew)",
        ],
        precedents: [
          "J.G. Engineers v. Union of India (2011) 5 SCC 758 — SECONDARY",
        ],
      },
      {
        claimNo: 5,
        title: "Loss of Profit",
        titleHindi: "लाभ की हानि",
        amount: 3.80,
        factFitScore: 62,
        status: "SECONDARY",
        clause: "Section 73, Indian Contract Act 1872",
        clauseSource: "Indian Contract Act, 1872",
        facts: ["Unexecuted work: ~₹32.50 Cr at termination.", "Tender margin: 8%."],
        factsHindi: ["समाप्ति पर: ~₹32.50 करोड़।", "टेंडर मार्जिन: 8%।"],
        calculation: "Hudson: 8% × ₹32.50 Cr × (11/21) = ₹3.80 Crore",
        evidence: ["Audited accounts", "Expert certificate"],
        precedents: ["Hudson Formula — SECONDARY"],
        warning: "SECONDARY — Audited accounts and expert opinion required.",
      },
    ],
    preFilingChecklist: [
      "Work Order RVPNL/2024-25/220kV/2890 dated 08.05.2024 — certified copy",
      "Special Conditions Clause 12 from contract",
      "RVPNL PO to GIS supplier — certified copy",
      "GIS Delivery challans (March 2025) — originals",
      "42 correspondence emails — indexed",
      "Revenue RoW correspondence",
      "Forest Dept. clearance order (late)",
      "IEEMA indices (base May 2024)",
      "Equipment log books + GPS (150 days)",
      "Standing Committee Minutes 28.02.2026",
      "Termination Notice 05.03.2026",
      "FIDIC Red Book 2017 Sub-Clause 2.1",
    ],
    preFilingChecklistHindi: [
      "कार्यादेश RVPNL/2024-25/220kV/2890 — प्रमाणित प्रति",
      "विशेष शर्त खंड 12 — संविदा से",
      "GIS डिलीवरी चालान — मूल",
      "IEEMA सूचकांक (आधार मई 2024)",
    ],
    keyContradicton: "RVPNL Standing Committee Minutes (28.02.2026) recommend termination for slow progress — but RVPNL's procurement records show GIS was delivered 5 months late, making 52% progress consistent with employer-caused delay.",
    demoBadge: "₹68.25 Cr • 220 kV Substation • 92% Verified",
  },

  // TC-26: TOWNSHIP LANDSCAPING
  {
    id: "TC-26",
    caseCode: "INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026",
    projectName: "Integrated Township Landscaping, Internal Roads & Green Development — 185 Acres",
    projectNameHindi: "185 एकड़ एकीकृत टाउनशिप भूदृश्य, आंतरिक सड़कें एवं हरित विकास",
    contractValue: 34.80,
    contractor: "M/s. Rajputana Greentech Landscapes Pvt. Ltd.",
    employer: "Udaipur Smart City Ltd.",
    employerShort: "USCL",
    court: "High Court of Rajasthan at Jodhpur",
    totalClaim: 20.75,
    awardAmount: 15.80,
    invocationDate: "28.02.2026",
    arbitrationClause: "CPWD GCC 2020 + Arbitration & Conciliation Act, 1996",
    claims: [
      {
        claimNo: 1,
        title: "Scope Creep — 19 Variation Orders",
        titleHindi: "स्कोप वृद्धि — 19 परिवर्तन आदेश",
        amount: 6.85,
        factFitScore: 94,
        status: "VERIFIED",
        clause: "CPWD GCC 2020 Clause 12 (Variations)",
        clauseSource: "CPWD GCC 2020",
        facts: [
          "Original: 85,000 plants + 28 km roads.",
          "19 VOs added 42,000 plants, 6.5 km roads, fountain and lakefront development.",
          "All on written instructions, joint measurements signed.",
        ],
        factsHindi: [
          "मूल: 85,000 पौधे + 28 किमी सड़कें।",
          "19 VOs में 42,000 अतिरिक्त पौधे, 6.5 किमी सड़कें।",
          "सभी लिखित निर्देश पर, माप हस्ताक्षरित।",
        ],
        calculation: "Extra earthwork ₹2.85 Cr | Plantation (42K @ ₹570) ₹2.40 Cr | Roads ₹1.60 Cr | Total: ₹6.85 Crore",
        evidence: [
          "19 Variation Orders — all written",
          "Joint Measurement Books",
          "Photographs",
        ],
        precedents: [
          "CPWD GCC 2020 Clause 12 — Contractual provision (VERIFIED)",
        ],
      },
      {
        claimNo: 2,
        title: "Delayed Payment — 7 RA Bills (4–11 Months)",
        titleHindi: "7 RA बिलों के भुगतान में विलंब (4-11 माह)",
        amount: 4.25,
        factFitScore: 96,
        status: "VERIFIED",
        clause: "CPWD GCC 2020 Clause 7 (Payment Terms)",
        clauseSource: "CPWD GCC 2020",
        facts: [
          "7 RA bills pending 4-11 months.",
          "GCC requires payment within 28 days of measurement.",
          "Cash flow crisis — emergency credit at 18% p.a.",
        ],
        factsHindi: [
          "7 RA बिल 4-11 माह से लंबित।",
          "GCC में माप के 28 दिन में भुगतान का प्रावधान।",
          "नकद संकट — 18% ब्याज पर ऋण।",
        ],
        calculation: "7 RA Bills total: ₹11.45 Cr | Interest @ 12% p.a. weighted avg. delay 7 months = ₹4.25 Crore (interest component)",
        evidence: [
          "7 RA Bills with submission dates",
          "USCL Finance pending register",
          "Bank statements",
        ],
        precedents: [
          "CPWD GCC 2020 Clause 7 — Contractual provision (VERIFIED)",
        ],
      },
      {
        claimNo: 3,
        title: "Plantation Replacement — USCL Water Supply Failure",
        titleHindi: "USCL जल आपूर्ति विफलता — पौधरोपण प्रतिस्थापन",
        amount: 3.15,
        factFitScore: 89,
        status: "VERIFIED",
        clause: "CPWD GCC 2020 Clause 15 (Employer-Supplied Utilities) — Special Condition",
        clauseSource: "CPWD GCC 2020 Special Conditions",
        facts: [
          "USCL obligated to supply treated water (Special Condition).",
          "Water supply stopped September 2024 — USCL's own log confirms.",
          "Survival rate dropped to 43%.",
          "38,000 plants replaced twice.",
          "Expert horticulturist confirms water shortage caused deaths.",
        ],
        factsHindi: [
          "USCL सिंचाई जल आपूर्ति के लिए बाध्य था।",
          "सितंबर 2024 से जल आपूर्ति बंद — USCL लॉग से पुष्टि।",
          "जीवित रहने की दर 43%।",
          "38,000 पौधे दो बार बदले।",
        ],
        calculation: "38,000 × 2 replacements @ ₹570 = ₹4.33 Cr gross | Less 5% contractor fault = ₹21.6L | Net: ₹3.15 Crore",
        evidence: [
          "USCL Water Supply Log (stoppage Sep 2024)",
          "Horticulturist expert report",
          "Survival survey reports",
          "Photographs of dead plants",
        ],
        precedents: [
          "CPWD GCC 2020 Clause 15 Special Condition — Contractual provision (VERIFIED)",
          "Contract Act Sec. 53 — Employer cannot penalise for own breach",
        ],
      },
      {
        claimNo: 4,
        title: "Idle Machinery & Labour (Scope-Change Wait Periods)",
        titleHindi: "निष्क्रिय यंत्र एवं श्रमिक",
        amount: 2.45,
        factFitScore: 85,
        status: "VERIFIED",
        clause: "CPWD GCC 2020 Clause 12 + General Damages",
        clauseSource: "CPWD GCC 2020",
        facts: [
          "Crew idle between VO issuances — 4.2 months aggregate.",
          "Log books and attendance confirm nil productive work.",
        ],
        factsHindi: [
          "VO के बीच 4.2 माह निष्क्रिय।",
          "लॉग और उपस्थिति में शून्य कार्य।",
        ],
        calculation: "JCBs (3) ₹65K/day × 126 days = ₹2.46 Cr | Less 4% = ₹9.8L | Labour overhead ₹1.50 Cr | Total: ₹2.45 Crore",
        evidence: [
          "Equipment log books (126 idle days)",
          "Attendance registers",
        ],
        precedents: [
          "CPWD GCC 2020 Clause 12 — Contractual provision (VERIFIED)",
        ],
      },
      {
        claimNo: 5,
        title: "Price Escalation (CPWD Clause 10CC)",
        titleHindi: "मूल्य वृद्धि (CPWD खंड 10CC)",
        amount: 1.95,
        factFitScore: 91,
        status: "VERIFIED",
        clause: "CPWD GCC 2020 Clause 10CC",
        clauseSource: "CPWD GCC 2020",
        facts: [
          "Period extended 18 to 26 months due to VOs and water failure.",
          "WPI for labour, fuel, horticulture inputs increased.",
        ],
        factsHindi: [
          "अवधि 18 से 26 माह।",
          "WPI में वृद्धि।",
        ],
        calculation: "WPI base March 2024 to March 2026: Labour +18%, Fuel +14%, Inputs +22% | On ₹9.80 Cr | Total: ₹1.95 Crore",
        evidence: [
          "OEA WPI indices (base March 2024)",
          "Clause 10CC calculation",
        ],
        precedents: [
          "CPWD GCC 2020 Clause 10CC — Contractual provision (VERIFIED)",
        ],
      },
      {
        claimNo: 6,
        title: "Loss of Profit",
        titleHindi: "लाभ की हानि",
        amount: 2.10,
        factFitScore: 58,
        status: "SECONDARY",
        clause: "Section 73, Indian Contract Act 1872",
        clauseSource: "Indian Contract Act, 1872",
        facts: ["Unexecuted: ~₹12.55 Cr.", "Margin: 10%."],
        factsHindi: ["अनिष्पादित: ~₹12.55 करोड़।", "मार्जिन: 10%।"],
        calculation: "Hudson: 10% × ₹12.55 Cr × (8/18) = ₹2.10 Crore",
        evidence: ["Audited accounts", "Expert certificate"],
        precedents: ["Hudson Formula — SECONDARY"],
        warning: "SECONDARY — Audited accounts and expert opinion required.",
      },
    ],
    preFilingChecklist: [
      "Work Order USCL/2023-24/Landscape/672 dated 05.03.2024 — certified copy",
      "19 Variation Orders — all originals",
      "Joint Measurement Books for all 19 VOs",
      "7 RA Bills with submission dates",
      "USCL Water Supply Log (stoppage Sep 2024) — certified copy",
      "Horticulturist expert report",
      "Survival survey reports (quarterly)",
      "Photographs of dead plants",
      "CPWD GCC 2020 Clause 15 Special Condition from contract",
      "Equipment log books (126 idle days)",
      "Standing Committee Minutes 08.02.2026",
      "Termination Notice 12.02.2026",
      "OEA WPI indices (base March 2024)",
      "Bank statements (emergency credit)",
    ],
    preFilingChecklistHindi: [
      "कार्यादेश USCL/2023-24/Landscape/672 — प्रमाणित प्रति",
      "19 परिवर्तन आदेश — मूल",
      "7 RA बिल — दाखिल तिथि सहित",
      "USCL जल आपूर्ति लॉग — प्रमाणित प्रति",
      "बागवानी विशेषज्ञ रिपोर्ट",
    ],
    keyContradicton: "USCL blames contractor for poor plantation survival — but USCL's own Water Supply Log shows supply stopped September 2024, 5 months before termination.",
    demoBadge: "₹34.80 Cr • Smart City Landscape • 90% Verified",
  },
];

export function getInfraArbCase(id: string): InfraArbCase | undefined {
  return INFRA_ARB_CLAIM_DATA.find((c) => c.id === id);
}

export const CLAIM_STATUS_CONFIG: Record<ClaimStatus, {
  label: string; labelHi: string;
  bg: string; text: string; border: string;
}> = {
  VERIFIED:  { label: "Verified",  labelHi: "सत्यापित",  bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  SECONDARY: { label: "Secondary", labelHi: "द्वितीयक",  bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  PENDING:   { label: "Pending",   labelHi: "लंबित",     bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200" },
};
`;

fs.writeFileSync(TARGET, CONTENT, 'utf8');
console.log('Written:', TARGET, '—', fs.statSync(TARGET).size, 'bytes');
