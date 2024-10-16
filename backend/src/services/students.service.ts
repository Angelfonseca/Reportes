import studentModel from "../models/students.model";
import { student } from "../interfaces/students.interface";
import reportsService from "./reports.service";
import teacherModel from "../models/teachers.model";
import bcrypt from 'bcrypt';
import PDFDocument from 'pdfkit';
import {deleteImage} from '../middlewares/multer.middleware';
import path from 'path';

const createStudent = async (studentDetails: student) => {
    const otherStudent = await findUserbyUsername(studentDetails.usuario);
    if (otherStudent) {
        throw new Error('Username already exists');
    }
    return studentModel.create(studentDetails);
}

const findStudentById = async (studentId: string) => {
    return studentModel.findById(studentId);
}

const getStudents = async () => {
    return studentModel.find();
}

const modifyStudent = async (studentId: string, studentDetails: student) => {
    return studentModel.findByIdAndUpdate(studentId, studentDetails, { new: true });
}


const addReport = async (studentId: string, report: string, puntos: number) => {
    const puntosActuales = await studentModel.findById(studentId);
    if (!puntosActuales) {
        throw new Error('Student not found');
    }
    const newpuntos = puntosActuales.puntos - puntos;
    if (puntosActuales.puntos < 40) {
        return studentModel.findByIdAndUpdate(studentId, { $push: { reportes: report } }, { new: true });
    }
    return studentModel.findByIdAndUpdate(studentId, { $push: { reportes: report }, puntos: newpuntos }, { new: true });
}

const deleteStudent = async (studentId: string) => {
    return studentModel.findByIdAndDelete(studentId);
}

const findUserbyUsername = async (username: string) => {
    return studentModel.findOne({ usuario: username });
}

const returnUsernamesandNames = async () => {
    try {
        return await studentModel.find({}, { usuario: 1, nombre: 1, _id: 1 }).exec();
    } catch (error: any) {
        throw new Error('Error fetching students: ' + error.message);
    }
};

const addPicture = async (studentId: string, picture: string) => {
    return studentModel.findByIdAndUpdate(studentId, { fotografia: picture }, { new: true });
}

const login = async (credentials: any) => {
    try {
        let user = await studentModel.findOne({ usuario: credentials.username });
        console.log('Checking UserModel:', user);

        if (!user) {
            user = await teacherModel.findOne({ usuario: credentials.username });
            console.log('Checking TeacherModel:', user);
            if (!user) {
                return { error: true, message: 'INVALID CREDENTIALS' };
            }
            const isPasswordMatch = await user.comparePassword(credentials.password);
            console.log('Password match result:', isPasswordMatch);
            if (!isPasswordMatch) {
                return { error: true, message: 'INVALID CREDENTIALS' };
            }
            return { error: false, message: 'LOGIN SUCCESSFUL', user };
        }

        const isPasswordMatch = await user.comparePassword(credentials.password);
        console.log('Password match result:', isPasswordMatch);

        if (!isPasswordMatch) {
            return { error: true, message: 'INVALID CREDENTIALS' };
        }
        return { error: false, message: 'LOGIN SUCCESSFUL', user };
    } catch (error) {
        console.error('Error during login:', error);
        return { error: true, message: 'INTERNAL SERVER ERROR' };
    }
};

const passwordChange = async (studentId: string, change: boolean, newPass: string, oldPass: string) => {
    const student = await studentModel.findById(studentId);
    if (!student) {
        throw new Error('Student not found');
    }
    if (change) {
        const isPasswordMatch = await student.comparePassword(oldPass);
        if (!isPasswordMatch) {
            throw new Error('Invalid password');
        }
        const hashedPassword = await bcrypt.hash(newPass, 10);
        return studentModel.findByIdAndUpdate(studentId, { cambioContrasena: change, contrasena: hashedPassword }, { new: true });
    }
    return studentModel.findByIdAndUpdate(studentId, { cambioContrasena: change }, { new: true });
}

const findStudentsByIds = async (ids: string[]) => {
    let students = [];
    for (const id of ids) {
        const student = await studentModel.findById(id);
        if (student) {
            students.push(student);
        }
    }
    return students;
}

const updateStudentsSemeseter = async (students: any[]) => {
    students.forEach(async (student) => {
        const newSemester = student.semestre + 1;
        if (newSemester > 6) {
            return studentModel.findByIdAndUpdate(student._id, { semestre: 6, fueraSistema: true }, { new: true });
        }
        return studentModel.findByIdAndUpdate(student._id, { semestre: newSemester }, { new: true });
    }
    );
}

const deleteFueraSistema = async () => {
    const students = await studentModel.find({ fueraSistema: true });
    students.forEach(async (student) => {
        await deleteImage(student.fotografia);
    });
    return studentModel.deleteMany({ fueraSistema: true });
}


