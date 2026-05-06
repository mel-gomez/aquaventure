import { Router, IRouter } from "express";
import { db, swimmerProfilesTable, enrollmentsTable, sessionsTable, programsTable, progressTable, attendanceTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { z } from "zod";

const router: IRouter = Router();

const UpsertBody = z.object({
  swimmerName: z.string().min(1),
  avatarUrl: z.string().url().nullish(),
  bio: z.string().nullish(),
  level: z.string().nullish(),
});

router.get("/swimmers/my", requireAuth, async (req, res): Promise<void> => {
  const userId = req.user!.userId;
  const profiles = await db
    .select()
    .from(swimmerProfilesTable)
    .where(eq(swimmerProfilesTable.userId, userId));

  const enriched = await Promise.all(
    profiles.map(async (p) => {
      const enrollments = await db
        .select()
        .from(enrollmentsTable)
        .where(and(eq(enrollmentsTable.userId, userId), eq(enrollmentsTable.swimmerName, p.swimmerName)));

      const enrollmentIds = enrollments.map((e) => e.id);

      let programName: string | null = null;
      let programLevel: string | null = null;
      if (enrollments.length > 0) {
        const latest = enrollments[enrollments.length - 1];
        if (latest) {
          const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, latest.sessionId));
          if (session) {
            const [program] = await db.select().from(programsTable).where(eq(programsTable.id, session.programId));
            programName = program?.name ?? null;
            programLevel = program?.level ?? null;
          }
        }
      }

      let attendanceCount = 0;
      let presentCount = 0;
      let skillCount = 0;

      if (enrollmentIds.length > 0) {
        const attendance = await db
          .select()
          .from(attendanceTable)
          .where(sql`enrollment_id = ANY(${enrollmentIds})`);
        attendanceCount = attendance.length;
        presentCount = attendance.filter((a) => a.status === "present").length;

        const progress = await db
          .select()
          .from(progressTable)
          .where(sql`enrollment_id = ANY(${enrollmentIds})`);
        skillCount = progress.length;
      }

      return {
        ...p,
        programName,
        programLevel,
        enrollmentCount: enrollments.length,
        attendanceCount,
        presentCount,
        attendanceRate: attendanceCount > 0 ? Math.round((presentCount / attendanceCount) * 100) : null,
        skillCount,
      };
    })
  );

  res.json(enriched);
});

router.post("/swimmers", requireAuth, async (req, res): Promise<void> => {
  const userId = req.user!.userId;
  const parsed = UpsertBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }

  const [existing] = await db
    .select()
    .from(swimmerProfilesTable)
    .where(and(eq(swimmerProfilesTable.userId, userId), eq(swimmerProfilesTable.swimmerName, parsed.data.swimmerName)));

  if (existing) {
    const [updated] = await db
      .update(swimmerProfilesTable)
      .set({ avatarUrl: parsed.data.avatarUrl ?? null, bio: parsed.data.bio ?? null, level: parsed.data.level ?? null })
      .where(eq(swimmerProfilesTable.id, existing.id))
      .returning();
    res.status(201).json(updated);
    return;
  }

  const [profile] = await db.insert(swimmerProfilesTable).values({
    userId,
    swimmerName: parsed.data.swimmerName,
    avatarUrl: parsed.data.avatarUrl ?? null,
    bio: parsed.data.bio ?? null,
    level: parsed.data.level ?? null,
  }).returning();

  res.status(201).json(profile);
});

router.patch("/swimmers/:id", requireAuth, async (req, res): Promise<void> => {
  const userId = req.user!.userId;
  const id = parseInt(String(req.params.id));
  const parsed = UpsertBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }

  const [profile] = await db
    .update(swimmerProfilesTable)
    .set({
      swimmerName: parsed.data.swimmerName,
      avatarUrl: parsed.data.avatarUrl ?? null,
      bio: parsed.data.bio ?? null,
      level: parsed.data.level ?? null,
    })
    .where(and(eq(swimmerProfilesTable.id, id), eq(swimmerProfilesTable.userId, userId)))
    .returning();

  if (!profile) { res.status(404).json({ error: "Not found" }); return; }
  res.json(profile);
});

export default router;
