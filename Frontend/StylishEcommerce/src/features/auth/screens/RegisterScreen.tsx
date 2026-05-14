import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import InputField from "@/src/components/atoms/InputField";
import User from "@/src/assets/svg/inputField/user.svg";
import Lock from "@/src/assets/svg/inputField/lock.svg";
import OpenEye from "@/src/assets/svg/inputField/openEye.svg";
import CloseEye from "@/src/assets/svg/inputField/closedEye.svg";
import { colors } from "@/src/Theme/colors";
import Button from "@/src/components/atoms/Button";
import SocialSignIn from "@/src/components/molecules/SocialSignIn";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/src/types/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/src/validations/authSchemas";
import { useSendOtp } from "../hooks/useRegister";

type NavigationType = NativeStackNavigationProp<AuthStackParamList>;

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationType>();

  const { mutate: sendOtp, isPending, error } = useSendOtp();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    sendOtp(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          navigation.navigate("RegisterVerification", {
            email: data.email,
            password: data.password,
          });
        },
      },
    );
  };
  return (
    <SafeAreaWrapper backgroundColor="#fff">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.headingText}>Create an</Text>
              <Text style={styles.headingText}>account</Text>
            </View>

            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputField
                      placeholder="Email"
                      leftIcon={<User />}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.email && (
                      <Text style={styles.errorText}>
                        {errors.email.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <View style={styles.spacing} />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputField
                      placeholder="Password"
                      leftIcon={<Lock />}
                      isPassword
                      rightIcon={<OpenEye />}
                      secondRightIcon={<CloseEye />}
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.password && (
                      <Text style={styles.errorText}>
                        {errors.password.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <View style={styles.spacing} />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputField
                      placeholder="Confirm Password"
                      leftIcon={<Lock />}
                      isPassword
                      rightIcon={<OpenEye />}
                      secondRightIcon={<CloseEye />}
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.confirmPassword && (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            <Text style={styles.termsText}>
              By clicking the <Text style={styles.highlight}>Register</Text>{" "}
              button, you agree
              {"\n"}to the public offer
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                placeholder="Create Account"
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
                isLoading={isPending}
              />
            </View>

            <View style={styles.bottomContainer}>
              <SocialSignIn
                promptText="I Already Have an Account"
                actionText="Login"
                onActionPress={() => navigation.replace("Login")}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default RegisterScreen;

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

  spacing: {
    marginTop: 20,
  },

  termsText: {
    marginTop: 20,
    marginHorizontal: spacing.xxxl,
    fontSize: 12,
    color: colors.gray,
    lineHeight: 18,
  },

  highlight: {
    color: colors.primary,
  },

  buttonContainer: {
    marginTop: 30,
    marginHorizontal: spacing.xxxl,
  },

  bottomContainer: {
    marginTop: 40,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});
