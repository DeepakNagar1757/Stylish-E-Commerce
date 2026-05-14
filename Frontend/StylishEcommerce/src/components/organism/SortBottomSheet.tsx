import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import { colors } from "@/src/Theme/colors";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { SortOption } from "@/src/hooks/Useproductfilters";
import useAppTheme from "@/src/hooks/useAppTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SortBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest First" },
  { value: "customer_review", label: "Customer Review" },
  { value: "price_low_high", label: "Price: Low to High" },
  { value: "price_high_low", label: "Price: High to Low" },
];

export default function SortBottomSheet({
  visible,
  onClose,
  selectedSort,
  onSelectSort,
}: SortBottomSheetProps) {
  const { colors } = useAppTheme();
  const handleSelectSort = (sort: SortOption) => {
    onSelectSort(sort);
    onClose();
  };

  const inset = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.container, { backgroundColor: colors.background }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Sort By
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButton, { color: colors.textPrimary }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sort Options */}
          <View
            style={[
              styles.optionsContainer,
              { paddingBottom: Platform.OS === "android" ? 20 : 0 },
            ]}
          >
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  selectedSort === option.value && styles.selectedOption,
                ]}
                onPress={() => handleSelectSort(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.textPrimary },
                    selectedSort === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                {selectedSort === option.value && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: spacing.radiusXL,
    borderTopRightRadius: spacing.radiusXL,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
  },
  closeButton: {
    fontSize: fontSize.xxl,
    color: colors.textSecondary,
    fontFamily: fontFamily.semiBold,
  },
  optionsContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.md,
  },
  selectedOption: {
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusMd,
  },
  optionText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    marginHorizontal: spacing.md,
  },
  selectedOptionText: {
    fontFamily: fontFamily.semiBold,
    color: colors.primary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: spacing.md,
  },
  checkmarkText: {
    color: colors.background,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
  },
});
