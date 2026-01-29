import { useState, useMemo } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Doc } from '../../../../convex/_generated/dataModel';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toast } from 'sonner';
import { formatCurrency, formatDate, formatDateTime, formatTime } from '@/lib/format';
import { ShoppingCart, Trash2 } from 'lucide-react';

const AdminPurchasesTab = () => {
  const purchases = useQuery(api.purchases.getAll);
  const teams = useQuery(api.teams.listForAdmin);
  const removePurchase = useMutation(api.purchases.remove);

  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Doc<'purchases'> | null>(null);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterTeamId, setFilterTeamId] = useState('');
  const [filterArticle, setFilterArticle] = useState('');

  const handleDeletePurchase = async () => {
    if (!selectedPurchase) return;
    try {
      await removePurchase({ id: selectedPurchase._id, isAdmin: true });
      setDetailOpen(false);
      setDeleteDialogOpen(false);
      setSelectedPurchase(null);
      toast.success('Erfolgreich', {
        description: 'Kauf gelöscht'
      });
    } catch (err) {
      toast.error('Fehler', {
        description: err instanceof Error ? err.message : 'Fehler beim Löschen'
      });
    }
  };

  const filteredPurchases = useMemo(() => {
    if (!purchases) return [];
    let list = [...purchases];
    if (filterDateFrom) {
      const fromTs = new Date(filterDateFrom).setHours(0, 0, 0, 0);
      list = list.filter((p) => p.createdAt >= fromTs);
    }
    if (filterDateTo) {
      const toTs = new Date(filterDateTo).setHours(23, 59, 59, 999);
      list = list.filter((p) => p.createdAt <= toTs);
    }
    if (filterTeamId) {
      list = list.filter((p) => p.teamId === filterTeamId);
    }
    if (filterArticle.trim()) {
      const q = filterArticle.trim().toLowerCase();
      list = list.filter((p) =>
        p.items.some((item) => item.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [purchases, filterDateFrom, filterDateTo, filterTeamId, filterArticle]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Von</Label>
          <Input
            className="min-h-[44px] w-full sm:w-auto"
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Bis</Label>
          <Input
            className="min-h-[44px] w-full sm:w-auto"
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
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
        <div className="space-y-2 flex-1 min-w-[180px]">
          <Label className="text-sm font-semibold">Artikel</Label>
          <Input
            className="min-h-[44px] w-full"
            type="search"
            placeholder="Suchen"
            value={filterArticle}
            onChange={(e) => setFilterArticle(e.target.value)}
          />
        </div>
      </div>

      {filteredPurchases.length > 0 ? (
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
                      setSelectedPurchase(purchase);
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
                    <TableCell className="py-4">
                      {purchase.items.length} Artikel
                    </TableCell>
                    <TableCell className="py-4 font-bold text-primary">
                      {formatCurrency(purchase.totalAmount)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardContent className="py-16 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-2">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">
              {purchases && purchases.length > 0
                ? 'Keine Einkäufe entsprechen den Filtern'
                : 'Keine Einkäufe gefunden'}
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setSelectedPurchase(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader className="space-y-3 pb-4">
            <DialogTitle className="text-xl font-bold">
              Transaktion – gekaufte Artikel
            </DialogTitle>
            {selectedPurchase && (
              <CardDescription className="text-base">
                {teams?.find((tm) => tm._id === selectedPurchase.teamId)?.name} ·{' '}
                {formatDateTime(new Date(selectedPurchase.createdAt))}
              </CardDescription>
            )}
          </DialogHeader>
          {selectedPurchase && (
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
                <Button
                  onClick={() => setDeleteDialogOpen(true)}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Kauf löschen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kauf löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Buchung wirklich löschen?
            </AlertDialogDescription>
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
