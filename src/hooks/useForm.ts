import { useState, useCallback } from 'react';
import { validateProductForm, hasErrors } from '../utils/validation';
import type { ProductFormData, ProductFormErrors } from '../types';

interface UseFormProps {
  initialData: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  validate?: boolean;
}

export const useForm = ({ initialData, onSubmit, validate = true }: UseFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>(initialData);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [touched, setTouched] = useState<{ [key in keyof ProductFormData]?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

  const updateTouched = useCallback((field: keyof ProductFormData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return {};
    const formErrors = validateProductForm(formData);
    setErrors(formErrors);
    return formErrors;
  }, [formData, validate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formErrors = validateForm();
    
    if (!hasErrors(formErrors)) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }

    setIsSubmitting(false);
  }, [formData, onSubmit, validateForm]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialData]);

  const setData = useCallback((data: ProductFormData) => {
    setFormData(data);
    setErrors({});
    setTouched({});
  }, []);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    updateField,
    updateTouched,
    handleSubmit,
    resetForm,
    setData,
    isValid: !hasErrors(errors)
  };
};