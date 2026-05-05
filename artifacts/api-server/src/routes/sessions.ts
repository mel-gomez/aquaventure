import { Router, IRouter } from "express";
import { db, sessionsTable, programsTable, enrollmentsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { GetSessionParams, CreateSessionBody, ListSessionsQueryParams } from "@workspace/api-zod";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

async function enrichSession(session: typeof sessionsTable.$inferSelect) {
  const [program] = await db.select().from(programsTable).where(eq(programsTable.id, session.programId));
  const enrolledCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(enrollmentsTable)
    .where(and(eq(enrollmentsTable.sessionId, session.id)));
  const enrolledCount = Number(enrolledCountResult[0]?.count ?? 0);
  return {
    ...session,
    programName: program?.name ?? "",
    programLevel: program?.level ?? "",
    maxStudents: program?.maxStudents ?? 0,
    enrolledCount,
  };
}

router.get("/sessions", async (req, res): Promise<void> => {
  const queryParams = ListSessionsQueryParams.safeParse(req.query);
  const sessions = await db.select().from(sessionsTable).orderBy(sessionsTable.startDate);

  let filtered = sessions;
  if (queryParams.success && queryParams.data.programId) {
    filtered = sessions.filter((s) => s.programId === queryParams.data.programId);
  }

  const enriched = await Promise.all(filtered.map(enrichSession));
  res.json(enriched);
});

router.get("/sessions/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetSessionParams.safeParse({ id: Number(raw) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, params.data.id));
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  res.json(await enrichSession(session));
});

router.post("/admin/sessions", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [session] = await db.insert(sessionsTable).values(parsed.data).returning();
  res.status(201).json(await enrichSession(session));
});

export default router;
