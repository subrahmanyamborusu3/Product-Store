import { LOCAL_STORAGE_KEYS } from '../types';

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }
};

export const favoritesStorage = {
  getFavorites: (): number[] => {
    return storage.get<number[]>(LOCAL_STORAGE_KEYS.FAVORITES, []);
  },

  setFavorites: (favoriteIds: number[]): void => {
    storage.set(LOCAL_STORAGE_KEYS.FAVORITES, favoriteIds);
  },

  addFavorite: (productId: number): number[] => {
    const favorites = favoritesStorage.getFavorites();
    if (!favorites.includes(productId)) {
      const updated = [...favorites, productId];
      favoritesStorage.setFavorites(updated);
      return updated;
    }
    return favorites;
  },

  removeFavorite: (productId: number): number[] => {
    const favorites = favoritesStorage.getFavorites();
    const updated = favorites.filter(id => id !== productId);
    favoritesStorage.setFavorites(updated);
    return updated;
  },

  isFavorite: (productId: number): boolean => {
    const favorites = favoritesStorage.getFavorites();
    return favorites.includes(productId);
  }
};

export const recentSearchesStorage = {
  getRecentSearches: (): string[] => {
    return storage.get<string[]>(LOCAL_STORAGE_KEYS.RECENT_SEARCHES, []);
  },

  addRecentSearch: (searchTerm: string): void => {
    if (!searchTerm.trim()) return;
    
    const recentSearches = recentSearchesStorage.getRecentSearches();
    const updated = [
      searchTerm.trim(),
      ...recentSearches.filter(term => term !== searchTerm.trim())
    ].slice(0, 10);
    
    storage.set(LOCAL_STORAGE_KEYS.RECENT_SEARCHES, updated);
  }
};

export const apiFetchStorage = {
  isApiFetched: (): boolean => {
    return storage.get<boolean>(LOCAL_STORAGE_KEYS.API_FETCHED, false);
  },

  setApiFetched: (fetched: boolean): void => {
    storage.set(LOCAL_STORAGE_KEYS.API_FETCHED, fetched);
  },

  clearApiFetched: (): void => {
    storage.remove(LOCAL_STORAGE_KEYS.API_FETCHED);
  }
};

export { LOCAL_STORAGE_KEYS };
