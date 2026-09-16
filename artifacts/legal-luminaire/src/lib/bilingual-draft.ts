/**
 * Bilingual Draft helpers
 *
 * Data layer for the side-by-side bilingual drafting & review feature.
 * Purely additive — does not touch any protected file.
 */

/* ── Types ───────────────────────────────────────────────────────────────── */
export type DocType = "discharge" | "bail" | "written_submissions" | "notice_reply" | "writ" | "other";

/** Simple bilingual content holder — English and Hindi strings */
export interface BilingualContent {
  en: string;
  hi: string;
}

export interface BilingualTemplate {
  id: string;
  docType: DocType;
  titleEn: string;
  titleHi: string;
  en: string;
  hi: string;
}

export interface BilingualDraftState {
  id: string;
  caseId: string;
  docType: DocType;
  titleEn: string;
  titleHi: string;
  en: string;
  hi: string;
  savedAt: string;
  discrepancies: DiscrepancyResult[];
}

export interface DiscrepancyResult {
  enPhrase: string;
  hiPhrase: string;
  kind: "terminology_mismatch" | "section_mismatch" | "party_name_mismatch" | "date_mismatch";
  severity: "high" | "medium" | "low";
  suggestion: string;
}

/* ── localStorage persistence ────────────────────────────────────────────── */
const KEY = (caseId: string, docType: string) =>
  `bilingual-draft:${caseId}:${docType}`;

export function saveBilingualDraft(draft: BilingualDraftState): void {
  try {
    localStorage.setItem(
      KEY(draft.caseId, draft.docType),
      JSON.stringify({ ...draft, savedAt: new Date().toISOString() }),
    );
  } catch {
    // quota exceeded — silent
  }
}

export function loadBilingualDraft(
  caseId: string,
  docType: DocType,
): BilingualDraftState | null {
  try {
    const raw = localStorage.getItem(KEY(caseId, docType));
    return raw ? (JSON.parse(raw) as BilingualDraftState) : null;
  } catch {
    return null;
  }
}

export function deleteBilingualDraft(caseId: string, docType: DocType): void {
  localStorage.removeItem(KEY(caseId, docType));
}

/* ── Discrepancy checker ─────────────────────────────────────────────────── */

/** Term pairs: [english_term, hindi_equivalent] */
const TERM_PAIRS: [string, string][] = [
  ["accused", "अभियुक्त"],
  ["complainant", "परिवादी"],
  ["petitioner", "याचीकाकर्ता"],
  ["respondent", "प्रतिवादी"],
  ["applicant", "आवेदक"],
  ["bail", "जमानत"],
  ["discharge", "आरोपमुक्ति"],
  ["written submissions", "लिखित प्रस्तुतियाँ"],
  ["sessions court", "सत्र न्यायालय"],
  ["high court", "उच्च न्यायालय"],
  ["supreme court", "सर्वोच्च न्यायालय"],
  ["FIR", "प्रथम सूचना रिपोर्ट"],
  ["charge sheet", "आरोप पत्र"],
  ["cognizance", "संज्ञान"],
  ["anticipatory bail", "अग्रिम जमानत"],
  ["regular bail", "नियमित जमानत"],
  ["surety", "ज़मानतदार"],
  ["custodial interrogation", "अभिरक्षा में पूछताछ"],
  ["ex-parte", "एकपक्षीय"],
  ["ad-interim", "अंतरिम"],
];

/** Section number pattern — e.g. "Section 302" / "धारा 302" */
const EN_SECTION = /\bSection\s+(\d+[A-Z]?(?:\s*[,/]\s*\d+[A-Z]*)*)/gi;
const HI_SECTION = /धारा\s+(\d+[A-Z]?(?:\s*[,/]\s*\d+[A-Z]*)*)/g;

/** Date pattern */
const DATE_RE = /\b(\d{1,2}[./\-]\d{1,2}[./\-]\d{2,4}|\d{4}-\d{2}-\d{2})\b/g;

