export const fontFamily = {
  regular: "MontserratRegular",
  medium: "MontserratMedium",
  semiBold: "MontserratSemiBold",
  bold: "MontserratBold",
  extraBold: "MontserratExtraBold",
  light: "MontserratLight"
};
  
  export const fontSize = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 28,
    ultra: 36
  };
  
  export const lineHeight = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 22,
    xl: 24,
    xxl: 26,
    xxxl: 30,
    display: 34,
  };

  export const typography = {
    // 🧾 Headings
    h1: {
      fontSize: fontSize.display,
      lineHeight: lineHeight.display,
      fontFamily: fontFamily.bold,
    },
    h2: {
      fontSize: fontSize.xxxl,
      lineHeight: lineHeight.xxxl,
      fontFamily: fontFamily.semiBold,
    },
    h3: {
      fontSize: fontSize.xxl,
      lineHeight: lineHeight.xxl,
      fontFamily: fontFamily.semiBold,
    },
  
    // 🛍️ Product Titles
    productTitle: {
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      fontFamily: fontFamily.medium,
    },
  
    // 💰 Price Text
    price: {
      fontSize: fontSize.lg,
      lineHeight: lineHeight.lg,
      fontFamily: fontFamily.bold,
    },
    oldPrice: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      fontFamily: fontFamily.regular,
      textDecorationLine: "line-through",
    },
  
    // 🧾 Body Text
    body: {
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      fontFamily: fontFamily.regular,
    },
  
    // 🔍 Small Labels
    caption: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      fontFamily: fontFamily.regular,
    },
  
    // 🔘 Buttons
    button: {
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      fontFamily: fontFamily.semiBold,
    },
  
    // 🧷 Tags / Chips
    tag: {
      fontSize: fontSize.xs,
      lineHeight: lineHeight.xs,
      fontFamily: fontFamily.medium,
    },
  };