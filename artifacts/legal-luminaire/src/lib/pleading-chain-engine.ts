/**
 * Pleading Chain Engine — Offline Variant Generator
 * ─────────────────────────────────────────────────
 * Generates complete stage-appropriate draft skeletons for any of the
 * 50 legal subject matters × 8 document stages, entirely client-side.
 *
 * Works without the Python backend. The output is a structured text draft
 * with [[CITATION:n]] slots ready for CitationSlotFiller or CitationAddToDraft.
 *
 * Same matter context (parties, court, case no.) is threaded verbatim
 * into every variant — no facts are invented.
 */

// ── Stage types ───────────────────────────────────────────────────────────────

export type StageId =
  | "initial"
  | "reply"
  | "rejoinder"
  | "supplementary"
  | "evidence"
  | "written_submissions"
  | "appeal_revision"
  | "execution";

export interface StageLabel {
  id: StageId;
  en: string;
  hi: string;
  abbr: string;
  color: string; // Tailwind bg class
}

export const STAGE_LABELS: StageLabel[] = [
  { id: "initial",            en: "Initial Application / Petition",        hi: "प्रारंभिक आवेदन / याचिका",           abbr: "INIT",  color: "bg-blue-600" },
  { id: "reply",              en: "Reply / Written Statement",              hi: "उत्तर / लिखित बयान",                   abbr: "RPLY",  color: "bg-purple-600" },
  { id: "rejoinder",          en: "Rejoinder / Replication",               hi: "प्रत्युत्तर / प्रतिउत्तर",             abbr: "RJDR",  color: "bg-indigo-600" },
  { id: "supplementary",      en: "Supplementary Application / Affidavit", hi: "पूरक आवेदन / शपथपत्र",               abbr: "SUPP",  color: "bg-cyan-600" },
  { id: "evidence",           en: "Evidence / Document Application",       hi: "साक्ष्य / दस्तावेज आवेदन",             abbr: "EVID",  color: "bg-teal-600" },
  { id: "written_submissions", en: "Written Submissions",                  hi: "लिखित प्रस्तुतियाँ",                   abbr: "WRIT",  color: "bg-amber-600" },
  { id: "appeal_revision",    en: "Appeal / Revision",                     hi: "अपील / पुनरीक्षण",                    abbr: "APPL",  color: "bg-orange-600" },
  { id: "execution",          en: "Execution / Compliance",                hi: "निष्पादन / अनुपालन",                   abbr: "EXEC",  color: "bg-red-600" },
];

// ── Matter context ────────────────────────────────────────────────────────────

export interface MatterCtx {
  /** Template ID from matter-drafting-catalog */
  templateId: string;
  /** Matter family (e.g. "bail", "discharge", "civil_suit") */
  matterFamily: string;
  /** English name of the document type */
  docNameEn: string;
  /** Hindi name of the document type */
  docNameHi: string;
  /** Court and jurisdiction string */
  court: string;
  /** Case / FIR / Suit number */
  caseNo: string;
  /** Petitioner / Applicant / Accused name */
  petitioner: string;
  /** Respondent / State / Opposite party */
  respondent: string;
  /** Key facts narrative (from user or loaded template) */
  facts: string;
  /** Applicable statutory provisions (comma-separated) */
  provisions: string;
  /** Draft language preference */
  language: "en" | "hi" | "bilingual";
  /** Category */
  category: "criminal" | "civil";
}

// ── Output type ───────────────────────────────────────────────────────────────

export interface VariantDraft {
  stageId: StageId;
  stageLabelEn: string;
  stageLabelHi: string;
  stageColor: string;
  titleEn: string;
  titleHi: string;
  bodyEn: string;
  bodyHi: string;
  citationSlots: number;
  wordCountEn: number;
}

// ── Stage-specific directive text ─────────────────────────────────────────────

