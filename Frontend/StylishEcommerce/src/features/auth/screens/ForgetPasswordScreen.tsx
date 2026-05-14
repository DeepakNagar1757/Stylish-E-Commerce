import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { colors } from "@/src/Theme/colors";
import InputField from "@/src/components/atoms/InputField";
import Button from "@/src/components/atoms/Button";
import Mail from "@/src/assets/svg/inputField/user.svg";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "@/src/validations/authSchemas";
import { useForgotPassword } from "../hooks/useForgotPassword";

const ForgetPasswordScreen = ({ navigation }: any) => {
  const [timer, setTimer] = useState(0);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleSend = (data: any) => {
    console.log("Send / Resend Email:", data.email);
    forgotPassword(
      { email: data.email },
      {
        onSuccess: () => {
          setTimer(60);
          navigation.navigate("ResetPassword", { email: data.email });
        },
      },
    );
  };

  return (
    <SafeAreaWrapper backgroundColor="#fff">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headingText}>Forgot</Text>
            <Text style={styles.headingText}>password?</Text>
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputField
                    placeholder="Enter your email address"
                    leftIcon={<Mail />}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.infoText}>
              <Text style={styles.star}>*</Text> We will send you a mail to set
              or reset your new password
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              placeholder={timer > 0 ? `Resend in ${timer}s` : "Send"}
              onPress={handleSubmit(handleSend)}
              disabled={!isValid || timer > 0 || isPending}
              isLoading={isPending}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ForgetPasswordScreen;

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

  inputContainer: {
    marginTop: 40,
    marginHorizontal: spacing.xxxl,
  },
  resendContainer: {
    marginHorizontal: spacing.xxxl,
    marginTop: spacing.md,
  },

  infoText: {
    fontSize: 12,
    color: colors.gray,
    lineHeight: 18,
  },
  timer: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
  },

  resendText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fontFamily.bold,
  },

  star: {
    color: colors.primary,
  },

  buttonContainer: {
    marginTop: 40,
    marginHorizontal: spacing.xxxl,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});
