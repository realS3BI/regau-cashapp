import { Doc } from '@convex';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import { ChevronDown } from 'lucide-react';
import { BookingItem } from './BookingItem';
import { canDeletePurchase } from '../hooks/useBookings';

interface BookingsTabProps {
  onDelete: (event: React.MouseEvent, purchase: Doc<'purchases'>) => Promise<void>;
  onLoadMore: () => void;
  olderPurchases: Doc<'purchases'>[] | undefined;
  showLoadMoreButton: boolean;
  todayPurchases: Doc<'purchases'>[] | undefined;
}

const renderPurchaseList = (
  purchases: Doc<'purchases'>[],
  onDelete: (event: React.MouseEvent, purchase: Doc<'purchases'>) => Promise<void>
) =>
  purchases.map((purchase) => {
    const deletable = canDeletePurchase(purchase.createdAt);
    return (
      <BookingItem
        canDelete={deletable}
        key={purchase._id}
        onDelete={onDelete}
        purchase={purchase}
      />
    );
  });

export const BookingsTab = ({
  onDelete,
  onLoadMore,
  olderPurchases,
  showLoadMoreButton,
  todayPurchases,
}: BookingsTabProps) => {
  if (todayPurchases === undefined) {
    return (
      <TabsContent
        className="flex-1 -mx-6 px-6 mt-6 min-h-0 data-[state=inactive]:hidden flex flex-col"
        value="bookings"
      >
        <div className="text-muted-foreground text-sm py-8 text-center">
          Wird geladen…
        </div>
      </TabsContent>
    );
  }

  const hasTodayBookings = todayPurchases.length > 0;
  const hasOlderBookings = olderPurchases !== undefined && olderPurchases.length > 0;
  const isEmpty = !hasTodayBookings && !hasOlderBookings;

  if (isEmpty) {
    return (
      <TabsContent
        className="flex-1 -mx-6 px-6 mt-6 min-h-0 data-[state=inactive]:hidden flex flex-col"
        value="bookings"
      >
        <div className="text-muted-foreground text-sm py-8 text-center">
          Heute noch keine Buchungen
        </div>
        {showLoadMoreButton && (
          <div className="px-2 pb-4">
            <Button
              className="w-full"
              onClick={onLoadMore}
              variant="outline"
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              Weitere Buchungen laden
            </Button>
          </div>
        )}
      </TabsContent>
    );
  }

  return (
    <TabsContent
      className="flex-1 -mx-6 px-6 mt-6 min-h-0 data-[state=inactive]:hidden flex flex-col"
      value="bookings"
    >
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-6 pb-6 pr-4">
          {hasTodayBookings && (
            <section>
              <h3 className="text-muted-foreground text-sm font-medium mb-3">
                Heute
              </h3>
              <ul className="space-y-3">
                {renderPurchaseList(todayPurchases, onDelete)}
              </ul>
            </section>
          )}
          {hasOlderBookings && (
            <section>
              <h3 className="text-muted-foreground text-sm font-medium mb-3">
                Ältere Buchungen
              </h3>
              <ul className="space-y-3">
                {renderPurchaseList(olderPurchases!, onDelete)}
              </ul>
            </section>
          )}
        </div>
      </ScrollArea>
      {showLoadMoreButton && (
        <div className="shrink-0 px-2 pb-4 pt-2">
          <Button
            className="w-full"
            onClick={onLoadMore}
            variant="outline"
          >
            <ChevronDown className="mr-2 h-4 w-4" />
            Weitere Buchungen laden
          </Button>
        </div>
      )}
    </TabsContent>
  );
};
