import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image, ImageSource } from "expo-image";
import { colors } from "@/src/Theme/colors";
import useAppTheme from "@/src/hooks/useAppTheme";

type SponsoredCardProps = {
  image: ImageSource | string | number;
  text: string;
  onPress?: () => void;
};

const SponsoredCard = ({ image, text, onPress }: SponsoredCardProps) => {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={image} style={styles.img} contentFit="cover" />
      <View style={[styles.bottomRow, { backgroundColor: colors.background }]}>
        <Text
          style={[styles.text, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {text}
        </Text>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SponsoredCard;

const styles = StyleSheet.create({
  container: {
    width: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.black,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  img: {
    width: "100%",
    height: 160,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.background,
    flex: 1,
  },
  arrow: {
    fontSize: 20,
    color: "#888",
    marginLeft: 4,
  },
});
