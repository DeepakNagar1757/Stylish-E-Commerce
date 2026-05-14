import { apiHandler } from "@/src/Services/apiHandler";
import { ENDPOINTS } from "@/src/Services/endpoints";

export const paymentService = {
  createOrder: async (amount: number) => {
    return apiHandler.post(ENDPOINTS.PAYMENT.CREATE_ORDER, { amount });
  },

  verifyPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    addressId: string;
    amount: number;
  }) => {
    return apiHandler.post(ENDPOINTS.PAYMENT.VERIFY_PAYMENT, paymentData);
  },
};
