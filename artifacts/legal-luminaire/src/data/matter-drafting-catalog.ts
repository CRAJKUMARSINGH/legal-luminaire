export type DraftLanguage = "en" | "hi" | "bilingual";
export type DraftStageId =
  | "initial"
  | "reply"
  | "rejoinder"
  | "supplementary"
  | "evidence"
  | "written_submissions"
  | "appeal_revision"
  | "execution";

export type MatterTemplate = {
  id: string;
  category: "criminal" | "civil";
  matterFamily: string;
  defaultStage: DraftStageId;
  nameEn: string;
  nameHi: string;
  purpose: string;
  typicalUse: string;
  starter: boolean;
  provisionHint: string;
  allowedStages: DraftStageId[];
};

export const DOCUMENT_STAGES: { id: DraftStageId; labelEn: string; labelHi: string }[] = [
  { id: "initial", labelEn: "Initial application / petition / claim", labelHi: "प्रारंभिक आवेदन / याचिका / दावा" },
  { id: "reply", labelEn: "Reply / objection / written statement", labelHi: "उत्तर / आपत्ति / लिखित बयान" },
  { id: "rejoinder", labelEn: "Rejoinder / replication", labelHi: "प्रत्युत्तर / प्रतिउत्तर" },
  { id: "supplementary", labelEn: "Supplementary application / affidavit", labelHi: "पूरक आवेदन / शपथपत्र" },
  { id: "evidence", labelEn: "Evidence or document application", labelHi: "साक्ष्य या दस्तावेज आवेदन" },
  { id: "written_submissions", labelEn: "Written submissions", labelHi: "लिखित प्रस्तुतियाँ" },
  { id: "appeal_revision", labelEn: "Appeal / revision", labelHi: "अपील / पुनरीक्षण" },
  { id: "execution", labelEn: "Execution / compliance", labelHi: "निष्पादन / अनुपालन" },
];

const CRIM: DraftStageId[] = ["initial", "reply", "rejoinder", "supplementary", "evidence", "written_submissions", "appeal_revision"];
const CIV: DraftStageId[] = [...CRIM, "execution"];

function t(
  id: string,
  category: "criminal" | "civil",
  matterFamily: string,
  defaultStage: DraftStageId,
  nameEn: string,
  nameHi: string,
  purpose: string,
  typicalUse: string,
  starter: boolean,
  provisionHint: string,
  allowedStages: DraftStageId[] = category === "criminal" ? CRIM : CIV,
): MatterTemplate {
  return { id, category, matterFamily, defaultStage, nameEn, nameHi, purpose, typicalUse, starter, provisionHint, allowedStages };
}

