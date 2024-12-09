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
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
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
    const colWidth = [50, 150, 200, 100, 80, 100, 60]; // Ajustar los anchos de columna
    const totalWidth = colWidth.reduce((a, b) => a + b, 0);
    
    // Verificar si el ancho total no excede el límite de la página
    if (totalWidth > (842 - 100)) { // 100 es el margen total (50 por cada lado)
        console.warn('El ancho total de las columnas excede el ancho de la página.');
    }

    const drawTableHeader = () => {
        doc
            .fontSize(8)
            .font('Helvetica-Bold');

        const headerY = tableTop;

        // Encabezados de columna
        const headers = ['Grupo', 'Nombre', 'Motivo', 'Fecha', 'Quien reporta', 'Categoría', 'Clase'];
        let xOffset = 50;

        headers.forEach((header, index) => {
            doc.text(header, xOffset, headerY, { width: colWidth[index] });
            xOffset += colWidth[index];
        });

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
            doc.rect(50, y, totalWidth, rowHeight).fill(fillColor); // Cambiar a totalWidth

            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#000000');

            let xOffset = 50;
            const values = [group, item.student_name, item.reason, item.createdAt ? item.createdAt.toISOString().split('T')[0] : 'N/A', item.teacher_name, item.category, item.class];
            values.forEach((value, index) => {
                doc.text(value, xOffset, y + 5, { width: colWidth[index], height: rowHeight, ellipsis: true }); // Añadir un margen superior de 5
                xOffset += colWidth[index];
            });

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
        const footerY = tableTop + rowHeight * currentReports.length + 20; // Ajustar la posición Y del pie de página

        doc
            .fontSize(12)
            .text('NOMBRE Y FIRMA DEL ÁREA DE PREFECTURA', 0, footerY, { align: 'center' });
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
