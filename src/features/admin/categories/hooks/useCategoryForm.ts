import { useState, useCallback } from 'react';
import type { CategoryFormData } from '../types';

const createEmptyCategoryForm = (): CategoryFormData => ({
  name: '',
});

export const useCategoryForm = () => {
  const [form, setForm] = useState<CategoryFormData>(createEmptyCategoryForm());

  const resetForm = useCallback((): void => {
    setForm(createEmptyCategoryForm());
  }, []);

  const updateFormField = useCallback(
    <K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]): void => {
      setForm((previousForm) => ({ ...previousForm, [field]: value }));
    },
    []
  );

  return {
    form,
    resetForm,
    updateFormField,
  };
};
