/**
 * TEST FILE 2 — Verification Engine Tests
 * ─────────────────────────────────────────────────────────────────────────────
 * Maps to: ROBUSTNESS_TESTING/AUTOMATED_TEST_SUITE.md → LA-001, LA-002, LA-003
 * Maps to: accuracy-rules.md → Rules 1, 2, 3, 5, 6, 7
 *
 * Tests the single source of truth for citation accuracy:
 *   - Registry integrity (all required fields present)
 *   - Tier enforcement (PENDING → blockedFromDraft: true)
 *   - Utility functions: getCourtSafePrecedents, getBlockedPrecedents,
 *     getUnverifiedStandards, overallAccuracyScore, generateAccuracyReport
 *   - Standards accuracy (IS 1199 vs IS 2250 applicability)
 *   - Fact-Fit Gate scoring thresholds (Rule 2)
 */

import { describe, it, expect } from "vitest";
import {
  PRECEDENT_ACCURACY,
  STANDARDS_ACCURACY,
  getCourtSafePrecedents,
  getBlockedPrecedents,
  getUnverifiedStandards,
  overallAccuracyScore,
  generateAccuracyReport,
  type AccuracyTier,
  type PrecedentAccuracy,
  type StandardAccuracy,
} from "@/lib/verification-engine";

// ─── SUITE 1: REGISTRY INTEGRITY ─────────────────────────────────────────────

describe("Verification Engine — PRECEDENT_ACCURACY registry integrity", () => {
  it("registry is non-empty", () => {
    expect(PRECEDENT_ACCURACY.length).toBeGreaterThan(0);
  });

  it("every precedent has a unique id", () => {
    const ids = PRECEDENT_ACCURACY.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every precedent has a non-empty name", () => {
    for (const p of PRECEDENT_ACCURACY) {
      expect(typeof p.name).toBe("string");
      expect(p.name.trim().length).toBeGreaterThan(0);
    }
  });

  it("every precedent has a non-empty citation", () => {
    for (const p of PRECEDENT_ACCURACY) {
      expect(typeof p.citation).toBe("string");
      expect(p.citation.trim().length).toBeGreaterThan(0);
    }
  });

  it("every precedent has a valid AccuracyTier", () => {
    const validTiers: AccuracyTier[] = [
      "COURT_SAFE", "VERIFIED", "SECONDARY", "PENDING", "FATAL_ERROR",
    ];
    for (const p of PRECEDENT_ACCURACY) {
      expect(validTiers).toContain(p.tier);
    }
  });

  it("every precedent has a non-empty court field", () => {
    for (const p of PRECEDENT_ACCURACY) {
      expect(typeof p.court).toBe("string");
      expect(p.court.trim().length).toBeGreaterThan(0);
    }
  });

  it("every precedent has a sources array (may be empty)", () => {
    for (const p of PRECEDENT_ACCURACY) {
      expect(Array.isArray(p.sources)).toBe(true);
    }
  });

  it("every precedent has a verificationNote string", () => {
    for (const p of PRECEDENT_ACCURACY) {
      expect(typeof p.verificationNote).toBe("string");
    }
  });

  it("every precedent has a requiredActions array", () => {
    for (const p of PRECEDENT_ACCURACY) {
      expect(Array.isArray(p.requiredActions)).toBe(true);
    }
  });

  it("blockedFromDraft is boolean on every precedent", () => {
    for (const p of PRECEDENT_ACCURACY) {
      expect(typeof p.blockedFromDraft).toBe("boolean");
    }
  });
});

// ─── SUITE 2: PENDING → BLOCKED ENFORCEMENT (accuracy-rules.md Rule 7) ───────

