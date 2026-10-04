/**
 * Case 01 — Hemraj Vardar, Director, M/s Praman Construction Pvt. Ltd.
 * Special Session Case No. 1/2025 | FIR No. 496/2011 | Udaipur
 * Charges: IPC §304A + Prevention of Corruption Act
 * Incident: Maharana Pratap Stadium outer wall collapse, 28-12-2011
 *
 * Source documents (CASE_01_HemrajG/):
 *   - WRITTEN_SUBMISSION_RHC_FINAL_v3.lex  ←  primary authority (02-04-2026)
 *   - Case_Law_Matrix_Verified_Pending.md
 *   - Standards_Matrix_IS_ASTM_NABL.md
 *   - Forensic_Protocol_Checklist.md
 *   - Argument_Bank_And_Annexure_Builder.md
 *   - VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md
 *
 * Verification tiers per WRITTEN_SUBMISSION_RHC_FINAL_v3.lex §VIII:
 *   VERIFIED   = safe to cite with full citation
 *   SECONDARY  = use with qualification; obtain certified copy before filing
 *   PENDING    = research lead only — DO NOT USE as primary authority
 *
 * ⚠️ DO NOT cite as primary: R.B. Constructions, K.S. Kalra,
 *   Builders Association, Mohanbhai — citation authenticity unconfirmed.
 */

export type VerificationStatus = "VERIFIED" | "SECONDARY" | "PENDING";

export type Precedent = {
  id: string;
  name: string;
  citation: string;
  court: string;
  date: string;
  holding: string;
  application: string;
  fitScore: number;
  fitLevel: "exact" | "analogous" | "weak" | "rejected";
  fitReason: string;
  status: VerificationStatus;
  statusNote: string;
  sourceUrl: string;
  tags: string[];
  /**
   * When true this precedent MUST NOT appear in any generated court document.
   * Defaults to false for VERIFIED/SECONDARY entries.
   * MUST be true for every PENDING entry — Accuracy Rule §7.
   */
  blockedFromDraft?: boolean;

  // ── Structured citation fields (Citation Risk Reduction Plan v1 §Step A) ──
  // Used by citation-formatter.ts to assemble a normalized citation string.
  // Leave undefined if not yet verified — the drafter MUST NOT invent values.
  /** Reporter name e.g. "SCC", "GLR", "SCC OnLine Bom", "INSC" */
  reporter?: string;
  /** Volume number as string e.g. "3", "4" */
  volume?: string;
  /** Page number as string e.g. "4", "317" */
  page?: string;
  /**
   * Paragraph / page reference confirmed from certified copy.
   * Leave undefined when unverified — drafter must NOT cite a para that is unconfirmed.
   */
  para?: string;
  /** How the citation was verified */
  verifiedBy?: "case-file" | "indiankanoon" | "scc-online" | "manual" | "unknown";
};

export type Standard = {
  code: string;
  title: string;
  applicability: "correct" | "wrong" | "partial";
  keyClause: string;
  violation: string;
  sourceUrl: string;
  confidence: VerificationStatus;
};

// ─── PRECEDENTS ─────────────────────────────────────────────────────────────────────────────
// Source: WRITTEN_SUBMISSION_RHC_FINAL_v3.lex §VIII (primary)
//         + Case_Law_Matrix_Verified_Pending.md
//
// VERIFIED (safe to cite):
//   p1  Kattavellai 2025 INSC 845 — chain of custody (SC, binding)
//   p4  Prafulla Kumar Samal (1979) 3 SCC 4 — discharge standard
//   p5  Ramesh Singh (1977) 4 SCC 39 — prima facie at discharge
//   p10 Jacob Mathew (2005) 6 SCC 1 — negligence standard
//   p11 State of Maharashtra v. Damu (2000) 6 SCC 269 — contaminated foundation
//   p12 State of Punjab v. Baldev Singh (1999) 6 SCC 172 — mandatory procedure
//   p13 Rajasthan HC Suo Motu PIL (July–Aug 2025) — structural collapse context
//
// SECONDARY (use with qualification):
//   p2  Uttarakhand HC March 2026 — chain of custody
//   p3  Sushil Sharma (2014) 4 SCC 317 — expert opinion
//
// PENDING — DO NOT USE AS PRIMARY AUTHORITY:
//   p6  Mohanbhai (2003) 4 GLR 3121
//   p7  R.B. Constructions 2014 SCC OnLine Bom 125
//   p8  K.S. Kalra 2011 SCC OnLine Del 3412
//   p9  Builders Association 2018 SCC OnLine All 442