const STAGE_DIRECTIVES: Record<StageId, { en: string; hi: string }> = {
  initial: {
    en: "Set out the jurisdiction, maintainability, material facts, cause of action or defence, and precise relief without adding unsupported facts.",
    hi: "क्षेत्राधिकार, विचारणीयता, महत्वपूर्ण तथ्य, वाद-कारण या बचाव और सटीक राहत रखें; असमर्थित तथ्य न जोड़ें।",
  },
  reply: {
    en: "Answer the opposing document paragraph by paragraph. Separate admissions, denials, lack of knowledge and preliminary objections.",
    hi: "विपक्षी दस्तावेज का पैराग्राफ-वार उत्तर दें। स्वीकार, इन्कार, जानकारी के अभाव तथा प्रारंभिक आपत्तियाँ अलग रखें।",
  },
  rejoinder: {
    en: "Respond only to new matters raised in the reply. Identify issues requiring evidence or further clarification.",
    hi: "उत्तर में उठाए गए केवल नए विषयों का प्रत्युत्तर दें। साक्ष्य या स्पष्टीकरण वाले मुद्दे पहचानें।",
  },
  supplementary: {
    en: "Identify the reason for the supplementary material, its source, relevance and effect on the pending record.",
    hi: "पूरक सामग्री का कारण, स्रोत, प्रासंगिकता और लंबित अभिलेख पर प्रभाव स्पष्ट करें।",
  },
  evidence: {
    en: "Map each requested document or witness to the fact it is intended to prove and preserve all objections.",
    hi: "प्रत्येक माँगे गए दस्तावेज या साक्षी को सिद्ध किए जाने वाले तथ्य से जोड़ें और आपत्तियाँ सुरक्षित रखें।",
  },
  written_submissions: {
    en: "Present issue-wise submissions with record references, verified authorities [[CITATION:1]] and a concise final prayer.",
    hi: "अभिलेख-संदर्भ, सत्यापित प्राधिकार [[CITATION:1]] और संक्षिप्त अंतिम प्रार्थना के साथ मुद्दे-वार प्रस्तुतियाँ दें।",
  },
  appeal_revision: {
    en: "Identify the impugned order, the exact error, prejudice, record reference and appellate relief [[CITATION:1]] sought.",
    hi: "आक्षेपित आदेश, सटीक त्रुटि, हानि, अभिलेख-संदर्भ और अपीलीय राहत [[CITATION:1]] स्पष्ट करें।",
  },
  execution: {
    en: "Identify the executable decree/order, the default, compliance history, mode of execution and quantified relief.",
    hi: "प्रवर्तनीय डिक्री/आदेश, चूक, अनुपालन इतिहास, निष्पादन का तरीका और परिमाणित राहत स्पष्ट करें।",
  },
};

// ── Section heading maps by stage ─────────────────────────────────────────────

