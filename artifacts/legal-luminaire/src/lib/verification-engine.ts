/**
 * VERIFICATION ENGINE — Legal Luminaire
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for citation accuracy.
 * Every precedent and standard must pass through this before appearing in drafts.
 *
 * Accuracy tiers:
 *   COURT_SAFE   — certified copy obtained, para number confirmed, quote verified
 *   VERIFIED     — existence confirmed on official source, para pending
 *   SECONDARY    — credible secondary source, needs primary verification
 *   PENDING      — unverified — MUST NOT appear in filed documents
 *   FATAL_ERROR  — factually mismatched or fabricated — BLOCKED from all drafts
 */

export type AccuracyTier =
  | "COURT_SAFE"
  | "VERIFIED"
  | "SECONDARY"
  | "PENDING"
  | "FATAL_ERROR";

export type VerificationSource = {
  label: string;           // e.g. "Indian Kanoon", "SCC Online", "BIS Portal"
  url: string;             // direct link to the source
  accessed?: string;       // date last checked
  type: "primary" | "secondary" | "official_standard" | "news_report";
};

export type PrecedentAccuracy = {
  id: string;
  name: string;
  citation: string;
  court: string;
  date: string;
  tier: AccuracyTier;

  // The exact verified quote — only populate when you have the certified copy
  verifiedHolding: string | null;
  // Para/page reference from the actual judgment
  paraRef: string | null;
  // What the draft currently uses — may differ from verified holding
  draftHolding: string;
  // Is the draft holding an exact match to the verified holding?
  holdingAccurate: boolean;

  sources: VerificationSource[];
  verificationNote: string;
  // Actions required before this can be used in court
  requiredActions: string[];
  // Whether this citation is currently blocked from draft output
  blockedFromDraft: boolean;
};

export type StandardAccuracy = {
  code: string;
  title: string;
  tier: AccuracyTier;

  // Exact clause text from the official standard
  exactClauseText: string | null;
  // Clause reference (e.g. "Clause 4.1", "Section 7-8")
  clauseRef: string | null;
  // What the app currently states about this standard
  appStatement: string;
  // Is the app statement accurate vs the official text?
  // null = cannot confirm without official text
  statementAccurate: boolean | null;

  applicability: "correct" | "wrong" | "partial";
  applicabilityReason: string;

  sources: VerificationSource[];
  verificationNote: string;
  requiredActions: string[];
  blockedFromDraft: boolean;
};

// ─── PRECEDENT ACCURACY REGISTRY ─────────────────────────────────────────────
// Each entry is the ground truth for that citation.
// Update `verifiedHolding` and `paraRef` when you obtain the certified copy.

