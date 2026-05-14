import SearchBar from "@/src/components/molecules/SearchBar";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { spacing } from "@/src/Theme/spacing";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import MasonryList from "@react-native-seoul/masonry-list";
import { useProducts } from "../hooks/useProducts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DynamicProductCard from "@/src/components/organism/DynamicProductCard";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/src/types/navigation";
import Filter from "@/src/components/atoms/Filter";
import SortIcon from "@/src/assets/svg/filters/sort.svg";
import FilterIcon from "@/src/assets/svg/filters/filter.svg";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { useProductFilters } from "@/src/hooks/Useproductfilters";
import SortBottomSheet from "@/src/components/organism/SortBottomSheet";
import { useRoute } from "@react-navigation/native";
import { AppTabParamList } from "@/src/types/navigation";
import { Skeleton } from "boneyard-js/native";
import { Keyboard } from "react-native";
import { useSearchScreen } from "../hooks/useSearchScreen";
import Loading from "@/src/components/molecules/Loading";
import Empty from "@/src/components/molecules/Empty";
import { Dimensions } from "react-native";

export default function SearchScreen() {
  const { colors } = useAppTheme();

  const insets = useSafeAreaInsets();

  const screenHeight = Dimensions.get("window").height;

  const {
    sortVisible,
    setSortVisible,
    searchText,
    setSearchText,
    sortBy,
    setSortBy,
    filters,
    setAllFilters,
    hasActiveFilters,
    activeFilterCount,
    products,
    isLoading,
    isFetching,
    isFetchingNextPage,
    refetch,
    handleEndReached,
    handleMomentumBegin,
    renderItem,
    navigation,
  } = useSearchScreen();

  return (
    <SafeAreaWrapper backgroundColor={colors.backgroundSecondary}>
      <View style={styles.searchContainer}>
        <SearchBar
          editable={true}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={[styles.filterText, { color: colors.textPrimary }]}>
          {products.length} Items
        </Text>
        <View style={styles.filtersButtonContainer}>
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
                  setAllFilters(newFilters);
                },
              })
            }
          />
        </View>
      </View>

      <MasonryList
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 8,
          paddingBottom: insets.bottom + 80,
        }}
        onScrollBeginDrag={Keyboard.dismiss}
        data={products}
        keyExtractor={(item) => item._id || item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        onMomentumScrollBegin={handleMomentumBegin}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshing={isFetching}
        onRefresh={refetch}
        refreshControlProps={{
          colors: [colors.primary],
          tintColor: colors.primary,
        }}
        ListEmptyComponent={
          isLoading ? (
            <View
              style={[
                styles.centerContainer,
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
                styles.centerContainer,
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
          <View
            style={{
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 16,
            }}
          >
            {isFetchingNextPage ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : null}
          </View>
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

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.lg,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: spacing.screenPadding,
    paddingBottom: spacing.md,
    marginTop: spacing.lg,
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
    justifyContent: "center",
    alignItems: "center",
  },
});
