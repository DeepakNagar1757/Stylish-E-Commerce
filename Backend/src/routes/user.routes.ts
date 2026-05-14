import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  profileUpdateSchema,
  changePasswordSchema,
  addressSchema,
} from "../validations/user.validation";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setUserDefaultAddress,
} from "../controllers/user.controller";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();


// All routes require authentication
router.use(protect);

// ─── Profile ───────────────────────────────────────────────
router.get("/profile", getUserProfile);
router.put(
  "/profile",
  upload.single("avatar"),
  validate(profileUpdateSchema),
  updateUserProfile
);

router.put(
  "/change-password",
  validate(changePasswordSchema),
  changeUserPassword
);

// ─── Addresses ─────────────────────────────────────────────
router.get("/addresses", getUserAddresses);
router.post("/addresses", validate(addressSchema), addUserAddress);
router.put("/addresses/:id", validate(addressSchema), updateUserAddress);
router.delete("/addresses/:id", deleteUserAddress);
router.patch("/addresses/:id/default", setUserDefaultAddress);

export default router;
