import { useState, useMemo } from "react";

export type SortOption =
  | "popular"
  | "newest"
  | "customer_review"
  | "price_low_high"
  | "price_high_low";

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  rating: number | null;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  category: string;
  color?: string;
  size?: string;
  createdAt?: Date;
  reviews?: number;
}

const initialFilterState: FilterState = {
  categories: [],
  priceRange: [0, 10000],
  colors: [],
  sizes: [],
  rating: null,
};

export const useProductFilters = () => {
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [filters, setFilters] = useState<FilterState>(initialFilterState);


  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      (filters.categories?.length || 0) > 0 ||
      (filters.colors?.length || 0) > 0 ||
      (filters.sizes?.length || 0) > 0 ||
      filters.rating !== null ||
      filters.priceRange?.[0] !== 0 ||
      filters.priceRange?.[1] !== 10000
    );
  }, [filters]);

  return {
    sortBy,
    setSortBy,
    filters,
    setAllFilters: setFilters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    activeFilterCount:
      (filters.categories?.length || 0) +
      (filters.colors?.length || 0) +
      (filters.sizes?.length || 0) +
      (filters.rating ? 1 : 0) +
      (filters.priceRange?.[0] !== 0 || filters.priceRange?.[1] !== 10000 ? 1 : 0),
  };
};