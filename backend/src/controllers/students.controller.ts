import studentsService from "../services/students.service";
import { Request, Response } from "express";
import { student } from "../interfaces/students.interface";
import path from "path";
import jwtService from "../utils/jwt.util";

const createStudent = async (req: Request, res: Response) => {
    try {
        const studentDetails = req.body;
        const newStudent = await studentsService.createStudent(studentDetails);
        res.status(201).json(newStudent);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const getStudentById = async (req: Request, res: Response) => {
    try {
        const studentId: string = req.params.id;
        const student = await studentsService.findStudentById(studentId);
        if (!student) {
            res.status(404).json({ error: "Student not found" });
        } else {
            res.status(200).json(student);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await studentsService.getStudents();
        res.status(200).json(students);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
const patchupdateStudent = async (req: Request, res: Response) => {
    try {
        const studentId: string = req.params.id;
        const studentDetails: student = req.body;
        const updatedStudent = await studentsService.modifyStudent(studentId, studentDetails);
        if (!updatedStudent) {
            res.status(404).json({ error: "Student not found" });
        } else {
            res.status(200).json(updatedStudent);
        }
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const addReport = async (req: Request, res: Response) => {
    try {
        const studentId: string = req.params.id;
        const report = req.body;
        const reportId: string = req.body.reportId;
        const updatedStudent = await studentsService.addReport(studentId, reportId, report.puntos); ;
        if (!updatedStudent) {
            res.status(404).json({ error: "Student not found" });
        } else {
            res.status(200).json(updatedStudent);
        }
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const deleteStudent = async (req: Request, res: Response) => {
    try {
        const studentId: string = req.params.id;
        const deletedStudent = await studentsService.deleteStudent(studentId);
        if (!deletedStudent) {
            res.status(404).json({ error: "Student not found" });
        } else {
            res.status(200).json(deletedStudent);
        }
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const findUserbyUsername = async (req: Request, res: Response) => {
    try {
        const username: string = req.params.username;
        const student = await studentsService.findUserbyUsername(username);
        if (!student) {
            res.status(404).json({ error: "Student not found" });
        } else {
            res.status(200).json(student);
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const getStudentsUsername = async (req: Request, res: Response) => {
    try {
        const students = await studentsService.returnUsernamesandNames();
        res.status(200).json(students);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const addPicture = async (req: Request, res: Response) => {
    try {
        const studentId: string = req.params.id;

        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        // Obtén la URL de la imagen firmada
        const pictureUrl = req.file.path; // Usa req.file.path o req.file.secure_url según la configuración

        // Llama al servicio para actualizar la base de datos
        const updatedStudent = await studentsService.addPicture(studentId, pictureUrl);

        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json(updatedStudent);
    } catch (error: any) {
        console.error('Error al actualizar la imagen:', error);
        res.status(500).json({ error: error.message });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const credentials = req.body;
        console.log('Received credentials:', credentials);

        const result = await studentsService.login(credentials);
        console.log('Login result:', result);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        const token = await jwtService.createToken(result.user);
        console.log('Generated token:', token);

        return res.status(200).json({ user: result.user, token });

    } catch (error) {
        console.error('Error in loginController:', error);
        return res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
    }
}


export default {
    createStudent,
    getStudentById,
    patchupdateStudent,
    addReport,
    deleteStudent,
    findUserbyUsername,
    getStudents,
    getStudentsUsername,
    addPicture,
    login
}