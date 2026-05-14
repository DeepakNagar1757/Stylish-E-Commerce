import React, { useEffect, useRef, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";

import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import { colors } from "@/src/Theme/colors";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { onboardingData } from "@/src/Data/onBoardingData";
import { useAuthStore } from "@/src/Store/authStore";

const OnboardingScreen = () => {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { completeOnboarding } = useAuthStore();

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      pagerRef.current?.setPage(currentPage - 1);
    } else {
      console.log("Go Next");
    }
  };

  const handleSkip = () => {
    pagerRef.current?.setPage(onboardingData.length - 1);
    completeOnboarding();
  };
  return (
    <SafeAreaWrapper>
      <StatusBar backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.headingText}>
          {currentPage + 1}
          <Text style={styles.paginationNumber}>/{onboardingData.length}</Text>
        </Text>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.headingText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {onboardingData.map((item, index) => {
          const Image = item.Image;

          return (
            <View key={index} style={styles.page}>
              <View style={styles.image}>
                <Image />
              </View>

              <View style={styles.imageText}>
                <Text style={styles.mainText}>{item.title}</Text>
                <Text style={styles.secondText}>{item.description}</Text>
              </View>
            </View>
          );
        })}
      </PagerView>

      <View style={styles.footer}>
        {currentPage > 0 ? (
          <TouchableOpacity onPress={handlePrev}>
            <Text style={styles.next}>Prev</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}

        <View style={styles.dotContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={
                index === currentPage ? styles.activePage : styles.notActivePage
              }
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.next}>
            {currentPage === onboardingData.length - 1 ? "Start" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
  },
  headingText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
  },
  paginationNumber: {
    color: colors.gray,
  },
  page: {
    flex: 1,
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },
  imageText: {
    marginTop: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: spacing.screenPadding,
    marginBottom: 160,
  },
  mainText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xxxl,
  },
  secondText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    color: colors.gray,
    textAlign: "center",
    lineHeight: spacing.xxl,
    letterSpacing: 1,
  },
  footer: {
    marginTop: "auto",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: spacing.screenPadding,
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  notActivePage: {
    height: 10,
    width: 10,
    backgroundColor: colors.gray,
    borderRadius: 99,
    marginHorizontal: spacing.xs,
  },
  activePage: {
    width: 40,
    height: 10,
    backgroundColor: colors.black,
    borderRadius: 100,
    marginHorizontal: spacing.xs,
  },
  dotContainer: {
    flexDirection: "row",
  },
  next: {
    color: colors.primary,
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
  },
});
