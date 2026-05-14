import useThemeStore from "@/src/Store/themeStore";
import { lightColors, darkColors } from "@/src/Theme/colors";

export const useAppTheme = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const colors = isDark ? darkColors : lightColors;

  return {
    colors,
    isDark,
  };
};

export default useAppTheme;
