import { describe, it, expect, beforeEach } from "vitest";
import { validateIntake } from "@/lib/intake-schema";
import { loadRecentCases, pushRecentCase, RECENT_CASES_LIMIT } from "@/lib/recent-cases";
import { CASE_CATALOG, buildCaseRecord, recordIdForDemo, scenarioTypeFor } from "@/cases/registry";
import { NAV_GROUPS, LEGACY_FLAT_PATHS } from "@/config/navigation";

const base = {
  title: "", caseNo: "", court: "", caseType: "discharge" as const, accusedName: "",
  incidentDate: "", firDate: "", arrestDate: "", remandDate: "", chargeSheetDate: "", brief: "",
};

describe("Week 2 — intake Zod schema", () => {
  it("blocks empty required fields with bilingual messages", () => {
    const errs = validateIntake(base);
    expect(errs.title).toMatch(/आवश्यक.*\/.*required/);
    expect(errs.court).toMatch(/\//);
    expect(errs.brief).toBeTruthy();
  });
  it("rejects malformed dates and accepts DD-MM-YYYY", () => {
    expect(validateIntake({ ...base, firDate: "2024-01-05" }).firDate).toBeTruthy();
    expect(validateIntake({ ...base, firDate: "05-01-2024" }).firDate).toBeUndefined();
  });
  it("passes a complete record", () => {
    const errs = validateIntake({
      ...base, title: "State v. Test", court: "Sessions Court",
      brief: "Accused charged under IPC 304A; FIR lodged after delay; chargesheet filed without forensic annexures.",
    });
    expect(errs).toEqual({});
  });
});

function memoryStorage(): Storage {
  const m = new Map<string, string>();
  return {
    get length() { return m.size; },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => Array.from(m.keys())[i] ?? null,
    removeItem: (k) => { m.delete(k); },
    setItem: (k, v) => { m.set(k, String(v)); },
  };
}

describe("Week 2 — recent cases (localStorage)", () => {
  beforeEach(() => {
    if (typeof globalThis.localStorage === "undefined") {
      Object.defineProperty(globalThis, "localStorage", { value: memoryStorage(), configurable: true });
    }
    localStorage.clear();
  });
  it("dedupes, newest-first, capped", () => {
    for (let i = 0; i < RECENT_CASES_LIMIT + 3; i++) pushRecentCase(`c-${i}`);
    pushRecentCase("c-2");
    const ids = loadRecentCases().map((r) => r.id);
    expect(ids[0]).toBe("c-2");
    expect(ids.length).toBe(RECENT_CASES_LIMIT);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Week 2 — case registry / data layer", () => {
  it("exposes all 36 catalogue cases with required card fields", () => {
    expect(CASE_CATALOG.length).toBeGreaterThanOrEqual(36);
    for (const c of CASE_CATALOG) {
      expect(c.id).toMatch(/^TC-\d+$/);
      expect(c.title).toBeTruthy();
      expect(c.court).toBeTruthy();
      expect(c.charges).toBeTruthy();
      expect(["functional", "edge", "stress", "showcase"]).toContain(c.scenarioType);
    }
    expect(scenarioTypeFor("TC-21")).toBe("stress");
    expect(recordIdForDemo("TC-01")).toBe("case-01");
  });

  it("builds a full Hemraj record with all Week 2 fields", async () => {
    const rec = await buildCaseRecord("TC-01");
    expect(rec).not.toBeNull();
    expect(rec!.isDemo).toBe(true);
    expect(rec!.court).toBeTruthy();
    expect(rec!.caseNo).toBeTruthy();
    expect(rec!.parties!.length).toBeGreaterThan(0);
    expect(rec!.timeline!.length).toBeGreaterThan(0);
    expect(rec!.standards!.length).toBeGreaterThan(0);
    expect(rec!.caseLaw!.length).toBeGreaterThan(0);
    expect(rec!.prayerClauses!.length).toBeGreaterThan(0);
    expect(rec!.verificationBlocks!.length).toBeGreaterThan(0);
  });

  it("every catalogue case loads as a CaseRecord and PENDING stubs are draft-blocked", async () => {
    for (const c of CASE_CATALOG) {
      const rec = await buildCaseRecord(c.id);
      expect(rec, c.id).not.toBeNull();
      expect(rec!.isDemo).toBe(true);
      expect(rec!.court).toBeTruthy();
      const pending = (rec!.verificationBlocks ?? []).filter((v) => v.status === "PENDING");
      for (const p of pending) expect(p.blockedFromDraft).toBe(true);
    }
  });
});

describe("Week 2 — navigation", () => {
  it("has exactly five top-level groups and legacy flat paths", () => {
    expect(NAV_GROUPS.map((g) => g.id)).toEqual(["setup", "research", "drafting", "review", "week04"]);
    expect(LEGACY_FLAT_PATHS).toContain("/dashboard");
    expect(LEGACY_FLAT_PATHS).toContain("/case-law");
  });
});
