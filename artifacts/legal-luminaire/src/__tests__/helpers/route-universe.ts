/**
 * Route universe derived from the real route table.
 *
 * Compiled from routes.tsx JSX `path` attributes plus flat case-scoped nav
 * entries, which the router serves as /case/:id/* via LEGACY_FLAT_PATHS
 * redirects. `:param` segments match any single segment; interpolated href
 * segments (`${id}`) are normalised to the same wildcard.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export const read = (rel: string): string => readFileSync(join(SRC, rel), "utf8");

export const DYN = "\u0000DYN\u0000";

export const segments = (url: string): string[] =>
  url.replace(/[?#].*$/, "").split("/").filter(Boolean);

export const routePatterns: string[][] = [];
for (const [, p] of read("routes.tsx").matchAll(/path="([^"]+)"/g)) {
  routePatterns.push(segments(p));
}
for (const [, p, tail] of read("config/navigation.ts").matchAll(/path:\s*"([^"]+)"([^\n]*)/g)) {
  if (/caseScoped:\s*true/.test(tail)) routePatterns.push(segments(`/case/:id${p}`));
}

export function resolves(href: string): boolean {
  // Adjacent interpolations (`${a}${b}`) are two path segments at runtime — the
  // usual "scoped prefix + subpath" shape, e.g. `/case/${id}${item.path}` where
  // item.path already starts with "/". Restore that boundary before segmenting.
  const normalised = href.replace(/\}\$\{/g, "}/${");
  const parts = segments(normalised.replace(/\$\{[^}]*\}/g, DYN));
  return routePatterns.some(
    (pat) =>
      pat.length === parts.length &&
      pat.every((seg, i) => {
        const got = parts[i];
        return seg === got || seg.startsWith(":") || got === DYN;
      }),
  );
}

/** href="/literal" or href={`/templated/${x}`} — internal targets only. */
export const LINK = /href=(?:"(\/[^"]*)"|\{`(\/[^`]*)`\})/g;
