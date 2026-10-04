// CASE_01_HemrajG - Stadium Wall Collapse Defence Case Data

export const caseInfo = {
  id: "CASE_01_HemrajG",
  title: "Special Session Case No. 1/2025 (Udaipur)",
  accused: "Hemraj Vardar (Contractor/Director)",
  charges: "IPC 304A / 337 / 338 + PCA",
  court: "Sessions Court, Udaipur",
  status: "Active — Defence Preparation",
  summary:
    "Outer stadium wall collapse occurred post-construction. Prosecution based its case on an FSL report using IS 1199:2018 (Fresh Concrete standard), which is technologically inapplicable to the hardened masonry mortar sampled. Defence challenges this foundational scientific error, along with sampling methodology, chain of custody, and weather contamination.",
};

export const timelineEvents = [
  {
    id: 1,
    title: "Project and Role Context",
    description:
      "Accused identified as contractor/director linked to repair/construction work.",
    status: "PENDING" as const,
    note: "Requires case file annexure proof",
  },
  {
    id: 2,
    title: "Incident — Wall Collapse",
    description:
      "Outer stadium wall collapse occurred post-construction/repair phase (not active pour stage).",
    status: "PENDING" as const,
    note: "",
  },
  {
    id: 3,
    title: "Weather Conditions at Sampling",
    description:
      "Defence version: sampling conducted during storm/rain, creating contamination risk.",
    status: "PENDING" as const,
    note: "To be corroborated via weather records + witnesses",
  },
  {
    id: 4,
    title: "Sampling Method Allegation",
    description:
      "Samples allegedly collected in haphazard/non-representative manner.",
    status: "PENDING" as const,
    note: "",
  },
  {
    id: 5,
    title: "Representation / Procedural Fairness",
    description:
      "No contractor representative present at collection/testing stage.",
    status: "PENDING" as const,
    note: "",
  },
  {
    id: 6,
    title: "Chain of Custody Issue",
    description:
      "Incomplete or absent chain-of-custody narrative (collection → sealing → dispatch → lab receipt → testing).",
    status: "PENDING" as const,
    note: "",
  },
  {
    id: 7,
    title: "Prosecution Dependence on FSL",
    description:
      "Case theory relies heavily on FSL conclusion of weak/failed mortar quality.",
    status: "PENDING" as const,
    note: "",
  },
];

export const caseLawMatrix = [
  {
    case: "Kattavellai @ Devakar v. State of Tamil Nadu, Cr. A. 1672/2019",
    court: "Supreme Court",
    useForDefence: "Chain-of-custody rigor and forensic-procedure scrutiny",
    status: "VERIFIED" as const,
    action: "Add certified/order copy and exact para numbers",
  },
  {
    case: "Uttarakhand HC (March 2026 — chain-of-custody defects)",
    court: "High Court",
    useForDefence:
      "Forensic evidence loses force when custody chain is not proved",
    status: "SECONDARY" as const,
    action: "Fetch full judgment text/citation and para extract",
  },
  {
    case: "Surendra Koli v. CBI (2023 refs on evidentiary scrutiny)",
    court: "Supreme Court",
    useForDefence:
      "Reinforces strict proof requirements in forensic-heavy cases",
    status: "SECONDARY" as const,
    action: "Confirm exact proposition from judgment text",
  },
  {
    case: "Sushil Sharma v. State (NCT of Delhi), (2014) 4 SCC 317",
    court: "Supreme Court",
    useForDefence:
      "General caution that expert opinion depends on factual foundation",
    status: "SECONDARY" as const,
    action: "Verify exact para language; avoid invented quote blocks",
  },
  {
    case: "State of Gujarat v. Mohanbhai (2003) 4 GLR 3121",
    court: "Gujarat HC",
    useForDefence:
      "Potential support on sample integrity and proof chain",
    status: "PENDING" as const,
    action: "Obtain authentic judgment copy before reliance",
  },
  {
    case: "R.B. Constructions v. State of Maharashtra (2014 SCC OnLine Bom 125)",
    court: "Bombay HC",
    useForDefence: "Cited for ex-parte sampling / natural justice",
    status: "PENDING" as const,
    action: "Citation authenticity check required",
  },
  {
    case: "CBI v. K.S. Kalra (2011 SCC OnLine Del 3412)",
    court: "Delhi HC",
    useForDefence: "Cited for CPWD/BIS procedural compliance",
    status: "PENDING" as const,
    action: "Citation authenticity check required",
  },
  {
    case: "C.J. Christopher Signi v. State of Tamil Nadu, 2025 SCC OnLine Mad 3214",
    court: "Madras HC",
    useForDefence:
      "Persuasive precedent that mere apprehension of tampering is no ground to deny forensic examination; supports right to independent expert comparison of defence material.",
    status: "SECONDARY" as const,
    action:
      "Upload/verify full SCC judgment; use only as persuasive authority after confirming authentic text.",
  },
];