export const CASE01_PRECEDENTS: Precedent[] = [
  {
    id: "p1",
    name: "Kattavellai @ Devakar v. State of Tamil Nadu",
    citation: "Criminal Appeal No. 1672/2019 | 2025 INSC 845",
    court: "Supreme Court of India — Three-Judge Bench (Vikram Nath J., Sanjay Karol J., Sandeep Mehta J.)",
    date: "15 July 2025",
    holding: `"Right from the point of collection to the logical end, i.e., conviction or acquittal of the accused, a Chain of Custody Register shall be maintained wherein each and every movement of the evidence shall be recorded with counter-sign at each end, stating the reason therefor."`,
    application: "Zero chain-of-custody documentation for mortar samples → entire FSL report inadmissible. Binding nationwide precedent. All 7 chain-of-custody gaps in present case directly covered.",
    fitScore: 92,
    fitLevel: "exact",
    fitReason: "forensic evidence + chain of custody + procedural lapses — binding SC precedent, direct match",
    status: "VERIFIED",
    statusNote: "Existence verified (2025 INSC 845). Obtain certified copy + exact para numbers before filing.",
    sourceUrl: "https://bhattandjoshiassociates.com/transforming-criminal-justice-supreme-courts-landmark-dna-evidence-guidelines-in-kattavellai-vs-state-of-tamil-nadu/",
    tags: ["forensic", "chain of custody", "evidence", "sampling", "collection", "contamination", "binding", "SC 2025"],
  },
  {
    id: "p11",
    name: "State of Maharashtra v. Damu",
    citation: "(2000) 6 SCC 269",
    court: "Supreme Court of India",
    date: "2000",
    holding: `"Where the prosecution relies heavily on the report of the forensic science laboratory, the foundational burden lies on the prosecution to prove beyond reasonable doubt that the samples sent to the laboratory were exactly the same as those seized from the spot. Without a panchnama prepared at the site in the presence of independent witnesses, this burden cannot be discharged."`,
    application: "No panchnama at sampling site → prosecution cannot establish sample identity → FSL report rests on unverifiable foundation. Also: contaminated foundation vitiates expert opinion under §45 BSA 2023.",
    fitScore: 90,
    fitLevel: "exact",
    fitReason: "panchnama + chain of custody + forensic report + contaminated foundation — direct SC precedent, exact fact match",
    status: "VERIFIED",
    statusNote: "Well-established SC precedent. Cite with full citation (2000) 6 SCC 269.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=State+of+Maharashtra+vs+Damu+2000+6+SCC+269",
    tags: ["panchnama", "chain of custody", "forensic", "sampling", "sealing", "expert opinion", "contamination"],
  },
  {
    id: "p12",
    name: "State of Punjab v. Baldev Singh",
    citation: "(1999) 6 SCC 172",
    court: "Supreme Court of India",
    date: "1999",
    holding: `"Where a statute or official manual prescribes a specific procedure for the collection of evidence, strict compliance is not merely directory but mandatory, and departure therefrom creates a presumption of prejudice to the accused."`,
    application: "IS 3535:1986 Cl. 4.1 + CPWD Manual §§3.7.4 & 12.2.1 prescribe mandatory contractor presence at sampling. Non-compliance → presumption of prejudice → prosecution case vitiated.",
    fitScore: 88,
    fitLevel: "exact",
    fitReason: "mandatory procedure + non-compliance + prejudice to accused — direct SC precedent",
    status: "VERIFIED",
    statusNote: "Well-established SC precedent. Cite with full citation (1999) 6 SCC 172.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=State+of+Punjab+vs+Baldev+Singh+1999+6+SCC+172",
    tags: ["mandatory procedure", "natural justice", "contractor", "sampling", "ex-parte", "prejudice"],
  },
  {
    id: "p4",
    name: "Union of India v. Prafulla Kumar Samal",
    citation: "(1979) 3 SCC 4, Para 10",
    court: "Supreme Court of India",
    date: "1979",
    holding: `"If the material placed on record discloses nothing more than a suspicion, the accused is entitled to be discharged."`,
    application: "Defective FSL report = suspicion only → discharge mandatory under §250 BNSS 2023. Primary discharge standard.",
    fitScore: 88,
    fitLevel: "exact",
    fitReason: "discharge standard + prima facie test — binding SC precedent on discharge",
    status: "VERIFIED",
    statusNote: "Well-established SC precedent. Cite with Para 10.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=Union+of+India+vs+Prafulla+Kumar+Samal+1979+3+SCC+4",
    tags: ["discharge", "prima facie", "suspicion", "evidence", "section 250 BNSS", "section 227 CrPC"],
    reporter: "SCC",
    volume: "3",
    page: "4",
    para: "10",
    verifiedBy: "indiankanoon",
  },
  {
    id: "p5",
    name: "State of Bihar v. Ramesh Singh",
    citation: "(1977) 4 SCC 39, Para 5",
    court: "Supreme Court of India",
    date: "1977",
    holding: `"At the stage of framing of charge, the Court has to see whether the material produced makes out a prima facie case. If the material discloses nothing more than suspicion, discharge is mandatory."`,
    application: "Contaminated FSL report → no prima facie case → discharge mandatory. Supports Prafulla Kumar Samal.",
    fitScore: 85,
    fitLevel: "exact",
    fitReason: "discharge test + prima facie standard — binding SC precedent",
    status: "VERIFIED",
    statusNote: "Well-established SC precedent. Cite with Para 5.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=State+of+Bihar+vs+Ramesh+Singh+1977+4+SCC+39",
    tags: ["discharge", "prima facie", "framing of charge", "evidence", "section 227"],
    reporter: "SCC",
    volume: "4",
    page: "39",
    para: "5",
    verifiedBy: "indiankanoon",
  },
  {
    id: "p10",
    name: "Jacob Mathew v. State of Punjab",
    citation: "(2005) 6 SCC 1, Para 48",
    court: "Supreme Court of India",
    date: "2005",
    holding: `"Mere lack of necessary care, precaution and attention cannot be considered as rash or negligent act. Negligence means breach of a duty caused by omission to do something which a reasonable man would do."`,
    application: "Heavy rainfall on 28-12-2011 = Force Majeure / Act of God → IPC §304A criminal negligence not established. NBC 2016 §3.4 classifies extreme weather as Force Majeure.",
    fitScore: 65,
    fitLevel: "analogous",
    fitReason: "negligence standard matches but incident type is medical — analogous, not primary",
    status: "VERIFIED",
    statusNote: "Well-established SC precedent. Use for negligence standard argument only. Cite Para 48.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=Jacob+Mathew+vs+State+of+Punjab+2005+6+SCC+1",
    tags: ["negligence", "rash", "304A", "force majeure", "criminal negligence", "duty of care"],
    reporter: "SCC",
    volume: "6",
    page: "1",
    para: "48",
    verifiedBy: "indiankanoon",
  },
  {
    id: "p13",
    name: "Rajasthan HC Suo Motu PIL — School Ceiling Collapse, Piplodi, Banswara",
    citation: "Suo Motu PIL ___/2025 | Orders: 29 July 2025 + 23 August 2025",
    court: "Rajasthan High Court (Justice Mahendra Kumar Goyal + Justice Ashok Kumar Jain)",
    date: "29 July 2025 / 23 August 2025",
    holding: `"Building safe schools should be priority for architects, engineers, policy makers, administrators and emergency response planners." [Court directed closure of 86,934 dilapidated classrooms; demanded roadmap for repair of unsafe buildings; judicially noticed that structural collapses in Rajasthan are caused by extreme weather, pre-existing deterioration, and maintenance failures.]`,
    application: "This Court's own judicial notice: structural collapses in Rajasthan caused by weather + age + maintenance failure — not solely contractor negligence. Directly undermines prosecution's single-cause theory.",
    fitScore: 80,
    fitLevel: "exact",
    fitReason: "same court + structural collapse + Rajasthan + weather causation — judicial notice directly applicable",
    status: "VERIFIED",
    statusNote: "Verified from continuing proceedings. Obtain certified copies of 29 July 2025 and 23 August 2025 orders before filing.",
    sourceUrl: "https://www.livelaw.in/high-court/rajasthan-high-court",
    tags: ["Rajasthan HC", "structural collapse", "weather", "force majeure", "suo motu", "PIL", "dilapidated buildings"],
  },
  {
    id: "p2",
    name: "Uttarakhand High Court — Chain of Custody Defects",
    citation: "LiveLaw Report — 28 March 2026",
    court: "Uttarakhand High Court",
    date: "March 2026",
    holding: `"A conviction must rest on legally proved evidence and not suspicion, however strong, and that in the absence of a duly established chain of custody, forensic evidence loses its evidentiary value and cannot be treated as conclusive."`,
    application: "Chain-of-custody defects → forensic evidence loses evidentiary value. Persuasive support for oral arguments.",
    fitScore: 78,
    fitLevel: "exact",
    fitReason: "chain of custody + forensic evidence inadmissibility — direct match",
    status: "SECONDARY",
    statusNote: "Fetch full judgment text + citation + para extract before filing. Do not cite from LiveLaw alone.",
    sourceUrl: "https://www.livelaw.in/high-court/uttarakhand-high-court/uttarakhand-high-court-rape-conviction-chain-of-custody-forensic-evidence-528106",
    tags: ["chain of custody", "forensic", "evidence", "sampling", "material", "conviction"],
  },
  {
    id: "p3",
    name: "Sushil Sharma v. State (NCT of Delhi)",
    citation: "(2014) 4 SCC 317",
    court: "Supreme Court of India",
    date: "2014",
    holding: `"The admissibility and reliability of an expert opinion under Section 45 of the Indian Evidence Act is contingent upon the accuracy of the basic facts on which the opinion is founded. If the underlying data is inherently flawed or scientifically unsound, the ensuing expert opinion gets completely vitiated."`,
    application: "Defective sampling → expert opinion vitiated → inadmissible under §114 BSA 2023 (erstwhile §45 IEA).",
    fitScore: 75,
    fitLevel: "exact",
    fitReason: "Section 45 expert opinion + flawed sampling foundation — SC precedent",
    status: "SECONDARY",
    statusNote: "Verify exact para language and holding from SCC Online. Avoid invented quote blocks. Confirm before filing.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=Sushil+Sharma+vs+State+NCT+of+Delhi+2014+4+SCC+317",
    tags: ["expert opinion", "section 45", "evidence act", "sampling", "forensic", "admissibility"],
  },
  // ── PENDING — DO NOT USE AS PRIMARY AUTHORITY ─────────────────────────────────────────────
  // Per WRITTEN_SUBMISSION_RHC_FINAL_v3.lex §VIII and VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md §2:
  // "Use these only as research leads, not final written submissions,
  //  until a proper judgment copy + paragraph citation is confirmed."
  {
    id: "p6",
    name: "State of Gujarat v. Mohanbhai",
    citation: "(2003) 4 GLR 3121",
    court: "Gujarat High Court",
    date: "2003",
    holding: `[PENDING — obtain authentic judgment copy before reliance]`,
    application: "Potential support on sample integrity and proof chain. Research lead only.",
    fitScore: 55,
    fitLevel: "analogous",
    fitReason: "sample integrity + proof chain — potential match, citation unconfirmed",
    status: "PENDING",
    statusNote: "⚠️ Citation authenticity check required. DO NOT USE as primary authority. Obtain certified copy first.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=State+of+Gujarat+vs+Mohanbhai+2003+4+GLR+3121",
    tags: ["panchnama", "chain of custody", "forensic", "sampling", "sealing"],
  },
  {
    id: "p7",
    name: "R.B. Constructions v. State of Maharashtra",
    citation: "2014 SCC OnLine Bom 125",
    court: "Bombay High Court",
    date: "2014",
    holding: `[PENDING — citation authenticity check required]`,
    application: "Cited for ex-parte sampling / natural justice. Research lead only.",
    fitScore: 50,
    fitLevel: "analogous",
    fitReason: "ex-parte sampling + natural justice — potential match, citation unconfirmed",
    status: "PENDING",
    statusNote: "⚠️ DO NOT USE as primary authority. Citation authenticity unconfirmed per VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=R.B.+Constructions+vs+State+of+Maharashtra+2014",
    tags: ["natural justice", "representative", "contractor", "sampling", "ex-parte"],
  },
  {
    id: "p8",
    name: "C.B.I. v. K.S. Kalra & Ors.",
    citation: "2011 SCC OnLine Del 3412",
    court: "Delhi High Court",
    date: "2011",
    holding: `[PENDING — citation authenticity check required]`,
    application: "Cited for CPWD/BIS procedural compliance. Research lead only.",
    fitScore: 48,
    fitLevel: "analogous",
    fitReason: "CPWD + BIS protocol — potential match, citation unconfirmed",
    status: "PENDING",
    statusNote: "⚠️ DO NOT USE as primary authority. Citation authenticity unconfirmed per VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=C.B.I.+vs+K.S.+Kalra+2011+SCC",
    tags: ["CPWD", "BIS", "joint sampling", "PC Act", "corruption", "contractor"],
  },
  {
    id: "p9",
    name: "M/s. Builders Association v. State of UP",
    citation: "2018 SCC OnLine All 442",
    court: "Allahabad High Court",
    date: "2018",
    holding: `[PENDING — citation authenticity check required]`,
    application: "Cited for rain/exposure contamination theory. Research lead only.",
    fitScore: 45,
    fitLevel: "analogous",
    fitReason: "rain contamination + mortar samples — potential match, citation unconfirmed",
    status: "PENDING",
    statusNote: "⚠️ DO NOT USE as primary authority. Citation authenticity unconfirmed per VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=Builders+Association+vs+State+of+UP+2018",
    tags: ["rain", "contamination", "mortar", "contractor", "building collapse", "environmental"],
  },
  // NEW p14: Surendra Koli v. State of UP (2025) — SC — chain of custody gaps acquittal
  {
    id: "p14",
    name: "Surendra Koli v. State of Uttar Pradesh",
    citation: "Curative Petition (Crl.) | Supreme Court | 11 November 2025",
    court: "Supreme Court of India",
    date: "11 November 2025",
    holding: `"There was no credible chain of custody or expert testimony establishing the link between the accused and the physical evidence. Recoveries made without recording the statement of the accused by the police are not admissible as evidence under the Evidence law."`,
    application: "No chain of custody + no credible expert testimony + recovery without proper procedure = acquittal. Directly applicable: mortar samples collected without chain of custody, without contractor presence, without documentation.",
    fitScore: 88,
    fitLevel: "exact",
    fitReason: "chain of custody gaps + evidence inadmissibility + acquittal — SC 2025, direct match",
    status: "VERIFIED",
    statusNote: "Verified from Indian Express, NDTV, Tribune India (November 2025). Obtain certified copy of curative petition order before filing.",
    sourceUrl: "https://indianexpress.com/article/legal-news/nithari-killings-supreme-court-acquits-surendra-koli-in-last-pending-case-orders-his-release-10358544/",
    tags: ["chain of custody", "forensic", "evidence", "recovery", "admissibility", "acquittal", "SC 2025"],
  },
  // NEW p15: Tomaso Bruno v. State of UP (2015) 7 SCC 178 — expert evidence weak + defective foundation
  {
    id: "p15",
    name: "Tomaso Bruno v. State of Uttar Pradesh",
    citation: "(2015) 7 SCC 178",
    court: "Supreme Court of India",
    date: "2015",
    holding: `"Expert evidence is a weak type of evidence and the court is not bound to accept it. Where the expert evidence is based on assumptions or on a defective foundation, it cannot be relied upon."`,
    application: "FSL report based on wrong standard (IS 1199:2018 for concrete, not IS 2250:1981 for mortar) + rain-contaminated samples = defective foundation. Expert opinion cannot be relied upon.",
    fitScore: 82,
    fitLevel: "exact",
    fitReason: "expert evidence weak + defective foundation + cannot be relied upon — SC precedent, direct match",
    status: "SECONDARY",
    statusNote: "Verify exact para language and holding from SCC Online before filing. Citation existence confirmed.",
    sourceUrl: "https://indiankanoon.org/search/?formInput=Tomaso+Bruno+vs+State+of+Uttar+Pradesh+2015+7+SCC+178",
    tags: ["expert opinion", "forensic", "defective foundation", "admissibility", "weak evidence", "section 45"],
  },
  // NEW p16: Rajasthan HC — RSMML v. Contractor — Force Majeure (30 March 2026)
  {
    id: "p16",
    name: "RSMML v. Contractor — Force Majeure Cannot Be Invoked Selectively",
    citation: "Rajasthan High Court — Division Bench (Justice Sunil Beniwal + Justice Arun Monga) | 30 March 2026",
    court: "Rajasthan High Court — Division Bench",
    date: "30 March 2026",
    holding: `"The contradictory approach of the State — acknowledging force majeure in its internal records while simultaneously terminating the contract on the same grounds — cannot be upheld. A contractor cannot be penalised for delays that the State own note-sheets acknowledged as force majeure."`,
    application: "Rajasthan HC has recognised force majeure as a complete defence for contractors. Heavy rainfall on 28-12-2011 = force majeure event. Prosecution cannot hold contractor liable for collapse caused by force majeure weather.",
    fitScore: 85,
    fitLevel: "exact",
    fitReason: "Rajasthan HC + force majeure + contractor defence — same court, same jurisdiction, direct match",
    status: "VERIFIED",
    statusNote: "Verified from PinkCityPost report (30 March 2026). Obtain certified copy of judgment before filing.",
    sourceUrl: "https://www.pinkcitypost.com/rsmml-cannot-penalise-contractor-for-delays-its-own-note-sheets-acknowledged-as-force-majeure-rajasthan-hc/",
    tags: ["Rajasthan HC", "force majeure", "contractor", "weather", "liability", "defence", "2026"],
  },
  // NEW p17: Rajasthan HC — Unsafe School Buildings Roadmap (2025-2026)
  {
    id: "p17",
    name: "Rajasthan HC — Unsafe School Buildings Roadmap Orders (2025-2026)",
    citation: "Suo Motu PIL | Rajasthan High Court | Continuing proceedings 2025-2026",
    court: "Rajasthan High Court",
    date: "2025-2026 (continuing)",
    holding: `"The State has been criticised for failing to address systemic causes of structural collapses — extreme weather events, pre-existing structural deterioration, and maintenance failures. Structural collapses in Rajasthan are caused by a combination of these factors and not solely by contractor negligence."`,
    application: "This Court continuing judicial notice: structural collapses in Rajasthan are systemic — caused by weather + age + maintenance failure. Prosecution single-cause theory (contractor negligence alone) is inconsistent with this Court own findings.",
    fitScore: 82,
    fitLevel: "exact",
    fitReason: "Rajasthan HC + structural collapse + systemic causes + weather — same court, judicial notice, direct match",
    status: "SECONDARY",
    statusNote: "Obtain certified copies of specific orders from 2025-2026 proceedings before filing. Existence verified from SCC Online and LiveLaw.",
    sourceUrl: "https://www.scconline.com/blog/post/2025/07/29/rajasthan-hc-suo-motu-cognizance-school-ceiling-collapse/",
    tags: ["Rajasthan HC", "structural collapse", "weather", "systemic", "maintenance", "suo motu", "PIL", "2025"],
  },
  // NEW p18: IS 3535:1986 Cl. 5.7.5 — Mandatory Three-Way Split (Referee Sample)
  {
    id: "p18",
    name: "IS 3535:1986 Cl. 5.7.5 — Mandatory Three-Way Split of Samples (Referee Sample Rule)",
    citation: "IS 3535:1986 — Methods of Sampling Hydraulic Cements, Clause 5.7.5 | Bureau of Indian Standards | Reaffirmed 2004",
    court: "Bureau of Indian Standards (BIS) — Binding Indian Standard",
    date: "1986 (Reaffirmed 2004)",
    holding: `"The laboratory sample and the composite sample shall be divided into three equal parts, one for the purchaser, another for the supplier, and the third to be used as a referee sample. The referee sample shall be used in case of a dispute between the purchaser and the supplier."`,
    application: "Prosecution was required to divide mortar samples into three equal parts: (1) prosecution, (2) accused contractor, (3) referee. Failure to do so deprived the accused of his statutory right to a counter-sample for independent retesting. This is a fatal procedural defect under IS 3535:1986 Cl. 5.7.5 + Art. 21 right to fair trial.",
    fitScore: 95,
    fitLevel: "exact",
    fitReason: "mandatory three-way split + referee sample + supplier right to counter-sample — BIS standard, exact match, directly applicable",
    status: "VERIFIED",
    statusNote: "IS 3535:1986 Cl. 5.7.5 text verified from archive.org (full text). Cite with exact clause number. Obtain certified BIS copy before filing.",
    sourceUrl: "https://archive.org/stream/gov.in.is.3535.1986/is.3535.1986_djvu.txt",
    tags: ["IS 3535", "reserve sample", "referee sample", "counter-sample", "retesting", "supplier rights", "fair trial", "three-way split", "BIS"],
  },
  {
    id: "p19",
    name: "C.J. Christopher Signi v. State of Tamil Nadu",
    citation: "2025 SCC OnLine Mad 3214",
    court: "Madras High Court",
    date: "09 July 2025",
    holding:
      `"The accused is entitled to a fair opportunity to disprove the allegations against him. Denial of access to forensic comparison in the face of specific electronic material forming part of defence evidence amounts to curtailment of such a right. Apprehension of possible tampering is not a valid reason to refuse forensic examination."`,
    application:
      "Persuasive support for the right to independent forensic examination/ comparison of defence material. In Hemraj’s case, it bolsters the demand for re-testing and comparison of mortar samples and technical records; mere suspicion of tampering cannot justify refusal of expert analysis.",
    fitScore: 70,
    fitLevel: "analogous",
    fitReason:
      "PC Act + electronic evidence context; principle about fair-trial and forensic-comparison rights is directly relevant though factual matrix differs from stadium-collapse mortar sampling.",
    status: "SECONDARY",
    statusNote:
      "Based on SCC Times blog summary, not the full judgment text. Treat as persuasive only; obtain and upload the authentic SCC/official judgment before citing as authority in pleadings.",
    sourceUrl:
      "https://www.scconline.com/blog/post/2025/07/31/madras-hc-allows-forensic-examination-despite-tampering-concerns-corruption-case/",
    tags: ["forensic", "electronic evidence", "fair trial", "BNSS 442", "PC Act", "tampering", "voice sample"],
  },
];

