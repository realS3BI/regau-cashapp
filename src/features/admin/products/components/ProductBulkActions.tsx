import { Button } from '@/components/ui/button';

interface ProductBulkActionsProps {
  selectedCount: number;
  onActivate: () => void;
  onDeactivate: () => void;
  onClearSelection: () => void;
}

export const ProductBulkActions = ({
  onActivate,
  onClearSelection,
  onDeactivate,
  selectedCount,
}: ProductBulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b bg-muted/40">
      <span className="text-sm font-medium">{selectedCount} ausgewählt</span>
      <Button className="min-h-[36px]" size="sm" variant="outline" onClick={onActivate}>
        Aktivieren
      </Button>
      <Button className="min-h-[36px]" size="sm" variant="outline" onClick={onDeactivate}>
        Deaktivieren
      </Button>
      <Button className="min-h-[36px]" size="sm" variant="ghost" onClick={onClearSelection}>
        Auswahl aufheben
      </Button>
    </div>
  );
};
