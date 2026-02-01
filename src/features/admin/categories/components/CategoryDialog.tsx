import { Id } from '@convex';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import type { CategoryFormData } from '../types';

interface CategoryDialogProps {
  editingCategoryId: Id<'categories'> | null;
  form: CategoryFormData;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onFormChange: <K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]) => void;
  onSubmit: () => Promise<void>;
}

export const CategoryDialog = ({
  editingCategoryId,
  form,
  isOpen,
  onClose,
  onDelete,
  onFormChange,
  onSubmit,
}: CategoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold">
            {editingCategoryId ? 'Kategorie bearbeiten' : 'Kategorie erstellen'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-semibold" htmlFor="category-name">
              Name
            </Label>
            <Input
              id="category-name"
              className="min-h-[48px]"
              value={form.name}
              onChange={(event) => onFormChange('name', event.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3 pt-2">
            <Checkbox
              id="category-active"
              className="h-5 w-5"
              checked={form.active}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                onFormChange('active', checked === true)
              }
            />
            <Label className="cursor-pointer font-semibold" htmlFor="category-active">
              Aktiv
            </Label>
          </div>
        </div>
        <DialogFooter className="flex flex-wrap gap-2 pt-4">
          {editingCategoryId && (
            <Button
              className="min-h-[44px] font-semibold text-destructive hover:text-destructive mr-auto"
              variant="outline"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Löschen
            </Button>
          )}
          <Button className="min-h-[44px] font-semibold" variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button className="min-h-[44px] font-semibold" onClick={onSubmit}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
