import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Alert, Linking, Platform } from "react-native";
import * as Device from "expo-device";
import { colors } from "@/src/Theme/colors";
import useThemeStore from "@/src/Store/themeStore";

export const useNotifications = () => {
  const [notification, setNotification] = useState(false);
  const [email, setEmail] = useState(false);
  const [sms, setSms] = useState(false);
  const [pushToken, setPushToken] = useState<string>("");

  const { toggleTheme, isDark } = useThemeStore();

  useEffect(() => {
    checkPushPermission();
    loadPreferences();
  }, []);

  const checkPushPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    console.log("Status of push notfication : ", status);
    // setNotification(status === "granted");
  };

  const loadPreferences = async () => {
    try {
      console.log("Loading preferences from API...");
    } catch (error) {
      console.log("Error loading preferences:", error);
    }
  };

  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      Alert.alert(
        "Emulator Detected",
        "Push notifications only work on physical devices.",
      );
      return null;
    }

    const { status: existingStatus, canAskAgain } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted" && canAskAgain) {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Permission Required",
        "Enable notifications from settings.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: async () => {
              await Linking.openSettings();
            },
          },
        ],
      );
      return null;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "your-project-id",
      });

      const token = tokenData.data;
      setPushToken(token);

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: colors.primary,
        });
      }

      return token;
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to get push token");
      return null;
    }
  };

  const updatePreferences = async (preferences: any) => {
    try {
      console.log("Updating preferences:", preferences);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update preferences");
    }
  };

  const handlePushToggle = async () => {
    const newValue = !notification;

    if (newValue) {
      const token = await registerForPushNotifications();

      if (token) {
        setNotification(true);
        await updatePreferences({
          push_enabled: true,
          push_token: token,
        });
      } else {
        setNotification(false);
      }
    } else {
      setNotification(false);
      await updatePreferences({ push_enabled: false });
    }
  };

  const handleEmailToggle = async () => {
    const newValue = !email;
    setEmail(newValue);
    await updatePreferences({ email_enabled: newValue });
  };

  const handleSmsToggle = async () => {
    const newValue = !sms;
    setSms(newValue);
    await updatePreferences({ sms_enabled: newValue });
  };

  const handleDarkMode = async () => {
    toggleTheme();
  };

  return {
    notification,
    email,
    sms,
    pushToken,
    isDark,
    handlePushToggle,
    handleEmailToggle,
    handleSmsToggle,
    handleDarkMode,
  };
};
