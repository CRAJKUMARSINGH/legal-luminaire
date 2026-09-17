/**
 * Case data layer — single entry point for turning a catalogue id (TC-01 … TC-26,
 * or a stored record id) into a fully-populated `CaseRecord` for `CaseContext`.
 *
 * Adding a new sample case = add data here (or a data file it references); no
 * component changes are needed. Everything produced here is SYNTHETIC / DEMO.
 */
import type { CaseRecord } from "@/lib/case-store";
import { DEFAULT_CASE_ID } from "@/lib/case-store";
import { ALL_DEMO_CASES, type DemoCaseCard } from "@/data/all-demo-cases";
import { buildHemrajCaseRecord, HEMRAJ_DEMO_ID } from "./hemraj-case-01";
import { CASE02_META, CASE02_GROUNDS, CASE02_PRECEDENTS } from "@/data/stub-cases/case02-ndps";
import { CASE03_META, CASE03_GROUNDS, CASE03_PRECEDENTS } from "@/data/stub-cases/case03-ni-act";
import { CASE04_META, CASE04_GROUNDS, CASE04_PRECEDENTS, CASE04_DEMANDS } from "@/data/stub-cases/case04-peetambara";
import {
  TC27_META, TC27_GROUNDS, TC27_PRECEDENTS, TC27_PRAYER,
  TC28_META, TC28_GROUNDS, TC28_PRECEDENTS, TC28_PRAYER,
  TC29_META, TC29_GROUNDS, TC29_PRECEDENTS, TC29_PRAYER,
  TC30_META, TC30_GROUNDS, TC30_PRECEDENTS, TC30_PRAYER,
  TC31_META, TC31_GROUNDS, TC31_PRECEDENTS, TC31_PRAYER,
  TC32_META, TC32_GROUNDS, TC32_PRECEDENTS, TC32_PRAYER,
  TC33_META, TC33_GROUNDS, TC33_PRECEDENTS, TC33_PRAYER,
  TC34_META, TC34_GROUNDS, TC34_PRECEDENTS, TC34_PRAYER,
  TC35_META, TC35_GROUNDS, TC35_PRECEDENTS, TC35_PRAYER,
  TC36_META, TC36_GROUNDS, TC36_PRECEDENTS, TC36_PRAYER,
} from "@/data/stub-cases/week03-cases-tc27-to-tc36";

export type ScenarioType = "functional" | "edge" | "stress" | "showcase";

export type CaseCatalogEntry = {
  id: string;
  title: string;
  titleHindi?: string;
  court: string;
  charges: string;
  category: DemoCaseCard["category"];
  subCategory: string;
  scenarioType: ScenarioType;
  outputType: DemoCaseCard["outputType"];
  card: DemoCaseCard;
};

/** TC-01 … TC-21 are functional scenarios; TC-22 … TC-26 are full-lifecycle showcase arbitrations. */
export function scenarioTypeFor(demoId: string): ScenarioType {
  const n = Number(demoId.replace(/^TC-/, ""));
  if (n >= 22) return "showcase";
  if (n === 21) return "stress";
  if (n === 20) return "edge";
  return "functional";
}

export const SCENARIO_LABELS: Record<ScenarioType, { en: string; hi: string }> = {
  functional: { en: "Functional", hi: "कार्यात्मक" },
  edge: { en: "Edge case", hi: "सीमांत मामला" },
  stress: { en: "Stress", hi: "तनाव परीक्षण" },
  showcase: { en: "Showcase", hi: "प्रदर्शन" },
};

export const CASE_CATALOG: CaseCatalogEntry[] = ALL_DEMO_CASES.map((card) => ({
  id: card.id,
  title: card.title,
  titleHindi: card.titleHindi,
  court: card.court,
  charges: card.charges,
  category: card.category,
  subCategory: card.subCategory,
  scenarioType: scenarioTypeFor(card.id),
  outputType: card.outputType,
  card,
}));

/** Record id used in `CaseContext` / URLs for a catalogue entry. TC-01 maps onto the built-in Hemraj slot. */
export function recordIdForDemo(demoId: string): string {
  return demoId === HEMRAJ_DEMO_ID ? DEFAULT_CASE_ID : demoId;
}

