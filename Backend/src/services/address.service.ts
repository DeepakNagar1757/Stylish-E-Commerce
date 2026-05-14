import Address from "../models/address.model";
import mongoose from "mongoose";

type AddressData = {
  label?: "Home" | "Work" | "Other";
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
};

export const getAddresses = async (userId: string) => {
  // Return addresses sorted: default first, then by most recently updated
  const addresses = await Address.find({ user: userId }).sort({
    isDefault: -1,
    updatedAt: -1,
  });

  return addresses;
};

export const addAddress = async (userId: string, data: AddressData) => {
  // Check if this is the user's first address → auto-set as default
  const existingCount = await Address.countDocuments({ user: userId });
  const isDefault = existingCount === 0;

  const address = await Address.create({
    user: userId,
    ...data,
    isDefault,
  });

  return {
    message: "Address added successfully",
    address,
  };
};

export const updateAddress = async (
  userId: string,
  addressId: string,
  data: Partial<AddressData>
) => {
  const address = await Address.findOneAndUpdate(
    { _id: addressId, user: userId },
    data,
    { new: true, runValidators: true }
  );

  if (!address) {
    throw new Error("Address not found");
  }

  return {
    message: "Address updated successfully",
    address,
  };
};

export const deleteAddress = async (userId: string, addressId: string) => {
  const address = await Address.findOneAndDelete({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  // If deleted address was default, promote the most recent one
  if (address.isDefault) {
    const nextDefault = await Address.findOne({ user: userId }).sort({
      updatedAt: -1,
    });
    if (nextDefault) {
      nextDefault.isDefault = true;
      await nextDefault.save();
    }
  }

  return { message: "Address deleted successfully" };
};

export const setDefaultAddress = async (
  userId: string,
  addressId: string
) => {
  // Use a session/transaction to atomically swap defaults
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Unset current default
    await Address.updateMany(
      { user: userId, isDefault: true },
      { isDefault: false },
      { session }
    );

    // Set new default
    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { isDefault: true },
      { new: true, session }
    );

    if (!address) {
      await session.abortTransaction();
      throw new Error("Address not found");
    }

    await session.commitTransaction();

    return {
      message: "Default address updated",
      address,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
