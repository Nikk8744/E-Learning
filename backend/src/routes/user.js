import { Router } from 'express'
import { changePassword, getUserProfile, loginUser, logoutUser, registerUser, updateUserDetails } from '../controllers/user.js';
import { verifyJWT } from '../middlewares/authentication.js';

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post( verifyJWT,logoutUser)
router.route("/changePassword").post(verifyJWT, changePassword)

router.route("/getProfile").get(verifyJWT, getUserProfile)

router.route("/updateDetails").patch(verifyJWT, updateUserDetails)
// router.route("/changePassword").patch(verifyJWT, changePassword)


export default router;

