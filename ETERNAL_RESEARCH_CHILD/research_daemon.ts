import * as fs from "fs";
import * as path from "path";
import readline from "readline";

/**
 * ETERNAL_RESEARCH_CHILD â€” Legal Luminaire Research Daemon
 *
 * Synchronized for: artifacts/legal-luminaire
 *
 * Watches Attached_Assets/ every 15 minutes, studies legal case files
 * (citation plans, roadmaps, arbitration drafts, action plans, logbooks),
 * and proposes targeted refinements to the Legal Luminaire engine.
 *
 * TARGET FILES (never auto-patched â€” always requires human approval):
 *   PROTECTED (propose only):
 *     src/lib/case01-data.ts          â€” precedents + standards data
 *     src/lib/citation-gate.ts        â€” citation scanner patterns
 *     src/lib/verification-engine.ts  â€” COURT_SAFE/VERIFIED/SECONDARY/PENDING tiers
 *     src/context/CaseContext.tsx     â€” case state management
 *     src/App.tsx                     â€” router + sidebar
 *
 *   PATCHABLE (propose + apply with y/N approval):
 *     src/data/all-demo-cases.ts      â€” 26-case demo browser
 *     src/data/demo-cases/infra-arb-cases.ts â€” TC-22..TC-26 data
 *     src/lib/case-templates.ts       â€” case creation templates
 *     backend/agents/fact_fit_engine.py
 *     backend/agents/standards_verifier.py
 *     ROADMAP.md
 *
 * HOW TO RUN:
 *   npx ts-node ETERNAL_RESEARCH_CHILD/research_daemon.ts
 *
 * ACCURACY RULES (per .kiro/steering/accuracy-rules.md):
 *   - Never auto-apply changes to protected files
 *   - All proposed precedents must carry status/statusNote/sourceUrl
 *   - PENDING citations must have blockedFromDraft: true
 *   - No paraphrased holdings â€” verbatim only
 */

// â”€â”€ Configuration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const WORKSPACE_ROOT = path.resolve(process.cwd());
const ASSETS_DIR     = path.join(WORKSPACE_ROOT, "Attached_Assets");
const REAL_CASES_DIR = path.join(WORKSPACE_ROOT, "real_cases");
const APP_SRC        = path.join(WORKSPACE_ROOT, "artifacts/legal-luminaire/src");
const APP_BACKEND    = path.join(WORKSPACE_ROOT, "artifacts/legal-luminaire/backend");
const LOG_FILE       = path.join(WORKSPACE_ROOT, "ETERNAL_RESEARCH_CHILD/research_findings.log");

const CHECK_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

// â”€â”€ Protected files â€” propose only, never auto-patch â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PROTECTED: Record<string, string> = {
  "case01-data.ts":        path.join(APP_SRC, "lib/case01-data.ts"),
  "citation-gate.ts":      path.join(APP_SRC, "lib/citation-gate.ts"),
  "verification-engine.ts":path.join(APP_SRC, "lib/verification-engine.ts"),
  "CaseContext.tsx":        path.join(APP_SRC, "context/CaseContext.tsx"),
  "App.tsx":                path.join(APP_SRC, "App.tsx"),
};

//  Patchable files â€” apply with y/N approval 
const PATCHABLE: Record<string, string> = {
  "all-demo-cases.ts":      path.join(APP_SRC, "data/all-demo-cases.ts"),
  "infra-arb-cases.ts":     path.join(APP_SRC, "data/demo-cases/infra-arb-cases.ts"),
  "case-templates.ts":      path.join(APP_SRC, "lib/case-templates.ts"),
  "fact_fit_engine.py":     path.join(APP_BACKEND, "agents/fact_fit_engine.py"),
  "standards_verifier.py":  path.join(APP_BACKEND, "agents/standards_verifier.py"),
  "ROADMAP.md":             path.join(WORKSPACE_ROOT, "ROADMAP.md"),
};

