/**
 * WEEK 01 — KIRO — Drafting Intake Examples EX-001 to EX-011
 * Source: SUPPLEMENT/SUPPLEMENT REPLIT/WEEK_01_KIRO.md
 * Schema: 5-part intake workflow per Legal Luminaire accuracy-rules.md
 *
 * ALL DATA IS SYNTHETIC / DEMO — not legal advice — not filing-ready
 * without supervising-advocate approval. Verify all statutes, citations,
 * limitation periods and court rules before any real-world use.
 *
 * Training control: every unverified assertion = UNCONFIRMED.
 * Never invent a date, statute, citation, party, amount or document.
 */

import type {
  ApproachStatus,
  DocumentCompleteness,
  DraftState,
  IntakeExample,
} from "./intake-example-types";
import { withTerminalOutcome } from "./intake-example-utils";

export type { ApproachStatus, DocumentCompleteness, DraftState, IntakeExample };

export const WEEK01_EXAMPLES = ([
  // ─────────────────────────────────────────────────────────────────────────
  // EX-001 — Unpaid MSME Invoice after Accepted Delivery
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-001",
    title: "Unpaid MSME Invoice after Accepted Delivery",
    domain: "Commercial Recovery / MSMED",
    complexity: "Intermediate",
    approachStatus: "cold-walk-in",
    approachStatusNote: "Pre-litigation; clear request; no prior legal action.",
    urgency: "moderate",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "A Delhi-based fabrication unit (synthetic name: Prakash Steel Works, MSME-registered) delivered custom steel frames under a purchase order to a builder (synthetic: Vardhman Constructions). Accepted invoices totalling ₹[AMOUNT UNCONFIRMED] remain unpaid for 145 days. Client fears the builder may dissipate assets. No prior legal notice sent.",
    backgroundHi:
      "दिल्ली की एक निर्माण इकाई (MSME-पंजीकृत) ने एक बिल्डर को स्वीकृत चालान के तहत स्टील फ्रेम वितरित किए। 145 दिनों से भुगतान नहीं हुआ।",
    documents: [
      "Purchase Order (PO)",
      "Tax invoices (accepted)",
      "E-way bills",
      "Signed delivery challans",
      "GST registration certificate",
      "Account ledger (client copy)",
      "Email correspondence",
      "WhatsApp export (partial)",
      "Bank statement showing non-receipt",
    ],
    missingDocuments: [
      "Counter-signed acknowledgement of acceptance by builder (formal)",
      "Any written contract beyond PO",
      "Bank account statement of respondent (unavailable at intake)",
    ],
    documentGaps: [
      "WhatsApp export not in prescribed format — authenticity unconfirmed",
      "No formal written contract — PO + challan is the documentary basis",
      "Interest rate in contract UNCONFIRMED",
    ],
    clientRequest:
      "Recover principal, contractual interest, and any statutory interest under MSMED Act without rushing into court. Explore demand first.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Verify MSME registration and category (Micro/Small/Medium)",
        "Confirm entity type of respondent — proprietorship/company/LLP",
        "Reconcile ledger amounts against invoices",
        "Confirm acceptance by signed challans — obtain originals",
        "Check for any partial payment or deduction",
      ],
      research: [
        "Verify MSMED Act 2006 §15–18 interest and facilitation council route — current law check",
        "Check limitation: 3 years from date each invoice became due (Limitation Act Art. 137) — UNCONFIRMED",
        "Assess whether Facilitation Council (MSEFC) or civil suit is faster in Delhi",
        "Check if respondent is listed company — NCLT pre-pack insolvency risk",
        "Verify contractual interest clause; default to MSMED compounded rate if absent — rate UNCONFIRMED",
      ],
      drafting: [
        "Measured demand notice (not aggressive) — with clear payment deadline",
        "Settlement term sheet (optional — if client open to negotiation)",
        "Evidence index / chronology",
      ],
      review: [
        "Supervising advocate to approve demand notice wording before dispatch",
        "Confirm service method — registered post + email",
      ],
      filing: [
        "DO NOT FILE without: verifying limitation, confirming MSEFC vs. civil jurisdiction, and supervising-advocate approval",
        "MSEFC complaint or summary suit skeleton — prepare but do not file",
      ],
    },
    unresolvedFacts: [
      "Exact interest rate agreed in contract — UNCONFIRMED",
      "Whether partial payment made and not reflected in ledger",
      "Whether respondent is in insolvency proceedings",
      "Award date of limitation — precise invoice due dates UNCONFIRMED",
    ],
    adverseFact:
      "WhatsApp export shows client deferred delivery by 3 weeks on two occasions — this may raise a partial-breach defence by respondent. Workflow records this as UNCONFIRMED adverse fact; action plan includes verification step before drafting.",
    drafts: [
      { type: "chronology", title: "Evidence Chronology — EX-001", status: "draft", approvalRequired: false },
      { type: "index", title: "Evidence Index", status: "draft", approvalRequired: false },
      { type: "notice", title: "Demand Notice u/s MSMED Act 2006", status: "review-needed", jurisdiction: "Delhi", limitationNote: "3 years from due date — UNCONFIRMED", approvalRequired: true },
      { type: "memo", title: "Forum Selection Memo (MSEFC vs Civil Suit)", status: "research-needed", approvalRequired: false, blockedReason: "Jurisdiction not confirmed" },
      { type: "pleading", title: "Recovery Brief / Contingent Pleading Skeleton", status: "blocked", approvalRequired: true, blockedReason: "Forum not decided; limitation not verified" },
    ],
    citationGate: "PENDING",
    limitationGate: "UNKNOWN",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-002 — Boundary Wall and Threatened Dispossession
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-002",
    title: "Boundary Wall Encroachment and Threatened Dispossession",
    domain: "Property / Injunction",
    complexity: "Advanced",
    approachStatus: "referral",
    approachStatusNote: "Referred by former client; matter starts tomorrow; urgent.",
    urgency: "urgent",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "A retired teacher (synthetic: Kamla Devi) says her neighbour (synthetic: Mohan Lal) shifted a boundary wall 2 metres into her plot overnight and has threatened to remove her gate by weekend. Title measurements conflict between her sale deed and neighbour's mutation.",
    documents: [
      "Sale deed (original — brought to office)",
      "Mutation entry (partial copy)",
      "Site plan (not to scale — unverified)",
      "Property tax receipts",
      "Photographs (timestamps visible, but metadata not authenticated)",
      "Revenue survey sketch (photocopy)",
      "Identity proof (Aadhaar)",
      "Statement of two witnesses",
      "Audio recording (unverified — not certified)",
    ],
    missingDocuments: [
      "Certified copy of mutation from revenue office",
      "Independent survey by licensed surveyor",
      "Chain of title from original grant",
      "Neighbour's sale deed / title document",
    ],
    documentGaps: [
      "Audio recording — admissibility uncertain; not presented in certified form",
      "Site plan not to scale and not verified by revenue authority",
      "Neighbour's basis of title is UNCONFIRMED",
    ],
    clientRequest:
      "Stop construction immediately. Prevent dispossession while title and measurement disputes are resolved.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Obtain certified copies of mutation and revenue records urgently",
        "Commission independent licensed surveyor — today",
        "Separate three distinct questions: possession, title, and measurement",
        "Preserve photo metadata and timestamps — do not alter",
        "Identify and secure two witnesses formally",
      ],
      research: [
        "Assess Order 39 Rule 1 & 2 CPC interim injunction test: prima facie case, balance of convenience, irreparable harm",
        "Check relevant tenancy/property enactments for the state — UNCONFIRMED",
        "Verify limitation for title declaration — UNCONFIRMED",
        "Check if revenue authority has a separate mutation dispute process",
      ],
      drafting: [
        "Urgent intake memo — today",
        "Interim injunction application (suit + application filed together)",
        "Declaration + permanent injunction plaint skeleton",
        "Request for survey/inspection by court commissioner",
      ],
      review: [
        "Supervising advocate must approve injunction application before filing",
        "Verify plaint does not rely on unverified audio or unauthenticated site plan",
      ],
      filing: [
        "DO NOT FILE without independent survey and certified mutation — injunction may fail on facts",
        "Emergency filing only if dispossession is physically imminent and all originals verified",
      ],
    },
    unresolvedFacts: [
      "Exact coordinates of boundary — survey pending",
      "Neighbour's basis of ownership — UNCONFIRMED",
      "Whether any prior settlement or demarcation agreement exists",
      "Admissibility of audio recording — UNCONFIRMED",
    ],
    adverseFact:
      "Site plan brought by client shows measurements that differ from revenue records by 0.8 m — this contradicts client's claim of 2-metre encroachment. Recorded as UNCONFIRMED adverse fact; independent survey is mandatory before any pleading.",
    drafts: [
      { type: "memo", title: "Urgent Intake Memo — EX-002", status: "draft", approvalRequired: false },
      { type: "application", title: "Interim Injunction Application O.39 R.1&2 CPC", status: "blocked", jurisdiction: "Civil Court", approvalRequired: true, blockedReason: "Independent survey not yet obtained" },
      { type: "pleading", title: "Plaint — Declaration + Permanent Injunction (Skeleton)", status: "research-needed", approvalRequired: true },
      { type: "application", title: "Court Commissioner / Inspection Request", status: "draft", approvalRequired: false },
      { type: "checklist", title: "Affidavit Checklist", status: "draft", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-003 — Defective Apartment Handover with Concealed Seepage
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-003",
    title: "Defective Apartment Handover — Concealed Seepage and Electrical Risk",
    domain: "Consumer / Real Estate",
    complexity: "Advanced",
    approachStatus: "online-intake",
    approachStatusNote: "Online intake form submitted; incomplete papers; limitation urgently needs review.",
    urgency: "moderate",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "Seepage through walls and unsafe electrical work became evident 6 months after possession of a flat (synthetic: Sunrise Towers, Pune). Developer (synthetic: Sunrise Developers) offered cosmetic repair and presented a broad liability waiver. Client (synthetic: Priya Kulkarni) signed nothing but is worried.",
    documents: [
      "Builder-buyer agreement",
      "Allotment letter",
      "Possession letter",
      "Photographs of seepage and electrical panel",
      "Independent engineer's inspection report (informal)",
      "Payment receipts",
      "Emails with developer",
      "Draft waiver sent by developer (not signed)",
      "Regulator (MahaRERA) correspondence (if any — not provided)",
    ],
    missingDocuments: [
      "Registered engineer / structural report on seepage cause",
      "MahaRERA registration certificate and project registration",
      "OC (Occupancy Certificate) status",
      "Any previous complaints to developer",
    ],
    documentGaps: [
      "Engineer report is informal — not from a registered structural engineer",
      "MahaRERA correspondence not provided — limits RERA forum assessment",
      "Waiver not signed — preserves rights, but developer may argue oral acceptance",
    ],
    clientRequest:
      "Get the defect repaired properly, receive compensation and interest, and recover costs through the most efficient forum.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Obtain registered structural engineer's report urgently",
        "Verify MahaRERA registration of project",
        "Confirm OC status — if no OC, additional reliefs may be available",
        "Preserve all originals — do not sign any waiver",
        "Build forum matrix: RERA vs Consumer Commission vs Civil Court",
      ],
      research: [
        "Check RERA 2016 §14 warranty period for structural defects — 5 years — UNCONFIRMED for latent defects",
        "Limitation under Consumer Protection Act 2019 — 2 years from discovery — UNCONFIRMED",
        "Whether latent/continuing defect extends limitation — UNCONFIRMED",
        "Whether waiver (unsigned) can be implied — UNCONFIRMED",
        "Assess duplicate relief risk across RERA + Consumer Commission",
      ],
      drafting: [
        "Defect notice to developer (written, registered post)",
        "Forum selection memo",
        "Complaint facts draft",
        "Inspection application",
      ],
      review: [
        "Supervising advocate to review forum memo before filing",
        "Ensure defect notice does not create admissions",
      ],
      filing: [
        "DO NOT FILE until forum is chosen and structural report is formal and verified",
      ],
    },
    unresolvedFacts: [
      "Cause of seepage — structural defect or owner modification — UNCONFIRMED",
      "Whether OC was obtained by developer — UNCONFIRMED",
      "Limitation start date — discovery vs. possession — UNCONFIRMED",
      "Whether any prior verbal complaint was made to developer",
    ],
    adverseFact:
      "Client mentioned she made a minor modification to a bathroom wall 2 months after possession — this is an adverse fact that developer may use to argue owner-caused damage. Recorded as UNCONFIRMED; structural report must address this specifically.",
    drafts: [
      { type: "notice", title: "Defect Notice to Developer", status: "review-needed", approvalRequired: true },
      { type: "memo", title: "Forum Selection Memo (RERA / Consumer / Civil)", status: "research-needed", approvalRequired: false },
      { type: "pleading", title: "Consumer Complaint Facts Draft", status: "blocked", approvalRequired: true, blockedReason: "Forum not chosen; structural report informal" },
      { type: "application", title: "Inspection Application", status: "draft", approvalRequired: false },
      { type: "index", title: "Evidence Schedule", status: "draft", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-004 — Tenant Receives Ejectment Notice
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-004",
    title: "Tenant Receives Ejectment Notice — Arrears and Alteration Allegations",
    domain: "Tenancy / Notice",
    complexity: "Intermediate",
    approachStatus: "returning-client",
    approachStatusNote: "Returning client; response due in 12 days; moderate urgency.",
    urgency: "moderate",
    documentCompleteness: "partial",
    workflowState: "draft",
    background:
      "Landlord (synthetic: Ramesh Gupta) served a notice on tenant (synthetic: Suresh Mehta) alleging rent arrears for 4 months and unauthorised alteration of shop premises. Tenant says rent was always accepted by bank transfer and the alteration (partition wall) was orally approved by landlord's son.",
    documents: [
      "Lease agreement (original)",
      "Renewal letters (if any)",
      "Rent receipts (last 12 months)",
      "Bank transfer records showing rent payments",
      "Notice received (original)",
      "Repair/alteration invoices",
      "WhatsApp messages with landlord's son re: alteration approval",
      "Photographs of premises before and after",
      "Trade licence",
    ],
    missingDocuments: [
      "Written consent from landlord for alteration — not available",
      "Receipts for 3 months where payment was by cash — missing",
    ],
    documentGaps: [
      "Oral approval for alteration — WhatsApp messages are with landlord's son, not landlord — evidentiary value UNCONFIRMED",
      "3 months cash rent — no receipt — UNCONFIRMED",
    ],
    clientRequest:
      "Reply to notice, cure genuine arrears if any, and protect possession without making harmful admissions.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Reconcile rent ledger against all receipts and bank records",
        "Identify exactly which months are disputed and why",
        "Obtain WhatsApp messages with complete chain",
        "Check if landlord accepted rent after alterations — estoppel argument",
        "Verify applicable tenancy regime (state rent control or Transfer of Property Act) — UNCONFIRMED",
      ],
      research: [
        "Identify correct tenancy regime for the city — state-specific — UNCONFIRMED",
        "Test notice for valid service and correct statutory form",
        "Check whether oral approval + acceptance of rent post-alteration creates waiver",
        "Verify limitation for responding to notice and for suit for recovery of possession",
      ],
      drafting: [
        "Arrears reconciliation table",
        "Advocate reply to notice (measured — no admissions)",
        "Without-prejudice settlement offer (optional)",
        "Written statement issue list (if suit filed)",
        "Interim protection options memo",
      ],
      review: [
        "Supervising advocate to review reply before dispatch",
        "Ensure reply does not admit alteration",
      ],
      filing: [
        "Tender undisputed rent amount by DD/RTGS to landlord account traceably before reply deadline",
        "DO NOT file any application without supervising-advocate approval",
      ],
    },
    unresolvedFacts: [
      "Applicable tenancy regime — state-specific — UNCONFIRMED",
      "Whether landlord accepted rent after alteration — check bank records",
      "Cash rent for 3 months — no receipt — adverse gap",
      "Oral approval for alteration — status UNCONFIRMED",
    ],
    adverseFact:
      "Client admits partition wall altered load-bearing calculation — structural safety not verified. This is an adverse fact that may affect legality of alteration beyond mere landlord approval. Recorded; structural assessment to be obtained before any admission in reply.",
    drafts: [
      { type: "index", title: "Arrears Reconciliation Table", status: "draft", approvalRequired: false },
      { type: "notice", title: "Advocate Reply to Ejectment Notice", status: "review-needed", approvalRequired: true },
      { type: "memo", title: "Settlement Offer (Without Prejudice)", status: "draft", approvalRequired: true },
      { type: "checklist", title: "Written Statement Issue List", status: "intake-only", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-005 — Specific Performance after Higher Offer
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-005",
    title: "Specific Performance Suit — Seller Accepts Higher Offer for Industrial Land",
    domain: "Contract / Specific Performance",
    complexity: "Advanced",
    approachStatus: "cold-walk-in",
    approachStatusNote: "Walk-in; seller has already repudiated; partial file; 60% complete.",
    urgency: "urgent",
    documentCompleteness: "partial",
    workflowState: "draft",
    background:
      "Purchaser (synthetic: Anand Joshi) paid advance under a registered agreement to sell industrial land. Seller (synthetic: Vikram Singh) has accepted a higher offer and returned only part of the advance by cheque. Client wants the land, not money.",
    documents: [
      "Agreement to sell (registered copy)",
      "Advance payment proof (DD + receipt)",
      "Correspondence showing repudiation",
      "Title search report (partial)",
      "Draft sale deed prepared",
      "Partial refund cheque from seller",
      "Witness statements (2)",
      "Valuation certificate (informal)",
    ],
    missingDocuments: [
      "Full certified title search (for 30 years) — not yet obtained",
      "Encumbrance certificate",
      "Revenue records confirming seller's ownership",
    ],
    documentGaps: [
      "Valuation is informal — not from registered valuer",
      "Whether seller has already executed sale deed with third party — UNCONFIRMED",
      "Property description in agreement — check survey numbers — UNCONFIRMED",
    ],
    clientRequest:
      "Enforce the agreement and obtain specific performance; alternatively, full refund, compensation and protection against alienation to a third party.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Verify readiness and willingness of purchaser",
        "Confirm property description matches revenue records",
        "Check registration of agreement for enforceability",
        "Verify whether seller has already executed deed with third party",
        "Preserve and secure original agreement",
      ],
      research: [
        "Verify Specific Relief Act 2018 §10 — specific performance now discretionary — assess court approach",
        "Check limitation — Art. 54 Limitation Act: 3 years from date of performance — UNCONFIRMED",
        "Assess whether partial refund cheque amounts to acceptance and creates any obligation",
        "Research lis pendens under TPA §52 to protect against alienation",
        "Stamp duty and registration compliance of agreement",
      ],
      drafting: [
        "Performance notice to seller",
        "List of dates",
        "Specific performance plaint (alternative: refund + compensation)",
        "Interim restraint application u/O.39 R.1&2 + TPA §52",
        "Affidavit checklist",
      ],
      review: [
        "Supervising advocate to approve plaint before filing",
        "Independent valuation required for quantifying compensation alternative",
      ],
      filing: [
        "File interim restraint simultaneously with plaint",
        "DO NOT file without complete title search and encumbrance certificate",
      ],
    },
    unresolvedFacts: [
      "Whether seller has already transferred to third party — UNCONFIRMED — CRITICAL",
      "Full title chain — 30 years — UNCONFIRMED",
      "Whether partial refund cheque has been encashed — check",
      "Readiness/willingness at time of performance date — verify with client",
    ],
    adverseFact:
      "Client encashed the partial refund cheque. This may be argued as acceptance of rescission. Recorded as adverse fact; supervising advocate must assess whether encashment amounts to accord and satisfaction before filing suit.",
    drafts: [
      { type: "notice", title: "Performance Notice to Seller", status: "ready-for-supervising-advocate", approvalRequired: true },
      { type: "chronology", title: "List of Dates", status: "draft", approvalRequired: false },
      { type: "pleading", title: "Specific Performance Plaint (with alternative relief)", status: "review-needed", approvalRequired: true, blockedReason: "Partial refund encashment — adverse fact unresolved" },
      { type: "application", title: "Interim Restraint Application", status: "blocked", approvalRequired: true, blockedReason: "Title search incomplete" },
      { type: "checklist", title: "Affidavit Checklist", status: "draft", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-006 — Partition with Co-Sharer Abroad
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-006",
    title: "Partition of Ancestral Property — Co-Sharer Abroad, Old Mortgage",
    domain: "Family Property / Partition",
    complexity: "Advanced",
    approachStatus: "referral",
    approachStatusNote: "Accountant referral; multiple stakeholders; no emergency.",
    urgency: "routine",
    documentCompleteness: "incomplete",
    workflowState: "intake-only",
    background:
      "Three siblings (synthetic: Ramesh, Sunita, Anil) dispute an ancestral house and adjacent land. One sibling (Anil) is abroad. One parcel carries an old mortgage whose status is unclear. A family settlement memorandum was drafted but never signed.",
    documents: [
      "Title deeds (original)",
      "Revenue records (khasra/khatauni)",
      "Death certificates (father and mother)",
      "Family tree affidavit (draft — unsigned)",
      "Property tax receipts",
      "Old mortgage document",
      "Unsigned family settlement memorandum",
      "POAs (if any — not yet verified)",
      "Correspondence between siblings",
    ],
    missingDocuments: [
      "Succession certificate or probate (if any will exists)",
      "Status of mortgage — current outstanding, discharge or continuation",
      "Anil's formally executed POA from abroad",
      "Whether any prior partition was effected",
    ],
    documentGaps: [
      "Mortgage status UNCONFIRMED — may affect share calculation",
      "Unsigned memorandum has no legal effect until executed",
      "Family tree not yet sworn — untested",
      "Whether property is HUF or separate property — UNCONFIRMED",
    ],
    clientRequest:
      "Establish each sibling's share, account for alienations and the mortgage, preferably through a registered family settlement if safe.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Verify whether property is HUF or individual inherited property",
        "Establish date of father's death and applicable succession law",
        "Ascertain mortgage status — visit bank / revenue office",
        "Verify Anil's status — citizen/OCI — for POA requirements",
        "Identify all necessary parties including mortgagee",
      ],
      research: [
        "Applicable personal law / Hindu Succession Act 2005 amendments for daughters — verify",
        "Limitation for partition suit — Art. 65 Limitation Act — UNCONFIRMED",
        "Whether family settlement requires registration — values above threshold — UNCONFIRMED",
        "Effect of mortgage on partition — charge must be accounted for",
        "Whether absent co-sharer requires separate representation or appointment of commissioner",
      ],
      drafting: [
        "Family tree affidavit",
        "Asset schedule",
        "Settlement notice / invitation",
        "Plaint framework (partition suit) — if settlement fails",
        "Mediation brief",
        "POA review note",
      ],
      review: [
        "Do not send settlement proposal without mortgage status resolved",
        "Supervising advocate must verify limitation before filing",
      ],
      filing: [
        "DO NOT FILE until: mortgage status confirmed, POA verified, all parties identified",
      ],
    },
    unresolvedFacts: [
      "Whether property is HUF — UNCONFIRMED",
      "Mortgage balance and bank's position — UNCONFIRMED",
      "Anil's share if any prior family arrangement — UNCONFIRMED",
      "Whether unsigned memorandum creates any partial admission",
    ],
    adverseFact:
      "Revenue records show an entry in Sunita's name alone for one parcel — this may indicate a prior unregistered partition or a mutation without legal authority. Recorded as adverse fact requiring investigation before any plaint is filed.",
    drafts: [
      { type: "affidavit", title: "Family Tree Affidavit", status: "intake-only", approvalRequired: false },
      { type: "index", title: "Asset Schedule", status: "intake-only", approvalRequired: false },
      { type: "notice", title: "Settlement Invitation / Notice", status: "blocked", approvalRequired: true, blockedReason: "Mortgage status unresolved; all parties not identified" },
      { type: "pleading", title: "Partition Plaint Framework", status: "research-needed", approvalRequired: true },
      { type: "memo", title: "Mediation Brief", status: "intake-only", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "UNKNOWN",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-007 — Domestic Violence Intake with Safety Concern
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-007",
    title: "Domestic Violence Intake — Safety-Sensitive; Location Protection Required",
    domain: "Family / Protective Relief",
    complexity: "Intermediate",
    approachStatus: "urgent-referral",
    approachStatusNote: "Urgent referral via women's shelter; unclear what relief client wants; safety-sensitive.",
    urgency: "critical",
    documentCompleteness: "partial",
    workflowState: "blocked",
    background:
      "Client (synthetic: Meena, name withheld in records) left the shared home with her child (age 7) following reported economic abuse and one physical assault. She fears the respondent (husband) will locate her at the shelter. An NCW/police complaint number exists but FIR not yet registered.",
    documents: [
      "Identity proof (Aadhaar — kept confidential)",
      "Child's birth certificate",
      "WhatsApp messages showing economic control",
      "Bank statements showing salary diversion",
      "Photographs of injuries",
      "Shelter intake note",
      "Police complaint number",
      "Contact details of two safe witnesses",
    ],
    missingDocuments: [
      "FIR copy (not yet filed)",
      "Medical examination report",
      "Evidence of matrimonial home ownership/tenancy",
      "Income/property documents of respondent",
    ],
    documentGaps: [
      "Police complaint registered but FIR not yet — legal basis for DV application is independent of FIR — verify",
      "Medical examination not yet done — injuries photographed but not clinically documented",
      "Location of client must not appear in any document served on respondent",
    ],
    clientRequest:
      "Get protection from physical violence, secure residence rights, obtain monetary relief, and protect child custody arrangement — without disclosing location.",
    requestClarity: "overbroad",
    requestNote: "Client wants all reliefs but is not sure about child custody implications — needs informed consent before proceeding. Safety triage is the first step.",
    actionPlan: {
      facts: [
        "SAFETY FIRST — do not contact respondent; do not disclose shelter address",
        "Obtain medical examination at trusted hospital — today",
        "Secure photographs with metadata",
        "Verify police complaint status — push for FIR registration",
        "Obtain income / residence documents through MGIW or through complaint process",
      ],
      research: [
        "DV Act 2005 — §18 (protection order), §19 (residence order), §20 (monetary relief) — verify current procedural rules",
        "Safe service of application — DV Act §12, rule on address — UNCONFIRMED for this state",
        "Child residence — interim arrangement under DV Act or separate guardianship — assess",
        "Whether shelter address can be withheld from respondent under DV rules — UNCONFIRMED for this state",
      ],
      drafting: [
        "Confidential intake record (not to be shared with respondent)",
        "Incident chronology (client-narrated, signed)",
        "DV application — §18 + §19 + §20 (all three combined)",
        "Affidavit supporting application",
        "Safety plan instructions memo",
      ],
      review: [
        "Supervisor review mandatory before filing — safety protocol",
        "Application must NOT contain shelter address",
        "Inform client about child welfare report implications before filing",
      ],
      filing: [
        "File urgently — same day if possible after medical report obtained",
        "Request interim ex-parte protection order first",
        "DO NOT proceed to final reliefs without informed consent from client",
      ],
    },
    unresolvedFacts: [
      "FIR status — UNCONFIRMED",
      "Medical documentation — not yet obtained",
      "Client's instructions on child custody — informed consent needed",
      "Whether respondent knows shelter location — UNCONFIRMED",
    ],
    adverseFact:
      "Client's WhatsApp messages include one message where she accepted ₹[UNCONFIRMED] from respondent after the alleged assault — respondent may argue this as condonation. Recorded as adverse fact; explain to client and obtain full instructions.",
    drafts: [
      { type: "memo", title: "Confidential Intake Record (NOT FOR SERVICE)", status: "draft", approvalRequired: false },
      { type: "chronology", title: "Incident Chronology", status: "draft", approvalRequired: false },
      { type: "application", title: "DV Application u/s §18+§19+§20 DV Act 2005", status: "blocked", jurisdiction: "JMFC / MM", approvalRequired: true, blockedReason: "Medical report not obtained; informed consent not complete" },
      { type: "affidavit", title: "Supporting Affidavit", status: "blocked", approvalRequired: true, blockedReason: "Application not finalised" },
      { type: "memo", title: "Safety Plan Instructions (for client)", status: "ready-for-supervising-advocate", approvalRequired: true },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-008 — Guardianship and School Dispute
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-008",
    title: "Guardianship Dispute — Competing Caregivers and School Transfer",
    domain: "Family / Guardianship",
    complexity: "Advanced",
    approachStatus: "cold-walk-in",
    approachStatusNote: "Walk-in; competing caregivers; child welfare disputed; no prior legal proceeding.",
    urgency: "moderate",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "Maternal aunt (synthetic: Kavita) has cared for a child (age 10) for 3 years following the mother's death. Father (synthetic: Deepak) now seeks immediate custody and intends to transfer the child to a school in another city. Child has expressed reluctance (not formally assessed).",
    documents: [
      "Child's birth certificate",
      "School records (current school)",
      "Medical records (child)",
      "Records of care expenses (aunt)",
      "Messages between aunt and father",
      "Mediation notes (informal)",
      "Welfare reports (none formal)",
    ],
    missingDocuments: [
      "Formal child welfare/DCPU report",
      "Father's income and living situation proof",
      "Mother's death certificate",
      "Prior custody or guardianship order (if any)",
    ],
    documentGaps: [
      "Child's preference not formally assessed — cannot be assumed",
      "No prior guardianship order — de facto care only",
      "Father's legal rights as natural guardian unaffected by de facto care — verify",
    ],
    clientRequest:
      "Stabilise the child's schooling and obtain an interim arrangement based on the child's welfare.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Confirm current legal status: no guardianship order exists",
        "Identify the correct court — Guardians and Wards Act 1890 / Family Court",
        "Assess whether father's natural guardianship is legally unimpeachable",
        "Obtain formal welfare report or request court to appoint welfare officer",
        "Separate interim school relief from final custody determination",
      ],
      research: [
        "Guardians and Wards Act 1890 §7, §17 — welfare as paramount consideration — verify current law",
        "Whether de facto carer (aunt) has locus standi to file — UNCONFIRMED",
        "Interim custody pending hearing — court powers — UNCONFIRMED",
        "Child's preference — at age 10, court may consider — UNCONFIRMED for this jurisdiction",
        "Whether school transfer can be restrained by interim order",
      ],
      drafting: [
        "Chronology of care",
        "Interim custody/schooling application",
        "Affidavit of aunt",
        "Redaction checklist (to protect child's identity in public filings)",
        "Professional welfare assessment questions",
      ],
      review: [
        "Do not coach child or put child in adversarial position",
        "Supervising advocate to review all filings for child-safety compliance",
      ],
      filing: [
        "DO NOT FILE until locus standi is confirmed and welfare report is requested",
      ],
    },
    unresolvedFacts: [
      "Whether aunt has locus standi — UNCONFIRMED",
      "Child's formal preference — not yet assessed",
      "Father's specific relocation plans — UNCONFIRMED",
      "Whether father has any prior adverse conduct — UNCONFIRMED",
    ],
    adverseFact:
      "Aunt's messages include one where she describes the child as 'my child' — father may use this as evidence of alienation attempt. Recorded as adverse fact; all future communications must be child-welfare-centred.",
    drafts: [
      { type: "chronology", title: "Chronology of Care — EX-008", status: "draft", approvalRequired: false },
      { type: "application", title: "Interim Custody/Schooling Application", status: "blocked", approvalRequired: true, blockedReason: "Locus standi not confirmed; welfare assessment pending" },
      { type: "affidavit", title: "Aunt's Supporting Affidavit", status: "research-needed", approvalRequired: true },
      { type: "checklist", title: "Redaction Checklist (child identity)", status: "draft", approvalRequired: false },
      { type: "memo", title: "Professional Welfare Assessment Questions", status: "draft", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "UNKNOWN",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-009 — Motor Accident with Disputed Income
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-009",
    title: "Motor Accident Claim — Delivery Rider, Fractured Leg, Disputed App Income",
    domain: "MACT / Compensation",
    complexity: "Intermediate",
    approachStatus: "cold-walk-in",
    approachStatusNote: "Walk-in after hospital discharge; mixed records; fixed-amount expectation from client.",
    urgency: "moderate",
    documentCompleteness: "partial",
    workflowState: "draft",
    background:
      "Delivery rider (synthetic: Rohit Sharma) fractured his leg after collision with a state transport bus. FIR has been registered. Insurer (synthetic) disputes negligence and contests income evidence — rider earned partly through delivery app (digital) and partly cash.",
    documents: [
      "FIR copy",
      "MLC (Medico-Legal Certificate)",
      "Discharge summary",
      "Hospital bills and receipts",
      "Disability assessment report (informal — GP only)",
      "Driving licence",
      "Vehicle registration (claimant's bike)",
      "Bus details and owner/insurer information",
      "App earnings screenshot (last 3 months)",
      "Bank statement",
      "Employer letter (for cash portion — disputed)",
    ],
    missingDocuments: [
      "Formal disability certificate from government hospital / orthopaedic specialist",
      "Charge sheet / final police report",
      "Bus insurance policy details",
      "Prognosis / future treatment estimate from specialist",
    ],
    documentGaps: [
      "Disability assessment is informal — not from orthopaedic specialist at government hospital",
      "App earnings are screenshots — not certified statement from platform",
      "Employer letter for cash income — unverified third-party letter",
      "Income modelling assumptions UNCONFIRMED",
    ],
    clientRequest:
      "Claim fair compensation for medical expenses, disability, lost income, and future impact — not an inflated amount.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Obtain formal disability certificate from government hospital",
        "Obtain certified earnings statement from delivery app (formal)",
        "Verify bus insurance — obtain from motor accident register",
        "Assess prognosis — get treating doctor's written opinion on permanent disability",
        "Do not inflate income — model conservatively",
      ],
      research: [
        "MACT jurisdiction — district of accident or residence — UNCONFIRMED",
        "Motor Vehicles Act 2019 — structured formula for compensation — verify",
        "Whether gig worker income is admissible as 'income' — UNCONFIRMED for this jurisdiction",
        "Limitation — 6 months from date of accident — UNCONFIRMED",
        "Assessment of multiplier based on age — verify current SC guidelines",
      ],
      drafting: [
        "Claim facts sheet",
        "Compensation computation (provisional)",
        "Evidence index",
        "Affidavit in support",
        "Insurer notice (if required pre-filing)",
      ],
      review: [
        "Supervising advocate to approve quantum before filing — client has fixed expectations",
        "Ensure disability percentage is certified by orthopaedic specialist",
      ],
      filing: [
        "DO NOT FILE without formal disability certificate and certified app earnings",
      ],
    },
    unresolvedFacts: [
      "Permanent disability percentage — UNCONFIRMED — formal assessment pending",
      "App income certification — UNCONFIRMED",
      "Bus insurance validity — UNCONFIRMED",
      "Negligence — FIR filed but not challenged yet",
    ],
    adverseFact:
      "FIR shows claimant may have crossed traffic signal — insurer will raise contributory negligence. Recorded as adverse fact; cross-check traffic signal status from CCTV/police records before filing.",
    drafts: [
      { type: "chronology", title: "Claim Facts Sheet", status: "draft", approvalRequired: false },
      { type: "index", title: "Evidence Index", status: "draft", approvalRequired: false },
      { type: "pleading", title: "MACT Claim Petition (provisional quantum)", status: "blocked", approvalRequired: true, blockedReason: "Formal disability certificate and certified app income not yet obtained" },
      { type: "affidavit", title: "Claimant's Affidavit", status: "research-needed", approvalRequired: true },
      { type: "notice", title: "Insurer Pre-Filing Notice (if required)", status: "research-needed", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-010 — Government Employee Termination without Hearing
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-010",
    title: "Termination without Hearing — Inquiry Report Not Supplied",
    domain: "Service Law / Writ",
    complexity: "Advanced",
    approachStatus: "referral",
    approachStatusNote: "Referred by colleague; dismissal order served yesterday; appeal window open.",
    urgency: "urgent",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "A government employee (synthetic: Kumar, Class B officer, State Government) was dismissed for alleged data leakage after being given only 3 days to respond to the charge memorandum. The inquiry report was never supplied to him. He received dismissal order yesterday. Departmental appeal is open.",
    documents: [
      "Appointment order",
      "Charge memorandum",
      "Employee's reply to charge memo",
      "Inquiry hearing notices (if any)",
      "Dismissal order (received yesterday)",
      "Service rules applicable",
      "Performance records (clean)",
      "Proof of receipt of charge memo",
    ],
    missingDocuments: [
      "Inquiry officer's report — NOT supplied to employee",
      "Evidence recorded by inquiry officer",
      "Show-cause notice (if separate from charge memo)",
      "Full service file",
    ],
    documentGaps: [
      "Inquiry report not supplied — this is the core procedural violation — CONFIRMED adverse fact for department",
      "Evidence relied upon by inquiry officer UNCONFIRMED — not seen by employee",
      "Whether any classified security material is involved — UNCONFIRMED",
    ],
    clientRequest:
      "Challenge dismissal urgently — through departmental appeal and/or writ — and obtain reinstatement or interim protection.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Compute departmental appeal deadline — TODAY",
        "Confirm inquiry report was never supplied (get written statement from client)",
        "Obtain full service file through RTI if necessary",
        "Identify applicable service rules — state-specific — UNCONFIRMED",
        "Check whether any classified material is involved — affects strategy",
      ],
      research: [
        "Article 311(2) Constitution — right to reasonable opportunity and inquiry report supply — verify",
        "Union of India v. Mohd. Ramzan Khan (1991) 1 SCC 588 — inquiry report supply mandatory — verify current law",
        "Departmental appeal vs. writ — which forum first — UNCONFIRMED for this state",
        "Limitation for writ — 3 years or reasonable time — UNCONFIRMED",
        "Whether interim stay of dismissal is available — UNCONFIRMED",
      ],
      drafting: [
        "Departmental representation/appeal (file TODAY)",
        "Writ petition skeleton (simultaneous preparation)",
        "Stay application",
        "List of dates",
        "Record request (RTI / service rules route)",
      ],
      review: [
        "Supervising advocate must review writ before filing",
        "Check whether privileged security material affects scope of challenge",
      ],
      filing: [
        "File departmental appeal TODAY — deadline may be short",
        "File writ only after appeal decision or if appeal remedy is illusory",
      ],
    },
    unresolvedFacts: [
      "Departmental appeal deadline — must be computed TODAY — URGENT",
      "Whether security classification affects scope of writ — UNCONFIRMED",
      "Full inquiry record — not yet obtained",
      "Applicable service rules — UNCONFIRMED",
    ],
    adverseFact:
      "Client used personal email to forward a government document to himself — he says for work convenience. Department may treat this as the data leakage itself. Recorded as highly adverse fact; legal advice on employee privacy vs. misconduct must be obtained before any admission in the representation.",
    drafts: [
      { type: "pleading", title: "Departmental Appeal / Representation", status: "ready-for-supervising-advocate", approvalRequired: true },
      { type: "pleading", title: "Writ Petition Skeleton (Art. 226/227)", status: "research-needed", approvalRequired: true },
      { type: "application", title: "Stay Application", status: "blocked", approvalRequired: true, blockedReason: "Forum confirmation urgent" },
      { type: "chronology", title: "List of Dates", status: "draft", approvalRequired: false },
      { type: "application", title: "Record Request (RTI / Service Rules)", status: "draft", approvalRequired: false },
    ],
    citationGate: "SECONDARY",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-011 — Land Acquisition Notice with Incorrect Area
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-011",
    title: "Land Acquisition Notice — Area Mismatch, Award Date Unknown",
    domain: "Public Law / Acquisition",
    complexity: "Advanced",
    approachStatus: "legal-aid-camp",
    approachStatusNote: "Legal aid camp; oral facts only; one partly unreadable notice; deadline unknown.",
    urgency: "critical",
    documentCompleteness: "incomplete",
    workflowState: "intake-only",
    background:
      "Farmers (synthetic: Bhima Patel and five others) received Section 11 notices under RFCTLARR Act 2013 showing an area that does not match their revenue records. Award date is unknown. One notice is partially unreadable (water damage). Compensation has not been discussed.",
    documents: [
      "Section 11 notice (one copy — partially unreadable)",
      "Revenue map (photocopy — not certified)",
      "Khasra / Khatauni extracts (partial)",
      "Land revenue records (photocopy)",
      "Identity proof",
      "Photographs of land",
      "Neighbours' Section 11 notices (2 copies)",
    ],
    missingDocuments: [
      "Certified copy of Section 11 notice",
      "Social Impact Assessment report (if prepared)",
      "Notification under Section 11(1) from Gazette",
      "Award copy (if passed — unknown)",
    ],
    documentGaps: [
      "Notice is partially unreadable — must not be treated as basis for advice",
      "Award date completely UNCONFIRMED — this is the most critical gap",
      "Revenue records are photocopies — originals needed for challenge",
      "Whether objection period under Section 15 has expired — UNCONFIRMED",
    ],
    clientRequest:
      "Understand what stage the acquisition is at, protect all objection and compensation rights, and challenge incorrect area.",
    requestClarity: "unclear",
    requestNote: "Client at legal-aid camp has oral facts only; full instructions not yet taken in writing; multiple claimants with possibly different interests.",
    actionPlan: {
      facts: [
        "Obtain certified copy of Section 11 notice from Collector's office URGENTLY",
        "Obtain Gazette notification — verify publication date",
        "Ascertain whether award has been passed — visit LAC office",
        "Get certified revenue records for all 6 farmers",
        "Check if any compensation has been deposited",
      ],
      research: [
        "RFCTLARR Act 2013 §11 — notice; §15 — objection period (60 days from §11 notice) — verify current law",
        "Whether objection period has expired — CANNOT COMPUTE without verified notice date",
        "§79 — reference to court if award already passed — limitation 6 weeks from award — UNCONFIRMED",
        "Area mismatch — whether it entitles to separate notice/survey — UNCONFIRMED",
        "Whether protective objection can be filed even if period uncertain",
      ],
      drafting: [
        "Transcription note (accurately transcribe readable portions — mark unreadable)",
        "Record request letter to Collector",
        "Protective objection (if period possibly open)",
        "Chronology of events",
        "Writ issue matrix (for later review)",
      ],
      review: [
        "No advice can be given on merits until certified notice is obtained",
        "Do not file objection based on unverified notice",
      ],
      filing: [
        "File record request FIRST",
        "File protective objection ONLY if confirmed that objection period is still open",
        "DO NOT FILE writ without award copy and certified notice",
      ],
    },
    unresolvedFacts: [
      "Award date — COMPLETELY UNCONFIRMED — CRITICAL",
      "Whether objection period has expired — CANNOT BE COMPUTED",
      "Exact area discrepancy — needs certified records",
      "All 6 farmers' distinct interests — not yet mapped",
      "Whether any compensation deposited — UNCONFIRMED",
    ],
    adverseFact:
      "One farmer (Bhima's cousin) reportedly received and accepted a partial advance compensation from the LAC office — this may complicate joint challenge. Recorded as adverse fact; separate representation may be needed for that farmer.",
    drafts: [
      { type: "memo", title: "Transcription Note (partial — mark unreadable)", status: "intake-only", approvalRequired: false },
      { type: "application", title: "Record Request to Collector", status: "ready-for-supervising-advocate", approvalRequired: true },
      { type: "application", title: "Protective Objection u/s 15 RFCTLARR", status: "blocked", approvalRequired: true, blockedReason: "Objection period CANNOT be verified without certified notice" },
      { type: "chronology", title: "Event Chronology (partial)", status: "intake-only", approvalRequired: false },
      { type: "no-filing-note", title: "No-Filing Note — Writ Deferred", status: "intake-only", approvalRequired: false, blockedReason: "Award status unknown; certified records not yet obtained" },
    ],
    citationGate: "PENDING",
    limitationGate: "UNKNOWN",
    syntheticLabel: "SYNTHETIC / DEMO",
  },
] as Array<Omit<IntakeExample, "terminalOutcome">>).map(withTerminalOutcome);

export type { IntakeExample as Week01IntakeExample };