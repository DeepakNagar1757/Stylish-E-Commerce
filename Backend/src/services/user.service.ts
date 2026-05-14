import User from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/hash";

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    avatar: user.avatar,
    username: (user as any).username,
    isProfileComplete: (user as any).isProfileComplete,
  };
};

export const updateProfile = async (
  userId: string,
  data: { firstName: string; lastName?: string; phone: string },
  file?: Express.Multer.File
) => {
  const updateData: any = {
    firstName: data.firstName,
    lastName: data.lastName || "",
    phone: data.phone,
  };

  if (file) {
    updateData.avatar = `/uploads/profiles/${file.filename}`;
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");


  if (!user) {
    throw new Error("User not found");
  }

  return {
    message: "Profile updated successfully",
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      username: (user as any).username,
      isProfileComplete: (user as any).isProfileComplete,
    },
  };
};

export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Verify old password
  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Prevent same password
  const isSame = await comparePassword(newPassword, user.password);
  if (isSame) {
    throw new Error("New password must be different from current password");
  }

  const hashedPassword = await hashPassword(newPassword);
  await User.updateOne({ _id: userId }, { password: hashedPassword });

  return { message: "Password changed successfully" };
};
