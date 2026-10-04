import * as fs from "fs";
import * as path from "path";

type ImprovementKind =
  | "HARVEY_LAB_GUARDRAIL"
  | "CITATION_ACCURACY"
  | "PRECEDENT_REVIEW"
  | "STANDARD_REVIEW"
  | "DRAFTING_SAFETY"
  | "DEMO_ENRICHMENT"
  | "ROADMAP";

type ImprovementPriority = "P0" | "P1" | "P2";
type ImprovementStatus = "READY_FOR_REVIEW" | "NEEDS_SOURCE_CHECK" | "BLOCKED_ACTIVE_MATTER";

interface ImprovementItem {
  id: string;
  title: string;
  kind: ImprovementKind;
  priority: ImprovementPriority;
  status: ImprovementStatus;
  source: string;
  sourceType: "website" | "ebook" | "precedent" | "asset" | "log";
  targetArea: string;
  summary: string;
  reviewGate: string;
  labCriteria: string[];
}

function resolveWorkspaceRoot(): string {
  const cwd = path.resolve(process.cwd());
  if (path.basename(cwd) === "ETERNAL_RESEARCH_CHILD") return path.dirname(cwd);
  if (fs.existsSync(path.join(cwd, "ETERNAL_RESEARCH_CHILD"))) return cwd;
  return cwd;
}

const WORKSPACE_ROOT = resolveWorkspaceRoot();
const ASSETS_DIR = path.join(WORKSPACE_ROOT, "Attached_Assets");
const REAL_CASES_DIR = path.join(WORKSPACE_ROOT, "real_cases");
const LOG_FILE = path.join(WORKSPACE_ROOT, "ETERNAL_RESEARCH_CHILD", "research_findings.log");
const OUT_FILE = path.join(
  WORKSPACE_ROOT,
  "artifacts",
  "legal-luminaire",
  "src",
  "data",
  "researchImprovements.generated.ts",
);

const TEXT_EXTS = new Set([".md", ".lex", ".txt"]);

function safeRead(filePath: string, maxChars = 1600): string {
  try {
    return fs.readFileSync(filePath, "utf8").slice(0, maxChars);
  } catch {
    return "";
  }
}

function listFiles(dir: string, max = 200): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  const stack = [dir];

  while (stack.length && out.length < max) {
    const current = stack.pop();
    if (!current) continue;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (TEXT_EXTS.has(path.extname(entry.name).toLowerCase())) {
        out.push(fullPath);
      }
    }
  }

  return out;
}

function slug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function classify(filePath: string, text: string): Omit<ImprovementItem, "id" | "source"> | null {
  const name = path.basename(filePath);
  const haystack = `${name}\n${text}`.toLowerCase();

  const activeMatterRisk =
    /\b(save|defend|rescue)\b.*\b(client|accused|party)\b/.test(haystack) ||
    /\bconfidential|privileged|active matter\b/.test(haystack);

  if (activeMatterRisk) {
    return {
      title: "Active-matter safety review",
      kind: "DRAFTING_SAFETY",
      priority: "P0",
      status: "BLOCKED_ACTIVE_MATTER",
      sourceType: filePath.includes("real_cases") ? "precedent" : "asset",
      targetArea: "safe drafting and review queue",
      summary:
        "Potential active-matter or privileged content detected. Convert it into a review checklist, not direct case-specific strategy.",
      reviewGate: "Human counsel must approve any use; generated output must avoid client-saving strategy.",
      labCriteria: [
        "Flags active-matter language before drafting.",
        "Separates factual chronology from advice.",
        "Routes output to counsel review before use.",
      ],
    };
  }

  if (/citation|scc|manupatra|indiankanoon|authority|precedent/.test(haystack)) {
    return {
      title: "Citation and precedent accuracy upgrade",
      kind: "CITATION_ACCURACY",
      priority: "P0",
      status: "NEEDS_SOURCE_CHECK",
      sourceType: filePath.includes("real_cases") ? "precedent" : "asset",
      targetArea: "citation gate and precedent registry",
      summary:
        "Candidate source for improving citation allowlists, status tiers, source URLs, and blocked-from-draft handling.",
      reviewGate: "Do not mark VERIFIED until the citation is checked against an authoritative source.",
      labCriteria: [
        "Each citation has status, source URL, and status note.",
        "Unknown citations remain blocked from draft output.",
        "Paragraph-specific claims are blocked unless paragraph text is verified.",
      ],
    };
  }

  if (/is\s?\d|bis|astm|fidic|cpwd|irc|standard|clause/.test(haystack)) {
    return {
      title: "Standards and clause review",
      kind: "STANDARD_REVIEW",
      priority: "P1",
      status: "NEEDS_SOURCE_CHECK",
      sourceType: filePath.includes("real_cases") ? "precedent" : "asset",
      targetArea: "standards index and verification engine",
      summary:
        "Candidate source for standards coverage, clause mapping, and source-backed forensic or infrastructure checks.",
      reviewGate: "Clause language must be verified against the governing standard before being used as a filing claim.",
      labCriteria: [
        "Standard code, year, title, and clause are recorded.",
        "Scope matches the tested material or contract issue.",
        "Superseded standards are labeled before use.",
      ],
    };
  }

  if (/arbitrat|claim|award|fidic|nhai|contract/.test(haystack)) {
    return {
      title: "Demo case enrichment",
      kind: "DEMO_ENRICHMENT",
      priority: "P1",
      status: "READY_FOR_REVIEW",
      sourceType: filePath.includes("real_cases") ? "precedent" : "asset",
      targetArea: "demo cases and infra arbitration browser",
      summary:
        "Candidate source for richer timelines, claim matrices, contradiction lists, and counsel-review issue outlines.",
      reviewGate: "Keep facts tied to source files and label synthetic/demo material clearly.",
      labCriteria: [
        "Chronology has dated source anchors.",
        "Internal inconsistencies are listed separately.",
        "Review output is framed as an issue outline, not legal advice.",
      ],
    };
  }

  if (/roadmap|action plan|logbook|prompt|workflow/.test(haystack)) {
    return {
      title: "Roadmap and workflow improvement",
      kind: "ROADMAP",
      priority: "P2",
      status: "READY_FOR_REVIEW",
      sourceType: filePath.includes("research_findings") ? "log" : "asset",
      targetArea: "product roadmap and operating procedures",
      summary:
        "Candidate source for backlog items, review procedures, prompt rules, and recurring improvement workflow.",
      reviewGate: "Turn broad ideas into testable product changes with owner, target file, and verification step.",
      labCriteria: [
        "Proposed change has a target area.",
        "Acceptance criteria are binary and reviewable.",
        "No auto-patch is applied to protected legal logic.",
      ],
    };
  }

  return null;
}

