import { Button } from '@/components/ui/button';

interface CategoryBulkActionsProps {
  onActivate: () => void;
  onClearSelection: () => void;
  onDeactivate: () => void;
  selectedCount: number;
}

export const CategoryBulkActions = ({
  onActivate,
  onClearSelection,
  onDeactivate,
  selectedCount,
}: CategoryBulkActionsProps) => {
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
