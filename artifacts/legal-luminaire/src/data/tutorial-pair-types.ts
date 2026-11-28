/**
 * Schema for Rajasthan tutorial pairs (input query ↔ repository-drawn result).
 * SYNTHETIC / DEMO — never filing-ready.
 */

export type TutorialStage = "initial" | "reply" | "trial" | "appeal" | "mid-journey";
export type TutorialLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type TutorialForum =
  | "district"
  | "high-court"
  | "revenue"
  | "rera"
  | "family"
  | "commercial";

export type TutorialInputKind =
  | "query"
  | "demand"
  | "submit"
  | "notice-text"
  | "fir"
  | "reply-instruction"
  | "handover"
  | "second-opinion";

export type TutorialLanguage = "en" | "hi" | "hinglish";
export type TutorialChannel = "walk-in" | "whatsapp" | "email" | "phone" | "portal" | "counter";

export type CitationGate = "BLOCKED" | "PENDING" | "SECONDARY";
export type LimitationGate = "KNOWN" | "UNKNOWN" | "URGENT" | "EXPIRED-RISK";
export type VerificationStatus = "COURT_SAFE" | "VERIFIED" | "SECONDARY" | "PENDING";
export type DraftState =
  | "intake-only"
  | "research-needed"
  | "draft"
  | "review-needed"
  | "ready-for-supervising-advocate"
  | "blocked";
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
export type TerminalKind = "proceed" | "hold" | "review" | "refer" | "no-filing";

export type TutorialPair = {
  id: `TP-RJ-${string}`;
  title: string;
  stage: TutorialStage;
  level: TutorialLevel;
  forum: TutorialForum;
  district: string;
  syntheticLabel: "SYNTHETIC / DEMO";
  input: {
    kind: TutorialInputKind;
    language: TutorialLanguage;
    channel: TutorialChannel;
    text: string;
    attachments: string[];
  };
  expected: {
    triage: {
      urgency: "routine" | "moderate" | "urgent" | "critical";
      documentCompleteness: "complete" | "partial" | "incomplete" | "unreadable";
      requestClarity: "clear" | "overbroad" | "unclear" | "conflicting";
      oneLineRead: string;
    };
    issueMap: { issue: string; status: "SETTLED" | "OPEN" | "CONFLICT" | "UNCONFIRMED"; note: string }[];
    chronology: { date: string; event: string; source: string; confidence: string }[];
    verification: {
      proposition: string;
      proposition_note?: string | null;
      provision: string;
      legacyEquivalent: string | null;
      status: VerificationStatus;
      blockedFromDraft: boolean;
      sourceUrl: string | null;
      sourceUrlNote?: string;
    }[];
    citationGate: CitationGate;
    limitationGate: LimitationGate;
    drafts: {
      type: DraftType;
      title: string;
      status: DraftState;
      blockedReason: string | null;
      /**
       * Worked-example document text. Gate-shaped, never filing-ready: any
       * unverified citation is an explicit `[PENDING — …]` hole, never a filled
       * guess. Present for productive statuses; null/absent for blocked ones.
       */
      body?: string | null;
    }[];
    checklist: string[];
    terminalOutcome: {
      kind: TerminalKind;
      label: string;
      rationale: string;
      nextAction: string;
    };
    teachingNotes: string[];
    commonMistakes: string[];
    seniorVariants: string[];
  };
  accuracy: {
    adverseFact: string;
    unresolvedFacts: string[];
    jurisdictionNote: string;
  };
};
