// src/navigation/AuthNavigator.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/src/features/auth/screens/LoginScreen";
import RegisterScreen from "@/src/features/auth/screens/RegisterScreen";
import OnboardingScreen from "@/src/features/auth/screens/OnboardingScreen";
import { useAuthStore } from "../Store/authStore";
import ForgetPasswordScreen from "../features/auth/screens/ForgetPasswordScreen";
import GetStartedScreen from "../features/auth/screens/GetStartedScreen";
import RegisterVerification from "../features/auth/screens/RegisterVerification";
import ResetPasswordScreen from "../features/auth/screens/ResetPasswordScreen";

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  const { hasSeenOnboarding } = useAuthStore();
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Add your screens */}
        {!hasSeenOnboarding && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="RegisterVerification"
          component={RegisterVerification}
        />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      </Stack.Navigator>
    </>
  );
}
