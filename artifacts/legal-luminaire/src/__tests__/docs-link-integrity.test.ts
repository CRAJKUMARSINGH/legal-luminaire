/**
 * Relative links in repo markdown must resolve on disk.
 *
 * Baseline-driven: pre-existing rot is recorded in BASELINE so this fails on
 * regressions, not on the backlog. Shrink BASELINE as links get fixed.
 * Absolute URLs and in-page anchors are out of scope.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "vitest";

// src/__tests__ → src → app → artifacts → repo root
const REPO = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const DOCS = join(REPO, "docs");

/** Known-broken: "<repo-relative file>: <target>". Fill from a test run. */
const BASELINE: string[] = [];

const LINK = /\]\((?!https?:|mailto:|#)([^)\s]+)\)/g;
const stripFences = (md: string): string => md.replace(/```[\s\S]*?```/g, "");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });
}

const FILES = [
  ...readdirSync(REPO).filter((f) => f.endsWith(".md")).map((f) => join(REPO, f)),
  ...walk(DOCS),
];

describe("docs links", () => {
  it("no newly broken relative links", () => {
    const broken: string[] = [];

    for (const abs of FILES) {
      const rel = abs.slice(REPO.length + 1);
      const body = stripFences(readFileSync(abs, "utf8"));

      for (const [, raw] of body.matchAll(LINK)) {
        const target = raw.split("#")[0].split("?")[0];
        if (!target) continue;
        const resolved = target.startsWith("/") ? join(REPO, target) : resolve(dirname(abs), target);
        if (!existsSync(resolved)) broken.push(`${rel}: ${raw}`);
      }
    }

    const known = broken.filter((b) => !BASELINE.includes(b));
    if (known.length) {
      throw new Error(
        `${known.length} newly broken link(s):\n\n` +
          `${known.join("\n")}\n\n` +
          `Fix them, or add to BASELINE if deferred.`,
      );
    }
  });
});
