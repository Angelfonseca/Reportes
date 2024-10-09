import reportsModel from '../models/reports.model';
import { report } from '../interfaces/reports.interface';
import studentsService from './students.service';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const createReport = async (reportDetails: report) => {
    return reportsModel.create(reportDetails);
}
const getReports = async () => {
    return reportsModel.find();
}
const findReportById = async (reportId: string) => {
    return reportsModel.findById(reportId);
}
const modifyReport = async (reportId: string, reportDetails: report) => {
    return reportsModel.findByIdAndUpdate(reportId, reportDetails, { new: true });
}
const deleteReport = async (reportId: string) => {
    return reportsModel.findByIdAndDelete(reportId);
}
const findReportsByStudentId = async (studentId: string) => {
    return reportsModel.find({ student_id: studentId });
}
const findReportsByTeacherId = async (teacherId: string) => {
    return reportsModel.find({ teacher_id: teacherId });
}
const getReportsbyDates = async (startDate: Date, endDate: Date) => {
    return reportsModel.find({ createdAt: { $gte: startDate, $lt: endDate } });
}

const createpdf = async (startDate: Date, endDate: Date): Promise<Buffer> => {
    const data = await getReportsbyDates(startDate, endDate);
    const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }, // Márgenes
    });

    let pdfData: Buffer[] = [];
    doc.on('data', chunk => {
        pdfData.push(chunk);
    });

    const addPage = (pageIndex: number) => {
        if (pageIndex > 0) {
            doc.addPage();
        }

        // Encabezado
        doc.image(path.join(__dirname, '..', '..', 'public', 'CECYTE_Logo.png'), 50, 50, { width: 100 });
        doc
            .font('Helvetica-Bold')
            .fontSize(20)
            .text('Hoja de reportes por fecha', { align: 'center' });

        doc
            .fontSize(10)
            .text(`Desde la fecha: ${startDate.toISOString().split('T')[0]} hasta: ${endDate.toISOString().split('T')[0]}`, { align: 'center' })
            .moveDown(0.5)
            .text(`Nº DE AMONESTACIONES/HOJA: ${data.length}`, { align: 'center' });
    };

    // Tabla encabezado
    const tableTop = 150;
    const rowHeight = 30;
    const colWidth = [50, 120, 200, 120, 80, 120, 80];

    const drawTableHeader = () => {
        doc
            .fontSize(8)
            .font('Helvetica-Bold');

        const headerY = tableTop;

        // Ajustar posiciones y ancho
        doc.text('Grupo', 50, headerY, { width: colWidth[0] });
        doc.text('Nombre', 130, headerY, { width: colWidth[1] });
        doc.text('Motivo', 330, headerY, { width: colWidth[2] });
        doc.text('Fecha', 580, headerY, { width: colWidth[3] });
        doc.text('Quien reporta', 680, headerY, { width: colWidth[4] });
        doc.text('Categoría', 780, headerY, { width: colWidth[5] });

        // Líneas para el encabezado
        doc.moveTo(50, headerY + rowHeight).lineTo(842 - 50, headerY + rowHeight).stroke();
    };

    const addReportsToTable = async (reports: any[], startingY: number) => {
        for (const [index, item] of reports.entries()) {
            const y = startingY + rowHeight * index;

            if (!item.student_id) {
                console.warn(`El reporte no tiene student_id: ${JSON.stringify(item)}`);
                continue;
            }

            const group = await studentsService.findStudentById(item.student_id.toString()).then(student => {
                return student?.semestre && student?.grupo ? student.semestre + student.grupo : 'N/A';
            });

            if (!item.student_name || !item.reason || !item.createdAt || !item.teacher_name || !item.category || !item.class) {
                console.warn(`Faltan datos en el reporte: ${JSON.stringify(item)}`);
                continue;
            }

            // Filas alternas
            const fillColor = index % 2 === 0 ? '#f0f0f0' : '#ffffff';
            doc.rect(50, y, 792, rowHeight).fill(fillColor);

            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#000000')
                .text(group, 50, y, { width: colWidth[0], height: rowHeight })
                .text(item.student_name, 130, y, { width: colWidth[1], height: rowHeight, ellipsis: true })
                .text(item.reason, 330, y, { width: colWidth[2], height: rowHeight, ellipsis: true })
                .text(item.createdAt ? item.createdAt.toISOString().split('T')[0] : 'N/A', 580, y, { width: colWidth[3], height: rowHeight })
                .text(item.teacher_name, 680, y, { width: colWidth[4], height: rowHeight })
                .text(item.category, 780, y, { width: colWidth[5], height: rowHeight })
                .text(item.class, 880, y, { width: colWidth[6], height: rowHeight });

            // Líneas para las filas
            doc.moveTo(50, y + rowHeight).lineTo(842 - 50, y + rowHeight).stroke();
        }
    };

    const reportsPerPage = 10; // Limitar reportes por página
    for (let i = 0; i < data.length; i += reportsPerPage) {
        const pageIndex = Math.floor(i / reportsPerPage);
        addPage(pageIndex);
        drawTableHeader();
        const currentReports = data.slice(i, i + reportsPerPage);
        await addReportsToTable(currentReports, tableTop + rowHeight);

        // Pie de página para firmas
        const footerY = tableTop + rowHeight * (currentReports.length + 1) + 20;
        doc.moveTo(50, footerY).lineTo(850, footerY).stroke();
        doc
            .fontSize(12)
            .text('NOMBRE Y FIRMA DEL ÁREA DE PREFECTURA', 50, footerY + 5, { align: 'center' })
            .moveDown(1)
            .text('____________________________________', 50, footerY + 25, { align: 'center' });
    }

    doc.end();

    return new Promise((resolve, reject) => {
        doc.on('end', () => {
            const finalPdfData = Buffer.concat(pdfData);
            resolve(finalPdfData);
        });

        doc.on('error', reject);
    });
};



export default {
    createReport,
    getReports,
    findReportById,
    modifyReport,
    deleteReport,
    findReportsByStudentId,
    findReportsByTeacherId,
    getReportsbyDates,
    createpdf,
}
