import { teacher } from "../interfaces/teachers.interface";
import { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcrypt';

const saltWorkFactor = 10;

const teacherSchema = new Schema<teacher & Document>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    identifier: { type: String, required: true },
    isAdmin: {type: Boolean, required: true}
});

teacherSchema.pre('save', async function (next) {
    const teacher = this as Document & { password: string };

    if (!teacher.isModified('password')) return next();

    try {
        const hash = await bcrypt.hash(teacher.password, saltWorkFactor);
        teacher.password = hash;
        next();
    } catch (error: any) {
        next(error);
    }
});

teacherSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const teacher = this as Document & { password: string };
    return bcrypt.compare(candidatePassword, teacher.password);
};

const teacherModel = model<teacher & Document>('teachers', teacherSchema);

export default teacherModel;
