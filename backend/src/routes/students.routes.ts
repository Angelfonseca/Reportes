import studentsController from "../controllers/students.controller";
import { Router } from "express";
import {upload} from "../middlewares/multer.middleware";
import ensureAuth from "../middlewares/auth.middleware";
import tokenforTest from "../utils/jwt.util";

const router = Router();

router.post("/", ensureAuth,studentsController.createStudent);
router.get("/", ensureAuth,studentsController.getStudents);
router.get("/get/:id", ensureAuth,studentsController.getStudentById);
router.patch("/:id", ensureAuth,studentsController.patchupdateStudent);
router.patch("/report/:id", ensureAuth,studentsController.addReport);
router.delete("/:id", ensureAuth,studentsController.deleteStudent);
router.get("/username/:username", ensureAuth,studentsController.findUserbyUsername);
router.get("/usernames", ensureAuth,studentsController.getStudentsUsername);
router.post("/picture/:id", upload.single('fotografia'),ensureAuth,studentsController.addPicture);
router.post("/auth/login", studentsController.login);
router.patch("/auth/changePassword/:id", ensureAuth,studentsController.passwordChange);
router.get("/pdf/:id", ensureAuth,studentsController.createpdf);
router.delete("/fueraSistema", ensureAuth,studentsController.deleteFueraSistema);
router.post("/semestre", ensureAuth,studentsController.updateStudentsSemester);
router.get("/ensistema", ensureAuth,studentsController.allStudentsEnSistema);
router.post("/resetPoints", ensureAuth,studentsController.resetPoints);
// router.get("/test", (req, res) => { res.status(200).json({ token: tokenforTest }) }); //only for testing purposes


export default router;