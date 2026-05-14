import { create } from "zustand";
import { apiHandler } from "../Services/apiHandler";
import { ENDPOINTS } from "../Services/endpoints";

export type OrderStatus =
  | "PLACED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface StatusHistory {
  status: OrderStatus;
  timestamp: string;
  description?: string;
}

export interface OrderItem {
  product: {
    _id: string;
    title: string;
    image: string;
    price: number;
  };
  quantity: number;
  selectedSize?: string;
  price: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    amountPaid: number;
  };
  status: OrderStatus;
  statusHistory: StatusHistory[];
  expectedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

type OrderState = {
  orders: Order[];
  isLoading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;
};

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiHandler.get(ENDPOINTS.ORDERS.GET_ALL);
      set({ orders: response?.data || [] });
    } catch (error: any) {
      console.error("Failed to fetch orders:", error);
      set({ error: error.message || "Failed to fetch orders" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
