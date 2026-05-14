import express from "express";
import { getHomeData } from "../controllers/home.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", protect, getHomeData);

export default router;
