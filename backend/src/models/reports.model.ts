import { report } from '../interfaces/reports.interface';
import { Schema, model, Document } from 'mongoose';

const reportSchema = new Schema<report & Document>({
    student_id: { type: Schema.Types.ObjectId, ref: 'students' },
    student_name: { type: String, required: true },
    reason: { type: String, required: true },
    teacher_id: { type: Schema.Types.ObjectId, ref: 'teachers' },
    teacher_name: { type: String, required: true },
    class: { type: String, required: true },
    category: { type: String, required: true }
}, { timestamps: true });

const reportModel = model<report & Document>('reports', reportSchema);

// Example usage to avoid unused variable warning
export default reportModel;
