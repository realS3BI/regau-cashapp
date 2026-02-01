import { useCallback, useMemo, useState } from 'react';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { formatCurrency, formatDate, formatDateTime, formatTime } from '@/lib/format';
import { Calendar, ShoppingCart, Trash2, X } from 'lucide-react';

type DatePreset = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'custom';

const getDatePresetRange = (preset: DatePreset): { from: string; to: string } => {
  const today = new Date();
  const formatDateStr = (date: Date) => date.toISOString().split('T')[0];
  
  const getMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  switch (preset) {
    case 'today':
      return { from: formatDateStr(today), to: formatDateStr(today) };
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: formatDateStr(yesterday), to: formatDateStr(yesterday) };
    }
    case 'thisWeek': {
      const monday = getMonday(today);
      return { from: formatDateStr(monday), to: formatDateStr(today) };
    }
    case 'lastWeek': {
      const lastMonday = getMonday(today);
      lastMonday.setDate(lastMonday.getDate() - 7);
      const lastSunday = new Date(lastMonday);
      lastSunday.setDate(lastSunday.getDate() + 6);
      return { from: formatDateStr(lastMonday), to: formatDateStr(lastSunday) };
    }
    case 'thisMonth': {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: formatDateStr(firstDay), to: formatDateStr(today) };
    }
    case 'lastMonth': {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from: formatDateStr(firstDayLastMonth), to: formatDateStr(lastDayLastMonth) };
    }
    default:
      return { from: '', to: '' };
  }
};

const DATE_PRESETS: { label: string; value: DatePreset }[] = [
  { label: 'Heute', value: 'today' },
  { label: 'Gestern', value: 'yesterday' },
  { label: 'Diese Woche', value: 'thisWeek' },
  { label: 'Letzte Woche', value: 'lastWeek' },
  { label: 'Dieser Monat', value: 'thisMonth' },
  { label: 'Letzter Monat', value: 'lastMonth' },
];

const INITIAL_PAGE_SIZE = 30;
const LOAD_MORE_PAGE_SIZE = 50;

const TABLE_SKELETON_ROWS = 10;

