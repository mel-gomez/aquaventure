import { Router, IRouter } from "express";
import { db, programsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetProgramParams, CreateProgramBody } from "@workspace/api-zod";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/programs", async (_req, res): Promise<void> => {
  const programs = await db.select().from(programsTable).orderBy(programsTable.createdAt);
  res.json(
    programs.map((p) => ({
      ...p,
      pricePerSession: parseFloat(p.pricePerSession as unknown as string),
    }))
  );
});

router.get("/programs/:id", async (req, res): Promise<void> => {
  const params = GetProgramParams.safeParse({ id: Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [program] = await db.select().from(programsTable).where(eq(programsTable.id, params.data.id));
  if (!program) {
    res.status(404).json({ error: "Program not found" });
    return;
  }

  res.json({ ...program, pricePerSession: parseFloat(program.pricePerSession as unknown as string) });
});

router.post("/admin/programs", requireAuth, requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateProgramBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [program] = await db
    .insert(programsTable)
    .values({ ...parsed.data, pricePerSession: String(parsed.data.pricePerSession) })
    .returning();

  res.status(201).json({ ...program, pricePerSession: parseFloat(program.pricePerSession as unknown as string) });
});

export default router;
