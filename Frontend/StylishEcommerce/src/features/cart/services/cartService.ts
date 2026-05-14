import { apiHandler } from "@/src/Services/apiHandler";
import { ENDPOINTS } from "@/src/Services/endpoints";
import { string } from "yup";

export const cartService = {
  fetchCart: async () => {
    return apiHandler.get(ENDPOINTS.CART.GET_CART);
  },
  addToCart: async (
    productId: string,
    quantity: number,
    selectedSize: string,
  ) => {
    return apiHandler.post(ENDPOINTS.CART.ADD_TO_CART, {
      productId,
      quantity,
      selectedSize,
    });
  },
  removeFromCart: async (productId: string, selectedSize: string) => {
    return apiHandler.delete(
      ENDPOINTS.CART.REMOVE_FROM_CART(productId, selectedSize),
    );
  },
  updateCart: async (
    productId: string,
    quantity: number,
    selectedSize: string,
  ) => {
    return apiHandler.patch(ENDPOINTS.CART.UPDATE_QUANTITY, {
      productId,
      quantity,
      selectedSize,
    });
  },
  clearCart: async () => {
    return apiHandler.delete(ENDPOINTS.CART.CLEAR_CART);
  },
};
