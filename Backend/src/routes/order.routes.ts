import { Router } from "express";
import { getOrders } from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", getOrders);

export default router;