const SECTION_HEADINGS: Record<StageId, { en: string[]; hi: string[] }> = {
  initial: {
    en: ["A. PARTIES AND JURISDICTION", "B. FACTS OF THE CASE", "C. PRELIMINARY OBJECTIONS / MAINTAINABILITY", "D. GROUNDS", "E. PRAYER"],
    hi: ["A. पक्षकार और क्षेत्राधिकार", "B. प्रकरण के तथ्य", "C. प्रारंभिक आपत्तियाँ / विचारणीयता", "D. आधार", "E. प्रार्थना"],
  },
  reply: {
    en: ["A. PRELIMINARY OBJECTIONS TO THE REPLY", "B. PARA-WISE RESPONSE (ADMIT / DENY / NO KNOWLEDGE)", "C. AFFIRMATIVE DEFENCES", "D. DOCUMENTS RELIED UPON", "E. RELIEF"],
    hi: ["A. उत्तर पर प्रारंभिक आपत्तियाँ", "B. पैराग्राफ-वार प्रतिक्रिया (स्वीकार / इन्कार / जानकारी नहीं)", "C. सकारात्मक बचाव", "D. निर्भर दस्तावेज", "E. राहत"],
  },
  rejoinder: {
    en: ["A. SCOPE OF REJOINDER", "B. RESPONSE TO NEW MATTERS ONLY", "C. UNANSWERED ISSUES AND EVIDENCE NEEDED", "D. RELIEF"],
    hi: ["A. प्रत्युत्तर की सीमा", "B. केवल नए विषयों का उत्तर", "C. अनुत्तरित मुद्दे और आवश्यक साक्ष्य", "D. राहत"],
  },
  supplementary: {
    en: ["A. BASIS FOR SUPPLEMENTARY FILING", "B. NEW FACTS AND THEIR SOURCE", "C. EFFECT ON PENDING RECORD", "D. RESULTING ISSUES AND RELIEF"],
    hi: ["A. पूरक दाखिल करने का आधार", "B. नए तथ्य और उनका स्रोत", "C. लंबित अभिलेख पर प्रभाव", "D. परिणामी मुद्दे और राहत"],
  },
  evidence: {
    en: ["A. NECESSITY AND PROCEDURAL BASIS", "B. FACT-TO-DOCUMENT / WITNESS MAPPING", "C. DOCUMENTS / WITNESSES SOUGHT", "D. OBJECTIONS AND SAFEGUARDS", "E. DIRECTION SOUGHT"],
    hi: ["A. आवश्यकता और प्रक्रियात्मक आधार", "B. तथ्य-से-दस्तावेज / साक्षी का मानचित्र", "C. माँगे गए दस्तावेज / साक्षी", "D. आपत्तियाँ और सुरक्षा उपाय", "E. माँगा गया निर्देश"],
  },
  written_submissions: {
    en: ["A. ISSUES FOR DETERMINATION", "B. RECORD-BASED SUBMISSIONS", "C. AUTHORITIES AND APPLICATION OF LAW [[CITATION:1]] [[CITATION:2]]", "D. REPLY TO OPPOSING SUBMISSIONS", "E. FINAL PRAYER"],
    hi: ["A. निर्धारण के लिए मुद्दे", "B. अभिलेख-आधारित प्रस्तुतियाँ", "C. प्राधिकार और विधि का प्रयोग [[CITATION:1]] [[CITATION:2]]", "D. विपक्षी प्रस्तुतियों का उत्तर", "E. अंतिम प्रार्थना"],
  },
  appeal_revision: {
    en: ["A. APPELLATE JURISDICTION AND MAINTAINABILITY", "B. IMPUGNED ORDER / JUDGMENT", "C. GROUNDS OF APPEAL / REVISION [[CITATION:1]]", "D. PREJUDICE AND CONSEQUENCE", "E. INTERIM PROTECTION SOUGHT", "F. APPELLATE RELIEF"],
    hi: ["A. अपीलीय अधिकारिता और विचारणीयता", "B. आक्षेपित आदेश / निर्णय", "C. अपील / पुनरीक्षण के आधार [[CITATION:1]]", "D. हानि और उसका परिणाम", "E. अंतरिम संरक्षण", "F. अपीलीय राहत"],
  },
  execution: {
    en: ["A. EXECUTABILITY OF DECREE / ORDER", "B. DEFAULT AND NON-COMPLIANCE", "C. COMPLIANCE HISTORY", "D. MODE OF EXECUTION SOUGHT", "E. QUANTIFIED RELIEF AND COSTS"],
    hi: ["A. डिक्री / आदेश की प्रवर्तनीयता", "B. चूक और अनुपालन न होना", "C. अनुपालन का इतिहास", "D. निष्पादन का माँगा गया तरीका", "E. परिमाणित राहत और खर्च"],
  },
};

// ── Family-specific content blueprints ────────────────────────────────────────