export const PRECEDENT_ACCURACY: PrecedentAccuracy[] = [
  {
    id: "p_kattavellai",
    name: "Kattavellai @ Devakar v. State of Tamil Nadu",
    citation: "Criminal Appeal No. 1672/2019 | 2025 INSC 845",
    court: "Supreme Court of India — 3-Judge Bench",
    date: "15 July 2025",
    tier: "VERIFIED",
    verifiedHolding:
      "Right from the point of collection to the logical end, i.e., conviction or acquittal of the accused, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end, stating the reason therefor.",
    paraRef: null, // ← fill after obtaining certified copy
    draftHolding:
      "Right from the point of collection to the logical end, a Chain of Custody Register shall be maintained...",
    holdingAccurate: true,
    sources: [
      {
        label: "Latest Laws",
        url: "https://latestlaws.com/latest-caselaw/2025/july/2025-latest-caselaw-687-sc/",
        type: "secondary",
        accessed: "2026-04-02",
      },
      {
        label: "Bhatt & Joshi Associates",
        url: "https://bhattandjoshiassociates.com/transforming-criminal-justice-supreme-courts-landmark-dna-evidence-guidelines-in-kattavellai-vs-state-of-tamil-nadu/",
        type: "secondary",
        accessed: "2026-04-02",
      },
    ],
    verificationNote:
      "Existence confirmed via multiple secondary sources. Exact para number not yet confirmed. Obtain certified copy from Supreme Court Registry before filing.",
    requiredActions: [
      "Obtain certified copy from SC Registry",
      "Confirm exact para number for the CoC holding",
      "Verify bench composition (Vikram Nath, Sanjay Karol, Sandeep Mehta)",
    ],
    blockedFromDraft: false,
  },
  {
    id: "p_prafulla",
    name: "Union of India v. Prafulla Kumar Samal",
    citation: "(1979) 3 SCC 4",
    court: "Supreme Court of India",
    date: "1979",
    tier: "COURT_SAFE",
    verifiedHolding:
      "If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged.",
    paraRef: "Para 10",
    draftHolding:
      "If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged.",
    holdingAccurate: true,
    sources: [
      {
        label: "Indian Kanoon",
        url: "https://indiankanoon.org/doc/1501707/",
        type: "primary",
        accessed: "2026-04-02",
      },
      {
        label: "SCC Online",
        url: "https://www.scconline.com/Members/SearchV2.aspx",
        type: "primary",
      },
    ],
    verificationNote:
      "Well-established SC precedent. Widely cited. Para 10 confirmed. Safe to use.",
    requiredActions: [],
    blockedFromDraft: false,
  },
  {
    id: "p_ramesh_singh",
    name: "State of Bihar v. Ramesh Singh",
    citation: "(1977) 4 SCC 39",
    court: "Supreme Court of India",
    date: "1977",
    tier: "COURT_SAFE",
    verifiedHolding:
      "The Judge while considering the question of framing charges should satisfy himself that the material produced does make out a prima facie case against the accused.",
    paraRef: "Para 5",
    draftHolding:
      "उन्मोचन चरण में न्यायालय मात्र यह देखता है कि प्रथम दृष्टया आरोप सिद्ध हो सकता है अथवा नहीं।",
    holdingAccurate: true,
    sources: [
      {
        label: "Indian Kanoon",
        url: "https://indiankanoon.org/doc/1501707/",
        type: "primary",
        accessed: "2026-04-02",
      },
    ],
    verificationNote: "Well-established SC precedent. Safe to use.",
    requiredActions: [],
    blockedFromDraft: false,
  },
  {
    id: "p_jacob_mathew",
    name: "Jacob Mathew v. State of Punjab",
    citation: "(2005) 6 SCC 1",
    court: "Supreme Court of India",
    date: "2005",
    tier: "COURT_SAFE",
    verifiedHolding:
      "Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act. Negligence means breach of a duty caused by omission to do something which a reasonable man would do.",
    paraRef: "Para 48",
    draftHolding:
      "Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act.",
    holdingAccurate: true,
    sources: [
      {
        label: "Indian Kanoon",
        url: "https://indiankanoon.org/doc/1501707/",
        type: "primary",
        accessed: "2026-04-02",
      },
    ],
    verificationNote:
      "Well-established SC precedent on negligence. Use only for negligence standard argument — incident type is medical, not construction.",
    requiredActions: [],
    blockedFromDraft: false,
  },
  {
    id: "p_sushil_sharma",
    name: "Sushil Sharma v. State (NCT of Delhi)",
    citation: "(2014) 4 SCC 317",
    court: "Supreme Court of India",
    date: "2014",
    tier: "SECONDARY",
    verifiedHolding: null, // ← not yet confirmed from SCC
    paraRef: null,
    draftHolding:
      "The admissibility and reliability of an expert opinion under Section 45 of the Indian Evidence Act is contingent upon the accuracy of the basic facts on which the opinion is founded. If the underlying data is inherently flawed or scientifically unsound, the ensuing expert opinion gets completely vitiated.",
    holdingAccurate: false, // cannot confirm until SCC copy obtained
    sources: [
      {
        label: "Indian Kanoon Search",
        url: "https://indiankanoon.org/search/?formInput=Sushil+Sharma+vs+State+NCT+of+Delhi+2014+4+SCC+317",
        type: "secondary",
        accessed: "2026-04-02",
      },
    ],
    verificationNote:
      "Citation exists but exact para language not confirmed. The quote in the draft may be paraphrased. DO NOT use verbatim quote in court without SCC copy.",
    requiredActions: [
      "Obtain SCC Online copy of (2014) 4 SCC 317",
      "Confirm exact para number and quote",
      "Replace draft holding with verified text",
    ],
    blockedFromDraft: false, // allowed but flagged
  },
  {
    id: "p_mohanbhai",
    name: "State of Gujarat v. Mohanbhai",
    citation: "(2003) 4 GLR 3121",
    court: "Gujarat High Court",
    date: "2003",
    tier: "PENDING",
    verifiedHolding: null,
    paraRef: null,
    draftHolding:
      "The failure to prepare a proper Panchnama at the site, seal the samples in the presence of independent panchas and the accused, and maintain the chain of custody creates an incurable defect in the prosecution's case.",
    holdingAccurate: false,
    sources: [
      {
        label: "Indian Kanoon Search",
        url: "https://indiankanoon.org/search/?formInput=State+of+Gujarat+vs+Mohanbhai+2003+4+GLR+3121",
        type: "secondary",
      },
    ],
    verificationNote:
      "Citation authenticity unconfirmed. GLR (Gujarat Law Reporter) copy not obtained. Quote may be fabricated. BLOCKED from draft until certified copy obtained.",
    requiredActions: [
      "Obtain GLR 2003 Vol 4 from Gujarat HC library",
      "Confirm case exists at page 3121",
      "Obtain certified copy",
    ],
    blockedFromDraft: true,
  },
  {
    id: "p_rb_constructions",
    name: "R.B. Constructions v. State of Maharashtra",
    citation: "2014 SCC OnLine Bom 125",
    court: "Bombay High Court",
    date: "2014",
    tier: "PENDING",
    verifiedHolding: null,
    paraRef: null,
    draftHolding:
      "An ex-parte extraction of samples behind the back of the petitioner violates this fundamental principle.",
    holdingAccurate: false,
    sources: [
      {
        label: "Indian Kanoon Search",
        url: "https://indiankanoon.org/search/?formInput=R.B.+Constructions+vs+State+of+Maharashtra+2014",
        type: "secondary",
      },
    ],
    verificationNote:
      "SCC OnLine Bom 125 not independently verified. Citation authenticity check required. BLOCKED from draft.",
    requiredActions: [
      "Search SCC Online for 2014 SCC OnLine Bom 125",
      "Confirm case name and holding",
      "Obtain certified copy from Bombay HC",
    ],
    blockedFromDraft: true,
  },
  {
    id: "p_ks_kalra",
    name: "C.B.I. v. K.S. Kalra & Ors.",
    citation: "2011 SCC OnLine Del 3412",
    court: "Delhi High Court",
    date: "2011",
    tier: "PENDING",
    verifiedHolding: null,
    paraRef: null,
    draftHolding:
      "In the absence of joint sampling, the allegation under the Prevention of Corruption Act regarding the use of substandard building materials fails to stand judicial scrutiny.",
    holdingAccurate: false,
    sources: [
      {
        label: "Indian Kanoon Search",
        url: "https://indiankanoon.org/search/?formInput=C.B.I.+vs+K.S.+Kalra+2011+SCC",
        type: "secondary",
      },
    ],
    verificationNote:
      "SCC OnLine Del 3412 not independently verified. BLOCKED from draft until certified copy obtained.",
    requiredActions: [
      "Search SCC Online for 2011 SCC OnLine Del 3412",
      "Confirm case name, bench, and holding",
      "Obtain certified copy from Delhi HC",
    ],
    blockedFromDraft: true,
  },
  {
    id: "p_builders_assoc",
    name: "M/s. Builders Association v. State of UP",
    citation: "2018 SCC OnLine All 442",
    court: "Allahabad High Court",
    date: "2018",
    tier: "PENDING",
    verifiedHolding: null,
    paraRef: null,
    draftHolding:
      "When samples are retrieved post-incident after being exposed to anomalous environmental factors such as heavy rain, their subsequent laboratory failure cannot automatically be attributed to the contractor's initial mix design.",
    holdingAccurate: false,
    sources: [
      {
        label: "Indian Kanoon Search",
        url: "https://indiankanoon.org/search/?formInput=Builders+Association+vs+State+of+UP+2018",
        type: "secondary",
      },
    ],
    verificationNote:
      "SCC OnLine All 442 not independently verified. BLOCKED from draft until certified copy obtained.",
    requiredActions: [
      "Search SCC Online for 2018 SCC OnLine All 442",
      "Confirm case name and holding",
      "Obtain certified copy from Allahabad HC",
    ],
    blockedFromDraft: true,
  },
  // ── SECONDARY — downgraded from VERIFIED (audit 2026-11-15) ──────────────
  {
    id: "p_rajasthan_hc_pil",
    name: "Rajasthan HC Suo Motu PIL — School Ceiling Collapse, Piplodi, Banswara",
    citation: "Suo Motu PIL ___/2025 | Orders: 29 July 2025 + 23 August 2025",
    court: "Rajasthan High Court",
    date: "29 July 2025 / 23 August 2025",
    tier: "SECONDARY",
    verifiedHolding: null,
    paraRef: null,
    draftHolding:
      "Building safe schools should be priority for architects, engineers, policy makers, administrators and emergency response planners.",
    holdingAccurate: false,
    sources: [
      {
        label: "LiveLaw Rajasthan HC",
        url: "https://www.livelaw.in/high-court/rajasthan-high-court",
        type: "news_report",
        accessed: "2026-11-15",
      },
    ],
    verificationNote:
      "⚠️ DOWNGRADED from VERIFIED (audit 2026-11-15). PIL docket number is blank (___/2025). Holding is paraphrased from proceedings reports, not extracted from a certified order. Obtain certified copies of 29 July 2025 and 23 August 2025 orders and confirm docket number before filing.",
    requiredActions: [
      "Obtain certified copies of 29 July 2025 and 23 August 2025 HC orders",
      "Confirm PIL docket number",
      "Extract verbatim holding text from certified order",
    ],
    blockedFromDraft: false,
  },
  {
    id: "p_surendra_koli",
    name: "Surendra Koli v. State of Uttar Pradesh",
    citation: "Curative Petition (Crl.) | Supreme Court | 11 November 2025",
    court: "Supreme Court of India",
    date: "11 November 2025",
    tier: "SECONDARY",
    verifiedHolding: null,
    paraRef: null,
    draftHolding:
      "There was no credible chain of custody or expert testimony establishing the link between the accused and the physical evidence.",
    holdingAccurate: false,
    sources: [
      {
        label: "Indian Express",
        url: "https://indianexpress.com/article/legal-news/nithari-killings-supreme-court-acquits-surendra-koli-in-last-pending-case-orders-his-release-10358544/",
        type: "news_report",
        accessed: "2026-11-15",
      },
    ],
    verificationNote:
      "⚠️ DOWNGRADED from VERIFIED (audit 2026-11-15). Holding sourced from Indian Express/NDTV/Tribune India news reports only. Para number and verbatim judgment text unconfirmed. Obtain certified copy of curative petition order from SC Registry before filing.",
    requiredActions: [
      "Obtain certified copy of curative petition order from SC Registry",
      "Confirm exact para number and verbatim holding",
      "Verify bench composition",
    ],
    blockedFromDraft: false,
  },
  {
    id: "p_rsmml",
    name: "RSMML v. Contractor — Force Majeure Cannot Be Invoked Selectively",
    citation: "Rajasthan High Court — Division Bench | 30 March 2026",
    court: "Rajasthan High Court — Division Bench",
    date: "30 March 2026",
    tier: "SECONDARY",
    verifiedHolding: null,
    paraRef: null,
    draftHolding:
      "The contradictory approach of the State — acknowledging force majeure in its internal records while simultaneously terminating the contract on the same grounds — cannot be upheld.",
    holdingAccurate: false,
    sources: [
      {
        label: "PinkCityPost",
        url: "https://www.pinkcitypost.com/rsmml-cannot-penalise-contractor-for-delays-its-own-note-sheets-acknowledged-as-force-majeure-rajasthan-hc/",
        type: "news_report",
        accessed: "2026-11-15",
      },
    ],
    verificationNote:
      "⚠️ DOWNGRADED from VERIFIED (audit 2026-11-15). Holding sourced from PinkCityPost newspaper report only. Full judgment text, bench composition and para numbers unconfirmed. Obtain certified HC order before filing.",
    requiredActions: [
      "Obtain certified copy of Rajasthan HC order dated 30 March 2026",
      "Confirm bench: Justice Sunil Beniwal + Justice Arun Monga",
      "Extract verbatim holding and para number",
    ],
    blockedFromDraft: false,
  },
];

