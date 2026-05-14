import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAppTheme from "@/src/hooks/useAppTheme";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { spacing } from "@/src/Theme/spacing";
import { Order } from "@/src/Store/orderStore";
import { Image } from "expo-image";

interface Props {
  visible: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsBottomSheet = ({ visible, onClose, order }: Props) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  if (!order) return null;

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <View style={styles.modalHandle} />

            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Order Details
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Order Info */}
              <View
                style={[styles.section, { backgroundColor: colors.background }]}
              >
                <View style={styles.row}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Order ID
                  </Text>
                  <Text style={[styles.value, { color: colors.textPrimary }]}>
                    {order._id.substring(order._id.length - 8).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Order Date
                  </Text>
                  <Text style={[styles.value, { color: colors.textPrimary }]}>
                    {formatDate(order.createdAt)}
                  </Text>
                </View>
                <View style={[styles.row, { borderBottomWidth: 0 }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Payment
                  </Text>
                  <Text style={[styles.value, { color: colors.primary }]}>
                    Razorpay
                  </Text>
                </View>
              </View>

              {/* Items */}
              <View
                style={[styles.section, { backgroundColor: colors.background }]}
              >
                <Text
                  style={[styles.sectionTitle, { color: colors.textPrimary }]}
                >
                  Items ({order.items.length})
                </Text>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Image
                      source={{ uri: item.product.image }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemDetails}>
                      <Text
                        style={[styles.itemName, { color: colors.textPrimary }]}
                        numberOfLines={2}
                      >
                        {item.product.title}
                      </Text>
                      <Text
                        style={[
                          styles.itemMeta,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Qty: {item.quantity}{" "}
                        {item.selectedSize
                          ? `| Size: ${item.selectedSize}`
                          : ""}
                      </Text>
                    </View>
                    <Text
                      style={[styles.itemPrice, { color: colors.textPrimary }]}
                    >
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Shipping Address */}
              <View
                style={[styles.section, { backgroundColor: colors.background }]}
              >
                <Text
                  style={[styles.sectionTitle, { color: colors.textPrimary }]}
                >
                  Shipping Address
                </Text>
                <Text
                  style={[styles.addressName, { color: colors.textPrimary }]}
                >
                  {order.shippingAddress.fullName}
                </Text>
                <Text
                  style={[styles.addressText, { color: colors.textSecondary }]}
                >
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2
                    ? `, ${order.shippingAddress.addressLine2}`
                    : ""}
                </Text>
                <Text
                  style={[styles.addressText, { color: colors.textSecondary }]}
                >
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.pincode}
                </Text>
                <Text
                  style={[styles.addressPhone, { color: colors.textPrimary }]}
                >
                  Phone: {order.shippingAddress.phone}
                </Text>
              </View>

              {/* Price Breakdown */}
              <View
                style={[
                  styles.section,
                  { backgroundColor: colors.background, marginBottom: 40 },
                ]}
              >
                <Text
                  style={[styles.sectionTitle, { color: colors.textPrimary }]}
                >
                  Price Breakdown
                </Text>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Item Total
                  </Text>
                  <Text style={[styles.value, { color: colors.textPrimary }]}>
                    {formatCurrency(order.paymentDetails.amountPaid)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Delivery
                  </Text>
                  <Text style={[styles.value, { color: "#22C55E" }]}>Free</Text>
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      borderBottomWidth: 0,
                      marginTop: spacing.xs,
                      paddingTop: spacing.sm,
                      borderTopWidth: 1,
                      borderTopColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.totalLabel, { color: colors.textPrimary }]}
                  >
                    Total Paid
                  </Text>
                  <Text
                    style={[styles.totalValue, { color: colors.textPrimary }]}
                  >
                    {formatCurrency(order.paymentDetails.amountPaid)}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      borderTopLeftRadius: spacing.radiusXL,
      borderTopRightRadius: spacing.radiusXL,
      height: "85%",
    },
    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      alignSelf: "center",
      marginTop: spacing.md,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.screenPadding,
      paddingTop: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.lg,
    },
    scrollContent: {
      padding: spacing.screenPadding,
      paddingBottom: 40,
    },
    section: {
      borderRadius: spacing.radiusMd,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.md,
      marginBottom: spacing.sm,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    label: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
    },
    value: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
    },
    totalLabel: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.md,
    },
    totalValue: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.lg,
    },
    itemRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.sm,
    },
    itemImage: {
      width: 50,
      height: 50,
      borderRadius: spacing.radiusSm,
    },
    itemDetails: {
      flex: 1,
      marginLeft: spacing.md,
    },
    itemName: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
    },
    itemMeta: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      marginTop: 2,
    },
    itemPrice: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.sm,
    },
    addressName: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.sm,
      marginBottom: 2,
    },
    addressText: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      lineHeight: 20,
    },
    addressPhone: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
      marginTop: spacing.xs,
    },
  });

export default OrderDetailsBottomSheet;
