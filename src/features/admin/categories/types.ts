import { Doc } from '@convex';

export type CategoryItem = Doc<'categories'> & { productCount?: number };

export interface CategoryFormData {
  active: boolean;
  name: string;
}

export const createEmptyCategoryForm = (): CategoryFormData => ({
  active: true,
  name: '',
});
