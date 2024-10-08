import { teacher } from "../interfaces/teachers.interface";
import { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcrypt';

const saltWorkFactor = 10;

const teacherSchema = new Schema<teacher & Document>({
    nombre: { type: String, required: true },
    contrasena: { type: String, required: true },
    usuario: { type: String, required: true },
    fotografia: { type: String, default: 'uploads/userIcon.png' },
    isAdmin: {type: Boolean, required: true}
});

teacherSchema.pre('save', async function (next) {
    const teacher = this as Document & { contrasena: string };

    if (!teacher.isModified('contrasena')) return next();

    try {
        const hash = await bcrypt.hash(teacher.contrasena, saltWorkFactor);
        teacher.contrasena = hash;
        next();
    } catch (error: any) {
        next(error);
    }
});

teacherSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const teacher = this as Document & { contrasena: string };
    return bcrypt.compare(candidatePassword, teacher.contrasena);
};

const teacherModel = model<teacher & Document>('teachers', teacherSchema);

export default teacherModel;
