import React from 'react';
import type { FilterState } from '../types';

interface SortDropdownProps {
  sortBy: FilterState['sortBy'];
  onSortChange: (sortBy: FilterState['sortBy']) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'title', label: 'Name A-Z' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ] as const;

  return (
    <select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value as FilterState['sortBy'])}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    >
      {sortOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SortDropdown;