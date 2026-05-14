// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export const signToken = (payload: object) => {
  return jwt.sign(payload, ENV.JWT_SECRET!, {
    expiresIn: "15m",
  });
};

export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, ENV.REFRESH_SECRET!, {
    expiresIn: "7d",
  });
};
