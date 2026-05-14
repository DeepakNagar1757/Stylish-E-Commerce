import Category from "../models/category.model";
import Banner from "../models/banner.model";
import Deal from "../models/deal.model";
import Product from "../models/product.model";
import Sponsored from "../models/sponsored.model";

export const getHomeDashboardData = async () => {
  // Run ALL queries at the same time for performance
  const [
    categories,
    offerBanners,
    shoesBanners,
    deals,
    featuredProducts,
    trendingProducts,
    sponsored,
  ] = await Promise.all([
    Category.find({ isActive: true }).select("title image slug"),
    Banner.find({ type: "offer", isActive: true }).select(
      "image filterType filterValue",
    ),
    Banner.find({ type: "shoes", isActive: true }).select(
      "image filterType filterValue",
    ),
    Deal.find({ isActive: true }),
    Product.find({ isFeatured: true, isActive: true }).limit(10),
    Product.find({ isTrending: true, isActive: true }).limit(10),
    Sponsored.find({ isActive: true }).select(
      "image text filterType filterValue",
    ),
  ]);

  // Find the deal-of-the-day (countdown type)
  const dealOfTheDay = deals.find((d) => d.type === "countdown") || null;
  const trendingDeal = deals.find((d) => d.type === "static") || null;

  // Calculate remaining seconds for countdown deals
  let dealCountdownSeconds = 0;
  if (dealOfTheDay?.endsAt) {
    dealCountdownSeconds = Math.max(
      0,
      Math.floor(
        (new Date(dealOfTheDay.endsAt).getTime() - Date.now()) / 1000,
      ),
    );
  }

  return {
    categories,
    offerBanners,
    shoesBanners,
    dealOfTheDay: dealOfTheDay
      ? {
          title: dealOfTheDay.title,
          icon: dealOfTheDay.icon,
          backgroundColor: dealOfTheDay.backgroundColor,
          description: {
            type: "countdown" as const,
            totalSeconds: dealCountdownSeconds,
          },
          filterType: dealOfTheDay.filterType,
          filterValue: dealOfTheDay.filterValue,
        }
      : null,
    trendingDeal: trendingDeal
      ? {
          title: trendingDeal.title,
          icon: trendingDeal.icon,
          backgroundColor: trendingDeal.backgroundColor,
          description: {
            type: "static" as const,
            text: trendingDeal.staticText || "",
          },
          filterType: trendingDeal.filterType,
          filterValue: trendingDeal.filterValue,
        }
      : null,
    featuredProducts,
    trendingProducts,
    sponsored,
  };
};
