import { Router } from "express";
import { addToCart, buyAllCOursesFromCart, buyCourse, getCart, removeFromCart } from "../controllers/cart.js";
import { verifyJWT } from "../middlewares/authentication.js";

const router = Router();
router.use(verifyJWT)

// router.route("/buyAllCourse").post(verifyJWT, buyAllCOursesFromCart);
router.route("/:courseId").post(verifyJWT,addToCart);
router.route("/buy/:courseId").post(verifyJWT, buyCourse);
router.route("/buyAllCourse/all").post(verifyJWT, buyAllCOursesFromCart);


router.route("/getCart").get(getCart);

router.route("/:courseId").delete(removeFromCart);

export default router;