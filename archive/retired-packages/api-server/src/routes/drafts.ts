import { Router } from "express";
import { db, draftsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateDraftBody, UpdateDraftBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const { caseId, status } = req.query as Record<string, string | undefined>;
  let drafts = await db.select().from(draftsTable).orderBy(draftsTable.updatedAt);
  if (caseId) {
    drafts = drafts.filter((d) => d.caseId === parseInt(caseId));
  }
  if (status) {
    drafts = drafts.filter((d) => d.status === status);
  }
  return res.json(drafts);
});

router.post("/", async (req, res) => {
  const body = CreateDraftBody.parse(req.body);
  const [draft] = await db
    .insert(draftsTable)
    .values({ ...body, updatedAt: new Date() })
    .returning();
  return res.status(201).json(draft);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [draft] = await db.select().from(draftsTable).where(eq(draftsTable.id, id));
  if (!draft) return res.status(404).json({ error: "Draft not found" });
  return res.json(draft);
});

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = UpdateDraftBody.parse(req.body);
  const [updated] = await db
    .update(draftsTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(draftsTable.id, id))
    .returning();
  if (!updated) return res.status(404).json({ error: "Draft not found" });
  return res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(draftsTable).where(eq(draftsTable.id, id));
  return res.status(204).send();
});

export default router;
