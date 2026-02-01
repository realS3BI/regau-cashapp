import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

type CategoryItem = {
  _id: Id<'categories'>;
  active?: boolean;
  deletedAt?: number;
  name: string;
  order: number;
  productCount?: number;
};

const categoryList = (categories: CategoryItem[] | undefined) =>
  categories?.filter((c) => !c.deletedAt) ?? [];

type SortableRowProps = {
  category: CategoryItem;
  isSelected: boolean;
  onEdit: () => void;
  onToggleSelect: (e: React.MouseEvent) => void;
};

const SortableRow = ({ category, isSelected, onEdit, onToggleSelect }: SortableRowProps) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: category._id,
  });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      className="cursor-pointer hover:bg-muted/50"
      style={style}
      onClick={onEdit}
    >
      <TableCell
        className="w-10 py-4"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
      </TableCell>
      <TableCell className="w-12 py-4" onClick={onToggleSelect}>
        <Checkbox checked={isSelected} className="h-5 w-5 pointer-events-none" />
      </TableCell>
      <TableCell className="font-semibold py-4">{category.name}</TableCell>
      <TableCell className="py-4 font-semibold">{category.productCount ?? 0}</TableCell>
      <TableCell className="py-4">
        <Badge className="font-semibold" variant={category.active ? 'default' : 'secondary'}>
          {category.active ? 'Aktiv' : 'Inaktiv'}
        </Badge>
      </TableCell>
    </TableRow>
  );
};

