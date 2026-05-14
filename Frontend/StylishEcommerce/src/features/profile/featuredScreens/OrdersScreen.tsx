import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import StackHeader from "@/src/components/molecules/StackHeader";
import useAppTheme from "@/src/hooks/useAppTheme";
import { Order, useOrderStore } from "@/src/Store/orderStore";
import ExpandableOrderCard from "../components/ExpandableOrderCard";
import OrderDetailsBottomSheet from "../components/OrderDetailsBottomSheet";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/src/types/navigation";
import Loading from "@/src/components/molecules/Loading";
import { colors } from "@/src/Theme/colors";

const OrdersScreen = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const { orders, isLoading, fetchOrders } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeBottomSheet = () => {
    setSelectedOrder(null);
  };

  if (isLoading && orders.length === 0) {
    return (
      <>
        <View style={styles.centerContainer}>
          <StackHeader title="My Orders" back={true} />
          <Loading />
        </View>
      </>
    );
  }

  return (
    <SafeAreaWrapper backgroundColor={colors.backgroundSecondary}>
      <StackHeader title="My Orders" back={true} />

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="cube-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyText, { color: colors.textPrimary }]}>
              No orders found
            </Text>
            <Text
              style={[styles.emptySubText, { color: colors.textSecondary }]}
            >
              Looks like you haven't made your order yet.
            </Text>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => navigation.navigate("Tabs", { screen: "Home" })}
              activeOpacity={0.7}
            >
              <Text style={styles.shopBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item }) => (
          <ExpandableOrderCard 
            order={item} 
            onViewDetails={handleViewDetails} 
            isExpanded={expandedOrderId === item._id}
            onToggle={() => {
              if (expandedOrderId === item._id) {
                setExpandedOrderId(null);
              } else {
                setExpandedOrderId(item._id);
              }
            }}
          />
        )}
      />

      <OrderDetailsBottomSheet
        visible={!!selectedOrder}
        onClose={closeBottomSheet}
        order={selectedOrder}
      />
    </SafeAreaWrapper>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listContent: {
      padding: spacing.screenPadding,
      flexGrow: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.lg,
      marginTop: spacing.md,
    },
    emptySubText: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      marginTop: spacing.xs,
      textAlign: "center",
      paddingHorizontal: spacing.xl,
    },
    shopBtn: {
      marginTop: spacing.xl,
      paddingHorizontal: spacing.xxxl,
    },
    shopBtnText: {
      color: colors.primary,
      fontFamily: fontFamily.bold,
      fontSize: fontSize.lg,
    },
  });

export default OrdersScreen;
