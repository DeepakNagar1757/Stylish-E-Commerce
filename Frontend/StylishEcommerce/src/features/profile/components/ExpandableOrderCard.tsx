import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import useAppTheme from "@/src/hooks/useAppTheme";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { spacing } from "@/src/Theme/spacing";
import { Order, OrderStatus } from "@/src/Store/orderStore";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PLACED: "Order Placed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_ICONS: Record<OrderStatus, keyof typeof Ionicons.glyphMap> = {
  PLACED: "clipboard-outline",
  PROCESSING: "cog-outline",
  SHIPPED: "boat-outline",
  OUT_FOR_DELIVERY: "bicycle-outline",
  DELIVERED: "checkmark-done-circle-outline",
  CANCELLED: "close-circle-outline",
};

interface Props {
  order: Order;
  onViewDetails: (order: Order) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const ExpandableOrderCard = ({
  order,
  onViewDetails,
  isExpanded,
  onToggle,
}: Props) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  const currentStatus = order.status;
  const firstItem = order.items[0];

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const timelineStatuses: OrderStatus[] = [
    "PLACED",
    "PROCESSING",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  const currentStatusIndex = timelineStatuses.indexOf(currentStatus);

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleExpand}
        style={styles.header}
      >
        <Image
          source={{ uri: firstItem?.product?.image }}
          style={styles.productImage}
          contentFit="cover"
        />
        <View style={styles.headerDetails}>
          <Text
            style={[styles.productName, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {firstItem?.product?.title || "Unknown Product"}
          </Text>
          {order.items.length > 1 && (
            <Text style={[styles.moreItems, { color: colors.textSecondary }]}>
              + {order.items.length - 1} more item(s)
            </Text>
          )}

          <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
            Ordered on {formatDate(order.createdAt)}
          </Text>

          <View style={styles.statusBadge}>
            <Ionicons
              name={STATUS_ICONS[currentStatus]}
              size={14}
              color={colors.primary}
            />
            <Text style={[styles.statusText, { color: colors.primary }]}>
              {STATUS_LABELS[currentStatus]}
            </Text>
          </View>
        </View>

        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View
          style={[styles.expandedContent, { borderTopColor: colors.border }]}
        >
          <Text style={[styles.timelineTitle, { color: colors.textPrimary }]}>
            Delivery Status
          </Text>

          <View style={styles.timeline}>
            {timelineStatuses.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              const historyItem = order.statusHistory.find(
                (h) => h.status === status,
              );

              return (
                <View key={status} style={styles.timelineStep}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.dot,
                        isCompleted
                          ? { backgroundColor: colors.primary }
                          : { backgroundColor: colors.border },
                        isCurrent && styles.currentDot,
                      ]}
                    />
                    {index < timelineStatuses.length - 1 && (
                      <View
                        style={[
                          styles.line,
                          index < currentStatusIndex
                            ? { backgroundColor: colors.primary }
                            : { backgroundColor: colors.border },
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineRight}>
                    <Text
                      style={[
                        styles.timelineStatusText,
                        {
                          color: isCompleted
                            ? colors.textPrimary
                            : colors.textSecondary,
                          fontFamily: isCurrent
                            ? fontFamily.bold
                            : fontFamily.medium,
                        },
                      ]}
                    >
                      {STATUS_LABELS[status]}
                    </Text>
                    {historyItem?.timestamp && (
                      <Text
                        style={[
                          styles.timelineDate,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {formatDate(historyItem.timestamp)}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.actionRow}>
            <Text style={[styles.totalAmount, { color: colors.textPrimary }]}>
              {formatCurrency(order.paymentDetails.amountPaid)}
            </Text>
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => onViewDetails(order)}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsBtnText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      borderRadius: spacing.radiusMd,
      marginBottom: spacing.md,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      padding: spacing.md,
      alignItems: "center",
    },
    productImage: {
      width: 60,
      height: 60,
      borderRadius: spacing.radiusSm,
    },
    headerDetails: {
      flex: 1,
      marginLeft: spacing.md,
    },
    productName: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.md,
    },
    moreItems: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      marginTop: 2,
    },
    orderDate: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      marginTop: 2,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.xs,
      gap: 4,
    },
    statusText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.sm,
    },
    expandedContent: {
      borderTopWidth: 1,
      padding: spacing.md,
    },
    timelineTitle: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.md,
      marginBottom: spacing.md,
    },
    timeline: {
      marginLeft: spacing.sm,
    },
    timelineStep: {
      flexDirection: "row",
    },
    timelineLeft: {
      alignItems: "center",
      marginRight: spacing.md,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    currentDot: {
      transform: [{ scale: 1.3 }],
    },
    line: {
      width: 2,
      height: 30,
      marginVertical: 4,
    },
    timelineRight: {
      flex: 1,
      paddingBottom: 20,
    },
    timelineStatusText: {
      fontSize: fontSize.sm,
    },
    timelineDate: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      marginTop: 2,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    totalAmount: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.lg,
    },
    detailsBtn: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm,
      height: "auto",
    },
    detailsBtnText: {
      fontSize: fontSize.lg,
      fontFamily: fontFamily.bold,
      color: colors.primary,
    },
  });

export default ExpandableOrderCard;
