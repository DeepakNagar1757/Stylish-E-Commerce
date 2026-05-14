import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";

const Loading = () => {
  const animation = useRef<LottieView>(null);
  return (
    <View>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
        }}
        source={require("@/src/assets/lottie/animation_Loading.json")}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
