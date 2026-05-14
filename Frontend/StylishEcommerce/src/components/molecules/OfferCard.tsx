import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type DescriptionConfig =
  | {
      type: "countdown";
      totalSeconds: number;
    }
  | {
      type: "static";
      text: string;
    };

export interface OfferCardProps {
  backgroundColor: string;
  title: string;
  icon: string;
  description: DescriptionConfig;
  buttonLabel?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  if (h > 0) return `${h}h ${pad(m)}m ${pad(s)}s`;
  if (m > 0) return `${pad(m)}m ${pad(s)}s`;
  return `${pad(s)}s`;
}

interface CountdownProps {
  icon: string;
  totalSeconds: number;
  textColor: string;
}

const Countdown: React.FC<CountdownProps> = ({
  icon,
  totalSeconds,
  textColor,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Text style={[styles.description, { color: textColor }]}>
      {icon} {formatCountdown(secondsLeft)} remaining
    </Text>
  );
};

const OfferCard: React.FC<OfferCardProps> = ({
  backgroundColor,
  title,
  icon,
  description,
  buttonLabel = "View all",
  onPress,
  style,
}) => {
  const textColor = "#FFFFFF";

  return (
    <View style={[styles.card, { backgroundColor }, style]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>

        {description.type === "countdown" ? (
          <Countdown
            icon={icon}
            totalSeconds={description.totalSeconds}
            textColor={textColor}
          />
        ) : (
          <Text style={[styles.description, { color: textColor }]}>
            {icon} {description.text}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>
          {buttonLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OfferCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  content: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.medium,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
  },
  button: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.85)",
    borderRadius: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  buttonText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semiBold,
  },
});
