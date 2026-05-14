import { Request, Response } from "express";
import { getUserOrders } from "../services/order.service";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const orders = await getUserOrders(userId);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};
