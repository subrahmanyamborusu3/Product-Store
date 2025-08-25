import React, { useState } from 'react';
import { Plus, ArrowLeft, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createProduct, updateProduct, deleteProduct, setEditingProduct, setCreating, setUpdating } from '../store/slices/productsSlice';
import ProductCard from './ProductCard';
import ProductModal from './modals/ProductModal';
import type { ProductFormData, Product } from '../types';

interface ProductManagementProps {
  onBack: () => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const { items: products, isCreating, isUpdating, editingProduct } = useAppSelector(state => state.products);
  const { favoriteIds } = useAppSelector(state => state.favorites);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCreateProduct = (data: ProductFormData) => {
    dispatch(setCreating(true));
    dispatch(createProduct(data));
    setIsCreateModalOpen(false);
  };

  const handleUpdateProduct = (data: ProductFormData) => {
    if (editingProduct) {
      dispatch(setUpdating(true));
      dispatch(updateProduct({ id: editingProduct.id, data }));
      setIsEditModalOpen(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    dispatch(setEditingProduct(product));
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    dispatch(deleteProduct(product.id));
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    dispatch(setCreating(false));
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    dispatch(setEditingProduct(null));
    dispatch(setUpdating(false));
  };

  const sortedProducts = [...products].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.id);
    const dateB = new Date(b.createdAt || b.id);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Store
              </button>
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600 mt-1">
                Manage your product catalog - {products.length} products total
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
            <div className="text-gray-600 text-sm">Total Products</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.inStock).length}
            </div>
            <div className="text-gray-600 text-sm">In Stock</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => !p.inStock).length}
            </div>
            <div className="text-gray-600 text-sm">Out of Stock</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(products.map(p => p.category)).size}
            </div>
            <div className="text-gray-600 text-sm">Categories</div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                isFavorite={favoriteIds.includes(product.id)}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your catalog by adding your first product
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add First Product
            </button>
          </div>
        )}
      </main>

      <ProductModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateProduct}
        isSubmitting={isCreating}
        title="Add New Product"
      />

      <ProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateProduct}
        product={editingProduct || undefined}
        isSubmitting={isUpdating}
        title="Edit Product"
      />
    </div>
  );
};

export default ProductManagement;