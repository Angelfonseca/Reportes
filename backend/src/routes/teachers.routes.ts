import teachersController from "../controllers/teachers.controller";
import { Router } from "express";
import upload from "../middlewares/picture.middleware";

const router = Router();

router.post('/', upload.single('forografia'),teachersController.createTeacher);
router.get('/', teachersController.getTeachers);
router.get('/:id', teachersController.getTeacherById);
router.put('/:id', teachersController.updateTeacher);
router.delete('/:id', teachersController.deleteTeacher);
router.get('/user/:usuario', teachersController.getTeacherByUser);
router.post('/upload-images', upload.array('fotografias'), teachersController.uploadImages);

export default router;