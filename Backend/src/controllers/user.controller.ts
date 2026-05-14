import { Response, NextFunction } from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/user.service";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/address.service";

// ─── Profile ───────────────────────────────────────────────

export const getUserProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getProfile(req.user.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const updateUserProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await updateProfile(req.user.userId, req.body, req.file);
    res.json(data);
  } catch (err) {
    next(err);
  }
};


export const changeUserPassword = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await changePassword(
      req.user.userId,
      req.body.oldPassword,
      req.body.newPassword
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// ─── Addresses ─────────────────────────────────────────────

export const getUserAddresses = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getAddresses(req.user.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const addUserAddress = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await addAddress(req.user.userId, req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const updateUserAddress = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await updateAddress(
      req.user.userId,
      req.params.id,
      req.body
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const deleteUserAddress = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await deleteAddress(req.user.userId, req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const setUserDefaultAddress = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await setDefaultAddress(req.user.userId, req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
