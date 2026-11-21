import { Router, type IRouter } from "express";
import healthRouter from "./health";
import casesRouter from "./cases";
import noticesRouter from "./notices";
import draftsRouter from "./drafts";
import correspondenceRouter from "./correspondence";
import billsRouter from "./bills";
import partiesRouter from "./parties";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/cases", casesRouter);
router.use("/notices", noticesRouter);
router.use("/drafts", draftsRouter);
router.use("/correspondence", correspondenceRouter);
router.use("/bills", billsRouter);
router.use("/parties", partiesRouter);
router.use("/dashboard", dashboardRouter);

export default router;
