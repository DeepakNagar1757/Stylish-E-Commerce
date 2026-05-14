import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Import all models
import Category from "../models/category.model";
import Banner from "../models/banner.model";
import Deal from "../models/deal.model";
import Product from "../models/product.model";
import Sponsored from "../models/sponsored.model";

// ─── Categories ────────────────────────────────────────────
const categories = [
  {
    title: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    slug: "beauty",
  },
  {
    title: "Fashion",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    slug: "fashion",
  },
  {
    title: "Kids",
    image:
      "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2lkc3xlbnwwfHwwfHx8MA%3D%3D",
    slug: "kids",
  },
  {
    title: "Mens",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c",
    slug: "mens",
  },
  {
    title: "Womens",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    slug: "womens",
  },
];

// ─── Banners ───────────────────────────────────────────────
const banners = [
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&auto=format&fit=crop&q=60",
    type: "offer",
    filterType: "deal",
    filterValue: "summer-sale",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=60",
    type: "offer",
    filterType: "deal",
    filterValue: "flash-deal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60",
    type: "offer",
    filterType: "deal",
    filterValue: "clearance",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U2hvZXMlMjBuaWtlfGVufDB8fDB8fHww",
    type: "shoes",
    filterType: "brand",
    filterValue: "nike",
  },
  {
    image:
      "https://images.unsplash.com/photo-1612976562127-3e4db216cf75?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8U2hvZXMlMjBqb3JkYW58ZW58MHx8MHx8fDA%3D",
    type: "shoes",
    filterType: "brand",
    filterValue: "jordan",
  },
];

// ─── Deals ─────────────────────────────────────────────────
const deals = [
  {
    title: "Deal of the Day",
    icon: "⏰",
    backgroundColor: "#4A90E2",
    type: "countdown",
    endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    filterType: "tag",
    filterValue: "featured",
  },
  {
    title: "Trending Products",
    icon: "🗓️",
    backgroundColor: "#F83758",
    type: "static",
    staticText: "Last Date 29/02/22",
    filterType: "tag",
    filterValue: "trending",
  },
];

