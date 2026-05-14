// src/components/atoms/InputField.tsx

import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/src/Theme/colors";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { spacing } from "@/src/Theme/spacing";

type InputFieldProps = TextInputProps & {
  leftIcon: React.ReactNode;
  isPassword?: boolean;
  rightIcon?: React.ReactNode;
  secondRightIcon?: React.ReactNode;
};

const InputField = ({
  leftIcon,
  isPassword = false,
  rightIcon,
  secondRightIcon,
  ...rest
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={[styles.inputContainer]}>
      <View style={styles.leftIcon}>{leftIcon}</View>

      <TextInput
        style={styles.input}
        placeholderTextColor={colors.gray}
        secureTextEntry={isPassword && !isVisible}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="off"
        textContentType="oneTimeCode"
        passwordRules=""
        autoCorrect={false}
        spellCheck={false}
        importantForAutofill="no"
        {...rest}
      />

      {isPassword && (
        <TouchableOpacity
          onPress={() => setIsVisible((prev) => !prev)}
          style={styles.rightIcon}
          activeOpacity={0.7}
        >
          {isVisible ? rightIcon : secondRightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 15,
    paddingHorizontal: spacing.lg,
    height: 60,
  },
  inputContainerFocused: {
    borderColor: colors.border,
  },
  leftIcon: {
    marginRight: spacing.md,
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    height: 24,
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.black,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  rightIcon: {
    marginLeft: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
});
