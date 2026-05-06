import { Router, IRouter } from "express";
import { db, faqTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import { z } from "zod";

const router: IRouter = Router();

const CreateFaqBody = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
  category: z.string().min(1),
  sortOrder: z.number().int().optional(),
});

router.get("/faq", async (_req, res): Promise<void> => {
  const entries = await db
    .select()
    .from(faqTable)
    .orderBy(faqTable.sortOrder, faqTable.createdAt);
  res.json(entries);
});

router.get("/admin/faq", requireAuth, requireAdmin, async (_req, res): Promise<void> => {
  const entries = await db
    .select()
    .from(faqTable)
    .orderBy(faqTable.sortOrder, faqTable.createdAt);
  res.json(entries);
});

router.post("/admin/faq", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateFaqBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid FAQ data" }); return; }
  const [entry] = await db.insert(faqTable).values({
    ...parsed.data,
    sortOrder: parsed.data.sortOrder ?? 0,
  }).returning();
  res.status(201).json(entry);
});

router.patch("/admin/faq/:id", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  const parsed = CreateFaqBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid FAQ data" }); return; }
  const [updated] = await db.update(faqTable).set({
    ...parsed.data,
    sortOrder: parsed.data.sortOrder ?? 0,
  }).where(eq(faqTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated);
});

router.delete("/admin/faq/:id", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  const [deleted] = await db.delete(faqTable).where(eq(faqTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).send();
});

export default router;
