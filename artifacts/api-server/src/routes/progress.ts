import { Router, IRouter } from "express";
import { db, progressTable, enrollmentsTable, sessionsTable, programsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import { z } from "zod";

const router: IRouter = Router();

const LogProgressBody = z.object({
  enrollmentId: z.number().int(),
  skill: z.string().min(1),
  achievedAt: z.string(),
  notes: z.string().nullish(),
});

async function enrichRecord(r: typeof progressTable.$inferSelect) {
  const [enrollment] = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.id, r.enrollmentId));
  let programName: string | null = null;
  if (enrollment) {
    const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, enrollment.sessionId));
    if (session) {
      const [program] = await db.select().from(programsTable).where(eq(programsTable.id, session.programId));
      programName = program?.name ?? null;
    }
  }
  return { ...r, swimmerName: enrollment?.swimmerName ?? null, programName };
}

router.get("/progress/my", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as any).userId as number;
  const myEnrollments = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.userId, userId));
  const enrollmentIds = myEnrollments.map((e) => e.id);
  if (enrollmentIds.length === 0) { res.json([]); return; }

  const records = await db
    .select()
    .from(progressTable)
    .where(sql`enrollment_id = ANY(${enrollmentIds})`)
    .orderBy(progressTable.achievedAt);

  const enriched = await Promise.all(
    records.map(async (r) => {
      const enrollment = myEnrollments.find((e) => e.id === r.enrollmentId);
      let programName: string | null = null;
      if (enrollment) {
        const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, enrollment.sessionId));
        if (session) {
          const [program] = await db.select().from(programsTable).where(eq(programsTable.id, session.programId));
          programName = program?.name ?? null;
        }
      }
      return { ...r, swimmerName: enrollment?.swimmerName ?? null, programName };
    })
  );

  res.json(enriched);
});

router.get("/admin/progress", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const enrollmentId = req.query.enrollmentId ? parseInt(req.query.enrollmentId as string) : null;

  const records = enrollmentId
    ? await db.select().from(progressTable).where(eq(progressTable.enrollmentId, enrollmentId)).orderBy(progressTable.achievedAt)
    : await db.select().from(progressTable).orderBy(progressTable.achievedAt);

  const enriched = await Promise.all(records.map(enrichRecord));
  res.json(enriched);
});

router.post("/admin/progress", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const parsed = LogProgressBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid progress data" }); return; }

  const [record] = await db.insert(progressTable).values({
    enrollmentId: parsed.data.enrollmentId,
    skill: parsed.data.skill,
    achievedAt: parsed.data.achievedAt,
    notes: parsed.data.notes ?? null,
  }).returning();

  res.status(201).json(await enrichRecord(record));
});

router.delete("/admin/progress/:id", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id));
  const [deleted] = await db.delete(progressTable).where(eq(progressTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.json(await enrichRecord(deleted));
});

export default router;
