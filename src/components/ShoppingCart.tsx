import { useMemo } from 'react';
import { CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { CartItem } from '@/hooks/useCart';
import { Id } from '@convex';
import { CartCheckoutButton, CartEmptyState, CartItemRow } from '@/features/cart/components';

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: Id<'products'>, quantity: number) => void;
  onRemoveItem: (productId: Id<'products'>) => void;
  onCheckout: () => void;
  isCheckingOut?: boolean;
}

const ShoppingCart = ({
  isCheckingOut = false,
  items,
  onCheckout,
  onRemoveItem,
  onUpdateQuantity,
}: ShoppingCartProps) => {
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <div className="flex h-full min-h-0 flex-col pt-6">
      <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-4">
        <ScrollArea className="min-h-0 flex-1">
          {items.length === 0 ? (
            <CartEmptyState />
          ) : (
            <div className="space-y-3 pr-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onRemoveItem={onRemoveItem}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CartCheckoutButton
        disabled={isCheckingOut || items.length === 0}
        onCheckout={onCheckout}
        total={total}
      />
    </div>
  );
};

export default ShoppingCart;
