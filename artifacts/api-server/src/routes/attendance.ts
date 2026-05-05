import { Router, IRouter } from "express";
import { db, attendanceTable, enrollmentsTable, sessionsTable, programsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import { z } from "zod";

const router: IRouter = Router();

const MarkAttendanceBody = z.object({
  enrollmentId: z.number().int(),
  date: z.string(),
  status: z.enum(["present", "absent", "excused"]),
  notes: z.string().nullish(),
});

router.get("/attendance/my", requireAuth, async (req, res): Promise<void> => {
  const userId = (req as any).userId as number;
  const myEnrollments = await db
    .select()
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.userId, userId));

  const enrollmentIds = myEnrollments.map((e) => e.id);
  if (enrollmentIds.length === 0) { res.json([]); return; }

  const records = await db
    .select()
    .from(attendanceTable)
    .where(sql`enrollment_id = ANY(${enrollmentIds})`);

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
      return {
        ...r,
        swimmerName: enrollment?.swimmerName ?? null,
        programName,
      };
    })
  );

  res.json(enriched);
});

router.get("/admin/attendance", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const enrollmentId = req.query.enrollmentId ? parseInt(req.query.enrollmentId as string) : null;

  let records;
  if (enrollmentId) {
    records = await db
      .select()
      .from(attendanceTable)
      .where(eq(attendanceTable.enrollmentId, enrollmentId))
      .orderBy(attendanceTable.date);
  } else {
    records = await db.select().from(attendanceTable).orderBy(attendanceTable.date);
  }

  const enriched = await Promise.all(
    records.map(async (r) => {
      const [enrollment] = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.id, r.enrollmentId));
      let programName: string | null = null;
      if (enrollment) {
        const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, enrollment.sessionId));
        if (session) {
          const [program] = await db.select().from(programsTable).where(eq(programsTable.id, session.programId));
          programName = program?.name ?? null;
        }
      }
      return {
        ...r,
        swimmerName: enrollment?.swimmerName ?? null,
        programName,
      };
    })
  );

  res.json(enriched);
});

router.post("/admin/attendance", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const parsed = MarkAttendanceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid attendance data" }); return; }
  const [record] = await db.insert(attendanceTable).values({
    enrollmentId: parsed.data.enrollmentId,
    date: parsed.data.date,
    status: parsed.data.status,
    notes: parsed.data.notes ?? null,
  }).returning();
  res.status(201).json({ ...record, swimmerName: null, programName: null });
});

export default router;
