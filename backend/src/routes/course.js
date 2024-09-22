import { Router } from "express";
import { createCourse, deleteCourse, getAllCourse, getCourseById, updateCourse } from "../controllers/course.js";
import { isTeacher, verifyJWT } from "../middlewares/authentication.js";

const router = Router();

router.route("/create").post(verifyJWT,isTeacher, createCourse);

router.route("/getAll").get(getAllCourse);
router.route("/:courseId").get(getCourseById);

router.route("/update").patch(verifyJWT, isTeacher, updateCourse);

router.route("/delete").delete(verifyJWT, isTeacher, deleteCourse);


export default router;