import { useState, useCallback } from 'react';
import { Doc, Id } from '@convex';
import { convertCentsToEuro, convertEuroToCents } from '@/lib/product-utils';
import { createEmptyProductForm, type ProductFormData, type ProductSubmitData } from '../types';

export const useProductForm = () => {
  const [form, setForm] = useState<ProductFormData>(createEmptyProductForm());
  const [editingProductId, setEditingProductId] = useState<Id<'products'> | null>(null);

  const resetForm = useCallback((): void => {
    setForm(createEmptyProductForm());
    setEditingProductId(null);
  }, []);

  const setFormFromProduct = useCallback((product: Doc<'products'>): void => {
    setEditingProductId(product._id);
    setForm({
      active: product.active,
      categoryId: product.categoryId,
      description: product.description || '',
      isFavorite: product.isFavorite ?? false,
      name: product.name,
      priceA: convertCentsToEuro(product.priceA ?? product.priceB ?? 0),
      priceB: convertCentsToEuro(product.priceB ?? product.priceA ?? 0),
    });
  }, []);

  const updateFormField = useCallback(
    <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]): void => {
      setForm((previousForm) => ({ ...previousForm, [field]: value }));
    },
    []
  );

  const getFormDataForSubmit = useCallback((): ProductSubmitData => {
    return {
      active: form.active,
      categoryId: form.categoryId as Id<'categories'>,
      description: form.description || undefined,
      isFavorite: form.isFavorite,
      name: form.name,
      priceA: convertEuroToCents(form.priceA),
      priceB: convertEuroToCents(form.priceB),
    };
  }, [form]);

  return {
    form,
    editingProductId,
    resetForm,
    setFormFromProduct,
    updateFormField,
    getFormDataForSubmit,
  };
};
