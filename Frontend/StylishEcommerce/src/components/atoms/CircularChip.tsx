import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { useAppTheme } from "@/src/hooks/useAppTheme";

type CircularChip = {
  title: string;
  imgUrl: string;
  onPress: () => void;
};

const CircularChip = ({ title, imgUrl, onPress }: CircularChip) => {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image
        source={imgUrl}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CircularChip;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: spacing.sm,
  },
  image: {
    height: 56,
    width: 56,
    borderRadius: spacing.xxxl,
  },
  title: {
    marginTop: spacing.sm,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.regular,
  },
});
