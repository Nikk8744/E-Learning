import { Router } from "express";
import { createCourse, deleteCourse, getAllCourse, getCourseById, updateCourse } from "../controllers/course.controller";
import { isTeacher, verifyJWT } from "../middlewares/authentication";

const router = Router();

router.use(verifyJWT)

router.route("create").post(isTeacher, createCourse);

router.route("getAll").get(getAllCourse);
router.route("getById").get(getCourseById);

router.route("update").patch(isTeacher, updateCourse);

router.route("delete").delete(isTeacher, deleteCourse);


export default router;