import mongoose, { Schema } from "mongoose";

const bannerSchema = new Schema(
  {
    image: { type: String, required: true },
    type: {
      type: String,
      enum: ["offer", "mac", "general", "shoes"],
      required: true,
    },
    filterType: { type: String }, // e.g. "category", "brand", "deal"
    filterValue: { type: String }, // e.g. "beauty", "apple", "summer-sale"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Banner", bannerSchema);
