import mongoose, { Schema } from "mongoose";

const dealSchema = new Schema(
  {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    backgroundColor: { type: String, required: true },
    type: { type: String, enum: ["countdown", "static"], required: true },
    // For countdown type
    endsAt: { type: Date },
    // For static type
    staticText: { type: String },
    // Navigation params
    filterType: { type: String },
    filterValue: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Deal", dealSchema);
