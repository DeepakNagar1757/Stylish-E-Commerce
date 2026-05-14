import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("username").get(function () {
  // Priority: firstName + lastName → email-derived name → "User"
  if (this.firstName) {
    return this.lastName
      ? `${this.firstName} ${this.lastName}`
      : this.firstName;
  }
  if (!this.email) return "User";
  const namePart = this.email.split("@")[0] || "User";
  // Replace dots, underscores, and dashes with spaces, then capitalize
  return namePart
    .replace(/[._-]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
});

userSchema.virtual("isProfileComplete").get(function () {
  return !!(this.firstName && this.phone);
});

export default mongoose.model("User", userSchema);

