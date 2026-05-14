import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import useAppTheme from "@/src/hooks/useAppTheme";
import LottieView from "lottie-react-native";
import { fontFamily, fontSize } from "@/src/Theme/typography";

const Empty = () => {
  const { colors } = useAppTheme();
  const animation = useRef<LottieView>(null);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
        }}
        source={require("@/src/assets/lottie/animation.json")}
      />

      <Text
        style={{
          fontFamily: fontFamily.bold,
          fontSize: fontSize.lg,
          color: colors.primary,
        }}
      >
        No Data Found
      </Text>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({});
