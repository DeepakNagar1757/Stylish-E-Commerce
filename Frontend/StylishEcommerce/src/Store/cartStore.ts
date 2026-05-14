import { create } from "zustand";
import { cartService } from "@/src/features/cart/services/cartService";

export interface CartItem {
  product: {
    _id: string;
    title: string;
    price: number;
    image: string;
    originalPrice: number;
    discountPercentage: number;
    rating: number;
  };
  quantity: number;
  selectedSize: string;
  subtotal: number;
}

type CartState = {
  cartItems: CartItem[];
  cartTotal: number;
  isLoading: boolean;

  getCart: () => Promise<void>;
  add: (productId: string, size: string) => Promise<void>;
  updateQty: (productId: string, size: string, qty: number) => Promise<void>;
  remove: (productId: string, size: string) => Promise<void>;
};

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  cartTotal: 0,
  isLoading: false,

  getCart: async () => {
    set({ isLoading: true });
    try {
      const response = await cartService.fetchCart();
      const items = response.data.items || [];

      // Add subtotal to each item
      const processedItems = items.map((item: any) => ({
        ...item,
        subtotal: item.product.price * item.quantity,
      }));

      const total = processedItems.reduce(
        (acc: number, item: any) => acc + item.subtotal,
        0,
      );

      set({ cartItems: processedItems, cartTotal: total });
    } catch (err) {
      console.log("Failed to fetch cart", err);
    } finally {
      set({ isLoading: false });
    }
  },
  add: async (productId, size) => {
    set({ isLoading: true });
    try {
      await cartService.addToCart(productId, 1, size);
      await get().getCart();
    } finally {
      set({ isLoading: false });
    }
  },
  updateQty: async (productId, size, qty) => {
    try {
      await cartService.updateCart(productId, qty, size);
      const updatedItems = get().cartItems.map((item) => {
        if (
          item.product._id === productId &&
          item.selectedSize === size
        ) {
          const newQty = qty;
          return {
            ...item,
            quantity: newQty,
            subtotal: item.product.price * newQty,
          };
        }
        return item;
      });

      const newTotal = updatedItems.reduce(
        (acc, item) => acc + item.subtotal,
        0,
      );

      set({ cartItems: updatedItems, cartTotal: newTotal });
    } catch (err) {
      console.log("Failed to update Quantity", err);
    }
  },
  remove: async (productId, size) => {
    try {
      await cartService.removeFromCart(productId, size);
      const filteredItems = get().cartItems.filter(
        (item) =>
          !(
            item.product._id === productId && item.selectedSize === size
          ),
      );

      const newTotal = filteredItems.reduce(
        (acc, item) => acc + item.subtotal,
        0,
      );

      set({ cartItems: filteredItems, cartTotal: newTotal });
    } catch (err) {
      console.log("Failed to remove Item", err);
    }
  },
}));
