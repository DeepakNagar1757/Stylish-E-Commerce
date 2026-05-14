import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { spacing } from "@/src/Theme/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import StarRating from "../atoms/StarRating";
import { colors } from "@/src/Theme/colors";

type ProductCard = {
  title: string;
  subTitle?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  img: string;
  inStock: boolean;
  onPress: () => void;
};

const ProductCard = ({
  title,
  subTitle,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  img,
  inStock,
  onPress,
}: ProductCard) => {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.background }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image source={img} style={styles.image} contentFit="cover" />
      <Text
        style={[styles.title, { color: colors.textPrimary }]}
        numberOfLines={1}
      >
        {title}
      </Text>
      <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
        {subTitle}
      </Text>
      <Text style={[styles.price, { color: colors.textPrimary }]}>
        ₹ {price}
      </Text>
      {(originalPrice || discount) && (
        <View style={styles.discountContainer}>
          <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
            {originalPrice}
          </Text>
          {discount && <Text style={styles.discount}>{discount}% Off</Text>}
        </View>
      )}
      <View style={styles.discountContainer}>
        <StarRating rating={rating ?? 0} />
        <Text style={[styles.reviews, { color: colors.textSecondary }]}>
          {reviews}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    width: 170,
    marginRight: spacing.md,
    borderRadius: 5,
    paddingBottom: spacing.xs,
  },
  image: {
    height: 124,
    width: "100%",
    borderRadius: 5,
  },
  title: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    lineHeight: spacing.lg,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  subTitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: spacing.lg,
    marginTop: spacing.xxs,
    paddingHorizontal: spacing.xs,
  },
  price: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xs,
    marginTop: spacing.xs,
  },
  originalPrice: {
    fontFamily: fontFamily.light,
    textDecorationLine: "line-through",
    marginRight: spacing.xxs,
  },
  discount: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: spacing.lg,
    color: colors.discount,
  },
  rating: {
    marginRight: spacing.xxs,
  },
  reviews: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: spacing.lg,
    marginLeft: spacing.xs,
  },
});
