import { Request, Response } from "express";
import * as wishlistService from "../services/wishlist.service";

export const toggleWishlist = async (req: any, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId; // From protect middleware

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const result = await wishlistService.toggleWishlistItem(userId, productId);
    res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await wishlistService.getUserWishlist(userId, page, limit, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlistStatus = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const isWishlisted = await wishlistService.checkIsWishlisted(userId, productId);
    res.status(200).json({ isWishlisted });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
