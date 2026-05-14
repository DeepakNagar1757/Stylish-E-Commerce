import mongoose, { Document, Schema, Types } from "mongoose";

export enum OrderStatus {
  PLACED = "PLACED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface OrderItem {
  product: Types.ObjectId;
  quantity: number;
  selectedSize?: string;
  price: number;
}

export interface StatusHistory {
  status: OrderStatus;
  timestamp: Date;
  description?: string;
}

export interface ShippingAddressSnapshot {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderDocument extends Document {
  user: Types.ObjectId;
  items: OrderItem[];
  shippingAddress: ShippingAddressSnapshot;
  paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    amountPaid: number;
  };
  status: OrderStatus;
  statusHistory: StatusHistory[];
  expectedDeliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    selectedSize: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const statusHistorySchema = new Schema<StatusHistory>(
  {
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema<ShippingAddressSnapshot>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true, default: "India" },
  },
  { _id: false }
);

const orderSchema = new Schema<OrderDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentDetails: {
      razorpay_order_id: { type: String, required: true },
      razorpay_payment_id: { type: String, required: true },
      amountPaid: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PLACED,
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    expectedDeliveryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to add initial status to history if it's a new document
orderSchema.pre("save", function () {
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status as OrderStatus,
      timestamp: new Date(),
      description: "Order has been placed successfully.",
    });
  }
});

export default mongoose.model<OrderDocument>("Order", orderSchema);
