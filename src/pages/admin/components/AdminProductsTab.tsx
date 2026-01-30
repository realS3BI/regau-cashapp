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
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/format';
import { Plus, Trash2 } from 'lucide-react';

const AdminProductsTab = () => {
  const categories = useQuery(api.categories.listForAdmin);
  const products = useQuery(api.products.listForAdmin);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Id<'products'> | null>(null);
  const [form, setForm] = useState({
    active: true,
    categoryId: '',
    description: '',
    name: '',
    price: '',
  });

  const handleCreateProduct = async () => {
    if (!form.categoryId) return;

    try {
      await createProduct({
        active: form.active,
        categoryId: form.categoryId as Id<'categories'>,
        description: form.description || undefined,
        name: form.name,
        price: Math.round(parseFloat(form.price) * 100),
      });
      setDialogOpen(false);
      setForm({ active: true, categoryId: '', description: '', name: '', price: '' });
      toast.success('Erfolgreich', {
        description: 'Produkt erstellt',
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Erstellen',
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      await updateProduct({
        active: form.active,
        categoryId: form.categoryId ? (form.categoryId as Id<'categories'>) : undefined,
        description: form.description || undefined,
        id: editingProduct,
        name: form.name || undefined,
        price: form.price ? Math.round(parseFloat(form.price) * 100) : undefined,
      });
      setDialogOpen(false);
      setEditingProduct(null);
      setForm({ active: true, categoryId: '', description: '', name: '', price: '' });
      toast.success('Erfolgreich', {
        description: 'Produkt aktualisiert',
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Aktualisieren',
      });
    }
  };

  const handleDeleteProduct = async (id: Id<'products'>, onSuccess?: () => void) => {
    if (!confirm('Produkt wirklich löschen?')) return;

    try {
      await deleteProduct({ id });
      onSuccess?.();
      toast.success('Erfolgreich', {
        description: 'Produkt gelöscht',
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Löschen',
      });
    }
  };

  const openEdit = (product: {
    _id: Id<'products'>;
    active: boolean;
    categoryId: Id<'categories'>;
    description?: string;
    name: string;
    price: number;
  }) => {
    setEditingProduct(product._id);
    setForm({
      active: product.active,
      categoryId: product.categoryId,
      description: product.description || '',
      name: product.name,
      price: (product.price / 100).toFixed(2),
    });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingProduct(null);
    setForm({ active: true, categoryId: '', description: '', name: '', price: '' });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Produkte</h2>
        <Button className="min-h-[44px] font-semibold gap-2" onClick={openCreate}>
          <Plus className="h-5 w-5" />
          Produkt erstellen
        </Button>
      </div>

      {products && products.length > 0 ? (
        <Card className="shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-14 font-bold">Name</TableHead>
                <TableHead className="h-14 font-bold">Kategorie</TableHead>
                <TableHead className="h-14 font-bold">Preis</TableHead>
                <TableHead className="h-14 font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products
                ?.filter((p) => !p.deletedAt)
                .map((product) => {
                  const category = categories?.find((c) => c._id === product.categoryId);
                  return (
                    <TableRow
                      key={product._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openEdit(product)}
                    >
                      <TableCell className="font-semibold py-4">{product.name}</TableCell>
                      <TableCell className="py-4">{category?.name || '-'}</TableCell>
                      <TableCell className="py-4 font-semibold">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className="font-semibold"
                          variant={product.active ? 'default' : 'secondary'}
                        >
                          {product.active ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
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
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">Keine Produkte gefunden</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="space-y-3 pb-4">
            <DialogTitle className="text-2xl font-bold">
              {editingProduct ? 'Produkt bearbeiten' : 'Produkt erstellen'}
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
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold" htmlFor="product-price">
                Preis (EUR)
              </Label>
              <Input
                id="product-price"
                className="min-h-[48px]"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold" htmlFor="product-category">
                Kategorie
              </Label>
              <Select
                value={form.categoryId}
                onValueChange={(value) => setForm({ ...form, categoryId: value })}
              >
                <SelectTrigger className="min-h-[48px] w-full">
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    ?.filter((c) => !c.deletedAt)
                    .map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <Checkbox
                id="product-active"
                className="h-5 w-5"
                checked={form.active}
                onCheckedChange={(checked: boolean | 'indeterminate') =>
                  setForm({ ...form, active: checked === true })
                }
              />
              <Label className="cursor-pointer font-semibold" htmlFor="product-active">
                Aktiv
              </Label>
            </div>
          </div>
          <DialogFooter className="flex flex-wrap gap-2 pt-4">
            {editingProduct && (
              <Button
                className="min-h-[44px] font-semibold text-destructive hover:text-destructive mr-auto"
                variant="outline"
                onClick={() =>
                  handleDeleteProduct(editingProduct, () => {
                    setDialogOpen(false);
                    setEditingProduct(null);
                    setForm({ active: true, categoryId: '', description: '', name: '', price: '' });
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
              onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
            >
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductsTab;