export const MATTER_TEMPLATES: MatterTemplate[] = [
  t("regular_bail", "criminal", "bail", "initial", "Regular Bail Application", "नियमित जमानत आवेदन", "Seek regular bail after arrest or surrender.", "Sessions / Magistrate custody matters.", true, "Confirm BNSS 480/483 or CrPC 437/439."),
  t("anticipatory_bail", "criminal", "anticipatory_bail", "initial", "Anticipatory Bail Application", "अग्रिम जमानत आवेदन", "Seek pre-arrest protection.", "When arrest is reasonably apprehended.", false, "Confirm BNSS 482 or CrPC 438."),
  t("discharge", "criminal", "discharge", "initial", "Discharge Application", "आरोपमुक्ति आवेदन", "Seek discharge on charge-sheet materials.", "After charge-sheet / before charge.", true, "Confirm BNSS 250 / CrPC 227 or BNSS 262 / CrPC 239."),
  t("criminal_complaint", "criminal", "criminal_complaint", "initial", "Criminal Complaint", "आपराधिक शिकायत", "Initiate a private criminal complaint.", "Magistrate complaint cases.", false, "Confirm complaint procedure under BNSS/CrPC."),
  t("reply_criminal_complaint", "criminal", "criminal_complaint", "reply", "Reply to Criminal Complaint", "आपराधिक शिकायत का उत्तर", "Para-wise reply to a complaint.", "After summons or notice.", false, "Confine reply to numbered paragraphs."),
  t("reply_show_cause", "criminal", "show_cause", "reply", "Reply to Show-Cause Notice", "कारण बताओ नोटिस का उत्तर", "Answer a show-cause notice.", "Court or departmental notices.", true, "Quote the notice number and date exactly, or placeholder them.", ["reply", "rejoinder", "written_submissions"]),
  t("criminal_written_submissions", "criminal", "final_defence", "written_submissions", "Criminal Written Submissions", "आपराधिक मामले में लिखित प्रस्तुतियाँ", "Final written arguments on the record.", "After evidence or at hearing.", false, "Argue only from exhibited materials.", ["written_submissions", "rejoinder"]),
  t("defence_brief", "criminal", "final_defence", "written_submissions", "Defence Brief", "बचाव पक्ष का संक्षिप्त विवरण", "Internal senior-counsel brief.", "Chamber preparation.", true, "Mark INTERNAL unless asked to file.", ["written_submissions", "initial"]),
  t("criminal_revision", "criminal", "criminal_revision", "appeal_revision", "Criminal Revision Petition", "आपराधिक पुनरीक्षण याचिका", "Challenge an inferior criminal order.", "District Court or High Court revision.", false, "Identify impugned order date and forum."),
  t("criminal_appeal", "criminal", "criminal_appeal", "appeal_revision", "Criminal Appeal", "आपराधिक अपील", "Appeal against conviction, acquittal or sentence.", "Appellate criminal courts.", false, "State judgment date and precise relief from approved facts."),
  t("exemption_appearance", "criminal", "personal_appearance", "initial", "Application for Exemption from Personal Appearance", "व्यक्तिगत उपस्थिति से छूट का आवेदन", "Seek exemption from personal attendance.", "Routine or medical inability.", false, "Confirm the applicable BNSS/CrPC provision."),
  t("supply_documents", "criminal", "document_supply", "evidence", "Application for Supply of Documents", "दस्तावेज उपलब्ध कराने का आवेदन", "Seek supply or inspection of documents.", "Incomplete relied-document list.", false, "List only documents supported by the record."),
  t("recall_witness", "criminal", "witness_procedure", "evidence", "Application for Recall of Witness", "साक्षी को पुनः बुलाने का आवेदन", "Seek recall or re-examination.", "Identified gap in examination.", false, "Name the witness; do not invent testimony."),
  t("modify_bail_conditions", "criminal", "bail_conditions", "initial", "Application to Modify Bail Conditions", "जमानत शर्तों में संशोधन का आवेदन", "Relax or modify existing bail conditions.", "After bail is granted.", false, "Recite the existing order exactly, or placeholder it."),
  t("ni_complaint", "criminal", "cheque_dishonour", "initial", "Negotiable Instruments / Cheque-Bounce Complaint", "परक्राम्य लिखत / चेक बाउंस शिकायत", "Complaint for dishonour of cheque.", "NI Act matters.", false, "Confirm cheque, notice and limitation from approved facts."),
  t("legal_notice", "civil", "legal_notice", "initial", "Legal Notice", "कानूनी नोटिस", "Pre-action demand or statutory notice.", "Before suit or arbitration.", true, "Do not threaten criminal process unless instructed.", ["initial", "rejoinder"]),
  t("reply_legal_notice", "civil", "legal_notice", "reply", "Reply to Legal Notice", "कानूनी नोटिस का उत्तर", "Para-wise reply without admitting unproven claims.", "After receipt of a legal notice.", true, "Reply only to numbered paragraphs.", ["reply", "rejoinder"]),
  t("plaint", "civil", "civil_suit", "initial", "Plaint / Civil Suit", "वादपत्र / दीवानी वाद", "Instituting pleading for a civil claim.", "Civil / commercial courts.", false, "Plead cause of action, jurisdiction and limitation from approved facts."),
  t("written_statement", "civil", "civil_suit", "reply", "Written Statement", "लिखित बयान", "Admit, deny, or put to proof.", "After summons in a civil suit.", true, "Preliminary objections first, then para-wise merits."),
  t("replication", "civil", "civil_suit", "rejoinder", "Replication / Rejoinder", "प्रत्युत्तर / प्रतिउत्तर", "Reply confined to new matter.", "After written statement.", false, "Do not re-argue the entire plaint.", ["rejoinder"]),
  t("interim_injunction", "civil", "interim_injunction", "initial", "Interim Injunction Application", "अंतरिम निषेधाज्ञा आवेदन", "Temporary restraint pending the suit.", "Interlocutory civil relief.", true, "Plead the three injunction tests only from approved facts."),
  t("permanent_injunction", "civil", "declaration", "initial", "Permanent Injunction Suit", "स्थायी निषेधाज्ञा वाद", "Perpetual injunction as final relief.", "Possession / interference disputes.", false, "Never invent survey numbers."),
  t("declaratory_suit", "civil", "declaration", "initial", "Declaratory Suit", "घोषणा वाद", "Declaration of legal character or right.", "Cloud on title or status.", false, "State the precise declaration sought."),
  t("specific_performance", "civil", "specific_performance", "initial", "Specific Performance Suit", "विशिष्ट निष्पादन वाद", "Compel performance of a concluded contract.", "Agreement to sell and similar contracts.", false, "Plead readiness only if facts support it."),
  t("money_recovery", "civil", "money_recovery", "initial", "Money Recovery Suit", "धन वसूली वाद", "Recover a quantified debt or dues.", "Loan, invoice or contractual arrears.", false, "State figures from approved accounts only."),
  t("property_partition", "civil", "partition", "initial", "Property or Partition Suit", "संपत्ति / विभाजन वाद", "Partition or possession of joint property.", "Family / co-owner disputes.", false, "Placeholder missing shares; do not equalise by assumption."),
  t("rent_eviction", "civil", "rent_eviction", "initial", "Rent and Eviction Proceeding", "किराया और बेदखली कार्यवाही", "Eviction, rent arrears or tenancy protection.", "Rent controller / civil court.", false, "Confirm the State tenancy statute."),
  t("consumer_complaint", "civil", "consumer_dispute", "initial", "Consumer Complaint", "उपभोक्ता शिकायत", "Deficiency of service or unfair practice.", "Consumer commissions.", false, "Plead jurisdiction from approved invoice and address facts."),
  t("arbitration_claim", "civil", "arbitration", "initial", "Arbitration Notice / Statement of Claim", "मध्यस्थता नोटिस / दावा विवरण", "Invoke arbitration or plead the claim.", "Contractual arbitration clauses.", false, "Quote the clause from the approved contract, or placeholder it."),
  t("civil_appeal", "civil", "civil_appeal", "appeal_revision", "Civil Appeal", "दीवानी अपील", "Appeal against a civil decree or order.", "First or second appeal.", false, "Placeholder limitation if dates are missing."),
];

