/**
 * Shared schema for the 51 synthetic drafting-intake fixtures.
 *
 * A fixture is complete only when it has a safe terminal outcome. That outcome
 * is not a prediction of legal merit; it is the next operational conclusion
 * the demo may safely display after the intake gates are considered.
 */

export type DraftState =
  | "intake-only"
  | "research-needed"
  | "draft"
  | "review-needed"
  | "ready-for-supervising-advocate"
  | "blocked";

export type ApproachStatus =
  | "cold-walk-in"
  | "referral"
  | "returning-client"
  | "online-intake"
  | "legal-aid-camp"
  | "urgent-referral";

export type DocumentCompleteness =
  | "complete"
  | "partial"
  | "incomplete"
  | "unreadable";

export type DraftType =
  | "notice"
  | "pleading"
  | "application"
  | "affidavit"
  | "deed"
  | "checklist"
  | "no-filing-note"
  | "memo"
  | "chronology"
  | "index"
  | "undertaking"
  | "letter"
  | "table"
  | "instruction";

export type RequestClarity = "clear" | "overbroad" | "unclear" | "conflicting";

export type CitationGate = "BLOCKED" | "PENDING" | "SECONDARY";
export type LimitationGate = "KNOWN" | "UNKNOWN" | "URGENT" | "EXPIRED-RISK";

export type IntakeActionPlan = {
  facts: string[];
  research: string[];
  drafting: string[];
  review: string[];
  filing: string[];
};

export type IntakeDraft = {
  type: DraftType;
  title: string;
  status: DraftState;
  jurisdiction?: string;
  limitationNote?: string;
  approvalRequired: boolean;
  blockedReason?: string;
};

export type TerminalOutcome = {
  kind: "proceed" | "hold" | "review" | "refer" | "no-filing";
  label: string;
  rationale: string;
  nextAction: string;
};

export type IntakeExample = {
  id: `EX-${string}`;
  title: string;
  domain: string;
  complexity: "Basic" | "Intermediate" | "Advanced" | "Expert";
  approachStatus: ApproachStatus;
  approachStatusNote: string;
  urgency: "routine" | "moderate" | "urgent" | "critical";
  documentCompleteness: DocumentCompleteness;
  workflowState: DraftState;

  /** Section 0 — Background */
  background: string;
  backgroundHi?: string;

  /** Section 1 — Data and documents brought */
  documents: string[];
  missingDocuments: string[];
  documentGaps: string[];

  /** Section 2 — Client request */
  clientRequest: string;
  requestClarity: RequestClarity;
  requestNote?: string;

  /** Section 3 — Action plan */
  actionPlan: IntakeActionPlan;
  unresolvedFacts: string[];
  adverseFact?: string;

  /** Section 4 — Drafts */
  drafts: IntakeDraft[];

  /** Accuracy gates */
  citationGate: CitationGate;
  limitationGate: LimitationGate;
  syntheticLabel: "SYNTHETIC / DEMO";

  /**
   * The safe conclusion is mandatory. It must never say that a fixture is
   * filing-ready; that requires facts, current-law verification and supervisor
   * approval outside this demo.
   */
  terminalOutcome: TerminalOutcome;
};
