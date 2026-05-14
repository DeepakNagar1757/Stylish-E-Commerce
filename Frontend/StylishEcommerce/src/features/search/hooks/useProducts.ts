import { useInfiniteQuery } from "@tanstack/react-query";
import { apiHandler } from "@/src/Services/apiHandler";
import { ENDPOINTS } from "@/src/Services/endpoints";

export interface ProductsResponse {
  success: boolean;
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FetchProductsParams {
  category?: string;
  tag?: string;
  deal?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  colors?: string;
  sizes?: string;
  rating?: number;
}

const fetchProducts = async (
  params: FetchProductsParams,
): Promise<ProductsResponse> => {
  const response = await apiHandler.get(ENDPOINTS.PRODUCTS.GET_ALL, params);
  return response;
};

export const useProducts = (params: FetchProductsParams) => {
  return useInfiniteQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: ({ pageParam }) =>
      fetchProducts({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
};
