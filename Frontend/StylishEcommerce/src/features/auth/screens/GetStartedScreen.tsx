import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { colors } from "@/src/Theme/colors";
import Button from "@/src/components/atoms/Button";
import { useAuthStore } from "@/src/Store/authStore";

const GetStartedScreen = () => {
  const { completeGetStarted } = useAuthStore();
  const handleContinue = () => {
    console.log("Get Started");
    completeGetStarted();
  };
  return (
    <ImageBackground
      source={require("../../../assets/images/GetStarted.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaWrapper backgroundColor="transparent">
        <View style={styles.contentContainer}>
          <Text style={styles.mainText}>You want Authentic, here you go!</Text>
          <Text style={styles.secondaryText}>Find it here, buy it now!</Text>
          <View style={styles.buttonContaienr}>
            <Button
              placeholder="Get Started"
              onPress={() => {
                handleContinue();
              }}
              style={styles.button}
              isLoading={false}
            />
          </View>
        </View>
      </SafeAreaWrapper>
    </ImageBackground>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: spacing.xxxl,
  },
  mainText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.ultra,
    textAlign: "center",
    color: colors.background,
    paddingHorizontal: spacing.screenPadding,
    marginHorizontal: 37,
  },
  secondaryText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    color: colors.background,
    marginTop: spacing.md,
  },
  buttonContaienr: {
    width: "100%",
    paddingHorizontal: 35,
    marginTop: 44,
  },
  button: {
    width: "auto",
  },
});
