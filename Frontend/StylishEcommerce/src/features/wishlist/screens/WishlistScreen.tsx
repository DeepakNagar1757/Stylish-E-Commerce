import Filter from "@/src/components/atoms/Filter";
import Header from "@/src/components/molecules/Header";
import SearchBar from "@/src/components/molecules/SearchBar";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import { spacing } from "@/src/Theme/spacing";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import SortIcon from "@/src/assets/svg/filters/sort.svg";
import FilterIcon from "@/src/assets/svg/filters/filter.svg";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import MasonryList from "@react-native-seoul/masonry-list";
import DynamicProductCard from "@/src/components/organism/DynamicProductCard";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useWishlist } from "../hooks/useWishlist";
import Empty from "@/src/components/molecules/Empty";
import Error from "@/src/components/molecules/Error";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/src/types/navigation";
import { useProductFilters } from "@/src/hooks/Useproductfilters";
import SortBottomSheet from "@/src/components/organism/SortBottomSheet";
import { Skeleton } from "boneyard-js/native";
import Loading from "@/src/components/molecules/Loading";

export default function WishlistScreen() {
  const { colors } = useAppTheme();
  const {
    sortBy,
    setSortBy,
    filters,
    updateFilter,
    hasActiveFilters,
    activeFilterCount,
  } = useProductFilters();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const queryParams = React.useMemo(() => {
    const params: any = {
      sort: sortBy,
      limit: 20,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if ((filters.categories?.length || 0) > 0) {
      params.category = filters.categories[0];
    }

    if ((filters.colors?.length || 0) > 0)
      params.colors = filters.colors.join(",");
    if ((filters.sizes?.length || 0) > 0)
      params.sizes = filters.sizes.join(",");
    if (filters.priceRange?.[0] !== 0)
      params.minPrice = filters.priceRange?.[0];
    if (filters.priceRange?.[1] !== 10000)
      params.maxPrice = filters.priceRange?.[1];
    if (filters.rating) params.rating = filters.rating;

    return params;
  }, [filters, sortBy, debouncedSearch]);

  const {
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
  } = useWishlist(queryParams);

  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [sortVisible, setSortVisible] = useState(false);

  const handleItemPress = (item: any) => {
    navigation.navigate("ProductDetail", { productId: item._id });
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const screenHeight = Dimensions.get("window").height;

  return (
    <SafeAreaWrapper backgroundColor={colors.backgroundSecondary}>
      {/* header section */}
      <Header />

      {/* search Bar */}
      <View style={Styles.searchBarContainer}>
        <SearchBar
          editable
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>

      {/* Filters */}
      <View style={Styles.filterContainer}>
        <Text style={[Styles.filterText, { color: colors.textPrimary }]}>
          {totalCount} Items
        </Text>
        <View style={Styles.filtersButtonContainer}>
          <Filter
            text="Sort"
            icon={<SortIcon />}
            onPress={() => setSortVisible(true)}
            badgeCount={hasActiveFilters ? activeFilterCount : 0}
          />

          <Filter
            text="Filter"
            icon={<FilterIcon width={16} height={16} />}
            badgeCount={hasActiveFilters ? activeFilterCount : 0}
            onPress={() =>
              navigation.navigate("FilterScreen", {
                filters,
                onApplyFilters: (newFilters) => {
                  Object.entries(newFilters).forEach(([key, value]) => {
                    updateFilter(key as any, value);
                  });
                },
              })
            }
          />
        </View>
      </View>

      <MasonryList
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 8,
          paddingBottom: insets.bottom + 80,
        }}
        data={wishlistItems}
        keyExtractor={(item: any) => item._id}
        numColumns={2}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshing={isFetching}
        onRefresh={refetch}
        refreshControlProps={{
          colors: [colors.primary],
          tintColor: colors.primary,
        }}
        renderItem={({ item }: { item: any }) => (
          <DynamicProductCard
            item={{
              id: item._id,
              title: item.title,
              description: item.description,
              price: item.price,
              originalPrice: item.originalPrice,
              discount: `${item.discountPercentage}% Off`,
              image: item.image,
              rating: item.rating,
              reviews: item.totalReviews,
            }}
            onPress={() => handleItemPress(item)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View
              style={[
                Styles.centerContainer,
                {
                  height: screenHeight - insets.top - insets.bottom - 220,
                },
              ]}
            >
              <Loading />
            </View>
          ) : (
            <View
              style={[
                Styles.centerContainer,
                {
                  height: screenHeight - insets.top - insets.bottom - 220,
                },
              ]}
            >
              <Empty />
            </View>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : null
        }
      />

      <SortBottomSheet
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        selectedSort={sortBy}
        onSelectSort={setSortBy}
      />
    </SafeAreaWrapper>
  );
}

const Styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: spacing.screenPadding,
    paddingBottom: spacing.md,
  },
  filtersButtonContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  filterText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
