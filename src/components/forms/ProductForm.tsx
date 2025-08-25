import React, { useEffect } from 'react';
import { Save, X } from 'lucide-react';

import { useForm } from '../../hooks/useForm';
import { formatCategory } from '../../utils/productUtils';
import FormField from './FormField';
import { PRODUCT_CATEGORIES, type Product, type ProductFormData } from '../../types';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  title: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isSubmitting = false,
  title
}) => {
  const initialData: ProductFormData = {
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    category: product?.category || '',
    image: product?.image || '',
    inStock: product?.inStock ?? true
  };

  const {
    formData,
    errors,
    updateField,
    updateTouched,
    handleSubmit,
    setData,
    isValid
  } = useForm({
    initialData,
    onSubmit
  });

  useEffect(() => {
    if (product) {
      setData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        image: product.image,
        inStock: product.inStock ?? true
      });
    }
  }, [product, setData]);

  const categoryOptions = PRODUCT_CATEGORIES.map(category => ({
    value: category,
    label: formatCategory(category)
  }));

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Product Title"
          id="title"
          type="text"
          value={formData.title}
          onChange={(value) => updateField('title', value)}
          onBlur={() => updateTouched('title')}
          error={errors.title}
          placeholder="Enter product title"
          required
        />

        <FormField
          label="Description"
          id="description"
          type="textarea"
          value={formData.description}
          onChange={(value) => updateField('description', value)}
          onBlur={() => updateTouched('description')}
          error={errors.description}
          placeholder="Enter product description"
          rows={4}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Price"
            id="price"
            type="number"
            value={formData.price}
            onChange={(value) => updateField('price', value)}
            onBlur={() => updateTouched('price')}
            error={errors.price}
            placeholder="0.00"
            required
          />

          <FormField
            label="Category"
            id="category"
            type="select"
            value={formData.category}
            onChange={(value) => updateField('category', value)}
            onBlur={() => updateTouched('category')}
            error={errors.category}
            options={categoryOptions}
            required
          />
        </div>

        <FormField
          label="Product Image URL"
          id="image"
          type="url"
          value={formData.image}
          onChange={(value) => updateField('image', value)}
          onBlur={() => updateTouched('image')}
          error={errors.image}
          placeholder="https://example.com/image.jpg"
          required
        />

        <FormField
          label="In Stock"
          id="inStock"
          type="checkbox"
          value={formData.inStock}
          onChange={(value) => updateField('inStock', value)}
        />

        {formData.image && (
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Preview
            </label>
            <img
              src={formData.image}
              alt="Preview"
              className="w-32 h-24 object-cover rounded-lg border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;