type Grounds = ReadonlyArray<{ id: string | number; title: string; body: string; priority: string }>;
type Precedents = ReadonlyArray<{
  id: string; name: string; citation: string; court: string;
  status: "VERIFIED" | "SECONDARY" | "PENDING"; statusNote: string; holding: string;
  application: string; blockedFromDraft: boolean;
}>;

const CASE04_GROUNDS_NORMALISED: Grounds = CASE04_GROUNDS.map((g) => ({
  id: g.id, title: g.title, body: g.description, priority: g.id <= 2 ? "primary" : "secondary",
}));
const CASE04_PRECEDENTS_NORMALISED: Precedents = CASE04_PRECEDENTS.map((p) => ({
  id: p.id, name: p.case, citation: p.case, court: p.court, status: p.status,
  statusNote: p.statusNote, holding: p.holding, application: p.application, blockedFromDraft: p.blockedFromDraft,
}));

function fromStub(
  card: DemoCaseCard,
  meta: { caseNo?: string; court: string; charges?: string; accused?: string; client?: string; opponent?: string },
  grounds: Grounds,
  precedents: Precedents,
  prayer: ReadonlyArray<string>,
): CaseRecord {
  const now = new Date().toISOString();
  const parties: CaseRecord["parties"] = [];
  if (meta.accused) parties.push({ name: meta.accused, role: "accused" });
  if (meta.client) parties.push({ name: meta.client, role: "respondent" });
  if (meta.opponent) parties.push({ name: meta.opponent, role: "petitioner" });
  return {
    id: card.id,
    title: `[DEMO] ${card.title}`,
    court: meta.court,
    caseNo: meta.caseNo ?? `${card.id}/DEMO`,
    brief: card.summary,
    createdAt: now,
    files: [],
    isDemo: true,
    sourceDemoId: card.id,
    case_type: card.outputType === "reply" ? "notice-reply" : card.outputType === "bail" ? "bail" : card.outputType === "discharge" ? "discharge" : "other",
    status: card.status,
    charges: meta.charges ?? card.charges,
    parties,
    citations: precedents.map((p) => ({
      id: p.id, caseName: p.name, citation: p.citation, court: p.court,
      holding: p.holding, status: p.status, blockedFromDraft: p.blockedFromDraft,
    })),
    caseLaw: precedents.map((p) => ({
      case: p.name, court: p.court, useForDefence: p.application, status: p.status,
      action: p.statusNote, citation: p.citation, holding: p.holding,
    })),
    strategy: grounds.map((g) => ({
      id: String(g.id), title: g.title, description: g.body, status: "ACTIVE",
      priority: g.priority === "primary" ? "HIGH" : "MEDIUM",
    })),
    timeline: [],
    standards: [],
    documents: [],
    prayerClauses: [...prayer],
    verificationBlocks: precedents.map((p) => ({
      id: `vb-${p.id}`, claim: `${p.name} ${p.citation}`, status: p.status,
      evidence: p.statusNote, blockedFromDraft: p.blockedFromDraft,
    })),
    metadata: {
      category: `${card.category} — ${card.subCategory}`,
      complexity: "INTERMEDIATE",
      estimatedDuration: "—",
      requiredResources: [],
    },
  };
}

/** Minimal-but-complete record for catalogue entries that only have card-level data. */
function fromCard(card: DemoCaseCard): CaseRecord {
  const now = new Date().toISOString();
  return {
    id: card.id,
    title: `[DEMO] ${card.title}`,
    court: card.court,
    caseNo: `${card.id}/DEMO`,
    brief: card.summary,
    createdAt: now,
    files: [],
    isDemo: true,
    sourceDemoId: card.id,
    case_type: card.outputType === "reply" ? "notice-reply" : card.outputType === "bail" ? "bail" : card.outputType === "discharge" ? "discharge" : card.outputType === "writ" ? "writ" : card.outputType === "appeal" ? "appeal" : "other",
    status: card.status,
    charges: card.charges,
    parties: [],
    citations: [],
    caseLaw: [],
    timeline: [],
    standards: [],
    documents: [],
    strategy: [{ id: "s1", title: card.keyGround, description: card.summary, status: "ACTIVE", priority: "HIGH" }],
    prayerClauses: [],
    verificationBlocks: [{
      id: "vb-1",
      claim: card.keyGround,
      status: "PENDING",
      evidence: `[DEMO PLACEHOLDER] ${card.verifiedClaims}/${card.totalClaims} claims verified in catalogue — full data pack not yet ported`,
      blockedFromDraft: true,
    }],
    metadata: {
      category: `${card.category} — ${card.subCategory}`,
      complexity: "BASIC",
      estimatedDuration: "—",
      requiredResources: [],
    },
  };
}