export function infoRequired(label: string): string {
  return `[Information required: ${label}]`;
}

export function livePreview(opts: {
  template: MatterTemplate;
  stage: DraftStageId;
  language: DraftLanguage;
  court: string;
  caseNo: string;
  title: string;
  typedFacts: string;
}): string {
  const court = opts.court.trim() || infoRequired("court and forum");
  const caseNo = opts.caseNo.trim() || infoRequired("case / FIR / suit / notice number");
  const parties = opts.title.trim() || infoRequired("applicant / plaintiff / accused name");
  const facts = opts.typedFacts.trim() || infoRequired("narrative of approved facts");
  const stage = DOCUMENT_STAGES.find((s) => s.id === opts.stage);
  const stageLabel = stage ? `${stage.labelEn} / ${stage.labelHi}` : opts.stage;
  return [
    `${opts.template.nameEn} / ${opts.template.nameHi}`,
    "",
    `IN THE COURT OF ${court}`,
    `${parties}    … Applicant / Plaintiff / Accused`,
    "versus",
    `${infoRequired("opposite party / State / complainant name")}    … Opposite Party`,
    `Case / FIR / Suit No.: ${caseNo}`,
    `Document stage: ${stageLabel}`,
    `Language: ${opts.language}`,
    `Provision (confirm): ${opts.template.provisionHint}`,
    "",
    "NARRATIVE OF FACTS / प्रकरण के तथ्य",
    facts,
    "",
    "LEGAL GROUNDS / आधार",
    `Matter-family grounds for “${opts.template.matterFamily}” will be pleaded only if the approved facts support them.`,
    `Otherwise each missing point remains ${infoRequired("verified fact or authority for this ground")}.`,
    "",
    "PRAYER / प्रार्थना",
    "Relief is confined to this template. Additional relief is not added without instructions.",
    "",
    "VERIFICATION / सत्यापन",
    `I, ${infoRequired("name and capacity of deponent")}, verify the contents as true from the approved record.`,
    `Verified at ${infoRequired("place of verification")} on ${infoRequired("date of verification")}.`,
    "",
    "LIST OF ANNEXURES / संलग्नक सूची",
    `Annexure-A  ${infoRequired("first supporting document and its date")}`,
    "",
    "SOURCE CONTROL / स्रोत नियंत्रण",
    "Facts may be taken only from approved sources. Unknown facts stay as placeholders.",
    "This draft is not filing-ready until advocate review.",
  ].join("\n");
}
