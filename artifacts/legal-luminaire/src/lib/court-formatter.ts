/**
 * Court-Specific Formatter Engine — Month 5
 * ─────────────────────────────────────────────────────────────────────────────
 * Formats caption, cause title, court heading, and prayer block
 * according to each court's actual style conventions.
 *
 * Supported courts:
 *   rajasthan_hc   — High Court of Judicature for Rajasthan at Jodhpur / Jaipur Bench
 *   supreme_court  — Supreme Court of India
 *   nclt           — National Company Law Tribunal
 *   sessions       — Sessions Court (generic)
 *   district_civil — District Civil Court (generic)
 *   ngt            — National Green Tribunal
 *   cat            — Central Administrative Tribunal
 */

export type CourtStyle =
  | "rajasthan_hc"
  | "supreme_court"
  | "nclt"
  | "sessions"
  | "district_civil"
  | "ngt"
  | "cat";

export interface CourtFormatInput {
  courtStyle: CourtStyle;
  caseType: string;          // e.g. "Criminal Misc. Petition" / "Writ Petition (Civil)"
  caseYear: string;
  caseNumber?: string;        // optional — if assigned
  petitionerName: string;
  petitionerDesignation?: string;
  respondentName: string;
  respondentDesignation?: string;
  courtLocation?: string;     // overrides default for style
  bench?: string;             // e.g. "Justice X and Justice Y"
  actSection?: string;        // e.g. "Section 482 CrPC" / "Article 226"
}

export interface FormattedCourtBlock {
  /** Full court heading line */
  heading: string;
  /** Cause title block (petitioner v. respondent with designations) */
  causeTitle: string;
  /** Case number line */
  caseNumberLine: string;
  /** Complete caption combining heading + cause title + case number */
  fullCaption: string;
  /** Standard prayer opener for this court */
  prayerOpener: string;
  /** Standard verification clause */
  verificationClause: string;
}

// ── Court style definitions ───────────────────────────────────────────────────

const COURT_CONFIGS: Record<CourtStyle, {
  headingTemplate: string;
  prayerOpener: string;
  verificationClause: string;
}> = {
  rajasthan_hc: {
    headingTemplate: "IN THE HIGH COURT OF JUDICATURE FOR RAJASTHAN AT {LOCATION}",
    prayerOpener:
      "It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:",
    verificationClause:
      "VERIFICATION\nI, the Petitioner above-named, do hereby verify that the contents of paragraphs 1 to [N] are true to my personal knowledge and belief and the rest are stated on legal advice and believed to be true.\nVerified at [CITY] on [DATE].\n\n[SIGNATURE]",
  },
  supreme_court: {
    headingTemplate: "IN THE SUPREME COURT OF INDIA",
    prayerOpener:
      "In view of the aforesaid facts and circumstances, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to:",
    verificationClause:
      "AFFIDAVIT\nI, the Petitioner / Deponent above-named, do solemnly affirm and state that the contents of paragraphs 1 to [N] of this Petition are true and correct to the best of my knowledge and belief and the rest are based on legal advice, information received and believed to be true.\nSolemnly affirmed at [CITY] on [DATE].\n\nDeponent\n\nIdentified by [NAME]",
  },
  nclt: {
    headingTemplate: "BEFORE THE HON'BLE NATIONAL COMPANY LAW TRIBUNAL\n{LOCATION} BENCH",
    prayerOpener:
      "In view of the above, it is most respectfully prayed that this Hon'ble Tribunal may be pleased to:",
    verificationClause:
      "VERIFICATION\nI, the Applicant above-named, solemnly affirm that the contents hereof are true and correct to the best of my knowledge and belief and nothing material has been concealed therefrom.\nDated: [DATE]\nPlace: [CITY]\n\n[SIGNATURE]",
  },
  sessions: {
    headingTemplate: "IN THE COURT OF THE {DESIGNATION}\n{LOCATION}",
    prayerOpener:
      "It is, therefore, most respectfully prayed that this Hon'ble Court be pleased to:",
    verificationClause:
      "VERIFICATION\nI, the Applicant above-named, do solemnly affirm that the above contents are true and correct to the best of my knowledge and belief.\nVerified at [CITY] on [DATE].\n\n[SIGNATURE]",
  },
  district_civil: {
    headingTemplate: "IN THE COURT OF THE {DESIGNATION}\n{LOCATION}",
    prayerOpener:
      "It is, therefore, humbly prayed that this Hon'ble Court may be pleased to:",
    verificationClause:
      "VERIFICATION\nI, the Plaintiff / Applicant above-named, do hereby verify that the contents of paragraphs 1 to [N] are true to my personal knowledge and the rest are based on legal advice and believed to be true.\nVerified at [CITY] on [DATE].",
  },
  ngt: {
    headingTemplate: "BEFORE THE NATIONAL GREEN TRIBUNAL\n{LOCATION} BENCH",
    prayerOpener:
      "In the light of the facts stated above and grounds urged herein, it is most respectfully prayed that this Hon'ble Tribunal may be pleased to:",
    verificationClause:
      "AFFIDAVIT\nI, the Applicant above-named, do solemnly affirm that the contents hereof are true to the best of my knowledge and belief.\nDated: [DATE]\nPlace: [CITY]",
  },
  cat: {
    headingTemplate: "BEFORE THE CENTRAL ADMINISTRATIVE TRIBUNAL\n{LOCATION} BENCH",
    prayerOpener:
      "It is, therefore, most respectfully prayed that this Hon'ble Tribunal may be pleased to:",
    verificationClause:
      "VERIFICATION\nI, the Applicant above-named, do solemnly affirm that the contents are true to the best of my knowledge and belief.\nDated: [DATE]\nPlace: [CITY]",
  },
};

