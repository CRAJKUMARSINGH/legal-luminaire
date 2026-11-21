import { Router } from "express";
import { db, casesTable, noticesTable, correspondenceTable, billsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateCaseBody, UpdateCaseBody } from "@workspace/api-zod";
import { toDateOnlyString } from "../lib/route-value-mappers.js";

const router = Router();

router.get("/", async (req, res) => {
  const { status, category } = req.query as Record<string, string | undefined>;
  let query = db.select().from(casesTable).$dynamic();
  if (status) {
    query = query.where(eq(casesTable.status, status));
  }
  const cases = await query.orderBy(casesTable.createdAt);
  if (category) {
    return res.json(cases.filter((c) => c.category === category));
  }
  return res.json(cases);
});

router.post("/", async (req, res) => {
  const body = CreateCaseBody.parse(req.body);
  const [newCase] = await db
    .insert(casesTable)
    .values({
      ...body,
      contractDate: toDateOnlyString(body.contractDate),
      scheduledStartDate: toDateOnlyString(body.scheduledStartDate),
      scheduledCompletionDate: toDateOnlyString(body.scheduledCompletionDate),
      actualStartDate: toDateOnlyString(body.actualStartDate),
      updatedAt: new Date(),
    })
    .returning();
  return res.status(201).json(newCase);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [c] = await db.select().from(casesTable).where(eq(casesTable.id, id));
  if (!c) return res.status(404).json({ error: "Case not found" });
  return res.json(c);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = UpdateCaseBody.parse(req.body);
  const [updated] = await db
    .update(casesTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(casesTable.id, id))
    .returning();
  if (!updated) return res.status(404).json({ error: "Case not found" });
  return res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(casesTable).where(eq(casesTable.id, id));
  return res.status(204).send();
});

router.get("/:id/notices", async (req, res) => {
  const id = parseInt(req.params.id);
  const notices = await db
    .select()
    .from(noticesTable)
    .where(eq(noticesTable.caseId, id))
    .orderBy(noticesTable.issuedDate);
  return res.json(notices);
});

router.get("/:id/correspondence", async (req, res) => {
  const id = parseInt(req.params.id);
  const items = await db
    .select()
    .from(correspondenceTable)
    .where(eq(correspondenceTable.caseId, id))
    .orderBy(correspondenceTable.correspondenceDate);
  return res.json(items);
});

router.get("/:id/bills", async (req, res) => {
  const id = parseInt(req.params.id);
  const bills = await db
    .select()
    .from(billsTable)
    .where(eq(billsTable.caseId, id))
    .orderBy(billsTable.billDate);
  return res.json(bills);
});

export default router;
