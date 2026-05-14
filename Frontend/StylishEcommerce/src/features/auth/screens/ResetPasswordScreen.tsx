import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React, { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import { useResetPassword } from "../hooks/useForgotPassword";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { colors } from "@/src/Theme/colors";
import Button from "@/src/components/atoms/Button";
import InputField from "@/src/components/atoms/InputField";
import Lock from "@/src/assets/svg/inputField/lock.svg";

type RouteParams = {
  ResetPassword: {
    email: string;
  };
};

const ResetPasswordScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'ResetPassword'>>();
  const navigation = useNavigation<any>();
  const { email } = route.params;

  const { mutate: resetPassword, isPending } = useResetPassword();

  const [otpValue, setOtpValue] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = () => {
    if (otpValue.length === 6 && newPassword.length >= 8) {
      resetPassword(
        { email, otp: otpValue, newPassword },
        {
          onSuccess: () => {
            navigation.navigate("Login");
          },
        }
      );
    }
  };

  return (
    <SafeAreaWrapper backgroundColor="#fff">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.headingText}>Reset</Text>
              <Text style={styles.headingText}>Password</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                We have sent a 6-digit code to {email}.
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <OtpInput
                numberOfDigits={6}
                focusColor={colors.primary}
                onTextChange={(text) => setOtpValue(text)}
                theme={{
                  pinCodeContainerStyle: styles.pinCodeContainer,
                  pinCodeTextStyle: styles.pinCodeText,
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <InputField
                placeholder="Enter new password"
                leftIcon={<Lock />}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                placeholder="Reset Password"
                onPress={handleReset}
                disabled={otpValue.length < 6 || newPassword.length < 8 || isPending}
                isLoading={isPending}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    marginTop: 80,
    marginHorizontal: spacing.xxxl,
  },
  headingText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.ultra,
    lineHeight: 43,
  },
  infoContainer: {
    marginTop: spacing.md,
    marginHorizontal: spacing.xxxl,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray,
    fontFamily: fontFamily.regular,
  },
  inputContainer: {
    marginTop: 40,
    marginHorizontal: spacing.xxxl,
  },
  buttonContainer: {
    marginTop: 40,
    marginHorizontal: spacing.xxxl,
  },
  pinCodeContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  pinCodeText: {
    fontFamily: fontFamily.bold,
    color: colors.primary,
  },
});