export const standardsMatrix = [
  {
    standard: "IS 1199:2018",
    proposition:
      "WRONG STANDARD. Applies to FRESH CONCRETE only; cannot be used for hardened masonry mortar in existing structures.",
    caseFact: "Prosecution's entire case rests on this foundational category error.",
    confidence: "VERIFIED" as const,
  },
  {
    standard: "IS 2250:1981",
    proposition:
      "CORRECT standard for masonry mortar. Mandates weather protection.",
    caseFact: "Directly applicable to stadium wall mortar joints.",
    confidence: "VERIFIED" as const,
  },
  {
    standard: "ASTM C1324",
    proposition:
      "CORRECT forensic standard for hardened mortar. Mandates removal of carbonated outer layer (10-15mm) before analysis.",
    caseFact: "Prosecution's failure to remove surface layer ensures 'failure' due to natural weathering, not poor construction.",
    confidence: "VERIFIED" as const,
  },
  {
    standard: "IS 3535:1986",
    proposition:
      "Supports structured cement sampling protocol and documentation discipline",
    caseFact: "Random collection / no documented protocol challenge",
    confidence: "SECONDARY" as const,
  },
  {
    standard: "IS 4031",
    proposition:
      "Test outcomes depend on proper specimen handling and controlled test conditions",
    caseFact:
      "Field-contaminated or poorly tracked sample undermines lab output",
    confidence: "SECONDARY" as const,
  },
  {
    standard: "ASTM C780",
    proposition:
      "Field weather can influence outcomes; field-lab comparability needs caution",
    caseFact:
      "Rain/storm collection can materially distort interpretive reliability",
    confidence: "SECONDARY" as const,
  },
  {
    standard: "ISO/IEC 17025 (NABL)",
    proposition:
      "Traceability, documented handling, method control, and record integrity are expected",
    caseFact:
      "Missing custody/receipt/environment records impacts confidence in report",
    confidence: "SECONDARY" as const,
  },
  {
    standard: "CPWD Works Manual",
    proposition:
      "Public works QA requires process compliance and documented controls",
    caseFact:
      "Ex-parte or undocumented sampling can be framed as QA breach",
    confidence: "SECONDARY" as const,
  },
  {
    standard: "NBC 2016",
    proposition:
      "Structural safety regime ties execution quality to codified standards and compliance",
    caseFact:
      "Supports argument for strict scrutiny of testing foundation",
    confidence: "SECONDARY" as const,
  },
];

