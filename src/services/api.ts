import type { Product } from "../types";


export const apiService = {
  fetchProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const products: Product[] = await response.json();
      return products.map(product => ({
        ...product,
        inStock: Math.random() > 0.1,
        isCustom: false
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  fetchCategories: async (): Promise<string[]> => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};