const getPdfReports = async (userId: string): Promise<Buffer> => {
    const student = await studentModel.findById(userId);
    if (!student) {
        throw new Error('Student not found');
    }

    const studentReports = student.reportes;

    // Ejecutar todas las consultas en paralelo
    const reports = await Promise.all(studentReports.map(async (reportId) => {
        const fullReport = await reportsService.findReportById(reportId.toString());
        return fullReport || null;
    }));

    // Filtrar reportes válidos
    const validReports = reports.filter(report => report !== null);

    try {
        // Crear el documento PDF
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        let pdfData: Buffer[] = [];
        doc.on('data', chunk => {
            pdfData.push(chunk);
        });

        // Ajustar la posición del logo
        doc.image(path.join(__dirname, '..', '..', 'public', 'CECYTE_Logo.png'), 50, 40, { width: 80 });

        // Encabezado
        doc
            .font('Helvetica-Bold')
            .fontSize(20)
            .text('Certificado de historial de reportes', 0, 120, { align: 'center' })
            .moveDown(1.5);

        // Fecha
        const currentDate = new Date().toLocaleDateString();
        doc
            .font('Helvetica')
            .fontSize(12)
            .text(`Fecha: ${currentDate}`, { align: 'right' })
            .moveDown(1);

        // Información del estudiante
        doc
            .font('Helvetica')
            .fontSize(12)
            .text(`Por este medio, se da a constar que el alumno: `, 50, 240, { continued: true })
            .font('Helvetica-Bold')
            .text(student.nombre, { continued: true })
            .font('Helvetica')
            .text(`, con número de folio `, { continued: true })
            .font('Helvetica-Bold')
            .text(student.usuario, { continued: true })
            .font('Helvetica')
            .text(`, tiene en su historial de reportes el siguiente contenido:`)
            .moveDown(1.5);

        // Encabezados de la tabla
        const tableTop = 290; // Más separación antes de la tabla
        const rowHeight = 25;
        const columnSpacing = 180;
        const reportTextSize = 9;

        const drawTableHeader = () => {
            doc
                .font('Helvetica-Bold')
                .fontSize(10)
                .text('No.', 50, tableTop)
                .text('Razón', 120, tableTop)
                .text('Maestro', 320, tableTop)
                .text('Fecha', 450, tableTop);

            // Línea debajo del encabezado
            doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();
        };

        const addReportsToTable = (reports: any[], startingY: number) => {
            let y = startingY;

            reports.forEach((report, index) => {
                // Controlar si se sale de la página
                if (y > 700) { // Cambiar el valor si es necesario para ajustar la tabla
                    doc.addPage();
                    y = 100;  // Reiniciar la posición Y para la nueva página
                }

                doc
                    .font('Helvetica')
                    .fontSize(reportTextSize)
                    .text((index + 1).toString(), 50, y)
                    .text(report.reason, 120, y, { width: columnSpacing })
                    .text(report.teacher_name || 'N/A', 320, y, { width: columnSpacing })
                    .text(new Date(report.createdAt).toLocaleDateString(), 450, y);

                // Línea debajo de cada fila
                doc.moveTo(50, y + 20).lineTo(550, y + 20).stroke();

                y += rowHeight;
            });

            return y; // Return the final y position
        };

        // Solo dibujar los encabezados si hay reportes válidos
        if (validReports.length > 0) {
            drawTableHeader(); // Dibuja los encabezados de la tabla
            const finalY = addReportsToTable(validReports, tableTop + rowHeight);
            
            // Verificar si el espacio es suficiente antes de la firma
            const marginBottom = 60; // Espacio requerido para la firma y el texto
            if (finalY + marginBottom > doc.page.height) {
                doc.addPage(); // Solo añadir una nueva página si es necesario
            }
        } else {
            // Si no hay reportes, agregar un mensaje y evitar los encabezados
            doc
                .font('Helvetica')
                .fontSize(12)
                .text(`El alumno no cuenta con ningún reporte de mala conducta.`, 50, tableTop, { align: 'center' })
                .moveDown(1.5);
        }

        // Función para agregar la firma en cada página
        const addSignature = () => {
            const signatureText = 'Firma de prefectura:';
            const signatureY = doc.page.height - 120; // Posición Y para la firma
            const signatureWidth = doc.widthOfString(signatureText);
            const signatureX = (doc.page.width - signatureWidth) / 2 - 200; // Posición X centrada

            doc
                .moveDown(3) // Espacio antes de la firma
                .font('Helvetica')
                .text(signatureText, signatureX, signatureY, { align: 'center' })
                .moveDown(0.5)
                .text('______________________________', signatureX, doc.y, { align: 'center' }) // Línea debajo
                .moveDown(1)
                .font('Helvetica-Bold')
                .text('Área de prefectura', signatureX, doc.y, { align: 'center' }); // Centrar área de prefectura
        };

        // Agregar la firma en la primera página
        addSignature();

        doc.end();
        
        const addPageNumbers = (doc: PDFKit.PDFDocument) => {
            const range = doc.bufferedPageRange();
            const pageHeight = 842; // Altura estándar para A4
            for (let i = 0; i < range.count; i++) {
                doc.switchToPage(i);
                const pageNumberY = pageHeight - 60; // Ajuste fino
                doc.fontSize(8).text(`Página ${i + 1} de ${range.count}`, 0, pageNumberY, { 
                    align: 'center',
                    width: doc.page.width
                });
            }
        };
        
        addPageNumbers(doc);

        return new Promise((resolve, reject) => {
            doc.on('end', () => {
                const finalPdfData = Buffer.concat(pdfData);
                resolve(finalPdfData);
            });

            doc.on('error', reject);
        });
    } catch (error: any) {
        console.error('Error creating PDF:', error);
        throw new Error('Error creating PDF: ' + error.message);
    }
};



    export default {
        createStudent,
        findStudentById,
        getStudents,
        modifyStudent,
        addReport,
        deleteStudent,
        findUserbyUsername,
        returnUsernamesandNames,
        addPicture,
        login,
        findStudentsByIds,
        passwordChange,
        getPdfReports,
        updateStudentsSemeseter,
        deleteFueraSistema
    }