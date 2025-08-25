import React, { useEffect } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import ProductCard from './ProductCard';
import type { Product } from '../types';
import { loadFavoritesFromStorage, syncFavoritesWithProducts, toggleFavorite } from '../store/slices/favoritesSlice';

interface FavoritesPageProps {
  onBack: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector(state => state.favorites);
  const { items: allProducts } = useAppSelector(state => state.products);

  useEffect(() => {
    dispatch(loadFavoritesFromStorage());
    dispatch(syncFavoritesWithProducts(allProducts));
  }, [dispatch, allProducts]);

  const handleToggleFavorite = (product: Product) => {
    dispatch(toggleFavorite(product));
  };

  const handleAddToCart = (product: Product) => {
    alert(product?.title + '-  Added to cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-600 fill-current" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600 mt-1">
                {favorites.length} item{favorites.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={true}
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start adding products to your favorites by clicking the heart icon
            </p>
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoritesPage;