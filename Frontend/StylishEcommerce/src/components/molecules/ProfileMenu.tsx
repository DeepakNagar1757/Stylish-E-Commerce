import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { spacing } from "@/src/Theme/spacing";
import RightIcon from "@/src/assets/svg/profile/rightIcon.svg";
import { Ionicons } from "@expo/vector-icons";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList, AppTabParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";

type ProfileMenuProp = {
  label: string;
  icon: React.ReactNode;
  route: string;
  isTab?: boolean;
};

const ProfileMenu = ({ label, icon, route, isTab }: ProfileMenuProp) => {
  const { colors } = useAppTheme();
  type NavigationType = NativeStackNavigationProp<AppStackParamList>;
  const navigation = useNavigation<NavigationType>();
  const handlePress = () => {
    if (isTab) {
      navigation.navigate("Tabs", { screen: route as keyof AppTabParamList });
    } else {
      navigation.navigate(route as any);
    }
  };
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.lightGray }]}
      activeOpacity={0.65}
      onPress={() => handlePress()}
    >
      <View style={styles.leftContainer}>
        <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
          <Ionicons name={icon as any} size={18} color={colors.textPrimary} />
        </View>
        <Text style={[styles.labelStyle, { color: colors.textPrimary }]}>{label}</Text>
      </View>
      <RightIcon color={colors.textPrimary} />
    </TouchableOpacity>
  );
};

export default ProfileMenu;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
    alignItems: "center",
    borderRadius: spacing.radiusMd,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    height: 32,
    width: 32,
    borderRadius: spacing.radiusMd,
    justifyContent: "center",
    alignItems: "center",
  },
  labelStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    marginLeft: spacing.lg,
  },
});
