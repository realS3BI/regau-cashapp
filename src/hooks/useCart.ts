import { useCallback, useState } from 'react';
import { Id } from '../../convex/_generated/dataModel';

export interface CartItem {
  name: string;
  price: number;
  productId: Id<'products'>;
  quantity: number;
}

/** Stellt sicher: maximal ein Eintrag pro productId, Mengen zusammengefasst. */
const normalizeByProductId = (items: CartItem[]): CartItem[] => {
  const byId = new Map<Id<'products'>, CartItem>();
  for (const item of items) {
    const existing = byId.get(item.productId);
    if (existing) {
      byId.set(item.productId, {
        ...existing,
        quantity: existing.quantity + item.quantity
      });
    } else {
      byId.set(item.productId, { ...item });
    }
  }
  return Array.from(byId.values());
};

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: { _id: Id<'products'>; name: string; price: number }) => {
    setItems((prev) => {
      const next = [
        ...prev,
        {
          name: product.name,
          price: product.price,
          productId: product._id,
          quantity: 1
        }
      ];
      return normalizeByProductId(next);
    });
  }, []);

  const removeItem = useCallback((productId: Id<'products'>) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: Id<'products'>, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount
  };
};
