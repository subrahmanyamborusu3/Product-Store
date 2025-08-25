import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { type Product, type ProductFormData } from '../../types';
import ProductForm from '../forms/ProductForm';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  product?: Product;
  isSubmitting?: boolean;
  title: string;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  isSubmitting,
  title
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-[#000000b0] bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <ProductForm
            product={product}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            title={title}
          />
        </div>
      </div>
    </div>
  );

  const modalRoot = document.getElementById('modal-root') || document.body;
  return createPortal(modalContent, modalRoot);
};

export default ProductModal;