import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { api, Id } from '@convex';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { Pencil, Plus } from 'lucide-react';
import { useCategoryForm } from './hooks/useCategoryForm';
import { useDragAndDropSensors } from './hooks/useDragAndDrop';
import {
  CategoryDialog,
  CategoryEmptyState,
  CategoryTable,
  CategoryTableSkeleton,
} from './components';
import { filterNonDeletedCategories, calculateNextOrderNumber } from './utils';

const AdminCategoriesTab = () => {
  const categories = useQuery(api.categories.listForAdminWithProductCount);
  const createCategory = useMutation(api.categories.create);
  const deleteCategory = useMutation(api.categories.remove);
  const reorderCategories = useMutation(api.categories.reorder);
  const updateCategory = useMutation(api.categories.update);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { form, resetForm, updateFormField } = useCategoryForm();
  const sensors = useDragAndDropSensors();

  const visibleCategories = useMemo(() => filterNonDeletedCategories(categories), [categories]);
  const isLoading = categories === undefined;

  const handleDragEnd = useCallback(
    async (event: DragEndEvent): Promise<void> => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const oldIndex = visibleCategories.findIndex((category) => category._id === active.id);
      const newIndex = visibleCategories.findIndex((category) => category._id === over.id);

      const reorderedCategories = arrayMove(visibleCategories, oldIndex, newIndex);
      const orderedIds = reorderedCategories.map((category) => category._id);

      try {
        await reorderCategories({ orderedIds });
        toast.success('Reihenfolge aktualisiert');
      } catch (error) {
        toast.error(error, 'Fehler beim Neuordnen');
      }
    },
    [reorderCategories, visibleCategories]
  );

  const handleCreateCategory = useCallback(async (): Promise<void> => {
    const nextOrder = calculateNextOrderNumber(visibleCategories);

    try {
      await createCategory({
        name: form.name,
        order: nextOrder,
      });
      setDialogOpen(false);
      resetForm();
      toast.success('Kategorie erstellt');
    } catch (error) {
      toast.error(error, 'Fehler beim Erstellen');
    }
  }, [createCategory, form, resetForm, visibleCategories]);

  const handleDeleteCategory = useCallback(
    async (categoryId: Id<'categories'>): Promise<void> => {
      if (!confirm('Kategorie wirklich löschen?')) return;

      try {
        await deleteCategory({ id: categoryId });
        toast.success('Kategorie gelöscht');
      } catch (error) {
        toast.error(error, 'Fehler beim Löschen');
      }
    },
    [deleteCategory]
  );

  const handleNameSave = useCallback(
    async (categoryId: Id<'categories'>, name: string): Promise<void> => {
      try {
        await updateCategory({ id: categoryId, name });
        toast.success('Kategorie aktualisiert');
      } catch (error) {
        toast.error(error, 'Fehler beim Aktualisieren');
      }
    },
    [updateCategory]
  );

  const openCreateDialog = useCallback((): void => {
    resetForm();
    setDialogOpen(true);
  }, [resetForm]);

  const handleCloseDialog = useCallback((): void => {
    setDialogOpen(false);
    resetForm();
  }, [resetForm]);

  const toggleEditMode = useCallback((): void => {
    setEditMode((prev) => !prev);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Kategorien</h2>
        <div className="flex items-center gap-2">
          <Button
            className="min-h-[44px] font-semibold gap-2"
            variant={editMode ? 'default' : 'outline'}
            onClick={toggleEditMode}
          >
            <Pencil className="h-5 w-5" />
            Kategorie bearbeiten
          </Button>
          <Button className="min-h-[44px] font-semibold gap-2" onClick={openCreateDialog}>
            <Plus className="h-5 w-5" />
            Kategorie erstellen
          </Button>
        </div>
      </div>

      {isLoading ? (
        <CategoryTableSkeleton />
      ) : visibleCategories.length > 0 ? (
        <CategoryTable
          categories={visibleCategories}
          editMode={editMode}
          onDelete={handleDeleteCategory}
          onDragEnd={handleDragEnd}
          onNameSave={handleNameSave}
          sensors={sensors}
        />
      ) : (
        <CategoryEmptyState />
      )}

      <CategoryDialog
        form={form}
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onFormChange={updateFormField}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
};

export default AdminCategoriesTab;