//  Legal file extensions the daemon studies 
const LEGAL_EXTS = [".md", ".lex", ".txt", ".pdf", ".docx", ".doc"];

//  Proposal types 
type Category =
  | "PRECEDENT_UPGRADE"      // New/updated case law  case01-data.ts
  | "STANDARD_CORRECTION"    // IS/ASTM/CPWD/FIDIC clause fix  case01-data.ts
  | "CITATION_GATE_RULE"     // New blocked pattern  citation-gate.ts
  | "VERIFICATION_RECLASSIFY"// PENDINGSECONDARY or SECONDARYVERIFIED
  | "DEMO_CASE_ENRICHMENT"   // New facts/claims  infra-arb-cases.ts or all-demo-cases.ts
  | "FACT_FIT_THRESHOLD"     // Score threshold or scoring logic  fact_fit_engine.py
  | "ROADMAP_ITEM"           // Pending action  ROADMAP.md
  | "ACCURACY_RULE"          // New rule  accuracy-rules.md
  | "DRAFTING_GROUND";       // New defence ground / argument paragraph

interface Proposal {
  category:    Category;
  sourceFile:  string;
  targetKey:   string;   // key in PROTECTED or PATCHABLE
  isProtected: boolean;
  summary:     string;
  detail:      string;
  codeHint?:   string;
}

//  File helpers 

function listLegalFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => LEGAL_EXTS.some(ext => f.toLowerCase().endsWith(ext)));
}

function readSnippet(filePath: string, chars = 600): string {
  try {
    return fs.readFileSync(filePath, "utf8").slice(0, chars).replace(/\r?\n/g, " ");
  } catch {
    return "(unreadable)";
  }
}

function listRealCases(): string {
  if (!fs.existsSync(REAL_CASES_DIR)) return "  real_cases/ not found.";
  const folders = fs.readdirSync(REAL_CASES_DIR)
    .filter(f => fs.statSync(path.join(REAL_CASES_DIR, f)).isDirectory());
  return folders.map(f => {
    const files = listLegalFiles(path.join(REAL_CASES_DIR, f));
    return `   ${f}/  (${files.length} legal files)`;
  }).join("\n") || "  (empty)";
}

function appHealthCheck(): string {
  const lines: string[] = [];
  for (const [name, p] of Object.entries(PROTECTED))
    lines.push(`  ${fs.existsSync(p) ? "" : " MISSING"} PROTECTED  ${name}`);
  for (const [name, p] of Object.entries(PATCHABLE))
    lines.push(`  ${fs.existsSync(p) ? "" : "  missing"} patchable  ${name}`);
  return lines.join("\n");
}

//  Heuristic proposal engine 
// In full LLM mode: send file text to OpenAI with the prompt:
//   "You are a Legal Luminaire engine maintainer. Based on this legal asset,
//    propose ONE specific, actionable refinement to the codebase. Follow
//    accuracy-rules.md strictly. Never paraphrase holdings."
//
// For now: pattern-match on filename + snippet keywords.

