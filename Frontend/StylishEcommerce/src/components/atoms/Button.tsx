import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";

type ButtonProps = {
  onPress: () => void;
  placeholder: string;
  disabled?: boolean;
  style?: ViewStyle;
  isLoading: boolean;
};

const Button = ({
  onPress,
  placeholder,
  disabled,
  style,
  isLoading,
}: ButtonProps) => {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      onPress={!isLoading ? onPress : undefined}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      style={[
        styles.buttonContainer,
        { backgroundColor: colors.primary },
        disabled && styles.disabledButton,
        style,
      ]}
    >
      <View style={{ height: 24, justifyContent: "center" }}>
        {isLoading ? (
          <ActivityIndicator size="small" color={"#FFFFFF"} />
        ) : (
          <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
            {placeholder}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonContainer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xxl,
    lineHeight: 24,
  },
});
