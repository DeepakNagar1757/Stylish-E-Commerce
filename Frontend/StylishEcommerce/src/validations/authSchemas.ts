import * as yup from "yup";

/**
 * Common reusable rules
 */
const emailSchema = yup
  .string()
  .trim()
  .lowercase()
  .email("Enter a valid email address")
  .max(254, "Email is too long")
  .required("Email is required");

const passwordSchema = yup
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .matches(/[a-z]/, "Must contain at least one lowercase letter")
  .matches(/[A-Z]/, "Must contain at least one uppercase letter")
  .matches(/\d/, "Must contain at least one number")
  .matches(/[@$!%*?&#^()[\]{}\-_=+|\\:;"'<>,./~`]/, "Must contain at least one special character")
  .required("Password is required");

/**
 * Login Schema
 */
export const loginSchema = yup.object({
  email: emailSchema,
  password: passwordSchema
}).defined();;

/**
 * Register Schema
 */
export const registerSchema = yup.object({
  email: emailSchema,

  password: passwordSchema,

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = yup.object({
  email: emailSchema,
});