export const caseDocuments = [
  { name: "Comprehensive_Legal_Defence_Report_Stadium_Collapse.md", type: "report", size: "45 KB" },
  { name: "DEFENCE_REPLY_FINAL_v5.lex", type: "application", size: "40 KB" },
  { name: "DEFENCE_REPLY_FINAL_v4.lex", type: "application", size: "36 KB" },
  { name: "DEFENCE_REPLY_UPDATED_v2.lex", type: "draft", size: "78 KB" },
  { name: "DISCHARGE_APPLICATION_UPDATED_v2.lex", type: "application", size: "63 KB" },
  { name: "DISCHARGE_APPLICATION_UPDATED_v4.lex", type: "application", size: "63 KB" },
  { name: "SUPERIOR_HINDI_DISCHARGE_APPLICATION_FULL.lex", type: "application", size: "28 KB" },
  { name: "SUPERIOR_HINDI_DISCHARGE_APPLICATION_FULL_v2.lex", type: "application", size: "10 KB" },
  { name: "Stadium_Collapse_Defence_Hindi.lex", type: "draft", size: "85 KB" },
  { name: "Case_Facts_Timeline.md", type: "timeline", size: "12 KB" },
  { name: "Case_Law_Matrix_Verified_Pending.md", type: "matrix", size: "8 KB" },
  { name: "Standards_Matrix_IS_ASTM_NABL.md", type: "matrix", size: "6 KB" },
  { name: "Argument_Bank_And_Annexure_Builder.md", type: "arguments", size: "34 KB" },
  { name: "Cross_Reference_Matrix_Detailed.lex", type: "matrix", size: "22 KB" },
  { name: "DEEPsEARCH.md", type: "research", size: "15 KB" },
  { name: "Forensic_Protocol_Checklist.md", type: "checklist", size: "10 KB" },
  { name: "Legal_Case_References_Brief_Notes.md", type: "references", size: "18 KB" },
  { name: "VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md", type: "research", size: "42 KB" },

  { name: "DISCHARGE_APPLICATION_HEMRAJ_COURT_READY.txt", type: "application", size: "52 KB" },
  { name: "DISCHARGE_APPLICATION_HEMRAJ_COURT_READY.pdf", type: "pdf", size: "310 KB" },
  { name: "DISCHARGE_APPLICATION_HEMRAJ_v4.txt", type: "draft", size: "48 KB" },
  { name: "DISCHARGE_APPLICATION_HEMRAJ_v4.pdf", type: "pdf", size: "295 KB" },
  { name: "DISCHARGE_APPLICATION_HEMRAJ_v5.pdf", type: "pdf", size: "305 KB" },
  { name: "DISCHARGE_APPLICATION_HEMRAJ_v5_ENGLISH.pdf", type: "pdf", size: "340 KB" },
  { name: "DISCHARGE_APPLICATION_HEMRAJ_v5_PRINT.html", type: "print", size: "11 KB" },
  { name: "CRIMINAL_APPEAL_HC_2026.txt", type: "appeal", size: "36 KB" },
  { name: "ANNEXURE_PDF_NAMES_MASTER.txt", type: "index", size: "8 KB" },

  { name: "IS_1199_2018_Scope_Clause_1_Fresh_Concrete_Only.pdf", type: "annexure", size: "210 KB", annexure: "A" },
  { name: "IS_2250_1981_Title_Page_Masonry_Mortar_Correct_Standard.pdf", type: "annexure", size: "185 KB", annexure: "B" },
  { name: "ASTM_C1324_Sections_7_8_Carbonated_Layer_Removal.pdf", type: "annexure", size: "260 KB", annexure: "C" },
  { name: "Tomaso_Bruno_v_State_UP_2015_7_SCC_178_Expert_Evidence.pdf", type: "annexure", size: "340 KB", annexure: "D", tier: "SECONDARY" },
  { name: "Kattavellai_Devakar_2025_INSC_845_Chain_of_Custody.pdf", type: "annexure", size: "280 KB", annexure: "E", tier: "VERIFIED" },
  { name: "State_Maharashtra_v_Damu_2000_6_SCC_269_Panchnama.pdf", type: "annexure", size: "190 KB", annexure: "F", tier: "VERIFIED" },
  { name: "Surendra_Koli_v_State_UP_SC_November_2025_Chain_Custody.pdf", type: "annexure", size: "310 KB", annexure: "G", tier: "VERIFIED" },
  { name: "Uttarakhand_HC_March_2026_Chain_Custody_Forensic_Evidence.pdf", type: "annexure", size: "275 KB", annexure: "H", tier: "SECONDARY" },
  { name: "IS_3535_1986_Clause_4_1_Contractor_Representative_Mandatory.pdf", type: "annexure", size: "180 KB", annexure: "I", tier: "VERIFIED" },
  { name: "IS_3535_1986_Clause_5_7_5_Three_Way_Split_Referee_Sample.pdf", type: "annexure", size: "200 KB", annexure: "J", tier: "VERIFIED" },
  { name: "State_Punjab_v_Baldev_Singh_1999_6_SCC_172_Mandatory_Procedure.pdf", type: "annexure", size: "240 KB", annexure: "K", tier: "VERIFIED" },
  { name: "CPWD_Manual_Sections_3_7_4_and_12_2_1_Contractor_Presence.pdf", type: "annexure", size: "225 KB", annexure: "L", tier: "VERIFIED" },
  { name: "IS_4031_Part6_Clause_5_1_Temperature_27_Celsius_Mandatory.pdf", type: "annexure", size: "195 KB", annexure: "M", tier: "VERIFIED" },
  { name: "ASTM_C1324_Full_Standard_Hardened_Masonry_Mortar_Forensics.pdf", type: "annexure", size: "410 KB", annexure: "N", tier: "VERIFIED" },
  { name: "IS_2250_1981_Clause_5_2_Weather_Protection_Sampling.pdf", type: "annexure", size: "205 KB", annexure: "O", tier: "VERIFIED" },
  { name: "Sushil_Sharma_v_State_NCT_Delhi_2014_4_SCC_317_Expert_Opinion.pdf", type: "annexure", size: "295 KB", annexure: "P", tier: "SECONDARY" },
  { name: "CJ_Christopher_Signi_v_State_TN_2025_SCC_OnLine_Mad_3214.pdf", type: "annexure", size: "260 KB", annexure: "Q", tier: "SECONDARY" },
  { name: "NBC_2016_Section_3_4_Force_Majeure_Extreme_Weather.pdf", type: "annexure", size: "320 KB", annexure: "R", tier: "VERIFIED" },
  { name: "Rajasthan_HC_Suo_Motu_PIL_Orders_29July2025_23August2025.pdf", type: "annexure", size: "180 KB", annexure: "S", tier: "VERIFIED" },
  { name: "RSMML_v_Contractor_Rajasthan_HC_Division_Bench_30March2026.pdf", type: "annexure", size: "300 KB", annexure: "T", tier: "VERIFIED" },
  { name: "Jacob_Mathew_v_State_Punjab_2005_6_SCC_1_Para48_Negligence.pdf", type: "annexure", size: "250 KB", annexure: "U", tier: "VERIFIED" },
  { name: "IS_13311_Parts_1_2_NDT_UPV_Rebound_Hammer_Existing_Structures.pdf", type: "annexure", size: "380 KB", annexure: "V", tier: "VERIFIED" },
  { name: "Union_India_v_Prafulla_Kumar_Samal_1979_3_SCC_4_Para10.pdf", type: "annexure", size: "170 KB", annexure: "W", tier: "VERIFIED" },
  { name: "State_Bihar_v_Ramesh_Singh_1977_4_SCC_39_Para5_Discharge.pdf", type: "annexure", size: "155 KB", annexure: "X", tier: "VERIFIED" },
];
