import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Back from "@/src/assets/svg/StackHeader/back.svg";
import { spacing } from "@/src/Theme/spacing";
import Cart from "@/src/assets/svg/StackHeader/cart.svg";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { colors } from "@/src/Theme/colors";

type StackHeaderProps = {
  title: string;
  rightIcon?: boolean;
  rightIconImage?: React.ReactNode;
  onRightClick?: () => void;
  secondRightIcon?: boolean;
  secondRightIconImage?: React.ReactNode;
  onSecondRightClick?: () => void;
  back?: boolean;
};

const StackHeader = ({
  title,
  rightIcon,
  onRightClick,
  rightIconImage,
  secondRightIcon,
  secondRightIconImage,
  onSecondRightClick,
  back,
}: StackHeaderProps) => {
  const { colors } = useAppTheme();
  type NavigationType = NativeStackNavigationProp<AppStackParamList>;
  const navigation = useNavigation<NavigationType>();
  const handleOnBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {back && (
          <TouchableOpacity onPress={handleOnBack}>
            <Back width={11} height={21} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>

      <View style={styles.rightContainer}>
        {secondRightIcon && (
          <TouchableOpacity
            onPress={onSecondRightClick}
            style={styles.rightIconStyle}
          >
            {secondRightIconImage}
          </TouchableOpacity>
        )}
        {rightIcon && (
          <TouchableOpacity onPress={onRightClick}>
            {rightIconImage}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default StackHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  rightIconStyle: {
    marginRight: spacing.md,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
    includeFontPadding: false,
  },
});