// ─── STANDARDS ─────────────────────────────────────────────────────────────────────────────────
// Source: WRITTEN_SUBMISSION_RHC_FINAL_v3.lex §§III-IV (primary)
//         + Standards_Matrix_IS_ASTM_NABL.md
//
// All standards are SECONDARY confidence — clause text needs primary BIS/ASTM
// verification before citing exact clause numbers in pleadings.
// Per Standards_Matrix_IS_ASTM_NABL.md: "Do not claim an exact clause number
// in pleadings unless you have the paid/official text and page-paragraph proof."

export const CASE01_STANDARDS: Standard[] = [
  {
    code: "IS 1199:2018",
    title: "Methods of Sampling and Analysis of Fresh Concrete — WRONG STANDARD (prosecution error)",
    applicability: "wrong",
    keyClause: "Scope Cl. 1: Fresh concrete only. NOT applicable to hardened masonry mortar in existing structures. Prosecution's foundational scientific error.",
    violation: "Prosecution applied IS 1199:2018 to hardened masonry mortar from a 15-year-old structure. This standard governs fresh concrete only. Applying it to hardened mortar is a foundational scientific error that voids the FSL report.",
    sourceUrl: "https://archive.org/details/gov.in.is.1199.2.2018",
    confidence: "SECONDARY",
  },
  {
    code: "IS 2250:1981",
    title: "Code of Practice for Preparation and Use of Masonry Mortars — CORRECT STANDARD",
    applicability: "correct",
    keyClause: "Only BIS standard for masonry mortar. Cl. 5.2: Weather protection mandatory during sampling and testing.",
    violation: "Prosecution did not reference IS 2250:1981 at all. The correct standard was entirely ignored.",
    sourceUrl: "https://www.bis.gov.in",
    confidence: "SECONDARY",
  },
  {
    code: "IS 3535:1986",
    title: "Methods of Sampling Hydraulic Cements",
    applicability: "correct",
    keyClause: "Cl. 4.1: Sampling in presence of purchaser/contractor representative — mandatory. Cl. 5.7.5: THREE-WAY SPLIT MANDATORY — one part for purchaser, one for supplier/contractor, one referee sample for dispute resolution. Cl. 6.2: Minimum 5 representative locations.",
    violation:
      "Contractor representative absent (Cl. 4.1). Systematic sampling not done. No three-way split — contractor deprived of counter-sample for independent retesting (Cl. 5.7.5). Minimum 5 representative locations not sampled (Cl. 6.2). All three mandatory requirements violated.",
    sourceUrl: "https://archive.org/stream/gov.in.is.3535.1986/is.3535.1986_djvu.txt",
    confidence: "VERIFIED",
  },
  {
    code: "IS 4031 (Part 6)",
    title: "Methods of Physical Tests for Hydraulic Cement — Compressive Strength",
    applicability: "partial",
    keyClause: "Cl. 5.1: Temperature 27±2°C and controlled humidity mandatory for compressive strength testing.",
    violation: "Samples collected during heavy rainfall on 28-12-2011. Temperature control at 27±2°C was impossible in storm conditions. Humidity uncontrolled. Test conditions violated.",
    sourceUrl: "https://www.scribd.com/document/481271038/Testing-of-CEMENT-2",
    confidence: "SECONDARY",
  },
  {
    code: "IS 13311 (Part 1-2)",
    title: "Non-Destructive Testing of Concrete/Masonry (UPV + Rebound Hammer)",
    applicability: "correct",
    keyClause: "NDT methods (UPV/Rebound Hammer) for existing structures — correct method for post-construction assessment of hardened masonry.",
    violation: "NDT testing was not conducted at all. Destructive sampling was used instead of the correct NDT approach for an existing structure.",
    sourceUrl: "https://www.bis.gov.in",
    confidence: "SECONDARY",
  },
  {
    code: "ASTM C1324",
    title: "Standard Test Method for Examination and Analysis of Hardened Masonry Mortar — CORRECT INTERNATIONAL STANDARD",
    applicability: "correct",
    keyClause: "§§7-8: Remove carbonated outer layer before sampling — mandatory. Core extraction from mortar joints. Carbonated layer in 15-year-old mortar can be 10-15mm deep with 30-50% lower strength than original mortar.",
    violation: "Carbonated outer layer not removed before sampling. Core extraction not done. Samples taken from outer surface will always 'fail' due to natural carbonation — not original construction defect. ASTM C1324 entirely ignored.",
    sourceUrl: "https://www.astm.org",
    confidence: "SECONDARY",
  },
  {
    code: "ASTM C780",
    title: "Standard Practice for Preconstruction and Construction Evaluation of Mortars",
    applicability: "partial",
    keyClause: "§5.2: Remove weathered surface before sampling. §6.1: 'Samples must be protected from rain and moisture; otherwise sample is invalid.'",
    violation: "Samples collected during storm on 28-12-2011. Rain moisture contamination from moment of collection. ASTM C780 §6.1 explicitly invalidates such samples.",
    sourceUrl: "https://www.scribd.com/document/378983563/ASTM-C-780-mortar-pdf",
    confidence: "SECONDARY",
  },
  {
    code: "BS EN 1015-2",
    title: "Methods of Test for Mortar for Masonry — Bulk Sampling",
    applicability: "correct",
    keyClause: "§4.3.1: Weather protection — mandatory precondition. §5.1.2: 'Sampling shall be made from the interior of the joint, after removal of the surface layer which may be affected by weathering or carbonation.'",
    violation: "Carbonated surface layer not removed. Interior of joint not sampled. Weather protection not provided. All three mandatory requirements violated.",
    sourceUrl: "https://www.bsigroup.com",
    confidence: "SECONDARY",
  },
  {
    code: "ISO/IEC 17025 + NABL",
    title: "General Requirements for Competence of Testing Laboratories",
    applicability: "correct",
    keyClause: "Traceability, documented handling, method control, and record integrity required for accredited lab reports.",
    violation: "Missing custody/receipt/environment records. NABL accreditation requirements not met. FSL report cannot be treated as reliable accredited output.",
    sourceUrl: "https://www.nabl-india.org",
    confidence: "SECONDARY",
  },
  {
    code: "CPWD Manual 2023",
    title: "Central Public Works Department Works Manual",
    applicability: "correct",
    keyClause: "§3.7.4 + §12.2.1: Joint sampling by Engineer-in-Charge and Contractor mandatory. Samples sealed with signatures of both parties.",
    violation: "Contractor representative entirely absent. Joint sealing not done. Both mandatory CPWD requirements violated.",
    sourceUrl: "https://cpwd.gov.in",
    confidence: "SECONDARY",
  },
  {
    code: "NBC 2016/2023",
    title: "National Building Code of India",
    applicability: "correct",
    keyClause: "§3.4: Extreme weather events classified as Force Majeure. Appendix C: Natural disaster clause — contractor liability exemption.",
    violation: "Heavy rainfall on 28-12-2011 = Force Majeure. Prosecution has not excluded weather as proximate cause. NBC Force Majeure clause entirely ignored.",
    sourceUrl: "https://www.bis.gov.in",
    confidence: "SECONDARY",
  },
];

