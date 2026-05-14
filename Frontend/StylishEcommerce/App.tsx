import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { ThemeProvider } from "./src/app/providers/ThemeProvider";
import QueryProvider from "./src/app/providers/QueryProvider";
import StoreProvider from "./src/app/providers/StoreProvider";
import { colors } from "./src/Theme/colors";
import { toastConfig } from "./src/hooks/useErrorHandlerWithToast";
import "@/src/Services/interceptor";
import useAppTheme from "./src/hooks/useAppTheme";

if (__DEV__) {
  require("./ReactotronConfig");
}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.backgroundSecondary,
  },
};

export default function App() {
  const { colors, isDark } = useAppTheme();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),

      background: colors.backgroundSecondary,
      card: colors.card,
      text: colors.textPrimary,
      border: colors.border,
      primary: colors.primary,
    },
  };
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryProvider>
          <StoreProvider>
            <NavigationContainer theme={navigationTheme}>
              <RootNavigator />
            </NavigationContainer>
            <Toast config={toastConfig} />
          </StoreProvider>
        </QueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
