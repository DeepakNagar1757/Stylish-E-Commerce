// src/routes/auth.routes.ts
import express from "express";
import {
  login,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  refresh,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validations/auth.validation";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/send-otp", validate(registerSchema), sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refresh);

export default router;
