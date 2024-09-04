import { Router } from 'express'
import { getUserProfile, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/authentication.js';

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post( verifyJWT,logoutUser)

router.route("/getProfile").get(verifyJWT, getUserProfile)

export default router