import { Router } from "express";
import { addToCart, buyCourse, getCart, removeFromCart } from "../controllers/cart.js";
import { verifyJWT } from "../middlewares/authentication.js";

const router = Router();
router.use(verifyJWT)

router.route("/:courseId").post(addToCart);
router.route("/buy/:courseId").post(verifyJWT, buyCourse);

router.route("/getCart").get(getCart);

router.route("/:courseId").delete(removeFromCart);

export default router;