import { Router } from "express";
import { db, casesTable, noticesTable, draftsTable, billsTable, correspondenceTable } from "@workspace/db";
import { sql, desc } from "drizzle-orm";

const router = Router();

router.get("/summary", async (req, res) => {
  const cases = await db.select().from(casesTable);
  const notices = await db.select().from(noticesTable);
  const drafts = await db.select().from(draftsTable);
  const bills = await db.select().from(billsTable);

  const totalPendingAmountRs = bills
    .filter((b) => b.status === "pending" || b.status === "overdue")
    .reduce((sum, b) => sum + parseFloat(b.totalAmountRs as string), 0);

  res.json({
    totalCases: cases.length,
    openCases: cases.filter((c) => c.status === "open").length,
    closedCases: cases.filter((c) => c.status === "closed").length,
    pendingCases: cases.filter((c) => c.status === "pending").length,
    disputedCases: cases.filter((c) => c.status === "disputed").length,
    totalPendingAmountRs,
    totalNotices: notices.length,
    overdueNotices: notices.filter((n) => n.status === "overdue").length,
    totalDrafts: drafts.length,
    finalizedDrafts: drafts.filter((d) => d.status === "finalized" || d.status === "sent").length,
  });
});

router.get("/recent-activity", async (req, res) => {
  const limit = parseInt((req.query.limit as string) || "10");

  const [recentNotices, recentDrafts, recentBills, recentCorrespondence] = await Promise.all([
    db.select().from(noticesTable).orderBy(desc(noticesTable.createdAt)).limit(limit),
    db.select().from(draftsTable).orderBy(desc(draftsTable.createdAt)).limit(limit),
    db.select().from(billsTable).orderBy(desc(billsTable.createdAt)).limit(limit),
    db.select().from(correspondenceTable).orderBy(desc(correspondenceTable.createdAt)).limit(limit),
  ]);

  const caseIds = new Set([
    ...recentNotices.map((n) => n.caseId),
    ...recentDrafts.map((d) => d.caseId),
    ...recentBills.map((b) => b.caseId),
    ...recentCorrespondence.map((c) => c.caseId),
  ]);

  const cases = await db.select().from(casesTable);
  const caseMap = new Map(cases.map((c) => [c.id, c.title]));

  const activities = [
    ...recentNotices.map((n) => ({
      id: n.id * 1000 + 1,
      activityType: "notice_received" as const,
      caseId: n.caseId,
      caseTitle: caseMap.get(n.caseId) || "Unknown Case",
      description: `Notice received: ${n.title}`,
      occurredAt: n.createdAt.toISOString(),
    })),
    ...recentDrafts.map((d) => ({
      id: d.id * 1000 + 2,
      activityType: "draft_created" as const,
      caseId: d.caseId,
      caseTitle: caseMap.get(d.caseId) || "Unknown Case",
      description: `Draft created: ${d.title}`,
      occurredAt: d.createdAt.toISOString(),
    })),
    ...recentBills.map((b) => ({
      id: b.id * 1000 + 3,
      activityType: "bill_submitted" as const,
      caseId: b.caseId,
      caseTitle: caseMap.get(b.caseId) || "Unknown Case",
      description: `Bill submitted: ${b.description} — ₹${parseFloat(b.totalAmountRs as string).toLocaleString("en-IN")}`,
      occurredAt: b.createdAt.toISOString(),
    })),
    ...recentCorrespondence.map((c) => ({
      id: c.id * 1000 + 4,
      activityType: "correspondence_added" as const,
      caseId: c.caseId,
      caseTitle: caseMap.get(c.caseId) || "Unknown Case",
      description: `Correspondence ${c.direction}: ${c.subject}`,
      occurredAt: c.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, limit);

  res.json(activities);
});

router.get("/pending-bills", async (req, res) => {
  const bills = await db.select().from(billsTable);

  const pendingBills = bills.filter((b) => b.status === "pending");
  const overdueBills = bills.filter((b) => b.status === "overdue");
  const disputedBills = bills.filter((b) => b.status === "disputed");

  const sum = (arr: typeof bills) =>
    arr.reduce((s, b) => s + parseFloat(b.totalAmountRs as string), 0);

  const byType: Record<string, { totalRs: number; count: number }> = {};
  for (const b of [...pendingBills, ...overdueBills, ...disputedBills]) {
    if (!byType[b.billType]) byType[b.billType] = { totalRs: 0, count: 0 };
    byType[b.billType].totalRs += parseFloat(b.totalAmountRs as string);
    byType[b.billType].count += 1;
  }

  res.json({
    totalPendingRs: sum(pendingBills),
    pendingCount: pendingBills.length,
    overdueRs: sum(overdueBills),
    overdueCount: overdueBills.length,
    disputedRs: sum(disputedBills),
    disputedCount: disputedBills.length,
    breakdown: Object.entries(byType).map(([billType, data]) => ({
      billType,
      totalRs: data.totalRs,
      count: data.count,
    })),
  });
});

export default router;
