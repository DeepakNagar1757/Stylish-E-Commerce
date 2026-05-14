import { Request, Response } from "express";
import * as cartService from "../services/cart.service";

import {
  addToCartValidation,
  removeItemValidation,
  updateQuantityValidation,
} from "../validations/cart.validation";

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const cart = await cartService.getCart(userId);

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch cart",
    });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const validatedData = addToCartValidation.parse(req.body);

    const userId = req.user!.userId;

    const cart = await cartService.addItemToCart(userId, validatedData);

    return res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error: any) {
    // Zod validation error
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.flatten(),
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add item to cart",
    });
  }
};

export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const validatedData = updateQuantityValidation.parse(req.body);

    const userId = req.user!.userId;

    const cart = await cartService.updateItemQuantity(
      userId,
      validatedData.productId,
      validatedData.selectedSize,
      validatedData.quantity,
    );

    return res.status(200).json({
      success: true,
      message: "Cart item quantity updated",
      data: cart,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.flatten(),
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update quantity",
    });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const cart = await cartService.clearCart(userId);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear cart",
    });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const validatedData = removeItemValidation.parse(req.params);

    const userId = req.user!.userId;

    const cart = await cartService.removeItemFromCart(
      userId,
      validatedData.productId,
      validatedData.selectedSize,
    );

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.flatten(),
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to remove item",
    });
  }
};
