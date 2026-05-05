import { Router, IRouter } from "express";
import { db, usersTable, enrollmentsTable, programsTable, sessionsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/admin/stats", requireAuth, requireAdmin, async (_req, res): Promise<void> => {
  const [{ totalSwimmers }] = await db
    .select({ totalSwimmers: sql<number>`count(*)` })
    .from(usersTable)
    .where(sql`role != 'admin'`);

  const [{ totalEnrollments }] = await db
    .select({ totalEnrollments: sql<number>`count(*)` })
    .from(enrollmentsTable);

  const [{ activePrograms }] = await db
    .select({ activePrograms: sql<number>`count(*)` })
    .from(programsTable);

  const [{ upcomingSessions }] = await db
    .select({ upcomingSessions: sql<number>`count(*)` })
    .from(sessionsTable)
    .where(eq(sessionsTable.status, "upcoming"));

  const [{ pendingEnrollments }] = await db
    .select({ pendingEnrollments: sql<number>`count(*)` })
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.status, "pending"));

  const [{ confirmedEnrollments }] = await db
    .select({ confirmedEnrollments: sql<number>`count(*)` })
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.status, "confirmed"));

  const programs = await db.select().from(programsTable);
  const allEnrollments = await db.select().from(enrollmentsTable);

  const enrollmentsByLevel = await Promise.all(
    programs.map(async (p) => {
      const sessions = await db.select().from(sessionsTable).where(eq(sessionsTable.programId, p.id));
      const sessionIds = sessions.map((s) => s.id);
      const count = allEnrollments.filter((e) => sessionIds.includes(e.sessionId)).length;
      return { level: p.level, count };
    })
  );

  const levelMap = new Map<string, number>();
  for (const { level, count } of enrollmentsByLevel) {
    levelMap.set(level, (levelMap.get(level) ?? 0) + count);
  }
  const enrollmentsByLevelAgg = Array.from(levelMap.entries()).map(([level, count]) => ({ level, count }));

  const recentRaw = await db
    .select()
    .from(enrollmentsTable)
    .orderBy(enrollmentsTable.createdAt)
    .limit(5);

  const recentEnrollments = await Promise.all(
    recentRaw.map(async (e) => {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, e.userId));
      return {
        ...e,
        userEmail: user?.email ?? null,
        userName: user ? `${user.firstName} ${user.lastName}` : null,
        sessionInfo: undefined,
      };
    })
  );

  res.json({
    totalSwimmers: Number(totalSwimmers),
    totalEnrollments: Number(totalEnrollments),
    activePrograms: Number(activePrograms),
    upcomingSessions: Number(upcomingSessions),
    pendingEnrollments: Number(pendingEnrollments),
    confirmedEnrollments: Number(confirmedEnrollments),
    enrollmentsByLevel: enrollmentsByLevelAgg,
    recentEnrollments,
  });
});

router.get("/admin/swimmers", requireAuth, requireAdmin, async (_req, res): Promise<void> => {
  const users = await db
    .select()
    .from(usersTable)
    .where(sql`role != 'admin'`)
    .orderBy(usersTable.createdAt);

  res.json(
    users.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      role: u.role,
      createdAt: u.createdAt,
    }))
  );
});

export default router;
