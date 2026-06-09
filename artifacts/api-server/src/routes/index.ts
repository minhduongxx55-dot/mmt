import { Router, type IRouter } from "express";
import healthRouter from "./health";
import rankingsRouter from "./rankings";
import questionsRouter from "./questions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(rankingsRouter);
router.use(questionsRouter);

export default router;
