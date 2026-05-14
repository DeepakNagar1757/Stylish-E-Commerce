import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import StackHeader from "@/src/components/molecules/StackHeader";
import Location from "@/src/assets/svg/ProductDetailScreen/location.svg";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import Edit from "@/src/assets/svg/MyOrders/edit.svg";
import Add from "@/src/assets/svg/MyOrders/circleAdd.svg";
import { useCartStore } from "@/src/Store/cartStore";
import CartProductCard from "@/src/components/organism/CartProductCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "boneyard-js/native";
import { useAddressStore } from "@/src/Store/addressStore";
import type { Address, AddressFormData } from "@/src/Store/addressStore";
import AddressFormModal from "@/src/components/organism/AddressFormModal";
import AddressCard from "@/src/components/molecules/AddressCard";
import { Ionicons } from "@expo/vector-icons";
import { useCartScreen } from "../hooks/useCartScreen";

export default function CartScreen() {
  const { colors, isDark } = useAppTheme();
  const styles = createStyles(colors);

  const {
    cartItems,
    isCartLoading,
    selectedAddress,
    otherAddresses,
    selectedAddressId,
    addressModalVisible,
    editingAddress,
    refreshing,

    onRefresh,
    handleCartItemPress,
    handleIncrement,
    handleDecrement,
    handleRemove,

    handleAddAddress,
    handleEditAddress,
    handleSaveAddress,
    closeAddressModal,

    selectAddress,
    navigation,
  } = useCartScreen();

  return (
    <SafeAreaWrapper backgroundColor={colors.backgroundSecondary}>
      <StackHeader
        title="My Orders"
        rightIcon={true}
        rightIconImage={
          <Ionicons name="refresh" size={24} color={colors.textPrimary} />
        }
        onRightClick={onRefresh}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.deliveryAddressContainer}>
          <Location />
          <Text style={styles.deliveryText}>Delivery Address</Text>
        </View>

        {selectedAddress ? (
          <>
            <View style={styles.addressMainContainer}>
              <View style={styles.addressContainer}>
                <View style={styles.address_editIcon}>
                  <View style={styles.addressLabelRow}>
                    <Text style={styles.addressText}>
                      {selectedAddress.label}
                    </Text>
                    {selectedAddress.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity onPress={handleEditAddress}>
                    <Edit />
                  </TouchableOpacity>
                </View>
                <Text style={styles.addressName}>
                  {selectedAddress.fullName}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[styles.address, { color: colors.textSecondary }]}
                >
                  {selectedAddress.addressLine1}
                  {selectedAddress.addressLine2
                    ? `, ${selectedAddress.addressLine2}`
                    : ""}
                  , {selectedAddress.city}, {selectedAddress.state} -{" "}
                  {selectedAddress.pincode}
                </Text>
                <Text
                  style={[styles.contactText, { color: colors.textSecondary }]}
                >
                  Contact: {selectedAddress.phone}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.plusContainer}
                onPress={handleAddAddress}
              >
                <Add width={25} height={25} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {otherAddresses.length > 0 && (
              <FlatList
                data={otherAddresses}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.otherAddressList}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <AddressCard
                    address={item}
                    compact={true}
                    isSelected={item._id === selectedAddressId}
                    onSelect={() => selectAddress(item._id)}
                  />
                )}
              />
            )}
          </>
        ) : (
          <TouchableOpacity
            style={styles.noAddressContainer}
            onPress={handleAddAddress}
          >
            <Ionicons
              name="add-circle-outline"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.noAddressText}>Add Delivery Address</Text>
            <Text style={styles.noAddressSubtext}>
              Add an address to place your order
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.sectionDivider} />
        <Text style={styles.shoppingText}>Shopping List</Text>

        {cartItems.length === 0 && !isCartLoading ? (
          <View style={styles.emptyCartContainer}>
            <Ionicons
              name="cart-outline"
              size={100}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtext}>
              Looks like you haven't added anything to your cart yet.
            </Text>
            <TouchableOpacity
              style={styles.shopNowBtn}
              onPress={() => navigation.navigate("Home" as any)}
            >
              <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.shopNowBtn,
                {
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: colors.primary,
                  marginTop: spacing.md,
                },
              ]}
              onPress={onRefresh}
            >
              <Text style={[styles.shopNowText, { color: colors.primary }]}>
                Refresh
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map((item) => {
            const product = item.product;
            return (
              <View
                key={`${product._id}-${item.selectedSize}`}
                style={styles.cardContainer}
              >
                <Skeleton name="profile-card" loading={isCartLoading}>
                  <CartProductCard
                    img={product.image}
                    title={product.title}
                    variation={{ size: item.selectedSize }}
                    rating={product.rating || 4.5}
                    originalPrice={product.originalPrice}
                    discountPercentage={product.discountPercentage}
                    discountPrice={product.price}
                    totalOrder={item.quantity}
                    totalPrice={item.subtotal}
                    onPress={() => handleCartItemPress(product._id)}
                    onIncrement={() =>
                      handleIncrement(
                        product._id,
                        item.selectedSize,
                        item.quantity,
                      )
                    }
                    onDecrement={() =>
                      handleDecrement(
                        product._id,
                        item.selectedSize,
                        item.quantity,
                      )
                    }
                    onRemove={() =>
                      handleRemove(product._id, item.selectedSize)
                    }
                  />
                </Skeleton>
              </View>
            );
          })
        )}
      </ScrollView>

      <AddressFormModal
        visible={addressModalVisible}
        onClose={closeAddressModal}
        onSave={handleSaveAddress}
        address={editingAddress}
      />
    </SafeAreaWrapper>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    deliveryAddressContainer: {
      flexDirection: "row",
      marginHorizontal: spacing.screenPadding,
      alignItems: "center",
      marginTop: spacing.lg,
    },
    deliveryText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.md,
      marginLeft: spacing.sm,
      color: colors.textPrimary,
    },
    addressMainContainer: {
      marginTop: spacing.lg,
      flexDirection: "row",
      marginHorizontal: spacing.screenPadding,
    },
    addressContainer: {
      flex: 1,
      padding: spacing.md,
      backgroundColor: colors.background,
      borderRadius: spacing.radiusMd,

      // iOS
      shadowColor: colors.isDark ? "transparent" : "rgba(0, 0, 0, 0.5)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5.84,

      // Android
      elevation: 5,
    },
    address_editIcon: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    addressLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    addressText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.sm,
      lineHeight: spacing.xl,
      color: colors.textPrimary,
    },
    addressName: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.sm,
      marginTop: spacing.xs,
      color: colors.textPrimary,
    },
    defaultBadge: {
      backgroundColor: colors.isDark ? "#1B3B24" : "#e8f5e9",
      paddingHorizontal: spacing.sm,
      paddingVertical: 1,
      borderRadius: 4,
    },
    defaultBadgeText: {
      fontFamily: fontFamily.medium,
      fontSize: 9,
      color: colors.isDark ? "#81C784" : "#2e7d32",
    },
    address: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      flexShrink: 1,
      marginTop: 2,
    },
    contactText: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      marginTop: 2,
    },

    plusContainer: {
      backgroundColor: colors.background,
      padding: 27,
      borderRadius: spacing.radiusMd,
      marginLeft: spacing.sm,
      justifyContent: "center",
      alignItems: "center",

      // iOS
      shadowColor: colors.isDark ? "transparent" : "rgba(0, 0, 0, 0.5)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5.84,

      // Android
      elevation: 5,
    },

    otherAddressList: {
      paddingHorizontal: spacing.screenPadding,
      paddingTop: spacing.md,
    },

    noAddressContainer: {
      marginHorizontal: spacing.screenPadding,
      marginTop: spacing.lg,
      padding: spacing.xxl,
      borderRadius: spacing.radiusMd,
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderStyle: "dashed",
      alignItems: "center",
      gap: spacing.sm,
    },
    noAddressText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.md,
      color: colors.primary,
    },
    noAddressSubtext: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      color: colors.textMuted,
    },

    sectionDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: spacing.screenPadding,
      marginTop: spacing.xxl,
    },

    // Shopping
    shoppingText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.md,
      paddingHorizontal: spacing.screenPadding,
      marginTop: spacing.lg,
      paddingBottom: spacing.sm,
      color: colors.textPrimary,
    },
    scrollContainer: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollContent: {
      paddingBottom: spacing.xxxl + 20,
    },
    cardContainer: {
      marginVertical: 10,
      paddingHorizontal: spacing.screenPadding,
    },
    emptyCartContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: spacing.xxxl,
      gap: spacing.sm,
    },
    emptyCartTitle: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.lg,
      color: colors.textPrimary,
      marginTop: spacing.md,
    },
    emptyCartSubtext: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: "center",
      paddingHorizontal: spacing.xxl,
    },
    shopNowBtn: {
      marginTop: spacing.xl,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: spacing.radiusMd,
    },
    shopNowText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.md,
      color: "#fff",
    },
  });
