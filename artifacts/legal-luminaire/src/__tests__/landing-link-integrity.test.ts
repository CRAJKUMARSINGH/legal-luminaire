/**
 * Landing-page link integrity.
 *
 * Guards the class of defect where a CTA points at a path that exists nowhere
 * in routes.tsx. Compiles every path="/…" in the route table to a segment
 * matcher, then asserts every internal href rendered on the landing page
 * resolves against it.
 *
 * Case-scoped nav entries are stored flat (`/dashboard`, caseScoped: true) and
 * served by /case/:id/dashboard + LEGACY_FLAT_PATHS redirects, so they are
 * expanded to the scoped form before matching.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string): string => readFileSync(join(SRC, rel), "utf8");

/** Placeholder for an interpolated segment, e.g. `${selectedCase.id}`. */
const DYN = "\u0000DYN\u0000";

const segments = (url: string): string[] =>
  url.replace(/[?#].*$/, "").split("/").filter(Boolean);

/** Route table: every JSX path attribute. */
const routePatterns: string[][] = [];
for (const [, p] of read("routes.tsx").matchAll(/path="([^"]+)"/g)) {
  routePatterns.push(segments(p));
}

/** Flat case-scoped nav paths, expanded to the scoped route that serves them. */
for (const [, p, tail] of read("config/navigation.ts").matchAll(/path:\s*"([^"]+)"([^\n]*)/g)) {
  if (/caseScoped:\s*true/.test(tail)) routePatterns.push(segments(`/case/:id${p}`));
}

const LANDING_SOURCES = [
  "pages/Home.tsx",
  "components/home/PremiumHeroBanner.tsx",
  "components/home/OnboardingHero.tsx",
  "components/home/DemoModeCard.tsx",
  "components/home/RecentCasesWidget.tsx",
  "components/GuidedFlow.tsx",
  "components/HarveyEvaluationPanel.tsx",
  "components/SaraswatiMascot.tsx",
];

/** href="/literal" or href={`/templated/${x}`} */
const LINK = /href=(?:"(\/[^"]*)"|\{`(\/[^`]*)`\})/g;

function resolves(href: string): boolean {
  const parts = segments(href.replace(/\$\{[^}]*\}/g, DYN));
  return routePatterns.some(
    (pat) =>
      pat.length === parts.length &&
      pat.every((seg, i) => {
        const got = parts[i];
        return seg === got || seg.startsWith(":") || got === DYN;
      }),
  );
}

describe("landing page links", () => {
  it("every internal href resolves to a real route", () => {
    const broken: string[] = [];

    for (const file of LANDING_SOURCES) {
      for (const [, literal, template] of read(file).matchAll(LINK)) {
        const href = literal ?? template;
        if (!resolves(href)) broken.push(`${file}: ${href}`);
      }
    }

    expect(broken).toEqual([]);
  });

  it("hero footer uses client-side navigation for internal targets", () => {
    const raw = [...read("components/home/PremiumHeroBanner.tsx").matchAll(/<a\s[^>]*href="(\/[^"]*)"/g)]
      .map((m) => m[1]);

    expect(raw).toEqual([]);
  });
});
