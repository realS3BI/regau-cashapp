import { useState, useMemo, useCallback } from 'react';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { api, Id } from '@convex';
import { toast } from '@/lib/toast';
import { usePurchaseFilters } from './hooks/usePurchaseFilters';
import {
  PurchaseDateFilters,
  PurchaseDeleteDialog,
  PurchaseDetailsDialog,
  PurchaseEmptyState,
  PurchaseTable,
  PurchaseTableSkeleton,
  PurchaseTeamFilter,
} from './components';
import { INITIAL_PAGE_SIZE } from './types';

const AdminPurchasesTab = () => {
  const teams = useQuery(api.teams.listForAdmin);
  const removePurchase = useMutation(api.purchases.remove);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<Id<'purchases'> | null>(null);

  const {
    activePreset,
    dateValidation,
    filterDateFrom,
    filterDateTo,
    filterOpts,
    filterTeamId,
    hasDateFilter,
    handleClearFilters,
    handleDateFromChange,
    handleDateToChange,
    handlePresetClick,
    setFilterTeamId,
  } = usePurchaseFilters();

  const { loadMore, results, status } = usePaginatedQuery(
    api.purchases.getAllPaginatedList,
    filterOpts,
    { initialNumItems: INITIAL_PAGE_SIZE }
  );

  const filteredPurchases = results ?? [];
  const selectedPurchase = useMemo(
    () =>
      selectedPurchaseId
        ? (filteredPurchases.find((p) => p._id === selectedPurchaseId) ?? null)
        : null,
    [filteredPurchases, selectedPurchaseId]
  );

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const isLoading = status === 'LoadingFirstPage';

  const handleDeletePurchase = useCallback(async (): Promise<void> => {
    if (!selectedPurchaseId) return;
    try {
      await removePurchase({ id: selectedPurchaseId, isAdmin: true });
      setDetailOpen(false);
      setDeleteDialogOpen(false);
      setSelectedPurchaseId(null);
      toast.success('Kauf gelöscht');
    } catch (err) {
      toast.error(err, 'Fehler beim Löschen');
    }
  }, [removePurchase, selectedPurchaseId]);

  const handleSelectPurchase = useCallback((purchaseId: Id<'purchases'>): void => {
    setSelectedPurchaseId(purchaseId);
    setDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback((): void => {
    setDetailOpen(false);
    setSelectedPurchaseId(null);
  }, []);

  const handleOpenDeleteDialog = useCallback((): void => {
    setDeleteDialogOpen(true);
  }, []);

  const handleCloseDeleteDialog = useCallback((): void => {
    setDeleteDialogOpen(false);
  }, []);

  return (
    <div className="space-y-6">
      <PurchaseDateFilters
        activePreset={activePreset}
        dateValidation={dateValidation}
        filterDateFrom={filterDateFrom}
        filterDateTo={filterDateTo}
        hasDateFilter={hasDateFilter}
        onClearFilters={handleClearFilters}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        onPresetClick={handlePresetClick}
        todayStr={todayStr}
      />

      <PurchaseTeamFilter
        filterTeamId={filterTeamId}
        onTeamChange={setFilterTeamId}
        teams={teams}
      />

      {!isLoading && (
        <p className="text-sm text-muted-foreground">{filteredPurchases.length} Einträge geladen</p>
      )}

      {isLoading ? (
        <PurchaseTableSkeleton />
      ) : filteredPurchases.length > 0 ? (
        <PurchaseTable
          onLoadMore={loadMore}
          onSelectPurchase={handleSelectPurchase}
          purchases={filteredPurchases}
          status={status}
          teams={teams}
        />
      ) : (
        <PurchaseEmptyState />
      )}

      <PurchaseDetailsDialog
        isOpen={detailOpen}
        onClose={handleCloseDetail}
        onDelete={handleOpenDeleteDialog}
        purchase={selectedPurchase}
        teamName={teams?.find((tm) => tm._id === selectedPurchase?.teamId)?.name}
      />

      <PurchaseDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeletePurchase}
      />
    </div>
  );
};

export default AdminPurchasesTab;
