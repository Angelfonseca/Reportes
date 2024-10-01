import { student } from "../interfaces/students.interface";
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const saltWorkFactor = 10;

// Definir la interfaz que extiende Document y añade comparePassword
export interface studentDocument extends student, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const studentSchema = new Schema<studentDocument>({
    nombre: { type: String, required: true },
    contrasena: { type: String, required: true },
    semestre: { type: String, required: true },
    grupo: { type: String, required: true },
    usuario: { type: String, required: true },
    fotografia: { type: String, default: 'uploads/userIcon.png' },
    reportes: [{ type: Schema.Types.ObjectId, ref: 'reports', default: [] }],
    puntos: { type: Number, default: 100 }
});

// Pre-save hook to hash password
studentSchema.pre('save', async function (next) {
    const student = this as studentDocument;
    if (!student.isModified('contrasena')) return next();
    try {
        const hash = await bcrypt.hash(student.contrasena, saltWorkFactor);
        student.contrasena = hash;
        next();
    } catch (error: any) {
        next(error);
    }
});

// Método para comparar contraseñas
studentSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const student = this as studentDocument;
    return bcrypt.compare(candidatePassword, student.contrasena);
}

const studentModel = model<studentDocument>('students', studentSchema);

export default studentModel;