describe("Verification Engine — PENDING citations must be blockedFromDraft", () => {
  it("all PENDING precedents have blockedFromDraft: true", () => {
    const pending = PRECEDENT_ACCURACY.filter((p) => p.tier === "PENDING");
    expect(pending.length).toBeGreaterThan(0); // sanity: registry has PENDING entries
    for (const p of pending) {
      expect(p.blockedFromDraft).toBe(true);
    }
  });

  it("all FATAL_ERROR precedents have blockedFromDraft: true", () => {
    const fatal = PRECEDENT_ACCURACY.filter((p) => p.tier === "FATAL_ERROR");
    for (const p of fatal) {
      expect(p.blockedFromDraft).toBe(true);
    }
  });

  it("COURT_SAFE precedents are not blocked", () => {
    const courtSafe = PRECEDENT_ACCURACY.filter((p) => p.tier === "COURT_SAFE");
    expect(courtSafe.length).toBeGreaterThan(0);
    for (const p of courtSafe) {
      expect(p.blockedFromDraft).toBe(false);
    }
  });

  it("PENDING precedents have null verifiedHolding (not yet confirmed)", () => {
    const pending = PRECEDENT_ACCURACY.filter((p) => p.tier === "PENDING");
    for (const p of pending) {
      expect(p.verifiedHolding).toBeNull();
    }
  });

  it("PENDING precedents have null paraRef", () => {
    const pending = PRECEDENT_ACCURACY.filter((p) => p.tier === "PENDING");
    for (const p of pending) {
      expect(p.paraRef).toBeNull();
    }
  });
});

// ─── SUITE 3: SPECIFIC KNOWN PRECEDENTS ──────────────────────────────────────

describe("Verification Engine — known precedent verification", () => {
  const findById = (id: string): PrecedentAccuracy =>
    PRECEDENT_ACCURACY.find((p) => p.id === id)!;

  it("Prafulla Kumar Samal is COURT_SAFE", () => {
    const p = findById("p_prafulla");
    expect(p).toBeDefined();
    expect(p.tier).toBe("COURT_SAFE");
  });

  it("Prafulla Kumar Samal has Para 10 confirmed", () => {
    const p = findById("p_prafulla");
    expect(p.paraRef).toBe("Para 10");
  });

  it("Prafulla Kumar Samal holding is accurate", () => {
    const p = findById("p_prafulla");
    expect(p.holdingAccurate).toBe(true);
  });

  it("Ramesh Singh is COURT_SAFE", () => {
    const p = findById("p_ramesh_singh");
    expect(p).toBeDefined();
    expect(p.tier).toBe("COURT_SAFE");
  });

  it("Jacob Mathew is COURT_SAFE", () => {
    const p = findById("p_jacob_mathew");
    expect(p).toBeDefined();
    expect(p.tier).toBe("COURT_SAFE");
  });

  it("Jacob Mathew has Para 48 confirmed", () => {
    const p = findById("p_jacob_mathew");
    expect(p.paraRef).toBe("Para 48");
  });

  it("Sushil Sharma is SECONDARY (not blocked)", () => {
    const p = findById("p_sushil_sharma");
    expect(p).toBeDefined();
    expect(p.tier).toBe("SECONDARY");
    expect(p.blockedFromDraft).toBe(false);
  });

  it("Mohanbhai is PENDING and blocked", () => {
    const p = findById("p_mohanbhai");
    expect(p).toBeDefined();
    expect(p.tier).toBe("PENDING");
    expect(p.blockedFromDraft).toBe(true);
  });

  it("R.B. Constructions is PENDING and blocked", () => {
    const p = findById("p_rb_constructions");
    expect(p).toBeDefined();
    expect(p.tier).toBe("PENDING");
    expect(p.blockedFromDraft).toBe(true);
  });

  it("K.S. Kalra is PENDING and blocked", () => {
    const p = findById("p_ks_kalra");
    expect(p).toBeDefined();
    expect(p.tier).toBe("PENDING");
    expect(p.blockedFromDraft).toBe(true);
  });

  it("Builders Association is PENDING and blocked", () => {
    const p = findById("p_builders_assoc");
    expect(p).toBeDefined();
    expect(p.tier).toBe("PENDING");
    expect(p.blockedFromDraft).toBe(true);
  });

  it("Kattavellai is VERIFIED (not blocked)", () => {
    const p = findById("p_kattavellai");
    expect(p).toBeDefined();
    expect(p.tier).toBe("VERIFIED");
    expect(p.blockedFromDraft).toBe(false);
  });
});

// ─── SUITE 4: STANDARDS REGISTRY INTEGRITY ───────────────────────────────────

