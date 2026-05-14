import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image, ImageSource } from "expo-image";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";

type SpecialEventCardProps = {
  onPress?: () => void;
  buttonLabel: string;
  imageSource: ImageSource | number;
  title: string;
  subTitle: string;
  backgroundColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  titleColor?: string;
  subTitleColor?: string;
};

const SpecialEventCard = ({
  onPress,
  buttonLabel,
  imageSource,
  title,
  subTitle,
  backgroundColor = "#fff",
  buttonColor = "#ff4d6d",
  buttonTextColor = "#FFFFFF",
  titleColor = "#000000",
  subTitleColor = "#555555",
}: SpecialEventCardProps) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} contentFit="cover" />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          <Text style={[styles.subTitle, { color: subTitleColor }]}>
            {subTitle}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={onPress}
          activeOpacity={0.75}
        >
          <Text style={[styles.buttonText, { color: buttonTextColor }]}>
            {buttonLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SpecialEventCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
  },
  imageContainer: {
    height: 200,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.lg,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.medium,
    lineHeight: spacing.xxl,
  },
  subTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.regular,
  },
  button: {
    borderRadius: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.xxs,
  },
  buttonText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semiBold,
  },
});
