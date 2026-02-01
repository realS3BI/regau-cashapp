import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { api, Id } from '@convex';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { Plus } from 'lucide-react';
import { useCategoryForm } from './hooks/useCategoryForm';
import { useDragAndDropSensors } from './hooks/useDragAndDrop';
import {
  CategoryDialog,
  CategoryEmptyState,
  CategoryTable,
  CategoryTableSkeleton,
} from './components';
import { filterNonDeletedCategories, calculateNextOrderNumber } from './utils';
import type { CategoryItem } from './types';

const AdminCategoriesTab = () => {
  const categories = useQuery(api.categories.listForAdminWithProductCount);
  const createCategory = useMutation(api.categories.create);
  const deleteCategory = useMutation(api.categories.remove);
  const reorderCategories = useMutation(api.categories.reorder);
  const updateCategory = useMutation(api.categories.update);
  const updateManyCategoryActive = useMutation(api.categories.updateManyActive);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<Id<'categories'>>>(new Set());

  const { form, editingCategoryId, resetForm, setFormFromCategory, updateFormField } =
    useCategoryForm();
  const sensors = useDragAndDropSensors();

  const visibleCategories = useMemo(() => filterNonDeletedCategories(categories), [categories]);
  const isLoading = categories === undefined;

  const isAllSelected = useCallback((): boolean => {
    return (
      visibleCategories.length > 0 &&
      visibleCategories.every((category) => selectedCategoryIds.has(category._id))
    );
  }, [visibleCategories, selectedCategoryIds]);

  const toggleSelectAll = useCallback((): void => {
    if (isAllSelected()) {
      setSelectedCategoryIds(new Set());
    } else {
      const allIds = new Set(visibleCategories.map((category) => category._id));
      setSelectedCategoryIds(allIds);
    }
  }, [isAllSelected, visibleCategories]);

  const toggleSelectCategory = useCallback(
    (categoryId: Id<'categories'>, event: React.MouseEvent): void => {
      event.stopPropagation();
      setSelectedCategoryIds((previousIds) => {
        const nextIds = new Set(previousIds);
        if (nextIds.has(categoryId)) {
          nextIds.delete(categoryId);
        } else {
          nextIds.add(categoryId);
        }
        return nextIds;
      });
    },
    []
  );

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
        active: form.active,
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

  const handleUpdateCategory = useCallback(async (): Promise<void> => {
    if (!editingCategoryId) return;

    try {
      await updateCategory({
        active: form.active,
        id: editingCategoryId,
        name: form.name || undefined,
      });
      setDialogOpen(false);
      resetForm();
      toast.success('Kategorie aktualisiert');
    } catch (error) {
      toast.error(error, 'Fehler beim Aktualisieren');
    }
  }, [editingCategoryId, form, resetForm, updateCategory]);

  const handleDeleteCategory = useCallback(
    async (categoryId: Id<'categories'>, onSuccess?: () => void): Promise<void> => {
      if (!confirm('Kategorie wirklich löschen?')) return;

      try {
        await deleteCategory({ id: categoryId });
        onSuccess?.();
        toast.success('Kategorie gelöscht');
      } catch (error) {
        toast.error(error, 'Fehler beim Löschen');
      }
    },
    [deleteCategory]
  );

  const handleBulkSetActive = useCallback(
    async (active: boolean): Promise<void> => {
      const categoryIds = Array.from(selectedCategoryIds);
      if (categoryIds.length === 0) return;

      try {
        await updateManyCategoryActive({ active, ids: categoryIds });
        setSelectedCategoryIds(new Set());
        const actionText = active ? 'aktiviert' : 'deaktiviert';
        toast.success(`${categoryIds.length} Kategorie(n) ${actionText}`);
      } catch (error) {
        toast.error(error, 'Fehler beim Aktualisieren');
      }
    },
    [selectedCategoryIds, updateManyCategoryActive]
  );

  const openEditDialog = useCallback(
    (category: CategoryItem): void => {
      setFormFromCategory(category);
      setDialogOpen(true);
    },
    [setFormFromCategory]
  );

  const openCreateDialog = useCallback((): void => {
    resetForm();
    setDialogOpen(true);
  }, [resetForm]);

  const handleCloseDialog = useCallback((): void => {
    setDialogOpen(false);
    resetForm();
  }, [resetForm]);

  const handleDeleteClick = useCallback((): void => {
    if (!editingCategoryId) return;

    handleDeleteCategory(editingCategoryId, () => {
      handleCloseDialog();
    });
  }, [editingCategoryId, handleDeleteCategory, handleCloseDialog]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (editingCategoryId) {
      await handleUpdateCategory();
    } else {
      await handleCreateCategory();
    }
  }, [editingCategoryId, handleCreateCategory, handleUpdateCategory]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Kategorien</h2>
        <Button className="min-h-[44px] font-semibold gap-2" onClick={openCreateDialog}>
          <Plus className="h-5 w-5" />
          Kategorie erstellen
        </Button>
      </div>

      {isLoading ? (
        <CategoryTableSkeleton />
      ) : visibleCategories.length > 0 ? (
        <CategoryTable
          categories={visibleCategories}
          isAllSelected={isAllSelected()}
          onBulkActivate={() => handleBulkSetActive(true)}
          onBulkDeactivate={() => handleBulkSetActive(false)}
          onClearSelection={() => setSelectedCategoryIds(new Set())}
          onDragEnd={handleDragEnd}
          onEdit={openEditDialog}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectCategory={toggleSelectCategory}
          selectedCategoryIds={selectedCategoryIds}
          sensors={sensors}
        />
      ) : (
        <CategoryEmptyState />
      )}

      <CategoryDialog
        editingCategoryId={editingCategoryId}
        form={form}
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onDelete={handleDeleteClick}
        onFormChange={updateFormField}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AdminCategoriesTab;
