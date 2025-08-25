export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  isCustom?: boolean;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  image: string;
  inStock: boolean;
}

export interface ProductFormErrors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  image?: string;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
  inStock: boolean | null;
  sortBy: 'title' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  favoritesOnly: boolean;
}

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filters: FilterState;
  filteredItems: Product[];
  isCreating: boolean;
  isUpdating: boolean;
  editingProduct: Product | null;
}

export interface FavoritesState {
  favoriteIds: number[];
  favorites: Product[];
}

export const LOCAL_STORAGE_KEYS = {
  FAVORITES: 'product-store-favorites',
  RECENT_SEARCHES: 'product-store-recent-searches',
  PRODUCTS: 'product-store-products',
  API_FETCHED: 'product-store-api-fetched'
} as const;

export const API_CATEGORIES = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing"
] as const;

export const PRODUCT_CATEGORIES = [
  ...API_CATEGORIES,
  'books',
  'health & beauty',
  'automotive',
  'toys & games'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];