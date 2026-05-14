import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { apiHandler } from "@/src/Services/apiHandler";
import { ENDPOINTS } from "@/src/Services/endpoints";
import { Product } from "@/src/types/home.types";
import { useErrorHandlerWithToast } from "@/src/hooks/useErrorHandlerWithToast";

export const useWishlist = (params: any = {}) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["wishlist", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiHandler.get(ENDPOINTS.WISHLIST.GET_ALL, {
        ...params,
        page: pageParam,
        limit: 20,
      });
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });

  // Flatten the items from all pages
  const wishlistItems = data?.pages.flatMap((page: any) => page.items) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;
  const loadedCount = wishlistItems.length;

  const { showSuccess, showError } = useErrorHandlerWithToast();

  // Toggle wishlist mutation
  const toggleMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await apiHandler.post(ENDPOINTS.WISHLIST.TOGGLE, { productId });
    },
    onSuccess: (response: any) => {
      // Invalidate wishlist and specific product status
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-status"] });

      const message = response?.message || "Wishlist updated successfully";
      showSuccess(message);
    },
    onError: (error) => {
      showError(error, "Wishlist Update Failed");
    },
  });

  return {
    wishlistItems,
    totalCount,
    loadedCount,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    toggleWishlist: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  };
};

export const useWishlistStatus = (productId: string) => {
  const { data, isLoading } = useQuery<{ isWishlisted: boolean }>({
    queryKey: ["wishlist-status", productId],
    queryFn: async () => {
      return await apiHandler.get(ENDPOINTS.WISHLIST.STATUS(productId));
    },
    enabled: !!productId,
  });

  return {
    isWishlisted: data?.isWishlisted ?? false,
    isLoading,
  };
};
