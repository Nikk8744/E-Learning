import { Router } from "express";
import { createCourse, deleteCourse, getAllCourse, getCourseById, updateCourse } from "../controllers/course.js";
import { isTeacher, verifyJWT } from "../middlewares/authentication.js";

const router = Router();

router.use(verifyJWT)

router.route("/create").post(isTeacher, createCourse);

router.route("/getAll").get(getAllCourse);
router.route("/:courseId").get(getCourseById);

router.route("/update").patch(isTeacher, updateCourse);

router.route("/delete").delete(isTeacher, deleteCourse);


export default router;