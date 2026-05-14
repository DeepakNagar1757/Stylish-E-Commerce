import React from "react";
import { Keyboard } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppStackParamList, AppTabParamList } from "@/src/types/navigation";
import { useProducts } from "./useProducts";
import { useProductFilters } from "@/src/hooks/Useproductfilters";
import { Skeleton } from "boneyard-js/native";
import DynamicProductCard from "@/src/components/organism/DynamicProductCard";

import type { RouteProp } from "@react-navigation/native";

type SearchRouteProp = RouteProp<AppTabParamList, "Search">;

export const useSearchScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const route = useRoute<SearchRouteProp>();

  const {
    sortBy,
    setSortBy,
    filters,
    updateFilter,
    setAllFilters,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useProductFilters();

  const [sortVisible, setSortVisible] = React.useState(false);

  const [searchText, setSearchText] = React.useState("");

  const [debouncedSearchText, setDebouncedSearchText] = React.useState("");

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Sync category route param
  React.useEffect(() => {
    if (route.params?.filterType === "category" && route.params?.filterValue) {
      updateFilter("categories", [route.params.filterValue]);

      navigation.setParams({
        filterType: undefined,
        filterValue: undefined,
      } as never);
    }
  }, [route.params?.filterType, route.params?.filterValue]);

  // Query params
  const queryParams = React.useMemo(() => {
    const params: any = {
      sort: sortBy,
      limit: 20,
    };

    if (debouncedSearchText) {
      params.search = debouncedSearchText;
    }

    if (
      route.params?.filterType &&
      route.params?.filterType !== "category" &&
      route.params?.filterValue
    ) {
      params[route.params.filterType] = route.params.filterValue;
    }

    if ((filters.categories?.length || 0) > 0) {
      params.category = filters.categories[0];
    } else if (
      route.params?.filterType === "category" &&
      route.params?.filterValue
    ) {
      params.category = route.params.filterValue;
    }

    if ((filters.colors?.length || 0) > 0) {
      params.colors = filters.colors.join(",");
    }

    if ((filters.sizes?.length || 0) > 0) {
      params.sizes = filters.sizes.join(",");
    }

    if (filters.priceRange?.[0] !== 0) {
      params.minPrice = filters.priceRange?.[0];
    }

    if (filters.priceRange?.[1] !== 10000) {
      params.maxPrice = filters.priceRange?.[1];
    }

    if (filters.rating) {
      params.rating = filters.rating;
    }

    return params;
  }, [filters, sortBy, route.params, debouncedSearchText]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useProducts(queryParams);

  // Flatten pages
  const products = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const totalItems = data?.pages?.[0]?.pagination?.total || 0;

  // Infinite scroll protection
  const onEndReachedCalledDuringMomentum = React.useRef(true);

  // Handlers
  const handleItemPress = React.useCallback(
    (item: any) => {
      navigation.navigate("ProductDetail", {
        productId: item._id,
      });
    },
    [navigation],
  );

  const handleEndReached = React.useCallback(() => {
    if (!onEndReachedCalledDuringMomentum.current) {
      if (hasNextPage && !isFetchingNextPage && !isLoading) {
        fetchNextPage();

        onEndReachedCalledDuringMomentum.current = true;
      }
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  const handleMomentumBegin = React.useCallback(() => {
    onEndReachedCalledDuringMomentum.current = false;
  }, []);

  const dismissKeyboard = React.useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => (
      <Skeleton name="MasonryList" loading={isLoading && products.length === 0}>
        <DynamicProductCard item={item} onPress={() => handleItemPress(item)} />
      </Skeleton>
    ),
    [isLoading, products.length, handleItemPress],
  );

  return {
    sortVisible,
    setSortVisible,
    searchText,
    setSearchText,
    sortBy,
    setSortBy,
    filters,
    setAllFilters,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
    products,
    totalItems,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    handleItemPress,
    handleEndReached,
    handleMomentumBegin,
    dismissKeyboard,
    navigation,
    renderItem,
  };
};
