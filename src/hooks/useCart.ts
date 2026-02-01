import { useCallback, useState } from 'react';
import { Id } from '@convex';

export interface CartItem {
  name: string;
  price: number;
  productId: Id<'products'>;
  quantity: number;
}

const normalizeByProductId = (items: CartItem[]): CartItem[] => {
  const itemsById = new Map<Id<'products'>, CartItem>();
  for (const item of items) {
    const existingItem = itemsById.get(item.productId);
    if (existingItem) {
      itemsById.set(item.productId, {
        ...existingItem,
        quantity: existingItem.quantity + item.quantity,
      });
    } else {
      itemsById.set(item.productId, { ...item });
    }
  }
  return Array.from(itemsById.values());
};

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (product: { _id: Id<'products'>; name: string; price: number }): void => {
      setItems((previousItems) => {
        const nextItems = [
          ...previousItems,
          {
            name: product.name,
            price: product.price,
            productId: product._id,
            quantity: 1,
          },
        ];
        return normalizeByProductId(nextItems);
      });
    },
    []
  );

  const removeItem = useCallback((productId: Id<'products'>): void => {
    setItems((previousItems) => previousItems.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: Id<'products'>, quantity: number): void => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((previousItems) =>
        previousItems.map((item) => (item.productId === productId ? { ...item, quantity } : item))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback((): void => {
    setItems([]);
  }, []);

  const getTotal = useCallback((): number => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const getItemCount = useCallback((): number => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };
};
