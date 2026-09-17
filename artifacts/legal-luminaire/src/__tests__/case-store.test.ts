import { beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_CASE_ID,
  defaultCase,
  getChargesArray,
  isSeeded,
  loadCases,
  loadSelectedCaseId,
  markSeeded,
  saveCases,
  saveSelectedCaseId,
  slugifyCase,
  mergeIncomingCases,
  type CaseRecord,
} from "@/lib/case-store";
import { DEFAULT_CASE_DATA, loadMultiCases, saveMultiCases, validateCaseData } from "@/lib/multi-case-store";

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

describe("case-store hydrate/read (canonical adapter)", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "localStorage", { value: memoryStorage(), configurable: true });
  });

  it("returns defaultCase when storage is empty", () => {
    const cases = loadCases();
    expect(cases).toHaveLength(1);
    expect(cases[0].id).toBe(DEFAULT_CASE_ID);
    expect(cases[0].title).toBe(defaultCase.title);
  });

  it("round-trips saveCases / loadCases", () => {
    const rec: CaseRecord = { ...defaultCase, id: "case-99", title: "Saved" };
    saveCases([rec]);
    const loaded = loadCases();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe("case-99");
    expect(loaded[0].title).toBe("Saved");
  });

  it("persists selected case id", () => {
    expect(loadSelectedCaseId()).toBe(DEFAULT_CASE_ID);
    saveSelectedCaseId("case-99");
    expect(loadSelectedCaseId()).toBe("case-99");
  });

  it("treats corrupt JSON as defaultCase", () => {
    localStorage.setItem("legal_luminaire_cases_v1", "{not-json");
    expect(loadCases()[0].id).toBe(DEFAULT_CASE_ID);
  });

  it("normalises charges and slugify", () => {
    expect(getChargesArray({ ...defaultCase, charges: "IPC 420" })).toEqual(["IPC 420"]);
    expect(slugifyCase("Hemraj Vardar")).toBe("hemraj-vardar");
  });

  it("seed flags", () => {
    expect(isSeeded()).toBe(false);
    markSeeded();
    expect(isSeeded()).toBe(true);
  });

  it("mergeIncomingCases does not replace local records", () => {
    const local: CaseRecord[] = [{ ...defaultCase, title: "Local Hemraj" }];
    const merged = mergeIncomingCases(local, [
      { id: DEFAULT_CASE_ID, title: "Remote overwrite" },
      { id: "case-remote", title: "Remote only" },
      { not: "a case" },
    ]);
    expect(merged.find((c) => c.id === DEFAULT_CASE_ID)?.title).toBe("Local Hemraj");
    expect(merged.some((c) => c.id === "case-remote")).toBe(true);
    expect(merged).toHaveLength(2);
  });
});

describe("multi-case-store is a separate adapter (EXC-4)", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "localStorage", { value: memoryStorage(), configurable: true });
  });

  it("does not share keys with case-store", () => {
    saveCases([{ ...defaultCase, title: "Canonical" }]);
    const multi = loadMultiCases();
    expect(multi[0].id).toBe(DEFAULT_CASE_DATA.id);
    expect(loadCases()[0].title).toBe("Canonical");
  });

  it("validateCaseData requires title/court/caseNo/brief/charges", () => {
    expect(validateCaseData({}).isValid).toBe(false);
    expect(validateCaseData({
      title: "A", court: "B", caseNo: "C", brief: "D", charges: "E",
    }).isValid).toBe(true);
  });
});
