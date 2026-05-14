import { useQuery } from "@tanstack/react-query";
import { productApi } from "../services/productApi";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: productApi.getProducts,
  });
};