const FAMILY_GROUNDS: Record<string, { en: string[]; hi: string[] }> = {
  bail: {
    en: ["Custody, remand history and investigation status", "Role attributed and offence ingredients — maximum exposure analysis", "Roots in society, antecedents and cooperation record", "Parity with co-accused / similar cases", "Proposed bail conditions and surety undertaking"],
    hi: ["अभिरक्षा, रिमांड का इतिहास और जाँच की स्थिति", "जिम्मेदारी और अपराध के तत्व — अधिकतम दायित्व विश्लेषण", "समाज से जुड़ाव, पूर्ववृत्त और सहयोग का अभिलेख", "सह-अभियुक्त / समान प्रकरणों के साथ समता", "प्रस्तावित जमानत शर्तें और ज़मानत का वचन"],
  },
  anticipatory_bail: {
    en: ["Apprehension of arrest — factual and documentary foundation", "Cooperation history and investigation status", "No flight risk — travel restrictions offered", "Parity with co-accused / similar cases [[CITATION:1]]", "Conditions for custodial interrogation, if directed"],
    hi: ["गिरफ्तारी की आशंका — तथ्यात्मक और दस्तावेजी आधार", "सहयोग का इतिहास और जाँच की स्थिति", "फरार होने का कोई जोखिम नहीं — यात्रा प्रतिबंध की पेशकश", "सह-अभियुक्त / समान प्रकरणों के साथ समता [[CITATION:1]]", "यदि निर्देश हो तो अभिरक्षा में पूछताछ की शर्तें"],
  },
  discharge: {
    en: ["Ingredients of alleged offence — element-by-element analysis", "Material on record and evidentiary gaps", "Prima-facie threshold — quantum of proof required [[CITATION:1]]", "Unproved assumptions and contradictions in charge-sheet", "Relief confined to the approved record"],
    hi: ["कथित अपराध के तत्व — घटक-दर-घटक विश्लेषण", "अभिलेख की सामग्री और साक्ष्यगत कमियाँ", "प्रथमदृष्टया मानक — आवश्यक प्रमाण की मात्रा [[CITATION:1]]", "आरोप-पत्र में अप्रमाणित धारणाएँ और विरोधाभास", "अनुमोदित अभिलेख तक सीमित राहत"],
  },
  criminal_complaint: {
    en: ["Territorial jurisdiction, limitation and complainant locus standi", "Facts constituting each alleged offence", "Supporting witnesses and documentary evidence", "Process and relief sought from the Magistrate", "Verification of complaint particulars"],
    hi: ["क्षेत्राधिकार, परिसीमा और शिकायतकर्ता की स्थिति", "प्रत्येक कथित अपराध बनाने वाले तथ्य", "समर्थक साक्षी और दस्तावेजी साक्ष्य", "मजिस्ट्रेट से माँगी गई प्रक्रिया और राहत", "शिकायत विवरण का सत्यापन"],
  },
  show_cause: {
    en: ["Notice particulars and procedural authority", "Charge-wise response — admissions and specific denials", "Procedural fairness — opportunity to respond", "Mitigation and proportionality [[CITATION:1]]", "Relief or closure requested"],
    hi: ["नोटिस के विवरण और प्रक्रियात्मक अधिकारिता", "आरोप-वार उत्तर — स्वीकार और स्पष्ट इन्कार", "प्रक्रियात्मक निष्पक्षता — उत्तर का अवसर", "शमन और आनुपातिकता [[CITATION:1]]", "माँगी गई राहत या कार्यवाही समाप्ति"],
  },
  final_defence: {
    en: ["Issues for final determination", "Chronology and core defence theory", "Evidence-wise submissions — each exhibit analysed", "Verified authority placeholders [[CITATION:1]] [[CITATION:2]] [[CITATION:3]]", "Final defence and specific relief sought"],
    hi: ["अंतिम निर्धारण के लिए मुद्दे", "घटनाक्रम और मुख्य बचाव का सिद्धांत", "साक्ष्य-वार प्रस्तुतियाँ — प्रत्येक प्रदर्श का विश्लेषण", "सत्यापित प्राधिकार स्थान [[CITATION:1]] [[CITATION:2]] [[CITATION:3]]", "अंतिम बचाव और माँगी गई विशिष्ट राहत"],
  },
  criminal_revision: {
    en: ["Impugned order — date, forum and operative part", "Jurisdiction and maintainability of revision", "Errors of law, fact or jurisdiction [[CITATION:1]]", "Prejudice and consequence to the revisionist", "Revisionary relief and interim protection"],
    hi: ["आक्षेपित आदेश — तारीख, न्यायालय और क्रियाशील भाग", "पुनरीक्षण की अधिकारिता और विचारणीयता", "विधि, तथ्य या अधिकारिता की त्रुटियाँ [[CITATION:1]]", "पुनरीक्षणकर्ता को हानि और उसका परिणाम", "पुनरीक्षण राहत और अंतरिम संरक्षण"],
  },
  criminal_appeal: {
    en: ["Impugned judgment / order — date, sessions court / HC reference", "Evidence and findings requiring appellate interference [[CITATION:1]]", "Perversity, misdirection or procedural prejudice", "Suspension of sentence / interim relief pending appeal", "Appellate relief — acquittal / reduced sentence / remand"],
    hi: ["आक्षेपित निर्णय / आदेश — तारीख, सत्र न्यायालय / HC संदर्भ", "अपीलीय हस्तक्षेप योग्य साक्ष्य और निष्कर्ष [[CITATION:1]]", "विकृति, गलत निर्देश या प्रक्रियात्मक हानि", "अपील लंबित रहने के दौरान दंड स्थगन / अंतरिम राहत", "अपीलीय राहत — दोषमुक्ति / कम दंड / पुनः विचारण"],
  },
  personal_appearance: {
    en: ["Case particulars and hearing date", "Specific ground for exemption (medical / distance / employment)", "Supporting material from the approved record", "Undertaking to appear when directed", "Limited exemption relief sought"],
    hi: ["वाद का विवरण और सुनवाई की तिथि", "छूट का विशिष्ट आधार (चिकित्सा / दूरी / रोजगार)", "अनुमोदित अभिलेख से समर्थित सामग्री", "निर्देश पर उपस्थित होने का वचन", "सीमित छूट राहत की माँग"],
  },
  document_supply: {
    en: ["Documents or inspection sought — list with date and relevance", "Procedural basis for supply", "Documents already received vs. those withheld", "Prejudice caused by non-supply", "Direction and timeline requested"],
    hi: ["माँगे गए दस्तावेज — तारीख और प्रासंगिकता सहित सूची", "आपूर्ति का प्रक्रियात्मक आधार", "प्राप्त दस्तावेज बनाम रोके गए दस्तावेज", "गैर-आपूर्ति से हुई हानि", "माँगा गया निर्देश और समयसीमा"],
  },
  witness_procedure: {
    en: ["Witness identity and prior examination particulars", "Necessity of recall — specific gap to be filled", "New material or clarification sought", "No delay prejudice — safeguards offered", "Limited recall relief"],
    hi: ["साक्षी की पहचान और पूर्व परीक्षण विवरण", "पुनः बुलाने की आवश्यकता — भरी जाने वाली विशिष्ट कमी", "माँगी गई नई सामग्री या स्पष्टीकरण", "विलंब से कोई हानि नहीं — सुरक्षा उपाय प्रस्तावित", "सीमित पुनः बुलाने की राहत"],
  },
  bail_conditions: {
    en: ["Existing condition and full compliance history", "Changed circumstance or practical difficulty", "Proposed modified condition — specific and time-bound", "No prejudice to investigation or trial", "Relaxation or modification sought"],
    hi: ["वर्तमान शर्त और पूर्ण अनुपालन इतिहास", "परिवर्तित परिस्थिति या व्यावहारिक कठिनाई", "प्रस्तावित संशोधित शर्त — विशिष्ट और समयबद्ध", "जाँच या विचारण को कोई हानि नहीं", "माँगा गया शिथिलीकरण या संशोधन"],
  },
  cheque_dishonour: {
    en: ["Instrument, authority and transaction particulars", "Presentation, dishonour and legal notice chronology", "Payment liability and statutory ingredients [[CITATION:1]]", "Documents and witnesses relied upon", "Complaint relief and verification"],
    hi: ["लिखत, अधिकारिता और लेन-देन का विवरण", "प्रस्तुतीकरण, अनादरण और कानूनी नोटिस का घटनाक्रम", "भुगतान दायित्व और वैधानिक तत्व [[CITATION:1]]", "निर्भर दस्तावेज और साक्षी", "शिकायत राहत और सत्यापन"],
  },
  legal_notice: {
    en: ["Authority and relationship of the parties", "Material facts and chronology of events", "Contractual / statutory obligation and breach", "Demand, cure period and consequences", "Documents, reservation of rights and proof of service"],
    hi: ["पक्षकारों का अधिकार और संबंध", "महत्वपूर्ण तथ्य और घटनाओं का घटनाक्रम", "संविदात्मक / वैधानिक दायित्व और उल्लंघन", "माँग, अनुपालन अवधि और परिणाम", "दस्तावेज, अधिकार सुरक्षित रखना और तामील का प्रमाण"],
  },
  civil_suit: {
    en: ["Parties, jurisdiction, valuation and court fees", "Cause of action and limitation", "Material pleadings and issue-wise facts", "Documents and evidence plan [[CITATION:1]]", "Reliefs, interest, costs and consequential directions"],
    hi: ["पक्षकार, क्षेत्राधिकार, मूल्यांकन और न्यायालय शुल्क", "वाद-कारण और परिसीमा", "महत्वपूर्ण अभिवचन और मुद्दे-वार तथ्य", "दस्तावेज और साक्ष्य योजना [[CITATION:1]]", "राहत, ब्याज, खर्च और परिणामी निर्देश"],
  },
  interim_injunction: {
    en: ["Prima-facie right and supporting record", "Urgency and threatened irreparable injury", "Balance of convenience", "Undertaking as to damages", "Precise interim restraint requested"],
    hi: ["प्रथमदृष्टया अधिकार और समर्थक अभिलेख", "तात्कालिकता और आसन्न अपूरणीय हानि", "सुविधा का संतुलन", "नुकसान के बारे में वचन", "माँगी गई सटीक अंतरिम रोक"],
  },
  declaration: {
    en: ["Legal character or right requiring declaration", "Adverse claim or denial by the defendant", "Jurisdiction, limitation and necessary parties", "Evidence supporting the declaration [[CITATION:1]]", "Declaration and consequential relief"],
    hi: ["घोषणा योग्य विधिक स्थिति या अधिकार", "प्रतिवादी का विरोधी दावा या इन्कार", "क्षेत्राधिकार, परिसीमा और आवश्यक पक्षकार", "घोषणा के समर्थक साक्ष्य [[CITATION:1]]", "घोषणा और परिणामी राहत"],
  },
  specific_performance: {
    en: ["Contract — date, parties, consideration and enforceable obligations", "Readiness, willingness and performance record", "Breach, notice and response chronology", "Equitable considerations and alternative relief [[CITATION:1]]", "Specific performance and consequential relief"],
    hi: ["संविदा — तारीख, पक्षकार, प्रतिफल और प्रवर्तनीय दायित्व", "तत्परता, इच्छा और पालन का अभिलेख", "उल्लंघन, नोटिस और उत्तर का घटनाक्रम", "साम्यिक विचार और वैकल्पिक राहत [[CITATION:1]]", "विशिष्ट निष्पादन और परिणामी राहत"],
  },
  money_recovery: {
    en: ["Transaction, invoices and account statement (approved figures only)", "Accrual of liability and limitation", "Demand, acknowledgment and payment history", "Interest computation schedule [[CITATION:1]]", "Recovery, costs and other relief"],
    hi: ["लेन-देन, चालान और खाता विवरण (केवल अनुमोदित आँकड़े)", "दायित्व और परिसीमा", "माँग, स्वीकृति और भुगतान का इतिहास", "ब्याज गणना सारणी [[CITATION:1]]", "वसूली, खर्च और अन्य राहत"],
  },
  partition: {
    en: ["Title, possession and property description (no invented survey numbers)", "Boundaries, shares and chain of documents", "Adverse claim, interference or dispossession", "Site / document evidence plan", "Declaration, partition, possession or injunction relief"],
    hi: ["स्वत्व, कब्जा और संपत्ति का विवरण (कोई काल्पनिक सर्वे नंबर नहीं)", "सीमाएँ, हिस्से और दस्तावेजों की श्रृंखला", "विरोधी दावा, हस्तक्षेप या बेदखली", "स्थल / दस्तावेज साक्ष्य योजना", "घोषणा, विभाजन, कब्जा या निषेधाज्ञा की राहत"],
  },
  rent_eviction: {
    en: ["Tenancy, premises description and relationship of parties", "Rent, default and statutory notice chronology", "Grounds for eviction (non-payment / subletting / misuse)", "Compliance history and arrears computation", "Eviction, arrears and mesne profits relief"],
    hi: ["किरायेदारी, परिसर विवरण और पक्षकारों का संबंध", "किराया, चूक और वैधानिक नोटिस का घटनाक्रम", "बेदखली के आधार (गैर-भुगतान / उप-पट्टा / दुरुपयोग)", "अनुपालन इतिहास और बकाया गणना", "बेदखली, बकाया और मध्यवर्ती लाभ की राहत"],
  },
  consumer_dispute: {
    en: ["Consumer status and forum jurisdiction (pecuniary + territorial)", "Goods / service, deficiency or unfair trade practice", "Complaint chronology and supporting record", "Compensation, replacement or refund (quantified) [[CITATION:1]]", "Documents, limitation and verification"],
    hi: ["उपभोक्ता की स्थिति और न्यायालय का क्षेत्राधिकार (मौद्रिक + क्षेत्रीय)", "वस्तु / सेवा, कमी या अनुचित व्यापार व्यवहार", "शिकायत का घटनाक्रम और समर्थक अभिलेख", "क्षतिपूर्ति, प्रतिस्थापन या वापसी (परिमाणित) [[CITATION:1]]", "दस्तावेज, परिसीमा और सत्यापन"],
  },
  arbitration: {
    en: ["Arbitration agreement — clause number and dispute reference", "Notice, dispute crystallisation and reference chronology [[CITATION:1]]", "Claim-wise liability and computation", "Defence, set-off or counterclaim (if supported by the record)", "Reliefs, costs, interest and request for expedited hearing"],
    hi: ["मध्यस्थता समझौता — धारा संख्या और विवाद संदर्भ", "नोटिस, विवाद का निष्कर्षण और संदर्भ का घटनाक्रम [[CITATION:1]]", "दावा-वार दायित्व और गणना", "बचाव, समायोजन या प्रतिदावा (यदि अभिलेख से समर्थित)", "राहत, खर्च, ब्याज और त्वरित सुनवाई का अनुरोध"],
  },
  civil_appeal: {
    en: ["Impugned decree / order — date, trial court reference", "Appellate jurisdiction and limitation [[CITATION:1]]", "Findings requiring interference — perversity / misreading of evidence", "Interim protection or stay pending appeal", "Appellate relief, costs and consequential directions"],
    hi: ["आक्षेपित डिक्री / आदेश — तारीख, विचारण न्यायालय संदर्भ", "अपीलीय अधिकारिता और परिसीमा [[CITATION:1]]", "हस्तक्षेप योग्य निष्कर्ष — विकृति / साक्ष्य की गलत पठन", "अपील लंबित रहने के दौरान अंतरिम संरक्षण या स्थगन", "अपीलीय राहत, खर्च और परिणामी निर्देश"],
  },
};

