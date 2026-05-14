// src/components/atoms/SocialSignIn.tsx

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "@/src/Theme/colors";
import Google from "@/src/assets/svg/socialLogin/google.svg";
import Apple from "@/src/assets/svg/socialLogin/apple.svg";
import Facebook from "@/src/assets/svg/socialLogin/facebook.svg";

type SocialSignInProps = {
  promptText: string;
  actionText: string;
  onActionPress: () => void;
};

const SocialSignIn = ({
  promptText,
  actionText,
  onActionPress,
}: SocialSignInProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.orText}>- OR Continue with -</Text>

      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconContainer} activeOpacity={0.8}>
          <Google />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} activeOpacity={0.8}>
          <Apple />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} activeOpacity={0.8}>
          <Facebook />
        </TouchableOpacity>
      </View>

      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>{promptText} </Text>
        <TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SocialSignIn;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 24,
  },
  orText: {
    color: colors.gray,
    fontSize: 14,
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  iconContainer: {
    height: 64,
    width: 64,
    backgroundColor: colors.social,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  promptContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  promptText: {
    color: colors.black,
    fontSize: 14,
  },
  actionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
