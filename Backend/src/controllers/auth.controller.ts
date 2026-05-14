// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import {
  // registerUser,
  loginUser,
  sendRegisterOtp,
  verifyRegisterOtp,
  sendForgotOtp,
  resetPassword as resetPasswordService,
  refreshToken,
} from "../services/auth.service";

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Refresh token required" });
    }
    const data = await refreshToken(token);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await sendRegisterOtp(email, password);
  res.json(data);
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;
  const data = await verifyRegisterOtp(email, otp, password);
  res.json(data);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await loginUser(req.body.email, req.body.password);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await sendForgotOtp(req.body.email);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp, newPassword } = req.body;
    const data = await resetPasswordService(email, otp, newPassword);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
