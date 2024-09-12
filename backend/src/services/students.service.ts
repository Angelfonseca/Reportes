import studentModel from "../models/students.model";
import { student } from "../interfaces/students.interface";

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

const addReport = async (studentId: string, reportId: string) => {
    return studentModel.findByIdAndUpdate(studentId, { $push: { reportes: reportId } }, { new: true });
}

const deleteStudent = async (studentId: string) => {
    return studentModel.findByIdAndDelete(studentId);
}

const findUserbyUsername = async (username: string) => {
    return studentModel.findOne({ usuario: username });
}

const returnUsernamesandNames = async () => {
    try {
        return await studentModel.find({}, { usuario: 1, nombre: 1, _id: 0 }).exec();
    } catch (error: any) {
        throw new Error('Error fetching students: ' + error.message);
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
    returnUsernamesandNames
}