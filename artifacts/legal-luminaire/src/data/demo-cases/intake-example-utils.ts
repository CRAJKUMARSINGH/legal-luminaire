import type { IntakeExample, TerminalOutcome } from "./intake-example-types";

export function terminalOutcomeFor(example: Omit<IntakeExample, "terminalOutcome">): TerminalOutcome {
  const blockedDraft = example.drafts.find((draft) => draft.status === "blocked");
  const gateBlocked =
    example.citationGate === "BLOCKED" ||
    example.limitationGate === "EXPIRED-RISK";

  if (blockedDraft || gateBlocked || example.workflowState === "blocked") {
    return {
      kind: "hold",
      label: "Hold — do not file",
      rationale:
        blockedDraft?.blockedReason ??
        "A safety or accuracy gate is blocked; the fixture cannot move to filing.",
      nextAction:
        example.missingDocuments[0] ??
        example.documentGaps[0] ??
        "Resolve the blocked accuracy gate and record the evidence.",
    };
  }

  if (
    example.limitationGate === "URGENT" ||
    example.limitationGate === "UNKNOWN" ||
    example.citationGate === "PENDING"
  ) {
    return {
      kind: "review",
      label: "Research and supervisor review required",
      rationale:
        "The next step is time-sensitive or legally unverified; the demo must not convert it into a filing-ready output.",
      nextAction:
        example.actionPlan.research[0] ??
        "Confirm the current rule, forum and deadline with a supervising advocate.",
    };
  }

  if (
    example.requestClarity === "unclear" ||
    example.requestClarity === "overbroad" ||
    example.requestClarity === "conflicting"
  ) {
    return {
      kind: "refer",
      label: "Clarify instructions before drafting",
      rationale:
        "The requested result is not sufficiently bounded to select a safe document or forum.",
      nextAction:
        example.requestNote ??
        "Obtain informed instructions and record the chosen remedy before drafting.",
    };
  }

  return {
    kind: "proceed",
    label: "Proceed to supervised review",
    rationale:
      "The intake path has a defined next step, but the synthetic fixture remains subject to current-law verification and advocate approval.",
    nextAction:
      example.actionPlan.review[0] ??
      "Run the accuracy checklist and obtain supervising-advocate approval.",
  };
}

export function withTerminalOutcome(
  example: Omit<IntakeExample, "terminalOutcome">,
): IntakeExample {
  return { ...example, terminalOutcome: terminalOutcomeFor(example) };
}
