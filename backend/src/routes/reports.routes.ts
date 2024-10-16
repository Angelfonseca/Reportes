import reportsController from "../controllers/reports.controller";
import  { Router } from "express";
import ensureAuth from "../middlewares/auth.middleware";

const router = Router();

router.post("/", reportsController.createReport);
router.get("/", reportsController.getReports);
router.get("/:id", reportsController.getReportById);
router.patch("/:id", reportsController.patchupdateReport);
router.delete("/:id", reportsController.deleteReport);
router.post("/dates", reportsController.getReportsbyDates);
router.post("/pdf", reportsController.createpdf);
export default router;