import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";

import { apiHandler } from "@/src/Services/apiHandler";
import { ENDPOINTS } from "@/src/Services/endpoints";

import { HomeDashboardData } from "@/src/types/home.types";
import { AppStackParamList } from "@/src/types/navigation";

type NavigationType = NativeStackNavigationProp<AppStackParamList>;

const fetchHomeDashboard = async (): Promise<HomeDashboardData> => {
  const response = await apiHandler.get(ENDPOINTS.HOME.DASHBOARD);
  return response.data;
};

export const useHome = () => {
  const navigation = useNavigation<NavigationType>();

  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<HomeDashboardData>({
      queryKey: ["home-dashboard"],
      queryFn: fetchHomeDashboard,
      staleTime: 1000 * 60 * 5,
      retry: 2,
    });

  // Derived data
  const categories = data?.categories ?? [];
  const offerBanners = data?.offerBanners ?? [];
  const shoesBanners = data?.shoesBanners ?? [];
  const featuredProducts = data?.featuredProducts ?? [];
  const trendingProducts = data?.trendingProducts ?? [];
  const sponsored = data?.sponsored ?? [];

  const dealOfTheDay = data?.dealOfTheDay;
  const trendingDeal = data?.trendingDeal;

  const isEmpty = !isLoading && categories.length === 0;

  // Navigation handlers
  const handleSearch = useCallback(() => {
    navigation.navigate("Tabs", {
      screen: "Search",
      params: {},
    });
  }, [navigation]);

  const handleNavigateToSearch = useCallback(
    (filterType?: string, filterValue?: string) => {
      navigation.navigate("Tabs", {
        screen: "Search",
        params: { filterType, filterValue },
      });
    },
    [navigation],
  );

  const handleProductCard = useCallback(
    (id: string) => {
      navigation.navigate("ProductDetail", {
        productId: id,
      });
    },
    [navigation],
  );

  return {
    // query states
    isLoading,
    isError,
    isFetching,
    refetch,

    // derived states
    isEmpty,

    // data
    categories,
    offerBanners,
    shoesBanners,
    featuredProducts,
    trendingProducts,
    sponsored,
    dealOfTheDay,
    trendingDeal,

    // handlers
    handleSearch,
    handleNavigateToSearch,
    handleProductCard,
  };
};
