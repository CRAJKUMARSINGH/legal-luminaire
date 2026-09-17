/**
 * Monorepo paths (relative to LEGAL_LUMINAIRE root) for linking UI to on-disk packs.
 * - real_cases/ — Hemraj, Pitambara, infra arbitration document bundles
 * - sample_cases/ — synthetic TC specs (functional / edge / stress / showcase),
 *   test fixtures, marketing collateral, and misc templates
 */
export const SAMPLE_CASE_LIBRARY_ROOT = "sample_cases";

/** Full document pack folder for a demo card id (TC-01, TC-22 … TC-26). */
export const REPO_PACK_BY_DEMO_ID: Partial<Record<string, string>> = {
  // Flagship Cases
  "TC-01": "real_cases/CASE01_HEMRAJ_STATE_2025",

  // Infrastructure Arbitration (TC-22 to TC-26)
  "TC-22": "real_cases/INFRA_ARB_01_BUILDING_HOSPITAL_2026",
  "TC-23": "real_cases/INFRA_ARB_02_ROAD_HIGHWAY_2026",
  "TC-24": "real_cases/INFRA_ARB_03_DAM_IRRIGATION_2026",
  "TC-25": "real_cases/INFRA_ARB_04_ELECTRICAL_SUBSTATION_2026",
  "TC-26": "real_cases/INFRA_ARB_05_LANDSCAPE_TOWNSHIP_2026",

  // Serious Criminal Matters (TC-27 to TC-31)
  "TC-27": "real_cases/CRIM_01_MURDER_SESSIONS_2026",
  "TC-28": "real_cases/CRIM_02_ATTEMPT_MURDER_2026",
  "TC-29": "real_cases/CRIM_03_RAPE_SESSIONS_2026",
  "TC-30": "real_cases/CRIM_04_POCSO_SPECIAL_2026",
  "TC-31": "real_cases/CRIM_05_MURDER_CONSPIRACY_2026",

  // Financial Crime & Economic Offences (TC-32 to TC-36)
  "TC-32": "real_cases/FIN_01_BANK_FRAUD_2026",
  "TC-33": "real_cases/FIN_02_INVESTMENT_SCAM_2026",
  "TC-34": "real_cases/FIN_03_CORPORATE_FRAUD_2026",
  "TC-35": "real_cases/FIN_04_DIGITAL_FRAUD_2026",
  "TC-36": "real_cases/FIN_05_INSURANCE_FRAUD_2026",

  // Civil Disputes (TC-72 to TC-86)
  "TC-72": "real_cases/CIVIL_01_TITLE_DECLARATION_2026",
  "TC-73": "real_cases/CIVIL_02_POSSESSION_RECOVER_2026",
  "TC-74": "real_cases/CIVIL_03_SPECIFIC_PERFORMANCE_2026",
  "TC-75": "real_cases/CIVIL_04_INJUNCTION_2026",
  "TC-76": "real_cases/CIVIL_05_PARTITION_2026",
  "TC-77": "real_cases/CIVIL_06_MONEY_RECOVERY_2026",
  "TC-78": "real_cases/CIVIL_07_PARTNERSHIP_2026",
  "TC-79": "real_cases/CIVIL_08_MORTGAGE_2026",
  "TC-80": "real_cases/CIVIL_09_LANDLORD_TENANT_2026",
  "TC-81": "real_cases/CIVIL_10_BUILDER_BUYER_2026",
  "TC-82": "real_cases/CIVIL_11_SUCCESSION_2026",
  "TC-83": "real_cases/CIVIL_12_TORT_DAMAGES_2026",
  "TC-84": "real_cases/CIVIL_13_EASEMENT_2026",
  "TC-85": "real_cases/CIVIL_14_CONSUMER_2026",
  "TC-86": "real_cases/CIVIL_15_HYBRID_CIVIL_CRIMINAL_2026",
};

export function syntheticSpecHint(demoId: string): string {
  return `${SAMPLE_CASE_LIBRARY_ROOT}/ — spec for ${demoId} (functional / edge / stress / showcase)`;
}
