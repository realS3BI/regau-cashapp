import { useMemo } from 'react';
import { Button } from './ui/button';
import { CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { formatCurrency } from '@/lib/format';
import { Minus, Plus, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { CartItem } from '@/hooks/useCart';
import { Id } from '../../convex/_generated/dataModel';

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: Id<'products'>, quantity: number) => void;
  onRemoveItem: (productId: Id<'products'>) => void;
  onCheckout: () => void;
  isCheckingOut?: boolean;
}

/** Gruppiert Einträge nach Produkt (eine Zeile pro Produkt, Mengen addiert). */
const groupItemsByProduct = (items: CartItem[]): CartItem[] => {
  const byId = new Map<Id<'products'>, CartItem>();
  for (const item of items) {
    const existing = byId.get(item.productId);
    if (existing) {
      byId.set(item.productId, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      byId.set(item.productId, { ...item });
    }
  }
  return Array.from(byId.values());
};

const ShoppingCart = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isCheckingOut = false,
}: ShoppingCartProps) => {
  const groupedItems = useMemo(() => groupItemsByProduct(items), [items]);
  const total = useMemo(
    () => groupedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [groupedItems]
  );

  return (
    <div className="flex h-full min-h-0 flex-col pt-6">
      <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-4">
        <ScrollArea className="min-h-0 flex-1">
          {groupedItems.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <div className="space-y-3 text-center">
                <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ShoppingCartIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium text-muted-foreground">Keine Artikel im Warenkorb</p>
                <p className="text-sm text-muted-foreground">
                  Fügen Sie Produkte hinzu, um zu beginnen
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pr-4">
              {groupedItems.map((item) => (
                <div key={item.productId} className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <p className="text-base font-semibold leading-tight">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                      <p className="text-base font-bold text-primary">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 min-h-[44px] min-w-[44px] text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() =>
                        item.quantity <= 1
                          ? onRemoveItem(item.productId)
                          : onUpdateQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="min-w-[44px] flex-1 text-center text-lg font-bold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 min-h-[44px] min-w-[44px]"
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <div className="shrink-0 border-t bg-muted/30 p-6">
        <Button
          className="min-h-[52px] w-full text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
          disabled={isCheckingOut || groupedItems.length === 0}
          onClick={onCheckout}
        >
          Bezahlen ({formatCurrency(total)})
        </Button>
      </div>
    </div>
  );
};

export default ShoppingCart;