const DEFAULT_LOCATIONS: Record<CourtStyle, string> = {
  rajasthan_hc: "JODHPUR",
  supreme_court: "NEW DELHI",
  nclt: "NEW DELHI",
  sessions: "UDAIPUR",
  district_civil: "UDAIPUR",
  ngt: "NEW DELHI (PRINCIPAL BENCH)",
  cat: "NEW DELHI (PRINCIPAL BENCH)",
};

export const COURT_STYLE_LABELS: Record<CourtStyle, string> = {
  rajasthan_hc:  "Rajasthan High Court",
  supreme_court: "Supreme Court of India",
  nclt:          "NCLT",
  sessions:      "Sessions Court",
  district_civil:"District Civil Court",
  ngt:           "National Green Tribunal",
  cat:           "Central Administrative Tribunal",
};

// ── Formatter function ────────────────────────────────────────────────────────

export function formatCourtCaption(input: CourtFormatInput): FormattedCourtBlock {
  const config = COURT_CONFIGS[input.courtStyle];
  const location = (input.courtLocation ?? DEFAULT_LOCATIONS[input.courtStyle]).toUpperCase();

  // Build heading
  const heading = config.headingTemplate
    .replace("{LOCATION}", location)
    .replace("{DESIGNATION}", getCourDesignation(input.courtStyle));

  // Case number line
  const num = input.caseNumber ? `No. ${input.caseNumber} of ${input.caseYear}` : `No. ______ of ${input.caseYear}`;
  const caseNumberLine = `${input.caseType.toUpperCase()} ${num}`;

  // Bench line (if provided)
  const benchLine = input.bench ? `\nBefore: ${input.bench}` : "";

  // Act/Section reference line
  const actLine = input.actSection
    ? `\n[Under ${input.actSection}]`
    : "";

  // Cause title
  const petDesig = input.petitionerDesignation ? `\n${input.petitionerDesignation}` : "";
  const resDesig = input.respondentDesignation ? `\n${input.respondentDesignation}` : "";
  const causeTitle =
    `${input.petitionerName.toUpperCase()}${petDesig}` +
    `\n${"                              ".padEnd(40)}...Petitioner/Applicant` +
    `\n\n${"VERSUS".padStart(40)}` +
    `\n\n${input.respondentName.toUpperCase()}${resDesig}` +
    `\n${"                              ".padEnd(40)}...Respondent`;

  const fullCaption = [heading, benchLine, actLine, "", caseNumberLine, "", "IN THE MATTER OF:", "", causeTitle].filter(l => l !== undefined).join("\n");

  return {
    heading,
    causeTitle,
    caseNumberLine,
    fullCaption,
    prayerOpener: config.prayerOpener,
    verificationClause: config.verificationClause,
  };
}

function getCourDesignation(style: CourtStyle): string {
  switch (style) {
    case "sessions":      return "SESSIONS JUDGE / ADDITIONAL SESSIONS JUDGE";
    case "district_civil": return "DISTRICT JUDGE / CIVIL JUDGE (SENIOR DIVISION)";
    default:              return "PRESIDING OFFICER";
  }
}

/**
 * Quick helper: get the standard court heading for a court style.
 * Used in MatterDraftingStudio and BilingualDraftPage.
 */
export function courtHeading(style: CourtStyle, location?: string): string {
  return formatCourtCaption({
    courtStyle: style,
    caseType: "",
    caseYear: new Date().getFullYear().toString(),
    petitionerName: "",
    respondentName: "",
    courtLocation: location,
  }).heading;
}
