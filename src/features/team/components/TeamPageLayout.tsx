import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History } from 'lucide-react';
import CategoryList, { type CategorySelection } from '@/components/CategoryList';
import ResizableDivider from './ResizableDivider';

interface TeamPageLayoutProps {
  cartPanelWidth: number;
  categoryPanelWidth: number;
  onCategoryPanelResizeStart: () => void;
  onCartPanelResizeStart: () => void;
  onShowLastBookings: () => void;
  selectedCategoryId: CategorySelection;
  onSelectCategory: (categoryId: CategorySelection) => void;
  mainContent: ReactNode;
  cartContent: ReactNode;
}

export const TeamPageLayout = ({
  cartContent,
  cartPanelWidth,
  categoryPanelWidth,
  mainContent,
  onCartPanelResizeStart,
  onCategoryPanelResizeStart,
  onSelectCategory,
  onShowLastBookings,
  selectedCategoryId,
}: TeamPageLayoutProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row w-full">
      <aside
        className="hidden shrink-0 flex-col border-r bg-muted/20 lg:flex"
        style={{ width: categoryPanelWidth }}
      >
        <ScrollArea className="flex-1">
          <CategoryList
            onSelectCategory={onSelectCategory}
            selectedCategoryId={selectedCategoryId}
          />
        </ScrollArea>
        <div className="shrink-0 border-t p-4">
          <Button
            className="w-full justify-start min-h-[48px] text-base font-medium gap-2"
            onClick={onShowLastBookings}
            variant="outline"
          >
            <History />
            Übersicht
          </Button>
        </div>
      </aside>

      <ResizableDivider
        aria-label="Kategorien-Breite anpassen"
        onResizeStart={onCategoryPanelResizeStart}
      />

      <main className="flex min-h-0 flex-1 flex-col min-w-0 overflow-hidden">
        <div className="shrink-0 border-b bg-muted/20 pb-4 lg:hidden">
          <CategoryList
            onSelectCategory={onSelectCategory}
            selectedCategoryId={selectedCategoryId}
          />
          <div className="px-4 pt-2">
            <Button
              className="w-full justify-start min-h-[48px] text-base font-medium gap-2"
              onClick={onShowLastBookings}
              variant="outline"
            >
              <History />
              Übersicht
            </Button>
          </div>
        </div>
        {mainContent}
      </main>

      <ResizableDivider
        aria-label="Warenkorb-Breite anpassen"
        onResizeStart={onCartPanelResizeStart}
      />

      <aside
        className="hidden shrink-0 flex-col border-l bg-card shadow-lg lg:flex"
        style={{ width: cartPanelWidth }}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{cartContent}</div>
      </aside>
    </div>
  );
};
