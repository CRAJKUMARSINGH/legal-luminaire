import { describe, expect, it } from "vitest";
import { ALL_NAV_ITEMS } from "./navigation";

describe("landing navigation integrity", () => {
  it("does not retain the broken unhyphenated week-four destinations", () => {
    expect(ALL_NAV_ITEMS.some((item) => /^\/example3[3-9]$|^\/example4[01]$/.test(item.path))).toBe(false);
  });

  it("gives each week-four destination a concrete route shape", () => {
    const examplePaths = ALL_NAV_ITEMS
      .map((item) => item.path)
      .filter((path) => path.startsWith("/example-"));
    expect(examplePaths).toEqual([
      "/example-33",
      "/example-34",
      "/example-35",
      "/example-36",
      "/example-37",
      "/example-38",
      "/example-39",
      "/example-40",
      "/example-41",
    ]);
  });
});
