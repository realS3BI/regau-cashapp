import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api, Id } from '@convex';
import type { CategorySelection } from '@/components/CategoryList';
import ProductGrid from '@/components/ProductGrid';
import ShoppingCart from '@/components/ShoppingCart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/hooks/useCart';
import { useResizablePanels } from '@/hooks/useResizablePanels';
import { clearAdminAuth, getAdminAuth } from '@/lib/auth';
import {
  LastBookingsSheet,
  MobileCart,
  TeamNotFound,
  TeamPageHeader,
  TeamPageLayout,
  TeamPageSkeleton,
} from '@/features/team/components';
import { useAddToCartFeedback } from '@/features/team/hooks/useAddToCartFeedback';
import { useCheckout } from '@/features/team/hooks/useCheckout';

const TeamPage = () => {
  const { slug: teamSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => getAdminAuth());
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategorySelection>(null);
  const [showLastBookings, setShowLastBookings] = useState(false);

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
  const { addItem, clearCart, getTotal, items, removeItem, updateQuantity } = useCart();
  const { lastAddedProductId, showFeedback } = useAddToCartFeedback();

  const { handleCheckout } = useCheckout({
    clearCart,
    getTotal,
    items,
    teamId: team?._id ?? ('' as Id<'teams'>),
  });

  const handleAddToCart = (product: { _id: Id<'products'>; name: string; price: number }): void => {
    addItem(product);
    showFeedback(product._id);
  };

  const handleLogout = (): void => {
    clearAdminAuth();
    setIsAdminLoggedIn(false);
  };

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

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background w-full">
      <TeamPageHeader
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
        teamName={team.name}
      />

      <TeamPageLayout
        cartContent={
          <ShoppingCart
            items={items}
            onCheckout={handleCheckout}
            onRemoveItem={removeItem}
            onUpdateQuantity={updateQuantity}
          />
        }
        cartPanelWidth={cartPanel.width}
        categoryPanelWidth={categoryPanel.width}
        mainContent={
          <ScrollArea className="min-h-0 flex-1">
            <ProductGrid
              categoryId={selectedCategoryId}
              lastAddedProductId={lastAddedProductId}
              onAddToCart={handleAddToCart}
            />
          </ScrollArea>
        }
        onCartPanelResizeStart={cartPanel.startResize}
        onCategoryPanelResizeStart={categoryPanel.startResize}
        onSelectCategory={setSelectedCategoryId}
        onShowLastBookings={() => setShowLastBookings(true)}
        selectedCategoryId={selectedCategoryId}
      />

      <LastBookingsSheet
        onOpenChange={setShowLastBookings}
        open={showLastBookings}
        teamId={team._id}
      />
      <MobileCart>
        <ShoppingCart
          items={items}
          onCheckout={handleCheckout}
          onRemoveItem={removeItem}
          onUpdateQuantity={updateQuantity}
        />
      </MobileCart>
    </div>
  );
};

export default TeamPage;
