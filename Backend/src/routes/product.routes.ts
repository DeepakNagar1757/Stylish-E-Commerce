import express from "express";
import { getProductById, getProducts } from "../controllers/product.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);

export default router;
