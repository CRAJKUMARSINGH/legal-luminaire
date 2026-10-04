/**
 * CASE_01 — Hemraj Vardar (Stadium Wall Collapse) as a data-layer record.
 *
 * Source of truth for the content remains `data/caseData.ts` + `lib/case01-data.ts`
 * (those files are shared with the drafting pages). This module only *adapts* them into
 * the `CaseRecord` shape so that every case-scoped view reads from the selected case
 * instead of importing Hemraj data directly.
 *
 * Loaded through Demo Mode → labelled SYNTHETIC / DEMO (`isDemo: true`).
 */
import type { CaseRecord } from "@/lib/case-store";
import { DEFAULT_CASE_ID } from "@/lib/case-store";
import {
  caseInfo, timelineEvents, caseLawMatrix, standardsMatrix, caseDocuments,
} from "@/data/caseData";
import { CASE01_META } from "@/lib/case01-data";
import { commonSection } from "@/data/defenceData";

export const HEMRAJ_DEMO_ID = "TC-01";

const STRATEGY_PILLARS: Array<{ title: string; description: string }> = [
  { title: "Chain-of-custody gaps in forensic sampling", description: "No custody register from collection → sealing → dispatch → lab receipt (Kattavellai 2025 INSC 845 guidelines)." },
  { title: "Weather contamination during sample collection", description: "Rain-time sampling; ASTM C780 §6.1 invalidates moisture-exposed samples." },
  { title: "Absence of contractor representation", description: "Ex-parte sampling — IS 3535:1986 Cl. 4.1 and CPWD Manual require contractor presence." },
  { title: "Non-representative / haphazard sampling method", description: "No documented sampling protocol or panchnama." },
  { title: "FSL report foundation challenge", description: "IS 1199:2018 (fresh concrete) applied to hardened masonry mortar — wrong standard." },
  { title: "BIS/IS procedural non-compliance", description: "IS 2250 / ASTM C1324 carbonated-layer removal ignored." },
];

function kbToBytes(size: string): number {
  const n = parseFloat(size);
  return Number.isFinite(n) ? Math.round(n * 1024) : 0;
}

function applicabilityOf(proposition: string): "correct" | "wrong" | "partial" {
  const p = proposition.toUpperCase();
  if (p.startsWith("WRONG")) return "wrong";
  if (p.startsWith("CORRECT")) return "correct";
  return "partial";
}

function splitPrayer(text: string): string[] {
  return text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => /^\d+\./.test(l));
}

