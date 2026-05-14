import { Alert, Linking, Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import StackHeader from "@/src/components/molecules/StackHeader";
import Bell from "@/src/assets/svg/notification/bell.svg";
import { colors } from "@/src/Theme/colors";
import { spacing } from "@/src/Theme/spacing";
import ToggleSwitch from "toggle-switch-react-native";
import Email from "@/src/assets/svg/notification/email.svg";
import SMS from "@/src/assets/svg/notification/sms.svg";
import DarkMode from "@/src/assets/svg/notification/darkmode.svg";
import * as Notifications from "expo-notifications";
import { useNotifications } from "../featuredHooks/Notification";
import useAppTheme from "@/src/hooks/useAppTheme";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const Notification = () => {
  const { colors } = useAppTheme();
  const {
    notification,
    email,
    sms,
    isDark,
    handlePushToggle,
    handleEmailToggle,
    handleSmsToggle,
    handleDarkMode,
  } = useNotifications();

  console.log(isDark);
  return (
    <SafeAreaWrapper>
      {/* Header section */}
      <StackHeader title="Notification" back={true} />
      <View style={{ marginTop: spacing.xxxl, gap: spacing.xl }}>
        {/* Notification Section */}
        <View
          style={[
            styles.container,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <View style={styles.leftContainer}>
            <View style={styles.iconContainer}>
              <Bell color={colors.background} />
            </View>
            <Text style={{ color: colors.textPrimary }}>Push Notification</Text>
          </View>
          <ToggleSwitch
            isOn={notification}
            onColor={colors.primary}
            offColor={colors.gray}
            size="small"
            onToggle={handlePushToggle}
          />
        </View>

        {/* Email Notification Section */}
        <View
          style={[
            styles.container,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <View style={styles.leftContainer}>
            <View style={styles.iconContainer}>
              <Email color={colors.background} />
            </View>
            <Text style={{ color: colors.textPrimary }}>
              Email Notification
            </Text>
          </View>
          <ToggleSwitch
            isOn={email}
            onColor={colors.primary}
            offColor={colors.gray}
            size="small"
            onToggle={handleEmailToggle}
          />
        </View>

        {/* SMS Notification Section */}
        <View
          style={[
            styles.container,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <View style={styles.leftContainer}>
            <View style={styles.iconContainer}>
              <SMS color={colors.background} />
            </View>
            <Text style={{ color: colors.textPrimary }}>SMS Notification</Text>
          </View>
          <ToggleSwitch
            isOn={sms}
            onColor={colors.primary}
            offColor={colors.gray}
            size="small"
            onToggle={handleSmsToggle}
          />
        </View>

        {/* Dark Mode Toggle */}
        <View
          style={[
            styles.container,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <View style={styles.leftContainer}>
            <View style={styles.iconContainer}>
              <DarkMode color={colors.background} />
            </View>
            <Text style={{ color: colors.textPrimary }}>Dark Mode</Text>
          </View>
          <ToggleSwitch
            isOn={isDark}
            onColor={colors.primary}
            offColor={colors.gray}
            size="small"
            onToggle={handleDarkMode}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: spacing.screenPadding,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: spacing.radiusLg,

    // iOS
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      height: 0,
      width: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.25,

    // Android
    elevation: 5,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  iconContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
  },
});
