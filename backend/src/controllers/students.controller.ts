import studentsService from "../services/students.service";
import { Request, Response } from "express";
import { student } from "../interfaces/students.interface";

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
        const reportId: string = req.body.reportId;
        const updatedStudent = await studentsService.addReport(studentId, reportId);
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

export default {
    createStudent,
    getStudentById,
    patchupdateStudent,
    addReport,
    deleteStudent,
    findUserbyUsername,
    getStudents,
    getStudentsUsername
}