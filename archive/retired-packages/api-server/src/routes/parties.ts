import { Router } from "express";
import { db, partiesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreatePartyBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const parties = await db.select().from(partiesTable).orderBy(partiesTable.name);
  return res.json(parties);
});

router.post("/", async (req, res) => {
  const body = CreatePartyBody.parse(req.body);
  const [party] = await db.insert(partiesTable).values(body).returning();
  return res.status(201).json(party);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [party] = await db.select().from(partiesTable).where(eq(partiesTable.id, id));
  if (!party) return res.status(404).json({ error: "Party not found" });
  return res.json(party);
});

export default router;
