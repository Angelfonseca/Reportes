import { student} from './students.interface';
import { teacher} from './teachers.interface';

export interface report {
    student_id: student;
    student_name: string;
    reason: string;
    teacher_id: teacher;
    teacher_name: string;
    class: string;
    category: string;
    createdAt?: Date;
    updatedAt?: Date;
}