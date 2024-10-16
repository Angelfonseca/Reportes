import teachersService from "../services/teachers.service";
import { teacher } from "../interfaces/teachers.interface";
import { Request, Response } from "express";

interface CustomRequest extends Request {
    files?: any;
}

const createTeacher = async (req: Request, res: Response) => {
    try {
        const teacherDetails: teacher = req.body;
        const newTeacher = await teachersService.createTeacher(teacherDetails);
        res.status(201).json(newTeacher);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const getTeachers = async (req: Request, res: Response) => {
    try {
        const teachers = await teachersService.getTeachers();
        res.status(200).json(teachers);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const getTeacherById = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;
        const teacher = await teachersService.getTeacherById(teacherId);
        if (!teacher) {
            res.status(404).json({ error: `Teacher with identifier ${teacherId} not found` });
        }
        res.status(200).json(teacher);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const updateTeacher = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;
        const teacherDetails: teacher = req.body;
        const updatedTeacher = await teachersService.updateTeacher(teacherId, teacherDetails);
        if (!updatedTeacher) {
            res.status(404).json({ error: `Teacher with identifier ${teacherId} not found` });
        }
        res.status(200).json(updatedTeacher);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const deleteTeacher = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;
        const deletedTeacher = await teachersService.deleteTeacher(teacherId);
        if (!deletedTeacher) {
            res.status(404).json({ error: `Teacher with identifier ${teacherId} not found` });
        }
        res.status(200).json(deletedTeacher);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const getTeacherByUser = async (req: Request, res: Response) => {
    try {
        const usuario = req.params.usuario;
        const teacher = await teachersService.getTeacherByUser(usuario);
        if (!teacher) {
            res.status(404).json({ error: `Teacher with identifier ${usuario} not found` });
        }
        res.status(200).json(teacher);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const changePicture = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const picture = req.file.path;
        const updatedTeacher = await teachersService.changePicture(teacherId, picture);
        if (!updatedTeacher) {
            res.status(404).json({ error: `Teacher with identifier ${teacherId} not found` });
        }
        res.status(200).json(updatedTeacher);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const uploadImage = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const pictureUrl = req.file.path;
        const updatedTeacher = await teachersService.uploadImage(teacherId, pictureUrl);
        console.log(updatedTeacher);

        if (!updatedTeacher) {
            return res.status(404).json({ error: `Teacher with identifier ${teacherId} not found` }); // Añadir return aquí
        }

        return res.status(200).json(updatedTeacher); // Añadir return aquí
    } catch (error: any) {
        console.error('Error al actualizar la imagen:', error);
        return res.status(500).json({ error: error.message });
    }
}


const changePassword = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;
        const newPass = req.body.newPass;
        const oldPass = req.body.oldPass;
        const cambioContrasena = req.body.change;
        const updatedTeacher = await teachersService.changePassword(teacherId, newPass, oldPass, cambioContrasena);
        if (!updatedTeacher) {
            res.status(404).json({ error: `Teacher with identifier ${teacherId} not found` });
        }
        res.status(200).json(updatedTeacher);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}


export default {
    createTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    getTeacherByUser,
    uploadImage,
    changePicture,
    changePassword
    
}