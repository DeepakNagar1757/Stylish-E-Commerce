import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { spacing } from "@/src/Theme/spacing";
import { colors } from "@/src/Theme/colors";
import { Ionicons } from "@expo/vector-icons";
import type { Address } from "@/src/Store/addressStore";
import useAppTheme from "@/src/hooks/useAppTheme";

type AddressCardProps = {
  address: Address;
  isSelected?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  onSelect?: () => void;
  compact?: boolean;
};

const AddressCard = ({
  address,
  isSelected = false,
  onEdit,
  onDelete,
  onSetDefault,
  onSelect,
  compact = false,
}: AddressCardProps) => {
  const { colors } = useAppTheme();

  const labelIcon =
    address.label === "Home"
      ? "home-outline"
      : address.label === "Work"
        ? "briefcase-outline"
        : "location-outline";

  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactCard,
          isSelected && styles.compactCardSelected,
          { backgroundColor: colors.background },
        ]}
        onPress={onSelect}
        activeOpacity={0.7}
      >
        <Ionicons
          name={labelIcon}
          size={16}
          color={isSelected ? colors.primary : colors.textPrimary}
        />
        <Text
          style={[
            styles.compactLabel,
            isSelected && styles.compactLabelSelected,
            { color: colors.textPrimary },
          ]}
        >
          {address.label}
        </Text>
        {address.isDefault && (
          <View style={styles.defaultBadgeSmall}>
            <Text style={styles.defaultBadgeTextSmall}>Default</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        { backgroundColor: colors.backgroundSecondary },
      ]}
      onPress={onSelect}
      activeOpacity={onSelect ? 0.7 : 1}
    >
      <View style={styles.headerRow}>
        <View style={styles.labelRow}>
          <Ionicons name={labelIcon} size={18} color={colors.primary} />
          <Text style={[styles.labelText, { color: colors.textPrimary }]}>
            {address.label}
          </Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.actionRow}>
          {onEdit && (
            <TouchableOpacity
              onPress={onEdit}
              style={styles.actionBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              style={styles.actionBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={18} color="#e74c3c" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={[styles.nameText, { color: colors.textPrimary }]}>
        {address.fullName}
      </Text>
      <Text style={[styles.phoneText, { color: colors.textSecondary }]}>
        {address.phone}
      </Text>

      <Text
        style={[styles.addressText, { color: colors.textSecondary }]}
        numberOfLines={2}
      >
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ""}
      </Text>
      <Text style={[styles.addressText, { color: colors.textSecondary }]}>
        {address.city}, {address.state} - {address.pincode}
      </Text>
      <Text style={[styles.countryText, { color: colors.textSecondary }]}>
        {address.country}
      </Text>

      {!address.isDefault && onSetDefault && (
        <TouchableOpacity onPress={onSetDefault} style={styles.setDefaultBtn}>
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.radiusMd,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: "transparent",

    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  cardSelected: {
    borderColor: colors.primary,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  labelText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
  },
  defaultBadge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontFamily: fontFamily.medium,
    fontSize: 10,
    color: "#2e7d32",
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionBtn: {
    padding: 4,
  },
  nameText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },
  phoneText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: "#666",
    marginTop: 2,
  },
  addressText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    marginTop: 2,
    color: "#444",
  },
  countryText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: "#888",
    marginTop: 2,
  },
  setDefaultBtn: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
  },
  setDefaultText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.primary,
    textDecorationLine: "underline",
  },

  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: spacing.sm,
    gap: 6,
  },
  compactCardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#fff5f5",
  },
  compactLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: "#666",
  },
  compactLabelSelected: {
    color: colors.primary,
  },
  defaultBadgeSmall: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  defaultBadgeTextSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 8,
    color: "#2e7d32",
  },
});
