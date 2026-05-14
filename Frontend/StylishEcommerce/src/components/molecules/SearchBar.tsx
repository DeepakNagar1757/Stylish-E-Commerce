import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import SearchIcon from "@/src/assets/svg/searchBar/searchIcon.svg";
import Mic from "@/src/assets/svg/searchBar/mic.svg";
import { spacing } from "@/src/Theme/spacing";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { fontFamily, fontSize } from "@/src/Theme/typography";

type SearchBarProps = {
  onPress?: () => void;
  editable?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
};

const SearchBar = ({
  onPress,
  editable = false,
  value,
  onChangeText,
}: SearchBarProps) => {
  const { colors } = useAppTheme();
  const Container = editable ? View : TouchableOpacity;

  return (
    <Container
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingVertical: !editable ? spacing.sm : null,
        },
      ]}
      {...(!editable && {
        onPress,
        activeOpacity: 0.85,
      })}
    >
      <View style={styles.leftContainer}>
        <SearchIcon
          style={styles.searchIcon}
          width={20}
          height={20}
          color={colors.textPrimary}
        />

        {editable ? (
          <TextInput
            style={[styles.inputText, { color: colors.textPrimary }]}
            placeholder="Search any product..."
            placeholderTextColor={colors.dark}
            autoFocus={false}
            returnKeyType="search"
            blurOnSubmit={true}
            value={value}
            onChangeText={onChangeText}
          />
        ) : (
          <Text style={[styles.inputText, { color: colors.textMuted }]}>
            Search any product...
          </Text>
        )}
      </View>

      <TouchableOpacity activeOpacity={0.85}>
        <Mic width={24} height={24} color={colors.textPrimary} />
      </TouchableOpacity>
    </Container>
  );
};
export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 10,

    // android
    elevation: 10,

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 10,
  },
  inputText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: 20,
    width: "85%",
  },
});
