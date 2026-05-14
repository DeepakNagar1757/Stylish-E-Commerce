import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { colors } from "@/src/Theme/colors";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { spacing } from "@/src/Theme/spacing";

type Filter = {
  text: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  badgeCount?: any;
};

const Filter = ({ text, icon, style, onPress, badgeCount }: Filter) => {
  return (
    <>
      <TouchableOpacity
        style={[styles.container, style]}
        activeOpacity={0.75}
        onPress={onPress}
      >
        <Text style={styles.Text}>{text}</Text>
        <View>{icon}</View>
      </TouchableOpacity>

      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
    </>
  );
};

export default Filter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.background,
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
  },
  Text: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: colors.background,
    fontSize: 10,
    fontFamily: fontFamily.bold,
  },
});
