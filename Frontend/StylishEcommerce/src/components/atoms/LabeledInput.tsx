import useAppTheme from "@/src/hooks/useAppTheme";
import { colors } from "@/src/Theme/colors";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import React from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type DropDownItem = {
  label: string;
  value: string;
};

type LabeledInputProp = {
  label?: string;
  isDropDown?: boolean;
  isPassword?: boolean;
  dropDownData?: DropDownItem[];
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  multiline?: boolean;
};

const LabeledInput = ({
  label,
  isDropDown,
  isPassword,
  dropDownData,
  value,
  onChangeText,
  editable = true,
  keyboardType,
  placeholder,
  multiline,
}: LabeledInputProp) => {
  const { colors } = useAppTheme();
  // Fallback for uncontrolled usage (backward compatibility)
  const [internalValue, setInternalValue] = React.useState<string>("");
  const currentValue = value !== undefined ? value : internalValue;
  const handleChange = onChangeText || setInternalValue;

  return (
    <View style={styles.container}>
      <Text style={[styles.labelText, { color: colors.textPrimary }]}>
        {label}
      </Text>
      {isDropDown ? (
        <>
          <Dropdown
            data={dropDownData ?? []}
            labelField="label"
            valueField="value"
            value={currentValue}
            onChange={(item) => handleChange(item.value)}
            placeholder={placeholder || "Select..."}
            style={[styles.inputContainer, !editable && styles.disabledInput]}
            placeholderStyle={[styles.input, { color: colors.textSecondary }]}
            selectedTextStyle={[styles.input, { color: colors.textPrimary }]}
            disable={!editable}
          />
        </>
      ) : (
        <>
          <View
            style={[
              styles.inputContainer,
              !editable && styles.disabledInput,
              multiline && styles.multilineContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                multiline && styles.multilineInput,
                { color: colors.black },
              ]}
              secureTextEntry={isPassword}
              value={currentValue}
              onChangeText={handleChange}
              editable={editable}
              keyboardType={keyboardType}
              placeholder={placeholder}
              placeholderTextColor={colors.gray}
              multiline={multiline}
              numberOfLines={multiline ? 3 : 1}
              autoComplete="off"
              textContentType="oneTimeCode"
              passwordRules=""
              autoCorrect={false}
              spellCheck={false}
              importantForAutofill="no"
            />
          </View>
        </>
      )}
    </View>
  );
};

export default LabeledInput;

const styles = StyleSheet.create({
  container: {},
  labelText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    includeFontPadding: false,
  },
  inputContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.gray,
    marginTop: spacing.lg,
    minHeight: 50,
    justifyContent: "center",
  },
  input: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    opacity: 0.7,
  },
  multilineContainer: {
    minHeight: 80,
  },
  multilineInput: {
    textAlignVertical: "top",
  },
});