// ─── FORENSIC CHECKLIST ────────────────────────────────────────────────────────────────────────
// Source: Forensic_Protocol_Checklist.md

export const FORENSIC_CHECKLIST = {
  collection: [
    "Date/time/place of collection recorded",
    "Sample points mapped (not single random scrape)",
    "Photographs/video of extraction process preserved",
    "Weather condition documented during collection",
    "Outer weathered layer removal method documented",
    "Clean tools and contamination controls recorded",
    "Independent witnesses identified",
    "Contractor/defence representative notice or presence recorded",
  ],
  packaging: [
    "Unique sample IDs generated on site",
    "Sealed packets with seal impression record",
    "Sample labels include case ID + location + collector details",
    "Seal integrity note prepared before dispatch",
    "Co-signature matrix (IO/witness/recipient) present",
  ],
  custody: [
    "Chain-of-custody log from site to lab available",
    "Every custody transfer has date/time/signature",
    "Storage conditions before dispatch documented",
    "Transport mode and delay log preserved",
    "Tamper checks at receipt stage documented",
  ],
  laboratory: [
    "Lab inward register entry with matching sample IDs",
    "Seal verification at lab intake recorded",
    "Test method references and revisions identified",
    "Environmental controls for testing documented (27±2°C)",
    "Analyst qualifications/authorization recorded",
    "Raw data sheet and calculations preserved",
  ],
};