function makeSeedItems(): ImprovementItem[] {
  return [
    {
      id: "harvey-lab-client-matter-workspace",
      title: "Harvey LAB guardrails for legal-agent work",
      kind: "HARVEY_LAB_GUARDRAIL",
      priority: "P0",
      status: "READY_FOR_REVIEW",
      source: "https://www.harvey.ai/blog/introducing-harveys-legal-agent-benchmark",
      sourceType: "website",
      targetArea: "improvement lab, review queue, and safe drafting",
      summary:
        "Use LAB concepts as a product rubric: closed matter workspace, reviewable work product, expert binary criteria, and all-pass grading.",
      reviewGate: "Generated work must remain a review artifact for counsel, not case-specific legal advice.",
      labCriteria: [
        "Matter materials are grouped before drafting.",
        "Output is reviewable work product.",
        "Every criterion is pass/fail.",
        "Task is complete only when all required criteria pass.",
      ],
    },
  ];
}

function buildItems(): ImprovementItem[] {
  const sourceFiles = [
    ...listFiles(ASSETS_DIR),
    ...listFiles(REAL_CASES_DIR, 120),
    ...(fs.existsSync(LOG_FILE) ? [LOG_FILE] : []),
  ];

  const generated = sourceFiles
    .map((filePath) => {
      const text = safeRead(filePath);
      const classified = classify(filePath, text);
      if (!classified) return null;
      const rel = path.relative(WORKSPACE_ROOT, filePath).replace(/\\/g, "/");
      return {
        id: `${classified.kind.toLowerCase().replace(/_/g, "-")}-${slug(rel)}`,
        source: rel,
        ...classified,
      } satisfies ImprovementItem;
    })
    .filter((item): item is ImprovementItem => Boolean(item));

  const seen = new Set<string>();
  return [...makeSeedItems(), ...generated]
    .filter((item) => {
      const key = `${item.kind}:${item.source}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 16);
}

function emit(items: ImprovementItem[]) {
  const body = `// Generated by ETERNAL_RESEARCH_CHILD/phase2_improvement_pipeline.ts\n` +
    `// Review before editing by hand.\n\n` +
    `export type ResearchImprovementKind = ${JSON.stringify([
      "HARVEY_LAB_GUARDRAIL",
      "CITATION_ACCURACY",
      "PRECEDENT_REVIEW",
      "STANDARD_REVIEW",
      "DRAFTING_SAFETY",
      "DEMO_ENRICHMENT",
      "ROADMAP",
    ]).replace(/^\[/, "").replace(/\]$/, "").replace(/,/g, " | ")};\n` +
    `export type ResearchImprovementPriority = "P0" | "P1" | "P2";\n` +
    `export type ResearchImprovementStatus = "READY_FOR_REVIEW" | "NEEDS_SOURCE_CHECK" | "BLOCKED_ACTIVE_MATTER";\n\n` +
    `export type ResearchImprovement = {\n` +
    `  id: string;\n` +
    `  title: string;\n` +
    `  kind: ResearchImprovementKind;\n` +
    `  priority: ResearchImprovementPriority;\n` +
    `  status: ResearchImprovementStatus;\n` +
    `  source: string;\n` +
    `  sourceType: "website" | "ebook" | "precedent" | "asset" | "log";\n` +
    `  targetArea: string;\n` +
    `  summary: string;\n` +
    `  reviewGate: string;\n` +
    `  labCriteria: string[];\n` +
    `};\n\n` +
    `export const RESEARCH_IMPROVEMENTS: ResearchImprovement[] = ${JSON.stringify(items, null, 2)};\n`;

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, body, "utf8");
  console.log(`Wrote ${items.length} improvement items to ${path.relative(WORKSPACE_ROOT, OUT_FILE)}`);
}

emit(buildItems());
