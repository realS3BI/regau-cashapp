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
import { formatCurrency } from '@/lib/format';
import { Check, Heart, Loader2, Plus, Trash2 } from 'lucide-react';

const AdminProductsTab = () => {
  const activeTemplate = useQuery(api.settings.getActiveTemplate);
  const categories = useQuery(api.categories.listForAdmin);
  const products = useQuery(api.products.listForAdmin);
  const createCategory = useMutation(api.categories.create);
  const createProduct = useMutation(api.products.create);
  const deleteProduct = useMutation(api.products.remove);
  const updateManyProductActive = useMutation(api.products.updateManyActive);
  const updateProduct = useMutation(api.products.update);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState<Id<'categories'> | 'all'>('all');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<Id<'products'>>>(new Set());
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Id<'products'> | null>(null);
  const [form, setForm] = useState({
    active: true,
    categoryId: '',
    description: '',
    isFavorite: false,
    name: '',
    priceA: '',
    priceB: '',
  });

  const handleCreateProduct = async () => {
    if (!form.categoryId) return;

    try {
      await createProduct({
        active: form.active,
        categoryId: form.categoryId as Id<'categories'>,
        description: form.description || undefined,
        isFavorite: form.isFavorite,
        name: form.name,
        priceA: Math.round(parseFloat(form.priceA) * 100),
        priceB: Math.round(parseFloat(form.priceB) * 100),
      });
      setDialogOpen(false);
      setForm({
        active: true,
        categoryId: '',
        description: '',
        isFavorite: false,
        name: '',
        priceA: '',
        priceB: '',
      });
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
        isFavorite: form.isFavorite,
        name: form.name || undefined,
        priceA: form.priceA ? Math.round(parseFloat(form.priceA) * 100) : undefined,
        priceB: form.priceB ? Math.round(parseFloat(form.priceB) * 100) : undefined,
      });
      setDialogOpen(false);
      setEditingProduct(null);
      setForm({
        active: true,
        categoryId: '',
        description: '',
        isFavorite: false,
        name: '',
        priceA: '',
        priceB: '',
      });
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
    isFavorite?: boolean;
    name: string;
    priceA: number;
    priceB: number;
  }) => {
    setEditingProduct(product._id);
    setForm({
      active: product.active,
      categoryId: product.categoryId,
      description: product.description || '',
      isFavorite: product.isFavorite ?? false,
      name: product.name,
      priceA: (product.priceA / 100).toFixed(2),
      priceB: (product.priceB / 100).toFixed(2),
    });
    setDialogOpen(true);
  };

  const handleToggleFavorite = async (
    productId: Id<'products'>,
    current: boolean,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      await updateProduct({ id: productId, isFavorite: !current });
      toast.success('Erfolgreich', {
        description: !current ? 'Als Favorit markiert' : 'Favorit entfernt',
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Aktualisieren',
      });
    }
  };

  const handleCreateCategoryInline = async () => {
    const name = newCategoryName.trim();
    if (!name || isCreatingCategory) return;
    setIsCreatingCategory(true);
    try {
      const maxOrder = categories ? Math.max(...categories.map((c) => c.order), -1) + 1 : 0;
      const id = await createCategory({
        active: true,
        name,
        order: maxOrder,
      });
      setForm((prev) => ({ ...prev, categoryId: id }));
      setNewCategoryName('');
      setShowCreateCategory(false);
      toast.success('Erfolgreich', {
        description: 'Kategorie erstellt',
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Erstellen',
      });
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const openCreate = () => {
    setEditingProduct(null);
    setForm({
      active: true,
      categoryId: '',
      description: '',
      isFavorite: false,
      name: '',
      priceA: '',
      priceB: '',
    });
    setNewCategoryName('');
    setShowCreateCategory(false);
    setDialogOpen(true);
  };

  const visibleProducts = (products?.filter((p) => !p.deletedAt) ?? [])
    .filter((p) => filterCategoryId === 'all' || p.categoryId === filterCategoryId)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));
  const isLoading = products === undefined || categories === undefined;
  const allSelected =
    visibleProducts.length > 0 && visibleProducts.every((p) => selectedProductIds.has(p._id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(visibleProducts.map((p) => p._id)));
    }
  };

  const toggleSelectProduct = (id: Id<'products'>, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkSetActive = async (active: boolean) => {
    const ids = Array.from(selectedProductIds);
    if (ids.length === 0) return;
    try {
      await updateManyProductActive({ active, ids });
      setSelectedProductIds(new Set());
      toast.success('Erfolgreich', {
        description: `${ids.length} Produkt(e) ${active ? 'aktiviert' : 'deaktiviert'}`,
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
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Produkte</h2>
          {!isLoading && (
            <Select
              value={filterCategoryId}
              onValueChange={(value) => setFilterCategoryId(value as Id<'categories'> | 'all')}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Alle Kategorien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {categories
                  ?.filter((c) => !c.deletedAt)
                  .map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Button className="min-h-[44px] font-semibold gap-2" onClick={openCreate}>
          <Plus className="h-5 w-5" />
          Produkt erstellen
        </Button>
      </div>

      {isLoading ? (
        <Card className="shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-14 w-12" />
                <TableHead className="h-14 font-bold">Name</TableHead>
                <TableHead className="h-14 font-bold">Kategorie</TableHead>
                <TableHead className="h-14 font-bold">Preis A</TableHead>
                <TableHead className="h-14 font-bold">Preis B</TableHead>
                <TableHead className="h-14 w-12 font-bold text-center">Favorit</TableHead>
                <TableHead className="h-14 font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-5" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-9 w-9 rounded-full mx-auto" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : visibleProducts.length > 0 ? (
        <Card className="shadow-md">
          {selectedProductIds.size > 0 && (
            <div className="flex items-center gap-4 px-4 py-3 border-b bg-muted/40">
              <span className="text-sm font-medium">{selectedProductIds.size} ausgewählt</span>
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
                onClick={() => setSelectedProductIds(new Set())}
              >
                Auswahl aufheben
              </Button>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-14 w-12">
                  <Checkbox
                    checked={allSelected}
                    className="h-5 w-5"
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="h-14 font-bold">Name</TableHead>
                <TableHead className="h-14 font-bold">Kategorie</TableHead>
                <TableHead
                  className={`h-14 font-bold ${activeTemplate === 'A' ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <span className="flex items-center gap-1.5">
                    Preis A{activeTemplate === 'A' && <Check aria-hidden className="h-4 w-4" />}
                  </span>
                </TableHead>
                <TableHead
                  className={`h-14 font-bold ${activeTemplate === 'B' ? 'bg-primary/10 text-primary' : ''}`}
                >
                  <span className="flex items-center gap-1.5">
                    Preis B{activeTemplate === 'B' && <Check aria-hidden className="h-4 w-4" />}
                  </span>
                </TableHead>
                <TableHead className="h-14 w-12 font-bold text-center">Favorit</TableHead>
                <TableHead className="h-14 font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleProducts.map((product) => {
                const category = categories?.find((c) => c._id === product.categoryId);
                return (
                  <TableRow
                    key={product._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openEdit(product)}
                  >
                    <TableCell
                      className="w-12 py-4"
                      onClick={(e) => toggleSelectProduct(product._id, e)}
                    >
                      <Checkbox
                        checked={selectedProductIds.has(product._id)}
                        className="h-5 w-5 pointer-events-none"
                      />
                    </TableCell>
                    <TableCell className="font-semibold py-4">{product.name}</TableCell>
                    <TableCell className="py-4">{category?.name || '-'}</TableCell>
                    <TableCell
                      className={`py-4 font-semibold ${activeTemplate === 'A' ? 'bg-primary/5' : ''}`}
                    >
                      {formatCurrency(product.priceA)}
                    </TableCell>
                    <TableCell
                      className={`py-4 font-semibold ${activeTemplate === 'B' ? 'bg-primary/5' : ''}`}
                    >
                      {formatCurrency(product.priceB)}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <Button
                        aria-label={
                          (product.isFavorite ?? false)
                            ? 'Favorit entfernen'
                            : 'Als Favorit markieren'
                        }
                        className="h-9 w-9 rounded-full p-0"
                        size="icon"
                        variant="ghost"
                        onClick={(e) =>
                          handleToggleFavorite(product._id, product.isFavorite ?? false, e)
                        }
                      >
                        <Heart
                          className={`h-4 w-4 ${(product.isFavorite ?? false) ? 'fill-primary text-primary' : ''}`}
                        />
                      </Button>
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

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setIsCreatingCategory(false);
            setNewCategoryName('');
            setShowCreateCategory(false);
          }
        }}
      >
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-sm font-semibold" htmlFor="product-priceA">
                  Preis A (EUR)
                </Label>
                <Input
                  id="product-priceA"
                  className="min-h-[48px]"
                  type="number"
                  step="0.01"
                  value={form.priceA}
                  onChange={(e) => setForm({ ...form, priceA: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold" htmlFor="product-priceB">
                  Preis B (EUR)
                </Label>
                <Input
                  id="product-priceB"
                  className="min-h-[48px]"
                  type="number"
                  step="0.01"
                  value={form.priceB}
                  onChange={(e) => setForm({ ...form, priceB: e.target.value })}
                />
              </div>
            </div>
            <div className="relative space-y-3">
              {isCreatingCategory && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80">
                  <div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm font-medium">Kategorie wird erstellt…</span>
                  </div>
                </div>
              )}
              <Label className="text-sm font-semibold" htmlFor="product-category">
                Kategorie
              </Label>
              <Select
                disabled={isCreatingCategory}
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
              {!showCreateCategory ? (
                <Button
                  className="h-auto px-0 text-sm font-medium text-primary hover:underline"
                  disabled={isCreatingCategory}
                  type="button"
                  variant="link"
                  onClick={() => setShowCreateCategory(true)}
                >
                  Kategorie nicht gefunden? Neue Kategorie erstellen
                </Button>
              ) : (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 p-3">
                  <Input
                    className="min-h-[40px] flex-1 min-w-[140px]"
                    disabled={isCreatingCategory}
                    placeholder="Name der neuen Kategorie"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCategoryInline()}
                  />
                  <Button
                    className="min-h-[40px] font-semibold"
                    disabled={isCreatingCategory}
                    size="sm"
                    onClick={handleCreateCategoryInline}
                  >
                    Erstellen
                  </Button>
                  <Button
                    className="min-h-[40px] font-semibold"
                    disabled={isCreatingCategory}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCreateCategory(false);
                      setNewCategoryName('');
                    }}
                  >
                    Abbrechen
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center space-x-3">
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
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="product-favorite"
                  className="h-5 w-5"
                  checked={form.isFavorite}
                  onCheckedChange={(checked: boolean | 'indeterminate') =>
                    setForm({ ...form, isFavorite: checked === true })
                  }
                />
                <Label className="cursor-pointer font-semibold" htmlFor="product-favorite">
                  Favorit
                </Label>
              </div>
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
                    setForm({
                      active: true,
                      categoryId: '',
                      description: '',
                      isFavorite: false,
                      name: '',
                      priceA: '',
                      priceB: '',
                    });
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
