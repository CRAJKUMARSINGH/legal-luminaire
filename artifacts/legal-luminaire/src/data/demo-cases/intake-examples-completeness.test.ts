import { describe, expect, it } from "vitest";
import { ALL_INTAKE_EXAMPLES } from "./all-intake-examples";

describe("drafting intake fixture release gate", () => {
  it("contains exactly EX-001 through EX-051 once", () => {
    const ids = ALL_INTAKE_EXAMPLES.map((example) => example.id);
    expect(ids).toHaveLength(51);
    expect(new Set(ids).size).toBe(51);
    expect(ids).toEqual(
      Array.from({ length: 51 }, (_, index) => `EX-${String(index + 1).padStart(3, "0")}`),
    );
  });

  it("gives every fixture all five sections and a terminal conclusion", () => {
    for (const example of ALL_INTAKE_EXAMPLES) {
      expect(example.background.trim(), example.id).not.toBe("");
      expect(example.documents, example.id).toBeInstanceOf(Array);
      expect(example.clientRequest.trim(), example.id).not.toBe("");
      expect(Object.keys(example.actionPlan), example.id).toEqual(
        expect.arrayContaining(["facts", "research", "drafting", "review", "filing"]),
      );
      expect(example.drafts.length, example.id).toBeGreaterThan(0);
      expect(example.terminalOutcome.label, example.id).not.toBe("");
      expect(example.terminalOutcome.rationale, example.id).not.toBe("");
      expect(example.terminalOutcome.nextAction, example.id).not.toBe("");
    }
  });

  it("never exposes a filing-ready state from synthetic data", () => {
    for (const example of ALL_INTAKE_EXAMPLES) {
      expect(example.workflowState, example.id).not.toBe("filing-ready");
      for (const draft of example.drafts) {
        expect(draft.status, `${example.id}/${draft.title}`).not.toBe("filing-ready");
        if (draft.status === "blocked") {
          expect(draft.blockedReason?.trim(), `${example.id}/${draft.title}`).toBeTruthy();
        }
      }
    }
  });

  it("preserves adverse or contradictory facts for adversarial review", () => {
    expect(ALL_INTAKE_EXAMPLES.filter((example) => example.adverseFact?.trim()).length).toBeGreaterThanOrEqual(45);
  });
});
