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


const addReport = async (studentId: string, report: string, puntos: number) => {
    const puntosActuales = await studentModel.findById(studentId);
    if (!puntosActuales) {
        throw new Error('Student not found');
    }
    const newpuntos = puntosActuales.puntos - puntos;
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
        return await studentModel.find({}, { usuario: 1, nombre: 1, _id: 0 }).exec();
    } catch (error: any) {
        throw new Error('Error fetching students: ' + error.message);
    }
};

const addPicture = async (studentId: string, picture: string) => {
    return studentModel.findByIdAndUpdate(studentId, { fotografia: picture }, { new: true });
}

const login = async (credentials: any) => {
    try {
        // Buscar usuario por 'usuario'
        let user = await studentModel.findOne({ usuario: credentials.username });
        console.log('Checking UserModel:', user);

        // Si no se encuentra el usuario
        if (!user) {
            return { error: true, message: 'INVALID CREDENTIALS' };
        }

        // Usar el método 'comparePassword' directamente
        const isPasswordMatch = await user.comparePassword(credentials.password);
        console.log('Password match result:', isPasswordMatch);

        // Si la contraseña no coincide
        if (!isPasswordMatch) {
            return { error: true, message: 'INVALID CREDENTIALS' };
        }

        // Si todo es correcto, devolver el usuario
        return { error: false, message: 'LOGIN SUCCESSFUL', user };
    } catch (error) {
        console.error('Error during login:', error);
        return { error: true, message: 'INTERNAL SERVER ERROR' };
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
    login
}