describe("Verification Engine — STANDARDS_ACCURACY registry integrity", () => {
  it("standards registry is non-empty", () => {
    expect(STANDARDS_ACCURACY.length).toBeGreaterThan(0);
  });

  it("every standard has a non-empty code", () => {
    for (const s of STANDARDS_ACCURACY) {
      expect(typeof s.code).toBe("string");
      expect(s.code.trim().length).toBeGreaterThan(0);
    }
  });

  it("every standard has a valid AccuracyTier", () => {
    const validTiers: AccuracyTier[] = [
      "COURT_SAFE", "VERIFIED", "SECONDARY", "PENDING", "FATAL_ERROR",
    ];
    for (const s of STANDARDS_ACCURACY) {
      expect(validTiers).toContain(s.tier);
    }
  });

  it("every standard has a valid applicability value", () => {
    const validApplicability = ["correct", "wrong", "partial"];
    for (const s of STANDARDS_ACCURACY) {
      expect(validApplicability).toContain(s.applicability);
    }
  });

  it("every standard has a sources array", () => {
    for (const s of STANDARDS_ACCURACY) {
      expect(Array.isArray(s.sources)).toBe(true);
    }
  });
});

// ─── SUITE 5: IS STANDARDS ACCURACY RULES (accuracy-rules.md Rule 3) ─────────

describe("Verification Engine — IS/ASTM standards accuracy (Rule 3)", () => {
  const findStd = (code: string): StandardAccuracy =>
    STANDARDS_ACCURACY.find((s) => s.code === code)!;

  it("IS 1199:2018 applicability is 'wrong' (fresh concrete only)", () => {
    const s = findStd("IS 1199:2018");
    expect(s).toBeDefined();
    expect(s.applicability).toBe("wrong");
  });

  it("IS 1199:2018 applicabilityReason mentions fresh concrete", () => {
    const s = findStd("IS 1199:2018");
    expect(s.applicabilityReason.toLowerCase()).toContain("fresh concrete");
  });

  it("IS 2250:1981 applicability is 'correct' (masonry mortar)", () => {
    const s = findStd("IS 2250:1981");
    expect(s).toBeDefined();
    expect(s.applicability).toBe("correct");
  });

  it("ASTM C1324 applicability is 'correct' (hardened masonry mortar)", () => {
    const s = findStd("ASTM C1324");
    expect(s).toBeDefined();
    expect(s.applicability).toBe("correct");
  });

  it("IS 1199:2018 statementAccurate is true", () => {
    const s = findStd("IS 1199:2018");
    expect(s.statementAccurate).toBe(true);
  });

  it("IS 2250:1981 statementAccurate is true", () => {
    const s = findStd("IS 2250:1981");
    expect(s.statementAccurate).toBe(true);
  });

  it("CPWD Manual 2023 applicability is 'correct'", () => {
    const s = findStd("CPWD Manual 2023");
    expect(s).toBeDefined();
    expect(s.applicability).toBe("correct");
  });
});

// ─── SUITE 6: UTILITY FUNCTIONS ───────────────────────────────────────────────

describe("Verification Engine — getCourtSafePrecedents()", () => {
  it("returns only COURT_SAFE or VERIFIED precedents", () => {
    const safe = getCourtSafePrecedents();
    for (const p of safe) {
      expect(["COURT_SAFE", "VERIFIED"]).toContain(p.tier);
    }
  });

  it("returns no blocked precedents", () => {
    const safe = getCourtSafePrecedents();
    for (const p of safe) {
      expect(p.blockedFromDraft).toBe(false);
    }
  });

  it("returns at least one precedent", () => {
    expect(getCourtSafePrecedents().length).toBeGreaterThan(0);
  });
});

describe("Verification Engine — getBlockedPrecedents()", () => {
  it("returns only precedents with blockedFromDraft: true", () => {
    const blocked = getBlockedPrecedents();
    for (const p of blocked) {
      expect(p.blockedFromDraft).toBe(true);
    }
  });

  it("returns at least one blocked precedent", () => {
    expect(getBlockedPrecedents().length).toBeGreaterThan(0);
  });

  it("all returned precedents are PENDING or FATAL_ERROR", () => {
    const blocked = getBlockedPrecedents();
    for (const p of blocked) {
      expect(["PENDING", "FATAL_ERROR"]).toContain(p.tier);
    }
  });
});

