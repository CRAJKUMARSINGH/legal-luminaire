# Full writer for infra-arb-claim-data.ts
import os, sys

TARGET = r'E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\demo-cases\infra-arb-claim-data.ts'

CONTENT = """\
/**
 * Infrastructure Arbitration \u2014 Full Claim Statement Data (TC-22 to TC-26)
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
 *   SECONDARY  = formula/calculation-based \u2014 needs further substantiation
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
    projectNameHindi: "\u0909\u0926\u092f\u092a\u0941\u0930 \u092e\u0947\u0902 300 \u092c\u0947\u0921 \u091c\u093f\u0932\u093e \u0905\u0938\u094d\u092a\u0924\u093e\u0932 \u0915\u093e \u0928\u093f\u0930\u094d\u092e\u093e\u0923",
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
        titleHindi: "\u0938\u093e\u0907\u091f \u0939\u0948\u0902\u0921\u0913\u0935\u0930 \u092e\u0947\u0902 45 \u0926\u093f\u0928 \u0915\u0940 \u0926\u0947\u0930\u0940 \u0915\u0947 \u0932\u093f\u090f \u092e\u0941\u0906\u0935\u091c\u093e",
        amount: 4.82,
        factFitScore: 94,
        status: "VERIFIED",
        clause: "GCC Clause 5 + GCC Clause 10CC",
        clauseSource: "CPWD GCC 2020",
        facts: [
          "Work Order issued 05.05.2024 \u2014 site handover required within 15 days.",
          "Actual handover: 20.05.2024 \u2014 delay of 45 days.",
          "Contractor mobilised resources immediately after Work Order.",
          "RMSCL's own records acknowledge the delay.",
        ],
        factsHindi: [
          "\u0915\u093e\u0930\u094d\u092f\u093e\u0926\u0947\u0936 05.05.2024 \u2014 15 \u0926\u093f\u0928 \u092e\u0947\u0902 \u0939\u0948\u0902\u0921\u0913\u0935\u0930 \u0905\u092a\u0947\u0915\u094d\u0937\u093f\u0924 \u0925\u093e\u0964",
          "\u0935\u093e\u0938\u094d\u0924\u0935\u093f\u0915 \u0939\u0948\u0902\u0921\u0913\u0935\u0930: 20.05.2024 \u2014 45 \u0926\u093f\u0928 \u0915\u0940 \u0926\u0947\u0930\u0940\u0964",
          "\u0920\u0947\u0915\u0947\u0926\u093e\u0930 \u0928\u0947 \u0924\u0941\u0930\u0902\u0924 \u0938\u0902\u0938\u093e\u0927\u0928 \u091c\u0941\u091f\u093e\u090f\u0964",
          "RMSCL \u0915\u0947 \u0905\u092d\u093f\u0932\u0947\u0916 \u0926\u0947\u0930\u0940 \u0938\u094d\u0935\u0940\u0915\u093e\u0930 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902\u0964",
        ],
        calculation: "Establishment \u20b972L/month \u00d7 1.5 months = \u20b91.08 Cr | Idle Machinery \u20b91.85 Cr | Labour \u20b995L | Productivity \u20b994L | Total: \u20b94.82 Crore",
        evidence: [
          "Work Order RMSCL/2024-25/Works/4782 dated 05.05.2024",
          "Site Possession Certificate dated 20.05.2024",
          "45 Daily Progress Reports",
          "Mobilisation records",
        ],
        precedents: [
          "M/s. K.N. Sathyapalan v. State of Kerala (SC) \u2014 SECONDARY",
          "RSMML v. Contractor, Rajasthan HC Div. Bench 30.03.2026 \u2014 VERIFIED",
        ],
      },
      {
        claimNo: 2,
        title: "Variation & Extra Items (3 Variation Orders)",
        titleHindi: "\u092a\u0930\u093f\u0935\u0930\u094d\u0924\u0928 \u090f\u0935\u0902 \u0905\u0924\u093f\u0930\u093f\u0915\u094d\u0924 \u092e\u0926\u0947\u0902 (3 \u092a\u0930\u093f\u0935\u0930\u094d\u0924\u0928 \u0906\u0926\u0947\u0936)",
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
          "3 \u0932\u093f\u0916\u093f\u0924 \u092a\u0930\u093f\u0935\u0930\u094d\u0924\u0928 \u0906\u0926\u0947\u0936: OT \u0938\u094d\u0932\u0948\u092c, ICU \u0935\u093f\u0902\u0917, \u091c\u0928\u0930\u0947\u091f\u0930 \u0930\u0942\u092e\u0964",
          "\u0938\u092d\u0940 \u0905\u0924\u093f\u0930\u093f\u0915\u094d\u0924 \u0915\u093e\u0930\u094d\u092f \u0932\u093f\u0916\u093f\u0924 \u0928\u093f\u0930\u094d\u0926\u0947\u0936 \u092a\u0930\u0964",
          "\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u092e\u093e\u092a \u0926\u094b\u0928\u094b\u0902 \u092a\u0915\u094d\u0937\u094b\u0902 \u0926\u094d\u0935\u093e\u0930\u093e \u0939\u0938\u094d\u0924\u093e\u0915\u094d\u0937\u0930\u093f\u0924\u0964",
        ],
        calculation: "OT Slab \u20b92.10 Cr | ICU Wing \u20b92.45 Cr | Generator Room \u20b91.60 Cr | Total: \u20b96.15 Crore",
        evidence: [
          "3 Variation Orders (written, signed by Engineer-in-Charge)",
          "Joint Measurement Books (JMB)",
          "Site photographs",
        ],
        precedents: [
          "CPWD GCC 2020 Clause 12 \u2014 Contractual provision (VERIFIED)",
          "Tarapore & Co. v. State of Orissa (1994) \u2014 SECONDARY",
        ],
      },
      {
        claimNo: 3,
        title: "Price Escalation (Clause 10CC)",
        titleHindi: "\u092e\u0942\u0932\u094d\u092f \u0935\u0943\u0926\u094d\u0927\u093f (\u0916\u0902\u0921 10CC)",
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
          "\u0938\u0902\u0935\u093f\u0926\u093e \u0905\u0935\u0927\u093f 210 \u0926\u093f\u0928 \u092c\u0922\u093c\u093e\u0908 \u0917\u0908\u0964",
          "WPI \u0938\u0942\u091a\u0915\u093e\u0902\u0915 \u092e\u0947\u0902 \u0935\u0943\u0926\u094d\u0927\u093f\u0964",
          "CPWD \u0916\u0902\u0921 10CC \u0905\u0928\u093f\u0935\u093e\u0930\u094d\u092f \u092e\u0942\u0932\u094d\u092f \u0935\u0943\u0926\u094d\u0927\u093f \u0915\u093e \u092a\u094d\u0930\u093e\u0935\u0927\u093e\u0928 \u0915\u0930\u0924\u093e \u0939\u0948\u0964",
        ],
        calculation: "WPI variation May 2024 to March 2026: Steel +14.2%, Cement +11.8%, Labour +18.5% | Per Clause 10CC formula | Total: \u20b93.94 Crore",
        evidence: [
          "OEA WPI indices (base year 2011-12)",
          "EOT-1 and EOT-2 orders",
          "Clause 10CC calculation sheet",
        ],
        precedents: [
          "CPWD GCC 2020 Clause 10CC \u2014 Contractual provision (VERIFIED)",
        ],
      },
      {
        claimNo: 4,
        title: "Idle Labour & Machinery",
        titleHindi: "\u0928\u093f\u0937\u094d\u0915\u094d\u0930\u093f\u092f \u0936\u094d\u0930\u092e\u093f\u0915 \u090f\u0935\u0902 \u092f\u0902\u0924\u094d\u0930",
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
          "RMSCL \u0915\u0940 \u0926\u0947\u0930\u0940 \u092e\u0947\u0902 \u092f\u0902\u0924\u094d\u0930 \u0914\u0930 \u0936\u094d\u0930\u092e\u093f\u0915 \u0928\u093f\u0937\u094d\u0915\u094d\u0930\u093f\u092f \u0930\u0939\u0947\u0964",
          "\u0932\u0949\u0917 \u092c\u0941\u0915 \u092e\u0947\u0902 \u0905\u092a\u094d\u0930\u092f\u0941\u0915\u094d\u0924 \u092f\u0902\u0924\u094d\u0930\u0964",
          "\u0935\u0947\u0924\u0928 \u0930\u091c\u093f\u0938\u094d\u091f\u0930 \u092e\u0947\u0902 \u0936\u094d\u0930\u092e\u093f\u0915 \u0909\u092a\u0938\u094d\u0925\u093f\u0924\u0964",
        ],
        calculation: "3 cranes + 4 mixers @ \u20b98.5L/day \u00d7 45 days = \u20b938.25L | Labour (120) @ \u20b9850/day \u00d7 45 = \u20b945.9L | Establishment \u20b91.34 Cr | Total: \u20b92.18 Crore",
        evidence: [
          "Machinery log books",
          "Wage registers",
          "Site photographs of idle equipment",
        ],
        precedents: [
          "McDermott International Inc. v. Burn Standard Co. (2006) 11 SCC 181 \u2014 SECONDARY",
        ],
        warning: "SECONDARY \u2014 GPS records and machinery hire certificates required before filing.",
      },
      {
        claimNo: 5,
        title: "Loss of Profit (Hudson Formula)",
        titleHindi: "\u0932\u093e\u092d \u0915\u0940 \u0939\u093e\u0928\u093f (\u0939\u0921\u0938\u0928 \u092b\u093e\u0930\u094d\u092e\u0942\u0932\u093e)",
        amount: 2.75,
        factFitScore: 45,
        status: "PENDING",
        clause: "Section 73, Indian Contract Act 1872",
        clauseSource: "Indian Contract Act, 1872",
        facts: [
          "Unexecuted work value: ~\u20b928 Cr at termination.",
          "Profit margin in tender: 8%.",
          "Illegal termination deprived contractor of completing contract.",
        ],
        factsHindi: [
          "\u0938\u092e\u093e\u092a\u094d\u0924\u093f \u092a\u0930 \u0905\u0928\u093f\u0937\u094d\u092a\u093e\u0926\u093f\u0924 \u0915\u093e\u0930\u094d\u092f: ~\u20b928 \u0915\u0930\u094b\u0921\u093c\u0964",
          "\u091f\u0947\u0902\u0921\u0930 \u0932\u093e\u092d \u092e\u093e\u0930\u094d\u091c\u093f\u0928: 8%\u0964",
          "\u0905\u0935\u0948\u0927 \u0938\u092e\u093e\u092a\u094d\u0924\u093f \u0938\u0947 \u092a\u0942\u0930\u094d\u0923\u0924\u093e \u0915\u093e \u0932\u093e\u092d \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u093e\u0964",
        ],
        calculation: "Hudson Formula: 8% \u00d7 \u20b928 Cr \u00d7 18/24 months = \u20b92.75 Crore (estimated)",
        evidence: [
          "Audited accounts showing profit margin",
          "Expert accountant's certificate",
        ],
        precedents: [
          "Hudson Formula \u2014 established arbitration principle (SECONDARY)",
        ],
        warning: "PENDING \u2014 Audited accounts and expert accountant's certificate required. Do not present without professional certification.",
      },
    ],
    preFilingChecklist: [
      "Work Order RMSCL/2024-25/Works/4782 dated 05.05.2024 \u2014 certified copy",
      "Site Possession Certificate dated 20.05.2024 \u2014 original",
      "3 Variation Orders with signatures \u2014 originals",
      "Joint Measurement Books (JMB) \u2014 originals",
      "RA Bills 3-5 with submission dates and acknowledgements",
      "RMSCL payment refusal correspondence",
      "Standing Committee Minutes 08.01.2026 \u2014 certified copy",
      "Termination Notice 15.01.2026 \u2014 certified copy",
      "EOT-1 and EOT-2 orders \u2014 certified copies",
      "WPI indices from OEA (base year 2011-12)",
      "Machinery log books + GPS reports",
      "Wage registers for idle period",
      "K.N. Sathyapalan judgment \u2014 certified copy (SCC Online)",
      "RSMML v. Contractor (Rajasthan HC 30.03.2026) \u2014 certified copy",
    ],
    preFilingChecklistHindi: [
      "\u0915\u093e\u0930\u094d\u092f\u093e\u0926\u0947\u0936 RMSCL/2024-25/Works/4782 \u0926\u093f. 05.05.2024 \u2014 \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u092a\u094d\u0930\u0924\u093f",
      "\u0938\u093e\u0907\u091f \u0915\u092c\u094d\u091c\u093e \u092a\u094d\u0930\u092e\u093e\u0923-\u092a\u0924\u094d\u0930 \u0926\u093f. 20.05.2024 \u2014 \u092e\u0942\u0932",
      "3 \u092a\u0930\u093f\u0935\u0930\u094d\u0924\u0928 \u0906\u0926\u0947\u0936 \u0939\u0938\u094d\u0924\u093e\u0915\u094d\u0937\u0930 \u0938\u0939\u093f\u0924 \u2014 \u092e\u0942\u0932",
      "RA \u092c\u093f\u0932 3-5 \u092a\u094d\u0930\u0938\u094d\u0924\u0941\u0924\u093f \u0924\u093f\u0925\u093f \u0914\u0930 \u0930\u0938\u0940\u0926 \u0938\u0939\u093f\u0924",
      "\u0938\u094d\u0925\u093e\u092f\u0940 \u0938\u092e\u093f\u0924\u093f \u092e\u093f\u0928\u091f 08.01.2026 \u2014 \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u092a\u094d\u0930\u0924\u093f",
      "\u0938\u092e\u093e\u092a\u094d\u0924\u093f \u0928\u094b\u091f\u093f\u0938 15.01.2026 \u2014 \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u092a\u094d\u0930\u0924\u093f",
      "OEA \u0938\u0947 WPI \u0938\u0942\u091a\u0915\u093e\u0902\u0915",
    ],
    keyContradicton: "RMSCL Standing Committee Minutes (08.01.2026) direct Finance to clear pending bills \u2014 admission of liability \u2014 while simultaneously recommending termination 7 days later.",
    demoBadge: "\u20b948.75 Cr \u2022 300-Bed Hospital \u2022 91% Verified",
  },
"""

print("Part 1 length:", len(CONTENT))

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(CONTENT)

print("Part 1 written. File size:", os.path.getsize(TARGET))