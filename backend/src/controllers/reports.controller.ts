import reportsService from "../services/reports.service";
import { Request, Response } from "express";
import studentsService from "../services/students.service";

const createReport = async (req: Request, res: Response) => {
    try {
        const reportDetails = req.body;
        const newReport = await reportsService.createReport(reportDetails) as { _id: string };
        const addReportToStudent = await studentsService.addReport(reportDetails.student_id, newReport._id.toString());
        res.status(201).json(newReport);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const getReports = async (req: Request, res: Response) => {
    try {
        const reports = await reportsService.getReports();
        res.status(200).json(reports);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const getReportById = async (req: Request, res: Response) => {
    try {
        const reportId: string = req.params.id;
        const report = await reportsService.findReportById(reportId);
        if (!report) {
            res.status(404).json({ error: "Report not found" });
        } else {
            res.status(200).json(report);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const patchupdateReport = async (req: Request, res: Response) => {
    try {
        const reportId: string = req.params.id;
        const reportDetails = req.body;
        const updatedReport = await reportsService.modifyReport(reportId, reportDetails);
        if (!updatedReport) {
            res.status(404).json({ error: "Report not found" });
        } else {
            res.status(200).json(updatedReport);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const deleteReport = async (req: Request, res: Response) => {
    try {
        const reportId: string = req.params.id;
        const deletedReport = await reportsService.deleteReport(reportId);
        if (!deletedReport) {
            res.status(404).json({ error: "Report not found" });
        } else {
            res.status(200).json(deletedReport);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}



export default {
    createReport,
    getReports,
    getReportById,
    patchupdateReport,
    deleteReport
}