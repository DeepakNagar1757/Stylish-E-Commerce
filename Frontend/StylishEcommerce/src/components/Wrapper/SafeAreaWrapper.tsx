import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
};

const SafeAreaWrapper = ({ children, backgroundColor }: Props) => {
  const { colors, isDark } = useAppTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: backgroundColor || colors.background },
      ]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor || colors.background}
      />
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