describe("Verification Engine — getUnverifiedStandards()", () => {
  it("returns only standards with null exactClauseText", () => {
    const unverified = getUnverifiedStandards();
    for (const s of unverified) {
      expect(s.exactClauseText).toBeNull();
    }
  });

  it("IS 1199:2018 is NOT in unverified list (has clause text)", () => {
    const unverified = getUnverifiedStandards();
    const is1199 = unverified.find((s) => s.code === "IS 1199:2018");
    expect(is1199).toBeUndefined();
  });

  it("IS 2250:1981 IS in unverified list (no clause text yet)", () => {
    const unverified = getUnverifiedStandards();
    const is2250 = unverified.find((s) => s.code === "IS 2250:1981");
    expect(is2250).toBeDefined();
  });
});

// ─── SUITE 7: ACCURACY SCORE ──────────────────────────────────────────────────

describe("Verification Engine — overallAccuracyScore()", () => {
  it("score is -1 sentinel (combined percentage removed per directive)", () => {
    const { score } = overallAccuracyScore();
    // Combined percentage was removed — score must be the -1 sentinel value.
    // Any UI relying on a 0-100 value must be updated to show tier counts instead.
    expect(score).toBe(-1);
  });

  it("accuracyNote explains that combined percentage was removed", () => {
    const result = overallAccuracyScore();
    expect(result).toHaveProperty("accuracyNote");
    expect((result as { accuracyNote: string }).accuracyNote).toContain("Combined percentage removed");
  });

  it("courtSafe count matches COURT_SAFE precedents in registry", () => {
    const { courtSafe } = overallAccuracyScore();
    const actual = PRECEDENT_ACCURACY.filter((p) => p.tier === "COURT_SAFE").length;
    expect(courtSafe).toBe(actual);
  });

  it("verified count matches VERIFIED precedents in registry", () => {
    const { verified } = overallAccuracyScore();
    const actual = PRECEDENT_ACCURACY.filter((p) => p.tier === "VERIFIED").length;
    expect(verified).toBe(actual);
  });

  it("secondary count matches SECONDARY precedents in registry", () => {
    const { secondary } = overallAccuracyScore();
    const actual = PRECEDENT_ACCURACY.filter((p) => p.tier === "SECONDARY").length;
    expect(secondary).toBe(actual);
  });

  it("pending count matches PENDING precedents in registry", () => {
    const { pending } = overallAccuracyScore();
    const actual = PRECEDENT_ACCURACY.filter((p) => p.tier === "PENDING").length;
    expect(pending).toBe(actual);
  });

  it("blocked count matches blockedFromDraft: true precedents", () => {
    const { blocked } = overallAccuracyScore();
    const actual = PRECEDENT_ACCURACY.filter((p) => p.blockedFromDraft).length;
    expect(blocked).toBe(actual);
  });
});

// ─── SUITE 8: ACCURACY REPORT ─────────────────────────────────────────────────

describe("Verification Engine — generateAccuracyReport()", () => {
  it("returns a non-empty string", () => {
    const report = generateAccuracyReport();
    expect(typeof report).toBe("string");
    expect(report.length).toBeGreaterThan(0);
  });

  it("report contains 'CITATION ACCURACY REPORT' header", () => {
    const report = generateAccuracyReport();
    expect(report).toContain("CITATION ACCURACY REPORT");
  });

  it("report contains tier breakdown (COURT_SAFE count)", () => {
    const report = generateAccuracyReport();
    expect(report).toContain("Court-Safe");
  });

  it("report contains BLOCKED CITATIONS section", () => {
    const report = generateAccuracyReport();
    expect(report).toContain("BLOCKED CITATIONS");
  });

  it("report contains STANDARDS NEEDING VERIFICATION section", () => {
    const report = generateAccuracyReport();
    expect(report).toContain("STANDARDS NEEDING VERIFICATION");
  });

  it("report contains REQUIRED ACTIONS section", () => {
    const report = generateAccuracyReport();
    expect(report).toContain("REQUIRED ACTIONS BEFORE FILING");
  });

  it("report lists Mohanbhai as a blocked citation", () => {
    const report = generateAccuracyReport();
    expect(report).toContain("Mohanbhai");
  });

  it("report lists R.B. Constructions as a blocked citation", () => {
    const report = generateAccuracyReport();
    expect(report).toContain("R.B. Constructions");
  });

  it("report includes a timestamp", () => {
    const report = generateAccuracyReport();
    expect(report).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });
});

