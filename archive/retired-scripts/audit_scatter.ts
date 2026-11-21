import { Project } from "ts-morph";
import * as fs from "fs";
import * as path from "path";

// Configuration: directories to scan
const dirs = [
  path.resolve(__dirname, "../src"),
  path.resolve(__dirname, "../backend"),
];

const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, "../tsconfig.json"),
  skipAddingFilesFromTsConfig: true,
});

// Recursively add .ts/.tsx files from given directories
function addSourceFilesFromDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      addSourceFilesFromDir(fullPath);
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      project.addSourceFileAtPath(fullPath);
    }
  }
}

dirs.forEach(addSourceFilesFromDir);

// Map function signatures to their source locations
interface FuncInfo {
  file: string;
  start: number;
  end: number;
  text: string;
}

const signatureMap: Map<string, FuncInfo[]> = new Map();

project.getSourceFiles().forEach((sourceFile) => {
  sourceFile.getFunctions().forEach((func) => {
    const signature = func.getSignature().getText();
    const text = func.getBodyText() ?? "";
    const key = signature + "|" + text.trim();
    const info: FuncInfo = {
      file: sourceFile.getFilePath(),
      start: func.getStartLineNumber(),
      end: func.getEndLineNumber(),
      text: text.trim(),
    };
    const list = signatureMap.get(key) ?? [];
    list.push(info);
    signatureMap.set(key, list);
  });
});

// Generate report of duplicates
const duplicates = Array.from(signatureMap.entries()).filter(([, list]) => list.length > 1);

if (duplicates.length === 0) {
  console.log("No duplicate functions found.");
} else {
  const reportLines: string[] = [];
  reportLines.push("Duplicate Function Report");
  reportLines.push("==========================");
  duplicates.forEach(([key, list]) => {
    reportLines.push("\n---");
    reportLines.push(`Occurrences (${list.length}):`);
    list.forEach((info) => {
      reportLines.push(`- ${info.file}:${info.start}-${info.end}`);
    });
  });
  const report = reportLines.join("\n");
  const outPath = path.resolve(__dirname, "../audit_scatter_report.txt");
  fs.writeFileSync(outPath, report);
  console.log(`Audit report written to ${outPath}`);
}
