export type CourtStyle =
  | "rajasthan_hc"
  | "supreme_court"
  | "sessions"
  | "district_civil"
  | "nclt"
  | "ngt"
  | "cat";

export const COURT_STYLE_LABELS: Record<CourtStyle, string> = {
  rajasthan_hc: "Rajasthan High Court",
  supreme_court: "Supreme Court of India",
  sessions: "Sessions Court",
  district_civil: "District Civil Court",
  nclt: "National Company Law Tribunal",
  ngt: "National Green Tribunal",
  cat: "Central Administrative Tribunal",
};

export interface CourtFormatInput {
  courtStyle: CourtStyle;
  caseType: string;
  caseYear: string;
  caseNumber?: string;
  petitionerName: string;
  petitionerDesignation?: string;
  respondentName: string;
  respondentDesignation?: string;
  courtLocation?: string;
  bench?: string;
  actSection?: string;
}

export interface CourtFormatOutput {
  fullCaption: string;
  prayerOpener: string;
  verificationClause: string;
}

function clean(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export function formatCourtCaption(input: CourtFormatInput): CourtFormatOutput {
  const petitioner = clean(input.petitionerName, "[PETITIONER NAME]");
  const respondent = clean(input.respondentName, "[RESPONDENT NAME]");
  const location = clean(input.courtLocation, "[CITY]");
  const caseNo = clean(input.caseNumber, "[N]");
  const year = clean(input.caseYear, "[YEAR]");
  const bench = input.bench?.trim() ? `\nBefore: ${input.bench.trim()}` : "";
  const section = input.actSection?.trim()
    ? `\nUnder: ${input.actSection.trim()}`
    : "";

  const courtHeading = `IN THE ${COURT_STYLE_LABELS[input.courtStyle].toUpperCase()}${input.courtStyle === "supreme_court" ? "" : ` AT ${location.toUpperCase()}`}`;
  const cause = `${petitioner}${input.petitionerDesignation ? `\n${input.petitionerDesignation.trim()}` : ""}\n\nVersus\n\n${respondent}${input.respondentDesignation ? `\n${input.respondentDesignation.trim()}` : ""}`;
  const title = `${input.caseType.trim() || "Petition"} No. ${caseNo}/${year}`;

  return {
    fullCaption: `${courtHeading}${bench}\n\n${title}${section}\n\n${cause}`,
    prayerOpener: `In view of the facts and grounds stated above, the Petitioner respectfully prays that this Hon'ble Court may be pleased to:`,
    verificationClause: `Verified at ${location} on [DATE] that the contents of this pleading are based on the record available to the deponent and are believed to be true.`,
  };
}
