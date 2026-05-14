import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import StackHeader from "@/src/components/molecules/StackHeader";
import { colors } from "@/src/Theme/colors";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { FilterState } from "@/src/hooks/Useproductfilters";
import Slider from "@react-native-community/slider";
import StarRating from "@/src/components/atoms/StarRating";
import Button from "@/src/components/atoms/Button";
import useAppTheme from "@/src/hooks/useAppTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FilterScreenProps {
  navigation: any;
  route: {
    params: {
      filters: FilterState;
      onApplyFilters: (filters: FilterState) => void;
    };
  };
}

// Available filter options
const CATEGORIES = ["Men", "Women", "Kids", "Accessories", "Electronics"];
const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Green", hex: "#00FF00" },
  { name: "Pink", hex: "#FFC0CB" },
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function FilterScreen({ navigation, route }: FilterScreenProps) {
  const { colors } = useAppTheme();

  const { filters: initialFilters, onApplyFilters } = route.params;

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const inset = useSafeAreaInsets();

  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleColor = (color: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const toggleSize = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const setRating = (rating: number) => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === rating ? null : rating,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    navigation.goBack();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      categories: [],
      priceRange: [0, 10000],
      colors: [],
      sizes: [],
      rating: null,
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    navigation.goBack();
  };

  return (
    <SafeAreaWrapper>
      <StackHeader title="Filters" back={true} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Price Range */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Price Range
          </Text>
          <View style={styles.priceRangeContainer}>
            <Text style={styles.priceText}>₹{filters.priceRange[0]}</Text>
            <Text style={styles.priceText}>₹{filters.priceRange[1]}</Text>
          </View>
          <View style={styles.sliderContainer}>
            <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>
              Min
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10000}
              step={100}
              value={filters.priceRange[0]}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [value, prev.priceRange[1]],
                }))
              }
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.gray}
              thumbTintColor={colors.primary}
              // thumbSize={1}
            />
          </View>
          <View style={styles.sliderContainer}>
            <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>
              Max
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10000}
              step={100}
              value={filters.priceRange[1]}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], value],
                }))
              }
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.gray}
              thumbTintColor={colors.primary}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Categories
          </Text>
          <View style={styles.chipsContainer}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.chip,
                  { backgroundColor: colors.background },
                  filters.categories.includes(category) && styles.chipSelected,
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: colors.textPrimary },
                    filters.categories.includes(category) &&
                      styles.chipTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Colors */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Colors
          </Text>
          <View style={styles.colorsContainer}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color.name}
                style={[
                  styles.colorChip,
                  { backgroundColor: color.hex },
                  filters.colors.includes(color.name) &&
                    styles.colorChipSelected,
                  color.name === "White" && styles.colorChipWhiteBorder,
                ]}
                onPress={() => toggleColor(color.name)}
              >
                {filters.colors.includes(color.name) && (
                  <Text
                    style={[
                      styles.colorCheckmark,
                      color.name === "White" && { color: colors.primary },
                    ]}
                  >
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sizes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sizes</Text>
          <View style={styles.chipsContainer}>
            {SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeChip,
                  { backgroundColor: colors.background },
                  filters.sizes.includes(size) && styles.chipSelected,
                ]}
                onPress={() => toggleSize(size)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: colors.textPrimary },
                    filters.sizes.includes(size) && styles.chipTextSelected,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rating */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Minimum Rating
          </Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingChip,
                  { backgroundColor: colors.background },
                  filters.rating === rating && styles.chipSelected,
                ]}
                onPress={() => setRating(rating)}
              >
                <StarRating rating={rating} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={[
          styles.bottomActions,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.backgroundSecondary,
            paddingBottom: 10 + inset.bottom,
          },
        ]}
      >
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset All</Text>
        </TouchableOpacity>
        <View style={styles.applyButtonContainer}>
          <Button
            placeholder="Apply Filters"
            onPress={handleApply}
            isLoading={false}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    // color: colors.text,
    marginBottom: spacing.md,
  },
  priceRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  priceText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.primary,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  sliderLabel: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    width: 30,
  },
  slider: {
    flex: 1,
    height: 30,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.background,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    // color: colors.text,
  },
  chipTextSelected: {
    color: colors.background,
    fontFamily: fontFamily.semiBold,
  },
  colorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  colorChip: {
    width: 28,
    height: 28,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  colorChipSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  colorChipWhiteBorder: {
    borderWidth: 1,
    borderColor: colors.gray,
  },
  colorCheckmark: {
    fontSize: fontSize.xl,
    color: colors.background,
    fontFamily: fontFamily.bold,
  },
  sizeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.background,
    minWidth: 60,
    alignItems: "center",
  },
  ratingContainer: {
    gap: spacing.md,
  },
  ratingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.background,
  },
  ratingText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    // color: colors.text,
  },
  bottomActions: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundSecondary,
    paddingTop: spacing.sm,
  },
  resetButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    color: colors.primary,
  },
  applyButtonContainer: {
    flex: 1,
  },
});
