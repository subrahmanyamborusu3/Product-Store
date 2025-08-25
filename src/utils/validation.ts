import type { ProductFormData, ProductFormErrors } from "../types";


export const validateProductForm = (data: ProductFormData): ProductFormErrors => {
  const errors: ProductFormErrors = {};

  if (!data.title.trim()) {
    errors.title = 'Product title is required';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Product title must be at least 3 characters';
  } else if (data.title.trim().length > 200) {
    errors.title = 'Product title must be less than 200 characters';
  }

  if (!data.description.trim()) {
    errors.description = 'Product description is required';
  } else if (data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (data.description.trim().length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  if (!data.price.trim()) {
    errors.price = 'Price is required';
  } else {
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      errors.price = 'Price must be a positive number';
    } else if (price > 10000) {
      errors.price = 'Price must be less than $10,000';
    }
  }

  if (!data.category.trim()) {
    errors.category = 'Category is required';
  }

  if (!data.image.trim()) {
    errors.image = 'Product image URL is required';
  } else {
    try {
      new URL(data.image);
    } catch {
      errors.image = 'Please enter a valid image URL';
    }
  }

  return errors;
};

export const hasErrors = (errors: ProductFormErrors): boolean => {
  return Object.values(errors).some(error => error !== undefined);
};