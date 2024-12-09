import reportsController from "../controllers/reports.controller";
import  { Router } from "express";
import ensureAuth from "../middlewares/auth.middleware";

const router = Router();

router.post("/", ensureAuth,reportsController.createReport);
router.get("/", ensureAuth,reportsController.getReports);
router.get("/:id", ensureAuth,reportsController.getReportById);
router.patch("/:id", ensureAuth,reportsController.patchupdateReport);
router.delete("/:id", ensureAuth,reportsController.deleteReport);
router.post("/dates", ensureAuth,reportsController.getReportsbyDates);
router.post("/pdf", ensureAuth,reportsController.createpdf);
export default router;