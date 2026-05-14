import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Menu from "@/src/assets/svg/header/menu.svg";
import Logo from "@/src/assets/svg/header/logo.svg";
import Profile from "@/src/assets/svg/header/profile.svg";
import { spacing } from "@/src/Theme/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";

import { Image } from "expo-image";
import Avatar from "../atoms/Avatar";
const Header = () => {

  const { colors } = useAppTheme();
  type NavigationType = NativeStackNavigationProp<AppStackParamList>;
  const navigation = useNavigation<NavigationType>();

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={[styles.menuContainer, { backgroundColor: colors.lightGray }]}
        activeOpacity={0.85}
      >
        <Menu width={24} height={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Logo />
      </View>
      <TouchableOpacity
        style={styles.profileContainer}
        activeOpacity={0.85}
        onPress={handleProfile}
      >
        <Avatar size={40} />

      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  menuContainer: {
    height: 32,
    width: 32,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {},
  profileContainer: {},
});
