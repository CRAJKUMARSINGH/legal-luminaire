import { Router } from "express";
import { db, correspondenceTable } from "@workspace/db";
import { CreateCorrespondenceBody } from "@workspace/api-zod";
import { toDateOnlyString } from "../lib/route-value-mappers.js";

const router = Router();

router.get("/", async (req, res) => {
  const { caseId, direction } = req.query as Record<string, string | undefined>;
  let items = await db.select().from(correspondenceTable).orderBy(correspondenceTable.correspondenceDate);
  if (caseId) {
    items = items.filter((c) => c.caseId === parseInt(caseId));
  }
  if (direction) {
    items = items.filter((c) => c.direction === direction);
  }
  return res.json(items);
});

router.post("/", async (req, res) => {
  const body = CreateCorrespondenceBody.parse(req.body);
  const [item] = await db
    .insert(correspondenceTable)
    .values({
      ...body,
      correspondenceDate: toDateOnlyString(body.correspondenceDate)!,
    })
    .returning();
  return res.status(201).json(item);
});

export default router;
