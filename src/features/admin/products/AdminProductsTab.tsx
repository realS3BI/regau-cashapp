import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api, Doc, Id } from '@convex';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { getVisibleProducts } from '@/lib/product-utils';
import { Plus } from 'lucide-react';
import { useProductForm } from './hooks/useProductForm';
import {
  ProductDialog,
  ProductEmptyState,
  ProductFilters,
  ProductTable,
  ProductTableSkeleton,
} from './components';

const AdminProductsTab = () => {
  const activeTemplate = useQuery(api.settings.getActiveTemplate);
  const categories = useQuery(api.categories.listForAdmin);
  const products = useQuery(api.products.listForAdmin);
  const createProduct = useMutation(api.products.create);
  const deleteProduct = useMutation(api.products.remove);
  const updateManyProductActive = useMutation(api.products.updateManyActive);
  const updateProduct = useMutation(api.products.update);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState<Id<'categories'> | 'all'>('all');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<Id<'products'>>>(new Set());

  const {
    form,
    editingProductId,
    resetForm,
    setFormFromProduct,
    updateFormField,
    getFormDataForSubmit,
  } = useProductForm();

  const visibleProducts = getVisibleProducts(products, filterCategoryId);
  const isLoading = products === undefined || categories === undefined;

  const isAllSelected = useCallback((): boolean => {
    return (
      visibleProducts.length > 0 &&
      visibleProducts.every((product) => selectedProductIds.has(product._id))
    );
  }, [visibleProducts, selectedProductIds]);

  const toggleSelectAll = useCallback((): void => {
    if (isAllSelected()) {
      setSelectedProductIds(new Set());
    } else {
      const allProductIds = new Set(visibleProducts.map((product) => product._id));
      setSelectedProductIds(allProductIds);
    }
  }, [isAllSelected, visibleProducts]);

  const toggleSelectProduct = useCallback(
    (productId: Id<'products'>, event: React.MouseEvent): void => {
      event.stopPropagation();
      setSelectedProductIds((previousIds) => {
        const nextIds = new Set(previousIds);
        if (nextIds.has(productId)) {
          nextIds.delete(productId);
        } else {
          nextIds.add(productId);
        }
        return nextIds;
      });
    },
    []
  );

  const handleBulkSetActive = useCallback(
    async (active: boolean): Promise<void> => {
      const productIds = Array.from(selectedProductIds);
      if (productIds.length === 0) return;

      try {
        await updateManyProductActive({ active, ids: productIds });
        setSelectedProductIds(new Set());
        const actionText = active ? 'aktiviert' : 'deaktiviert';
        toast.success(`${productIds.length} Produkt(e) ${actionText}`);
      } catch (error) {
        toast.error(error, 'Fehler beim Aktualisieren');
      }
    },
    [selectedProductIds, updateManyProductActive]
  );

  const handleCreateProduct = useCallback(async (): Promise<void> => {
    try {
      await createProduct(getFormDataForSubmit());
      setDialogOpen(false);
      resetForm();
      toast.success('Produkt erstellt');
    } catch (error) {
      toast.error(error, 'Fehler beim Erstellen');
    }
  }, [createProduct, getFormDataForSubmit, resetForm]);

  const handleUpdateProduct = useCallback(
    async (data: {
      active: boolean;
      categoryId?: Id<'categories'>;
      description?: string;
      id: Id<'products'>;
      isFavorite: boolean;
      name?: string;
      priceA?: number;
      priceB?: number;
    }): Promise<void> => {
      try {
        await updateProduct(data);
        setDialogOpen(false);
        resetForm();
        toast.success('Produkt aktualisiert');
      } catch (error) {
        toast.error(error, 'Fehler beim Aktualisieren');
      }
    },
    [resetForm, updateProduct]
  );

  const handleDeleteProduct = useCallback(
    async (productId: Id<'products'>, onSuccess?: () => void): Promise<void> => {
      if (!confirm('Produkt wirklich löschen?')) return;

      try {
        await deleteProduct({ id: productId });
        onSuccess?.();
        toast.success('Produkt gelöscht');
      } catch (error) {
        toast.error(error, 'Fehler beim Löschen');
      }
    },
    [deleteProduct]
  );

  const handleToggleFavorite = useCallback(
    async (
      productId: Id<'products'>,
      currentIsFavorite: boolean,
      event: React.MouseEvent
    ): Promise<void> => {
      event.stopPropagation();
      try {
        await updateProduct({ id: productId, isFavorite: !currentIsFavorite });
        const message = !currentIsFavorite ? 'Als Favorit markiert' : 'Favorit entfernt';
        toast.success(message);
      } catch (error) {
        toast.error(error, 'Fehler beim Aktualisieren');
      }
    },
    [updateProduct]
  );

  const openEditDialog = useCallback(
    (product: Doc<'products'>): void => {
      setFormFromProduct(product);
      setDialogOpen(true);
    },
    [setFormFromProduct]
  );

  const openCreateDialog = useCallback((): void => {
    resetForm();
    setDialogOpen(true);
  }, [resetForm]);

  const handleCloseDialog = useCallback((): void => {
    setDialogOpen(false);
    resetForm();
  }, [resetForm]);

  if (!activeTemplate) {
    return <ProductTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Produkte</h2>
          <ProductFilters
            categories={categories}
            filterCategoryId={filterCategoryId}
            isLoading={isLoading}
            onFilterChange={setFilterCategoryId}
          />
        </div>
        <Button className="min-h-[44px] font-semibold gap-2" onClick={openCreateDialog}>
          <Plus className="h-5 w-5" />
          Produkt erstellen
        </Button>
      </div>

      {isLoading ? (
        <ProductTableSkeleton />
      ) : visibleProducts.length > 0 ? (
        <ProductTable
          activeTemplate={activeTemplate}
          categories={categories}
          isAllSelected={isAllSelected()}
          onBulkActivate={() => handleBulkSetActive(true)}
          onBulkDeactivate={() => handleBulkSetActive(false)}
          onClearSelection={() => setSelectedProductIds(new Set())}
          onEdit={openEditDialog}
          onToggleFavorite={handleToggleFavorite}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectProduct={toggleSelectProduct}
          products={visibleProducts}
          selectedProductIds={selectedProductIds}
        />
      ) : (
        <ProductEmptyState />
      )}

      <ProductDialog
        categories={categories}
        editingProductId={editingProductId}
        form={form}
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onDelete={handleDeleteProduct}
        onFormChange={updateFormField}
        onCreate={handleCreateProduct}
        onUpdate={handleUpdateProduct}
      />
    </div>
  );
};

export default AdminProductsTab;
