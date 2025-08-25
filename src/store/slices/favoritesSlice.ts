
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FavoritesState, Product } from '../../types';
import { favoritesStorage } from '../../utils/localStorage';

const initialState: FavoritesState = {
  favoriteIds: favoritesStorage.getFavorites(),
  favorites: []
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    loadFavoritesFromStorage: (state) => {
      state.favoriteIds = favoritesStorage.getFavorites();
    },
    
    addToFavorites: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      if (!state.favoriteIds.includes(product.id)) {
        state.favoriteIds = favoritesStorage.addFavorite(product.id);
        state.favorites.push(product);
      }
    },
    
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.favoriteIds = favoritesStorage.removeFavorite(productId);
      state.favorites = state.favorites.filter(product => product.id !== productId);
    },
    
    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      if (state.favoriteIds.includes(product.id)) {
        state.favoriteIds = favoritesStorage.removeFavorite(product.id);
        state.favorites = state.favorites.filter(p => p.id !== product.id);
      } else {
        state.favoriteIds = favoritesStorage.addFavorite(product.id);
        state.favorites.push(product);
      }
    },
    
    syncFavoritesWithProducts: (state, action: PayloadAction<Product[]>) => {
      const allProducts = action.payload;
      state.favorites = allProducts.filter(product => 
        state.favoriteIds.includes(product.id)
      );
    },
    
    clearAllFavorites: (state) => {
      state.favoriteIds = [];
      state.favorites = [];
      favoritesStorage.setFavorites([]);
    }
  }
});

export const {
  loadFavoritesFromStorage,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  syncFavoritesWithProducts,
  clearAllFavorites
} = favoritesSlice.actions;

export default favoritesSlice.reducer;