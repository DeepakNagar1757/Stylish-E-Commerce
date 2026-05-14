import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef } from "react";
import SafeAreaWrapper from "../Wrapper/SafeAreaWrapper";
import { colors } from "@/src/Theme/colors";
import Header from "./Header";
import LottieView from "lottie-react-native";

const Error = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => {
  const animation = useRef<LottieView>(null);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 400,
          height: 400,
        }}
        source={require("@/src/assets/lottie/something_went_wrong.json")}
      />

      <TouchableOpacity onPress={onRetry}>
        <Text style={{ color: "blue" }}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Error;

const styles = StyleSheet.create({});
