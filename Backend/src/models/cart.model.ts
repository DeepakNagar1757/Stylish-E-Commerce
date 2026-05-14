import mongoose, { Document, Schema, Types } from "mongoose";
import { number, string } from "zod";

export interface CartItem {
  product: Types.ObjectId;
  quantity: number;
  selectedSize: string;
}

export interface CartDocument extends Document {
  user: Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    selectedSize: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const cartSchema = new Schema<CartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Cart = mongoose.model<CartDocument>("Cart", cartSchema);

export default Cart;
