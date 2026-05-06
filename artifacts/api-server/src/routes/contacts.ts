import { Router, IRouter } from "express";
import { db, contactsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import { z } from "zod";

const router: IRouter = Router();

const SubmitContactBody = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().nullish(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

router.post("/contacts", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid contact data" }); return; }
  const [contact] = await db.insert(contactsTable).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    subject: parsed.data.subject,
    message: parsed.data.message,
    status: "unread",
  }).returning();
  res.status(201).json(contact);
});

router.get("/admin/contacts", requireAuth, requireAdmin, async (_req, res): Promise<void> => {
  const contacts = await db.select().from(contactsTable).orderBy(contactsTable.createdAt);
  res.json(contacts);
});

router.patch("/admin/contacts/:id/status", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  const { status } = req.body as { status: string };
  const [updated] = await db
    .update(contactsTable)
    .set({ status })
    .where(eq(contactsTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated);
});

export default router;
