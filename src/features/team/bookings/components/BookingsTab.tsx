import { Doc } from '@convex';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import { BookingItem } from './BookingItem';
import { canDeletePurchase } from '../hooks/useBookings';

interface BookingsTabProps {
  purchases: Doc<'purchases'>[] | undefined;
  onDelete: (event: React.MouseEvent, purchase: Doc<'purchases'>) => Promise<void>;
}

export const BookingsTab = ({ onDelete, purchases }: BookingsTabProps) => {
  if (purchases === undefined) {
    return (
      <div className="text-muted-foreground text-sm py-8 text-center">
        <TabsContent
          className="flex-1 -mx-6 px-6 mt-6 min-h-0 data-[state=inactive]:hidden flex flex-col"
          value="bookings"
        >
          Wird geladen…
        </TabsContent>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <TabsContent
        className="flex-1 -mx-6 px-6 mt-6 min-h-0 data-[state=inactive]:hidden flex flex-col"
        value="bookings"
      >
        <div className="text-muted-foreground text-sm py-8 text-center">
          Heute noch keine Buchungen
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent
      className="flex-1 -mx-6 px-6 mt-6 min-h-0 data-[state=inactive]:hidden flex flex-col"
      value="bookings"
    >
      <ScrollArea className="min-h-0 flex-1">
        <ul className="space-y-3 pb-6 pr-4">
          {purchases.map((purchase) => {
            const deletable = canDeletePurchase(purchase.createdAt);
            return (
              <BookingItem
                key={purchase._id}
                canDelete={deletable}
                onDelete={onDelete}
                purchase={purchase}
              />
            );
          })}
        </ul>
      </ScrollArea>
    </TabsContent>
  );
};
