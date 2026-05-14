import { useQuery } from "@tanstack/react-query";
import { productApi } from "../services/productApi";

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
  });
};
