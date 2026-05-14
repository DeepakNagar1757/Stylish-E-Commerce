import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React from "react";
import { OtpInput } from "react-native-otp-entry";
import { useVerifyOtp } from "../hooks/useRegister";
import { useRoute, RouteProp } from "@react-navigation/native";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { colors } from "@/src/Theme/colors";
import Button from "@/src/components/atoms/Button";

type RouteParams = {
  RegisterVerification: {
    email: string;
    password?: string;
  };
};

const RegisterVerification = () => {
  const route = useRoute<RouteProp<RouteParams, 'RegisterVerification'>>();
  const { email, password } = route.params;

  const { mutate: verifyOtp, isPending } = useVerifyOtp();

  const [otpValue, setOtpValue] = React.useState("");

  const handleVerify = () => {
    if (otpValue.length === 6) {
      verifyOtp({ email, password: password || "", otp: otpValue });
    }
  };

  return (
    <SafeAreaWrapper backgroundColor="#fff">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.headingText}>Verify</Text>
              <Text style={styles.headingText}>Account</Text>
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
                onFilled={(text) => {
                  setOtpValue(text);
                  verifyOtp({ email, password: password || "", otp: text });
                }}
                theme={{
                  pinCodeContainerStyle: styles.pinCodeContainer,
                  pinCodeTextStyle: styles.pinCodeText,
                }}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                placeholder="Verify & Create Account"
                onPress={handleVerify}
                disabled={otpValue.length < 6 || isPending}
                isLoading={isPending}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default RegisterVerification;

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
