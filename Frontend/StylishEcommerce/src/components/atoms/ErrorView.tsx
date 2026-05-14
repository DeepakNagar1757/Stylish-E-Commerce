import { colors } from "@/src/Theme/colors";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { View, Text } from "react-native";

export default function ErrorView({ message }: { message: string }) {
  console.info("Message", message);
  return (
    <View
      style={{
        paddingHorizontal: spacing.xxxl,
        marginTop: spacing.lg,
      }}
    >
      <Text
        style={{
          color: colors.error,
          fontSize: fontSize.md,
          fontFamily: fontFamily.medium,
        }}
      >
        {message}
      </Text>
    </View>
  );
}
