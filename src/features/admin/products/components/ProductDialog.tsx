import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api, Doc, Id } from '@convex';
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
import { calculateNextCategoryOrder, convertEuroToCents } from '@/lib/product-utils';
import { toast } from '@/lib/toast';
import type { ProductFormData } from '../types';
import { CategorySelector } from './CategorySelector';

interface ProductDialogProps {
  categories: Doc<'categories'>[] | undefined;
  editingProductId: Id<'products'> | null;
  form: ProductFormData;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (productId: Id<'products'>, onSuccess: () => void) => Promise<void>;
  onFormChange: <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => void;
  onCreate: (data: {
    active: boolean;
    categoryId: Id<'categories'>;
    description?: string;
    isFavorite: boolean;
    name: string;
    priceA: number;
    priceB: number;
  }) => Promise<void>;
  onUpdate: (data: {
    active: boolean;
    categoryId?: Id<'categories'>;
    description?: string;
    id: Id<'products'>;
    isFavorite: boolean;
    name?: string;
    priceA?: number;
    priceB?: number;
  }) => Promise<void>;
  templateNameA: string;
  templateNameB: string;
}

export const ProductDialog = ({
  categories,
  editingProductId,
  form,
  isOpen,
  onClose,
  onDelete,
  onFormChange,
  onCreate,
  onUpdate,
  templateNameA,
  templateNameB,
}: ProductDialogProps) => {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const createCategory = useMutation(api.categories.create);

  const handleCreateCategoryInline = async (): Promise<void> => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName || isCreatingCategory) return;

    setIsCreatingCategory(true);
    try {
      const nextOrder = calculateNextCategoryOrder(categories ?? []);
      const categoryId = await createCategory({
        active: true,
        name: trimmedName,
        order: nextOrder,
      });
      onFormChange('categoryId', categoryId);
      setNewCategoryName('');
      setShowCreateCategory(false);
      toast.success('Kategorie erstellt');
    } catch (error) {
      toast.error(error, 'Fehler beim Erstellen');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!form.categoryId) return;

    try {
      if (editingProductId) {
        await onUpdate({
          active: form.active,
          categoryId: form.categoryId as Id<'categories'>,
          description: form.description || undefined,
          id: editingProductId,
          isFavorite: form.isFavorite,
          name: form.name || undefined,
          priceA: form.priceA ? convertEuroToCents(form.priceA) : undefined,
          priceB: form.priceB ? convertEuroToCents(form.priceB) : undefined,
        });
      } else {
        await onCreate({
          active: form.active,
          categoryId: form.categoryId as Id<'categories'>,
          description: form.description || undefined,
          isFavorite: form.isFavorite,
          name: form.name,
          priceA: convertEuroToCents(form.priceA),
          priceB: convertEuroToCents(form.priceB),
        });
      }
      onClose();
    } catch {
      // Error handling is done in parent
    }
  };

  const handleClose = (open: boolean): void => {
    if (!open) {
      setIsCreatingCategory(false);
      setNewCategoryName('');
      setShowCreateCategory(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold">
            {editingProductId ? 'Produkt bearbeiten' : 'Produkt erstellen'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-semibold" htmlFor="product-name">
              Name
            </Label>
            <Input
              id="product-name"
              className="min-h-[48px]"
              value={form.name}
              onChange={(event) => onFormChange('name', event.target.value)}
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-semibold" htmlFor="product-description">
              Beschreibung
            </Label>
            <Input
              id="product-description"
              className="min-h-[48px]"
              value={form.description}
              onChange={(event) => onFormChange('description', event.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold" htmlFor="product-priceA">
                {templateNameA} (EUR)
              </Label>
              <Input
                id="product-priceA"
                className="min-h-[48px]"
                type="number"
                step="0.01"
                value={form.priceA}
                onChange={(event) => onFormChange('priceA', event.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold" htmlFor="product-priceB">
                {templateNameB} (EUR)
              </Label>
              <Input
                id="product-priceB"
                className="min-h-[48px]"
                type="number"
                step="0.01"
                value={form.priceB}
                onChange={(event) => onFormChange('priceB', event.target.value)}
              />
            </div>
          </div>
          <CategorySelector
            categories={categories}
            isCreatingCategory={isCreatingCategory}
            newCategoryName={newCategoryName}
            selectedCategoryId={form.categoryId}
            showCreateCategory={showCreateCategory}
            onCategoryChange={(categoryId) => onFormChange('categoryId', categoryId)}
            onCategoryNameChange={setNewCategoryName}
            onCreateCategory={handleCreateCategoryInline}
            onShowCreateCategoryChange={setShowCreateCategory}
          />
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="product-active"
                className="h-5 w-5"
                checked={form.active}
                onCheckedChange={(checked: boolean | 'indeterminate') =>
                  onFormChange('active', checked === true)
                }
              />
              <Label className="cursor-pointer font-semibold" htmlFor="product-active">
                Aktiv
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="product-favorite"
                className="h-5 w-5"
                checked={form.isFavorite}
                onCheckedChange={(checked: boolean | 'indeterminate') =>
                  onFormChange('isFavorite', checked === true)
                }
              />
              <Label className="cursor-pointer font-semibold" htmlFor="product-favorite">
                Favorit
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-wrap gap-2 pt-4">
          {editingProductId && (
            <Button
              className="min-h-[44px] font-semibold text-destructive hover:text-destructive mr-auto"
              variant="outline"
              onClick={() =>
                onDelete(editingProductId, () => {
                  onClose();
                })
              }
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Löschen
            </Button>
          )}
          <Button
            className="min-h-[44px] font-semibold"
            variant="outline"
            onClick={() => handleClose(false)}
          >
            Abbrechen
          </Button>
          <Button className="min-h-[44px] font-semibold" onClick={handleSubmit}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
