import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import CategoryList from '@/components/CategoryList';
import ProductGrid from '@/components/ProductGrid';
import ShoppingCart from '@/components/ShoppingCart';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/hooks/useCart';
import { useResizablePanels } from '@/hooks/useResizablePanels';
import { toast } from 'sonner';
import { clearAdminAuth, getAdminAuth } from '@/lib/auth';
import { formatCurrency } from '@/lib/format';
import { History } from 'lucide-react';
import {
  LastBookingsSheet,
  ResizableDivider,
  TeamNotFound,
  TeamPageHeader,
  TeamPageSkeleton,
} from '@/pages/team/components';

const TeamPage = () => {
  const { teamSlug } = useParams<{ teamSlug: string }>();
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => getAdminAuth());
  const [lastAddedProductId, setLastAddedProductId] = useState<Id<'products'> | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<Id<'categories'> | null>(null);
  const [showLastBookings, setShowLastBookings] = useState(false);
  const addFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addFeedbackTimeoutRef.current) clearTimeout(addFeedbackTimeoutRef.current);
    };
  }, []);

  const categoryPanel = useResizablePanels({
    defaultWidth: 280,
    side: 'left',
    storageKey: 'regau-cashapp-category-width',
  });
  const cartPanel = useResizablePanels({
    defaultWidth: 360,
    side: 'right',
    storageKey: 'regau-cashapp-cart-width',
    minWidth: 250,
  });

  const team = useQuery(api.teams.getBySlug, teamSlug ? { slug: teamSlug } : 'skip');
  const checkout = useMutation(api.purchases.create);

  const { addItem, clearCart, getTotal, items, removeItem, updateQuantity } = useCart();

  const handleAddToCart = useCallback(
    (product: { _id: Id<'products'>; name: string; price: number }) => {
      addItem(product);
      if (addFeedbackTimeoutRef.current) clearTimeout(addFeedbackTimeoutRef.current);
      setLastAddedProductId(product._id);
      addFeedbackTimeoutRef.current = setTimeout(() => {
        setLastAddedProductId(null);
        addFeedbackTimeoutRef.current = null;
      }, 500);
    },
    [addItem]
  );

  if (!teamSlug) {
    navigate('/');
    return null;
  }

  if (team === undefined) {
    return <TeamPageSkeleton />;
  }

  if (team === null) {
    return <TeamNotFound />;
  }

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      const totalAmount = getTotal();
      await checkout({
        items: items.map((item) => ({
          name: item.name,
          price: item.price,
          productId: item.productId,
          quantity: item.quantity,
        })),
        teamId: team._id,
        totalAmount,
      });

      clearCart();
      toast.success('Erfolgreich', {
        description: `Kauf abgeschlossen – ${formatCurrency(totalAmount)}`,
      });
    } catch (error) {
      toast.error('Fehler', {
        description:
          error instanceof Error ? error.message : 'Beim Bezahlen ist ein Fehler aufgetreten',
      });
    }
  };

  const handleLogout = () => {
    clearAdminAuth();
    setIsAdminLoggedIn(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <TeamPageHeader
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
        teamName={team.name}
      />

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 w-full">
        <aside
          className="hidden lg:flex border-r bg-muted/20 shrink-0 flex-col min-h-0"
          style={{ width: categoryPanel.width }}
        >
          <ScrollArea className="min-h-0 flex-1">
            <CategoryList
              onSelectCategory={setSelectedCategoryId}
              selectedCategoryId={selectedCategoryId}
            />
          </ScrollArea>
          <div className="border-t p-4 shrink-0">
            <Button
              className="w-full justify-start min-h-[48px] text-base font-medium gap-2"
              onClick={() => setShowLastBookings(true)}
              variant="outline"
            >
              <History />
              Übersicht
            </Button>
          </div>
        </aside>

        <ResizableDivider
          aria-label="Kategorien-Breite anpassen"
          onResizeStart={categoryPanel.startResize}
        />

        <main className="flex-1 min-w-0 flex flex-col min-h-0">
          <ScrollArea className="min-h-0 flex-1">
            <div className="lg:hidden border-b bg-muted/20 pb-4">
              <CategoryList
                onSelectCategory={setSelectedCategoryId}
                selectedCategoryId={selectedCategoryId}
              />
              <div className="px-4 pt-2">
                <Button
                  className="w-full justify-start min-h-[48px] text-base font-medium gap-2"
                  onClick={() => setShowLastBookings(true)}
                  variant="outline"
                >
                  <History />
                  Übersicht
                </Button>
              </div>
            </div>
            <ProductGrid
              categoryId={selectedCategoryId}
              lastAddedProductId={lastAddedProductId}
              onAddToCart={handleAddToCart}
            />
          </ScrollArea>
        </main>

        <ResizableDivider
          aria-label="Warenkorb-Breite anpassen"
          onResizeStart={cartPanel.startResize}
        />

        <aside
          className="hidden lg:flex min-h-0 shrink-0 flex-col border-l bg-card shadow-lg"
          style={{ width: cartPanel.width }}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <ShoppingCart
              items={items}
              onCheckout={handleCheckout}
              onRemoveItem={removeItem}
              onUpdateQuantity={updateQuantity}
            />
          </div>
        </aside>
      </div>

      <LastBookingsSheet
        onOpenChange={setShowLastBookings}
        open={showLastBookings}
        teamId={team._id}
      />
      <div className="lg:hidden border-t bg-card p-4 shrink-0">
        <ShoppingCart
          items={items}
          onCheckout={handleCheckout}
          onRemoveItem={removeItem}
          onUpdateQuantity={updateQuantity}
        />
      </div>
    </div>
  );
};

export default TeamPage;
