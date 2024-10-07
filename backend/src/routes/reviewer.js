import {Router} from "express";
import { requestReviewerStatus, reviewCourse } from "../controllers/reviewer.js";
import { isReviewer, isTeacher, verifyJWT } from "../middlewares/authentication.js";

const router = Router();

router.route("/become-reviewer").post(verifyJWT, isTeacher,requestReviewerStatus)
router.route("/:courseId").post(verifyJWT, isTeacher, isReviewer, reviewCourse)

export default router;