const AdminPurchasesTab = () => {
  const teams = useQuery(api.teams.listForAdmin);
  const removePurchase = useMutation(api.purchases.remove);

  const [activePreset, setActivePreset] = useState<DatePreset | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterTeamId, setFilterTeamId] = useState('');
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<Id<'purchases'> | null>(null);

  // Get today's date for max validation
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Validate date range
  const dateValidation = useMemo(() => {
    if (!filterDateFrom && !filterDateTo) return { isValid: true, error: null };
    
    const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
    const toDate = filterDateTo ? new Date(filterDateTo) : null;
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (fromDate && fromDate > today) {
      return { error: 'Von-Datum kann nicht in der Zukunft liegen', isValid: false };
    }
    if (toDate && toDate > today) {
      return { error: 'Bis-Datum kann nicht in der Zukunft liegen', isValid: false };
    }
    if (fromDate && toDate && fromDate > toDate) {
      return { error: 'Von-Datum muss vor dem Bis-Datum liegen', isValid: false };
    }
    return { error: null, isValid: true };
  }, [filterDateFrom, filterDateTo]);

  const handlePresetClick = useCallback((preset: DatePreset) => {
    const { from, to } = getDatePresetRange(preset);
    setActivePreset(preset);
    setFilterDateFrom(from);
    setFilterDateTo(to);
  }, []);

  const handleClearFilters = useCallback(() => {
    setActivePreset(null);
    setFilterDateFrom('');
    setFilterDateTo('');
  }, []);

  const handleDateFromChange = useCallback((value: string) => {
    setActivePreset(null);
    setFilterDateFrom(value);
  }, []);

  const handleDateToChange = useCallback((value: string) => {
    setActivePreset(null);
    setFilterDateTo(value);
  }, []);

  const filterOpts = useMemo(() => {
    // Don't apply invalid date filters
    if (!dateValidation.isValid) {
      return {
        dateFrom: undefined,
        dateTo: undefined,
        teamId: filterTeamId ? (filterTeamId as Id<'teams'>) : undefined,
      };
    }
    const from = filterDateFrom ? new Date(filterDateFrom).setHours(0, 0, 0, 0) : undefined;
    const to = filterDateTo ? new Date(filterDateTo).setHours(23, 59, 59, 999) : undefined;
    return {
      dateFrom: from,
      dateTo: to,
      teamId: filterTeamId ? (filterTeamId as Id<'teams'>) : undefined,
    };
  }, [dateValidation.isValid, filterDateFrom, filterDateTo, filterTeamId]);

  const { loadMore, results, status } = usePaginatedQuery(
    api.purchases.getAllPaginatedList,
    filterOpts,
    { initialNumItems: INITIAL_PAGE_SIZE }
  );

  const filteredPurchases = results ?? [];
  const selectedPurchase =
    selectedPurchaseId != null
      ? (filteredPurchases.find((p) => p._id === selectedPurchaseId) ?? null)
      : null;

  const handleDeletePurchase = async () => {
    if (!selectedPurchaseId) return;
    try {
      await removePurchase({ id: selectedPurchaseId, isAdmin: true });
      setDetailOpen(false);
      setDeleteDialogOpen(false);
      setSelectedPurchaseId(null);
      toast.success('Erfolgreich', {
        description: 'Kauf gelöscht',
      });
    } catch (err) {
      toast.error('Fehler', {
        description: err instanceof Error ? err.message : 'Fehler beim Löschen',
      });
    }
  };

  const isLoading = status === 'LoadingFirstPage';

  const hasDateFilter = filterDateFrom || filterDateTo;

  return (
    <div className="space-y-6">
      {/* Quick filter presets */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-semibold">Schnellauswahl</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {DATE_PRESETS.map((preset) => (
            <Button
              className="h-9"
              key={preset.value}
              size="sm"
              variant={activePreset === preset.value ? 'default' : 'outline'}
              onClick={() => handlePresetClick(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
          {hasDateFilter && (
            <Button
              className="h-9 text-muted-foreground"
              size="sm"
              variant="ghost"
              onClick={handleClearFilters}
            >
              <X className="h-4 w-4 mr-1" />
              Zurücksetzen
            </Button>
          )}
        </div>
      </div>

      {/* Custom date range and team filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Von</Label>
          <Input
            className={`min-h-[44px] w-full sm:w-auto ${
              !dateValidation.isValid && filterDateFrom ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            max={filterDateTo || todayStr}
            type="date"
            value={filterDateFrom}
            onChange={(e) => handleDateFromChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Bis</Label>
          <Input
            className={`min-h-[44px] w-full sm:w-auto ${
              !dateValidation.isValid && filterDateTo ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            max={todayStr}
            min={filterDateFrom || undefined}
            type="date"
            value={filterDateTo}
            onChange={(e) => handleDateToChange(e.target.value)}
          />
        </div>
        <div className="space-y-2 flex-1 min-w-[180px]">
          <Label className="text-sm font-semibold">Team</Label>
          <Select
            value={filterTeamId || '__all__'}
            onValueChange={(v) => setFilterTeamId(v === '__all__' ? '' : v)}
          >
            <SelectTrigger className="min-h-[44px] w-full">
              <SelectValue placeholder="Alle Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Alle Teams</SelectItem>
              {teams
                ?.filter((team) => !team.deletedAt)
                .map((team) => (
                  <SelectItem key={team._id} value={team._id}>
                    {team.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Validation error message */}
      {dateValidation.error && (
        <p className="text-sm text-destructive font-medium">{dateValidation.error}</p>
      )}

      {!isLoading && (
        <p className="text-sm text-muted-foreground">{filteredPurchases.length} Einträge geladen</p>
      )}

      {isLoading ? (
        <Card className="shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-14 font-bold">Datum</TableHead>
                <TableHead className="h-14 font-bold">Uhrzeit</TableHead>
                <TableHead className="h-14 font-bold">Team</TableHead>
                <TableHead className="h-14 font-bold">Artikel</TableHead>
                <TableHead className="h-14 font-bold">Gesamtbetrag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: TABLE_SKELETON_ROWS }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-28" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : filteredPurchases.length > 0 ? (
        <Card className="shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-14 font-bold">Datum</TableHead>
                <TableHead className="h-14 font-bold">Uhrzeit</TableHead>
                <TableHead className="h-14 font-bold">Team</TableHead>
                <TableHead className="h-14 font-bold">Artikel</TableHead>
                <TableHead className="h-14 font-bold">Gesamtbetrag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase) => {
                const team = teams?.find((tm) => tm._id === purchase.teamId);
                return (
                  <TableRow
                    key={purchase._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setSelectedPurchaseId(purchase._id);
                      setDetailOpen(true);
                    }}
                  >
                    <TableCell className="py-4 font-medium">
                      {formatDate(new Date(purchase.createdAt))}
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground">
                      {formatTime(new Date(purchase.createdAt))}
                    </TableCell>
                    <TableCell className="py-4 font-semibold">{team?.name || '-'}</TableCell>
                    <TableCell className="py-4">{purchase.items.length} Artikel</TableCell>
                    <TableCell className="py-4 font-bold text-primary">
                      {formatCurrency(purchase.totalAmount)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {(status === 'CanLoadMore' || status === 'LoadingMore') && (
            <div className="flex justify-center border-t px-4 py-3">
              <Button
                disabled={status === 'LoadingMore'}
                variant="outline"
                onClick={() => loadMore(LOAD_MORE_PAGE_SIZE)}
              >
                {status === 'LoadingMore' ? 'Laden…' : 'Weitere laden'}
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardContent className="py-16 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-2">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">Keine Einkäufe gefunden</p>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setSelectedPurchaseId(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader className="space-y-3 pb-4">
            <DialogTitle className="text-xl font-bold">Transaktion – gekaufte Artikel</DialogTitle>
            {selectedPurchase && (
              <CardDescription className="text-base">
                {teams?.find((tm) => tm._id === selectedPurchase.teamId)?.name} ·{' '}
                {formatDateTime(new Date(selectedPurchase.createdAt))}
              </CardDescription>
            )}
          </DialogHeader>
          {selectedPurchase ? (
            <div className="space-y-4 py-2">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold">Artikel</TableHead>
                    <TableHead className="font-bold text-right">Anzahl</TableHead>
                    <TableHead className="font-bold text-right">Einzelpreis</TableHead>
                    <TableHead className="font-bold text-right">Gesamtbetrag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPurchase.items.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-right text-lg font-bold text-primary border-t pt-3">
                Gesamtbetrag: {formatCurrency(selectedPurchase.totalAmount)}
              </p>
              <div className="flex justify-end pt-2">
                <Button onClick={() => setDeleteDialogOpen(true)} variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Kauf löschen
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kauf löschen</AlertDialogTitle>
            <AlertDialogDescription>Diese Buchung wirklich löschen?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                handleDeletePurchase();
              }}
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPurchasesTab;
