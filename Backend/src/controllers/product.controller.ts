import { Request, Response, NextFunction } from "express";
import Product from "../models/product.model";

// GET /api/products?category=beauty&tag=trending&search=kurta&sort=price_low&page=1&limit=20
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { category, tag, deal, brand, search, minPrice, maxPrice, sort, page, limit, colors, sizes, rating } =
      req.query;

    // Build filter object dynamically
    const filter: Record<string, any> = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    // Text search (case-insensitive partial match)
    if (search) {
      filter.title = { $regex: search as string, $options: "i" };
    }

    // Tag-based filtering
    if (tag === "trending") filter.isTrending = true;
    if (tag === "featured") filter.isFeatured = true;

    // Deal-based filtering (maps to isFeatured products)
    if (deal) filter.isFeatured = true;

    // Price range filtering
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Color filtering
    if (colors) {
      const colorArray = (colors as string).split(",");
      filter.colors = { $in: colorArray };
    }

    // Size filtering
    if (sizes) {
      const sizeArray = (sizes as string).split(",");
      filter.sizes = { $in: sizeArray };
    }

    // Rating filtering
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // Sorting
    let sortOption: Record<string, 1 | -1> | any = { createdAt: -1, _id: 1 }; // default: newest first
    if (sort === "price_low" || sort === "price_low_high") sortOption = { price: 1, _id: 1 };
    if (sort === "price_high" || sort === "price_high_low") sortOption = { price: -1, _id: 1 };
    if (sort === "rating" || sort === "customer_review") sortOption = { rating: -1, _id: 1 };
    if (sort === "newest") sortOption = { createdAt: -1, _id: 1 };
    if (sort === "popular") sortOption = { totalReviews: -1, _id: 1 };

    // Pagination
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
