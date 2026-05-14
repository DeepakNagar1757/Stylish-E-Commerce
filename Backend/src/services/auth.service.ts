// src/services/auth.service.ts
import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken, signRefreshToken } from "../utils/jwt";
import { ENV } from "../config/env";
import Otp from "../models/otp.model";
import jwt from "jsonwebtoken";
import { sendOtpEmail, sendWelcomeEmail } from "./email.service"; // Import email service

const generateTokens = (userId: string) => {
  const token = signToken({ userId });
  const refreshToken = signRefreshToken({ userId });

  return { token, refreshToken };
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendRegisterOtp = async (email: string, password: string) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const otp = generateOtp();

  // Delete any existing OTPs for this email
  await Otp.deleteMany({ email });

  // Create new OTP
  await Otp.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  // Send OTP email via Brevo
  await sendOtpEmail(email, otp, "registration");

  console.log("OTP:", otp); // Keep for debugging in development

  return { message: "OTP sent successfully to your email" };
};

export const verifyRegisterOtp = async (
  email: string,
  otp: string,
  password: string,
) => {
  const record = await Otp.findOne({ email, otp });

  if (!record) throw new Error("Invalid OTP");

  if (record.expiresAt < new Date()) {
    await Otp.deleteMany({ email }); // Clean up expired OTP
    throw new Error("OTP expired. Please request a new one");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  // Delete OTP after successful registration
  await Otp.deleteMany({ email });

  // Send welcome email (non-blocking)
  sendWelcomeEmail(email).catch((err) =>
    console.error("Welcome email failed:", err),
  );

  const tokens = generateTokens(user._id.toString());

  return {
    message: "User registered successfully",
    user: {
      id: user._id,
      email: user.email,
      username: (user as any).username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      isProfileComplete: (user as any).isProfileComplete,
    },
    ...tokens,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const tokens = generateTokens(user._id.toString());

  return {
    user: {
      id: user._id,
      email: user.email,
      username: (user as any).username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      isProfileComplete: (user as any).isProfileComplete,
    },
    ...tokens,
  };
};

export const refreshToken = (token: string) => {
  const decoded = jwt.verify(token, ENV.REFRESH_SECRET!);

  const newAccessToken = signToken({ userId: (decoded as any).userId });

  return { token: newAccessToken };
};

export const sendForgotOtp = async (email: string) => {
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No account found with this email");
  }

  const otp = generateOtp();

  // Delete any existing OTPs
  await Otp.deleteMany({ email });

  await Otp.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  // Send OTP email via Brevo
  await sendOtpEmail(email, otp, "forgot-password");

  console.log("OTP:", otp); // Keep for debugging

  return { message: "Password reset OTP sent to your email" };
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const record = await Otp.findOne({ email, otp });

  if (!record) throw new Error("Invalid OTP");

  if (record.expiresAt < new Date()) {
    await Otp.deleteMany({ email });
    throw new Error("OTP expired. Please request a new one");
  }

  const hashedPassword = await hashPassword(newPassword);

  await User.updateOne({ email }, { password: hashedPassword });

  // Delete OTP after successful reset
  await Otp.deleteMany({ email });

  return { message: "Password reset successfully" };
};