const AdminCategoriesTab = () => {
  const categories = useQuery(api.categories.listForAdminWithProductCount);
  const createCategory = useMutation(api.categories.create);
  const deleteCategory = useMutation(api.categories.remove);
  const reorderCategories = useMutation(api.categories.reorder);
  const updateCategory = useMutation(api.categories.update);
  const updateManyCategoryActive = useMutation(api.categories.updateManyActive);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<Id<'categories'>>>(new Set());
  const [editingCategory, setEditingCategory] = useState<Id<'categories'> | null>(null);
  const [form, setForm] = useState({ active: true, name: '' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const visibleCategories = categoryList(categories);
  const isLoading = categories === undefined;

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = visibleCategories.findIndex((c) => c._id === active.id);
      const newIndex = visibleCategories.findIndex((c) => c._id === over.id);

      const reordered = arrayMove(visibleCategories, oldIndex, newIndex);
      const orderedIds = reordered.map((c) => c._id);

      try {
        await reorderCategories({ orderedIds });
        toast.success('Erfolgreich', {
          description: 'Reihenfolge aktualisiert',
        });
      } catch (error) {
        toast.error('Fehler', {
          description: error instanceof Error ? error.message : 'Fehler beim Neuordnen',
        });
      }
    }
  };

  const handleCreateCategory = async () => {
    try {
      const maxOrder =
        visibleCategories.length > 0
          ? Math.max(...visibleCategories.map((c) => c.order), -1) + 1
          : 0;
      await createCategory({
        active: form.active,
        name: form.name,
        order: maxOrder,
      });
      setDialogOpen(false);
      setForm({ active: true, name: '' });
      toast.success('Erfolgreich', {
        description: 'Kategorie erstellt',
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Erstellen',
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      await updateCategory({
        active: form.active,
        id: editingCategory,
        name: form.name || undefined,
      });
      setDialogOpen(false);
      setEditingCategory(null);
      setForm({ active: true, name: '' });
      toast.success('Erfolgreich', {
        description: 'Kategorie aktualisiert',
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Aktualisieren',
      });
    }
  };

  const handleDeleteCategory = async (id: Id<'categories'>, onSuccess?: () => void) => {
    if (!confirm('Kategorie wirklich löschen?')) return;

    try {
      await deleteCategory({ id });
      onSuccess?.();
      toast.success('Erfolgreich', {
        description: 'Kategorie gelöscht',
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Löschen',
      });
    }
  };

  const openEdit = (category: { _id: Id<'categories'>; active?: boolean; name: string }) => {
    setEditingCategory(category._id);
    setForm({
      active: category.active ?? true,
      name: category.name,
    });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingCategory(null);
    setForm({ active: true, name: '' });
    setDialogOpen(true);
  };

  const allSelected =
    visibleCategories.length > 0 && visibleCategories.every((c) => selectedCategoryIds.has(c._id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedCategoryIds(new Set());
    } else {
      setSelectedCategoryIds(new Set(visibleCategories.map((c) => c._id)));
    }
  };

  const toggleSelectCategory = (id: Id<'categories'>, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkSetActive = async (active: boolean) => {
    const ids = Array.from(selectedCategoryIds);
    if (ids.length === 0) return;
    try {
      await updateManyCategoryActive({ active, ids });
      setSelectedCategoryIds(new Set());
      toast.success('Erfolgreich', {
        description: `${ids.length} Kategorie(n) ${active ? 'aktiviert' : 'deaktiviert'}`,
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Aktualisieren',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Kategorien</h2>
        <Button className="min-h-[44px] font-semibold gap-2" onClick={openCreate}>
          <Plus className="h-5 w-5" />
          Kategorie erstellen
        </Button>
      </div>

      {isLoading ? (
        <Card className="shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-14 w-10" />
                <TableHead className="h-14 w-12" />
                <TableHead className="h-14 font-bold">Name</TableHead>
                <TableHead className="h-14 font-bold">Produkte</TableHead>
                <TableHead className="h-14 font-bold">Aktiv</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-5" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-5" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-12" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : visibleCategories.length > 0 ? (
        <Card className="shadow-md">
          {selectedCategoryIds.size > 0 && (
            <div className="flex items-center gap-4 px-4 py-3 border-b bg-muted/40">
              <span className="text-sm font-medium">{selectedCategoryIds.size} ausgewählt</span>
              <Button
                className="min-h-[36px]"
                size="sm"
                variant="outline"
                onClick={() => handleBulkSetActive(true)}
              >
                Aktivieren
              </Button>
              <Button
                className="min-h-[36px]"
                size="sm"
                variant="outline"
                onClick={() => handleBulkSetActive(false)}
              >
                Deaktivieren
              </Button>
              <Button
                className="min-h-[36px]"
                size="sm"
                variant="ghost"
                onClick={() => setSelectedCategoryIds(new Set())}
              >
                Auswahl aufheben
              </Button>
            </div>
          )}
          <DndContext
            collisionDetection={closestCenter}
            sensors={sensors}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-14 w-10" />
                  <TableHead className="h-14 w-12">
                    <Checkbox
                      checked={allSelected}
                      className="h-5 w-5"
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="h-14 font-bold">Name</TableHead>
                  <TableHead className="h-14 font-bold">Produkte</TableHead>
                  <TableHead className="h-14 font-bold">Aktiv</TableHead>
                </TableRow>
              </TableHeader>
              <SortableContext
                items={visibleCategories.map((c) => c._id)}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {visibleCategories.map((category) => (
                    <SortableRow
                      key={category._id}
                      category={category}
                      isSelected={selectedCategoryIds.has(category._id)}
                      onEdit={() => openEdit(category)}
                      onToggleSelect={(e) => toggleSelectCategory(category._id, e)}
                    />
                  ))}
                </TableBody>
              </SortableContext>
            </Table>
          </DndContext>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardContent className="py-16 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-2">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">Keine Kategorien gefunden</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="space-y-3 pb-4">
            <DialogTitle className="text-2xl font-bold">
              {editingCategory ? 'Kategorie bearbeiten' : 'Kategorie erstellen'}
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
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <Checkbox
                id="category-active"
                className="h-5 w-5"
                checked={form.active}
                onCheckedChange={(checked: boolean | 'indeterminate') =>
                  setForm({ ...form, active: checked === true })
                }
              />
              <Label className="cursor-pointer font-semibold" htmlFor="category-active">
                Aktiv
              </Label>
            </div>
          </div>
          <DialogFooter className="flex flex-wrap gap-2 pt-4">
            {editingCategory && (
              <Button
                className="min-h-[44px] font-semibold text-destructive hover:text-destructive mr-auto"
                variant="outline"
                onClick={() =>
                  handleDeleteCategory(editingCategory, () => {
                    setDialogOpen(false);
                    setEditingCategory(null);
                    setForm({ active: true, name: '' });
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
              onClick={() => setDialogOpen(false)}
            >
              Abbrechen
            </Button>
            <Button
              className="min-h-[44px] font-semibold"
              onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
            >
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategoriesTab;
