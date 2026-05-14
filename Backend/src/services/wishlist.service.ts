import mongoose from "mongoose";
import Wishlist from "../models/wishlist.model";
import Product from "../models/product.model";

export const toggleWishlistItem = async (userId: string, productId: string) => {
  const existingItem = await Wishlist.findOne({
    user: userId,
    product: productId,
  });

  if (existingItem) {
    await Wishlist.findByIdAndDelete(existingItem._id);
    return { isWishlisted: false };
  } else {
    await Wishlist.create({ user: userId, product: productId });
    return { isWishlisted: true };
  }
};

export const getUserWishlist = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
  params: any = {},
) => {
  const skip = (page - 1) * limit;

  const { category, minPrice, maxPrice, sort, colors, sizes, rating, search } =
    params;

  // Build match stage for product filtering
  const productFilter: Record<string, any> = {
    "productDetails.isActive": true,
  };
  if (category) productFilter["productDetails.category"] = category;

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    productFilter.$or = [
      { "productDetails.title": searchRegex },
      { "productDetails.description": searchRegex },
    ];
  }

  if (minPrice || maxPrice) {
    productFilter["productDetails.price"] = {};
    if (minPrice) productFilter["productDetails.price"].$gte = Number(minPrice);
    if (maxPrice) productFilter["productDetails.price"].$lte = Number(maxPrice);
  }
  if (colors) {
    const colorArray = colors.split(",");
    productFilter["productDetails.colors"] = { $in: colorArray };
  }
  if (sizes) {
    const sizeArray = sizes.split(",");
    productFilter["productDetails.sizes"] = { $in: sizeArray };
  }
  if (rating) {
    productFilter["productDetails.rating"] = { $gte: Number(rating) };
  }

  // Sorting
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // default: newest added to wishlist first
  if (sort === "price_low" || sort === "price_low_high")
    sortOption = { "productDetails.price": 1 };
  if (sort === "price_high" || sort === "price_high_low")
    sortOption = { "productDetails.price": -1 };
  if (sort === "rating" || sort === "customer_review")
    sortOption = { "productDetails.rating": -1 };
  if (sort === "newest") sortOption = { "productDetails.createdAt": -1 };
  if (sort === "popular") sortOption = { "productDetails.totalReviews": -1 };

  const pipeline = [
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    { $match: productFilter },
    { $sort: sortOption },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ];

  const [result] = await Wishlist.aggregate(pipeline as any);

  const items = result.data.map((item: any) => item.productDetails);

  const totalCount = result.metadata[0]?.total || 0;

  return {
    items,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
  };
};

export const checkIsWishlisted = async (userId: string, productId: string) => {
  const existingItem = await Wishlist.findOne({
    user: userId,
    product: productId,
  });
  return !!existingItem;
};
