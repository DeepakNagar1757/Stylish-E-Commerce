import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { spacing } from "@/src/Theme/spacing";
import Filter from "../atoms/Filter";
import StarRating from "../atoms/StarRating";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import useThemeStore from "@/src/Store/themeStore";
import useAppTheme from "@/src/hooks/useAppTheme";
import { colors } from "@/src/Theme/colors";
import { Ionicons } from "@expo/vector-icons";

type CartProductCardProp = {
  img: string;
  title: string;
  variation: Record<string, string | undefined>;
  rating: number;
  discountPrice: number;
  discountPercentage: number;
  originalPrice: number;
  totalOrder: number;
  totalPrice: number;
  onPress: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
};

const CartProductCard = ({
  img,
  title,
  variation,
  rating,
  discountPrice,
  discountPercentage,
  originalPrice,
  totalOrder,
  totalPrice,
  onPress,
  onIncrement,
  onDecrement,
  onRemove,
}: CartProductCardProp) => {
  const selectedVariations = Object.values(variation).filter(
    (item): item is string => Boolean(item),
  );

  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.background }]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={styles.topContainer}>
        <Image source={img} style={styles.image} contentFit="cover" />
        <View style={{ flex: 1 }}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.title, { color: colors.textPrimary }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>

            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onRemove?.();
              }}
              style={styles.trashButton}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
          <View style={styles.variationRow}>
            <Text
              style={[styles.variationLabel, { color: colors.textPrimary }]}
            >
              Variations :
            </Text>
            {selectedVariations.map((item: string, index: number) => (
              <Filter key={index} text={item} style={styles.filter} />
            ))}
          </View>
          <View style={{ flexDirection: "row", marginTop: "auto" }}>
            <Text style={[styles.rating, { color: colors.textPrimary }]}>
              {rating}
            </Text>
            <StarRating rating={rating} />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: "auto",
              marginBottom: spacing.lg,
            }}
          >
            <View style={styles.discountPriceContainer}>
              <Text
                style={[styles.discountPrice, { color: colors.textPrimary }]}
              >
                ₹{discountPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.discountContainer}>
              <Text
                style={[
                  styles.discountPercentage,
                  { color: colors.textSecondary },
                ]}
              >
                upto {discountPercentage}% off
              </Text>
              <Text style={styles.originalPrice}>
                ₹{originalPrice.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.quantityControls}>
            <TouchableOpacity onPress={onDecrement} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>

            <Text style={[styles.totalOrder]}>{totalOrder}</Text>

            <TouchableOpacity onPress={onIncrement} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{ height: 1, backgroundColor: "gray", marginVertical: 16 }}
      />

      <View style={styles.bottomContaienr}>
        <Text style={[styles.totalOrder, { color: colors.textPrimary }]}>
          Total Order ({totalOrder}) :
        </Text>
        <Text style={[styles.totalPrice, { color: colors.textPrimary }]}>
          ₹{totalPrice.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CartProductCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusMd,

    // iOS
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOpacity: 0.25,
    shadowOffset: {
      height: 0,
      width: 2,
    },
    shadowRadius: 3.75,

    // Android
    elevation: 5,
  },
  topContainer: {
    flexDirection: "row",
  },
  image: {
    width: 168,
    height: 165,
    borderRadius: spacing.radiusMd,
  },
  // title: {
  //   fontFamily: fontFamily.semiBold,
  //   fontSize: fontSize.md,
  //   marginLeft: spacing.md,
  //   backgroundColor: "red",
  // },
  variationRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginLeft: spacing.md,
  },
  variationLabel: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  filter: {
    borderWidth: 1,
    borderColor: colors.gray,
    paddingVertical: 2,
  },
  rating: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    marginRight: spacing.sm,
    marginLeft: spacing.md,
    marginBottom: spacing.md,
  },
  discountPriceContainer: {
    borderWidth: 1,
    borderColor: colors.gray,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.radiusSm,
    marginLeft: spacing.md,
    marginTop: "auto",
  },
  discountPrice: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
  },
  discountContainer: {
    marginLeft: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },
  discountPercentage: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
  },
  originalPrice: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.gray,
    textDecorationLine: "line-through",
    marginTop: spacing.xs,
  },
  bottomContaienr: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalOrder: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
  },
  totalPrice: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    marginLeft: spacing.md,
  },
  qtyBtn: {
    padding: 5,
  },
  qtyBtnText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: spacing.md,
    flex: 1,
  },

  title: {
    flex: 1,
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    marginRight: spacing.sm,
  },

  trashButton: {
    flexShrink: 0,
  },
});
