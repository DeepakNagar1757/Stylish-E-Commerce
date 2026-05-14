import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const addToCartValidation = z.object({
  productId: objectIdSchema,

  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be number")
    .positive("Quantity must be greater than 0")
    .default(1),

  selectedSize: z
    .string({
      required_error: "Selected size is required",
      invalid_type_error: "Selected size must be a string",
    })
    .trim()
    .min(1, "Selected size can't be empty"),
});

export const updateQuantityValidation = z.object({
  productId: objectIdSchema,
  selectedSize: z.string().min(1, "Selected size is required"),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .int("Quantity must be a number")
    .positive("Quantity must be greater than 0"),
});

export const removeItemValidation = z.object({
  productId: objectIdSchema,
  selectedSize: z.string().min(1, "Selected size is required"),
});
