import { Router, IRouter } from "express";
import { db, enrollmentsTable, sessionsTable, programsTable, usersTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import {
  CreateEnrollmentBody,
  CancelEnrollmentParams,
  UpdateEnrollmentStatusParams,
  UpdateEnrollmentStatusBody,
} from "@workspace/api-zod";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

async function enrichEnrollment(enrollment: typeof enrollmentsTable.$inferSelect) {
  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, enrollment.sessionId));
  const [program] = session ? await db.select().from(programsTable).where(eq(programsTable.id, session.programId)) : [];
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, enrollment.userId));
  const enrolledCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(enrollmentsTable)
    .where(and(eq(enrollmentsTable.sessionId, enrollment.sessionId)));
  const enrolledCount = Number(enrolledCountResult[0]?.count ?? 0);

  return {
    ...enrollment,
    userEmail: user?.email ?? null,
    userName: user ? `${user.firstName} ${user.lastName}` : null,
    sessionInfo: session
      ? {
          ...session,
          programName: program?.name ?? "",
          programLevel: program?.level ?? "",
          maxStudents: program?.maxStudents ?? 0,
          enrolledCount,
        }
      : undefined,
  };
}

router.post("/enrollments", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateEnrollmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, parsed.data.sessionId));
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const [enrollment] = await db
    .insert(enrollmentsTable)
    .values({ ...parsed.data, userId: req.user!.userId, status: "pending" })
    .returning();

  res.status(201).json(await enrichEnrollment(enrollment));
});

router.get("/enrollments/my", requireAuth, async (req, res): Promise<void> => {
  const myEnrollments = await db
    .select()
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.userId, req.user!.userId))
    .orderBy(enrollmentsTable.createdAt);

  const enriched = await Promise.all(myEnrollments.map(enrichEnrollment));
  res.json(enriched);
});

router.delete("/enrollments/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CancelEnrollmentParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [enrollment] = await db
    .select()
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.id, params.data.id));

  if (!enrollment) {
    res.status(404).json({ error: "Enrollment not found" });
    return;
  }

  if (enrollment.userId !== req.user!.userId && req.user!.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  await db.update(enrollmentsTable).set({ status: "cancelled" }).where(eq(enrollmentsTable.id, params.data.id));
  res.sendStatus(204);
});

router.get("/admin/enrollments", requireAuth, requireAdmin, async (_req, res): Promise<void> => {
  const all = await db.select().from(enrollmentsTable).orderBy(enrollmentsTable.createdAt);
  const enriched = await Promise.all(all.map(enrichEnrollment));
  res.json(enriched);
});

router.patch(
  "/admin/enrollments/:id/status",
  requireAuth,
  requireAdmin,
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const params = UpdateEnrollmentStatusParams.safeParse({ id: Number(raw) });
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const body = UpdateEnrollmentStatusBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }

    const [enrollment] = await db
      .update(enrollmentsTable)
      .set({ status: body.data.status })
      .where(eq(enrollmentsTable.id, params.data.id))
      .returning();

    if (!enrollment) {
      res.status(404).json({ error: "Enrollment not found" });
      return;
    }

    res.json(await enrichEnrollment(enrollment));
  }
);

export default router;