async function loadInfraArb(id: string): Promise<CaseRecord | null> {
  const { INFRA_ARB_CASES } = await import("@/data/demo-cases/infra-arb-cases");
  const rec = INFRA_ARB_CASES.find((c) => c.id === id);
  return rec ? { ...rec, isDemo: true, sourceDemoId: id } : null;
}

/**
 * Build the full `CaseRecord` for a catalogue id. Returns null for unknown ids.
 * Async so that heavy data packs can stay code-split.
 */
export async function buildCaseRecord(demoId: string): Promise<CaseRecord | null> {
  const card = ALL_DEMO_CASES.find((c) => c.id === demoId);
  if (!card) return null;
  switch (demoId) {
    case HEMRAJ_DEMO_ID:
      return buildHemrajCaseRecord(DEFAULT_CASE_ID);
    case "TC-02":
      return fromStub(card, CASE02_META, CASE02_GROUNDS, CASE02_PRECEDENTS, [
        "1. The applicant be enlarged on regular bail on such terms as this Hon'ble Court deems fit.",
        "2. [DEMO PLACEHOLDER — verify relief wording before filing]",
      ]);
    case "TC-03":
      return fromStub(card, CASE03_META, CASE03_GROUNDS, CASE03_PRECEDENTS, [
        "1. The accused be discharged of the offence under §138 NI Act.",
        "2. [DEMO PLACEHOLDER — verify relief wording before filing]",
      ]);
    case "TC-04":
      return fromStub(
        card,
        { court: CASE04_META.court, client: CASE04_META.client, opponent: CASE04_META.opponent },
        CASE04_GROUNDS_NORMALISED,
        CASE04_PRECEDENTS_NORMALISED,
        CASE04_DEMANDS.map((d, i) => `${i + 1}. ${d}`),
      );
    case "TC-101":
      return fromStub(card, TC27_META, TC27_GROUNDS, TC27_PRECEDENTS, TC27_PRAYER);
    case "TC-102":
      return fromStub(card, TC28_META, TC28_GROUNDS, TC28_PRECEDENTS, TC28_PRAYER);
    case "TC-103":
      return fromStub(card, TC29_META, TC29_GROUNDS, TC29_PRECEDENTS, TC29_PRAYER);
    case "TC-104":
      return fromStub(card, TC30_META, TC30_GROUNDS, TC30_PRECEDENTS, TC30_PRAYER);
    case "TC-105":
      return fromStub(card, TC31_META, TC31_GROUNDS, TC31_PRECEDENTS, TC31_PRAYER);
    case "TC-106":
      return fromStub(card, TC32_META, TC32_GROUNDS, TC32_PRECEDENTS, TC32_PRAYER);
    case "TC-107":
      return fromStub(card, TC33_META, TC33_GROUNDS, TC33_PRECEDENTS, TC33_PRAYER);
    case "TC-108":
      return fromStub(card, TC34_META, TC34_GROUNDS, TC34_PRECEDENTS, TC34_PRAYER);
    case "TC-109":
      return fromStub(card, TC35_META, TC35_GROUNDS, TC35_PRECEDENTS, TC35_PRAYER);
    case "TC-110":
      return fromStub(card, TC36_META, TC36_GROUNDS, TC36_PRECEDENTS, TC36_PRAYER);
    default:
      if (demoId.startsWith("TC-22") || demoId.startsWith("TC-23") || demoId.startsWith("TC-24") || demoId.startsWith("TC-25") || demoId.startsWith("TC-26")) {
        const infra = await loadInfraArb(demoId);
        if (infra) return infra;
      }
      return fromCard(card);
  }
}

export { HEMRAJ_DEMO_ID };
