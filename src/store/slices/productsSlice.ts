import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { filterAndSortProducts } from '../../utils/productUtils';
import { recentSearchesStorage, storage, LOCAL_STORAGE_KEYS, apiFetchStorage } from '../../utils/localStorage';
import { apiService } from '../../services/api';
import type { ProductsState, FilterState, Product, ProductFormData } from '../../types';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      if (apiFetchStorage.isApiFetched()) {  
        return null;
      }

      const products = await apiService.fetchProducts();
      apiFetchStorage.setApiFetched(true);
      
      return products;
    } catch (error) {
      console.error('API fetch failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products from API';
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    inStock: null,
    sortBy: 'title',
    favoritesOnly: false
  },
  filteredItems: [],
  isCreating: false,
  isUpdating: false,
  editingProduct: null
};

const generateCustomId = () => Date.now();

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      if (action.payload.trim() && action.payload !== state.searchTerm) {
        recentSearchesStorage.addRecentSearch(action.payload);
      }
      
      state.searchTerm = action.payload;
      state.filteredItems = filterAndSortProducts(
        state.items, 
        action.payload, 
        state.filters,
        []
      );
    },

    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredItems = filterAndSortProducts(
        state.items, 
        state.searchTerm, 
        state.filters,
        []
      );
    },

    clearFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: [0, 1000],
        rating: 0,
        inStock: null,
        sortBy: 'title',
        favoritesOnly: false
      };
      state.searchTerm = '';
      state.filteredItems = filterAndSortProducts(
        state.items, 
        '', 
        state.filters,
        []
      );
    },

    updateFilteredItems: (state, action: PayloadAction<number[]>) => {
      const favoriteIds = action.payload;
      state.filteredItems = filterAndSortProducts(
        state.items,
        state.searchTerm,
        state.filters,
        favoriteIds
      );
    },

    setCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },

    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload;
    },

    setEditingProduct: (state, action: PayloadAction<Product | null>) => {
      state.editingProduct = action.payload;
    },

    createProduct: (state, action: PayloadAction<ProductFormData>) => {
      const formData = action.payload;
      const newProduct: Product = {
        id: generateCustomId(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image.trim(),
        rating: {
          rate: 0,
          count: 0
        },
        isCustom: true,
        inStock: formData.inStock,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      state.items.unshift(newProduct);
      
      const maxPrice = Math.max(...state.items.map(p => p.price));
      if (maxPrice > state.filters.priceRange[1]) {
        state.filters.priceRange[1] = Math.ceil(maxPrice);
      }
      
      state.filteredItems = filterAndSortProducts(
        state.items,
        state.searchTerm,
        state.filters,
        []
      );
      state.isCreating = false;
      state.error = null;

      storage.set(LOCAL_STORAGE_KEYS.PRODUCTS, state.items);
    },

    updateProduct: (state, action: PayloadAction<{ id: number; data: ProductFormData }>) => {
      const { id, data } = action.payload;
      const index = state.items.findIndex(product => product.id === id);
      
      if (index !== -1) {
        const existingProduct = state.items[index];
        state.items[index] = {
          ...existingProduct,
          title: data.title.trim(),
          description: data.description.trim(),
          price: parseFloat(data.price),
          category: data.category,
          image: data.image.trim(),
          inStock: data.inStock,
          updatedAt: new Date().toISOString()
        };

        const maxPrice = Math.max(...state.items.map(p => p.price));
        if (maxPrice > state.filters.priceRange[1]) {
          state.filters.priceRange[1] = Math.ceil(maxPrice);
        }

        state.filteredItems = filterAndSortProducts(
          state.items,
          state.searchTerm,
          state.filters,
          []
        );
        state.isUpdating = false;
        state.editingProduct = null;
        state.error = null;

        storage.set(LOCAL_STORAGE_KEYS.PRODUCTS, state.items);
      }
    },

    deleteProduct: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.items = state.items.filter(product => product.id !== id);
      state.filteredItems = filterAndSortProducts(
        state.items,
        state.searchTerm,
        state.filters,
        []
      );
      state.editingProduct = null;

      storage.set(LOCAL_STORAGE_KEYS.PRODUCTS, state.items);
    },

    loadProductsFromStorage: (state) => {
      const savedProducts = storage.get<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, []);
      if (savedProducts.length > 0) {
        state.items = savedProducts;
        
        const maxPrice = Math.max(...savedProducts.map(p => p.price), 1000);
        state.filters.priceRange[1] = Math.ceil(maxPrice);
        
        state.filteredItems = filterAndSortProducts(
          savedProducts,
          state.searchTerm,
          state.filters,
          []
        );
      }
    },

    resetApiFetch: () => {
      apiFetchStorage.clearApiFetched();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        if (action.payload === null) {
          const savedProducts = storage.get<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, []);
          if (savedProducts.length > 0) {
            state.items = savedProducts;
            const maxPrice = Math.max(...savedProducts.map(p => p.price), 1000);
            state.filters.priceRange[1] = Math.ceil(maxPrice);
            state.filteredItems = filterAndSortProducts(
              savedProducts,
              state.searchTerm,
              state.filters,
              []
            );
          }
          return;
        }
        const existingProducts = state.items.filter(p => p.isCustom);
        const apiProducts = action.payload.map(p => ({ ...p, isCustom: false }));
        
        state.items = [...apiProducts, ...existingProducts];
        
        const maxPrice = Math.max(...state.items.map(p => p.price), 1000);
        state.filters.priceRange[1] = Math.ceil(maxPrice);
        
        state.filteredItems = filterAndSortProducts(
          state.items,
          state.searchTerm,
          state.filters,
          []
        );
        
        storage.set(LOCAL_STORAGE_KEYS.PRODUCTS, state.items);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setSearchTerm,
  setFilters,
  clearFilters,
  updateFilteredItems,
  setCreating,
  setUpdating,
  setEditingProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  loadProductsFromStorage,
  resetApiFetch
} = productsSlice.actions;

export default productsSlice.reducer;