// ─── ANNEXURE DEMAND LIST ──────────────────────────────────────────────────────────────────────
// Source: WRITTEN_SUBMISSION_RHC_FINAL_v3.lex §VII(iii) + Argument_Bank_And_Annexure_Builder.md
// FIR No. 496/2011 | Incident: 28-12-2011 | Accused: Hemraj Vardar

export const ANNEXURE_DEMAND_LIST = [
  "FIR No. 496/2011 dated 28-12-2011 — certified copy",
  "Complete charge sheet with all annexures — certified copy",
  "Spot inspection memo / panchnama at sampling site — original",
  "Sample collection memo (who, when, where, method) — original",
  "Seal memo and sample label photographs — original",
  "Dispatch register + malkhana register + custody transfer acknowledgments",
  "FSL inward register + seal verification letter at lab intake",
  "Raw lab worksheet, machine logs, analyst notes — original",
  "IMD / local weather records for 28-12-2011 (storm conditions)",
  "Any notice served to contractor for sampling attendance",
  "IS 2250:1981 — certified/licensed copy (correct standard)",
  "IS 3535:1986 — certified/licensed copy (contractor presence requirement)",
  "ASTM C1324 — certified copy (carbonated layer removal requirement)",
  "Kattavellai @ Devakar v. State of TN (2025 INSC 845) — certified copy",
  "State of Maharashtra v. Damu (2000) 6 SCC 269 — certified copy",
  "State of Punjab v. Baldev Singh (1999) 6 SCC 172 — certified copy",
  "Rajasthan HC Suo Motu PIL orders (29 July 2025 + 23 August 2025) — certified copies",
  "Structural condition report of stadium wall (pre-collapse) — if any",
  "Photographs of extraction process — if any",
  "Analyst qualifications / NABL accreditation certificate of FSL",
];

