/**
 * Proves the tutorial samples are reachable from the landing page.
 *
 * The repo has no DOM render harness (no jsdom/testing-library), so this is a
 * static proof of the full chain, mirroring __tests__/landing-link-integrity:
 *   Home.tsx  --href="/tutorial-pairs"-->  routes.tsx  --path-->  TutorialPairsPage
 *   TutorialPairsPage  --imports-->  RAJASTHAN_TUTORIAL_PAIRS (30 pairs)
 */
import { describe, it, expect } from "vitest";
import TutorialPairsPage from "@/pages/TutorialPairsPage";
import TutorialPairDraftPage from "@/pages/TutorialPairDraftPage";
import { RAJASTHAN_TUTORIAL_PAIRS } from "@/data/rajasthan-tutorial-pairs";
import { read, resolves } from "./helpers/route-universe";

describe("tutorial samples visible through the landing page", () => {
  it("the samples page compiles and is wired to the 30-pair corpus", () => {
    expect(TutorialPairsPage).toBeDefined();
    expect(RAJASTHAN_TUTORIAL_PAIRS.length).toBe(30);
  });

  it("routes.tsx serves /tutorial-pairs via TutorialPairsPage", () => {
    const routes = read("routes.tsx");
    expect(routes).toMatch(/path="\/tutorial-pairs"/);
    expect(routes).toMatch(/TutorialPairsPage/);
  });

  it("Home.tsx links to /tutorial-pairs and the link resolves to that route", () => {
    const home = read("pages/Home.tsx");
    expect(home).toMatch(/href="\/tutorial-pairs"/);
    expect(resolves("/tutorial-pairs")).toBe(true);
  });

  it("the landing link sits outside the case-gated block (visible with no case)", () => {
    const home = read("pages/Home.tsx");
    const linkAt = home.indexOf('href="/tutorial-pairs"');
    const gateAt = home.indexOf("{selectedCase && (<>");
    expect(linkAt).toBeGreaterThan(-1);
    expect(gateAt).toBeGreaterThan(-1);
    expect(linkAt).toBeLessThan(gateAt);
  });

  it("the samples page renders every pair from the corpus", () => {
    const src = read("pages/TutorialPairsPage.tsx");
    expect(src).toMatch(/import \{ RAJASTHAN_TUTORIAL_PAIRS \}/);
    expect(src).toMatch(/filtered\.map/);
    expect(src).toMatch(/pair\.title/);
  });

  it("the samples page shows the worked-example bodies and links to the engine", () => {
    const src = read("pages/TutorialPairsPage.tsx");
    expect(src).toMatch(/d\.body/);
    expect(src).toMatch(/href=\{`\/tutorial-pairs\/\$\{pair\.id\}`\}/);
  });

  it("routes.tsx serves the per-pair engine hand-off", () => {
    expect(read("routes.tsx")).toMatch(/path="\/tutorial-pairs\/:id"/);
    expect(read("routes.tsx")).toMatch(/TutorialPairDraftPage/);
    expect(resolves("/tutorial-pairs/TP-RJ-01")).toBe(true);
    expect(TutorialPairDraftPage).toBeDefined();
  });

  it("the hand-off page feeds the pair's intake into the real engine", () => {
    const src = read("pages/TutorialPairDraftPage.tsx");
    expect(src).toMatch(/import \{ DraftGenerator \}/);
    expect(src).toMatch(/initialQuery=\{pair\.input\.text\}/);
    expect(src).toMatch(/initialLanguage=\{engineLanguage\(pair\.input\.language\)\}/);
    expect(src).toMatch(/productive/);
  });
});
