import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    image: { type: String, required: true },
    category: { type: String },
    brand: { type: String },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    detailedDescription: { type: String },
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
