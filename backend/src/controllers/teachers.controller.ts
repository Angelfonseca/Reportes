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

const uploadImages = async (req: CustomRequest, res: Response) => {
    try {
        console.log('Archivos recibidos:', req.files); // Añadir este log
        const images = req.files; 

        if (!images || images.length === 0) {
            return res.status(400).json({ message: 'No se subieron imágenes' });
        }

        await teachersService.uploadImagebyImageName(images);
        console.log('Imágenes subidas y asociadas'); // Añadir este log

        res.status(200).json({ message: 'Imágenes subidas y asociadas correctamente' });
    } catch (error) {
        console.error('Error al subir imágenes:', error);
        res.status(500).json({ message: 'Error al subir imágenes', error });
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
    uploadImages,
    changePicture,
    changePassword
    
}