import { Id } from '@convex';

export interface ProductFormData {
  active: boolean;
  categoryId: Id<'categories'>;
  description: string;
  isFavorite: boolean;
  name: string;
  priceA: string;
  priceB: string;
}

/** Payload for create/update product mutation (prices in cents). */
export interface ProductSubmitData {
  active: boolean;
  categoryId: Id<'categories'>;
  description?: string;
  isFavorite: boolean;
  name: string;
  priceA: number;
  priceB: number;
}

export const createEmptyProductForm = (): ProductFormData => ({
  active: true,
  categoryId: null as unknown as Id<'categories'>,
  description: '',
  isFavorite: false,
  name: '',
  priceA: '',
  priceB: '',
});
