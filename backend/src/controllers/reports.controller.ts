import reportsService from "../services/reports.service";
import { Request, Response } from "express";
import studentsService from "../services/students.service";
import { report } from "process";

const createReport = async (req: Request, res: Response) => {
    try {
        const reportDetails = req.body;
        const { puntos, ...reporteSinPuntos } = reportDetails;
        const newReport = await reportsService.createReport(reporteSinPuntos) as { _id: string };
        await studentsService.addReport(reportDetails.student_id, newReport._id, reportDetails.puntos );
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

const getReportsbyDates = async (req: Request, res: Response) => {
    try {
        // Obtén y valida las fechas del query
        const startDateString = req.body.startDate as string;
        const endDateString = req.body.endDate as string;

        // Verificar si las fechas son válidas
        if (!startDateString || !endDateString) {
            return res.status(400).json({ error: 'Por favor proporcione ambas fechas de inicio y fin.' });
        }

        const startDate: Date = new Date(startDateString);
        const endDate: Date = new Date(endDateString);

        // Si las fechas no son válidas, retorna un error
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ error: 'El formato de las fechas es inválido.' });
        }

        // Llama al servicio para obtener los reportes
        const reports = await reportsService.getReportsbyDates(startDate, endDate);

        res.status(200).json(reports);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
const createpdf = async (req: Request, res: Response) => {
    try {
        // Obtén y valida las fechas del query
        const startDateString = req.body.startDate as string;
        const endDateString = req.body.endDate as string;

        // Verificar si las fechas son válidas
        if (!startDateString || !endDateString) {
            return res.status(400).json({ error: 'Por favor proporcione ambas fechas de inicio y fin.' });
        }

        const startDate: Date = new Date(startDateString);
        const endDate: Date = new Date(endDateString);

        // Si las fechas no son válidas, retorna un error
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ error: 'El formato de las fechas es inválido.' });
        }

        // Llama al servicio para obtener los reportes en formato PDF
        const pdfBuffer = await reportsService.createpdf(startDate, endDate);

        // Configura la respuesta para enviar el PDF como descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
        res.send(pdfBuffer);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};



export default {
    createReport,
    getReports,
    getReportById,
    patchupdateReport,
    deleteReport,
    getReportsbyDates,
    createpdf,
}