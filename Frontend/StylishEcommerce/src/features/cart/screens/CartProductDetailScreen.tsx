import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import StackHeader from "@/src/components/molecules/StackHeader";
import SafeAreaWrapper from "@/src/components/Wrapper/SafeAreaWrapper";
import { colors as staticColors } from "@/src/Theme/colors";
import Heart from "@/src/assets/svg/StackHeader/heart.svg";
import RedHeart from "@/src/assets/svg/StackHeader/redHeart.svg";
import { Image } from "expo-image";
import { spacing } from "@/src/Theme/spacing";
import { fontFamily, fontSize } from "@/src/Theme/typography";
import Coupen from "@/src/assets/svg/shoppingBag/coupen.svg";
import Button from "@/src/components/atoms/Button";
import {
  useWishlist,
  useWishlistStatus,
} from "../../wishlist/hooks/useWishlist";
import { useAuthStore } from "@/src/Store/authStore";
import { useAddressStore } from "@/src/Store/addressStore";
import { useCartStore } from "@/src/Store/cartStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/src/types/navigation";
import useAppTheme from "@/src/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import RazorpayCheckout from "react-native-razorpay";
import { paymentService } from "../services/paymentService";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EMI_PLANS = [
  { months: 3, label: "3 Months" },
  { months: 6, label: "6 Months" },
  { months: 9, label: "9 Months" },
  { months: 12, label: "12 Months" },
];

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const getDeliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const CartProductDetailScreen = ({ route }: any) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const inset = useSafeAreaInsets();

  const { productId } = route.params;
  const { cartItems, cartTotal } = useCartStore();

  const cartItem = cartItems.find((item) => item.product._id === productId);
  const product = cartItem?.product;

  type NavigationType = NativeStackNavigationProp<AppStackParamList>;
  const navigation = useNavigation<NavigationType>();

  const [emiModalVisible, setEmiModalVisible] = useState(false);
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isPaying, setIsPaying] = useState(false);

  const { isWishlisted } = useWishlistStatus(productId);
  const { toggleWishlist } = useWishlist();

  if (!cartItem || !product) {
    return (
      <SafeAreaWrapper backgroundColor={colors.backgroundSecondary}>
        <StackHeader title="Shopping Bag" back={true} />
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color={colors.textPrimary} />
          <Text style={[styles.emptyText, { color: colors.textPrimary }]}>
            Item not found in cart
          </Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  const orderAmount = cartItem.subtotal;
  const orderTotal = Math.max(0, orderAmount - discount);

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const handleProceedToPayment = async () => {
    const user = useAuthStore.getState().user;
    const { addresses, selectedAddressId } = useAddressStore.getState();

    if (!user?.isProfileComplete) {
      Alert.alert(
        "Complete Your Profile",
        "Please add your name and phone number before placing an order.",
        [
          { text: "Later", style: "cancel" },
          {
            text: "Complete Profile",
            onPress: () => navigation.navigate("PersonalDetails"),
          },
        ],
      );
      return;
    }

    if (!selectedAddressId && addresses.length === 0) {
      Alert.alert(
        "Add Delivery Address",
        "Please add a delivery address to continue.",
        [
          { text: "Later", style: "cancel" },
          {
            text: "Add Address",
            onPress: () => navigation.navigate("PersonalDetails"),
          },
        ],
      );
      return;
    }

    try {
      setIsPaying(true);

      // 1. Create Order on Backend
      const orderResponse = await paymentService.createOrder(orderTotal);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || "Failed to create order");
      }

      const orderData = orderResponse.data;

      // 2. Open Razorpay Checkout
      const options = {
        description: `Payment for ${product.title}`,
        image: product.image,
        currency: orderData.currency,
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        name: "Stylish Ecommerce",
        order_id: orderData.id,
        prefill: {
          email: user.email,
          contact: user.phone || "",
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.username,
        },
        theme: { color: colors.primary },
      };

      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          // 3. Verify Payment on Backend
          const selectedAddr = useAddressStore.getState().getSelectedAddress();
          if (!selectedAddr) {
            throw new Error("Delivery address not found");
          }

          const verifyResponse = await paymentService.verifyPayment({
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature,
            addressId: selectedAddr._id,
            amount: orderTotal,
          });

          if (verifyResponse.success) {
            Toast.show({
              type: "success",
              text1: "Payment Successful! 🎉",
              text2: "Your order has been placed successfully.",
            });
            // Clear cart store locally just to be safe, since backend cleared it
            useCartStore.getState().getCart();
            navigation.replace("OrdersList");
          } else {
            throw new Error("Payment verification failed");
          }
        })
        .catch((error: any) => {
          console.log("Razorpay Error:", error);
          if (error.code !== 2) {
            // 2 is user cancelled
            Toast.show({
              type: "error",
              text1: "Payment Failed",
              text2: error.description || "Something went wrong",
            });
          }
        });
    } catch (error: any) {
      console.log("Payment flow error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Could not initiate payment",
      });
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <SafeAreaWrapper backgroundColor={colors.backgroundSecondary}>
      <StackHeader
        title="Shopping Bag"
        back={true}
        rightIcon={true}
        rightIconImage={
          isWishlisted ? (
            <RedHeart fill={colors.primary} />
          ) : (
            <Heart fill={colors.textPrimary} />
          )
        }
        onRightClick={() => toggleWishlist(productId)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Card */}
        <View
          style={[
            styles.productContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Image
            source={{ uri: product.image }}
            contentFit="cover"
            style={styles.image}
          />
          <View style={styles.rightContainer}>
            <Text
              style={[styles.title, { color: colors.textPrimary }]}
              numberOfLines={2}
            >
              {product.title}
            </Text>

            <View style={styles.sizeQtyRow}>
              <View style={styles.badge}>
                <Text
                  style={[styles.badgeLabel, { color: colors.textPrimary }]}
                >
                  SIZE
                </Text>
                <Text
                  style={[styles.badgeValue, { color: colors.textPrimary }]}
                >
                  {cartItem.selectedSize}
                </Text>
              </View>
              <View style={styles.badge}>
                <Text
                  style={[styles.badgeLabel, { color: colors.textPrimary }]}
                >
                  QTY
                </Text>
                <Text
                  style={[styles.badgeValue, { color: colors.textPrimary }]}
                >
                  {cartItem.quantity}
                </Text>
              </View>
            </View>

            <View style={styles.deliveryRow}>
              <Ionicons
                name="bicycle-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={[styles.deliveryBy, { color: colors.textPrimary }]}>
                {" "}
                Delivery by{" "}
                <Text style={[styles.date, { color: colors.textPrimary }]}>
                  {getDeliveryDate()}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.couponContainer,
            { backgroundColor: colors.background },
          ]}
          activeOpacity={0.7}
          onPress={() => setCouponModalVisible(true)}
        >
          <View style={styles.couponLeft}>
            <Coupen color={colors.primary} />
            {appliedCoupon ? (
              <View>
                <Text
                  style={[
                    styles.couponAppliedText,
                    { color: colors.textPrimary },
                  ]}
                >
                  Coupon Applied!
                </Text>
                <Text style={[styles.couponCode, { color: colors.primary }]}>
                  {appliedCoupon} · {formatCurrency(discount)} off
                </Text>
              </View>
            ) : (
              <Text
                style={[styles.applyChanges, { color: colors.textPrimary }]}
              >
                Apply Coupons
              </Text>
            )}
          </View>
          <View style={styles.couponRight}>
            {appliedCoupon ? (
              <TouchableOpacity onPress={handleRemoveCoupon}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.select}>Select</Text>
            )}
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textSecondary}
            />
          </View>
        </TouchableOpacity>

        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Order Payment Details
          </Text>

          <View style={styles.orderRow}>
            <Text style={[styles.orderLabel, { color: colors.textSecondary }]}>
              Order Amount
            </Text>
            <Text style={[styles.orderValue, { color: colors.textPrimary }]}>
              {formatCurrency(orderAmount)}
            </Text>
          </View>

          {appliedCoupon && (
            <View style={styles.orderRow}>
              <Text
                style={[styles.orderLabel, { color: colors.textSecondary }]}
              >
                Coupon Discount
              </Text>
              <Text style={[styles.orderValue, { color: "#22C55E" }]}>
                − {formatCurrency(discount)}
              </Text>
            </View>
          )}

          <View style={styles.orderRow}>
            <Text style={[styles.orderLabel, { color: colors.textSecondary }]}>
              Convenience Fee
            </Text>
            <Text style={[styles.couponHint, { color: colors.primary }]}>
              Apply Coupon
            </Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={[styles.orderLabel, { color: colors.textSecondary }]}>
              Delivery Fee
            </Text>
            <Text style={[styles.orderValue, { color: "#22C55E" }]}>Free</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.orderRow}>
            <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>
              Order Total
            </Text>
            <Text style={[styles.totalValue, { color: colors.textPrimary }]}>
              {formatCurrency(orderTotal)}
            </Text>
          </View>

          {/* EMI Row */}
          <View style={styles.emiRow}>
            <Ionicons
              name="card-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text
              style={[
                styles.orderLabel,
                { color: colors.textSecondary, marginLeft: 6 },
              ]}
            >
              EMI Available
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setEmiModalVisible(true)}
              style={styles.emiDetailsBtn}
            >
              <Text style={styles.emiDetailsText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: 10 + inset.bottom,
          },
        ]}
      >
        <View>
          <Text style={[styles.totalValue, { color: colors.textPrimary }]}>
            {formatCurrency(orderTotal)}
          </Text>
          <Text style={[styles.orderLabel, { color: colors.textSecondary }]}>
            Total Payable
          </Text>
        </View>
        <Button
          placeholder="Proceed to Payment"
          onPress={handleProceedToPayment}
          style={styles.payBtn}
          isLoading={isPaying}
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={couponModalVisible}
        onRequestClose={() => setCouponModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalSheet, { backgroundColor: colors.background }]}
          >
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Available Coupons
              </Text>
              <TouchableOpacity onPress={() => setCouponModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {[
              {
                code: "SAVE10",
                desc: "10% off on orders above ₹500",
                discount: orderAmount * 0.1,
              },
              {
                code: "FLAT200",
                desc: "Flat ₹200 off on orders above ₹1000",
                discount: orderAmount >= 1000 ? 200 : 0,
              },
              {
                code: "FIRST50",
                desc: "50% off for first order (max ₹150)",
                discount: Math.min(orderAmount * 0.5, 150),
              },
            ].map((c) => (
              <View
                key={c.code}
                style={[styles.couponCard, { borderColor: colors.border }]}
              >
                <View style={styles.couponCardLeft}>
                  <Text
                    style={[styles.couponCardCode, { color: colors.primary }]}
                  >
                    {c.code}
                  </Text>
                  <Text
                    style={[
                      styles.couponCardDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {c.desc}
                  </Text>
                  {c.discount <= 0 && (
                    <Text style={styles.ineligibleText}>
                      Min. order not met
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.applyBtn,
                    {
                      backgroundColor:
                        c.discount > 0 ? colors.primary : colors.border,
                    },
                  ]}
                  disabled={c.discount <= 0}
                  onPress={() => {
                    setAppliedCoupon(c.code);
                    setDiscount(c.discount);
                    setCouponModalVisible(false);
                  }}
                >
                  <Text style={styles.applyBtnText}>
                    {appliedCoupon === c.code ? "Applied" : "Apply"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={emiModalVisible}
        onRequestClose={() => setEmiModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalSheet, { backgroundColor: colors.background }]}
          >
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                EMI Options
              </Text>
              <TouchableOpacity onPress={() => setEmiModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.emiSubtitle, { color: colors.textSecondary }]}>
              Order Total: {formatCurrency(orderTotal)}
            </Text>

            {EMI_PLANS.map((plan) => {
              const monthly = orderTotal / plan.months;
              return (
                <View
                  key={plan.months}
                  style={[
                    styles.emiPlanRow,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <View>
                    <Text
                      style={[styles.emiMonths, { color: colors.textPrimary }]}
                    >
                      {plan.label}
                    </Text>
                    <Text
                      style={[
                        styles.emiInterest,
                        { color: colors.textSecondary },
                      ]}
                    >
                      No-cost EMI available
                    </Text>
                  </View>
                  <Text style={[styles.emiAmount, { color: colors.primary }]}>
                    {formatCurrency(monthly)}/mo
                  </Text>
                </View>
              );
            })}

            <Text style={[styles.emiNote, { color: colors.textSecondary }]}>
              * EMI options available on select bank cards. Interest rates may
              vary.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
};

export default CartProductDetailScreen;

const createStyles = (colors: any) =>
  StyleSheet.create({
    scrollContent: {
      paddingBottom: 110,
      gap: spacing.sm,
    },

    productContainer: {
      flexDirection: "row",
      padding: spacing.screenPadding,
      marginTop: spacing.sm,
      marginHorizontal: spacing.screenPadding,
      borderRadius: spacing.radiusMd,
    },
    image: {
      height: 130,
      width: 100,
      borderRadius: spacing.radiusSm,
    },
    rightContainer: {
      flex: 1,
      marginLeft: spacing.md,
      justifyContent: "space-between",
    },
    title: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.md,
      lineHeight: 22,
    },
    sizeQtyRow: {
      flexDirection: "row",
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    badge: {
      alignItems: "center",
    },
    badgeLabel: {
      fontFamily: fontFamily.regular,
      fontSize: 9,
      letterSpacing: 1,
    },
    badgeValue: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.sm,
      marginTop: 2,
    },
    deliveryRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.sm,
    },
    deliveryBy: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      marginLeft: spacing.sm,
    },
    date: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.xs,
    },

    couponContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: spacing.screenPadding,
      padding: spacing.md,
      borderRadius: spacing.radiusMd,
    },
    couponLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      flex: 1,
    },
    couponRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    applyChanges: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
    },
    couponAppliedText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.sm,
    },
    couponCode: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      marginTop: 2,
    },
    select: {
      color: staticColors.primary,
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.sm,
    },
    removeText: {
      color: "#EF4444",
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.xs,
    },

    section: {
      marginHorizontal: spacing.screenPadding,
      padding: spacing.md,
      borderRadius: spacing.radiusMd,
    },
    sectionTitle: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.md,
      marginBottom: spacing.md,
    },
    orderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    orderLabel: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
    },
    orderValue: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.sm,
    },
    couponHint: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.xs,
      color: staticColors.primary,
    },
    divider: {
      height: 1,
      marginVertical: spacing.md,
      opacity: 0.3,
    },
    totalLabel: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.md,
    },
    totalValue: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.md,
    },

    emiRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.xs,
    },
    emiDetailsBtn: {
      marginLeft: spacing.sm,
    },
    emiDetailsText: {
      color: staticColors.primary,
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.xs,
    },

    bottomBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.screenPadding,
      paddingVertical: spacing.lg,
      borderTopWidth: 1,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    payBtn: {
      paddingHorizontal: spacing.xl,
      flex: 1,
      marginLeft: spacing.lg,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.md,
    },
    emptyText: {
      fontFamily: fontFamily.medium,
      fontSize: fontSize.md,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      borderTopLeftRadius: spacing.radiusXL,
      borderTopRightRadius: spacing.radiusXL,
      padding: spacing.xl,
      paddingBottom: spacing.xxxl,
    },
    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: "#9CA3AF",
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: spacing.lg,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    modalTitle: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.lg,
    },

    couponCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: spacing.radiusMd,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    couponCardLeft: {
      flex: 1,
      marginRight: spacing.md,
    },
    couponCardCode: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.md,
      letterSpacing: 1,
    },
    couponCardDesc: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      marginTop: 4,
    },
    ineligibleText: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      color: "#EF4444",
      marginTop: 2,
    },
    applyBtn: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: spacing.radiusSm,
    },
    applyBtnText: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.xs,
      color: "#fff",
    },

    emiSubtitle: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.sm,
      marginBottom: spacing.md,
    },
    emiPlanRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
    },
    emiMonths: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.sm,
    },
    emiInterest: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      marginTop: 2,
    },
    emiAmount: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.md,
    },
    emiNote: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.xs,
      marginTop: spacing.md,
      lineHeight: 16,
      fontStyle: "italic",
    },
  });
