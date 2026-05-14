import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getAspectRatio } from "@/src/Utils/getSafeAspectRatio";
import StarRating from "../atoms/StarRating";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { spacing } from "@/src/Theme/spacing";

const DynamicProductCard = ({ item, onPress }: any) => {
  const { colors } = useAppTheme();
  const aspectRatio = getAspectRatio(item);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background }]}
      activeOpacity={0.75}
      onPress={() => {
        onPress(item);
      }}
    >
      <Image
        source={{
          uri: typeof item.image === "string" ? item.image : item.image?.uri,
        }}
        style={{
          width: "100%",
          aspectRatio,
        }}
        contentFit="cover"
      />

      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: colors.textPrimary }]}
        >
          {item.title}
        </Text>
        <Text
          numberOfLines={2}
          style={[styles.description, { color: colors.dark }]}
        >
          {item.description}
        </Text>
        <Text style={[styles.price, { color: colors.textPrimary }]}>
          ₹{item.price}
        </Text>
        <View style={styles.ratingContainer}>
          <StarRating rating={item.rating} />
          <Text style={[styles.reviews, { color: colors.textMuted }]}>
            {item.totalReviews || item.reviews || 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DynamicProductCard;

const styles = StyleSheet.create({
  card: {
    margin: 6,
    borderRadius: 12,
    overflow: "hidden",
  },
  content: {
    padding: 8,
  },
  title: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
  },
  price: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviews: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    marginLeft: spacing.xs,
  },
});
