import reportsController from "../controllers/reports.controller";
import  { Router } from "express";

const router = Router();

router.post("/", reportsController.createReport);
router.get("/", reportsController.getReports);
router.get("/:id", reportsController.getReportById);
router.patch("/:id", reportsController.patchupdateReport);
router.delete("/:id", reportsController.deleteReport);
router.post("/dates", reportsController.getReportsbyDates);
export default router;