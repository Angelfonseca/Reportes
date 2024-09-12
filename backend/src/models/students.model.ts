import { student } from "../interfaces/students.interface";
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const saltWorkFactor = 10;

const studentSchema = new Schema<student & Document>({
    nombre: { type: String, required: true },
    contrasena: { type: String, required: true },
    semestre: { type: String, required: true },
    especialidad: { type: String, required: true },
    usuario: { type: String, required: true },
    reportes: [{ type: Schema.Types.ObjectId, ref: 'reports', default: [] }]
});

// Pre-save hook to hash password
studentSchema.pre('save', async function (next) {
    const student = this as any;
    if (!student.isModified('contrasena')) return next();
    try {
        const hash = await bcrypt.hash(student.contrasena, saltWorkFactor);
        student.contrasena = hash;
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare passwords
studentSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const student = this as any;
    return bcrypt.compare(candidatePassword, student.contrasena);
};

const studentModel = model<student & Document>('students', studentSchema);

export default studentModel;
