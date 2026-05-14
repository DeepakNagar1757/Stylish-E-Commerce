import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import React from "react";
import { spacing } from "@/src/Theme/spacing";
import { colors } from "@/src/Theme/colors";
import useAppTheme from "@/src/hooks/useAppTheme";

type ProductScreenButtonProp = {
  icon?: React.ReactNode;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  textStyle?: StyleProp<TextStyle>;
};

const ProductScreenButton = ({
  icon,
  placeholder,
  style,
  textStyle,
}: ProductScreenButtonProp) => {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity style={[styles.container, style]} activeOpacity={0.75}>
      <View>{icon}</View>
      <Text style={textStyle}>{placeholder}</Text>
    </TouchableOpacity>
  );
};

export default ProductScreenButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xxs,
    borderWidth: 2,
    borderColor: colors.gray,
    borderRadius: spacing.xxs,
    backgroundColor: colors.background,
    alignItems: "center",
  },
});
