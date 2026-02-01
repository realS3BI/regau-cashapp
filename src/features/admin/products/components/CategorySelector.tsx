import { Id } from '@convex';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface CategorySelectorProps {
  categories: Array<{ _id: Id<'categories'>; deletedAt?: number; name: string }> | undefined;
  isCreatingCategory: boolean;
  newCategoryName: string;
  selectedCategoryId: Id<'categories'> | null;
  showCreateCategory: boolean;
  onCategoryChange: (categoryId: Id<'categories'>) => void;
  onCategoryNameChange: (name: string) => void;
  onCreateCategory: () => Promise<void>;
  onShowCreateCategoryChange: (show: boolean) => void;
}

export const CategorySelector = ({
  categories,
  isCreatingCategory,
  newCategoryName,
  onCategoryChange,
  onCategoryNameChange,
  onCreateCategory,
  onShowCreateCategoryChange,
  selectedCategoryId,
  showCreateCategory,
}: CategorySelectorProps) => {
  return (
    <div className="relative space-y-3">
      {isCreatingCategory && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80">
          <div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm font-medium">Kategorie wird erstellt…</span>
          </div>
        </div>
      )}
      <Label className="text-sm font-semibold" htmlFor="product-category">
        Kategorie
      </Label>
      <Select
        disabled={isCreatingCategory}
        value={selectedCategoryId ?? ''}
        onValueChange={(value) => onCategoryChange(value as Id<'categories'>)}
      >
        <SelectTrigger className="min-h-[48px] w-full">
          <SelectValue placeholder="Kategorie auswählen" />
        </SelectTrigger>
        <SelectContent>
          {categories
            ?.filter((c) => !c.deletedAt)
            .map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {!showCreateCategory ? (
        <Button
          className="h-auto px-0 text-sm font-medium text-primary hover:underline"
          disabled={isCreatingCategory}
          type="button"
          variant="link"
          onClick={() => onShowCreateCategoryChange(true)}
        >
          Kategorie nicht gefunden? Neue Kategorie erstellen
        </Button>
      ) : (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
          <Input
            className="min-h-[40px] flex-1 min-w-[140px]"
            disabled={isCreatingCategory}
            placeholder="Name der neuen Kategorie"
            value={newCategoryName}
            onChange={(event) => onCategoryNameChange(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && onCreateCategory()}
          />
          <Button
            className="min-h-[40px] font-semibold"
            disabled={isCreatingCategory}
            size="sm"
            onClick={onCreateCategory}
          >
            Erstellen
          </Button>
          <Button
            className="min-h-[40px] font-semibold"
            disabled={isCreatingCategory}
            size="sm"
            variant="outline"
            onClick={() => {
              onShowCreateCategoryChange(false);
              onCategoryNameChange('');
            }}
          >
            Abbrechen
          </Button>
        </div>
      )}
    </div>
  );
};
