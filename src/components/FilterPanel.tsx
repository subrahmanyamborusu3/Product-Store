import React from 'react';
import { SlidersHorizontal, Star } from 'lucide-react';
import { getUniqueCategories, getMaxPrice, formatCategory } from '../utils/productUtils';
import type { FilterState, Product } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
  products: Product[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  isOpen,
  onToggle,
  products
}) => {
  const categories = ['All', ...getUniqueCategories(products)];
  const maxPrice = products.length > 0 ? getMaxPrice(products) : 1000;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button
              onClick={onClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange({ category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All' ? '' : category}>
                    {category === 'All' ? 'All Categories' : formatCategory(category)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </label>
              <div className="flex gap-2">
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={filters.priceRange[0]}
                  onChange={(e) => onFilterChange({ 
                    priceRange: [Number(e.target.value), filters.priceRange[1]] 
                  })}
                  className="flex-1"
                />
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={filters.priceRange[1]}
                  onChange={(e) => onFilterChange({ 
                    priceRange: [filters.priceRange[0], Number(e.target.value)] 
                  })}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <div className="flex items-center gap-2">
                {[0, 3, 4, 4.5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => onFilterChange({ rating })}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-colors ${
                      filters.rating === rating
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                    {rating === 0 ? 'All' : `${rating}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;