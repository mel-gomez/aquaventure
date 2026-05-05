import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import programsRouter from "./programs";
import sessionsRouter from "./sessions";
import enrollmentsRouter from "./enrollments";
import announcementsRouter from "./announcements";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(programsRouter);
router.use(sessionsRouter);
router.use(enrollmentsRouter);
router.use(announcementsRouter);
router.use(adminRouter);

export default router;
