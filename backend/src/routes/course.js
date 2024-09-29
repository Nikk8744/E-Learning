import { Router } from "express";
import { createCourse, deleteCourse, getAllCourse, getAllCoursesOfTeacher, getCourseById, getNewCourses, getTopRatedCourse, updateCourse } from "../controllers/course.js";
import { isTeacher, verifyJWT } from "../middlewares/authentication.js";

const router = Router();

router.route("/create").post(verifyJWT,isTeacher, createCourse);

router.route("/getAll").get(getAllCourse);
router.route("/getNewCourses").get(getNewCourses);
router.route("/getTopCourses").get(getTopRatedCourse);

router.route("/:courseId").get(getCourseById);

router.route("/:teacherId").get(isTeacher, getAllCoursesOfTeacher);

router.route("/update").patch(verifyJWT, isTeacher, updateCourse);

router.route("/delete").delete(verifyJWT, isTeacher, deleteCourse);


export default router;