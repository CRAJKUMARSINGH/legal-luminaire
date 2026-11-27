import { describe, expect, it } from "vitest";
import { read } from "./helpers/route-universe";

describe("route table", () => {
  it("declares no path twice", () => {
    const counts = new Map<string, number>();
    for (const [, p] of read("routes.tsx").matchAll(/path="([^"]+)"/g)) {
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }

    const duplicated = [...counts].filter(([, n]) => n > 1).map(([p]) => p);
    expect(duplicated).toEqual([]);
  });
});