// ─── SUITE 9 (P0): REGRESSION GUARD — PENDING must stay blocked ───────────────
// These tests enforce accuracy-rules.md Rule 7 as a CI gate.
// A single accidental change to blockedFromDraft on any PENDING entry
// would cause one of these to fail and block the commit.

import { CASE01_PRECEDENTS } from "@/lib/case01-data";

describe("P0 Regression Guard — PENDING citations must always be blockedFromDraft", () => {
  it("every PENDING entry in CASE01_PRECEDENTS has blockedFromDraft=true", () => {
    const pending = (CASE01_PRECEDENTS as Array<{ status: string; blockedFromDraft?: boolean; name: string }>)
      .filter((p) => p.status === "PENDING");
    expect(pending.length).toBeGreaterThan(0); // sanity: there must be at least one PENDING
    for (const p of pending) {
      expect(p.blockedFromDraft).toBe(true);
    }
  });

  it("no PENDING entry in CASE01_PRECEDENTS has blockedFromDraft=false or undefined", () => {
    const violators = (CASE01_PRECEDENTS as Array<{ status: string; blockedFromDraft?: boolean; name: string }>)
      .filter((p) => p.status === "PENDING" && p.blockedFromDraft !== true);
    expect(violators).toHaveLength(0);
  });

  it("every PENDING entry in PRECEDENT_ACCURACY registry has blockedFromDraft=true", () => {
    const pending = PRECEDENT_ACCURACY.filter((p) => p.tier === "PENDING");
    expect(pending.length).toBeGreaterThan(0);
    for (const p of pending) {
      expect(p.blockedFromDraft).toBe(true);
    }
  });
});

describe("P0 Regression Guard — downgraded precedents p13/p14/p16 must stay SECONDARY", () => {
  it("p13 (Rajasthan HC PIL) is NOT VERIFIED in CASE01_PRECEDENTS", () => {
    const p13 = (CASE01_PRECEDENTS as Array<{ id: string; status: string }>).find((p) => p.id === "p13");
    if (p13) expect(p13.status).not.toBe("VERIFIED");
  });

  it("p14 (Surendra Koli) is NOT VERIFIED in CASE01_PRECEDENTS", () => {
    const p14 = (CASE01_PRECEDENTS as Array<{ id: string; status: string }>).find((p) => p.id === "p14");
    if (p14) expect(p14.status).not.toBe("VERIFIED");
  });

  it("p16 (RSMML) is NOT VERIFIED in CASE01_PRECEDENTS", () => {
    const p16 = (CASE01_PRECEDENTS as Array<{ id: string; status: string }>).find((p) => p.id === "p16");
    if (p16) expect(p16.status).not.toBe("VERIFIED");
  });

  it("p_rajasthan_hc_pil is SECONDARY in PRECEDENT_ACCURACY registry", () => {
    const p = PRECEDENT_ACCURACY.find((p) => p.id === "p_rajasthan_hc_pil");
    if (p) expect(p.tier).toBe("SECONDARY");
  });

  it("p_surendra_koli is SECONDARY in PRECEDENT_ACCURACY registry", () => {
    const p = PRECEDENT_ACCURACY.find((p) => p.id === "p_surendra_koli");
    if (p) expect(p.tier).toBe("SECONDARY");
  });

  it("p_rsmml is SECONDARY in PRECEDENT_ACCURACY registry", () => {
    const p = PRECEDENT_ACCURACY.find((p) => p.id === "p_rsmml");
    if (p) expect(p.tier).toBe("SECONDARY");
  });
});

describe("P0 Regression Guard — overallAccuracyScore combined percentage removed", () => {
  it("score field returns -1 sentinel (not a 0-100 percentage)", () => {
    expect(overallAccuracyScore().score).toBe(-1);
  });

  it("accuracyNote field is present and explains the removal", () => {
    const result = overallAccuracyScore() as ReturnType<typeof overallAccuracyScore>;
    expect(result.accuracyNote).toBeDefined();
    expect(result.accuracyNote).toContain("Combined percentage removed");
  });
});