export function buildHemrajCaseRecord(id: string = DEFAULT_CASE_ID): CaseRecord {
  const now = new Date().toISOString();
  return {
    id,
    title: `[DEMO] ${caseInfo.title} — Hemraj Vardar`,
    court: CASE01_META.court,
    caseNo: CASE01_META.caseNo,
    brief: caseInfo.summary,
    createdAt: now,
    files: [
      { name: "Annexure_A_IS_1199_2018_Scope_Clause_1_Fresh_Concrete_Only.pdf", size: kbToBytes("180 KB"), type: "application/pdf" },
      { name: "Annexure_B_IS_2250_1981_Title_Page_Masonry_Mortar_Correct_Standard.pdf", size: kbToBytes("95 KB"), type: "application/pdf" },
      { name: "Annexure_C_ASTM_C1324_Sections_7_8_Carbonated_Layer_Removal.pdf", size: kbToBytes("240 KB"), type: "application/pdf" },
      { name: "Annexure_D_Tomaso_Bruno_v_State_UP_2015_7_SCC_178_Expert_Evidence.pdf", size: kbToBytes("620 KB"), type: "application/pdf" },
      { name: "Annexure_E_Kattavellai_Devakar_2025_INSC_845_Chain_of_Custody.pdf", size: kbToBytes("510 KB"), type: "application/pdf" },
      { name: "Annexure_F_State_Maharashtra_v_Damu_2000_6_SCC_269_Panchnama.pdf", size: kbToBytes("380 KB"), type: "application/pdf" },
      { name: "Annexure_G_Surendra_Koli_v_State_UP_SC_November_2025_Chain_Custody.pdf", size: kbToBytes("490 KB"), type: "application/pdf" },
      { name: "Annexure_H_Uttarakhand_HC_March_2026_Chain_Custody_Forensic_Evidence.pdf", size: kbToBytes("560 KB"), type: "application/pdf" },
      { name: "Annexure_I_IS_3535_1986_Clause_4_1_Contractor_Representative_Mandatory.pdf", size: kbToBytes("140 KB"), type: "application/pdf" },
      { name: "Annexure_J_IS_3535_1986_Clause_5_7_5_Three_Way_Split_Referee_Sample.pdf", size: kbToBytes("155 KB"), type: "application/pdf" },
      { name: "Annexure_K_State_Punjab_v_Baldev_Singh_1999_6_SCC_172_Mandatory_Procedure.pdf", size: kbToBytes("430 KB"), type: "application/pdf" },
      { name: "Annexure_L_CPWD_Manual_Sections_3_7_4_and_12_2_1_Contractor_Presence.pdf", size: kbToBytes("310 KB"), type: "application/pdf" },
      { name: "Annexure_M_IS_4031_Part6_Clause_5_1_Temperature_27_Celsius_Mandatory.pdf", size: kbToBytes("210 KB"), type: "application/pdf" },
      { name: "Annexure_N_ASTM_C1324_Full_Standard_Hardened_Masonry_Mortar_Forensics.pdf", size: kbToBytes("1,820 KB"), type: "application/pdf" },
      { name: "Annexure_O_IS_2250_1981_Clause_5_2_Weather_Protection_Sampling.pdf", size: kbToBytes("130 KB"), type: "application/pdf" },
      { name: "Annexure_P_Sushil_Sharma_v_State_NCT_Delhi_2014_4_SCC_317_Expert_Opinion.pdf", size: kbToBytes("540 KB"), type: "application/pdf" },
      { name: "Annexure_Q_CJ_Christopher_Signi_v_State_TN_2025_SCC_OnLine_Mad_3214.pdf", size: kbToBytes("470 KB"), type: "application/pdf" },
      { name: "Annexure_R_NBC_2016_Section_3_4_Force_Majeure_Extreme_Weather.pdf", size: kbToBytes("280 KB"), type: "application/pdf" },
      { name: "Annexure_S_Rajasthan_HC_Suo_Motu_PIL_Orders_29July2025_23August2025.pdf", size: kbToBytes("680 KB"), type: "application/pdf" },
      { name: "Annexure_T_RSMML_v_Contractor_Rajasthan_HC_Division_Bench_30March2026.pdf", size: kbToBytes("720 KB"), type: "application/pdf" },
      { name: "Annexure_U_Jacob_Mathew_v_State_Punjab_2005_6_SCC_1_Para48_Negligence.pdf", size: kbToBytes("390 KB"), type: "application/pdf" },
      { name: "Annexure_V_IS_13311_Parts_1_2_NDT_UPV_Rebound_Hammer_Existing_Structures.pdf", size: kbToBytes("960 KB"), type: "application/pdf" },
      { name: "Annexure_W_Union_India_v_Prafulla_Kumar_Samal_1979_3_SCC_4_Para10.pdf", size: kbToBytes("330 KB"), type: "application/pdf" },
      { name: "Annexure_X_State_Bihar_v_Ramesh_Singh_1977_4_SCC_39_Para5_Discharge.pdf", size: kbToBytes("305 KB"), type: "application/pdf" },
      { name: "DISCHARGE_APPLICATION_HEMRAJ_v5_PRINT.html", size: kbToBytes("420 KB"), type: "text/html" },
      { name: "DISCHARGE_APPLICATION_HEMRAJ_v5.pdf", size: kbToBytes("1,240 KB"), type: "application/pdf" },
    ],
    isDemo: true,
    sourceDemoId: HEMRAJ_DEMO_ID,
    case_type: "discharge",
    status: caseInfo.status,
    filing_date: "2025-01-01",
    charges: ["IPC §304A", "IPC §337", "IPC §338", "PC Act §13(1)(d)", "IPC §120B"],
    parties: [
      { name: CASE01_META.accused, role: "accused", lawyer: "Defence Counsel", address: CASE01_META.accusedDesignation },
      { name: "State of Rajasthan", role: "complainant" },
    ],
    accused_names: [CASE01_META.accused],
    citations: caseLawMatrix.map((c, i) => ({
      id: `cit-${i + 1}`,
      caseName: c.case,
      citation: c.case,
      court: c.court,
      holding: c.useForDefence,
      status: c.status,
      blockedFromDraft: c.status === "PENDING",
    })),
    caseLaw: caseLawMatrix.map((c) => ({ ...c })),
    timeline: timelineEvents.map((e) => ({ ...e })),
    standards: standardsMatrix.map((s) => ({
      code: s.standard,
      title: s.standard,
      applicability: applicabilityOf(s.proposition),
      keyClause: s.proposition,
      violation: s.caseFact,
      confidence: s.confidence,
    })),
    documents: caseDocuments.map((d, i) => ({
      id: `doc-${i + 1}`,
      name: d.name,
      type: d.type,
      status: "VERIFIED",
      size: kbToBytes(d.size),
      uploadedAt: now,
    })),
    strategy: STRATEGY_PILLARS.map((p, i) => ({
      id: `s${i + 1}`,
      title: p.title,
      description: p.description,
      status: "ACTIVE",
      priority: i < 3 ? "HIGH" : "MEDIUM",
    })),
    prayerClauses: splitPrayer(commonSection.prayerEn),
    verificationBlocks: CASE01_META.primaryGrounds.map((g, i) => ({
      id: `vb-${i + 1}`,
      claim: g,
      status: i < 5 ? "VERIFIED" : "SECONDARY",
      evidence: "VERIFIED_DEEP_RESEARCH_DEFENCE_PACK.md / WRITTEN_SUBMISSION_RHC_FINAL_v3.lex",
      blockedFromDraft: false,
    })),
    metadata: {
      category: "Criminal — Forensic Defence",
      complexity: "ADVANCED",
      estimatedDuration: "6-12 months",
      requiredResources: ["IS 2250:1981", "ASTM C1324", "ASTM C780", "ISO/IEC 17025 (NABL)"],
    },
  };
}
