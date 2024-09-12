import studentsController from "../controllers/students.controller";
import { Router } from "express";

const router = Router();

router.post("/", studentsController.createStudent);
router.get("/", studentsController.getStudents);
router.get("/get/:id", studentsController.getStudentById);
router.patch("/:id", studentsController.patchupdateStudent);
router.patch("/report/:id", studentsController.addReport);
router.delete("/:id", studentsController.deleteStudent);
router.get("/username/:username", studentsController.findUserbyUsername);
router.get("/usernames", studentsController.getStudentsUsername);


export default router;