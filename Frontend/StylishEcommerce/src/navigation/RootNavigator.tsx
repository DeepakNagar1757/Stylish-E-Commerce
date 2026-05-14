// src/navigation/RootNavigator.tsx

import { useEffect, useState } from "react";
import { AuthNavigator } from "./AuthNavigator";
import { AppNavigator } from "./AppNavigator";
import SplashScreen from "@/src/features/splash/screens/SplashScreen";
import { useAuthStore } from "@/src/Store/authStore";
import * as SplashScreenfonts from "expo-splash-screen";
import * as Font from "expo-font";
import "@/bones/registry.ts";

import MontserratRegular from "../assets/fonts/Montserrat-Regular.ttf";
import MontserratMedium from "../assets/fonts/Montserrat-Medium.ttf";
import MontserratSemiBold from "../assets/fonts/Montserrat-SemiBold.ttf";
import MontserratBold from "../assets/fonts/Montserrat-Bold.ttf";
import MontserratExtraBold from "../assets/fonts/Montserrat-ExtraBold.ttf";
import MontserratLight from "../assets/fonts/Montserrat-Light.ttf";
import GetStartedScreen from "../features/auth/screens/GetStartedScreen";
import OnboardingScreen from "../features/auth/screens/OnboardingScreen";

SplashScreenfonts.preventAutoHideAsync();

export function RootNavigator() {
  const {
    isAuthenticated,
    hasSeenGetStarted,
    isLoading,
    loadAuth,
    hasSeenOnboarding,
  } = useAuthStore();

  const [isReady, setIsReady] = useState(false);
  const [minDelayDone, setMinDelayDone] = useState(false);

  useEffect(() => { }, [useAuthStore]);

  // Minimum splash delay
  useEffect(() => {
    const timer = setTimeout(() => setMinDelayDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Load auth on app start
  useEffect(() => {
    loadAuth();
  }, []);

  // Load fonts
  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          MontserratRegular,
          MontserratMedium,
          MontserratSemiBold,
          MontserratBold,
          MontserratExtraBold,
          MontserratLight,
        });
      } catch (e) {
        console.warn("Fonts loading Error : ", e);
      } finally {
        setIsReady(true);
        await SplashScreenfonts.hideAsync();
      }
    }

    prepare();
  }, []);

  // Splash conditions
  if (isLoading || !isReady || !minDelayDone) {
    return <SplashScreen />;
  }

  if (!hasSeenOnboarding) {
    return <OnboardingScreen />;
  }

  // Navigation logic (clean & predictable)
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (!hasSeenGetStarted) {
    return <GetStartedScreen />;
  } else {
    return <AppNavigator />;
  }
}
