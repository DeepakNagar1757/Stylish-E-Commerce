import Razorpay from "razorpay";
import crypto from "crypto";
import { ENV } from "../config/env";

const razorpay = new Razorpay({
  key_id: ENV.RAZORPAY_KEY_ID,
  key_secret: ENV.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (
  amount: number,
  currency: string = "INR",
) => {
  const options = {
    amount: amount * 100, // convert rupees to paise
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  return order;
};

export const verifyRazorpayPayment = (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpay_signature;
};
