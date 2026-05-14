import { z } from "zod";

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().max(50).optional().default(""),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const addressSchema = z.object({
  label: z.enum(["Home", "Work", "Other"]).optional().default("Home"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional().default(""),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(5, "Pincode must be at least 5 digits").max(10),
  country: z.string().min(1, "Country is required").optional().default("India"),
});