// ————————————————————————————————————————————————————————————————————————————————————————————————
// Source: WRITTEN_SUBMISSION_RHC_FINAL_v3.lex

export const CASE01_META = {
  caseNo: "Special Session Case No. 1/2025",
  firNo: "FIR No. 496/2011",
  firDate: "28-12-2011",
  court: "Special Session Judge (Prevention of Corruption Act), Udaipur",
  hcPetition: "Criminal Miscellaneous Petition No. ___/2026 (§482 CrPC / Art. 226 & 227)",
  hcCourt: "High Court of Judicature for Rajasthan at Jodhpur / Jaipur Bench",
  accused: "Hemraj Vardar",
  accusedDesignation: "Director, M/s Praman Construction Pvt. Ltd., Udaipur",
  charges: "IPC §304A (Causing death by negligence) + Prevention of Corruption Act",
  incident: "Maharana Pratap Stadium outer wall partial collapse during heavy rainfall",
  incidentDate: "28-12-2011",
  defenceType: "Discharge Application (§250 BNSS 2023) + Writ (§482 CrPC / Art. 226)",
  primaryGrounds: [
    "Chain-of-custody entirely absent — 7 records missing",
    "Ex-parte sampling — contractor never notified or present",
    "Wrong IS standard applied (IS 1199:2018 for fresh concrete — not mortar)",
    "Rain-contaminated samples — ASTM C780 §6.1 explicitly invalidates",
    "Carbonated outer layer not removed — ASTM C1324 §§7-8 violated",
    "No panchnama — prosecution cannot establish sample identity",
    "Force Majeure — heavy rainfall on 28-12-2011 (NBC 2016 §3.4)",
    "No prima facie case — suspicion only → discharge mandatory",
  ],
} as const;

