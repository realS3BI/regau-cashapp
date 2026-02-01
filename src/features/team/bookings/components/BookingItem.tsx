import { Doc } from '@convex';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { Trash2 } from 'lucide-react';

interface BookingItemProps {
  canDelete: boolean;
  purchase: Doc<'purchases'>;
  onDelete: (event: React.MouseEvent, purchase: Doc<'purchases'>) => void;
}

export const BookingItem = ({ canDelete, onDelete, purchase }: BookingItemProps) => {
  return (
    <li className="border rounded-lg p-3 bg-muted/20 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-medium">{formatDateTime(new Date(purchase.createdAt))}</div>
        {canDelete && (
          <Button
            className="shrink-0 h-8 w-8 p-0 text-destructive hover:text-destructive"
            onClick={(e) => onDelete(e, purchase)}
            size="icon"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Buchung löschen</span>
          </Button>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        {purchase.items
          .map((i: { name: string; quantity: number }) => `${i.name} × ${i.quantity}`)
          .join(', ')}
      </div>
      <div className="text-sm font-semibold text-primary">
        {formatCurrency(purchase.totalAmount)}
      </div>
    </li>
  );
};
