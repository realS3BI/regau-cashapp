import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
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
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const AdminCategoriesTab = () => {
  const categories = useQuery(api.categories.listForAdmin);
  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const deleteCategory = useMutation(api.categories.remove);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Id<'categories'> | null>(null);
  const [form, setForm] = useState({ active: true, name: '', order: 0 });

  const handleCreateCategory = async () => {
    try {
      const maxOrder = categories ? Math.max(...categories.map((c) => c.order), -1) + 1 : 0;
      await createCategory({
        active: form.active,
        name: form.name,
        order: form.order ?? maxOrder
      });
      setDialogOpen(false);
      setForm({ active: true, name: '', order: 0 });
      toast.success('Erfolgreich', {
        description: 'Kategorie erstellt'
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Erstellen'
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
        order: form.order !== undefined ? form.order : undefined
      });
      setDialogOpen(false);
      setEditingCategory(null);
      setForm({ active: true, name: '', order: 0 });
      toast.success('Erfolgreich', {
        description: 'Kategorie aktualisiert'
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Aktualisieren'
      });
    }
  };

  const handleDeleteCategory = async (id: Id<'categories'>, onSuccess?: () => void) => {
    if (!confirm('Kategorie wirklich löschen?')) return;

    try {
      await deleteCategory({ id });
      onSuccess?.();
      toast.success('Erfolgreich', {
        description: 'Kategorie gelöscht'
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Löschen'
      });
    }
  };

  const openEdit = (category: {
    _id: Id<'categories'>;
    active?: boolean;
    name: string;
    order: number;
  }) => {
    setEditingCategory(category._id);
    setForm({
      active: category.active ?? true,
      name: category.name,
      order: category.order
    });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingCategory(null);
    setForm({ active: true, name: '', order: 0 });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Kategorien</h2>
        <Button
          className="min-h-[44px] font-semibold gap-2"
          onClick={openCreate}
        >
          <Plus className="h-5 w-5" />
          Kategorie erstellen
        </Button>
      </div>

      {categories && categories.length > 0 ? (
        <Card className="shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-14 font-bold">Name</TableHead>
                <TableHead className="h-14 font-bold">Reihenfolge</TableHead>
                <TableHead className="h-14 font-bold">Aktiv</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories
                ?.filter((c) => !c.deletedAt)
                .map((category) => (
                  <TableRow
                    key={category._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openEdit(category)}
                  >
                    <TableCell className="font-semibold py-4">{category.name}</TableCell>
                    <TableCell className="py-4 font-semibold">{category.order}</TableCell>
                    <TableCell className="py-4">
                      <Badge
                        className="font-semibold"
                        variant={category.active ? 'default' : 'secondary'}
                      >
                        {category.active ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardContent className="py-16 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-2">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">
              Keine Kategorien gefunden
            </p>
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
            <div className="space-y-3">
              <Label className="text-sm font-semibold" htmlFor="category-order">
                Reihenfolge
              </Label>
              <Input
                id="category-order"
                className="min-h-[48px]"
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: parseInt(e.target.value) || 0 })
                }
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
                    setForm({ active: true, name: '', order: 0 });
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
