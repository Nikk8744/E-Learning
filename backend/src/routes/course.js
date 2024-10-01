import { Router } from "express";
import { createCourse, deleteCourse, enrollInCourse, getAllCourse, getAllCoursesOfTeacher, getAllEnrolledCourses, 
    getCourseById, getNewCourses, getTopRatedCourse, updateCourse } from "../controllers/course.js";
import { isTeacher, verifyJWT } from "../middlewares/authentication.js";

const router = Router();

router.route("/create").post(verifyJWT,isTeacher, createCourse);
router.route("/courses/:courseId").post(verifyJWT, enrollInCourse)

router.route("/getAll").get(getAllCourse);
router.route("/getNewCourses").get(getNewCourses);
router.route("/getTopCourses").get(getTopRatedCourse);



router.route("/:courseId").get(getCourseById);

router.route("/teacher/:teacherId").get(verifyJWT,isTeacher, getAllCoursesOfTeacher);
router.route("/student/:studentId").get(verifyJWT, getAllEnrolledCourses);

router.route("/enroll/:courseId").patch(verifyJWT, enrollInCourse);

router.route("/update").patch(verifyJWT, isTeacher, updateCourse);

router.route("/delete").delete(verifyJWT, isTeacher, deleteCourse);


export default router;