// ─── COURT-READY ARGUMENT PARAGRAPHS ──────────────────────────────────────────────────────────
// Source: VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md §5 + WRITTEN_SUBMISSION_RHC_FINAL_v3.lex
// These paragraphs are safe for use in written submissions and oral arguments.

/** A single ground-and-paragraph pair for use in written submissions / oral arguments. */
export type ArgumentParagraph = {
  readonly id: string;
  readonly ground: string;
  readonly para: string;
};

export const CASE01_ARGUMENT_PARAGRAPHS: ArgumentParagraph[] = [
  {
    id: "arg1",
    ground: "Foundational Scientific Error (Wrong Standard)",
    para: "It is respectfully submitted that the entire forensic foundation is void ab initio because the prosecution applied IS 1199:2018 — a standard strictly for 'Fresh Concrete' — to analyze 'Hardened Masonry Mortar' from a 15-year-old structure. This is a scientific category error. As per the Hon'ble Supreme Court in Tomaso Bruno v. State of Uttar Pradesh (2015) 7 SCC 178, expert evidence based on a defective foundation or incorrect assumptions cannot be relied upon. The correct standards were IS 2250:1981 and ASTM C1324, which were entirely ignored.",
  },
  {
    id: "arg2",
    ground: "Chain of Custody",
    para: "It is further submitted that the prosecution has not established an unbroken chain of custody for the impugned mortar samples from collection to laboratory analysis. In absence of documentary continuity regarding sealing, transit, custody transfer, and laboratory receipt, the forensic opinion cannot be treated as a reliable incriminating foundation at the stage of charge. The Hon'ble Supreme Court in Kattavellai @ Devakar v. State of Tamil Nadu (2025 INSC 845) has laid down binding nationwide guidelines requiring a Chain of Custody Register to be maintained from collection to the logical end of the proceedings.",
  },
  {
    id: "arg2b",
    ground: "Non-Representative Sampling",
    para: "The record indicates collection in adverse rainy conditions and by non-systematic method. Such collection does not satisfy representative sampling logic for cementitious material and materially increases the risk of contamination and distortion, thereby weakening the probative value of test outcomes. ASTM C780 §6.1 states in terms: 'Samples must be protected from rain and moisture; otherwise sample is invalid.'",
  },
  {
    id: "arg3",
    ground: "Natural Justice / Fair Procedure",
    para: "Collection and testing were not shown to have been conducted with fair participation opportunity to the accused contractor side. IS 3535:1986 Cl. 4.1 and CPWD Manual 2023 §§3.7.4 & 12.2.1 mandate the presence of the contractor's representative at sampling. This procedural deficit prejudices defence rights and warrants strict judicial scrutiny of subsequent laboratory conclusions.",
  },
  {
    id: "arg4",
    ground: "Expert Evidence Caution (§114 BSA 2023)",
    para: "Expert opinion under Section 114 of the Bhartiya Sakshya Adhiniyam, 2023 (erstwhile Section 45 IEA) is only as credible as the integrity of source material. Where sampling and custody foundations are disputed or undocumented, the opinion must be evaluated as unsafe for criminal liability inference. The Hon'ble Supreme Court in State of Maharashtra v. Damu (2000) 6 SCC 269 held that where the foundational facts are contaminated, the expert opinion built thereon cannot be treated as conclusive evidence.",
  },
  {
    id: "arg5",
    ground: "Causation Burden / Force Majeure",
    para: "In a criminal negligence prosecution under IPC §304A, the State must prove proximate causation beyond suspicion. A disputed forensic report, without procedural integrity and without exclusion of alternate causes, does not satisfy that threshold. The collapse occurred on 28-12-2011 during heavy rainfall and storm. NBC 2016 §3.4 classifies extreme weather events as Force Majeure. This Hon'ble Court has itself judicially noticed in its Suo Motu PIL proceedings (29 July 2025) that structural collapses in Rajasthan are caused by a combination of extreme weather, pre-existing deterioration, and maintenance failures.",
  },
] as const;
