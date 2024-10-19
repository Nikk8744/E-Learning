import { Router } from "express";
import { getCourseReviews, giveReview } from "../controllers/review.js";
import { verifyJWT } from "../middlewares/authentication.js";

const router = Router();

router.route("/:courseId").post(verifyJWT, giveReview);

router.route("/allReview/:courseId").get(getCourseReviews);

export default router