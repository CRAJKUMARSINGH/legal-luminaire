import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "vitest";
import { LINK, read, resolves, SRC } from "./helpers/route-universe";

const ROOTS = ["pages", "components"];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) return e === "__tests__" ? [] : walk(p);
    return p.endsWith(".tsx") ? [p] : [];
  });
}

/** Static files Vite serves from public/ at the site root. */
const PUBLIC = join(SRC, "..", "public");
const STATIC = /^\/(?:assets|data|docs|samples)\//;
const staticExists = (href: string) => existsSync(join(PUBLIC, href));

/**
 * Verified-broken route targets awaiting a fix. Must stay small — past ~10,
 * fix the links instead of extending this list.
 */
const KNOWN_BROKEN: string[] = [];

describe("repo-wide internal links", () => {
  it("every internal href resolves to a real route or a real file", () => {
    const unrouted: string[] = [];
    const missingAsset: string[] = [];

    for (const abs of ROOTS.flatMap((r) => walk(join(SRC, r)))) {
      const file = abs.slice(SRC.length + 1);
      for (const [, literal, template] of read(file).matchAll(LINK)) {
        const href = literal ?? template;

        if (resolves(href)) continue;
        if (STATIC.test(href)) {
          if (!staticExists(href)) missingAsset.push(`${file}: ${href}`);
          continue;
        }
        // Root-level files served from public/ (e.g. /defence_english.tex) —
        // checked on disk rather than hardcoding their names.
        if (staticExists(href)) continue;
        if (KNOWN_BROKEN.includes(href)) continue;
        unrouted.push(`${file}: ${href}`);
      }
    }

    if (unrouted.length || missingAsset.length) {
      const unique = [...new Set(unrouted.map((l) => l.split(": ")[1]))].sort();
      throw new Error(
        [
          unrouted.length ? `${unique.length} unresolved route target(s):\n${unrouted.join("\n")}` : "",
          unrouted.length ? `\nconst KNOWN_BROKEN: string[] = ${JSON.stringify(unique, null, 2)};` : "",
          missingAsset.length ? `\n${missingAsset.length} missing static file(s):\n${missingAsset.join("\n")}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      );
    }
  });
});
