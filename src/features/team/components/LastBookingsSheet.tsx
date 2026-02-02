import { useCallback, useEffect, useState } from 'react';
import { Doc, Id } from '@convex';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/lib/toast';
import { LayoutDashboard } from 'lucide-react';
import { useBookings } from '@/features/team/bookings/hooks/useBookings';
import { BookingsTab, ProductsTab, TodaySummary } from '@/features/team/bookings/components';

interface LastBookingsSheetProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  teamId: Id<'teams'>;
}

const LastBookingsSheet = ({ onOpenChange, open, teamId }: LastBookingsSheetProps) => {
  const [loadOlderBookings, setLoadOlderBookings] = useState(false);

  useEffect(() => {
    if (!open) setLoadOlderBookings(false);
  }, [open]);

  const { olderPurchases, productSalesToday, removePurchase, todayPurchasesForList, todayTotal } =
    useBookings(teamId, open, loadOlderBookings);

  const handleDelete = useCallback(
    async (event: React.MouseEvent, purchase: Doc<'purchases'>): Promise<void> => {
      event.stopPropagation();
      try {
        await removePurchase({ id: purchase._id });
        toast.success('Buchung gelöscht');
      } catch (err) {
        toast.error(err, 'Fehler beim Löschen');
      }
    },
    [removePurchase]
  );

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="flex flex-col sm:max-w-md" side="left">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <LayoutDashboard />
            Übersicht
          </SheetTitle>
        </SheetHeader>
        <TodaySummary total={todayTotal} />
        <Tabs className="mt-4 flex flex-1 min-h-0 flex-col" defaultValue="bookings">
          <TabsList className="grid w-full grid-cols-2 gap-0.5 p-1 h-auto">
            <TabsTrigger
              className="flex items-center justify-center rounded-l-md rounded-r-sm"
              value="bookings"
            >
              Letzte Buchungen
            </TabsTrigger>
            <TabsTrigger
              className="flex items-center justify-center rounded-r-md rounded-l-sm"
              value="products"
            >
              Produkte
            </TabsTrigger>
          </TabsList>
          <BookingsTab
            onLoadMore={() => setLoadOlderBookings(true)}
            onDelete={handleDelete}
            olderPurchases={loadOlderBookings ? olderPurchases : undefined}
            showLoadMoreButton={!loadOlderBookings}
            todayPurchases={todayPurchasesForList}
          />
          <ProductsTab
            isLoading={todayPurchasesForList === undefined}
            productSales={productSalesToday}
          />
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default LastBookingsSheet;
