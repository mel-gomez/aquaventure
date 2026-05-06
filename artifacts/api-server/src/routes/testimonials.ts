import { Router, IRouter } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import { z } from "zod";

const router: IRouter = Router();

const SubmitTestimonialBody = z.object({
  parentName: z.string().min(2),
  content: z.string().min(10),
  rating: z.number().int().min(1).max(5),
});

router.get("/testimonials", async (_req, res): Promise<void> => {
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .where(eq(testimonialsTable.approved, true))
    .orderBy(testimonialsTable.createdAt);
  res.json(testimonials);
});

router.post("/testimonials", async (req, res): Promise<void> => {
  const parsed = SubmitTestimonialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid testimonial data" });
    return;
  }
  const [testimonial] = await db
    .insert(testimonialsTable)
    .values({ ...parsed.data, approved: false })
    .returning();
  res.status(201).json(testimonial);
});

router.get("/admin/testimonials", requireAuth, requireAdmin, async (_req, res): Promise<void> => {
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .orderBy(testimonialsTable.createdAt);
  res.json(testimonials);
});

router.patch("/admin/testimonials/:id/approve", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  const { approved } = req.body as { approved: boolean };
  const [updated] = await db
    .update(testimonialsTable)
    .set({ approved })
    .where(eq(testimonialsTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated);
});

router.delete("/admin/testimonials/:id", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  const [deleted] = await db
    .delete(testimonialsTable)
    .where(eq(testimonialsTable.id, id))
    .returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).send();
});

export default router;
