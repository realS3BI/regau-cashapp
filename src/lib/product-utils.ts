import { Doc, Id } from '@convex';

interface Product {
  _id: Id<'products'>;
  categoryId: Id<'categories'>;
  deletedAt?: number;
  name: string;
}

interface Category {
  order: number;
}

const convertEuroToCents = (euroString: string): number => {
  return Math.round(parseFloat(euroString) * 100);
};

const convertCentsToEuro = (cents: number): string => {
  return (cents / 100).toFixed(2);
};

const filterNonDeletedProducts = <T extends { deletedAt?: number }>(
  products: T[] | undefined
): T[] => {
  return products?.filter((product) => !product.deletedAt) ?? [];
};

const filterProductsByCategory = <T extends Product>(
  products: T[],
  categoryId: Id<'categories'> | 'all'
): T[] => {
  if (categoryId === 'all') return products;
  return products.filter((product) => product.categoryId === categoryId);
};

const sortProductsByName = <T extends { name: string }>(products: T[]): T[] => {
  return [...products].sort((a, b) => a.name.localeCompare(b.name, 'de'));
};

const getVisibleProducts = <T extends Doc<'products'>>(
  products: T[] | undefined,
  categoryId: Id<'categories'> | 'all'
): T[] => {
  const nonDeleted = filterNonDeletedProducts(products);
  const filtered = filterProductsByCategory(nonDeleted, categoryId);
  return sortProductsByName(filtered);
};

const calculateNextCategoryOrder = (categories: Category[]): number => {
  if (categories.length === 0) return 0;
  const maxOrder = Math.max(...categories.map((category) => category.order));
  return maxOrder + 1;
};

export {
  calculateNextCategoryOrder,
  convertCentsToEuro,
  convertEuroToCents,
  filterNonDeletedProducts,
  filterProductsByCategory,
  getVisibleProducts,
  sortProductsByName,
};
