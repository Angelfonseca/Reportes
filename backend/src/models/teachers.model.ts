import { teacher } from "../interfaces/teachers.interface";
import { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcrypt';

const saltWorkFactor = 10;

const teacherSchema = new Schema<teacher>({
    nombre: { type: String, required: true },
    contrasena: { type: String, required: true },
    usuario: { type: String, required: true },
    fotografia: { type: String, default: 'uploads/userIcon.png' },
    isAdmin: { type: Boolean, required: true },
    cambioContrasena: { type: Boolean, required: true, default: false }
});

// Pre-save middleware to hash password if modified
teacherSchema.pre('save', async function (next) {
    const teacher = this as Document & teacher;

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
    const teacher = this as teacher;
    return bcrypt.compare(candidatePassword, teacher.contrasena);
};

// Create the model
const teacherModel = model<teacher>('teachers', teacherSchema);

export default teacherModel;