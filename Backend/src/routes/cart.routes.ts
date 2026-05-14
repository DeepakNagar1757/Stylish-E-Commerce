import { Router } from "express";

import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller";

import { protect } from "../middlewares/auth.middleware";

const router = Router();

/**
 * Get user cart
 * GET /api/cart
 */
router.get("/", protect, getCart);

/**
 * Add item to cart
 * POST /api/cart/add
 */
router.post("/add", protect, addToCart);

/**
 * Update item quantity
 * PATCH /api/cart/update
 */
router.patch("/update", protect, updateQuantity);

/**
 * Remove item from cart
 * DELETE /api/cart/remove/:productId
 */
router.delete("/remove/:productId/:selectedSize", protect, removeFromCart);

/**
 * Clear cart
 * DELETE /api/cart/clear
 */
router.delete("/clear", protect, clearCart);

export default router;