// ─── Featured Products ────────────────────────────────────
const featuredProducts = [
  {
    title: "Women Printed Kurta",
    description: "Neque porro quisquam est qui dolorem ipsum quia",
    price: 1500,
    originalPrice: 2499,
    discountPercentage: 40,
    currency: "INR",
    rating: 4.0,
    totalReviews: 56890,
    image:
      "https://images.unsplash.com/photo-1769063382610-6be8acb7552f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8V29tZW4lMjBQcmludGVkJTIwS3VydGF8ZW58MHx8MHx8fDA%3D",
    category: "womens",
    inStock: true,
    isFeatured: true,
    isTrending: false,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Floral Anarkali Kurta",
    description: "Elegant floral print for festive occasions",
    price: 1899,
    originalPrice: 2999,
    discountPercentage: 37,
    currency: "INR",
    rating: 4.3,
    totalReviews: 34210,
    image:
      "https://images.unsplash.com/photo-1631269533195-fb8ff9670f2b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RmxvcmFsJTIwQW5hcmthbGklMjBLdXJ0YXxlbnwwfHwwfHx8MA%3D%3D",
    category: "womens",
    inStock: true,
    isFeatured: true,
    isTrending: false,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Cotton Straight Kurta",
    description: "Comfortable daily wear cotton kurta",
    price: 999,
    originalPrice: 1499,
    discountPercentage: 33,
    currency: "INR",
    rating: 3.9,
    totalReviews: 18900,
    image:
      "https://images.unsplash.com/photo-1693988103730-079d58c29cdf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fENvdHRvbiUyMFN0cmFpZ2h0JTIwS3VydGF8ZW58MHx8MHx8fDA%3D",
    category: "womens",
    inStock: true,
    isFeatured: true,
    isTrending: false,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Chikankari Embroidered Kurta",
    description: "Traditional embroidery with modern style",
    price: 2199,
    originalPrice: 3499,
    discountPercentage: 37,
    currency: "INR",
    rating: 4.5,
    totalReviews: 42100,
    image:
      "https://images.unsplash.com/photo-1667665970118-f55705003914?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Q2hpa2Fua2FyaSUyMEVtYnJvaWRlcmVkJTIwS3VydGF8ZW58MHx8MHx8fDA%3D",
    category: "womens",
    inStock: true,
    isFeatured: true,
    isTrending: false,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Rayon A-Line Kurta",
    description: "Soft rayon fabric with A-line cut",
    price: 1299,
    originalPrice: 1999,
    discountPercentage: 35,
    currency: "INR",
    rating: 4.1,
    totalReviews: 27500,
    image:
      "https://plus.unsplash.com/premium_photo-1691030256214-dc57034ec935?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UmF5b24lMjBBLUxpbmUlMjBLdXJ0YXxlbnwwfHwwfHx8MA%3D%3D",
    category: "mens",
    inStock: false,
    isFeatured: true,
    isTrending: false,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Festive Silk Blend Kurta",
    description: "Perfect for weddings and celebrations",
    price: 2599,
    originalPrice: 3999,
    discountPercentage: 35,
    currency: "INR",
    rating: 4.6,
    totalReviews: 51200,
    image:
      "https://images.unsplash.com/photo-1669197799007-a2148da3d7c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RmVzdGl2ZSUyMFNpbGslMjBCbGVuZCUyMEt1cnRhfGVufDB8fDB8fHww",
    category: "womens",
    inStock: true,
    isFeatured: true,
    isTrending: false,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Casual Printed Kurta",
    description: "Lightweight kurta for everyday wear",
    price: 899,
    originalPrice: 1399,
    discountPercentage: 36,
    currency: "INR",
    rating: 3.8,
    totalReviews: 15800,
    image:
      "https://images.unsplash.com/photo-1768033976342-6dea958334d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2FzdWFsJTIwUHJpbnRlZCUyMEt1cnRhfGVufDB8fDB8fHww",
    category: "womens",
    inStock: true,
    isFeatured: true,
    isTrending: false,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Designer Party Wear Kurta",
    description: "Premium design with intricate patterns",
    price: 3299,
    originalPrice: 4999,
    discountPercentage: 34,
    currency: "INR",
    rating: 4.7,
    totalReviews: 62000,
    image:
      "https://images.unsplash.com/photo-1765529374855-7353c3c47fc6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JTIyRGVzaWduZXIlMjBQYXJ0eSUyMFdlYXIlMjBLdXJ0YXxlbnwwfHwwfHx8MA%3D%3D",
    category: "womens",
    inStock: true,
    isFeatured: true,
    isTrending: false,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
];

// ─── Trending Products ────────────────────────────────────
const trendingProducts = [
  {
    title: "Handblock Printed Kurta",
    description: "Traditional handblock prints with a modern touch",
    price: 1399,
    originalPrice: 2199,
    discountPercentage: 36,
    currency: "INR",
    rating: 4.2,
    totalReviews: 28450,
    image:
      "https://images.unsplash.com/photo-1693988123100-8c03b03f8b1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8SGFuZGJsb2NrJTIwUHJpbnRlZCUyMEt1cnRhfGVufDB8fDB8fHww",
    category: "womens",
    inStock: true,
    isFeatured: false,
    isTrending: true,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Embroidered Straight Kurta",
    description: "Subtle embroidery perfect for office wear",
    price: 1599,
    originalPrice: 2499,
    discountPercentage: 36,
    currency: "INR",
    rating: 4.1,
    totalReviews: 19870,
    image:
      "https://images.unsplash.com/photo-1669199527901-adc5c7e3b1b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RW1icm9pZGVyZWQlMjBTdHJhaWdodCUyMEt1cnRhfGVufDB8fDB8fHww",
    category: "womens",
    inStock: true,
    isFeatured: false,
    isTrending: true,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Geometric Print Kurta",
    description: "Stylish geometric patterns for a chic look",
    price: 1199,
    originalPrice: 1799,
    discountPercentage: 33,
    currency: "INR",
    rating: 3.7,
    totalReviews: 14320,
    image:
      "https://images.unsplash.com/photo-1762708547805-472836585b39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEdlb21ldHJpYyUyMFByaW50JTIwS3VydGF8ZW58MHx8MHx8fDA%3D",
    category: "mens",
    inStock: true,
    isFeatured: false,
    isTrending: true,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Lucknowi Chikankari Kurta",
    description: "Elegant chikankari work for ethnic charm",
    price: 2499,
    originalPrice: 3799,
    discountPercentage: 34,
    currency: "INR",
    rating: 4.6,
    totalReviews: 36700,
    image:
      "https://images.unsplash.com/photo-1727835523545-70ee992b5763?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2hpa2Fua2FyaSUyMEt1cnRhfGVufDB8fDB8fHww",
    category: "mens",
    inStock: false,
    isFeatured: false,
    isTrending: true,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Flared Anarkali Kurta",
    description: "Graceful flare design ideal for festive wear",
    price: 2799,
    originalPrice: 4299,
    discountPercentage: 35,
    currency: "INR",
    rating: 4.5,
    totalReviews: 45210,
    image:
      "https://images.unsplash.com/photo-1632826727450-996172449d21?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RmxhcmVkJTIwQW5hcmthbGklMjBLdXJ0YXxlbnwwfHwwfHx8MA%3D%3D",
    category: "womens",
    inStock: true,
    isFeatured: false,
    isTrending: true,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Minimalist Cotton Kurta",
    description: "Breathable cotton fabric for daily comfort",
    price: 899,
    originalPrice: 1299,
    discountPercentage: 31,
    currency: "INR",
    rating: 3.9,
    totalReviews: 16780,
    image:
      "https://images.unsplash.com/photo-1610035108052-74195fc6a986?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWluaW1hbGlzdCUyMENvdHRvbiUyMEt1cnRhfGVufDB8fDB8fHww",
    category: "mens",
    inStock: true,
    isFeatured: false,
    isTrending: true,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Silk Festive Kurta",
    description: "Luxurious silk blend for grand occasions",
    price: 3099,
    originalPrice: 4799,
    discountPercentage: 35,
    currency: "INR",
    rating: 4.7,
    totalReviews: 53890,
    image:
      "https://images.unsplash.com/photo-1669199208291-725eeefa0ffd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2lsayUyMEZlc3RpdmUlMjBLdXJ0YXxlbnwwfHwwfHx8MA%3D%3D",
    category: "womens",
    inStock: true,
    isFeatured: false,
    isTrending: true,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
  {
    title: "Abstract Print Kurta",
    description: "Trendy abstract prints for a modern vibe",
    price: 1099,
    originalPrice: 1699,
    discountPercentage: 35,
    currency: "INR",
    rating: 4.0,
    totalReviews: 22150,
    image:
      "https://images.unsplash.com/photo-1768478701607-db8c96dbb87f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEFic3RyYWN0JTIwUHJpbnQlMjBLdXJ0YXxlbnwwfHwwfHx8MA%3D%3D",
    category: "womens",
    inStock: true,
    isFeatured: false,
    isTrending: true,
    sizes: ["S", "M", "L", "XL"],
    detailedDescription:
      "High-quality fabric with elegant design, perfect for any occasion. Comfortable and stylish.",
  },
];

// ─── Sponsored ─────────────────────────────────────────────
const sponsoredItems = [
  {
    image:
      "https://images.unsplash.com/photo-1557394139-8afb164a0289?w=500&auto=format&fit=crop&q=60",
    text: "Up to 50% Off",
    filterType: "deal",
    filterValue: "50-off",
  },
  {
    image:
      "https://plus.unsplash.com/premium_photo-1673502752899-04caa9541a5c?w=500&auto=format&fit=crop&q=60",
    text: "Buy 1 Get 1 Free",
    filterType: "deal",
    filterValue: "bogo",
  },
  {
    image:
      "https://plus.unsplash.com/premium_photo-1714226832770-ca4d14895740?w=500&auto=format&fit=crop&q=60",
    text: "Flat 30% Off",
    filterType: "deal",
    filterValue: "30-off",
  },
];

// ─── Seed Function ─────────────────────────────────────────
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Category.deleteMany({});
    await Banner.deleteMany({});
    await Deal.deleteMany({});
    await Product.deleteMany({});
    await Sponsored.deleteMany({});
    console.log("🗑️  Cleared old data");

    // Insert new data
    await Category.insertMany(categories);
    console.log("📂 Categories seeded");

    await Banner.insertMany(banners);
    console.log("🖼️  Banners seeded");

    await Deal.insertMany(deals);
    console.log("🏷️  Deals seeded");

    await Product.insertMany([...featuredProducts, ...trendingProducts]);
    console.log("📦 Products seeded");

    await Sponsored.insertMany(sponsoredItems);
    console.log("📢 Sponsored items seeded");

    console.log("\n🌱 All seed data inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
