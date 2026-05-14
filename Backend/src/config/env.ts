// src/config/env.ts

import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.JWT_SECRET ||
  !process.env.REFRESH_SECRET ||
  !process.env.RAZORPAY_KEY_ID ||
  !process.env.RAZORPAY_KEY_SECRET
) {
  throw new Error(
    "JWT_SECRET, REFRESH_SECRET, RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing",
  );
}

export const ENV = {
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_SECRET: process.env.REFRESH_SECRET,

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
} as const;
