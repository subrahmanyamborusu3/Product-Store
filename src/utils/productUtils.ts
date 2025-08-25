import type { FilterState, Product } from "../types";

export const filterAndSortProducts = (
  products: Product[],
  searchTerm: string,
  filters: FilterState,
  favoriteIds: number[] = []
): Product[] => {
  let filtered = products.filter(product => {
    if (filters.favoritesOnly && !favoriteIds.includes(product.id)) {
      return false;
    }
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const titleMatch = product.title.toLowerCase().includes(query);
      const descMatch = product.description.toLowerCase().includes(query);
      const categoryMatch = product.category.toLowerCase().includes(query);
      
      if (!titleMatch && !descMatch && !categoryMatch) {
        return false;
      }
    }

    if (filters.category && product.category !== filters.category) {
      return false;
    }


    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    if (filters.rating > 0 && product.rating.rate < filters.rating) {
      return false;
    }

    if (filters.inStock !== null && product.inStock !== filters.inStock) {
      return false;
    }

    return true;
  });

  switch (filters.sortBy) {
    case 'title':
      filtered.sort((a, b) => a.title?.localeCompare(b.title));
      break;
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
    case 'newest':
      filtered.sort((a, b) => {
        if (a.isCustom && !b.isCustom) return -1;
        if (!a.isCustom && b.isCustom) return 1;
        return b.id - a.id;
      });
      break;
  }

  return filtered;
};

export const getUniqueCategories = (products: Product[]): string[] => {
  return Array.from(new Set(products.map(p => p.category)));
};

export const getMaxPrice = (products: Product[]): number => {
  return products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000;
};

export const formatCategory = (category: string): string => {
  return category.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};