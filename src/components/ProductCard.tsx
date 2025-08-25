import React, { useState } from 'react';
import { Star, Package, Heart, Edit, Trash2, MoreVertical } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  isFavorite?: boolean;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onToggleFavorite,
  onEdit,
  onDelete,
  isFavorite = false,
  showActions = false
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart && (product.inStock ?? true)) {
      onAddToCart(product);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onEdit) {
      onEdit(product);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onDelete && window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      onDelete(product);
    }
  };

  const formatCategory = (category: string) => {
    return category.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md px-2 py-4 overflow-hidden group relative flex flex-col h-full">
      {showActions && (
        <div className="absolute top-2 left-2 z-10">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            
            {showMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {onToggleFavorite && (
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-600'
          }`}
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-200 ${
              isFavorite ? 'fill-current' : 'hover:fill-current'
            }`} 
          />
        </button>
      )}

      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-contain"
          loading="lazy"
        />
        {product.inStock === false && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
        {product.isCustom && (
          <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            CUSTOM
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 text-yellow-400 ml-2">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm text-gray-600">{product.rating.rate}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-blue-600 font-medium">
            {formatCategory(product.category)}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{product.rating.count} reviews</span>
        </div>
        
        <div className="flex-grow"></div>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              product.inStock !== false
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Package className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {showMenu && showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ProductCard;