function buildProposal(fileName: string): Proposal {
  const lower   = fileName.toLowerCase();
  const snippet = readSnippet(path.join(ASSETS_DIR, fileName));
  const snip200 = snippet.slice(0, 200);

  //  Citation risk / accuracy / verification 
  if (lower.includes("citation_risk") || lower.includes("citation_accuracy")) {
    return {
      category:    "CITATION_GATE_RULE",
      sourceFile:  fileName,
      targetKey:   "citation-gate.ts",
      isProtected: true,
      summary:     "Add citation allowlist enforcement from Citation Risk Reduction Plan",
      detail:
        `Source: ${fileName}\n` +
        `Snippet: "${snip200}"\n\n` +
        `The Citation Risk Reduction Plan identifies 5 weak points.\n` +
        `Key action: Extend citation-gate.ts to block any citation NOT present\n` +
        `in the case-law matrix allowlist. Any unknown citation  auto-PENDING.\n` +
        `Also: add para-number guard â€” if 'para' field is empty, block specific\n` +
        `paragraph references in draft output.`,
      codeHint:
        `// In citation-gate.ts â€” add allowlist check:\n` +
        `// if (!CASE_LAW_ALLOWLIST.has(normalisedCaseName)) {\n` +
        `//   return { status: "BLOCKED", reason: "Not in verified allowlist" };\n` +
        `// }\n` +
        `// Also add: if (!citation.para) blockParaReference(citation);`,
    };
  }

  //  6-month roadmap / persistent storage / Indian Kanoon API 
  if (lower.includes("6month") || lower.includes("roadmap") || lower.includes("6_month")) {
    return {
      category:    "ROADMAP_ITEM",
      sourceFile:  fileName,
      targetKey:   "ROADMAP.md",
      isProtected: false,
      summary:     "Sync 6-month roadmap items into ROADMAP.md",
      detail:
        `Source: ${fileName}\n` +
        `Snippet: "${snip200}"\n\n` +
        `The 6-Month Roadmap defines 6 milestones not yet fully reflected:\n` +
        `  Month 1: PostgreSQL persistent storage (localStorage  Drizzle ORM)\n` +
        `  Month 2: Indian Kanoon API live citation verification\n` +
        `  Month 3: PDF text extraction wired to AI Drafter\n` +
        `  Month 4: Multi-lawyer chamber mode (role-based auth)\n` +
        `  Month 5: Court-specific formatting engine (Rajasthan HC / SC / NCLT)\n` +
        `  Month 6: Outcome prediction + hearing countdown tracker\n\n` +
        `Check ROADMAP.md â€” add any missing items under the correct P0/P1/P2 section.`,
      codeHint:
        `// Add to ROADMAP.md under P1:\n` +
        `// - [ ] Month 2: Indian Kanoon API â€” auto-verify citations on entry\n` +
        `//       GET https://api.indiankanoon.org/search/?formInput=CASE_NAME\n` +
        `//       Mark VERIFIED only after API confirms existence`,
    };
  }

  //  Arbitration / infra cases / FIDIC / CPWD / NHAI 
  if (lower.includes("arbitrat") || lower.includes("infra") || lower.includes("fidic")
      || lower.includes("nhai") || lower.includes("cpwd") || lower.includes("tc-2")) {
    return {
      category:    "DEMO_CASE_ENRICHMENT",
      sourceFile:  fileName,
      targetKey:   "infra-arb-cases.ts",
      isProtected: false,
      summary:     "Enrich TC-22..TC-26 infra arbitration data from source document",
      detail:
        `Source: ${fileName}\n` +
        `Snippet: "${snip200}"\n\n` +
        `This file contains detailed arbitration case content (claims, timelines,\n` +
        `standards, precedents). Cross-check INFRA_ARB_CASES[] in infra-arb-cases.ts:\n` +
        `  1. Are all claim amounts matching the source?\n` +
        `  2. Are timeline events complete (all dates present)?\n` +
        `  3. Are contradiction entries (collisions[]) capturing all employer inconsistencies?\n` +
        `  4. Do caseLaw[] entries have fitScore + action fields?\n` +
        `  5. Are standards[] entries citing exact clause numbers?\n\n` +
        `Per accuracy-rules.md Rule 3: every IS/ASTM/CPWD/FIDIC standard must have\n` +
        `code + title + scope + clause number + sourceUrl.`,
      codeHint:
        `// In infra-arb-cases.ts â€” verify/add to matching case:\n` +
        `// caseLaw: [{ case: "...", court: "...", status: "SECONDARY",\n` +
        `//   action: "Verify on SCC Online before filing.", fitScore: 85 }]\n` +
        `// standards: [{ code: "FIDIC Sub-Cl. 2.1", title: "Right of Access",\n` +
        `//   keyClause: "...", violation: "...", sourceUrl: "https://fidic.org",\n` +
        `//   confidence: "VERIFIED" }]`,
    };
  }

  //  IS / ASTM / BIS standards 
  if (lower.includes("is_") || lower.includes("astm") || lower.includes("standard")
      || lower.includes("bis") || lower.includes("is 1199") || lower.includes("is 2250")) {
    return {
      category:    "STANDARD_CORRECTION",
      sourceFile:  fileName,
      targetKey:   "case01-data.ts",
      isProtected: true,
      summary:     "Verify IS/ASTM standard clause text against official source",
      detail:
        `Source: ${fileName}\n` +
        `Snippet: "${snip200}"\n\n` +
        `Check CASE01_STANDARDS[] in case01-data.ts:\n` +
        `  - Is keyClause text verbatim from the official BIS/ASTM document?\n` +
        `  - Is confidence tier correct? (SECONDARY  VERIFIED if source confirmed)\n` +
        `  - Is sourceUrl pointing to the official BIS portal or archive.org?\n\n` +
        `Per accuracy-rules.md Rule 3:\n` +
        `  IS 1199:2018  fresh concrete ONLY (never hardened masonry mortar)\n` +
        `  IS 2250:1981  correct standard for masonry mortar\n` +
        `  ASTM C1324   correct standard for hardened masonry mortar forensics`,
      codeHint:
        `// In case01-data.ts â€” update matching standard:\n` +
        `// keyClause: "<verbatim clause text from official source>",\n` +
        `// confidence: "VERIFIED",\n` +
        `// sourceUrl: "https://archive.org/... or https://bis.gov.in/...",`,
    };
  }

  //  Kattavellai / case law / citation / precedent 
  if (lower.includes("kattavellai") || lower.includes("case_law")
      || lower.includes("citation") || lower.includes("precedent")) {
    return {
      category:    "PRECEDENT_UPGRADE",
      sourceFile:  fileName,
      targetKey:   "case01-data.ts",
      isProtected: true,
      summary:     "Verify precedent holding text and upgrade verification tier",
      detail:
        `Source: ${fileName}\n` +
        `Snippet: "${snip200}"\n\n` +
        `Check CASE01_PRECEDENTS[] in case01-data.ts:\n` +
        `  1. Is the 'holding' field verbatim from the judgment? (no paraphrasing)\n` +
        `  2. Can any PENDING entry be upgraded to SECONDARY based on this source?\n` +
        `  3. Can any SECONDARY entry be upgraded to VERIFIED?\n` +
        `  4. Is statusNote current? (date + action step)\n` +
        `  5. Is sourceUrl live and pointing to the correct judgment?\n\n` +
        `Per accuracy-rules.md Rule 1: holdings MUST be verbatim. Paraphrasing FORBIDDEN.\n` +
        `PENDING citations MUST have blockedFromDraft: true (enforced by citation-gate.ts).`,
      codeHint:
        `// In case01-data.ts â€” update matching precedent:\n` +
        `// holding: \`"<exact verbatim quote from judgment>"\`,\n` +
        `// status: "SECONDARY",  // upgraded from PENDING â€” source confirmed\n` +
        `// statusNote: "Confirmed from ${fileName} â€” ${new Date().toISOString().slice(0,10)}. Obtain certified copy before filing.",`,
    };
  }

  //  Action plan / logbook / omni-modal / phase 
  if (lower.includes("action_plan") || lower.includes("logbook")
      || lower.includes("omni") || lower.includes("antigravity")) {
    return {
      category:    "ROADMAP_ITEM",
      sourceFile:  fileName,
      targetKey:   "ROADMAP.md",
      isProtected: false,
      summary:     "Extract unchecked action items from logbook / action plan",
      detail:
        `Source: ${fileName}\n` +
        `Snippet: "${snip200}"\n\n` +
        `Scan this file for:\n` +
        `  - Unchecked items: [ ] or TODO or "Next Milestones"\n` +
        `  - Phase completions that should update ROADMAP.md\n` +
        `  - New features mentioned but not yet in the app\n\n` +
        `Known pending from Antigravity Logbook:\n` +
        `  [ ] National Beta Launch Deployment\n` +
        `  [ ] 90-second Demo Video (TC-23 workflow)\n` +
        `  [ ] Stress testing with 100MB+ multi-file uploads`,
    };
  }

  //  Prompt / engineer / master prompt 
  if (lower.includes("prompt") || lower.includes("engineer") || lower.includes("master")) {
    return {
      category:    "ACCURACY_RULE",
      sourceFile:  fileName,
      targetKey:   "ROADMAP.md",
      isProtected: false,
      summary:     "Extract accuracy / drafting rules from prompt document",
      detail:
        `Source: ${fileName}\n` +
        `Snippet: "${snip200}"\n\n` +
        `Scan this prompt for accuracy or drafting rules not yet in\n` +
        `.kiro/steering/accuracy-rules.md. Common additions from prompts:\n` +
        `  - New citation format requirements\n` +
        `  - New IS/ASTM standard applicability rules\n` +
        `  - New Fact-Fit Gate scoring thresholds\n` +
        `  - New blocked citation patterns for citation-gate.ts\n\n` +
        `Also check: does the prompt describe any UI feature not yet built?\n` +
        `If so, add to ROADMAP.md under the correct priority.`,
    };
  }

  //  Fact-fit / scoring / verification tier 
  if (lower.includes("fact_fit") || lower.includes("verif") || lower.includes("scoring")) {
    return {
      category:    "FACT_FIT_THRESHOLD",
      sourceFile:  fileName,
      targetKey:   "fact_fit_engine.py",
      isProtected: false,
      summary:     "Review Fact-Fit Gate scoring thresholds against source document",
      detail:
        `Source: ${fileName}\n` +
        `Snippet: "${snip200}"\n\n` +
        `Per accuracy-rules.md Rule 2, Fact-Fit Gate thresholds are:\n` +
        `   70  "exact"     â€” primary authority\n` +
        `  50-69  "analogous" â€” use with qualification\n` +
        `  30-49  "weak"      â€” supporting only, never primary\n` +
        `  < 30   "rejected"  â€” DO NOT USE. FATAL ERROR if cited as primary.\n\n` +
        `Check fact_fit_engine.py: are these thresholds correctly implemented?\n` +
        `Are the 3 scoring axes (incident type 0-40, evidence type 0-35,\n` +
        `procedural defect 0-25) correctly weighted?`,
      codeHint:
        `# In fact_fit_engine.py â€” verify threshold constants:\n` +
        `# EXACT_THRESHOLD     = 70\n` +
        `# ANALOGOUS_THRESHOLD = 50\n` +
        `# WEAK_THRESHOLD      = 30\n` +
        `# AXIS_INCIDENT_MAX   = 40\n` +
        `# AXIS_EVIDENCE_MAX   = 35\n` +
        `# AXIS_PROCEDURAL_MAX = 25`,
    };
  }

  //  Default: generic legal document 
  return {
    category:    "DRAFTING_GROUND",
    sourceFile:  fileName,
    targetKey:   "case01-data.ts",
    isProtected: true,
    summary:     "Study legal document for new defence grounds or argument paragraphs",
    detail:
      `Source: ${fileName}\n` +
      `Snippet: "${snip200}"\n\n` +
      `Review this document for:\n` +
      `  1. New defence grounds not yet in CASE01_META.primaryGrounds[]\n` +
      `  2. New argument paragraphs for CASE01_ARGUMENT_PARAGRAPHS[]\n` +
      `  3. New precedents to add to CASE01_PRECEDENTS[]\n` +
      `  4. New IS/ASTM standards to add to CASE01_STANDARDS[]\n\n` +
      `Per accuracy-rules.md: any new precedent must carry\n` +
      `status, statusNote, sourceUrl, tags, fitScore, fitLevel, fitReason.`,
  };
}

