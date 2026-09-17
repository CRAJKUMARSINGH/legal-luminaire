/**
 * WEEK 03 — TRAE — Public law, arbitration, execution, injunction and pleading-state transitions
 * Source: SUPPLEMENT/WEEK_03_TRAE.md
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

export const WEEK03_EXAMPLES = ([
  // ─────────────────────────────────────────────────────────────────────────
  // EX-022 — Municipality refuses occupancy certificate
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-022",
    title: "Municipality Refuses Occupancy Certificate",
    domain: "Public Law / Mandamus",
    complexity: "Intermediate",
    approachStatus: "referral",
    approachStatusNote: "Email referral; refusal written; launch in 20 days",
    urgency: "urgent",
    documentCompleteness: "partial",
    workflowState: "draft",
    background:
      "Clinic completed approved construction but refusal cites an unpublished checklist.",
    backgroundHi:
      "क्लिनिक ने अनुमोदित निर्माण पूरा कर लिया है लेकिन अस्वीकृति एक अप्रकाशित चेकलिस्ट का हवाला देती है।",
    documents: [
      "Approved building plan",
      "Completion certificate (if any)",
      "Inspection reports",
      "Occupancy certificate application",
      "Written refusal order",
      "Fee receipts",
      "Fire safety NOC",
      "Site photographs",
    ],
    missingDocuments: [
      "Certified copy of unpublished checklist cited in refusal",
      "Municipal file noting / inspection remarks",
      "Prior correspondence with municipal authority",
      "Evidence of demand for unpublished checklist",
    ],
    documentGaps: [
      "Unpublished checklist not provided by municipality — contents UNCONFIRMED",
      "Whether refusal grounds correspond to approved plan deviations — UNCONFIRMED",
      "Whether fire NOC is from competent authority — UNCONFIRMED",
    ],
    clientRequest:
      "Obtain reasoned processing, not automatic approval.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Compare approved plan with refusal grounds point-by-point",
        "Seek file inspection to obtain unpublished checklist and notings",
        "Verify each alleged defect against municipal bye-laws",
        "Document inspection readiness with date-stamped photographs",
        "Assess whether real curable defects exist vs. arbitrary refusal",
      ],
      research: [
        "Verify mandamus jurisdiction over municipal occupancy refusal — UNCONFIRMED",
        "Check limitation for writ petition against refusal order — UNCONFIRMED",
        "Research whether unpublished checklist can be basis of refusal — UNCONFIRMED",
        "Verify forum — High Court (writ) vs. Municipal appellate authority — UNCONFIRMED",
        "Assess appeal route vs. writ route for time efficiency",
      ],
      drafting: [
        "Representation to Municipal Commissioner",
        "File inspection request (RTI / statutory)",
        "Writ matrix (mandamus grounds)",
        "Interim note (20-day launch urgency)",
        "Compliance affidavit (if cured)",
      ],
      review: [
        "Supervising advocate must verify curable defects are actually addressed",
        "Ensure representation does not waive right to challenge refusal grounds",
      ],
      filing: [
        "File representation first before approaching writ forum",
        "DO NOT assume automatic approval — seek reasoned processing only",
        "Preserve evidence of cured defects before filing any writ",
      ],
    },
    unresolvedFacts: [
      "Contents of unpublished checklist — UNCONFIRMED",
      "Whether refusal is mala fide or based on actual defects — UNCONFIRMED",
      "Appropriate appellate forum under municipal laws — UNCONFIRMED",
      "Limitation period from refusal date — UNCONFIRMED",
    ],
    adverseFact:
      "Site photographs show one unapproved temporary structure near the entrance — municipality may argue this justifies refusal even if checklist is unpublished. Recorded as adverse fact; cure if possible before representation.",
    drafts: [
      { type: "letter", title: "Representation to Municipal Commissioner", status: "draft", approvalRequired: true },
      { type: "application", title: "File Inspection / RTI Request", status: "ready-for-supervising-advocate", approvalRequired: false },
      { type: "table", title: "Writ Mandamus Grounds Matrix", status: "draft", approvalRequired: false },
      { type: "memo", title: "Interim Urgency Note (20-Day Launch)", status: "intake-only", approvalRequired: false },
      { type: "affidavit", title: "Compliance Affidavit (Conditional)", status: "blocked", approvalRequired: true, blockedReason: "Unpublished checklist not obtained; real defects not confirmed" },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-023 — Unsafe footbridge near school
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-023",
    title: "Unsafe Footbridge Near School",
    domain: "PIL / Public Interest",
    complexity: "Expert",
    approachStatus: "referral",
    approachStatusNote: "Citizen group; public evidence; repair tender exists",
    urgency: "critical",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "Cracks and falling concrete reported; authority tendered repair but has not cordoned route.",
    backgroundHi:
      "दरारें और गिरता कंक्रीट रिपोर्ट किया गया है; प्राधिकरण ने मरम्मत का टेंडर दिया है लेकिन मार्ग को बंद नहीं किया है।",
    documents: [
      "Dated photographs of cracks / falling concrete",
      "Video recordings (dated, lawful)",
      "Engineer's preliminary note (if any)",
      "School letter / concern note",
      "Repair tender document",
      "Traffic / pedestrian usage data",
      "Prior complaint records",
      "Expert contact details",
      "RTI / record requests filed",
    ],
    missingDocuments: [
      "Independent structural engineer opinion — CRITICAL PENDING",
      "Certified proof of ownership / maintenance authority",
      "Proof of prior accidents / injuries (if any)",
      "Formal complaint acknowledgment from authority",
    ],
    documentGaps: [
      "Structural safety assessment not done — cannot confirm actual risk level",
      "Maintenance ownership between multiple authorities — UNCONFIRMED",
      "Tender scope vs. actual defect scope — UNCONFIRMED",
    ],
    clientRequest:
      "Secure immediate safety and inspection without obstructing works.",
    requestClarity: "clear",
    requestNote: "Client is citizen group — locus standi and bona fides must be established.",
    actionPlan: {
      facts: [
        "Verify exact location and ownership / maintenance authority",
        "Obtain independent structural engineer opinion URGENTLY",
        "Document date-stamped evidence without trespassing",
        "Corroborate school letter with parent / teacher statements",
        "Confirm whether tendered repair addresses reported defects",
      ],
      research: [
        "Verify PIL jurisdiction and locus standi for citizen group — UNCONFIRMED",
        "Check interim safety relief powers of High Court / NGT — UNCONFIRMED",
        "Research duty of care for public infrastructure authority — UNCONFIRMED",
        "Assess whether cordoning without repair is sufficient interim relief — UNCONFIRMED",
        "Verify standing and bona fides requirements for PIL — UNCONFIRMED",
      ],
      drafting: [
        "Safety representation to authority",
        "Evidence preservation protocol",
        "PIL matrix (grounds + relief)",
        "Interim safety application (barricading + inspection)",
        "Expert declaration format",
      ],
      review: [
        "Supervising advocate must verify structural opinion is from licensed engineer",
        "Ensure PIL pleadings do not obstruct legitimate repair works already tendered",
      ],
      filing: [
        "DO NOT trespass or obstruct traffic — evidence collection must be lawful",
        "Serve representation before approaching court (exhaust alternative remedy)",
        "Structural opinion MUST accompany any interim relief application",
      ],
    },
    unresolvedFacts: [
      "Structural safety rating by independent engineer — PENDING",
      "Exact ownership / maintenance authority — UNCONFIRMED",
      "Locus standi of citizen group for PIL — UNCONFIRMED",
      "Whether repair tender actually covers reported defects — UNCONFIRMED",
    ],
    adverseFact:
      "Repair tender was floated 2 months ago and work order is pending final approval — authority may argue they are acting and PIL is premature. Recorded as adverse fact; frame interim relief narrowly (cordoning + inspection) without opposing tendered works.",
    drafts: [
      { type: "letter", title: "Safety Representation to Concerned Authority", status: "draft", approvalRequired: false },
      { type: "memo", title: "Evidence Preservation Protocol", status: "draft", approvalRequired: false },
      { type: "table", title: "PIL Grounds & Relief Matrix", status: "research-needed", approvalRequired: false },
      { type: "application", title: "Interim Safety Application (Cordoning + Inspection)", status: "blocked", jurisdiction: "High Court (PIL Bench)", approvalRequired: true, blockedReason: "Independent structural engineer opinion not obtained; authority ownership not confirmed" },
      { type: "affidavit", title: "Expert Structural Declaration (Format)", status: "blocked", approvalRequired: true, blockedReason: "No licensed expert engaged yet" },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-024 — Contempt after settlement-order breach
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-024",
    title: "Contempt After Settlement-Order Breach",
    domain: "Contempt / Enforcement",
    complexity: "Advanced",
    approachStatus: "returning-client",
    approachStatusNote: "Returning client; order exists; breach indirect",
    urgency: "urgent",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "Consent order required instalments and documents; two missed payments and suspected asset transfer are uncertified.",
    backgroundHi:
      "सहमति आदेश में किस्तों और दस्तावेजों की आवश्यकता थी; दो चूकी हुई किस्तें और संपत्ति हस्तांतरण का संदेह अप्रमाणित हैं।",
    documents: [
      "Consent order / compromise decree (certified copy)",
      "Payment ledger / record",
      "Prior notices issued",
      "Registry / bank extracts (if any)",
      "Correspondence on alleged breach",
      "Undertakings given in consent order",
      "Proof of service of prior notices",
    ],
    missingDocuments: [
      "Certified bank statement proving missed payments",
      "Proof of asset transfer (registry / ROC / company search) — CRITICAL",
      "Certified copy of operative order portion",
      "Evidence of wilfulness (not mere inability)",
    ],
    documentGaps: [
      "Two missed payments alleged — not certified by bank records yet",
      "Asset transfer suspected — no certified evidence obtained",
      "Whether breach is 'wilful' or due to inability — UNCONFIRMED",
      "Consent order terms — whether breach triggers contempt clause — UNCONFIRMED",
    ],
    clientRequest:
      "Enforce proportionately only on proved wilful breach.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Read operative portion of consent order carefully",
        "Distinguish contempt route vs. execution route vs. fresh civil relief",
        "Prove service of notices and demand before alleging contempt",
        "Certify asset transfer records through lawful searches",
        "Avoid fraud allegation prematurely — prove wilfulness first",
      ],
      research: [
        "Verify contempt jurisdiction for consent decree breach — UNCONFIRMED",
        "Distinguish civil vs. criminal contempt on these facts — UNCONFIRMED",
        "Check limitation period for contempt petition — UNCONFIRMED",
        "Research standard of 'wilful breach' vs. mere inability — UNCONFIRMED",
        "Assess whether execution petition is more appropriate remedy — UNCONFIRMED",
      ],
      drafting: [
        "Compliance notice (final before contempt)",
        "Breach chronology (payments + asset clues)",
        "Contempt skeleton grounds",
        "Execution petition (alternative route)",
        "Affidavit checklist (evidence items)",
      ],
      review: [
        "Supervising advocate must distinguish wilful breach from inability",
        "Ensure contempt allegations are not premature without certified evidence",
      ],
      filing: [
        "Serve final compliance notice first — contempt must be last resort",
        "DO NOT allege asset transfer fraud without certified evidence",
        "Execution route may be more effective if decree-holder remedy is available",
      ],
    },
    unresolvedFacts: [
      "Certified proof of missed payments — PENDING",
      "Certified evidence of asset transfer — PENDING",
      "Standard of wilfulness met — UNCONFIRMED",
      "Correct forum (contempt vs. execution) — UNCONFIRMED",
      "Limitation for contempt petition — UNCONFIRMED",
    ],
    adverseFact:
      "Payment ledger shows respondent made three earlier instalments on time — respondent may argue temporary inability, not wilful contempt. Recorded as adverse fact; ensure wilfulness is proved with post-breach conduct evidence (e.g. asset transfer after breach).",
    drafts: [
      { type: "notice", title: "Final Compliance Notice Before Contempt", status: "ready-for-supervising-advocate", approvalRequired: true },
      { type: "chronology", title: "Breach Chronology — Payments + Asset Clues", status: "draft", approvalRequired: false },
      { type: "memo", title: "Contempt Petition Skeleton Grounds", status: "research-needed", approvalRequired: true },
      { type: "application", title: "Execution Petition (Alternative Remedy)", status: "draft", jurisdiction: "Executing Court", approvalRequired: true },
      { type: "checklist", title: "Affidavit Evidence Checklist", status: "draft", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-025 — Arbitration appointment after failed settlement
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-025",
    title: "Arbitration Appointment After Failed Settlement",
    domain: "Arbitration / Appointment",
    complexity: "Advanced",
    approachStatus: "referral",
    approachStatusNote: "Commercial referral; clause clear; notice unanswered",
    urgency: "urgent",
    documentCompleteness: "partial",
    workflowState: "draft",
    background:
      "Logistics contract names a three-member tribunal; counterparty ignored invocation and may divert inventory.",
    backgroundHi:
      "लॉजिस्टिक्स अनुबंध में तीन सदस्यीय ट्रिब्यूनल का नाम है; प्रतिपक्षी ने आह्वान को अनदेखा किया है और इन्वेंट्री को डायवर्ट कर सकता है।",
    documents: [
      "Contract / agreement (clause containing arbitration)",
      "Arbitration clause extract (highlighted)",
      "Invoices raised",
      "Correspondence — settlement attempts",
      "Draft arbitration invocation (if any)",
      "Inventory / stock records",
      "Security / retention records",
    ],
    missingDocuments: [
      "Proof of service of arbitration invocation on counterparty",
      "Confirmation of arbitration seat / venue per clause",
      "Named arbitrator consent(s) for three-member tribunal",
      "Evidence of inventory diversion risk — certified",
    ],
    documentGaps: [
      "Invocation not yet served — cannot approach court for appointment",
      "Exact mechanism for three-member tribunal (party-appointed vs. institutional) — UNCONFIRMED",
      "Seat / venue per clause — UNCONFIRMED",
      "Inventory diversion evidence is allegation only — UNCONFIRMED",
    ],
    clientRequest:
      "Constitute tribunal and preserve assets lawfully.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Verify arbitration clause: seat, mechanism, number of arbitrators, preconditions",
        "Confirm proper service address for counterparty",
        "Prepare neutral chronology of dispute + settlement failure",
        "Separate tribunal appointment application from interim relief",
        "Choose competent forum for §11 / statutory appointment application",
      ],
      research: [
        "Verify A&C Act provisions for three-member tribunal appointment — UNCONFIRMED",
        "Check §11 application jurisdiction (High Court or District Court) — UNCONFIRMED",
        "Research interim preservation relief pendente lite — UNCONFIRMED",
        "Check limitation for invoking arbitration from cause of action — UNCONFIRMED",
        "Assess whether inventory preservation requires separate application or interim order",
      ],
      drafting: [
        "Arbitration invocation notice",
        "§11 appointment application (or applicable statutory)",
        "Interim relief brief (inventory preservation)",
        "Claim issues statement",
        "Asset preservation notice (without trespass)",
      ],
      review: [
        "Supervising advocate must confirm arbitration seat and mechanism are correct",
        "Ensure asset preservation relief is lawful — no self-help measures",
      ],
      filing: [
        "Serve invocation first BEFORE filing §11 appointment application",
        "DO NOT take possession of inventory — seek court order for preservation only",
        "Appointment and interim relief may be in same or separate proceedings depending on forum",
      ],
    },
    unresolvedFacts: [
      "Arbitration clause mechanism (seat, forum, preconditions) — UNCONFIRMED",
      "Service of invocation — NOT YET DONE",
      "Competent forum for appointment application — UNCONFIRMED",
      "Inventory diversion evidence — UNCONFIRMED",
    ],
    adverseFact:
      "Settlement correspondence shows client suggested 'informal resolution outside contract' two weeks ago — counterparty may argue client waived arbitration clause or delayed invocation. Recorded as adverse fact; ensure invocation reaffirms contractual arbitration right explicitly.",
    drafts: [
      { type: "notice", title: "Arbitration Invocation Notice", status: "draft", approvalRequired: true },
      { type: "application", title: "§11 Arbitrator Appointment Application", status: "blocked", jurisdiction: "High Court / District Court (A&C Act)", approvalRequired: true, blockedReason: "Invocation not yet served; arbitration mechanism not verified" },
      { type: "memo", title: "Interim Relief Brief — Inventory Preservation", status: "draft", approvalRequired: false },
      { type: "table", title: "Claim Issues Statement (Preliminary)", status: "draft", approvalRequired: false },
      { type: "notice", title: "Asset Preservation Notice (Without Self-Help)", status: "draft", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-026 — Challenge to award with partial grounds
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-026",
    title: "Challenge to Award With Partial Grounds",
    domain: "Arbitration / Award Challenge",
    complexity: "Expert",
    approachStatus: "returning-client",
    approachStatusNote: "Returning client; award received; receipt disputed",
    urgency: "urgent",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "Award rejects claims but grants counterclaim; client cites natural justice and calculation error, plus merits dissatisfaction.",
    backgroundHi:
      "अनुबंध दावों को अस्वीकार करता है लेकिन प्रतिदावा देता है; ग्राहक प्राकृतिक न्याय और गणना त्रुटि के साथ-साथ योग्यता असंतोष का हवाला देता है।",
    documents: [
      "Arbitration award (certified copy)",
      "Arbitration record / pleadings",
      "Procedural orders passed during arbitration",
      "Hearing transcripts (if any)",
      "Contract / agreement original",
      "Proof of award receipt date",
      "Correction / clarification request (if any)",
      "Computation of awarded counterclaim",
    ],
    missingDocuments: [
      "Certified proof of award receipt date — CRITICAL for limitation",
      "Full arbitration record — all exhibits and correspondence",
      "Evidence of natural justice violation (e.g. denied hearing)",
      "Expert computation review confirming calculation error",
    ],
    documentGaps: [
      "Award receipt date disputed — limitation cannot be calculated",
      "Natural justice allegations — no specific evidence of hearing denial yet",
      "Calculation error — not independently verified by expert",
      "Merits dissatisfaction alone is not ground for challenge — must separate",
    ],
    clientRequest:
      "Challenge sustainable portions within limitation, not re-try arbitration.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Calculate valid award receipt date from all available evidence",
        "Classify grounds: natural justice, calculation error, vs. merits only",
        "Test waiver — whether client participated without objection to procedure",
        "Test segregation — can sustainable grounds be separated from merits challenge",
        "Recommend NO FILING if limitation or grounds gate fails",
      ],
      research: [
        "Verify A&C Act grounds for setting aside award — UNCONFIRMED",
        "Check limitation period for setting aside application — UNCONFIRMED",
        "Research whether merits challenge alone is maintainable — UNCONFIRMED",
        "Assess stay / security requirements if challenge filed — UNCONFIRMED",
        "Verify whether counterclaim portion is enforceable during challenge — UNCONFIRMED",
      ],
      drafting: [
        "Ground matrix (sustainable vs. unsustainable)",
        "Limitation computation memo",
        "Setting-aside application skeleton (conditional)",
        "Stay / security proposal",
        "Risk note (go/no-go gate)",
      ],
      review: [
        "Supervising advocate must confirm challenge is not merely re-trying arbitration merits",
        "Ensure limitation computation uses the LATEST possible receipt evidence",
      ],
      filing: [
        "DO NOT file challenge on merits dissatisfaction alone — only statutory grounds",
        "If limitation gate fails — document NO-FILING recommendation",
        "Stay application should accompany setting-aside if counterclaim enforcement imminent",
      ],
    },
    unresolvedFacts: [
      "Valid award receipt date — DISPUTED",
      "Natural justice violation evidence — UNCONFIRMED",
      "Calculation error independently verified — NO",
      "Statutory limitation period — UNCONFIRMED",
      "Sustainable grounds count — NOT CLASSIFIED YET",
    ],
    adverseFact:
      "Client participated fully in arbitration hearings without objecting to procedure at the time — respondent may argue waiver of natural justice grounds. Recorded as adverse fact; assess whether objection was reserved explicitly before challenge.",
    drafts: [
      { type: "table", title: "Ground Matrix — Sustainable vs. Unsustainable", status: "draft", approvalRequired: false },
      { type: "memo", title: "Limitation Computation Memo", status: "blocked", approvalRequired: false, blockedReason: "Award receipt date disputed — certified proof needed" },
      { type: "pleading", title: "Setting-Aside Application Skeleton (Conditional)", status: "blocked", approvalRequired: true, blockedReason: "Sustainable grounds not classified; limitation not computed" },
      { type: "memo", title: "Stay / Security Proposal (Conditional)", status: "research-needed", approvalRequired: false },
      { type: "memo", title: "Risk Note — Go/No-Go Gate", status: "ready-for-supervising-advocate", approvalRequired: true },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-027 — Execution against changing assets
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-027",
    title: "Execution Against Changing Assets",
    domain: "Civil Procedure / Execution",
    complexity: "Advanced",
    approachStatus: "referral",
    approachStatusNote: "New client; final decree; asset risk",
    urgency: "urgent",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "Supplier has money decree; debtor closed account and advertises machinery; asset list is old.",
    backgroundHi:
      "आपूर्तिकर्ता के पास मनी डिक्री है; देनदार ने खाता बंद कर दिया है और मशीनरी का विज्ञापन देता है; संपत्ति सूची पुरानी है।",
    documents: [
      "Certified copy of final decree",
      "Judgment (copy)",
      "Payment ledger / decree amount calculation",
      "Site photographs (machinery advertised)",
      "Registry / company search (old)",
      "Prior execution proceedings (if any)",
      "Correspondence — demand after decree",
      "Bank account clues (old)",
    ],
    missingDocuments: [
      "Current certified registry / ROC search — CRITICAL",
      "Bank account closure proof (latest)",
      "Machinery advertisement (certified copy)",
      "Decree finality proof (appeal period expired / no appeal pending)",
      "Interest + cost calculation from decree date to today",
    ],
    documentGaps: [
      "Asset list is old — current asset position UNCONFIRMED",
      "Account closed voluntarily vs. bank-initiated — UNCONFIRMED",
      "Machinery is owned by judgment-debtor or third party — UNCONFIRMED",
      "Decree is final — appeal status UNCONFIRMED",
    ],
    clientRequest:
      "Execute efficiently and prevent proven dissipation.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Check finality: no appeal pending, limitation expired, adjustment confirmed",
        "Verify territorial jurisdiction of executing court",
        "Check limitation for execution application (if any)",
        "Update asset list through lawful registry / bank searches",
        "Sequence: disclosure application first, then attachment, avoid speculative attachment",
      ],
      research: [
        "Verify CPC execution provisions — attachment modes, disclosure orders — UNCONFIRMED",
        "Check limitation for execution application from decree date — UNCONFIRMED",
        "Research garnishee / bank attachment procedure for closed account — UNCONFIRMED",
        "Assess whether machinery advertisement proves 'dissipation intent' — UNCONFIRMED",
        "Verify whether prior execution proceedings bar fresh filing — UNCONFIRMED",
      ],
      drafting: [
        "Execution petition (with interest + cost calculation)",
        "Calculation sheet (principal + interest + costs)",
        "Asset affidavit (decree-holder — known assets)",
        "Attachment / garnishee application",
        "Notice to judgment-debtor",
        "Asset change tracker",
      ],
      review: [
        "Supervising advocate must confirm decree is FINAL and executable",
        "Ensure asset attachments are not speculative — some evidence of ownership required",
      ],
      filing: [
        "DO NOT attach third-party property without clear ownership evidence",
        "Calculation must include interest up to date of application per decree terms",
        "Disclosure order (before attachment) may be safer if asset details incomplete",
      ],
    },
    unresolvedFacts: [
      "Decree finality — appeal status — UNCONFIRMED",
      "Current asset ownership — UNCONFIRMED",
      "Execution application limitation — UNCONFIRMED",
      "Machinery ownership (JD vs. third party) — UNCONFIRMED",
    ],
    adverseFact:
      "Old asset list shows same machinery was mortgaged to a bank — bank may have prior charge making execution less effective. Recorded as adverse fact; check registry for prior encumbrances before filing attachment.",
    drafts: [
      { type: "application", title: "Execution Petition", status: "blocked", jurisdiction: "Executing Court (CPC)", approvalRequired: true, blockedReason: "Decree finality not confirmed; execution limitation not computed" },
      { type: "table", title: "Decree Calculation Sheet (Principal + Interest + Costs)", status: "draft", approvalRequired: false },
      { type: "affidavit", title: "Decree-Holder Asset Affidavit (Known Assets)", status: "draft", approvalRequired: false },
      { type: "application", title: "Attachment / Garnishee Application", status: "research-needed", approvalRequired: true },
      { type: "notice", title: "Notice to Judgment-Debtor", status: "draft", approvalRequired: false },
      { type: "memo", title: "Asset Change Tracker", status: "intake-only", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-028 — Caveat before property-sale injunction
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-028",
    title: "Caveat Before Property-Sale Injunction",
    domain: "Civil Procedure / Caveat",
    complexity: "Intermediate",
    approachStatus: "referral",
    approachStatusNote: "Proactive referral; ex parte threat; no suit number",
    urgency: "moderate",
    documentCompleteness: "partial",
    workflowState: "draft",
    background:
      "Co-owner expects injunction against family settlement registration and wants notice first.",
    backgroundHi:
      "सह-मालिक परिवार समझौता पंजीकरण के खिलाफ आदेश की आशा करता है और पहले नोटिस चाहता है।",
    documents: [
      "Title deed / property documents",
      "Family correspondence (re: settlement)",
      "Draft family settlement deed (if any)",
      "Power of attorney / appointment (if any)",
      "Prior notice received (if any)",
      "ID and address proof of caveator",
    ],
    missingDocuments: [
      "Exact property description / schedule from title",
      "Probable applicant identity (who will file injunction)",
      "Probable court / forum (jurisdiction)",
      "Subject-matter of expected suit (exact grounds)",
    ],
    documentGaps: [
      "No suit number filed — cannot verify expected forum or applicant",
      "Probable forum is guesswork based on property value and subject — UNCONFIRMED",
      "Settlement deed not in caveator's possession — terms UNCONFIRMED",
    ],
    clientRequest:
      "Lodge valid caveat and prepare response without needless escalation.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Identify probable forum: court jurisdiction based on property value + location",
        "Identify probable applicant: likely co-owners opposing caveator's interest",
        "Identify probable subject: injunction against family settlement registration",
        "Prepare concise caveat (do not file on pure guesswork)",
        "Serve likely applicant (if identifiable) to avoid ex parte surprise",
      ],
      research: [
        "Verify CPC provisions for caveat — duration, notice requirements — UNCONFIRMED",
        "Check which court has jurisdiction (property value + subject) — UNCONFIRMED",
        "Research whether caveat can be filed before suit — UNCONFIRMED",
        "Assess caveat expiry and renewal requirements — UNCONFIRMED",
      ],
      drafting: [
        "Caveat petition (per CPC)",
        "Service affidavit (on likely applicant if identifiable)",
        "Response index (for when application is received)",
        "Chronology of events (family settlement history)",
        "Negotiation letter (without waiving rights)",
      ],
      review: [
        "Supervising advocate must confirm caveat is lodged in CORRECT court (jurisdiction)",
        "Ensure caveat does not contain substantive pleadings — only request for notice",
      ],
      filing: [
        "DO NOT file caveat in wrong court — verify jurisdiction first",
        "Do not file substantive defence in caveat — caveat is only for NOTICE",
        "Serve likely applicant (if known) to avoid ex parte order being passed before caveat enters system",
      ],
    },
    unresolvedFacts: [
      "Probable court jurisdiction — UNCONFIRMED",
      "Probable applicant identity — UNCONFIRMED",
      "Whether settlement is registered or pending — UNCONFIRMED",
      "Suit filed or not yet — UNCONFIRMED",
    ],
    adverseFact:
      "Family correspondence shows caveator initially agreed to settlement in principle — opponent may argue caveat is mala fide obstruction. Recorded as adverse fact; ensure response preserves right to challenge settlement validity while acknowledging initial discussions.",
    drafts: [
      { type: "application", title: "Caveat Petition (CPC)", status: "draft", jurisdiction: "Civil Court (to confirm)", approvalRequired: true },
      { type: "affidavit", title: "Caveat Service Affidavit (Likely Applicant)", status: "draft", approvalRequired: false },
      { type: "index", title: "Response Index (Post-Receipt of Application)", status: "intake-only", approvalRequired: false },
      { type: "chronology", title: "Family Settlement Chronology", status: "draft", approvalRequired: false },
      { type: "letter", title: "Without-Prejudice Negotiation Letter", status: "ready-for-supervising-advocate", approvalRequired: true },
    ],
    citationGate: "PENDING",
    limitationGate: "UNKNOWN",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-029 — Confidential design misuse by contractor
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-029",
    title: "Confidential Design Misuse by Contractor",
    domain: "IP / Injunction",
    complexity: "Expert",
    approachStatus: "referral",
    approachStatusNote: "Founder referral; ownership disputed; urgent",
    urgency: "critical",
    documentCompleteness: "partial",
    workflowState: "research-needed",
    background:
      "Former contractor launched similar product and allegedly copied unreleased designs; one contractor lacks signed assignment.",
    backgroundHi:
      "पूर्व ठेकेदार ने समान उत्पाद लॉन्च किया है और कथित रूप से अप्रकाशित डिज़ाइन कॉपी किए हैं; एक ठेकेदार के पास हस्ताक्षरित असाइनमेंट नहीं है।",
    documents: [
      "Contracts / agreements with both contractors",
      "System access logs (lawful)",
      "Design files (dated, versioned)",
      "Timestamp / version history evidence",
      "NDA / confidentiality agreement",
      "Invoices / payment records",
      "Product screenshots (alleged copy vs. original)",
      "Role descriptions (contractors' scope)",
      "Takedown correspondence (if any)",
    ],
    missingDocuments: [
      "Signed assignment / ownership deed from Contractor-1 (missing — CRITICAL)",
      "Forensic comparison report (independent expert)",
      "Proof of confidential quality (not public before misuse)",
      "Copyright registration (if any)",
      "Evidence of access + copying (not just similarity)",
    ],
    documentGaps: [
      "Contractor-1 has NO signed assignment — ownership of their deliverables DISPUTED",
      "Similarity alone does not prove copying — access + substantial similarity required — UNCONFIRMED",
      "Whether designs were publicly disclosed before contractor's launch — UNCONFIRMED",
      "Copyright vs. confidence vs. contract theories — which is strongest — UNCONFIRMED",
    ],
    clientRequest:
      "Protect identified confidential material without overbroad restraint.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Identify specifically protectable material (file-by-file, design-by-design)",
        "Verify ownership: check all contractor agreements for assignment clauses",
        "Map access logs — who accessed what, when",
        "Separate legal theories: copyright, breach of confidence, contract",
        "Seek narrow file-specific relief — preserve lawful independent work",
      ],
      research: [
        "Verify copyright ownership without signed assignment — UNCONFIRMED",
        "Check breach of confidence ingredients (quality + access + misuse) — UNCONFIRMED",
        "Research interim injunction standard (prima facie + balance of convenience) — UNCONFIRMED",
        "Assess whether Anton Piller / search order is available — UNCONFIRMED",
        "Verify jurisdiction for IP injunction (commercial court or district) — UNCONFIRMED",
      ],
      drafting: [
        "Cease-and-desist letter (narrow, specific files)",
        "Injunction application (interim + final skeleton)",
        "Confidentiality schedule (each protected item identified)",
        "Evidence preservation protocol",
        "Undertaking (if court requires — damages undertaking)",
      ],
      review: [
        "Supervising advocate must ensure injunction is NOT overbroad — only specific files",
        "Verify ownership gap for Contractor-1 is addressed (quantum meruit vs. ownership)",
      ],
      filing: [
        "DO NOT seek restraint on general product category — only on proven copied files",
        "Cease-and-desist first before approaching court (evidence of demand)",
        "Preserve all design files lawfully — do not access contractor's personal systems",
      ],
    },
    unresolvedFacts: [
      "Ownership of Contractor-1 deliverables (no signed assignment) — DISPUTED",
      "Evidence of actual copying (not just similarity) — UNCONFIRMED",
      "Confidential quality of designs (were they public?) — UNCONFIRMED",
      "Strongest legal theory (copyright vs. confidence vs. contract) — UNCONFIRMED",
    ],
    adverseFact:
      "Client's own marketing team shared 2 teaser images publicly 3 weeks before launch — contractor may argue these 2 designs are no longer confidential. Recorded as adverse fact; exclude these 2 from confidentiality schedule and seek relief only for remaining non-public designs.",
    drafts: [
      { type: "letter", title: "Cease-and-Desist Letter (Narrow File-Specific)", status: "draft", approvalRequired: true },
      { type: "application", title: "Interim Injunction Application", status: "blocked", jurisdiction: "Commercial Court / District Court", approvalRequired: true, blockedReason: "Ownership gap (Contractor-1 no assignment); copying not forensically proven" },
      { type: "index", title: "Confidentiality Schedule (File-by-File Protected Items)", status: "draft", approvalRequired: false },
      { type: "memo", title: "Evidence Preservation Protocol", status: "draft", approvalRequired: false },
      { type: "undertaking", title: "Damages Undertaking (Court Requirement)", status: "intake-only", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-030 — Wrong survey number in closed pleadings
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-030",
    title: "Wrong Survey Number in Closed Pleadings",
    domain: "Civil Procedure / Amendment",
    complexity: "Intermediate",
    approachStatus: "returning-client",
    approachStatusNote: "Existing plaintiff; record newly certified",
    urgency: "moderate",
    documentCompleteness: "partial",
    workflowState: "draft",
    background:
      "Boundaries are right but survey number was copied wrongly; certified revenue record came after written statement.",
    backgroundHi:
      "सीमाएँ सही हैं लेकिन सर्वे नंबर गलत कॉपी किया गया था; प्रमाणित राजस्व रिकॉर्ड लिखित वक्तव्य के बाद आया है।",
    documents: [
      "Plaint (filed — contains wrong survey no.)",
      "Written statement (filed by defendant)",
      "Certified revenue record (NEW — correct survey no.)",
      "Old deed / prior title document",
      "Map / survey plan (certified if possible)",
      "Prior amendment application history (if any)",
      "Court orders on pleadings stage",
      "Clerk affidavit (for copying error)",
    ],
    missingDocuments: [
      "Certified survey map from competent authority",
      "Comparison schedule (old wrong vs. new correct description with boundaries)",
      "Evidence of diligence (why error was discovered late)",
      "Defendant's consent or objection indication (if known)",
    ],
    documentGaps: [
      "Why error was not caught before filing — diligence explanation needed",
      "Whether correct survey no. changes cause of action or merely description — UNCONFIRMED",
      "Prejudice to defendant from amendment — must be assessed — UNCONFIRMED",
    ],
    clientRequest:
      "Correct description without changing cause or prejudicing defendant.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Compare old plaint description with certified revenue record line-by-line",
        "Confirm boundaries are IDENTICAL — only survey number differs",
        "Explain diligence (how and when error was discovered)",
        "Test limitation / prejudice: will amendment delay trial? Does it catch defendant by surprise?",
        "Propose consequential corrections (map schedule, relief description) — never silently replace identity",
      ],
      research: [
        "Verify CPC amendment of pleadings provisions — 'shall be allowed if no prejudice' — UNCONFIRMED",
        "Check whether amendment at written-statement stage is permitted as of right — UNCONFIRMED",
        "Research 'description correction vs. cause-of-action change' distinction — UNCONFIRMED",
        "Assess whether court fee is affected by correction — UNCONFIRMED",
      ],
      drafting: [
        "Amendment application (u/s CPC Order VI Rule 17)",
        "Redline schedule (old vs. new description with boundaries)",
        "Affidavit (diligence + no prejudice)",
        "Corrected description sheet (annexure)",
        "Hearing note (prejudice arguments anticipated)",
      ],
      review: [
        "Supervising advocate must confirm correction does NOT change cause of action",
        "Ensure boundaries are identical — if boundaries differ, amendment may be contested",
      ],
      filing: [
        "DO NOT file amended plaint without court order — file amendment application first",
        "Redline schedule must show EXACT differences — no hidden changes",
        "Offer defendant opportunity to consent — reduces opposition",
      ],
    },
    unresolvedFacts: [
      "Whether boundaries are truly identical (plaint vs. certified record) — UNCONFIRMED",
      "Diligence explanation for late discovery — UNCONFIRMED",
      "Prejudice to defendant — UNCONFIRMED",
      "Court fee impact — UNCONFIRMED",
    ],
    adverseFact:
      "Client had certified revenue record 1 month before filing plaint but clerk used old template — defendant may argue lack of diligence. Recorded as adverse fact; prepare clerk affidavit explaining template error and why re-verification was delayed until written-statement stage.",
    drafts: [
      { type: "application", title: "Amendment Application — Pleadings Correction (CPC OVI R17)", status: "draft", jurisdiction: "Civil Court (pending suit)", approvalRequired: true },
      { type: "table", title: "Redline Schedule — Old vs. New Description", status: "draft", approvalRequired: false },
      { type: "affidavit", title: "Diligence + No-Prejudice Affidavit", status: "draft", approvalRequired: false },
      { type: "application", title: "Corrected Description Sheet (Annexure)", status: "draft", approvalRequired: false },
      { type: "memo", title: "Hearing Note — Prejudice Arguments Anticipated", status: "intake-only", approvalRequired: false },
    ],
    citationGate: "SECONDARY",
    limitationGate: "KNOWN",
    syntheticLabel: "SYNTHETIC / DEMO",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EX-031 — Written statement with set-off and admission trap
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "EX-031",
    title: "Written Statement With Set-Off and Admission Trap",
    domain: "Civil Defence",
    complexity: "Advanced",
    approachStatus: "referral",
    approachStatusNote: "Summons served; 18 days; accounts incomplete",
    urgency: "critical",
    documentCompleteness: "incomplete",
    workflowState: "draft",
    background:
      "Distributor alleges defective goods and counter-demand, but emails admit receipt without immediate objection.",
    backgroundHi:
      "वितरक दोषपूर्ण माल और प्रतिदावे का आरोप लगाता है, लेकिन ईमेल बिना तत्काल आपत्ति के प्राप्ति स्वीकार करते हैं।",
    documents: [
      "Plaint (summons served)",
      "Invoices (supplier to distributor)",
      "Goods challans / delivery notes",
      "Emails (ALL — including receipt admissions)",
      "Complaint emails (distributor to supplier)",
      "Inspection / test reports (if any)",
      "Contract terms and conditions",
      "Counter-invoice (distributor's counter-demand)",
      "Proof of summons service + date",
    ],
    missingDocuments: [
      "Complete set of accounts — CRITICAL for set-off calculation",
      "Written contract (unsigned emails only — formal contract?)",
      "Inspection report at time of delivery (if any)",
      "Defective goods return proof (if distributor claims returned)",
      "Limitation calculation (18-day window for WS)",
    ],
    documentGaps: [
      "18-day deadline running — accounts incomplete for set-off amount",
      "Email admissions: received goods 'without immediate objection' — may be treated as deemed acceptance — UNCONFIRMED",
      "Set-off vs. counterclaim procedural availability — UNCONFIRMED",
      "Contract terms — unsigned — which terms apply — UNCONFIRMED",
    ],
    clientRequest:
      "Defend, preserve set-off/counterclaim and avoid contradiction of admissions.",
    requestClarity: "clear",
    actionPlan: {
      facts: [
        "Calculate deadline for written statement (from summons service date)",
        "Answer EACH material fact in plaint paragraph-wise — no evasion",
        "Classify admissions explicitly: what is admitted, what is denied, what is not admitted",
        "Plead defects but explain why receipt objection was delayed (if possible)",
        "Test procedural availability: set-off vs. counterclaim at WS stage",
        "OBTAIN complete accounts before quantifying set-off amount",
      ],
      research: [
        "Verify CPC written-statement deadline (30/90 days from service) — UNCONFIRMED",
        "Check set-off requirements (mutual debts, ascertained sum) — UNCONFIRMED",
        "Research effect of 'receipt without objection' emails — deemed acceptance? — UNCONFIRMED",
        "Assess whether counterclaim is permitted with WS or requires separate pleading — UNCONFIRMED",
        "Verify limitation for set-off amount — UNCONFIRMED",
      ],
      drafting: [
        "Written statement (paragraph-wise, admission matrix)",
        "Objections (preliminary — limitation, misjoinder, etc.)",
        "Set-off schedule (contingent on completed accounts)",
        "Admission matrix (each plaint allegation: admit/deny/not-admit)",
        "Verification (statutory format)",
        "Document list (defendant's documents)",
      ],
      review: [
        "Supervising advocate must confirm NO CONTRADICTION between admissions and defence",
        "Set-off amount must be ASCERTAINED — do not plead vague set-off",
      ],
      filing: [
        "File written statement WITHIN DEADLINE — do not wait for perfect accounts (can file supplementary set-off later if court permits)",
        "EVERY plaint paragraph must be answered — silence = admission under CPC",
        "Do not deny email receipt explicitly — instead, explain why objection was delayed / qualify the admission",
      ],
    },
    unresolvedFacts: [
      "Written-statement deadline — 18 days remain from service — URGENT",
      "Complete accounts for set-off amount — PENDING",
      "Set-off procedural requirements met — UNCONFIRMED",
      "Receipt-without-objection email legal effect — UNCONFIRMED",
    ],
    adverseFact:
      "Email dated [date] says 'Received goods, will inspect and revert in 3 days' — no objection for 45 days. This creates a strong admission trap for plaintiff. Recorded as adverse fact; do NOT deny the email in WS. Instead, explain: inspection was delayed due to [reasonable excuse], defects discovered on [date], objection raised within reasonable time from discovery — not from receipt.",
    drafts: [
      { type: "pleading", title: "Written Statement (Paragraph-Wise Response)", status: "draft", jurisdiction: "Civil Court (summons served)", approvalRequired: true },
      { type: "memo", title: "Preliminary Objections", status: "draft", approvalRequired: false },
      { type: "table", title: "Set-Off Schedule (Contingent — Accounts Pending)", status: "blocked", approvalRequired: true, blockedReason: "Complete accounts not obtained — set-off amount cannot be ascertained" },
      { type: "table", title: "Admission Matrix — Plaint Allegation x Response", status: "draft", approvalRequired: false },
      { type: "affidavit", title: "Statutory Verification", status: "draft", approvalRequired: false },
      { type: "index", title: "Defendant Document List", status: "draft", approvalRequired: false },
    ],
    citationGate: "PENDING",
    limitationGate: "URGENT",
    syntheticLabel: "SYNTHETIC / DEMO",
  },
] as Array<Omit<IntakeExample, "terminalOutcome">>).map(withTerminalOutcome);

export type { IntakeExample as Week03IntakeExample };
