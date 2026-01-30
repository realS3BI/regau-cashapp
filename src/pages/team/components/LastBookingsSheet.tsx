import { useMemo } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Doc, Id } from '../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { LayoutDashboard, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const FIVE_MINUTES_MS = 5 * 60 * 1000;

const canDelete = (createdAt: number) => Date.now() - createdAt < FIVE_MINUTES_MS;

const getStartOfTodayMs = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

interface LastBookingsSheetProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  teamId: Id<'teams'>;
}

const LastBookingsSheet = ({ onOpenChange, open, teamId }: LastBookingsSheetProps) => {
  const todayRange = useMemo(() => {
    if (!open) return null;
    return {
      endMs: Date.now(),
      startMs: getStartOfTodayMs(),
    };
  }, [open]);

  const recentPurchases = useQuery(
    api.purchases.getRecentByTeam,
    open ? { limit: 20, teamId } : 'skip'
  );
  const todayPurchases = useQuery(
    api.purchases.getPurchasesByTeamInRange,
    open && todayRange ? { ...todayRange, teamId } : 'skip'
  );
  const removePurchase = useMutation(api.purchases.remove);

  const todayTotal = useMemo(() => {
    if (todayPurchases === undefined) return 0;
    return todayPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
  }, [todayPurchases]);

  const productSalesToday = useMemo(() => {
    if (todayPurchases === undefined) return [];
    const byName: Record<string, number> = {};
    for (const p of todayPurchases) {
      for (const item of p.items) {
        byName[item.name] = (byName[item.name] ?? 0) + item.quantity;
      }
    }
    return Object.entries(byName)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [todayPurchases]);

  const handleDelete = async (e: React.MouseEvent, purchase: Doc<'purchases'>): Promise<void> => {
    e.stopPropagation();
    if (!canDelete(purchase.createdAt)) return;
    try {
      await removePurchase({ id: purchase._id });
      toast.success('Erfolgreich', {
        description: 'Buchung gelöscht',
      });
    } catch (err) {
      toast.error('Fehler', {
        description: err instanceof Error ? err.message : 'Fehler beim Löschen',
      });
    }
  };

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="flex flex-col sm:max-w-md" side="left">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Übersicht
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 rounded-lg border bg-muted/30 p-3">
          <p className="text-muted-foreground text-xs">Alle Buchungen von heute</p>
          <p className="text-lg font-semibold text-primary">
            {todayPurchases === undefined ? '…' : formatCurrency(todayTotal)}
          </p>
        </div>
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
          <TabsContent
            className="flex-1 -mx-6 px-6 mt-6 min-h-0 data-[state=inactive]:hidden flex flex-col"
            value="bookings"
          >
            <ScrollArea className="min-h-0 flex-1">
              {recentPurchases === undefined ? (
                <div className="text-muted-foreground text-sm py-8 text-center">Wird geladen…</div>
              ) : recentPurchases.length === 0 ? (
                <div className="text-muted-foreground text-sm py-8 text-center">
                  Keine Buchungen
                </div>
              ) : (
                <ul className="space-y-3 pb-6 pr-4">
                  {recentPurchases.map((purchase) => {
                    const deletable = canDelete(purchase.createdAt);
                    return (
                      <li
                        key={purchase._id}
                        className="border rounded-lg p-3 bg-muted/20 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm font-medium">
                            {formatDateTime(new Date(purchase.createdAt))}
                          </div>
                          {deletable && (
                            <Button
                              className="shrink-0 h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => handleDelete(e, purchase)}
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
                            .map(
                              (i: { name: string; quantity: number }) => `${i.name} × ${i.quantity}`
                            )
                            .join(', ')}
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          {formatCurrency(purchase.totalAmount)}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent
            className="flex-1 -mx-6 px-6 mt-3 min-h-0 data-[state=inactive]:hidden flex flex-col"
            value="products"
          >
            <ScrollArea className="min-h-0 flex-1">
              {todayPurchases === undefined ? (
                <div className="text-muted-foreground text-sm py-8 text-center">Wird geladen…</div>
              ) : productSalesToday.length === 0 ? (
                <div className="text-muted-foreground text-sm py-8 text-center">
                  Heute noch keine Verkäufe
                </div>
              ) : (
                <ul className="space-y-2 pb-6 pr-4">
                  {productSalesToday.map(({ name, quantity }) => (
                    <li
                      key={name}
                      className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2"
                    >
                      <span className="text-sm font-medium">{name}</span>
                      <span className="text-sm font-semibold text-primary">{quantity}×</span>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default LastBookingsSheet;
