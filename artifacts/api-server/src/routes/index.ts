import { Router, type IRouter } from "express";
import healthRouter from "./health";
import announcementsRouter from "./announcements";

const router: IRouter = Router();

router.use(healthRouter);
router.use(announcementsRouter);

export default router;