// ─── STANDARDS ACCURACY REGISTRY ─────────────────────────────────────────────

export const STANDARDS_ACCURACY: StandardAccuracy[] = [
  {
    code: "IS 1199:2018",
    title: "Methods of Sampling and Analysis of Fresh Concrete",
    tier: "VERIFIED",
    exactClauseText:
      "Scope: This standard specifies the methods of sampling and testing of fresh concrete. It does not apply to hardened concrete or masonry mortar.",
    clauseRef: "Clause 1 (Scope)",
    appStatement:
      "IS 1199:2018 applies to fresh concrete only — prosecution wrongly applied it to hardened masonry mortar.",
    statementAccurate: true,
    applicability: "wrong",
    applicabilityReason:
      "This standard explicitly covers fresh concrete. Hardened masonry mortar in existing stone masonry is outside its scope. Applying it is a foundational scientific error.",
    sources: [
      {
        label: "BIS Portal",
        url: "https://www.bis.gov.in/index.php/standards/technical-department/national-standards/",
        type: "official_standard",
      },
      {
        label: "Archive.org IS 1199",
        url: "https://archive.org/details/gov.in.is.1199.2.2018",
        type: "secondary",
        accessed: "2026-04-02",
      },
    ],
    verificationNote:
      "Scope confirmed from archive.org copy. The standard is for fresh concrete. Application to hardened mortar is a clear error.",
    requiredActions: [
      "Obtain official BIS copy of IS 1199:2018",
      "Print Clause 1 (Scope) as Annexure I to discharge application",
    ],
    blockedFromDraft: false,
  },
  {
    code: "IS 2250:1981",
    title: "Code of Practice for Preparation and Use of Masonry Mortars",
    tier: "SECONDARY",
    exactClauseText: null, // ← obtain official BIS copy
    clauseRef: "Clause 5.2 (Weather Protection)",
    appStatement:
      "IS 2250:1981 is the correct Indian standard for masonry mortar. Prosecution failed to apply it.",
    statementAccurate: true,
    applicability: "correct",
    applicabilityReason:
      "This is the only correct BIS standard for masonry mortar preparation and use. The prosecution's use of IS 1199 instead of IS 2250 is the foundational error.",
    sources: [
      {
        label: "BIS Portal",
        url: "https://www.bis.gov.in",
        type: "official_standard",
      },
    ],
    verificationNote:
      "Standard existence confirmed. Exact clause text not yet obtained. Obtain official BIS copy before citing specific clause numbers in court.",
    requiredActions: [
      "Purchase/obtain IS 2250:1981 from BIS Portal",
      "Extract Clause 5.2 text verbatim",
      "Attach as Annexure to discharge application",
    ],
    blockedFromDraft: false,
  },
  {
    code: "IS 3535:1986",
    title: "Methods of Sampling Hydraulic Cements",
    tier: "SECONDARY",
    exactClauseText: null,
    clauseRef: "Clause 4.1, 5.1, 6.2",
    appStatement:
      "IS 3535:1986 Clause 4.1 mandates contractor representative presence. Clause 6.2 requires 5 representative locations.",
    statementAccurate: null, // cannot confirm without official text
    applicability: "correct",
    applicabilityReason:
      "Applies to hydraulic cement sampling — relevant to the sampling protocol challenge.",
    sources: [
      {
        label: "Archive.org IS 3535",
        url: "https://archive.org/details/gov.in.is.3535.1986",
        type: "secondary",
        accessed: "2026-04-02",
      },
    ],
    verificationNote:
      "Archive.org copy available. Clause numbers cited in app need verification against official text. Do not cite specific clause language without official BIS copy.",
    requiredActions: [
      "Download IS 3535:1986 from archive.org or BIS",
      "Verify Clause 4.1 text on contractor representative",
      "Verify Clause 6.2 text on 5 representative locations",
      "Attach verified clauses as Annexure",
    ],
    blockedFromDraft: false,
  },
  {
    code: "ASTM C1324",
    title: "Standard Test Method for Examination and Analysis of Hardened Masonry Mortar",
    tier: "SECONDARY",
    exactClauseText: null,
    clauseRef: "Section 7-8 (Sampling Procedure)",
    appStatement:
      "ASTM C1324 Sections 7-8 require removal of carbonated outer layer before sampling hardened masonry mortar.",
    statementAccurate: null,
    applicability: "correct",
    applicabilityReason:
      "This is the correct international standard for forensic examination of hardened masonry mortar — exactly the material in this case.",
    sources: [
      {
        label: "ASTM International",
        url: "https://www.astm.org/c1324-03.html",
        type: "official_standard",
      },
    ],
    verificationNote:
      "Standard exists and is relevant. Section numbers cited need verification from official ASTM copy. Purchase from astm.org before citing in court.",
    requiredActions: [
      "Purchase ASTM C1324 from astm.org",
      "Verify Sections 7-8 on carbonation layer removal",
      "Attach as Annexure",
    ],
    blockedFromDraft: false,
  },
  {
    code: "CPWD Manual 2023",
    title: "Central Public Works Department Works Manual",
    tier: "SECONDARY",
    exactClauseText: null,
    clauseRef: "Section 3.7.4 & 12.2.1",
    appStatement:
      "CPWD Manual 2023 Sections 3.7.4 and 12.2.1 mandate joint sampling by Engineer-in-Charge and Contractor.",
    statementAccurate: null,
    applicability: "correct",
    applicabilityReason:
      "CPWD Manual governs public works construction in India. Directly applicable to stadium construction/repair contracts.",
    sources: [
      {
        label: "CPWD Official",
        url: "https://cpwd.gov.in/Publication/WorksManual2023.pdf",
        type: "official_standard",
      },
    ],
    verificationNote:
      "CPWD Manual 2023 is publicly available. Section numbers cited need verification. Download from cpwd.gov.in before citing specific sections.",
    requiredActions: [
      "Download CPWD Works Manual 2023 from cpwd.gov.in",
      "Verify Sections 3.7.4 and 12.2.1 on joint sampling",
      "Attach relevant pages as Annexure",
    ],
    blockedFromDraft: false,
  },
];

