import { Router } from "express";
import { db, noticesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateNoticeBody } from "@workspace/api-zod";
import { toDateOnlyString } from "../lib/route-value-mappers.js";

const router = Router();

router.get("/", async (req, res) => {
  const { caseId, noticeType } = req.query as Record<string, string | undefined>;
  let notices = await db.select().from(noticesTable).orderBy(noticesTable.issuedDate);
  if (caseId) {
    notices = notices.filter((n) => n.caseId === parseInt(caseId));
  }
  if (noticeType) {
    notices = notices.filter((n) => n.noticeType === noticeType);
  }
  return res.json(notices);
});

router.post("/", async (req, res) => {
  const body = CreateNoticeBody.parse(req.body);
  const [notice] = await db
    .insert(noticesTable)
    .values({
      ...body,
      issuedDate: toDateOnlyString(body.issuedDate)!,
      responseDeadline: toDateOnlyString(body.responseDeadline),
    })
    .returning();
  return res.status(201).json(notice);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [notice] = await db.select().from(noticesTable).where(eq(noticesTable.id, id));
  if (!notice) return res.status(404).json({ error: "Notice not found" });
  return res.json(notice);
});

export default router;
