import { Router } from "express";
import * as wishlistController from "../controllers/wishlist.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// All wishlist routes are protected
router.use(protect);

router.get("/", wishlistController.getWishlist);
router.post("/toggle", wishlistController.toggleWishlist);
router.get("/status/:productId", wishlistController.getWishlistStatus);

export default router;