function extractMatches(text: string, re: RegExp): string[] {
  return [...text.matchAll(re)].map((m) => m[1].replace(/\s+/g, "").toLowerCase());
}

export function checkDiscrepancies(en: string, hi: string): DiscrepancyResult[] {
  const results: DiscrepancyResult[] = [];
  const enLower = en.toLowerCase();
  const hiLower = hi.toLowerCase();

  // 1. Terminology mismatches
  for (const [enTerm, hiTerm] of TERM_PAIRS) {
    const enHas = enLower.includes(enTerm.toLowerCase());
    const hiHas = hiLower.includes(hiTerm.toLowerCase());
    if (enHas && !hiHas) {
      results.push({
        enPhrase: enTerm,
        hiPhrase: hiTerm,
        kind: "terminology_mismatch",
        severity: "medium",
        suggestion: `English contains "${enTerm}" but Hindi panel is missing the equivalent "${hiTerm}".`,
      });
    }
    if (hiHas && !enHas) {
      results.push({
        enPhrase: enTerm,
        hiPhrase: hiTerm,
        kind: "terminology_mismatch",
        severity: "medium",
        suggestion: `Hindi contains "${hiTerm}" but English panel is missing the equivalent "${enTerm}".`,
      });
    }
  }

  // 2. Section number mismatches
  const enSections = new Set(extractMatches(en, EN_SECTION));
  const hiSections = new Set(extractMatches(hi, HI_SECTION));
  const onlyInEn = [...enSections].filter((s) => !hiSections.has(s));
  const onlyInHi = [...hiSections].filter((s) => !enSections.has(s));
  for (const s of onlyInEn) {
    results.push({
      enPhrase: `Section ${s}`,
      hiPhrase: `धारा ${s}`,
      kind: "section_mismatch",
      severity: "high",
      suggestion: `Section ${s} appears in English but is missing from the Hindi panel.`,
    });
  }
  for (const s of onlyInHi) {
    results.push({
      enPhrase: `Section ${s}`,
      hiPhrase: `धारा ${s}`,
      kind: "section_mismatch",
      severity: "high",
      suggestion: `धारा ${s} appears in Hindi but is missing from the English panel.`,
    });
  }

  // 3. Date mismatches
  const enDates = new Set(extractMatches(en, DATE_RE));
  const hiDates = new Set(extractMatches(hi, DATE_RE));
  const onlyInEnDates = [...enDates].filter((d) => !hiDates.has(d));
  const onlyInHiDates = [...hiDates].filter((d) => !enDates.has(d));
  for (const d of onlyInEnDates) {
    results.push({
      enPhrase: d,
      hiPhrase: "",
      kind: "date_mismatch",
      severity: "high",
      suggestion: `Date "${d}" appears in English but not in Hindi panel — verify consistency.`,
    });
  }
  for (const d of onlyInHiDates) {
    results.push({
      enPhrase: "",
      hiPhrase: d,
      kind: "date_mismatch",
      severity: "high",
      suggestion: `Date "${d}" appears in Hindi but not in English panel — verify consistency.`,
    });
  }

  return results;
}

