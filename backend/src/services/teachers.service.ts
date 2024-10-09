import teacherModel from "../models/teachers.model"
import { teacher, TeacherDocument } from "../interfaces/teachers.interface"
import upload from "../middlewares/picture.middleware";
import { Request, Response } from "express";
import studentModel from "../models/students.model";
import bcrypt from "bcrypt";

const createTeacher = async (teacherDetails: teacher) => {
    const teacher = await teacherModel.findOne({ usuario: teacherDetails.usuario });
    if (teacher) {
        throw new Error(`Teacher with identifier ${teacherDetails.usuario} already exists`);
    }
    return teacherModel.create(teacherDetails);
}

const getTeachers = async () => {
    return teacherModel.find();
}

const getTeacherById = async (teacherId: string) => {
    return teacherModel.findById(teacherId);
}

const updateTeacher = async (teacherId: string, teacherDetails: teacher) => {
    return teacherModel.findByIdAndUpdate(teacherId, teacherDetails, { new: true });
}

const deleteTeacher = async (teacherId: string) => {
    return teacherModel.findByIdAndDelete(teacherId);
}

const getTeacherByUser = async (usuario: string) => {
    return teacherModel.findOne({ usuario: usuario });
}

const changePicture = async (teacherId: string, picture: string) => {
    return teacherModel.findByIdAndUpdate(teacherId, { fotografia: picture }, { new: true });
}



const uploadImagebyImageName = async (images: any) => {
    for (const image of images) {
        const imageName = image.originalname.split('.')[0]; 
        const student = await studentModel.findOne({ usuario: imageName });

        if (student) {
            await studentModel.findByIdAndUpdate(student._id, {
                fotografia: image.secure_url, // Cambiado a secure_url
            });
        } else {
            console.log(`Estudiante no encontrado para la imagen: ${image.originalname}`);
        }
    }
};

const changePassword = async (teacherId: string, newPass: string, oldPass: string, cambioContrasena: boolean) => {
    try {
    const teacher = await teacherModel.findById(teacherId) as TeacherDocument;
    if (!teacher) {
        throw new Error(`Teacher with identifier ${teacherId} does not exist`);
    }
    if(newPass ==   oldPass){
        throw new Error(`The new password is the same as the old password`);
    }

    const isMatch = await teacher.comparePassword(oldPass);
    if (!isMatch) {
        throw new Error(`Old password does not match`);
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);
    return teacherModel.findByIdAndUpdate(teacherId, { contrasena: hashedPassword, cambioContrasena: cambioContrasena }, { new: true });
} catch (error: any) {
    throw new Error(error.message);
}
}


export default {
    createTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    getTeacherByUser,
    uploadImagebyImageName,
    changePicture,
    changePassword
}
