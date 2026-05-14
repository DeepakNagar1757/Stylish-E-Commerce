import { Router } from "express";
import {
  createOrderController,
  verifyPaymentController,
} from "../controllers/payment.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect);

router.post("/order", createOrderController);

router.post("/verify", verifyPaymentController);

export default router;
