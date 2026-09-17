/**
 * Extended cases schema — 6-Month Roadmap additions
 *
 * Month 1: next_hearing_date for countdown
 * Month 4: assigned_role for chamber mode
 * Month 6: probability_score for outcome assessment
 *
 * This file adds to the existing casesTable without breaking it.
 * Apply via: pnpm drizzle-kit push (when DATABASE_URL is set).
 */
import { pgTable, serial, text, timestamp, date, integer, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/** Extended case record — includes hearing, role, probability fields. */
export const casesExtendedTable = pgTable("cases_extended", {
  id: serial("id").primaryKey(),
  /** FK to casesTable.id */
  caseId: integer("case_id").notNull().unique(),

  // Month 1 — next hearing for countdown dashboard
  nextHearingDate: date("next_hearing_date"),
  nextHearingCourt: text("next_hearing_court"),
  nextHearingPurpose: text("next_hearing_purpose"),
  hearingNotes: text("hearing_notes"),

  // Month 4 — chamber role assignment
  /** Who is the primary lawyer on this case in this chamber */
  assignedAdvocate: text("assigned_advocate"),
  /** Role of the current user for this case */
  chamberRole: text("chamber_role").default("Associate"),

  // Month 5 — court formatter preference
  courtFormatStyle: text("court_format_style").default("rajasthan_hc"),

  // Month 6 — probability assessment
  probabilityScore: real("probability_score"),  // 0.0 – 1.0
  probabilityBreakdown: jsonb("probability_breakdown"),
  probabilityUpdatedAt: timestamp("probability_updated_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCasesExtendedSchema = createInsertSchema(casesExtendedTable).omit({
  id: true, createdAt: true, updatedAt: true,
});
export type InsertCasesExtended = z.infer<typeof insertCasesExtendedSchema>;
export type CasesExtended = typeof casesExtendedTable.$inferSelect;

/** Chamber user roles */
export type ChamberRole = "Admin" | "Advocate" | "Associate";
export const CHAMBER_ROLES: ChamberRole[] = ["Admin", "Advocate", "Associate"];

/** What each role can do */
export const ROLE_PERMISSIONS: Record<ChamberRole, {
  canFinalizeDraft: boolean;
  canDeleteCase: boolean;
  canManageUsers: boolean;
  canViewAllCases: boolean;
  canApproveExport: boolean;
}> = {
  Admin:     { canFinalizeDraft: true,  canDeleteCase: true,  canManageUsers: true,  canViewAllCases: true,  canApproveExport: true  },
  Advocate:  { canFinalizeDraft: true,  canDeleteCase: false, canManageUsers: false, canViewAllCases: true,  canApproveExport: true  },
  Associate: { canFinalizeDraft: false, canDeleteCase: false, canManageUsers: false, canViewAllCases: false, canApproveExport: false },
};
