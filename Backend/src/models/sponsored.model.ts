import mongoose, { Schema } from "mongoose";

const sponsoredSchema = new Schema(
  {
    image: { type: String, required: true },
    text: { type: String, required: true },
    filterType: { type: String },
    filterValue: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Sponsored", sponsoredSchema);
