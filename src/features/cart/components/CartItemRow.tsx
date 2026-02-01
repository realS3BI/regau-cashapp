import { Id } from '@convex';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format';
import { Minus, Plus } from 'lucide-react';
import type { CartItem } from '@/hooks/useCart';

interface CartItemRowProps {
  item: CartItem;
  onRemoveItem: (productId: Id<'products'>) => void;
  onUpdateQuantity: (productId: Id<'products'>, quantity: number) => void;
}

export const CartItemRow = ({ item, onRemoveItem, onUpdateQuantity }: CartItemRowProps) => {
  const handleDecrease = (): void => {
    if (item.quantity <= 1) {
      onRemoveItem(item.productId);
    } else {
      onUpdateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleIncrease = (): void => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold leading-tight">{item.name}</p>
      <p className="text-sm text-muted-foreground">
        {formatCurrency(item.price)} × {item.quantity} ={' '}
        <span className="font-semibold text-foreground">
          {formatCurrency(item.price * item.quantity)}
        </span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleDecrease}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="min-w-8 flex-1 text-center text-sm font-bold">{item.quantity}</span>
        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={handleIncrease}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Separator className="my-1" />
    </div>
  );
};
