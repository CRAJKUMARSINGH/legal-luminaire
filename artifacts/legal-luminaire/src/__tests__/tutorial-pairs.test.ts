import { describe, it, expect } from "vitest";
import { RAJASTHAN_TUTORIAL_PAIRS } from "@/data/rajasthan-tutorial-pairs";
import type { TutorialStage, TutorialLevel, DraftState } from "@/data/tutorial-pair-types";

const STAGES: TutorialStage[] = ["initial", "reply", "trial", "appeal", "mid-journey"];
const LEVELS: TutorialLevel[] = ["beginner", "intermediate", "advanced", "expert"];
const TERMINALS = ["proceed", "hold", "review", "refer", "no-filing"];
const CITATION_GATES = ["BLOCKED", "PENDING", "SECONDARY"];
const LIMITATION_GATES = ["KNOWN", "UNKNOWN", "URGENT", "EXPIRED-RISK"];

/**
 * Mirrors scripts/validate-tutorial-pairs.ts against the UI bundle so the app
 * cannot drift from the canonical JSON in tutorial-data/pairs/.
 */
describe("Rajasthan tutorial pairs — UI bundle invariants", () => {
  it("has 30 unique, well-formed pairs", () => {
    expect(RAJASTHAN_TUTORIAL_PAIRS.length).toBe(30);
    const ids = RAJASTHAN_TUTORIAL_PAIRS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of RAJASTHAN_TUTORIAL_PAIRS) {
      expect(p.id).toMatch(/^TP-RJ-\d{2}$/);
      expect(p.syntheticLabel).toBe("SYNTHETIC / DEMO");
      expect(p.title.length).toBeGreaterThanOrEqual(8);
    }
  });

  it("uses only declared stages, levels, forums and gates", () => {
    for (const p of RAJASTHAN_TUTORIAL_PAIRS) {
      expect(STAGES).toContain(p.stage);
      expect(LEVELS).toContain(p.level);
      expect(CITATION_GATES).toContain(p.expected.citationGate);
      expect(LIMITATION_GATES).toContain(p.expected.limitationGate);
      expect(TERMINALS).toContain(p.expected.terminalOutcome.kind);
    }
  });

  it("covers the five stages and four levels", () => {
    const stages = new Set(RAJASTHAN_TUTORIAL_PAIRS.map((p) => p.stage));
    const levels = new Set(RAJASTHAN_TUTORIAL_PAIRS.map((p) => p.level));
    for (const s of STAGES) expect(stages.has(s)).toBe(true);
    for (const l of LEVELS) expect(levels.has(l)).toBe(true);
  });

  it("keeps PENDING verification blocked and non-PENDING unblocked", () => {
    for (const p of RAJASTHAN_TUTORIAL_PAIRS) {
      for (const v of p.expected.verification) {
        if (v.status === "PENDING") expect(v.blockedFromDraft).toBe(true);
        else expect(v.blockedFromDraft).toBe(false);
        if (v.sourceUrl === null) expect(v.sourceUrlNote).toBeTruthy();
      }
    }
  });

  it("gives every blocked draft a reason and never claims filing-ready", () => {
    for (const p of RAJASTHAN_TUTORIAL_PAIRS) {
      for (const d of p.expected.drafts) {
        expect(d.status as DraftState | "filing-ready").not.toBe("filing-ready");
        if (d.status === "blocked") expect(d.blockedReason).toBeTruthy();
      }
      expect(p.expected.teachingNotes.length).toBeGreaterThanOrEqual(2);
      expect(p.expected.commonMistakes.length).toBeGreaterThanOrEqual(2);
      expect(p.expected.seniorVariants.length).toBeGreaterThanOrEqual(1);
      expect(p.accuracy.adverseFact).toBeTruthy();
      expect(p.accuracy.jurisdictionNote).toBeTruthy();
      expect(p.accuracy.unresolvedFacts.length).toBeGreaterThanOrEqual(1);
    }
  });

  // The "real output" layer: a productive draft ships a gate-shaped worked
  // example; a dormant draft ships none. Mirrors validate-tutorial-pairs.ts.
  const PRODUCTIVE: DraftState[] = ["draft", "review-needed", "ready-for-supervising-advocate"];
  const DORMANT: DraftState[] = ["blocked", "intake-only", "research-needed"];
  const INVENTED_CITATION = /(\(\d{4}\)\s*\d+\s*(?:SCC|GLR)\s*\d+)|(\bAIR\s+\d{4}\b)|(\b\d{4}\s*INSC\s*\d+\b)|(\bSCC\s*OnLine\b)/;

  it("ships a worked-example body for every productive draft", () => {
    for (const p of RAJASTHAN_TUTORIAL_PAIRS) {
      for (const d of p.expected.drafts) {
        if (!PRODUCTIVE.includes(d.status)) continue;
        expect(typeof d.body, `${p.id} / ${d.title}`).toBe("string");
        expect((d.body as string).length).toBeGreaterThanOrEqual(120);
      }
    }
  });

  it("never puts a body on a dormant draft", () => {
    for (const p of RAJASTHAN_TUTORIAL_PAIRS) {
      for (const d of p.expected.drafts) {
        if (DORMANT.includes(d.status)) expect(d.body ?? null, `${p.id} / ${d.title}`).toBeNull();
      }
    }
  });

  it("keeps unverified authority as a hole, never a filled citation", () => {
    for (const p of RAJASTHAN_TUTORIAL_PAIRS) {
      for (const d of p.expected.drafts) {
        if (!d.body) continue;
        expect(INVENTED_CITATION.test(d.body), `${p.id} / ${d.title}`).toBe(false);
        expect(d.body).toContain("[PENDING");
      }
    }
  });

  it("gives every non-PENDING statute entry an official source URL", () => {
    for (const p of RAJASTHAN_TUTORIAL_PAIRS) {
      for (const v of p.expected.verification) {
        if (v.status === "PENDING") continue;
        if (v.sourceUrl === null) continue; // non-statute propositions stay null + note
        expect(v.sourceUrl, `${p.id} / ${v.provision}`).toMatch(/^https:\/\/[^/]*\.(nic\.in|gov\.in)\//);
      }
    }
  });
});