/* ── 3 starter templates ─────────────────────────────────────────────────── */
export const BILINGUAL_TEMPLATES: BilingualTemplate[] = [
  {
    id: "discharge-bilingual",
    docType: "discharge",
    titleEn: "Discharge Application",
    titleHi: "आरोपमुक्ति आवेदन",
    en: `IN THE COURT OF [COURT NAME]
[CITY], RAJASTHAN

[CASE TYPE] NO. [NUMBER] OF [YEAR]

IN THE MATTER OF:
[APPLICANT / ACCUSED NAME]                              ...Applicant/Accused
                           VERSUS
STATE OF RAJASTHAN                                      ...Respondent/State

APPLICATION FOR DISCHARGE UNDER SECTION 227/239 Cr.P.C.

MOST RESPECTFULLY SHOWETH:

1. That the Applicant is the accused in the above-captioned matter arising out of FIR No. [FIR NUMBER] dated [DATE] registered at Police Station [PS NAME], District [DISTRICT] under Sections [SECTIONS] of the Indian Penal Code.

2. That the charge-sheet filed by the Investigating Officer does not disclose any prima facie case against the Applicant for the following reasons:

GROUND I — INSUFFICIENCY OF EVIDENCE
The prosecution has failed to produce any credible material to establish the foundational ingredients of the alleged offence.

GROUND II — FORENSIC PROTOCOL VIOLATIONS
[GROUNDS BASED ON FORENSIC LAPSES]

GROUND III — ABSENCE OF CRIMINAL INTENTION
[GROUNDS ON MENS REA]

PRAYER
It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:
(a) Discharge the Applicant from all charges; and
(b) Pass any other order as this Hon'ble Court may deem fit in the interest of justice.

                                              Counsel for Applicant
Place: [CITY]
Date:  [DATE]`,

    hi: `[न्यायालय का नाम] में
[शहर], राजस्थान

[मामले का प्रकार] संख्या [संख्या] वर्ष [वर्ष]

विषय में:
[आवेदक / अभियुक्त का नाम]                          ...आवेदक/अभियुक्त
                              बनाम
राजस्थान राज्य                                       ...प्रतिवादी/राज्य

धारा 227/239 दण्ड प्रक्रिया संहिता के अन्तर्गत आरोपमुक्ति हेतु आवेदन

सविनय निवेदन है कि:

1. आवेदक उपरोक्त प्रकरण में अभियुक्त है जो थाना [थाना नाम], जिला [जिले का नाम] में दिनांक [तारीख] को प्रथम सूचना रिपोर्ट संख्या [FIR संख्या] के अंतर्गत भारतीय दण्ड संहिता की धारा [धाराएँ] के अधीन पंजीकृत प्रकरण से संबंधित है।

2. कि अन्वेषण अधिकारी द्वारा दाखिल आरोप-पत्र निम्न कारणों से आवेदक के विरुद्ध कोई प्रथम दृष्टया मामला प्रकट नहीं करता:

आधार I — साक्ष्य की अपर्याप्तता
अभियोजन पक्ष कथित अपराध के आवश्यक तत्वों को स्थापित करने के लिए कोई विश्वसनीय सामग्री प्रस्तुत करने में असफल रहा है।

आधार II — न्यायालयिक प्रोटोकॉल उल्लंघन
[न्यायालयिक त्रुटियों पर आधार]

आधार III — आपराधिक आशय का अभाव
[मेन्स रिया पर आधार]

प्रार्थना
अतः सविनय प्रार्थना है कि यह माननीय न्यायालय कृपया:
(क) आवेदक को समस्त आरोपों से आरोपमुक्त करने की कृपा करे; तथा
(ख) न्याय के हित में कोई अन्य आदेश पारित करे।

                                              आवेदक के अधिवक्ता
स्थान: [शहर]
दिनांक: [तारीख]`,
  },

  {
    id: "bail-bilingual",
    docType: "bail",
    titleEn: "Bail Application",
    titleHi: "जमानत आवेदन",
    en: `IN THE COURT OF [COURT NAME]
[CITY], [STATE]

[CASE TYPE] NO. [NUMBER] OF [YEAR]

IN THE MATTER OF:
[APPLICANT / ACCUSED NAME]                              ...Applicant/Accused
                           VERSUS
STATE OF [STATE]                                        ...Respondent/State

APPLICATION FOR BAIL UNDER SECTION 437/439 Cr.P.C.

MOST RESPECTFULLY SHOWETH:

1. That the Applicant was arrested on [DATE] in connection with FIR No. [FIR NUMBER] dated [DATE] registered at Police Station [PS NAME] under Sections [SECTIONS].

2. That the Applicant has been in custody since [DATE] and is entitled to bail on the following grounds:

GROUND I — NO FLIGHT RISK
The Applicant is a permanent resident of [ADDRESS] and has deep roots in the community.

GROUND II — PARITY / SIMILAR CASES
[CO-ACCUSED / PARITY GROUND]

GROUND III — NO TAMPERING RISK
[GROUNDS ON EVIDENCE SAFETY]

GROUND IV — HEALTH / HUMANITARIAN
[IF APPLICABLE]

PRAYER
It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to release the Applicant on bail on such terms and conditions as this Hon'ble Court deems fit.

                                              Counsel for Applicant
Place: [CITY]
Date:  [DATE]`,

    hi: `[न्यायालय का नाम] में
[शहर], [राज्य]

[मामले का प्रकार] संख्या [संख्या] वर्ष [वर्ष]

विषय में:
[आवेदक / अभियुक्त का नाम]                          ...आवेदक/अभियुक्त
                              बनाम
[राज्य] राज्य                                        ...प्रतिवादी/राज्य

धारा 437/439 दण्ड प्रक्रिया संहिता के अन्तर्गत जमानत आवेदन

सविनय निवेदन है कि:

1. आवेदक को दिनांक [तारीख] को थाना [थाना नाम] में पंजीकृत FIR संख्या [FIR संख्या] दिनांक [तारीख] के संबंध में धारा [धाराएँ] के अंतर्गत गिरफ्तार किया गया।

2. आवेदक दिनांक [तारीख] से न्यायिक अभिरक्षा में है और निम्न आधारों पर जमानत का अधिकारी है:

आधार I — फरार होने का कोई जोखिम नहीं
आवेदक [पता] का स्थायी निवासी है और समाज से गहरे जुड़ा है।

आधार II — समानता / सादृश्य प्रकरण
[सह-अभियुक्त / समानता का आधार]

आधार III — साक्षी/साक्ष्य से छेड़छाड़ का कोई खतरा नहीं
[साक्ष्य सुरक्षा पर आधार]

आधार IV — स्वास्थ्य / मानवीय आधार
[यदि लागू हो]

प्रार्थना
अतः सविनय प्रार्थना है कि यह माननीय न्यायालय ऐसी शर्तों पर जो उचित समझे, आवेदक को जमानत पर रिहा करने की कृपा करे।

                                              आवेदक के अधिवक्ता
स्थान: [शहर]
दिनांक: [तारीख]`,
  },

  {
    id: "written-submissions-bilingual",
    docType: "written_submissions",
    titleEn: "Written Submissions",
    titleHi: "लिखित प्रस्तुतियाँ",
    en: `IN THE HON'BLE HIGH COURT OF [STATE] AT [CITY]

[WRIT PETITION / CRIMINAL APPEAL] NO. [NUMBER] OF [YEAR]

[PETITIONER / APPELLANT NAME]                           ...Petitioner/Appellant
                           VERSUS
[RESPONDENT NAME]                                       ...Respondent

WRITTEN SUBMISSIONS ON BEHALF OF THE PETITIONER / APPELLANT

I. INTRODUCTION
These written submissions are filed on behalf of the Petitioner/Appellant in support of the [petition/appeal] challenging [BRIEF DESCRIPTION OF CHALLENGE].

II. FACTUAL BACKGROUND
[FACTS IN NUMBERED PARAS]

III. ISSUES FOR CONSIDERATION
Issue 1: [FIRST LEGAL ISSUE]
Issue 2: [SECOND LEGAL ISSUE]

IV. SUBMISSIONS ON ISSUE 1
[ARGUMENTS WITH CITED AUTHORITIES]

V. SUBMISSIONS ON ISSUE 2
[ARGUMENTS WITH CITED AUTHORITIES]

VI. RELIEF SOUGHT
In view of the foregoing submissions, it is most respectfully prayed that this Hon'ble Court may be pleased to [RELIEF].

                                              Counsel for Petitioner/Appellant
Place: [CITY]
Date:  [DATE]`,

    hi: `माननीय [राज्य] उच्च न्यायालय, [शहर] में

[रिट याचिका / आपराधिक अपील] संख्या [संख्या] वर्ष [वर्ष]

[याचीकाकर्ता / अपीलार्थी का नाम]                    ...याचीकाकर्ता/अपीलार्थी
                              बनाम
[प्रतिवादी का नाम]                                   ...प्रतिवादी

याचीकाकर्ता / अपीलार्थी की ओर से लिखित प्रस्तुतियाँ

I. परिचय
ये लिखित प्रस्तुतियाँ याचीकाकर्ता/अपीलार्थी की ओर से [चुनौती का संक्षिप्त विवरण] को चुनौती देने वाली [याचिका/अपील] के समर्थन में दाखिल की जा रही हैं।

II. तथ्यात्मक पृष्ठभूमि
[क्रमांकित पैराग्राफ में तथ्य]

III. विचारणीय प्रश्न
प्रश्न 1: [पहला विधिक प्रश्न]
प्रश्न 2: [दूसरा विधिक प्रश्न]

IV. प्रश्न 1 पर प्रस्तुतियाँ
[उद्धृत प्राधिकरणों सहित तर्क]

V. प्रश्न 2 पर प्रस्तुतियाँ
[उद्धृत प्राधिकरणों सहित तर्क]

VI. अनुतोष
उपरोक्त प्रस्तुतियों के मद्देनजर सविनय प्रार्थना है कि यह माननीय न्यायालय [अनुतोष] प्रदान करने की कृपा करे।

                                              याचीकाकर्ता/अपीलार्थी के अधिवक्ता
स्थान: [शहर]
दिनांक: [तारीख]`,
  },

  {
    id: "notice-reply-bilingual",
    docType: "notice_reply",
    titleEn: "Reply to Legal Notice",
    titleHi: "कानूनी नोटिस का उत्तर",
    en: `[SENDER NAME]
[ADDRESS LINE 1]
[CITY, STATE, PIN]

Date: [DATE]

[ADVOCATE / SENDER DETAILS]
Through: [ADVOCATE NAME], Advocate
[ADVOCATE ADDRESS]

To,
[NOTICE SENDER NAME]
[ADDRESS]

Subject: Reply to Legal Notice dated [DATE] — [BRIEF SUBJECT]

Sir/Madam,

I write in reply to the legal notice dated [DATE] sent on your behalf by [NOTICE ADVOCATE], Advocate, received by the undersigned on [RECEIPT DATE]. The contents of the said notice are noted and replied to para-wise as under:

PARA-WISE REPLY

Para 1: [REPLY TO PARA 1 OF NOTICE]

Para 2: [REPLY TO PARA 2 OF NOTICE]

Para 3: [REPLY TO PARA 3 OF NOTICE]

DENIAL OF CLAIMS
Without prejudice to the above, the claims and allegations in the notice are hereby denied in their entirety. The Noticee reserves all rights and remedies available in law.

LEGAL POSITION
[LEGAL GROUNDS FOR REPLY — CITE RELEVANT STATUTES / PRECEDENTS]

DEMAND / COUNTER-POSITION
[IF APPLICABLE — COUNTER DEMAND]

This notice be treated as full and final reply. All rights and remedies are expressly reserved.

Yours faithfully,

[SENDER NAME]
Place: [CITY]
Date: [DATE]`,

    hi: `[प्रेषक का नाम]
[पता पंक्ति 1]
[शहर, राज्य, पिन]

दिनांक: [तारीख]

[अधिवक्ता / प्रेषक विवरण]
द्वारा: [अधिवक्ता का नाम], अधिवक्ता
[अधिवक्ता का पता]

सेवा में,
[नोटिस प्रेषक का नाम]
[पता]

विषय: दिनांक [तारीख] के कानूनी नोटिस का उत्तर — [संक्षिप्त विषय]

महोदय/महोदया,

आपकी ओर से [नोटिस अधिवक्ता], अधिवक्ता द्वारा दिनांक [तारीख] को भेजे गए कानूनी नोटिस के उत्तर में यह पत्र लिख रहा/रही हूँ, जो अधोहस्ताक्षरी को दिनांक [प्राप्ति तिथि] को प्राप्त हुआ। उक्त नोटिस की विषय-वस्तु नोट की गई है और पैराग्राफ-वार उत्तर निम्नानुसार दिया जाता है:

पैराग्राफ-वार उत्तर

पैरा 1: [नोटिस के पैरा 1 का उत्तर]

पैरा 2: [नोटिस के पैरा 2 का उत्तर]

पैरा 3: [नोटिस के पैरा 3 का उत्तर]

दावों का खंडन
उपरोक्त के प्रतिकूल पूर्वाग्रह के बिना, नोटिस में किए गए दावों और आरोपों को संपूर्ण रूप से नकारा जाता है। नोटिसी विधि में उपलब्ध समस्त अधिकार और उपचार सुरक्षित रखता/रखती है।

विधिक स्थिति
[उत्तर के लिए विधिक आधार — संबंधित अधिनियम/न्यायदृष्टांत उद्धृत करें]

माँग / प्रतिदावा
[यदि लागू हो — प्रतिदावा]

इस नोटिस को पूर्ण एवं अंतिम उत्तर माना जाए। समस्त अधिकार और उपचार स्पष्टतः सुरक्षित हैं।

भवदीय,

[प्रेषक का नाम]
स्थान: [शहर]
दिनांक: [तारीख]`,
  },

  {
    id: "writ-bilingual",
    docType: "writ",
    titleEn: "Writ Petition (Art. 226)",
    titleHi: "रिट याचिका (अनु॰ 226)",
    en: `IN THE HON'BLE HIGH COURT OF [STATE] AT [CITY]

WRIT PETITION (CIVIL / CRIMINAL) NO. _____ OF [YEAR]

IN THE MATTER OF:
[PETITIONER NAME]
[Son/Daughter/Wife of NAME]
[Occupation], [Address]                                  ...Petitioner

                           VERSUS

1. [RESPONDENT NO. 1 — GOVT. AUTHORITY]
   [Address / Designation]

2. [RESPONDENT NO. 2]
   [Address]                                             ...Respondents

WRIT PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA
SEEKING [WRIT OF MANDAMUS / CERTIORARI / PROHIBITION / QUO WARRANTO / HABEAS CORPUS]

TO,
THE HON'BLE THE CHIEF JUSTICE AND HIS/HER COMPANION JUSTICES
OF THE HON'BLE HIGH COURT OF [STATE]

MOST RESPECTFULLY SHOWETH:

I. FACTS OF THE CASE
1. That the Petitioner is [brief introduction].
2. That the Respondent No. 1 is [description of authority].
3. [CHRONOLOGICAL FACTS IN NUMBERED PARAGRAPHS]

II. GROUNDS
A. That the impugned [order/action/omission] is violative of Article [14/19/21/___] of the Constitution of India.
B. That [SECOND GROUND].
C. That [THIRD GROUND].
D. That the Petitioner has no other equally efficacious alternative remedy.

III. URGENCY / INTERIM RELIEF
[IF APPLICABLE — WHY URGENT / WHAT INTERIM ORDER IS SOUGHT]

IV. PRAYER
In view of the above facts and circumstances, it is most respectfully prayed that this Hon'ble Court may be pleased to:
(a) Issue a Writ of [TYPE] or a direction/order in the nature thereof, directing [SPECIFIC RELIEF];
(b) Stay/suspend the impugned [order/action] pending disposal of this petition;
(c) Award costs of this petition; and
(d) Pass such other and further order(s) as this Hon'ble Court may deem fit and proper in the interest of justice.

                                              [PETITIONER / COUNSEL FOR PETITIONER]
Place: [CITY]
Date:  [DATE]

VERIFICATION
I, [PETITIONER NAME], the Petitioner above-named, do hereby verify that the contents of paragraphs 1 to [N] are true to my personal knowledge and belief and the rest are based on legal advice and believed to be true.

Verified at [CITY] on [DATE].

                                              [PETITIONER'S SIGNATURE]`,

    hi: `माननीय [राज्य] उच्च न्यायालय, [शहर] में

रिट याचिका (सिविल / आपराधिक) संख्या _____ वर्ष [वर्ष]

विषय में:
[याचीकाकर्ता का नाम]
[पुत्र/पुत्री/पत्नी: नाम]
[व्यवसाय], [पता]                                        ...याचीकाकर्ता

                              बनाम

1. [प्रतिवादी संख्या 1 — सरकारी प्राधिकरण]
   [पता / पद]

2. [प्रतिवादी संख्या 2]
   [पता]                                                 ...प्रतिवादीगण

भारत के संविधान के अनुच्छेद 226 के अन्तर्गत रिट याचिका
[परमादेश / उत्प्रेषण / प्रतिषेध / अधिकार पृच्छा / बंदी प्रत्यक्षीकरण] की रिट हेतु

सेवा में,
माननीय मुख्य न्यायाधीश महोदय/महोदया एवं उनके साथी न्यायाधीशगण
माननीय [राज्य] उच्च न्यायालय

सविनय निवेदन है कि:

I. मामले के तथ्य
1. याचीकाकर्ता [संक्षिप्त परिचय] है।
2. प्रतिवादी संख्या 1 [प्राधिकरण का विवरण] है।
3. [क्रमिक तथ्य, क्रमांकित पैराग्राफ में]

II. आधार
क. कि विवादित [आदेश/कार्रवाई/चूक] भारत के संविधान के अनुच्छेद [14/19/21/___] का उल्लंघन है।
ख. कि [दूसरा आधार]।
ग. कि [तीसरा आधार]।
घ. कि याचीकाकर्ता के पास कोई अन्य समान रूप से प्रभावी वैकल्पिक उपाय नहीं है।

III. अत्यावश्यकता / अंतरिम राहत
[यदि लागू हो — क्यों अत्यावश्यक है / कौन सा अंतरिम आदेश माँगा जा रहा है]

IV. प्रार्थना
उपरोक्त तथ्यों और परिस्थितियों के मद्देनजर सविनय प्रार्थना है कि यह माननीय न्यायालय कृपया:
(क) [प्रकार] की रिट या उसकी प्रकृति का निर्देश/आदेश जारी करे, जो [विशिष्ट राहत] का निर्देश दे;
(ख) इस याचिका के निपटारे तक विवादित [आदेश/कार्रवाई] पर रोक लगाए;
(ग) इस याचिका का खर्च दिलाए; तथा
(घ) न्याय के हित में उचित समझे जाने वाले अन्य आदेश पारित करे।

                                              [याचीकाकर्ता / उनके अधिवक्ता]
स्थान: [शहर]
दिनांक: [तारीख]

सत्यापन
मैं [याचीकाकर्ता का नाम], उपरोक्त याचीकाकर्ता, एतद्द्वारा सत्यापित करता/करती हूँ कि पैराग्राफ 1 से [N] की विषय-वस्तु मेरी व्यक्तिगत जानकारी और विश्वास के अनुसार सत्य है और शेष विधिक सलाह पर आधारित है और सत्य मानी जाती है।

[शहर] में दिनांक [तारीख] को सत्यापित।

                                              [याचीकाकर्ता के हस्ताक्षर]`,
  },
];

export function getTemplate(docType: DocType): BilingualTemplate | undefined {
  return BILINGUAL_TEMPLATES.find((t) => t.docType === docType);
}
