import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import StackHeader from "@/src/components/molecules/StackHeader";
import PagerView from "react-native-pager-view";
import { Image } from "expo-image";
import { dummyProductImages } from "@/src/Data/dummyProductImages";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { useNavigation } from "@react-navigation/native";
import StarRating from "@/src/components/atoms/StarRating";
import ProductScreenButton from "@/src/components/atoms/ProductScreenButton";
import Location from "@/src/assets/svg/ProductDetailScreen/location.svg";
import Lock from "@/src/assets/svg/ProductDetailScreen/lock.svg";
import Return from "@/src/assets/svg/ProductDetailScreen/return.svg";
import Button from "@/src/components/atoms/Button";
import SimilarEye from "@/src/assets/svg/ProductDetailScreen/productEye.svg";
import { productCardData } from "@/src/Data/productCardData";
import ProductCard from "@/src/components/organism/ProductCard";
import Compare from "@/src/assets/svg/ProductDetailScreen/productCompare.svg";
import Cart from "@/src/assets/svg/StackHeader/cart.svg";
import Heart from "@/src/assets/svg/StackHeader/heart.svg";
import RedHeart from "@/src/assets/svg/StackHeader/redHeart.svg";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/src/types/navigation";
import { Skeleton } from "boneyard-js/native";
import { useProductById } from "../hooks/useProductById";
import { useCartStore } from "@/src/Store/cartStore";
import { useErrorHandlerWithToast } from "@/src/hooks/useErrorHandlerWithToast";
import {
  useWishlist,
  useWishlistStatus,
} from "../../wishlist/hooks/useWishlist";
import useAppTheme from "@/src/hooks/useAppTheme";
import { colors } from "@/src/Theme/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const ProductDetailScreen = ({ route }: any) => {
  const { add, isLoading: isAddingToCart } = useCartStore();
  const { showSuccess } = useErrorHandlerWithToast();

  const { colors } = useAppTheme();
  const { productId } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const { data, isLoading, isError } = useProductById(productId);
  const { isWishlisted, isLoading: isStatusLoading } =
    useWishlistStatus(productId);
  const { toggleWishlist } = useWishlist();

  const product = data?.data;
  const images = product?.image ? [product.image] : [];
  const sizes = product?.sizes || [];

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes]);

  type NavigationType = NativeStackNavigationProp<AppStackParamList>;
  const navigation = useNavigation<NavigationType>();

  const handleRightClick = () => {
    navigation.navigate("Tabs", { screen: "Cart" });
  };

  const handleBuyNow = (id: string) => {
    navigation.navigate("Cartdetail", { productId: id });
  };

  const handleCart = async (id: string) => {
    try {
      await add(id, selectedSize);

      showSuccess("Added to Cart", "The item has been added successfully!");
      navigation.navigate("Tabs", { screen: "Cart" });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (isError) return <Text>Error loading product</Text>;

  return (
    <SafeAreaWrapper backgroundColor={colors.backgroundSecondary}>
      {/* Header */}
      <StackHeader
        title=""
        rightIcon={true}
        rightIconImage={<Cart />}
        onRightClick={handleRightClick}
        secondRightIcon={true}
        secondRightIconImage={
          isWishlisted ? (
            <RedHeart fill={colors.primary} />
          ) : (
            <Heart width={20} height={16} color={colors.textPrimary} />
          )
        }
        onSecondRightClick={() => toggleWishlist(productId)}
        back={true}
      />

      {/* Scrollable Container */}
      <ScrollView contentContainerStyle={{ paddingBottom: 10 + insets.bottom }}>
        {/* Product Images */}
        <View style={styles.imageContainerWrapper}>
          <Skeleton name="offerCard" loading={isLoading}>
            <View style={styles.imageContainer}>
              <PagerView
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={(event) => {
                  setActiveIndex(event.nativeEvent.position);
                }}
              >
                {images.map((img, index) => (
                  <View key={index}>
                    <Image
                      source={{ uri: img }}
                      style={styles.image}
                      contentFit="cover"
                    />
                  </View>
                ))}
              </PagerView>
            </View>
          </Skeleton>
        </View>

        {/* Dots */}
        {!isLoading && (
          <>
            {images.length > 1 && (
              <View style={styles.dotsContainer}>
                {images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      activeIndex === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            )}
          </>
        )}

        {/* Size Selector */}

        <View style={styles.sizeSelectorContainer}>
          {!isLoading && (
            <Text
              style={[styles.sizeSelectorText, { color: colors.textPrimary }]}
            >
              Size: {selectedSize}
            </Text>
          )}

          <ScrollView
            style={styles.buttonContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {sizes.map((size: string) => {
              const isSelected = selectedSize === size;
              return (
                <Skeleton
                  name="product-details-sizeCard"
                  loading={isLoading}
                  key={size}
                >
                  <TouchableOpacity
                    activeOpacity={0.75}
                    style={[
                      styles.sizeSelectorButton,
                      { backgroundColor: colors.background },
                      isSelected && styles.activeSelectorButton,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeSelectorButtonText,
                        { color: colors.textPrimary },
                        isSelected && styles.activeSelectorButtonText,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                </Skeleton>
              );
            })}
          </ScrollView>
        </View>

        {/* Product Details */}
        <Skeleton name="product-details-info" loading={isLoading}>
          <View style={styles.productDetail}>
            <Text style={[styles.productTitle, { color: colors.textPrimary }]}>
              {product?.title}
            </Text>
            <Text
              style={[styles.productSubtitle, { color: colors.textPrimary }]}
            >
              {product?.description}
            </Text>
            <View style={styles.ratingContainer}>
              <StarRating rating={product?.rating ?? 0} />
              <Text style={styles.review}>{product?.totalReviews}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text
                style={[styles.originalPrice, { color: colors.textPrimary }]}
              >
                ₹{product?.price}
              </Text>
              <Text style={[styles.discountedPrice]}>
                ₹{product?.originalPrice}
              </Text>
              <Text style={styles.discountPercent}>
                {product?.discountPercentage}% Off
              </Text>
            </View>
            <Text
              style={[styles.productDetailText, { color: colors.textPrimary }]}
            >
              Product Details
            </Text>
            <Text
              style={[styles.productDescription, { color: colors.textPrimary }]}
            >
              {product?.detailedDescription}
            </Text>
            <View style={styles.productScreenButtton}>
              <ProductScreenButton
                icon={<Location />}
                placeholder="Nearest Store"
                textStyle={[
                  styles.productScreenButtonText,
                  { color: colors.textPrimary },
                ]}
                style={{ backgroundColor: colors.background }}
              />
              <ProductScreenButton
                icon={<Lock />}
                placeholder="VIP"
                textStyle={[
                  styles.productScreenButtonText,
                  { color: colors.textPrimary },
                ]}
                style={{ backgroundColor: colors.background }}
              />
              <ProductScreenButton
                icon={<Return />}
                placeholder="Return Policy"
                textStyle={[
                  styles.productScreenButtonText,
                  { color: colors.textPrimary },
                ]}
                style={{ backgroundColor: colors.background }}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.ActionButtonContainer}>
              <Button
                placeholder="Add to Cart"
                onPress={() => {
                  handleCart(productId);
                }}
                style={styles.button1}
                isLoading={false}
              />
              <Button
                placeholder="Buy Now"
                onPress={() => {
                  handleBuyNow(productId);
                }}
                style={styles.button2}
                isLoading={isAddingToCart}
              />
            </View>
          </View>
        </Skeleton>

        {/* Similar Products */}
        {!isLoading && (
          <Text
            style={[styles.similarProductsText, { color: colors.textPrimary }]}
          >
            Similar Products
          </Text>
        )}
        <Skeleton name="Product-card" loading={isLoading} animate={true}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 20, marginTop: 16 }}
          >
            {productCardData.map((item) => {
              return (
                <ProductCard
                  key={item.id}
                  title={item.title}
                  subTitle={item.description}
                  price={item.price}
                  img={item.image}
                  inStock={item.inStock}
                  rating={item.rating}
                  reviews={item.totalReviews}
                  onPress={() => {
                    console.log("similar pressed");
                  }}
                />
              );
            })}
          </ScrollView>
        </Skeleton>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  imageContainerWrapper: {
    marginHorizontal: spacing.screenPadding,
    borderRadius: spacing.radiusMd,
    overflow: "hidden",
    marginTop: spacing.lg,
  },
  imageContainer: {
    width: "100%",
    height: 213,
  },
  pagerView: {
    flex: 1,
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
    backgroundColor: colors.primary,
    width: spacing.md,
    height: spacing.md,
  },
  sizeSelectorContainer: {
    marginTop: spacing.lg,
  },
  sizeSelectorText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    paddingHorizontal: spacing.screenPadding,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.md,
  },
  sizeSelectorButton: {
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusSm,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.sm,
  },
  activeSelectorButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusSm,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.sm,
  },
  sizeSelectorButtonText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    color: colors.primary,
  },
  activeSelectorButtonText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    color: colors.background,
  },
  productDetail: {
    paddingHorizontal: spacing.screenPadding,
  },
  productTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
    lineHeight: spacing.xxl,
    marginTop: spacing.lg,
  },
  productSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: spacing.sm,
    alignItems: "center",
  },
  review: {
    marginLeft: spacing.sm,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.gray,
  },
  priceContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  discountedPrice: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    color: colors.gray,
    textDecorationLine: "line-through",
  },
  originalPrice: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
  },
  discountPercent: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    color: colors.primary,
  },
  productDetailText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    lineHeight: spacing.lg,
    marginTop: spacing.lg,
  },
  productDescription: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    marginTop: spacing.xxs,
  },
  productScreenButtton: {
    marginTop: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  productScreenButtonText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    marginLeft: spacing.xs,
  },
  ActionButtonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: spacing.lg,
  },
  button1: {
    backgroundColor: colors.blue,
    paddingHorizontal: spacing.sm,
  },
  button2: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
  },
  deliveryContainer: {
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    marginHorizontal: spacing.screenPadding,
    marginTop: spacing.lg,
    borderRadius: spacing.radiusMd,
  },
  deliverText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    lineHeight: spacing.lg,
  },
  deliverDate: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xxl,
  },
  similarContainer: {
    flexDirection: "row",
    marginHorizontal: spacing.screenPadding,
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  similarButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    borderRadius: spacing.radiusLg,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  similarButtonText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    marginLeft: spacing.sm,
  },
  similarProductsText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xxl,
    marginTop: spacing.lg,
    marginHorizontal: spacing.screenPadding,
  },
});