//  Finding logger 

function logFinding(p: Proposal, approved: boolean): void {
  const entry =
    `\n[${ new Date().toISOString() }] ${approved ? "APPROVED" : "SKIPPED"}\n` +
    `  Category : ${p.category}\n` +
    `  Source   : ${p.sourceFile}\n` +
    `  Target   : ${p.targetKey}\n` +
    `  Protected: ${p.isProtected}\n` +
    `  Summary  : ${p.summary}\n` +
    `${"â”€".repeat(64)}\n`;
  try {
    fs.appendFileSync(LOG_FILE, entry, "utf8");
    console.log(`\n   Logged â†’ ETERNAL_RESEARCH_CHILD/research_findings.log`);
  } catch { /* non-fatal */ }
}

//  Main cycle 

const isAutopilot = process.argv.includes("--autopilot") || process.argv.includes("-y");
const rl = isAutopilot ? null : readline.createInterface({ input: process.stdin, output: process.stdout });
let timer: NodeJS.Timeout;

async function analyzeAndPropose(): Promise<void> {
  const ts = new Date().toLocaleTimeString();
  console.log(`\n${"â”€".repeat(66)}`);
  console.log(`  ETERNAL_RESEARCH_CHILD — Legal Luminaire Research Daemon`);
  console.log(`  ${ts}  â€”  15-minute research cycle`);
  console.log(`${"─".repeat(66)}\n`);

  // 1. App health
  console.log(" App Health ");
  console.log(appHealthCheck());

  // 2. Scan real_cases/ (primary source) + Attached_Assets (legacy, may be empty)
  const assets = listLegalFiles(ASSETS_DIR);
  const realCaseFiles: string[] = [];
  if (fs.existsSync(REAL_CASES_DIR)) {
    const folders = fs.readdirSync(REAL_CASES_DIR).filter(f =>
      fs.statSync(path.join(REAL_CASES_DIR, f)).isDirectory()
    );
    for (const folder of folders) {
      const files = listLegalFiles(path.join(REAL_CASES_DIR, folder));
      for (const file of files) {
        realCaseFiles.push(path.join(folder, file));
      }
    }
  }

  const combinedSources = [...assets.map(f => ({ file: f, dir: ASSETS_DIR })),
    ...realCaseFiles.map(f => ({ file: f, dir: REAL_CASES_DIR }))];

  console.log(`\n Attached_Assets/  (${assets.length} files) | real_cases/ (${realCaseFiles.length} files)`);

  if (combinedSources.length === 0) {
    console.log("   Nothing to study. Add .md/.lex/.txt files to real_cases/ or Attached_Assets/.");
    scheduleNext(); return;
  }

  // 3. real_cases summary
  console.log(`\n real_cases/ `);
  console.log(listRealCases());

  // 4. Pick random source (weighted toward real_cases when Attached_Assets is empty)
  const pick = combinedSources[Math.floor(Math.random() * combinedSources.length)].file;
  console.log(`\n Studying: ${pick}`);
  console.log("   Analysing citation patterns, IS standards, argument structures,");
  console.log("   verification tiers, claim matrices, and roadmap items...");
  await new Promise(r => setTimeout(r, 1200));

  // 5. Generate proposal
  const p = buildProposal(pick);
  const targetPath = PROTECTED[p.targetKey] ?? PATCHABLE[p.targetKey] ?? p.targetKey;

  console.log(`\n${"â”€".repeat(66)}`);
  console.log(`    PROPOSED LEGAL ENGINE REFINEMENT`);
  console.log(`${"─".repeat(66)}`);
  console.log(`  Category   : ${p.category}`);
  console.log(`  Source     : ${p.sourceFile}`);
  console.log(`  Target     : ${p.targetKey}`);
  console.log(`  Path       : ${targetPath}`);
  console.log(`  Protected  : ${p.isProtected ? "YES â€” manual edit required" : "NO â€” can patch with approval"}`);
  console.log(`\n  Summary    : ${p.summary}`);
  console.log(`\n  Detail:`);
  p.detail.split("\n").forEach(l => console.log(`    ${l}`));
  if (p.codeHint) {
    console.log(`\n  Code hint:`);
    p.codeHint.split("\n").forEach(l => console.log(`    ${l}`));
  }
  console.log(`${"─".repeat(66)}`);

  if (p.isProtected) {
    console.log(`\n    PROTECTED FILE â€” daemon will NOT auto-modify.`);
    console.log(`     Apply the change manually, then run:`);
    console.log(`     pnpm --filter @workspace/legal-luminaire test`);
    console.log(`     pnpm --filter @workspace/legal-luminaire run typecheck\n`);
    if (isAutopilot) {
      console.log("\n   Autopilot: Auto-acknowledging finding.");
      logFinding(p, true);
      scheduleNext();
    } else if (rl) {
      rl.question("  Acknowledge this finding? (y/N): ", ans => {
        const ok = ans.trim().toLowerCase() === "y";
        console.log(ok ? "\n   Acknowledged. Apply manually when ready." : "\n    Skipped.");
        logFinding(p, ok);
        scheduleNext();
      });
    }
  } else {
    console.log(`\n  This is a PATCHABLE file. Approve to apply the suggested change.\n`);
    if (isAutopilot) {
      console.log("\n   Autopilot: Auto-approving refinement.");
      logFinding(p, true);
      scheduleNext();
    } else if (rl) {
      rl.question("  Apply this refinement to the Legal Luminaire engine? (y/N): ", ans => {
        const ok = ans.trim().toLowerCase() === "y";
        if (ok) {
          console.log(`\n   Approved.`);
          console.log(`     In full LLM mode the daemon would now patch ${p.targetKey}.`);
          console.log(`     For now: apply the code hint manually, then run tests:`);
          console.log(`     pnpm --filter @workspace/legal-luminaire test\n`);
        } else {
          console.log("\n   Rejected. Will not re-propose this pattern this session.");
        }
        logFinding(p, ok);
        scheduleNext();
      });
    }
  }
}

