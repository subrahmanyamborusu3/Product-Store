import React, { useEffect, useState } from 'react';
import { Store, Loader2, Heart, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProducts, setSearchTerm, setFilters, clearFilters, updateFilteredItems, loadProductsFromStorage } from '../store/slices/productsSlice';
import { loadFavoritesFromStorage, syncFavoritesWithProducts, toggleFavorite } from '../store/slices/favoritesSlice';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import SortDropdown from './SortDropdown';
import ProductCard from './ProductCard';
import type { FilterState, Product } from '../types';

interface HomePageProps {
  onViewFavorites: () => void;
  onViewManagement: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onViewFavorites, onViewManagement }) => {
  const dispatch = useAppDispatch();
  const { 
    items: allProducts, 
    filteredItems: products, 
    loading, 
    error, 
    searchTerm, 
    filters 
  } = useAppSelector(state => state.products);
  
  const { favoriteIds, favorites } = useAppSelector(state => state.favorites);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(loadFavoritesFromStorage());
    dispatch(loadProductsFromStorage());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (allProducts.length > 0) {
      dispatch(syncFavoritesWithProducts(allProducts));
    }
  }, [dispatch, allProducts]);

  useEffect(() => {
    dispatch(updateFilteredItems(favoriteIds));
  }, [dispatch, favoriteIds, allProducts.length]);

  const handleSearchChange = (term: string) => {
    dispatch(setSearchTerm(term));
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearSearch = () => {
    dispatch(setSearchTerm(''));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setIsFilterOpen(false);
  };

  const handleToggleFavorite = (product: Product) => {
    dispatch(toggleFavorite(product));
  };

  const handleAddToCart = (product: Product) => {
     alert(product?.title + '-  Added to cart');
  };

  const handleRetry = () => {
    dispatch(fetchProducts());
  };

  const activeFiltersCount = [
    filters.category,
    filters.rating > 0,
    filters.inStock !== null,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1000,
    filters.favoritesOnly
  ].filter(Boolean).length;

  if (loading && allProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading products from FakeStoreAPI...</span>
        </div>
      </div>
    );
  }

  if (error && allProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {error && allProducts.length > 0 && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-700 text-sm">
                    Showing saved products only. Failed to fetch latest: {error}
                  </span>
                </div>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800 text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Store</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 sm:justify-end">
              <button
                onClick={onViewManagement}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Manage Products
              </button>
              
              <button
                onClick={onViewFavorites}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Heart className="w-5 h-5" />
                Favorites ({favorites.length})
              </button>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <div className="w-full sm:flex-1 sm:min-w-0">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onClear={handleClearSearch}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
                products={allProducts}
              />
              {activeFiltersCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {activeFiltersCount} active
                </span>
              )}
            </div>

            <SortDropdown
              sortBy={filters.sortBy}
              onSortChange={(sortBy) => handleFilterChange({ sortBy })}
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-600 text-sm sm:text-base">
            Showing {products.length} of {allProducts.length} products
            {searchTerm && (
              <span className="font-medium"> for "{searchTerm}"</span>
            )}
            {filters.favoritesOnly && (
              <span className="font-medium text-red-600"> (favorites only)</span>
            )}
          </p>
          
          {(searchTerm || activeFiltersCount > 0) && (
            <button
              onClick={handleClearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start sm:self-auto"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favoriteIds.includes(product.id)}
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600 mb-4">
              {error ? 'Failed to load products from API.' : 'Try adjusting your search terms or filters.'}
            </p>
            {error ? (
              <button
                onClick={handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Retry Loading
              </button>
            ) : (
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;