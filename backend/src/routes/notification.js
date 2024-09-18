import { Router } from "express";
import { createNotification, getNotifications } from "../controllers/notification.js";
import { isTeacher, verifyJWT } from "../middlewares/authentication.js";

const router = Router();

router.use(verifyJWT)

router.route("/create").post(isTeacher, createNotification);

router.route("/getNotification").get(getNotifications);

export default router;