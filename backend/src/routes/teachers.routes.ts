import teachersController from "../controllers/teachers.controller";
import { Router } from "express";
import {upload} from "../middlewares/multer.middleware";
import ensureAuth from "../middlewares/auth.middleware";
const router = Router();

router.post('/', teachersController.createTeacher);
router.get('/', ensureAuth,teachersController.getTeachers);
router.get('/get/:id', ensureAuth,teachersController.getTeacherById);
router.put('/:id', ensureAuth,teachersController.updateTeacher);
router.delete('/:id', teachersController.deleteTeacher);
router.get('/user/:usuario', ensureAuth,teachersController.getTeacherByUser);
router.post('/picture/:id', upload.single('fotografia'),ensureAuth,teachersController.uploadImage);
router.patch('/auth/changePassword/:id', ensureAuth,teachersController.changePassword);

export default router;