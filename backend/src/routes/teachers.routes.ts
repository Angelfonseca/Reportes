import teachersController from "../controllers/teachers.controller";
import { Router } from "express";
import {upload} from "../middlewares/multer.middleware";
import ensureAuth from "../middlewares/auth.middleware";
const router = Router();

router.post('/', teachersController.createTeacher);
router.get('/', teachersController.getTeachers);
router.get('/:id', teachersController.getTeacherById);
router.put('/:id', teachersController.updateTeacher);
router.delete('/:id', teachersController.deleteTeacher);
router.get('/user/:usuario', teachersController.getTeacherByUser);
router.post('/picture/:id', upload.single('fotografia'),teachersController.uploadImage);
router.patch('/auth/changePassword/:id', teachersController.changePassword);

export default router;