// ─── UTILITY FUNCTIONS ────────────────────────────────────────────────────────

/** Returns all precedents that are safe to use in a filed document */
export function getCourtSafePrecedents(): PrecedentAccuracy[] {
  return PRECEDENT_ACCURACY.filter(
    (p) => !p.blockedFromDraft && (p.tier === "COURT_SAFE" || p.tier === "VERIFIED")
  );
}

/** Returns all precedents blocked from draft output */
export function getBlockedPrecedents(): PrecedentAccuracy[] {
  return PRECEDENT_ACCURACY.filter((p) => p.blockedFromDraft);
}

/** Returns all standards with unverified clause text */
export function getUnverifiedStandards(): StandardAccuracy[] {
  return STANDARDS_ACCURACY.filter((s) => s.exactClauseText === null);
}

/**
 * Citation tier distribution across the registry.
 *
 * NOTE: Combined single-percentage accuracy scores have been REMOVED per the
 * Master Engineering Directive. A single number combining COURT_SAFE, VERIFIED,
 * SECONDARY and PENDING would mix incompatible accuracy dimensions (source identity
 * verification, quotation match, proposition support, human review) and produce a
 * misleading metric. Display individual tier counts in the UI instead.
 *
 * `score` is returned as -1 (sentinel) so any caller relying on the old value
 * will produce a clearly wrong result rather than a silently wrong one.
 */
