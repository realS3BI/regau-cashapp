import type { CategoryItem } from './types';

export const filterNonDeletedCategories = (
  categories: CategoryItem[] | undefined
): CategoryItem[] => {
  return categories?.filter((category) => !category.deletedAt) ?? [];
};

export const calculateNextOrderNumber = (categories: CategoryItem[]): number => {
  if (categories.length === 0) return 0;
  const maxOrder = Math.max(...categories.map((category) => category.order));
  return maxOrder + 1;
};
