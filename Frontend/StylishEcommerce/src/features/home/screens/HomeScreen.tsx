import Header from "@/src/components/molecules/Header";
import SearchBar from "@/src/components/molecules/SearchBar";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { spacing } from "@/src/Theme/spacing";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import CircularChip from "@/src/components/atoms/CircularChip";
import PagerView from "react-native-pager-view";
import { Image } from "expo-image";
import OfferCard from "@/src/components/molecules/OfferCard";
import ProductCard from "@/src/components/organism/ProductCard";
import SpecialOffers from "@/src/assets/svg/specialOffers/specialOffer.svg";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import SpecialEventCard from "@/src/components/molecules/SpecialEventCard";
import SponsoredCard from "@/src/components/molecules/SponsoredCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "boneyard-js/native";
import { useHome } from "../hooks/useHome";
import Empty from "@/src/components/molecules/Empty";
import Error from "@/src/components/molecules/Error";
import { Background } from "@react-navigation/elements";
import { useAuthStore } from "@/src/Store/authStore";

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { fetchProfile } = useAuthStore();

  const { colors } = useAppTheme();

  const {
    categories,
    offerBanners,
    shoesBanners,
    featuredProducts,
    trendingProducts,
    sponsored,
    dealOfTheDay,
    trendingDeal,
    isLoading,
    isError,
    isFetching,
    isEmpty,
    refetch,

    handleSearch,
    handleNavigateToSearch,
    handleProductCard,
  } = useHome();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isError) {
    return <Error message="Something went wrong" onRetry={refetch} />;
  }

  if (isEmpty) {
    return (
      <>
        <SafeAreaWrapper backgroundColor={colors.background}>
          <Header />
          <Empty />
        </SafeAreaWrapper>
      </>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor={colors.backgroundSecondary}>
      {/* Header section */}
      <Header />

      {/* Search Bar */}
      <View style={Styles.searchBarContainer}>
        <SearchBar onPress={handleSearch} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[colors.primary]} // Android
            tintColor={colors.primary} // iOS
          />
        }
      >
        {/* Category chips */}
        <View style={Styles.skeletonSection}>
          <Skeleton name="circularChip" loading={isLoading} animate={true}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[
                Styles.chipsContainer,
                { backgroundColor: colors.background },
              ]}
              contentContainerStyle={Styles.chipsContent}
            >
              {categories.map((item) => {
                return (
                  <CircularChip
                    title={item.title}
                    imgUrl={item.image}
                    key={item._id}
                    onPress={() =>
                      handleNavigateToSearch("category", item.slug)
                    }
                  />
                );
              })}
            </ScrollView>
          </Skeleton>
        </View>

        {/* Offer Cards Carousel */}
        <View style={Styles.skeletonSection}>
          <Skeleton name="offerCard" loading={isLoading} animate={true}>
            <View style={Styles.offercardContainer}>
              <PagerView
                style={Styles.pager}
                initialPage={0}
                onPageSelected={(e) => {
                  setActiveIndex(e.nativeEvent.position);
                }}
              >
                {offerBanners.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={Styles.page}
                    activeOpacity={0.85}
                    onPress={() =>
                      handleNavigateToSearch(item.filterType, item.filterValue)
                    }
                  >
                    <Image
                      source={item.image}
                      style={Styles.image}
                      contentFit="cover"
                    />
                  </TouchableOpacity>
                ))}
              </PagerView>
              <View style={Styles.dotsContainer}>
                {offerBanners.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      Styles.dot,
                      activeIndex === index && Styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>
          </Skeleton>
        </View>

        {/* Deal of the Day */}
        {dealOfTheDay && (
          <View style={Styles.skeletonSection}>
            <Skeleton
              name="Special-Offer-Card"
              loading={isLoading}
              animate={true}
            >
              <View style={Styles.specialOffercardContainer}>
                <OfferCard
                  backgroundColor={dealOfTheDay.backgroundColor}
                  title={dealOfTheDay.title}
                  icon={dealOfTheDay.icon}
                  description={dealOfTheDay.description}
                  onPress={() =>
                    handleNavigateToSearch(
                      dealOfTheDay.filterType,
                      dealOfTheDay.filterValue,
                    )
                  }
                />
              </View>
            </Skeleton>
          </View>
        )}

        {/* Featured Products */}
        <View style={Styles.skeletonSection}>
          <Skeleton name="Product-card" loading={isLoading} animate={true}>
            <ScrollView
              horizontal={true}
              style={Styles.productContainer}
              contentContainerStyle={Styles.productContent}
              showsHorizontalScrollIndicator={false}
            >
              {featuredProducts.map((item) => {
                return (
                  <ProductCard
                    key={item._id}
                    img={item.image}
                    price={item.price}
                    title={item.title}
                    discount={item.discountPercentage}
                    originalPrice={item.originalPrice}
                    rating={item.rating}
                    inStock={item.inStock}
                    reviews={item.totalReviews}
                    subTitle={item.description}
                    onPress={() => handleProductCard(item._id)}
                  />
                );
              })}
            </ScrollView>
          </Skeleton>
        </View>

        {/* Special Offers Banner */}
        <View style={Styles.skeletonSection}>
          <Skeleton name="SpecialOffers" loading={isLoading} animate={true}>
            <View
              style={[
                Styles.SpecialOffersContainer,
                { backgroundColor: colors.background },
              ]}
            >
              <SpecialOffers style={{ marginRight: spacing.xxl }} />
              <View>
                <Text
                  style={[
                    Styles.specialOffersText,
                    { color: colors.textPrimary },
                  ]}
                >
                  Special Offers 😱
                </Text>
                <Text
                  style={[
                    Styles.specialOffersDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  We make sure you get the {"\n"} offer you need at best prices
                </Text>
              </View>
            </View>
          </Skeleton>
        </View>

        {/* Mac Banner Carousel */}
        <View style={Styles.skeletonSection}>
          <Skeleton name="specialOffer-down" loading={isLoading} animate={true}>
            <View style={Styles.offercardContainer}>
              <PagerView
                style={Styles.pager}
                initialPage={0}
                onPageSelected={(e) => {
                  setActiveIndex(e.nativeEvent.position);
                }}
              >
                {shoesBanners.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={Styles.page}
                    activeOpacity={0.85}
                    onPress={() =>
                      handleNavigateToSearch(item.filterType, item.filterValue)
                    }
                  >
                    <Image
                      source={item.image}
                      style={Styles.image}
                      contentFit="cover"
                    />
                  </TouchableOpacity>
                ))}
              </PagerView>
            </View>
          </Skeleton>
        </View>

        {/* Trending Products Card */}
        {trendingDeal && (
          <View style={Styles.skeletonSection}>
            <Skeleton
              name="Special-Offer-Card"
              loading={isLoading}
              animate={true}
            >
              <View style={Styles.specialOffercardContainer}>
                <OfferCard
                  backgroundColor={trendingDeal.backgroundColor}
                  title={trendingDeal.title}
                  icon={trendingDeal.icon}
                  description={trendingDeal.description}
                  onPress={() =>
                    handleNavigateToSearch(
                      trendingDeal.filterType,
                      trendingDeal.filterValue,
                    )
                  }
                />
              </View>
            </Skeleton>
          </View>
        )}

        {/* Trending product List */}
        <View style={Styles.skeletonSection}>
          <Skeleton name="Product-card" loading={isLoading} animate={true}>
            <ScrollView
              horizontal={true}
              style={Styles.productContainer}
              contentContainerStyle={Styles.productContent}
              showsHorizontalScrollIndicator={false}
            >
              {trendingProducts.map((item) => {
                return (
                  <ProductCard
                    key={item._id}
                    img={item.image}
                    price={item.price}
                    title={item.title}
                    discount={item.discountPercentage}
                    originalPrice={item.originalPrice}
                    rating={item.rating}
                    inStock={item.inStock}
                    reviews={item.totalReviews}
                    subTitle={item.description}
                    onPress={() => handleProductCard(item._id)}
                  />
                );
              })}
            </ScrollView>
          </Skeleton>
        </View>

        {/* Hot Summer Sale */}
        {/* <View style={Styles.skeletonSection}>
          <Skeleton name="special-event" loading={isLoading} animate={true}>
            <View style={Styles.specialEventContainer}>
              <SpecialEventCard
                imageSource={require("@/src/assets/images/HotSummerSale.png")}
                title="New Arrivals"
                subTitle="Summer' 25 Collections"
                buttonLabel="View All"
                buttonColor="#ff4d6d"
                backgroundColor="#fff"
                onPress={() => handleNavigateToSearch("tag", "new-arrival")}
              />
            </View>
          </Skeleton>
        </View> */}

        {/* Sponsored Content */}
        <View style={Styles.skeletonSection}>
          <Skeleton name="sponsor-card" loading={isLoading} animate={true}>
            <View style={Styles.sponsoredProduct}>
              <Text
                style={[Styles.sponsoredTitle, { color: colors.textPrimary }]}
              >
                Sponsored
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={Styles.sponsoredContent}
              >
                {sponsored.map((item) => (
                  <SponsoredCard
                    key={item._id}
                    image={item.image}
                    text={item.text}
                    onPress={() =>
                      handleNavigateToSearch(item.filterType, item.filterValue)
                    }
                  />
                ))}
              </ScrollView>
            </View>
          </Skeleton>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const Styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    paddingBottom: spacing.lg,
  },

  // Skeleton Section - Critical for preventing overlap
  skeletonSection: {
    overflow: "hidden",
    marginBottom: spacing.xs,
  },

  chipsContainer: {
    marginHorizontal: spacing.screenPadding,
    borderRadius: spacing.sm,
    paddingVertical: spacing.md,
  },

  chipsContent: {
    paddingHorizontal: spacing.xs,
  },

  offercardContainer: {
    marginTop: spacing.lg,
    paddingVertical: 1,
  },

  pager: {
    height: 180,
  },

  page: {
    flex: 1,
    marginHorizontal: spacing.lg,
    borderRadius: spacing.lg,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },

  dot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: 99,
    backgroundColor: "#ccc",
    marginHorizontal: spacing.xxs,
  },

  activeDot: {
    backgroundColor: "#ff4d6d",
    width: spacing.md,
    height: spacing.md,
  },

  specialOffercardContainer: {
    marginHorizontal: spacing.screenPadding,
    marginTop: spacing.lg,
  },

  // Product styles
  productContainer: {
    marginTop: spacing.lg,
  },

  productContent: {
    paddingHorizontal: spacing.lg,
  },

  // Special Offers
  SpecialOffersContainer: {
    flexDirection: "row",
    marginHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    borderRadius: spacing.xs,
    marginTop: spacing.lg,
  },

  specialOffersText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
  },

  specialOffersDescription: {
    fontFamily: fontFamily.light,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },

  // Special Event
  specialEventContainer: {
    marginHorizontal: spacing.screenPadding,
    marginTop: spacing.lg,
  },

  // Sponsored Product
  sponsoredProduct: {
    marginHorizontal: spacing.screenPadding,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },

  sponsoredTitle: {
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.medium,
    marginBottom: spacing.md,
  },

  sponsoredContent: {
    paddingVertical: spacing.xs,
  },
});
