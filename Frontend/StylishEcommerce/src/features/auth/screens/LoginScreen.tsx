import {
  Keyboard,
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
import { colors } from "@/src/Theme/colors";
import CloseEye from "@/src/assets/svg/inputField/closedEye.svg";
import Button from "@/src/components/atoms/Button";
import SocialSignIn from "@/src/components/molecules/SocialSignIn";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@/src/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/src/validations/authSchemas";
import { useLogin } from "../hooks/useLogin";

const LoginScreen = () => {
  type NavigationType = NativeStackNavigationProp<AuthStackParamList>;
  const navigation = useNavigation<NavigationType>();

  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  useEffect(() => {
    console.log("Login Screen Loaded");
  }, []);

  return (
    <SafeAreaWrapper backgroundColor="#fff">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headingText}>Welcome</Text>
            <Text style={styles.headingText}>Back!</Text>
          </View>

          <View style={styles.inputFieldsContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputField
                    placeholder="Username or Email"
                    leftIcon={<User />}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onSubmitEditing={Keyboard.dismiss}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </>
              )}
            />
            <View style={{ marginTop: 31 }} />
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
                    onSubmitEditing={Keyboard.dismiss}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <TouchableOpacity
            style={styles.forgetPasswordContainer}
            onPress={() => {
              navigation.navigate("ForgetPassword");
            }}
          >
            <Text style={styles.forgetText}>Forget Password?</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <Button
              placeholder="Login"
              onPress={handleSubmit((data) => {
                login(data);
              })}
              disabled={!isValid || isPending}
              isLoading={isPending}
            />
          </View>

          <View style={styles.SocialSignInContainer}>
            <SocialSignIn
              promptText="Don't have an account?"
              actionText="Sign Up"
              onActionPress={() => navigation.replace("Register")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  headerTextContainer: {
    marginTop: 80,
    marginHorizontal: spacing.xxxl,
  },
  headingText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.ultra,
    lineHeight: 43,
  },
  inputFieldsContainer: {
    marginTop: spacing.ultra,
    marginHorizontal: spacing.xxxl,
  },
  forgetPasswordContainer: {
    marginTop: spacing.sm,
    alignSelf: "flex-end",
    marginHorizontal: spacing.ultra,
  },
  forgetText: {
    color: colors.primary,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
  },
  buttonContainer: {
    marginHorizontal: spacing.xxxl,
    marginTop: 52,
  },
  SocialSignInContainer: {
    marginTop: 40,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 6,
  },
});
