import { Doc } from '@convex';

export type CategoryItem = Doc<'categories'> & { productCount?: number };

export interface CategoryFormData {
  name: string;
}

export const createEmptyCategoryForm = (): CategoryFormData => ({
  name: '',
});
