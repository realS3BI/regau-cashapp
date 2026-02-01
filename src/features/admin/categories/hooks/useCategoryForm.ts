import { useState, useCallback } from 'react';
import { Id } from '@convex';
import type { CategoryFormData } from '../types';

const createEmptyCategoryForm = (): CategoryFormData => ({
  active: true,
  name: '',
});

export const useCategoryForm = () => {
  const [form, setForm] = useState<CategoryFormData>(createEmptyCategoryForm());
  const [editingCategoryId, setEditingCategoryId] = useState<Id<'categories'> | null>(null);

  const resetForm = useCallback((): void => {
    setForm(createEmptyCategoryForm());
    setEditingCategoryId(null);
  }, []);

  const setFormFromCategory = useCallback(
    (category: { _id: Id<'categories'>; active?: boolean; name: string }): void => {
      setEditingCategoryId(category._id);
      setForm({
        active: category.active ?? true,
        name: category.name,
      });
    },
    []
  );

  const updateFormField = useCallback(
    <K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]): void => {
      setForm((previousForm) => ({ ...previousForm, [field]: value }));
    },
    []
  );

  return {
    editingCategoryId,
    form,
    resetForm,
    setFormFromCategory,
    updateFormField,
  };
};
