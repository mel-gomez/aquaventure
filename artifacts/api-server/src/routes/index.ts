import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import programsRouter from "./programs";
import sessionsRouter from "./sessions";
import enrollmentsRouter from "./enrollments";
import announcementsRouter from "./announcements";
import adminRouter from "./admin";
import testimonialsRouter from "./testimonials";
import faqRouter from "./faq";
import contactsRouter from "./contacts";
import attendanceRouter from "./attendance";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(programsRouter);
router.use(sessionsRouter);
router.use(enrollmentsRouter);
router.use(announcementsRouter);
router.use(adminRouter);
router.use(testimonialsRouter);
router.use(faqRouter);
router.use(contactsRouter);
router.use(attendanceRouter);

export default router;