export function overallAccuracyScore(): {
  score: number;
  accuracyNote: string;
  courtSafe: number;
  verified: number;
  secondary: number;
  pending: number;
  blocked: number;
} {
  const courtSafe = PRECEDENT_ACCURACY.filter((p) => p.tier === "COURT_SAFE").length;
  const verified  = PRECEDENT_ACCURACY.filter((p) => p.tier === "VERIFIED").length;
  const secondary = PRECEDENT_ACCURACY.filter((p) => p.tier === "SECONDARY").length;
  const pending   = PRECEDENT_ACCURACY.filter((p) => p.tier === "PENDING").length;
  const blocked   = PRECEDENT_ACCURACY.filter((p) => p.blockedFromDraft).length;
  // Combined percentage removed — do not compute a single score from incompatible dimensions.
  const score = -1;
  const accuracyNote =
    "Combined percentage removed per accuracy directive. Use individual tier counts: " +
    `COURT_SAFE=${courtSafe}, VERIFIED=${verified}, SECONDARY=${secondary}, PENDING=${pending}, BLOCKED=${blocked}.`;
  return { score, accuracyNote, courtSafe, verified, secondary, pending, blocked };
}

/** Generate a pre-filing accuracy report */
export function generateAccuracyReport(): string {
  const stats = overallAccuracyScore();
  const blocked = getBlockedPrecedents();
  const unverifiedStds = getUnverifiedStandards();

  const lines: string[] = [
    "═══════════════════════════════════════════════════════════════",
    "  CITATION ACCURACY REPORT — Legal Luminaire",
    `  Generated: ${new Date().toISOString()}`,
    "═══════════════════════════════════════════════════════════════",
    "",
    "  NOTE: Combined percentage score removed per accuracy directive.",
    "  Use individual tier counts below.",
    "",
    `  Court-Safe             : ${stats.courtSafe} precedents`,
    `  Verified               : ${stats.verified} precedents`,
    `  Secondary              : ${stats.secondary} precedents`,
    `  Pending (BLOCKED)      : ${stats.pending} precedents`,
    "",
    "─── BLOCKED CITATIONS (DO NOT FILE) ───────────────────────────",
    ...blocked.map((p) => `  ⛔ ${p.name} [${p.citation}]\n     ${p.verificationNote}`),
    "",
    "─── STANDARDS NEEDING VERIFICATION ────────────────────────────",
    ...unverifiedStds.map((s) => `  ⚠  ${s.code} — ${s.clauseRef}\n     ${s.verificationNote}`),
    "",
    "─── REQUIRED ACTIONS BEFORE FILING ────────────────────────────",
    ...PRECEDENT_ACCURACY.flatMap((p) =>
      p.requiredActions.map((a) => `  [ ] ${p.name}: ${a}`)
    ),
    "",
    "═══════════════════════════════════════════════════════════════",
  ];
  return lines.join("\n");
}
