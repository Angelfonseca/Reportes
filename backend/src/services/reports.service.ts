import reportsModel from '../models/reports.model';
import { report } from '../interfaces/reports.interface';
import studentsService from './students.service';
const createReport = async (reportDetails: report) => {
    return reportsModel.create(reportDetails);
}
const getReports = async () => {
    return reportsModel.find();
}
const findReportById = async (reportId: string) => {
    return reportsModel.findById(reportId);
}
const modifyReport = async (reportId: string, reportDetails: report) => {
    return reportsModel.findByIdAndUpdate(reportId, reportDetails, { new: true });
}
const deleteReport = async (reportId: string) => {
    return reportsModel.findByIdAndDelete(reportId);
}
const findReportsByStudentId = async (studentId: string) => {
    return reportsModel.find({ student_id: studentId });
}
const findReportsByTeacherId = async (teacherId: string) => {
    return reportsModel.find({ teacher_id: teacherId });
}
export default {
    createReport,
    getReports,
    findReportById,
    modifyReport,
    deleteReport,
    findReportsByStudentId,
    findReportsByTeacherId
}
