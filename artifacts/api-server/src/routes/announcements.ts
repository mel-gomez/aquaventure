import { Router, IRouter } from "express";
import { db, announcementsTable } from "@workspace/db";
import { CreateAnnouncementBody } from "@workspace/api-zod";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/announcements", async (_req, res): Promise<void> => {
  const announcements = await db.select().from(announcementsTable).orderBy(announcementsTable.createdAt);
  res.json(announcements);
});

router.post("/admin/announcements", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [announcement] = await db.insert(announcementsTable).values(parsed.data).returning();
  res.status(201).json(announcement);
});

export default router;
