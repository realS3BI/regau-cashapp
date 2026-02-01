import { Doc, Id } from '@convex';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PurchaseRow } from './PurchaseRow';
import { LOAD_MORE_PAGE_SIZE } from '../types';

interface PurchaseTableProps {
  onLoadMore: (numItems: number) => void;
  onSelectPurchase: (purchaseId: Id<'purchases'>) => void;
  purchases: Doc<'purchases'>[];
  status: 'CanLoadMore' | 'Exhausted' | 'LoadingFirstPage' | 'LoadingMore';
  teams: Doc<'teams'>[] | undefined;
}

export const PurchaseTable = ({
  onLoadMore,
  onSelectPurchase,
  purchases,
  status,
  teams,
}: PurchaseTableProps) => {
  return (
    <Card className="shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-14 font-bold">Datum</TableHead>
            <TableHead className="h-14 font-bold">Uhrzeit</TableHead>
            <TableHead className="h-14 font-bold">Team</TableHead>
            <TableHead className="h-14 font-bold">Artikel</TableHead>
            <TableHead className="h-14 font-bold">Gesamtbetrag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => {
            const team = teams?.find((tm) => tm._id === purchase.teamId);
            return (
              <PurchaseRow
                key={purchase._id}
                onSelect={() => onSelectPurchase(purchase._id)}
                purchase={purchase}
                teamName={team?.name}
              />
            );
          })}
        </TableBody>
      </Table>
      {(status === 'CanLoadMore' || status === 'LoadingMore') && (
        <div className="flex justify-center border-t px-4 py-3">
          <Button
            disabled={status === 'LoadingMore'}
            variant="outline"
            onClick={() => onLoadMore(LOAD_MORE_PAGE_SIZE)}
          >
            {status === 'LoadingMore' ? 'Laden…' : 'Weitere laden'}
          </Button>
        </div>
      )}
    </Card>
  );
};
