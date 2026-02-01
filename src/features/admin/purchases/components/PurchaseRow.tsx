import { Doc } from '@convex';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate, formatTime } from '@/lib/format';

interface PurchaseRowProps {
  onSelect: () => void;
  purchase: Doc<'purchases'>;
  teamName: string | undefined;
}

export const PurchaseRow = ({ onSelect, purchase, teamName }: PurchaseRowProps) => {
  return (
    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={onSelect}>
      <TableCell className="py-4 font-medium">{formatDate(new Date(purchase.createdAt))}</TableCell>
      <TableCell className="py-4 text-muted-foreground">
        {formatTime(new Date(purchase.createdAt))}
      </TableCell>
      <TableCell className="py-4 font-semibold">{teamName || '-'}</TableCell>
      <TableCell className="py-4">{purchase.items.length} Artikel</TableCell>
      <TableCell className="py-4 font-bold text-primary">
        {formatCurrency(purchase.totalAmount)}
      </TableCell>
    </TableRow>
  );
};
