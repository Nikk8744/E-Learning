import { Router } from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cart.js";
import { verifyJWT } from "../middlewares/authentication.js";

const router = Router();
router.use(verifyJWT)

router.route("/:courseId").post(addToCart);

router.route("/getCart").get(getCart);

router.route("/:courseId").delete(removeFromCart);

export default router;