import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import SplashIcon from "@/src/assets/svg/Splash.svg";
const SplashScreen = () => {
  useEffect(() => {
    console.log("Splash Screen Loaded");
  }, []);
  return (
    <View style={styles.container}>
      <SplashIcon />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