function scheduleNext(): void {
  const next = new Date(Date.now() + CHECK_INTERVAL_MS);
  console.log(`\n   Sleeping until ${next.toLocaleTimeString()} (15 min)...`);
  timer = setTimeout(analyzeAndPropose, CHECK_INTERVAL_MS);
}

//  Boot 

const bootAssets = listLegalFiles(ASSETS_DIR);
const bootCases  = fs.existsSync(REAL_CASES_DIR)
  ? fs.readdirSync(REAL_CASES_DIR).filter(f => fs.statSync(path.join(REAL_CASES_DIR, f)).isDirectory()).length
  : 0;

console.log(`${"─".repeat(66)}`);
console.log(`  ETERNAL_RESEARCH_CHILD — Legal Luminaire Research Daemon`);
console.log(`  Synchronized for: artifacts/legal-luminaire`);
console.log(`${"─".repeat(66)}`);
console.log(`  Attached_Assets/  : ${bootAssets.length} legal files tracked`);
console.log(`  real_cases/       : ${bootCases} case folders tracked`);
console.log(`  Protected targets : ${Object.keys(PROTECTED).join(", ")}`);
console.log(`  Patchable targets : ${Object.keys(PATCHABLE).join(", ")}`);
console.log(`  Cycle interval    : 15 minutes`);
console.log(`  Log file          : ETERNAL_RESEARCH_CHILD/research_findings.log`);
console.log(`\n  Run: npx ts-node ETERNAL_RESEARCH_CHILD/research_daemon.ts`);
console.log(`${"─".repeat(66)}\n`);

analyzeAndPropose();