// ── Fallback for unknown families ─────────────────────────────────────────────

const GENERIC_GROUNDS = {
  en: ["Jurisdiction, maintainability and locus standi", "Material facts — confined to the approved record", "Legal grounds with verified authority [[CITATION:1]]", "Reply to opposing contentions", "Specific relief sought"],
  hi: ["क्षेत्राधिकार, विचारणीयता और पक्षकार की स्थिति", "महत्वपूर्ण तथ्य — अनुमोदित अभिलेख तक सीमित", "सत्यापित प्राधिकार के साथ विधिक आधार [[CITATION:1]]", "विपक्षी तर्कों का उत्तर", "माँगी गई विशिष्ट राहत"],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function ph(label: string): string {
  return `[Information required: ${label}]`;
}

function countCitationSlots(text: string): number {
  return (text.match(/\[\[CITATION:\d+\]\]/g) ?? []).length;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function groundsFor(family: string): { en: string[]; hi: string[] } {
  return FAMILY_GROUNDS[family] ?? GENERIC_GROUNDS;
}

function buildGroundsSection(grounds: string[], headings: string[]): string {
  return headings
    .map((h, i) => {
      const g = grounds[i];
      return `\n${h}\n${g ? g : ph("supporting facts and authorities for this heading")}`;
    })
    .join("\n");
}

// ── Main generator ────────────────────────────────────────────────────────────

export function generateVariant(ctx: MatterCtx, stageId: StageId): VariantDraft {
  const stageLabel = STAGE_LABELS.find((s) => s.id === stageId) ?? STAGE_LABELS[0];
  const directive = STAGE_DIRECTIVES[stageId];
  const headings = SECTION_HEADINGS[stageId];
  const grounds = groundsFor(ctx.matterFamily);

  const petitioner = ctx.petitioner.trim() || ph("applicant / petitioner / accused name");
  const respondent = ctx.respondent.trim() || ph("respondent / State / opposite party");
  const court = ctx.court.trim() || ph("court name and jurisdiction");
  const caseNo = ctx.caseNo.trim() || ph("case / FIR / suit / notice number");
  const provisions = ctx.provisions.trim() || ph("applicable statutory provisions (confirm before filing)");
  const facts = ctx.facts.trim() || ph("narrative of approved facts");

  // ── English body ──────────────────────────────────────────────────────────

  const bodyEn = [
    `${ctx.docNameEn.toUpperCase()} — ${stageLabel.en.toUpperCase()}`,
    "",
    `IN THE COURT OF ${court}`,
    "",
    `${petitioner}`,
    `    ...Applicant / Petitioner / Accused`,
    "                    VERSUS",
    `${respondent}`,
    `    ...Respondent / State / Opposite Party`,
    "",
    `Case / FIR / Suit No.: ${caseNo}`,
    `Document Stage: ${stageLabel.en}`,
    `Statutory Provisions: ${provisions}`,
    "",
    "MOST RESPECTFULLY SHOWETH / SUBMITTED AS UNDER:",
    "",
    `[Drafting directive: ${directive.en}]`,
    "",
    buildGroundsSection(headings.en, grounds.en),
    "",
    "VERIFICATION",
    `I, ${ph("name and capacity of deponent")}, verify that the contents are true`,
    `to my personal knowledge from the approved record and that nothing material has been concealed.`,
    `Verified at ${ph("place")} on ${ph("date")}.`,
    "",
    "LIST OF ANNEXURES",
    `Annexure-A  ${ph("first document — description and date")}`,
    `Annexure-B  ${ph("second document — description and date")}`,
    "",
    "─────────────────────────────────────────────────────────────────────",
    "This draft is NOT filing-ready. It requires advocate review, fact-checking",
    "and replacement of all [Information required: …] placeholders.",
    "Citation slots [[CITATION:n]] must be filled via Citation Search.",
  ].join("\n");

  // ── Hindi body ────────────────────────────────────────────────────────────

  const bodyHi = [
    `${ctx.docNameHi.toUpperCase()} — ${stageLabel.hi.toUpperCase()}`,
    "",
    `${court} में`,
    "",
    `${petitioner}`,
    `    ...आवेदक / याचीकाकर्ता / अभियुक्त`,
    "                    बनाम",
    `${respondent}`,
    `    ...प्रतिवादी / राज्य / विपक्षी पक्ष`,
    "",
    `प्रकरण / FIR / वाद संख्या: ${caseNo}`,
    `दस्तावेज चरण: ${stageLabel.hi}`,
    `वैधानिक प्रावधान: ${provisions}`,
    "",
    "सविनय निवेदन / प्रस्तुत है कि:",
    "",
    `[मसौदा निर्देश: ${directive.hi}]`,
    "",
    buildGroundsSection(headings.hi, grounds.hi),
    "",
    "सत्यापन",
    `मैं ${ph("शपथकर्ता का नाम और क्षमता")}, सत्यापित करता/करती हूँ कि विषय-वस्तु`,
    `अनुमोदित अभिलेख से मेरी व्यक्तिगत जानकारी के अनुसार सत्य है।`,
    `${ph("स्थान")} में ${ph("तारीख")} को सत्यापित।`,
    "",
    "संलग्नकों की सूची",
    `संलग्नक-क  ${ph("प्रथम दस्तावेज — विवरण और तारीख")}`,
    `संलग्नक-ख  ${ph("द्वितीय दस्तावेज — विवरण और तारीख")}`,
    "",
    "─────────────────────────────────────────────────────────────────────",
    "यह मसौदा दाखिल करने के लिए तैयार नहीं है। अधिवक्ता समीक्षा आवश्यक है।",
    "[[CITATION:n]] स्लॉट को Citation Search से भरें।",
  ].join("\n");

  const slots = countCitationSlots(bodyEn) + countCitationSlots(bodyHi);

  return {
    stageId,
    stageLabelEn: stageLabel.en,
    stageLabelHi: stageLabel.hi,
    stageColor: stageLabel.color,
    titleEn: `${ctx.docNameEn} — ${stageLabel.en}`,
    titleHi: `${ctx.docNameHi} — ${stageLabel.hi}`,
    bodyEn,
    bodyHi,
    citationSlots: slots,
    wordCountEn: wordCount(bodyEn),
  };
}

/**
 * Generate ALL allowed stages for a matter template in one call.
 * Returns variants in stage order.
 */
export function generateAllVariants(
  ctx: MatterCtx,
  allowedStages: StageId[],
): VariantDraft[] {
  return allowedStages.map((s) => generateVariant(ctx, s));
}
