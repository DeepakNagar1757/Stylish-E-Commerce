import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import StackHeader from "@/src/components/molecules/StackHeader";

const PaymentMethod = () => {
  return (
    <SafeAreaWrapper>
      <StackHeader title="PaymentMethod" back={true} />

      <Text>Razor Pay Gateway</Text>
    </SafeAreaWrapper>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({});
