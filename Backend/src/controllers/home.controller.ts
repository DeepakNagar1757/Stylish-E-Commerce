import { Request, Response, NextFunction } from "express";
import { getHomeDashboardData } from "../services/home.service";

export const getHomeData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getHomeDashboardData();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};