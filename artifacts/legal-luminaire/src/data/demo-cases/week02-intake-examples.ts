/**
 * WEEK 02 — DEVIN — Criminal workflow, constitutional thresholds, deadline and citation safety
 * Source: SUPPLEMENT/SUPPLEMENT REPLIT/WEEK_02_DEVIN.md
 * Schema: 5-part intake workflow per Legal Luminaire accuracy-rules.md
 *
 * ALL DATA IS SYNTHETIC / DEMO — not legal advice — not filing-ready
 * without supervising-advocate approval. Verify all statutes, citations,
 * limitation periods and court rules before any real-world use.
 *
 * Training control: every unverified assertion = UNCONFIRMED.
 * Never invent a date, statute, citation, party, amount or document.
 */

import type { IntakeExample } from "./intake-example-types";
import { withTerminalOutcome } from "./intake-example-utils";
export type { IntakeExample };

export const WEEK02_EXAMPLES = ([
  // ─────────────────────────────────────────────────────────────────────────
  // EX-012 — Anticipatory bail in cyber-fraud FIR
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-012",
    title: "Anticipatory Bail in Cyber-Fraud FIR",
    domain: "Criminal / Anticipatory Bail",
    complexity: "Advanced",
    approachStatus: "urgent-referral",
    approachStatusNote: "Urgent call; FIR known; arrest feared",
    urgency: "urgent",
    documentCompleteness: "partial",
    workflowState: "draft",
    background:
      "Employee is named in alleged customer-fund transfer; says supervisor shared credentials and has screenshots. FIR registered under cyber crime provisions.",
    backgroundHi:
      "कर्मचारी को ग्राहक फंड ट्रांसफर में नामित किया गया है; कहते हैं कि पर्यवेक्षक ने क्रेडेंशियल्स साझा किए और स्क्रीनशॉट हैं।",
    documents: [
      "FIR copy",
      "Notices received",
      "Employment agreement",
      "System access logs (lawful)",
      "Email correspondence",
      "Device inventory",
      "ID and address proof",
      "Proof of cooperation",
    ],
    missingDocuments: [
      "Certified copy of charge sheet (if filed)",
      "Forensic report on alleged transfer",
      "Supervisor's written statement",
      "Bank records of alleged transfer",
    ],
    documentGaps: [
      "Screenshots provided by client — authenticity UNCONFIRMED",
      "Whether supervisor actually shared credentials — UNCONFIRMED",
      "Exact amount alleged to be transferred — UNCONFIRMED",
    ],
    clientRequest:
      "Protection from arrest with cooperation and evidence-preservation conditions.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Read FIR exactly — identify specific allegations and sections",
        "Verify employment terms and access scope",
        "Authenticate screenshots — digital forensics if needed",
        "Separate personal access from any authorized delegation",
        "Identify actual fund trail if available",
      ],
      research: [
        "Verify current provisions for anticipatory bail under BNSS/CrPC — UNCONFIRMED",
        "Check forum — Sessions Court or High Court — UNCONFIRMED for this jurisdiction",
        "Assess custody factors: nature of offence, evidence tampering risk, flight risk",
        "Research precedent on employee vs. employer cyber fraud cases",
        "Verify cooperation undertaking conditions under current law",
      ],
      drafting: [
        "Anticipatory-bail application",
        "Supporting affidavit",
        "Chronology of events",
        "Cooperation undertaking",
        "Annexure index",
        "Safety instruction (do not access systems, preserve device lawfully)",
      ],
      review: [
        "Supervising advocate must verify provisions and forum before filing",
        "Ensure undertaking does not create inadvertent admissions",
      ],
      filing: [
        "DO NOT access client's or employer's systems — preserve device lawfully",
        "Avoid witness contact or evidence deletion",
        "File anticipatory bail application only after forum confirmation",
      ],
    },
    unresolvedFacts: [
      "Whether supervisor actually authorized credential sharing — UNCONFIRMED",
      "Exact sections under which FIR registered — UNCONFIRMED",
      "Whether charge sheet already filed — UNCONFIRMED",
      "Actual amount of alleged transfer — UNCONFIRMED",
    ],
    adverseFact:
      "Client's screenshots show he used shared credentials for personal tasks outside work hours — this is an adverse fact that prosecution may use to argue misuse. Recorded as UNCONFIRMED; assess impact before filing.",
    drafts: [
      { type: "chronology", title: "Event Chronology — EX-012", status: "draft", approvalRequired: false },
      { type: "application", title: "Anticipatory Bail Application", status: "review-needed", jurisdiction: "Sessions Court", limitationNote: "Arrest feared — no fixed limitation but urgency", approvalRequired: true },
      { type: "affidavit", title: "Supporting Affidavit", status: "draft", approvalRequired: true },
      { type: "undertaking", title: "Cooperation Undertaking", status: "draft", approvalRequired: false },
      { type: "index", title: "Annexure Index", status: "draft", approvalRequired: false },
      { type: "instruction", title: "Safety Instruction — Device Preservation", status: "ready-for-supervising-advocate", approvalRequired: true },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-013 — Regular bail after narcotics recovery
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-013",
    title: "Regular Bail After Narcotics Recovery",
    domain: "Criminal / Bail",
    complexity: "Advanced",
    approachStatus: "referral",
    approachStatusNote: "Jail-family approach; custody; medical issue",
    urgency: "urgent",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "Prosecution alleges commercial quantity; defence disputes conscious possession and relies on serious medical records. Accused in judicial custody.",
    backgroundHi:
      "अभियोजन वाणिज्यिक मात्रा का आरोप लगाता है; बचाव जानबूझकर कब्जे से विवाद करता है और गंभीर चिकित्सा रिकॉर्ड पर भरोसा करता है।",
    documents: [
      "FIR copy",
      "Remand report",
      "Seizure memo",
      "Forensic status report (if any)",
      "Custody certificate",
      "Medical records (serious condition)",
      "Prior bail orders (if any)",
      "Co-accused bail order (if available)",
    ],
    missingDocuments: [
      "FSL forensic report — CRITICAL PENDING",
      "Sampling report details",
      "Charge sheet (if filed)",
      "Certified copy of co-accused order",
    ],
    documentGaps: [
      "Forensic report not yet received — quantity cannot be confirmed",
      "Whether 'conscious possession' can be established — UNCONFIRMED",
      "Medical condition severity — UNCONFIRMED",
    ],
    clientRequest:
      "Seek bail without misstating quantity, recovery or parity.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Verify seizure procedure and sampling as per NDPS Act",
        "Confirm actual quantity from FSL report when received",
        "Document medical condition with hospital certification",
        "Identify parity grounds from co-accused orders",
        "Map custody period against statutory provisions",
      ],
      research: [
        "Verify NDPS Act provisions on commercial quantity — current thresholds — UNCONFIRMED",
        "Check bail provisions for commercial quantity vs. smaller quantity — UNCONFIRMED",
        "Research conscious possession jurisprudence — UNCONFIRMED",
        "Verify medical bail as constitutional right vs. statutory bars — UNCONFIRMED",
        "Assess parity — whether co-accused order is distinguishable — UNCONFIRMED",
      ],
      drafting: [
        "Bail application",
        "Medical annexure",
        "Custody chart",
        "Parity table",
        "Undertaking",
        "Hearing note",
      ],
      review: [
        "Supervising advocate must verify quantity from FSL before filing",
        "Ensure parity order is on similar facts — not distinguishable",
      ],
      filing: [
        "DO NOT file bail application without FSL report confirming quantity",
        "Medical annexure must be from government hospital with specialist opinion",
      ],
    },
    unresolvedFacts: [
      "FSL report — quantity CRITICAL PENDING",
      "Whether commercial quantity threshold met — UNCONFIRMED",
      "Medical condition severity and prognosis — UNCONFIRMED",
      "Charge sheet status — UNCONFIRMED",
    ],
    adverseFact:
      "Remand report states accused tried to destroy sample during seizure — prosecution may argue consciousness of guilt. Recorded as adverse fact; assess impact on conscious possession argument.",
    drafts: [
      { type: "application", title: "Bail Application u/s NDPS Act", status: "blocked", jurisdiction: "Special NDPS Court", approvalRequired: true, blockedReason: "FSL report pending; quantity not confirmed" },
      { type: "index", title: "Medical Annexure", status: "draft", approvalRequired: false },
      { type: "table", title: "Custody Chart", status: "draft", approvalRequired: false },
      { type: "table", title: "Parity Table", status: "research-needed", approvalRequired: false },
      { type: "undertaking", title: "Bail Undertaking", status: "draft", approvalRequired: false },
      { type: "memo", title: "Hearing Note", status: "intake-only", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-014 — Cheque dishonour notice with branch mismatch
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-014",
    title: "Cheque Dishonour Notice — Branch Mismatch",
    domain: "Negotiable Instrument / Notice",
    complexity: "Intermediate",
    approachStatus: "online-intake",
    approachStatusNote: "Online; notice period running; inconsistent details",
    urgency: "urgent",
    documentCompleteness: "partial",
    workflowState: "draft",
    background:
      "Cheque returned unpaid; memo branch differs from account records; first demand was ordinary post. Notice period under NI Act may be running.",
    backgroundHi:
      "चेक भुगतान रहित लौटाया गया; मेमो शाखा खाता रिकॉर्ड से भिन्न है; पहली मांग साधारण डाक थी।",
    documents: [
      "Original cheque",
      "Return memo",
      "Invoice",
      "Account ledger",
      "Bank statement",
      "Contract/Agreement",
      "Delivery proof",
      "Prior demand letter",
      "Postal tracking (if available)",
    ],
    missingDocuments: [
      "Bank confirmation of correct branch",
      "Acknowledgement of prior demand",
      "Proof of service address",
    ],
    documentGaps: [
      "Branch mismatch — which branch is correct — UNCONFIRMED",
      "Prior demand service proof — UNCONFIRMED",
      "Whether statutory limitation started from dishonour or from demand — UNCONFIRMED",
    ],
    clientRequest:
      "Issue valid demand and preserve complaint option.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Verify bank memo as primary record of dishonour",
        "Confirm correct branch through bank statement",
        "Check whether prior demand was validly served",
        "Calculate notice period from dishonour date",
        "Confirm service address is correct as per contract",
      ],
      research: [
        "Verify NI Act §138 notice period — 15 days from dishonour — UNCONFIRMED",
        "Check limitation for complaint — 30 days from notice expiry — UNCONFIRMED",
        "Assess whether branch mismatch affects validity of memo — UNCONFIRMED",
        "Verify current court practice on notice period computation — UNCONFIRMED",
      ],
      drafting: [
        "Statutory notice u/s 138 NI Act",
        "Service plan (registered post + email)",
        "Deadline input chart",
        "Complaint fact sheet",
        "Evidence index",
      ],
      review: [
        "Supervising advocate to verify notice period calculation",
        "Ensure notice does not create admissions about branch discrepancy",
      ],
      filing: [
        "Calculate complaint window after service of notice",
        "DO NOT file complaint if notice period not properly computed",
      ],
    },
    unresolvedFacts: [
      "Correct branch — UNCONFIRMED",
      "Prior demand service status — UNCONFIRMED",
      "Exact notice period calculation — UNCONFIRMED",
    ],
    adverseFact:
      "Bank statement shows cheque was presented at wrong branch by mistake — this may explain branch mismatch. Recorded as adverse fact; bank clarification needed before notice.",
    drafts: [
      { type: "notice", title: "Statutory Notice u/s 138 NI Act", status: "review-needed", jurisdiction: "Civil Court", limitationNote: "15 days from dishonour — computation pending", approvalRequired: true },
      { type: "memo", title: "Service Plan", status: "draft", approvalRequired: false },
      { type: "index", title: "Deadline Input Chart", status: "draft", approvalRequired: false },
      { type: "memo", title: "Complaint Fact Sheet", status: "intake-only", approvalRequired: false },
      { type: "index", title: "Evidence Index", status: "draft", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-015 — Private complaint for forged board resolution
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-015",
    title: "Private Complaint for Forged Board Resolution",
    domain: "Criminal / Complaint",
    complexity: "Advanced",
    approachStatus: "referral",
    approachStatusNote: "Referral; police called it civil; originals retained",
    urgency: "moderate",
    documentCompleteness: "incomplete",
    workflowState: "research-needed",
    background:
      "Minority shareholder alleges forged resolution enabled land sale; company retains minute book. Police declined to register FIR calling it civil dispute.",
    backgroundHi:
      "अल्पसंख्यक शेयरधारक का आरोप है कि जाली बोर्ड प्रस्ताव ने भूमि बिक्री को सक्षम बनाया; कंपनी मिनट बुक रखती है।",
    documents: [
      "Company incorporation documents",
      "Articles of Association",
      "Alleged forged resolution",
      "Minutes of meeting",
      "Registry filings (ROC)",
      "Sale deed executed",
      "Document opinion (handwriting expert)",
      "Police complaint entry",
      "Witness statements",
    ],
    missingDocuments: [
      "Certified copies from ROC",
      "Original minute book — company retains",
      "Shareholding pattern proof",
      "Police refusal letter (if any)",
    ],
    documentGaps: [
      "Minute book not in complainant's possession — company retains originals",
      "Whether resolution was actually passed — UNCONFIRMED",
      "Police refusal grounds — UNCONFIRMED",
    ],
    clientRequest:
      "Seek investigation/cognizance while preserving civil title remedies.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Obtain certified copies from ROC of all filings",
        "Secure handwriting expert's formal opinion",
        "Identify authority to challenge resolution (shareholder percentage)",
        "Document police refusal with written record",
        "Separate criminal forgery from civil title dispute",
      ],
      research: [
        "Verify CrPC provisions on private complaint when police refuses — UNCONFIRMED",
        "Check limitation for complaint — 3 years from discovery — UNCONFIRMED",
        "Assess whether forgery of resolution is criminal or civil — UNCONFIRMED",
        "Research precedent on corporate fraud complaints — UNCONFIRMED",
        "Check whether civil interim relief can be sought simultaneously — UNCONFIRMED",
      ],
      drafting: [
        "Private complaint before Magistrate",
        "Verification affidavit",
        "Witness list",
        "Preservation request (documents)",
        "Civil interim-relief matrix (alternative)",
      ],
      review: [
        "Supervising advocate to verify maintainability of criminal complaint",
        "Ensure complaint does not overlap with civil remedies",
      ],
      filing: [
        "Obtain certified filings from ROC first",
        "Distinguish personal knowledge from information in complaint",
        "Avoid conclusory forensic claims without expert report",
      ],
    },
    unresolvedFacts: [
      "Whether resolution was actually forged — UNCONFIRMED",
      "Police refusal written record — UNCONFIRMED",
      "Shareholding percentage — UNCONFIRMED",
      "Limitation for complaint — UNCONFIRMED",
    ],
    adverseFact:
      "Complainant attended the board meeting where resolution was allegedly passed and did not object — prosecution may argue implied consent. Recorded as adverse fact; assess impact on forgery claim.",
    drafts: [
      { type: "pleading", title: "Private Complaint u/s 200 CrPC", status: "research-needed", jurisdiction: "Magistrate Court", approvalRequired: true },
      { type: "affidavit", title: "Verification Affidavit", status: "draft", approvalRequired: true },
      { type: "index", title: "Witness List", status: "draft", approvalRequired: false },
      { type: "application", title: "Document Preservation Request", status: "draft", approvalRequired: false },
      { type: "memo", title: "Civil Interim-Relief Matrix", status: "intake-only", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "UNKNOWN",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-016 — Quash FIR from failed software contract
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-016",
    title: "Quash FIR from Failed Software Contract",
    domain: "Criminal / Inherent Jurisdiction",
    complexity: "Advanced",
    approachStatus: "cold-walk-in",
    approachStatusNote: "Walk-in after summons; civil contract; settlement possible",
    urgency: "urgent",
    documentCompleteness: "partial",
    workflowState: "draft",
    background:
      "Vendor missed milestones; customer alleges cheating after contractual termination; vendor offers documented refund. FIR registered for cheating.",
    backgroundHi:
      "विक्रेता ने मील का पत्थर चूक गया; ग्राहक ने अनुबंध समाप्ति के बाद धोखाधड़ी का आरोप लगाया; विक्रेता दस्तावेज वापसी की पेशकश करता है।",
    documents: [
      "FIR copy",
      "Software development contract",
      "Milestone deliverables",
      "Invoices",
      "Email correspondence",
      "Termination notice",
      "Refund offer documentation",
      "Civil/arbitration notices (if any)",
    ],
    missingDocuments: [
      "Copy of summons received",
      "Charge sheet (if filed)",
      "Arbitration clause status",
    ],
    documentGaps: [
      "Whether cheating ingredients are present — UNCONFIRMED",
      "Contractual dispute vs. criminal cheating — UNCONFIRMED",
      "Refund offer acceptance status — UNCONFIRMED",
    ],
    clientRequest:
      "Challenge criminal process if ingredients are absent or negotiate without admissions.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Compare FIR allegations with contractual timeline",
        "Test dishonest intent at inception — key for cheating",
        "Document refund offer with evidence",
        "Map each allegation to contract provisions",
        "Identify civil remedy exhaustion status",
      ],
      research: [
        "Verify High Court quashing jurisdiction under §482 CrPC — UNCONFIRMED",
        "Check ingredients of cheating §420 IPC — dishonest intent at inception — UNCONFIRMED",
        "Research precedent on contract dispute vs. cheating — UNCONFIRMED",
        "Assess settlement negotiation strategy without admissions",
        "Check whether arbitration clause was triggered — UNCONFIRMED",
      ],
      drafting: [
        "Quashing issue matrix",
        "Chronology",
        "Performance table",
        "Settlement term sheet",
        "No-admission letter",
      ],
      review: [
        "Supervising advocate to assess quashing viability",
        "Ensure settlement does not create admissions",
      ],
      filing: [
        "Never label dispute civil without reading allegations",
        "Consider settlement before filing quash petition",
        "File quash only if criminal ingredients clearly absent",
      ],
    },
    unresolvedFacts: [
      "Dishonest intent at inception — UNCONFIRMED",
      "Charge sheet status — UNCONFIRMED",
      "Refund offer response from complainant — UNCONFIRMED",
    ],
    adverseFact:
      "Vendor delivered no work for 3 months after receiving advance — prosecution may argue initial dishonest intent. Recorded as adverse fact; assess impact on cheating ingredients.",
    drafts: [
      { type: "memo", title: "Quashing Issue Matrix", status: "draft", approvalRequired: false },
      { type: "chronology", title: "Contract Chronology", status: "draft", approvalRequired: false },
      { type: "table", title: "Performance Table", status: "draft", approvalRequired: false },
      { type: "memo", title: "Settlement Term Sheet", status: "ready-for-supervising-advocate", approvalRequired: true },
      { type: "letter", title: "No-Admission Letter", status: "draft", approvalRequired: true },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-017 — Maintenance with informal income evidence
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-017",
    title: "Maintenance with Informal Income Evidence",
    domain: "Family / Maintenance",
    complexity: "Intermediate",
    approachStatus: "legal-aid-camp",
    approachStatusNote: "Legal-aid clinic; remedy unclear; income hidden",
    urgency: "moderate",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "Separated spouse supports two children; respondent runs cash-heavy business and sends irregular amounts. Income documentation limited.",
    backgroundHi:
      "पृथक हुए जीवनसाथी दो बच्चों का समर्थन करते हैं; प्रतिवादी नकदी-भारी व्यवसाय चलाता है और अनियमित राशि भेजता है।",
    documents: [
      "Marriage proof",
      "Child birth records",
      "School fee receipts",
      "Medical expense records",
      "Bank statements (limited)",
      "WhatsApp messages",
      "Business photos (informal)",
      "Property/vehicle clues",
      "Payment records (irregular)",
    ],
    missingDocuments: [
      "Formal income proof of respondent",
      "Business registration documents",
      "Tax returns of respondent",
      "Asset documentation",
    ],
    documentGaps: [
      "Income evidence is informal — cash business — UNCONFIRMED",
      "Business registration status — UNCONFIRMED",
      "Actual income level — UNCONFIRMED",
    ],
    clientRequest:
      "Secure periodic and interim support under current applicable route.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Document all expenses conservatively with receipts",
        "Trace irregular payments through bank where possible",
        "Identify business assets from available clues",
        "Map respondent's lifestyle indicators",
        "Separate proven expenses from estimates",
      ],
      research: [
        "Identify provision/forum — CrPC §125 vs. DV Act §20 vs. personal law — UNCONFIRMED",
        "Check disclosure procedures under current law — UNCONFIRMED",
        "Assess income estimation powers of court — UNCONFIRMED",
        "Verify interim maintenance procedure — UNCONFIRMED",
        "Research enforcement mechanisms — UNCONFIRMED",
      ],
      drafting: [
        "Needs assessment",
        "Maintenance application",
        "Interim affidavit",
        "Expense schedule",
        "Disclosure request",
        "Service plan",
      ],
      review: [
        "Supervising advocate to verify correct forum",
        "Ensure expense claims are conservative and documented",
      ],
      filing: [
        "File interim application first if urgent",
        "Separate facts from estimates in affidavit",
        "Seek disclosure where legally available",
      ],
    },
    unresolvedFacts: [
      "Actual income of respondent — UNCONFIRMED",
      "Correct forum — UNCONFIRMED",
      "Business legal status — UNCONFIRMED",
    ],
    adverseFact:
      "Applicant received substantial one-time payment from respondent 6 months ago — may be argued as advance maintenance. Recorded as adverse fact; clarify nature of payment before filing.",
    drafts: [
      { type: "memo", title: "Needs Assessment", status: "draft", approvalRequired: false },
      { type: "application", title: "Maintenance Application", status: "research-needed", jurisdiction: "Family Court", approvalRequired: true },
      { type: "affidavit", title: "Interim Maintenance Affidavit", status: "draft", approvalRequired: true },
      { type: "index", title: "Expense Schedule", status: "draft", approvalRequired: false },
      { type: "application", title: "Income Disclosure Request", status: "research-needed", approvalRequired: false },
      { type: "memo", title: "Service Plan", status: "draft", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "UNKNOWN",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-018 — Revision against interlocutory criminal order
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-018",
    title: "Revision Against Interlocutory Criminal Order",
    domain: "Criminal Procedure / Revision",
    complexity: "Advanced",
    approachStatus: "returning-client",
    approachStatusNote: "Returning client; screenshot only; next date in nine days",
    urgency: "urgent",
    documentCompleteness: "incomplete",
    workflowState: "research-needed",
    background:
      "Magistrate refused to summon a key document as irrelevant; certified copy of order unavailable. Next hearing in nine days.",
    backgroundHi:
      "मजिस्ट्रेट ने एक महत्वपूर्ण दस्तावेज को अप्रासंगिक कहकर तलब करने से इनकार कर दिया; आदेश की प्रमाणित प्रति अनुपलब्ध।",
    documents: [
      "Screenshot of order",
      "Complaint copy",
      "Applications filed",
      "Document sought to be summoned",
      "Witness statements",
      "Case material (partial)",
      "Next-date proof",
    ],
    missingDocuments: [
      "Certified copy of order — CRITICAL",
      "Complete case record",
      "Magistrate's reasoning for refusal",
    ],
    documentGaps: [
      "Screenshot only — not certified copy",
      "Magistrate's reasoning not available",
      "Whether revision is maintainable — UNCONFIRMED",
    ],
    clientRequest:
      "Challenge only if maintainable and materially prejudicial.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Obtain certified copy of order URGENTLY",
        "Secure complete case record",
        "Identify prejudice from non-summoning",
        "Test whether order is interlocutory or final",
        "Map limitation period for revision",
      ],
      research: [
        "Verify revision maintainability against interlocutory orders — UNCONFIRMED",
        "Check limitation for revision — UNCONFIRMED",
        "Research whether evidence order is revisable — UNCONFIRMED",
        "Assess alternative remedies (appeal, revision to Sessions) — UNCONFIRMED",
      ],
      drafting: [
        "Certified-copy request",
        "Maintainability note",
        "Revision skeleton",
        "Stay request",
        "Hearing brief",
      ],
      review: [
        "Supervising advocate to confirm maintainability",
        "Ensure revision is not premature without certified copy",
      ],
      filing: [
        "Obtain certified order and record first",
        "Do not assume discretionary evidence order is revisable",
        "Articulate specific prejudice in revision",
      ],
    },
    unresolvedFacts: [
      "Certified copy of order — PENDING",
      "Maintainability of revision — UNCONFIRMED",
      "Limitation period — UNCONFIRMED",
    ],
    adverseFact:
      "Document sought was already produced earlier and marked irrelevant — Magistrate may have grounds for refusal. Recorded as adverse fact; assess before revision.",
    drafts: [
      { type: "application", title: "Certified Copy Request", status: "ready-for-supervising-advocate", approvalRequired: false },
      { type: "memo", title: "Maintainability Note", status: "research-needed", approvalRequired: false },
      { type: "pleading", title: "Revision Petition Skeleton", status: "blocked", approvalRequired: true, blockedReason: "Certified copy not obtained; maintainability not confirmed" },
      { type: "application", title: "Stay Request", status: "research-needed", approvalRequired: true },
      { type: "memo", title: "Hearing Brief", status: "intake-only", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-019 — Criminal appeal on circumstantial evidence
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-019",
    title: "Criminal Appeal on Circumstantial Evidence",
    domain: "Criminal / Appeal",
    complexity: "Expert",
    approachStatus: "referral",
    approachStatusNote: "Family referral; long judgment; sentence begins",
    urgency: "critical",
    documentCompleteness: "incomplete",
    workflowState: "intake-only",
    background:
      "Conviction rests on circumstantial chain; exhibits and depositions are incomplete; sentence from yesterday. Appeal limitation urgent.",
    backgroundHi:
      "दोषसिद्धि परिस्थितिजात साक्ष्य श्रृंखला पर आधारित है; प्रदर्शन और गवाही अपूर्ण हैं; सजा कल हुई।",
    documents: [
      "Judgment copy",
      "Sentence order",
      "FIR copy",
      "Depositions (partial)",
      "Exhibits list (incomplete)",
      "Custody records",
      "Trial file (partial)",
      "Forensic reports (if any)",
      "Bail history",
    ],
    missingDocuments: [
      "Complete trial record — CRITICAL",
      "All deposition transcripts",
      "All exhibits properly indexed",
      "Certified copies of key documents",
    ],
    documentGaps: [
      "Trial record incomplete — cannot assess evidence chain",
      "Exhibits not properly indexed",
      "Whether all links in circumstantial chain are complete — UNCONFIRMED",
    ],
    clientRequest:
      "File timely appeal and seek suspension where supportable without invented contradictions.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Secure complete trial record URGENTLY",
        "Map each circumstance to source in record",
        "Compute limitation and custody period",
        "Identify missing pages and exhibits",
        "Separate appeal grounds from suspension grounds",
      ],
      research: [
        "Verify appeal limitation — 30/90 days from judgment — UNCONFIRMED",
        "Check suspension sentence requirements — UNCONFIRMED",
        "Research circumstantial evidence five-prong test — UNCONFIRMED",
        "Assess whether incomplete record affects limitation — UNCONFIRMED",
      ],
      drafting: [
        "Appeal memo",
        "Suspension application",
        "Paper-book index",
        "Evidence matrix",
        "Chronology",
        "Questions of law",
      ],
      review: [
        "Supervising advocate must approve appeal before filing",
        "Ensure suspension grounds are distinct from appeal merits",
      ],
      filing: [
        "File appeal within limitation — compute TODAY",
        "Mark missing pages as unknown in paper book",
        "Do not invent contradictions to evidence chain",
      ],
    },
    unresolvedFacts: [
      "Complete trial record — PENDING",
      "Limitation period — URGENT COMPUTATION",
      "Circumstantial chain completeness — UNCONFIRMED",
    ],
    adverseFact:
      "Trial record shows accused fled scene — this may complete motive link in circumstantial chain. Recorded as adverse fact; assess impact on appeal strategy.",
    drafts: [
      { type: "pleading", title: "Criminal Appeal Memo", status: "blocked", jurisdiction: "High Court", approvalRequired: true, blockedReason: "Complete trial record not obtained; limitation computation pending" },
      { type: "application", title: "Sentence Suspension Application", status: "blocked", approvalRequired: true, blockedReason: "Trial record incomplete" },
      { type: "index", title: "Paper-Book Index", status: "intake-only", approvalRequired: false },
      { type: "memo", title: "Evidence Matrix", status: "intake-only", approvalRequired: false },
      { type: "chronology", title: "Appeal Chronology", status: "intake-only", approvalRequired: false },
      { type: "memo", title: "Questions of Law", status: "intake-only", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-020 — SLP viability after concurrent findings
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-020",
    title: "SLP Viability After Concurrent Findings",
    domain: "Supreme Court / SLP",
    complexity: "Expert",
    approachStatus: "referral",
    approachStatusNote: "Senior referral; remedies exhausted; client wants one more chance",
    urgency: "moderate",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "Public authority lost on land classification; large bundle but no identified legal question or record error. Concurrent findings by two courts.",
    backgroundHi:
      "सार्वजनिक प्राधिकरण भूमि वर्गीकरण पर हार गया; बड़ा बंडल लेकिन कोई पहचाना गया कानूनी प्रश्न या रिकॉर्ड त्रुटि नहीं।",
    documents: [
      "Impugned judgment (High Court)",
      "Prior judgment (lower court)",
      "Pleadings",
      "Admitted documents",
      "Government notifications",
      "Certified orders",
      "Limitation chart",
      "Authorisation letter",
    ],
    missingDocuments: [
      "Leave to appeal status (if any)",
      "Complete paper book",
      "Special leave petition drafts (if any)",
    ],
    documentGaps: [
      "No identified legal question — grounds unclear",
      "Record error not apparent",
      "Public importance not articulated",
    ],
    clientRequest:
      "Decide responsibly whether to file, including a no-filing recommendation.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Identify any substantial question of law",
        "Check for jurisdictional error or perversity",
        "Verify limitation for SLP",
        "Assess public importance element",
        "Review record for any error apparent",
      ],
      research: [
        "Verify SLP maintainability under Art. 136 — UNCONFIRMED",
        "Check limitation — 90 days from judgment — UNCONFIRMED",
        "Research concurrent findings doctrine — UNCONFIRMED",
        "Assess public importance threshold — UNCONFIRMED",
      ],
      drafting: [
        "Viability memo",
        "Limitation computation",
        "Synopsis if viable",
        "Senior brief",
        "Risk consent",
      ],
      review: [
        "Senior counsel must be consulted before any SLP decision",
        "No-filing recommendation must be documented",
      ],
      filing: [
        "Hold risk conference with client",
        "File SLP only if clear question of law or jurisdictional error",
        "Document reasons for go/no-go decision",
      ],
    },
    unresolvedFacts: [
      "Substantial question of law — NOT IDENTIFIED",
      "Limitation status — UNCONFIRMED",
      "Public importance — NOT ESTABLISHED",
    ],
    adverseFact:
      "Client declined to challenge earlier judgment despite advice — may affect limitation or waiver arguments. Recorded as adverse fact; assess limitation impact.",
    drafts: [
      { type: "memo", title: "SLP Viability Memo", status: "draft", approvalRequired: false },
      { type: "index", title: "Limitation Computation", status: "draft", approvalRequired: false },
      { type: "memo", title: "Synopsis (Conditional)", status: "blocked", approvalRequired: true, blockedReason: "Viability not established" },
      { type: "memo", title: "Senior Brief", status: "intake-only", approvalRequired: false },
      { type: "memo", title: "Risk Consent", status: "intake-only", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-021 — Habeas corpus request for adult relative
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-021",
    title: "Habeas Corpus Request for Adult Relative",
    domain: "Constitutional / Habeas Corpus",
    complexity: "Advanced",
    approachStatus: "urgent-referral",
    approachStatusNote: "Emergency call; missing-person complaint exists",
    urgency: "critical",
    documentCompleteness: "partial",
    workflowState: "intake-only",
    background:
      "Family suspects unlawful confinement but has no direct evidence; messages suggest the adult may have chosen to leave. Missing-person complaint filed.",
    backgroundHi:
      "परिवार को अवैध निरोध की आशंका है लेकिन कोई प्रत्यक्ष साक्ष्य नहीं है; संदेश सुझाव देते हैं कि वयस्क ने जाने का विकल्प चुना हो सकता है।",
    documents: [
      "Missing-person complaint",
      "Lawful call details",
      "CCTV request (pending)",
      "Messages",
      "ID proof",
      "Witness statements",
      "Voluntary vulnerability information",
    ],
    missingDocuments: [
      "Direct evidence of confinement",
      "Police investigation report",
      "CCTV footage",
      "Last known location proof",
    ],
    documentGaps: [
      "No direct evidence of unlawful confinement",
      "Messages suggest voluntary departure",
      "Age and capacity not formally verified",
    ],
    clientRequest:
      "Seek welfare verification only if exceptional threshold is supported; do not coerce an adult.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Verify age through ID proof",
        "Assess mental capacity if vulnerability alleged",
        "Secure all messages without alteration",
        "Document police steps taken",
        "Identify any vulnerability indicators",
      ],
      research: [
        "Verify habeas corpus threshold for adults — UNCONFIRMED",
        "Check police investigation status — UNCONFIRMED",
        "Assess whether voluntary departure defeats habeas corpus — UNCONFIRMED",
        "Research safe welfare protocol — UNCONFIRMED",
      ],
      drafting: [
        "Verification note",
        "Police representation",
        "Issue matrix",
        "Confidentiality request",
        "Petition (conditional — only if threshold met)",
      ],
      review: [
        "Supervising advocate must assess exceptional threshold",
        "Ensure petition does not coerce adult autonomy",
      ],
      filing: [
        "Do not access devices unlawfully or publish location",
        "File habeas corpus only if exceptional threshold established",
        "Ordinary remedies (police investigation) first",
      ],
    },
    unresolvedFacts: [
      "Age — UNCONFIRMED",
      "Capacity — UNCONFIRMED",
      "Confinement evidence — NONE",
      "Voluntary departure — SUGGESTED by messages",
    ],
    adverseFact:
      "Messages show adult expressed desire to leave family and live independently — this may be voluntary departure, not confinement. Recorded as adverse fact; may defeat habeas corpus threshold.",
    drafts: [
      { type: "memo", title: "Verification Note", status: "draft", approvalRequired: false },
      { type: "letter", title: "Police Representation", status: "draft", approvalRequired: false },
      { type: "memo", title: "Issue Matrix", status: "draft", approvalRequired: false },
      { type: "application", title: "Confidentiality Request", status: "intake-only", approvalRequired: false },
      { type: "pleading", title: "Habeas Corpus Petition (Conditional)", status: "blocked", approvalRequired: true, blockedReason: "Exceptional threshold not established; voluntary departure possible" },
    ],
    citationGate: "PENDING",
    limitationGate: "UNKNOWN",
    syntheticLabel: "SYNTHETIC / DEMO",
  },
] as Array<Omit<IntakeExample, "terminalOutcome">>).map(withTerminalOutcome);

export type { IntakeExample as Week02IntakeExample };
