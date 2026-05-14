import { Request, Response } from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../services/payment.service";
import { createOrderFromCart } from "../services/order.service";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const order = await createRazorpayOrder(amount);

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.log("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

export const verifyPaymentController = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, addressId, amount } =
      req.body;
      
    const userId = req.user!.userId;

    const isValid = verifyRazorpayPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Payment is valid, create the order in DB
    const order = await createOrderFromCart(userId, addressId, {
      razorpay_order_id,
      razorpay_payment_id,
      amountPaid: amount,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and order created successfully",
      data: order,
    });
  } catch (error: any) {
    console.log("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
};
