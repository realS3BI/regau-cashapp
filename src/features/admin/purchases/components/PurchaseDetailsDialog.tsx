import { Doc } from '@convex';
import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { Trash2 } from 'lucide-react';

interface PurchaseDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  purchase: Doc<'purchases'> | null;
  teamName: string | undefined;
}

export const PurchaseDetailsDialog = ({
  isOpen,
  onClose,
  onDelete,
  purchase,
  teamName,
}: PurchaseDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-xl font-bold">Transaktion – gekaufte Artikel</DialogTitle>
          {purchase && (
            <CardDescription className="text-base">
              {teamName} · {formatDateTime(new Date(purchase.createdAt))}
            </CardDescription>
          )}
        </DialogHeader>
        {purchase ? (
          <div className="space-y-4 py-2">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold">Artikel</TableHead>
                  <TableHead className="font-bold text-right">Anzahl</TableHead>
                  <TableHead className="font-bold text-right">Einzelpreis</TableHead>
                  <TableHead className="font-bold text-right">Gesamtbetrag</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchase.items.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-right text-lg font-bold text-primary border-t pt-3">
              Gesamtbetrag: {formatCurrency(purchase.totalAmount)}
            </p>
            <div className="flex justify-end pt-2">
              <Button onClick={onDelete} variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Kauf löschen
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
