import React from "react";
import { StyleProp, StyleSheet } from "react-native";
import { Image, ImageStyle } from "expo-image";
import { useAuthStore } from "@/src/Store/authStore";

interface AvatarProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
  uri?: string | null;
}

const Avatar: React.FC<AvatarProps> = ({ size = 40, style, uri }) => {
  const { user } = useAuthStore();

  const avatarSource = uri || user?.avatar;
  console.log("avatarSoruce : ====+>", avatarSource);

  const getSource = () => {
    if (!avatarSource) {
      return require("@/src/assets/images/avatardefault.png");
    }

    if (avatarSource.startsWith("http") || avatarSource.startsWith("file")) {
      return { uri: avatarSource };
    }

    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.replace("/api", "");
    console.log(`Base Url ============> ${baseUrl}${avatarSource}`);
    return { uri: `${baseUrl}${avatarSource}` };
  };

  return (
    <Image
      source={getSource()}
      style={[
        {
          height: size,
          width: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    />
  );
};

export default Avatar;
