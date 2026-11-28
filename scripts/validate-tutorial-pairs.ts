/**
 * Validator for tutorial-data/pairs.
 * Run: pnpm --filter @workspace/scripts run validate-tutorial-pairs
 *      (or) pnpm tsx scripts/validate-tutorial-pairs.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve the repo root from the script location (scripts/..), so the check
// behaves the same whether it is run from the repo root or from scripts/.
const ROOT = resolve(fileURLToPath(import.meta.url), "..", "..");
const DIR = join(ROOT, "tutorial-data", "pairs");
const TRAP_INDEX = join(ROOT, "tutorial-data", "GUIDE", "annex", "F-trap-index.md");

const STAGES = ["initial", "reply", "trial", "appeal", "mid-journey"] as const;
const LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;

const errors: string[] = [];
const warnings: string[] = [];
const seen = new Set<string>();
const byStage = new Map<string, Set<string>>();
const byLevel = new Map<string, Set<string>>();
const hindi: string[] = [];

const requiredTop = [
  "id", "title", "stage", "level", "forum", "district",
  "input", "expected", "accuracy", "syntheticLabel",
] as const;

const verificationKeys = new Set([
  "proposition", "proposition_note", "provision", "legacyEquivalent",
  "status", "blockedFromDraft", "sourceUrl", "sourceUrlNote",
]);

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const raw = readFileSync(join(DIR, file), "utf8");
  let p: any;
  try {
    p = JSON.parse(raw);
  } catch (e) {
    errors.push(`${file}: invalid JSON — ${(e as Error).message}`);
    continue;
  }

  for (const k of requiredTop) if (p[k] === undefined) errors.push(`${file}: missing ${k}`);
  if (seen.has(p.id)) errors.push(`${file}: duplicate id ${p.id}`);
  seen.add(p.id);

  if (!/^TP-RJ-\d{2}$/.test(p.id ?? "")) errors.push(`${file}: bad id format`);
  if (p.syntheticLabel !== "SYNTHETIC / DEMO") errors.push(`${file}: syntheticLabel wrong`);
  if (p.accuracy_note !== undefined) errors.push(`${file}: stray accuracy_note at top level`);

  if (!STAGES.includes(p.stage)) errors.push(`${file}: bad stage "${p.stage}"`);
  else {
    if (!byStage.has(p.stage)) byStage.set(p.stage, new Set());
    byStage.get(p.stage)!.add(p.id);
  }

  if (!LEVELS.includes(p.level)) errors.push(`${file}: bad level "${p.level}"`);
  else {
    if (!byLevel.has(p.level)) byLevel.set(p.level, new Set());
    byLevel.get(p.level)!.add(p.id);
  }

  if (p.input?.language === "hi") hindi.push(p.id);

  const e = p.expected ?? {};
  if (!["BLOCKED", "PENDING", "SECONDARY"].includes(e.citationGate)) {
    errors.push(`${file}: bad citationGate`);
  }
  if (!["KNOWN", "UNKNOWN", "URGENT", "EXPIRED-RISK"].includes(e.limitationGate)) {
    errors.push(`${file}: bad limitationGate`);
  }

  for (const v of e.verification ?? []) {
    for (const k of Object.keys(v)) {
      if (!verificationKeys.has(k)) errors.push(`${file}: unknown verification key "${k}"`);
    }
    if (!v.status) errors.push(`${file}: verification entry without status`);
    if (v.status === "PENDING" && v.blockedFromDraft !== true) {
      errors.push(`${file}: PENDING "${v.provision}" not blockedFromDraft`);
    }
    if (v.status !== "PENDING" && v.blockedFromDraft === true) {
      errors.push(`${file}: non-PENDING "${v.provision}" wrongly blocked`);
    }
    if (!("sourceUrl" in v)) errors.push(`${file}: verification entry missing sourceUrl key`);
    if (v.sourceUrl === null && !v.sourceUrlNote) {
      errors.push(`${file}: null sourceUrl without sourceUrlNote`);
    }
  }

  const blocked = (e.drafts ?? []).filter((d: any) => d.status === "blocked");
  for (const d of blocked) {
    if (!d.blockedReason) errors.push(`${file}: blocked draft "${d.title}" has no reason`);
  }

  // ── Worked-example body rules (the "real output" layer) ──────────────────
  // A productive draft must ship a body; a blocked/dormant draft must not.
  // A body may never carry an invented reporter citation — unverified authority
  // stays an explicit [PENDING — …] gate hole.
  const PRODUCTIVE = new Set(["draft", "review-needed", "ready-for-supervising-advocate"]);
  const DORMANT = new Set(["blocked", "intake-only", "research-needed"]);
  const INVENTED_CITATION = /(\(\d{4}\)\s*\d+\s*(?:SCC|GLR)\s*\d+)|(\bAIR\s+\d{4}\b)|(\b\d{4}\s*INSC\s*\d+\b)|(\bSCC\s*OnLine\b)/;
  for (const d of e.drafts ?? []) {
    const hasBody = typeof d.body === "string" && d.body.trim().length > 0;
    if (PRODUCTIVE.has(d.status) && !hasBody) {
      errors.push(`${file}: productive draft "${d.title}" (${d.status}) has no body`);
    }
    if (DORMANT.has(d.status) && d.body != null) {
      errors.push(`${file}: dormant draft "${d.title}" (${d.status}) must not carry a body`);
    }
    if (hasBody) {
      if (d.body.length < 120) errors.push(`${file}: body for "${d.title}" too short to be a document`);
      if (INVENTED_CITATION.test(d.body)) {
        errors.push(`${file}: body for "${d.title}" contains a fabricated-looking citation — use a [PENDING — …] hole`);
      }
    }
  }

  if (!["proceed", "hold", "review", "refer", "no-filing"].includes(e.terminalOutcome?.kind)) {
    errors.push(`${file}: bad terminalOutcome.kind`);
  }
  if (!e.terminalOutcome?.rationale || !e.terminalOutcome?.nextAction) {
    errors.push(`${file}: terminalOutcome incomplete`);
  }
  if ((e.teachingNotes ?? []).length < 2) errors.push(`${file}: needs 2+ teachingNotes`);
  if ((e.commonMistakes ?? []).length < 2) errors.push(`${file}: needs 2+ commonMistakes`);
  if ((e.seniorVariants ?? []).length < 1) errors.push(`${file}: needs 1+ seniorVariants`);

  if (!p.accuracy?.adverseFact) errors.push(`${file}: missing adverseFact`);
  if (!p.accuracy?.jurisdictionNote) errors.push(`${file}: missing jurisdictionNote`);
  if (!Array.isArray(p.accuracy?.unresolvedFacts) || !p.accuracy.unresolvedFacts.length) {
    errors.push(`${file}: missing unresolvedFacts`);
  }

  if ((e.drafts ?? []).some((d: any) => d.status === "filing-ready")) {
    errors.push(`${file}: uses filing-ready`);
  }
}

// Stage and level coverage, per bucket, not by total count.
for (const s of STAGES) if (!byStage.has(s)) errors.push(`no pair at stage "${s}"`);
for (const l of LEVELS) if (!byLevel.has(l)) errors.push(`no pair at level "${l}"`);

// Matrix must not be lopsided into a single row or column.
const cells = new Map<string, number>();
for (const s of STAGES) {
  for (const l of LEVELS) cells.set(`${s}/${l}`, 0);
}
for (const f of readdirSync(DIR).filter((x) => x.endsWith(".json"))) {
  try {
    const p = JSON.parse(readFileSync(join(DIR, f), "utf8"));
    const k = `${p.stage}/${p.level}`;
    if (cells.has(k)) cells.set(k, cells.get(k)! + 1);
  } catch { /* already reported */ }
}
const filled = [...cells.values()].filter((n) => n > 0).length;
if (filled < 12) errors.push(`stage x level matrix too sparse (${filled}/20 cells)`);

