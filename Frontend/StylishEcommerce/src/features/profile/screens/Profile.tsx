import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import StackHeader from "@/src/components/molecules/StackHeader";
import { Image } from "expo-image";
import { spacing } from "@/src/Theme/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { ProfileScreens } from "@/src/Data/profileScreensData";
import ProfileMenu from "@/src/components/molecules/ProfileMenu";
import Button from "@/src/components/atoms/Button";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { useAuthStore } from "@/src/Store/authStore";
import Avatar from "@/src/components/atoms/Avatar";
import { colors } from "@/src/Theme/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Profile = () => {
  const { colors } = useAppTheme();
  const { logout, user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "You will need to login again to access your account.",
      [
        { text: "Stay", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: logout,
        },
      ],
    );
  };
  return (
    <SafeAreaWrapper backgroundColor={colors.background}>
      {/* Header */}
      <StackHeader title="Profile" back={true} />

      <ScrollView>
        {/* Profile Image */}
        <View
          style={[
            styles.profileContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View>
            <Avatar size={96} style={styles.image} />

            {/* <View style={[styles.blueCirlce, { borderColor: colors.background }]}>
              <Edit width={14} height={14} />
            </View> */}
          </View>
        </View>

        {/* User Detail */}
        <View style={styles.userContainer}>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>
            {user?.username || "Guest User"}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email || "guest@example.com"}
          </Text>
        </View>

        {/* Profile Menus */}
        {ProfileScreens.map((item) => {
          return (
            <View key={item.id} style={styles.profileMenu}>
              <ProfileMenu
                label={item.label}
                icon={item.icon}
                route={item.route}
                isTab={item.isTab}
              />
            </View>
          );
        })}
      </ScrollView>
      <View style={[styles.footer, { marginBottom: 10 + insets.bottom }]}>
        <Button placeholder="Logout" onPress={handleLogout} isLoading={false} />
      </View>
    </SafeAreaWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: spacing.lg,
  },
  userContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  userEmail: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    marginVertical: spacing.xs,
  },
  userName: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
  },
  image: {
    height: 96,
    width: 96,
    borderRadius: 99,
    marginTop: spacing.xxxl,
  },
  blueCirlce: {
    backgroundColor: colors.blue,
    height: spacing.xxxl,
    width: spacing.xxxl,
    borderRadius: 99,
    position: "absolute",
    right: 0,
    bottom: 0,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  profileMenu: {
    marginVertical: spacing.sm,
    marginHorizontal: spacing.screenPadding,
  },
  footer: {
    marginTop: "auto",
    marginBottom: spacing.xxxl,
    paddingHorizontal: spacing.screenPadding,
  },
});
