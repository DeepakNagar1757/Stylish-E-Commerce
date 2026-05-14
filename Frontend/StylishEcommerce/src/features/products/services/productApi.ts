import { apiHandler } from "@/src/Services/apiHandler";
import { ENDPOINTS } from "@/src/Services/endpoints";

export const productApi = {
  getProducts: () => {
    return apiHandler.get(ENDPOINTS.PRODUCTS.GET_ALL);
  },

  getProductById: (id: string) => {
    return apiHandler.get(ENDPOINTS.PRODUCTS.GET_BY_ID(id));
  },
};
