import { ShoppingCart as ShoppingCartIcon } from 'lucide-react';

export const CartEmptyState = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="space-y-3 text-center">
        <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <ShoppingCartIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-medium text-muted-foreground">Keine Artikel im Warenkorb</p>
        <p className="text-sm text-muted-foreground">Fügen Sie Produkte hinzu, um zu beginnen</p>
      </div>
    </div>
  );
};
