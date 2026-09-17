# Append TC-26 + footer
import os

TARGET = r'E:\Rajkumar\legal-luminaire\artifacts\legal-luminaire\src\data\demo-cases\infra-arb-claim-data.ts'

PART4 = """\

  // TC-26: TOWNSHIP LANDSCAPING
  {
    id: "TC-26",
    caseCode: "INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026",
    projectName: "Integrated Township Landscaping, Internal Roads & Green Development \u2014 185 Acres",
    projectNameHindi: "185 \u090f\u0915\u0921\u093c \u090f\u0915\u0940\u0915\u0943\u0924 \u091f\u093e\u0909\u0928\u0936\u093f\u092a \u092d\u0942\u0926\u0943\u0936\u094d\u092f, \u0906\u0902\u0924\u0930\u093f\u0915 \u0938\u0921\u093c\u0915\u0947\u0902 \u090f\u0935\u0902 \u0939\u0930\u093f\u0924 \u0935\u093f\u0915\u093e\u0938",
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
        title: "Scope Creep \u2014 19 Variation Orders",
        titleHindi: "\u0938\u094d\u0915\u094b\u092a \u0935\u0943\u0926\u094d\u0927\u093f \u2014 19 \u092a\u0930\u093f\u0935\u0930\u094d\u0924\u0928 \u0906\u0926\u0947\u0936",
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
          "\u092e\u0942\u0932: 85,000 \u092a\u094c\u0927\u0947 + 28 \u0915\u093f\u092e\u0940 \u0938\u0921\u093c\u0915\u0947\u0902\u0964",
          "19 VOs \u092e\u0947\u0902 42,000 \u0905\u0924\u093f\u0930\u093f\u0915\u094d\u0924 \u092a\u094c\u0927\u0947, 6.5 \u0915\u093f\u092e\u0940 \u0938\u0921\u093c\u0915\u0947\u0902\u0964",
          "\u0938\u092d\u0940 \u0932\u093f\u0916\u093f\u0924 \u0928\u093f\u0930\u094d\u0926\u0947\u0936 \u092a\u0930, \u092e\u093e\u092a \u0939\u0938\u094d\u0924\u093e\u0915\u094d\u0937\u0930\u093f\u0924\u0964",
        ],
        calculation: "Extra earthwork \u20b92.85 Cr | Plantation (42K @ \u20b9570) \u20b92.40 Cr | Roads \u20b91.60 Cr | Total: \u20b96.85 Crore",
        evidence: ["19 Variation Orders \u2014 all written", "Joint Measurement Books", "Photographs"],
        precedents: ["CPWD GCC 2020 Clause 12 \u2014 Contractual provision (VERIFIED)"],
      },
      {
        claimNo: 2,
        title: "Delayed Payment \u2014 7 RA Bills (4\u201311 Months)",
        titleHindi: "7 RA \u092c\u093f\u0932\u094b\u0902 \u0915\u0947 \u092d\u0941\u0917\u0924\u093e\u0928 \u092e\u0947\u0902 \u0935\u093f\u0932\u0902\u092c (4-11 \u092e\u093e\u0939)",
        amount: 4.25,
        factFitScore: 96,
        status: "VERIFIED",
        clause: "CPWD GCC 2020 Clause 7 (Payment Terms)",
        clauseSource: "CPWD GCC 2020",
        facts: [
          "7 RA bills pending 4-11 months.",
          "GCC requires payment within 28 days of measurement.",
          "Cash flow crisis \u2014 emergency credit at 18% p.a.",
        ],
        factsHindi: [
          "7 RA \u092c\u093f\u0932 4-11 \u092e\u093e\u0939 \u0938\u0947 \u0932\u0902\u092c\u093f\u0924\u0964",
          "GCC \u092e\u0947\u0902 \u092e\u093e\u092a \u0915\u0947 28 \u0926\u093f\u0928 \u092e\u0947\u0902 \u092d\u0941\u0917\u0924\u093e\u0928 \u0915\u093e \u092a\u094d\u0930\u093e\u0935\u0927\u093e\u0928\u0964",
          "\u0928\u0915\u0926 \u0938\u0902\u0915\u091f \u2014 18% \u092c\u094d\u092f\u093e\u091c \u092a\u0930 \u0903\u0923\u0964",
        ],
        calculation: "7 RA Bills total: \u20b911.45 Cr | Interest @ 12% p.a. weighted avg. delay 7 months = \u20b94.25 Crore (interest component)",
        evidence: ["7 RA Bills with submission dates", "USCL Finance pending register", "Bank statements"],
        precedents: ["CPWD GCC 2020 Clause 7 \u2014 Contractual provision (VERIFIED)"],
      },
      {
        claimNo: 3,
        title: "Plantation Replacement \u2014 USCL Water Supply Failure",
        titleHindi: "USCL \u091c\u0932 \u0906\u092a\u0942\u0930\u094d\u0924\u093f \u0935\u093f\u092b\u0932\u0924\u093e \u2014 \u092a\u094c\u0927\u0930\u094b\u092a\u0923 \u092a\u094d\u0930\u0924\u093f\u0938\u094d\u0925\u093e\u092a\u0928",
        amount: 3.15,
        factFitScore: 89,
        status: "VERIFIED",
        clause: "CPWD GCC 2020 Clause 15 (Employer-Supplied Utilities) \u2014 Special Condition",
        clauseSource: "CPWD GCC 2020 Special Conditions",
        facts: [
          "USCL obligated to supply treated water (Special Condition).",
          "Water supply stopped September 2024 \u2014 USCL's own log confirms.",
          "Survival rate dropped to 43%.",
          "38,000 plants replaced twice.",
          "Expert horticulturist confirms water shortage caused deaths.",
        ],
        factsHindi: [
          "USCL \u0938\u093f\u0902\u091a\u093e\u0908 \u091c\u0932 \u0906\u092a\u0942\u0930\u094d\u0924\u093f \u0915\u0947 \u0932\u093f\u090f \u092c\u093e\u0927\u094d\u092f \u0925\u093e\u0964",
          "\u0938\u093f\u0924\u0902\u092c\u0930 2024 \u0938\u0947 \u091c\u0932 \u0906\u092a\u0942\u0930\u094d\u0924\u093f \u092c\u0902\u0926 \u2014 USCL \u0932\u0949\u0917 \u0938\u0947 \u092a\u0941\u0937\u094d\u091f\u093f\u0964",
          "\u091c\u0940\u0935\u093f\u0924 \u0930\u0939\u0928\u0947 \u0915\u0940 \u0926\u0930 43%\u0964",
          "38,000 \u092a\u094c\u0927\u0947 \u0926\u094b \u092c\u093e\u0930 \u092c\u0926\u0932\u0947\u0964",
        ],
        calculation: "38,000 \u00d7 2 replacements @ \u20b9570 = \u20b94.33 Cr gross | Less 5% contractor fault = \u20b921.6L | Net: \u20b93.15 Crore",
        evidence: ["USCL Water Supply Log (stoppage Sep 2024)", "Horticulturist expert report", "Survival survey reports", "Photographs of dead plants"],
        precedents: [
          "CPWD GCC 2020 Clause 15 Special Condition \u2014 Contractual provision (VERIFIED)",
          "Contract Act Sec. 53 \u2014 Employer cannot penalise for own breach",
        ],
      },
      {
        claimNo: 4,
        title: "Idle Machinery & Labour (Scope-Change Wait Periods)",
        titleHindi: "\u0928\u093f\u0937\u094d\u0915\u094d\u0930\u093f\u092f \u092f\u0902\u0924\u094d\u0930 \u090f\u0935\u0902 \u0936\u094d\u0930\u092e\u093f\u0915",
        amount: 2.45,
        factFitScore: 85,
        status: "VERIFIED",
        clause: "CPWD GCC 2020 Clause 12 + General Damages",
        clauseSource: "CPWD GCC 2020",
        facts: [
          "Crew idle between VO issuances \u2014 4.2 months aggregate.",
          "Log books and attendance confirm nil productive work.",
        ],
        factsHindi: [
          "VO \u0915\u0947 \u092c\u0940\u091a 4.2 \u092e\u093e\u0939 \u0928\u093f\u0937\u094d\u0915\u094d\u0930\u093f\u092f\u0964",
          "\u0932\u0949\u0917 \u0914\u0930 \u0909\u092a\u0938\u094d\u0925\u093f\u0924\u093f \u092e\u0947\u0902 \u0936\u0942\u0928\u094d\u092f \u0915\u093e\u0930\u094d\u092f\u0964",
        ],
        calculation: "JCBs (3) \u20b965K/day \u00d7 126 days = \u20b92.46 Cr | Less 4% = \u20b99.8L | Labour overhead \u20b91.50 Cr | Total: \u20b92.45 Crore",
        evidence: ["Equipment log books (126 idle days)", "Attendance registers"],
        precedents: ["CPWD GCC 2020 Clause 12 \u2014 Contractual provision (VERIFIED)"],
      },
      {
        claimNo: 5,
        title: "Price Escalation (CPWD Clause 10CC)",
        titleHindi: "\u092e\u0942\u0932\u094d\u092f \u0935\u0943\u0926\u094d\u0927\u093f (CPWD \u0916\u0902\u0921 10CC)",
        amount: 1.95,
        factFitScore: 91,
        status: "VERIFIED",
        clause: "CPWD GCC 2020 Clause 10CC",
        clauseSource: "CPWD GCC 2020",
        facts: [
          "Period extended 18 to 26 months due to VOs and water failure.",
          "WPI for labour, fuel, horticulture inputs increased.",
        ],
        factsHindi: ["\u0905\u0935\u0927\u093f 18 \u0938\u0947 26 \u092e\u093e\u0939\u0964", "WPI \u092e\u0947\u0902 \u0935\u0943\u0926\u094d\u0927\u093f\u0964"],
        calculation: "WPI base March 2024 to March 2026: Labour +18%, Fuel +14%, Inputs +22% | On \u20b99.80 Cr | Total: \u20b91.95 Crore",
        evidence: ["OEA WPI indices (base March 2024)", "Clause 10CC calculation"],
        precedents: ["CPWD GCC 2020 Clause 10CC \u2014 Contractual provision (VERIFIED)"],
      },
      {
        claimNo: 6,
        title: "Loss of Profit",
        titleHindi: "\u0932\u093e\u092d \u0915\u0940 \u0939\u093e\u0928\u093f",
        amount: 2.10,
        factFitScore: 58,
        status: "SECONDARY",
        clause: "Section 73, Indian Contract Act 1872",
        clauseSource: "Indian Contract Act, 1872",
        facts: ["Unexecuted: ~\u20b912.55 Cr.", "Margin: 10%."],
        factsHindi: ["\u0905\u0928\u093f\u0937\u094d\u092a\u093e\u0926\u093f\u0924: ~\u20b912.55 \u0915\u0930\u094b\u0921\u093c\u0964", "\u092e\u093e\u0930\u094d\u091c\u093f\u0928: 10%\u0964"],
        calculation: "Hudson: 10% \u00d7 \u20b912.55 Cr \u00d7 (8/18) = \u20b92.10 Crore",
        evidence: ["Audited accounts", "Expert certificate"],
        precedents: ["Hudson Formula \u2014 SECONDARY"],
        warning: "SECONDARY \u2014 Audited accounts and expert opinion required.",
      },
    ],
    preFilingChecklist: [
      "Work Order USCL/2023-24/Landscape/672 dated 05.03.2024 \u2014 certified copy",
      "19 Variation Orders \u2014 all originals",
      "Joint Measurement Books for all 19 VOs",
      "7 RA Bills with submission dates",
      "USCL Water Supply Log (stoppage Sep 2024) \u2014 certified copy",
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
      "\u0915\u093e\u0930\u094d\u092f\u093e\u0926\u0947\u0936 USCL/2023-24/Landscape/672 \u2014 \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u092a\u094d\u0930\u0924\u093f",
      "19 \u092a\u0930\u093f\u0935\u0930\u094d\u0924\u0928 \u0906\u0926\u0947\u0936 \u2014 \u092e\u0942\u0932",
      "7 RA \u092c\u093f\u0932 \u2014 \u0926\u093e\u0916\u093f\u0932 \u0924\u093f\u0925\u093f \u0938\u0939\u093f\u0924",
      "USCL \u091c\u0932 \u0906\u092a\u0942\u0930\u094d\u0924\u093f \u0932\u0949\u0917 \u2014 \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u092a\u094d\u0930\u0924\u093f",
      "\u092c\u093e\u0917\u0935\u093e\u0928\u0940 \u0935\u093f\u0936\u0947\u0937\u091c\u094d\u091e \u0930\u093f\u092a\u094b\u0930\u094d\u091f",
    ],
    keyContradicton: "USCL blames contractor for poor plantation survival \u2014 but USCL's own Water Supply Log shows supply stopped September 2024, 5 months before termination.",
    demoBadge: "\u20b934.80 Cr \u2022 Smart City Landscape \u2022 90% Verified",
  },
];

export function getInfraArbCase(id: string): InfraArbCase | undefined {
  return INFRA_ARB_CLAIM_DATA.find((c) => c.id === id);
}

export const CLAIM_STATUS_CONFIG: Record<ClaimStatus, {
  label: string; labelHi: string;
  bg: string; text: string; border: string;
}> = {
  VERIFIED:  { label: "Verified",  labelHi: "\u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924",  bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  SECONDARY: { label: "Secondary", labelHi: "\u0926\u094d\u0935\u093f\u0924\u0940\u092f\u0915",  bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  PENDING:   { label: "Pending",   labelHi: "\u0932\u0902\u092c\u093f\u0924",     bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200" },
};
"""

with open(TARGET, 'a', encoding='utf-8') as f:
    f.write(PART4)

print("Part 4 appended. Final file size:", os.path.getsize(TARGET))