// ─── Home Dashboard API Response Types ─────────────────────

export interface Category {
  _id: string;
  title: string;
  image: string;
  slug: string;
}

export interface Banner {
  _id: string;
  image: string;
  filterType?: string;
  filterValue?: string;
}

export type DealDescription =
  | {
      type: "countdown";
      totalSeconds: number;
    }
  | {
      type: "static";
      text: string;
    };

export interface DealInfo {
  title: string;
  icon: string;
  backgroundColor: string;
  description: DealDescription;
  filterType?: string;
  filterValue?: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  currency: string;
  rating: number;
  totalReviews: number;
  image: string;
  category: string;
  inStock: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  sizes: string[];
  detailedDescription: string;
}

export interface SponsoredItem {
  _id: string;
  image: string;
  text: string;
  filterType?: string;
  filterValue?: string;
}

export interface HomeDashboardData {
  categories: Category[];
  offerBanners: Banner[];
  shoesBanners: Banner[];
  dealOfTheDay: DealInfo | null;
  trendingDeal: DealInfo | null;
  featuredProducts: Product[];
  trendingProducts: Product[];
  sponsored: SponsoredItem[];
}
