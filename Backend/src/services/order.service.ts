import Order, { OrderStatus } from "../models/order.model";
import Cart from "../models/cart.model";
import Address from "../models/address.model";

export const createOrderFromCart = async (
  userId: string,
  addressId: string,
  paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    amountPaid: number;
  }
) => {
  // 1. Fetch Cart
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 2. Fetch Address
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    throw new Error("Shipping address not found");
  }

  // 3. Format items
  const orderItems = cart.items.map((item: any) => {
    return {
      product: item.product._id,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      price: item.product.price, // Snapshot of price at time of purchase
    };
  });

  // 4. Create address snapshot
  const shippingAddressSnapshot = {
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    country: address.country,
  };

  // 5. Expected delivery date (e.g., 5 days from now)
  const expectedDeliveryDate = new Date();
  expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 5);

  // 6. Create Order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress: shippingAddressSnapshot,
    paymentDetails,
    expectedDeliveryDate,
  });

  // 7. Clear Cart
  cart.items = [];
  await cart.save();

  return order;
};

export const getUserOrders = async (userId: string) => {
  const orders = await Order.find({ user: userId })
    .populate("items.product", "title image price")
    .sort({ createdAt: -1 });
  return orders;
};