// Every pair must be reachable from the trap index.
let indexIds = new Set<string>();
try {
  const idx = readFileSync(TRAP_INDEX, "utf8");
  indexIds = new Set([...idx.matchAll(/TP-RJ-\d{2}/g)].map((m) => m[0]));
} catch {
  errors.push(`cannot read trap index at ${TRAP_INDEX}`);
}
for (const id of seen) if (!indexIds.has(id)) errors.push(`trap index missing ${id}`);
for (const id of indexIds) if (!seen.has(id)) errors.push(`trap index has unknown ${id}`);

// Hindi floor is a warning, not a gate.
const hiCount = hindi.length;
if (hiCount < Math.ceil(seen.size / 5)) {
  warnings.push(`Hindi coverage low: ${hiCount}/${seen.size} (target 1 in 5)`);
}

const matrix = STAGES.map((s) =>
  LEVELS.map((l) => `${s}/${l}=${cells.get(`${s}/${l}`)}`).join(" ")
).join("\n  ");

if (errors.length) {
  console.error(`FAIL — ${errors.length} problem(s)`);
  for (const x of errors) console.error("  • " + x);
  if (warnings.length) {
    console.error(`\n${warnings.length} warning(s)`);
    for (const w of warnings) console.error("  ~ " + w);
  }
  process.exit(1);
}

console.log(`PASS — ${seen.size} pairs valid`);
console.log(`  stages ${STAGES.length}, levels ${LEVELS.length}, matrix ${filled}/20 cells`);
console.log(`  Hindi ${hiCount}/${seen.size}`);
for (const w of warnings) console.log(`  ~ ${w}`);
console.log("\n" + matrix);
