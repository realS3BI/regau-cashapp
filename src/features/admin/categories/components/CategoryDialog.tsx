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
import type { CategoryFormData } from '../types';

interface CategoryDialogProps {
  form: CategoryFormData;
  isOpen: boolean;
  onClose: () => void;
  onFormChange: <K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]) => void;
  onSubmit: () => Promise<void>;
}

export const CategoryDialog = ({
  form,
  isOpen,
  onClose,
  onFormChange,
  onSubmit,
}: CategoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold">Kategorie erstellen</DialogTitle>
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
        </div>
        <DialogFooter className="flex flex-wrap gap-2 pt-4">
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
