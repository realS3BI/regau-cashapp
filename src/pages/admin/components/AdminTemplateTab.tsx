import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/format';
import { Check, Pencil, X } from 'lucide-react';

type Template = 'A' | 'B';

type EditPricesMap = Record<string, { priceA: string; priceB: string }>;

const AdminTemplateTab = () => {
  const categories = useQuery(api.categories.listForAdmin);
  const products = useQuery(api.products.listForAdmin);
  const activeTemplate = useQuery(api.settings.getActiveTemplate);
  const setActiveTemplate = useMutation(api.settings.setActiveTemplate);
  const updateProduct = useMutation(api.products.update);

  const [filterCategoryId, setFilterCategoryId] = useState<Id<'categories'> | 'all'>('all');
  const [isEditingAllPrices, setIsEditingAllPrices] = useState(false);
  const [editPrices, setEditPrices] = useState<EditPricesMap>({});

  const visibleProducts = (products?.filter((p) => !p.deletedAt) ?? []).filter(
    (p) => filterCategoryId === 'all' || p.categoryId === filterCategoryId
  );
  const productsLoading = products === undefined || categories === undefined;

  const handleTemplateChange = async (template: Template) => {
    try {
      await setActiveTemplate({ template });
      toast.success('Erfolgreich', {
        description: `Vorlage ${template} ist jetzt aktiv`,
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Umschalten',
      });
    }
  };

  const startEditingAllPrices = () => {
    const initial: EditPricesMap = {};
    visibleProducts.forEach((p) => {
      initial[p._id] = {
        priceA: (p.priceA / 100).toFixed(2),
        priceB: (p.priceB / 100).toFixed(2),
      };
    });
    setEditPrices(initial);
    setIsEditingAllPrices(true);
  };

  const cancelEditingAllPrices = () => {
    setIsEditingAllPrices(false);
    setEditPrices({});
  };

  const updateEditPrice = (productId: string, field: 'priceA' | 'priceB', value: string) => {
    setEditPrices((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const saveAllPrices = async () => {
    let hasError = false;
    for (const product of visibleProducts) {
      const edited = editPrices[product._id];
      if (!edited) continue;

      const priceA = Math.round(parseFloat(edited.priceA) * 100);
      const priceB = Math.round(parseFloat(edited.priceB) * 100);
      if (isNaN(priceA) || priceA < 0 || isNaN(priceB) || priceB < 0) {
        toast.error('Fehler', {
          description: `Ungültiger Preis bei "${product.name}"`,
        });
        hasError = true;
        break;
      }

      try {
        await updateProduct({
          id: product._id,
          priceA,
          priceB,
        });
      } catch (error) {
        toast.error('Fehler', {
          description: error instanceof Error ? error.message : 'Fehler beim Speichern',
        });
        hasError = true;
        break;
      }
    }
    if (!hasError) {
      setIsEditingAllPrices(false);
      setEditPrices({});
      toast.success('Erfolgreich', { description: 'Alle Preise gespeichert' });
    }
  };

  const templateLoading = activeTemplate === undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Preisvorlagen</h2>
      </div>

      {/* Template Selector */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Vorlage wechseln</CardTitle>
        </CardHeader>
        <CardContent>
          {templateLoading ? (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Skeleton className="h-11 w-32 rounded-md" />
                <Skeleton className="h-11 w-32 rounded-md" />
              </div>
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  className="min-h-[44px] font-semibold px-8"
                  variant={activeTemplate === 'A' ? 'default' : 'outline'}
                  onClick={() => handleTemplateChange('A')}
                >
                  Vorlage A
                  {activeTemplate === 'A' && (
                    <Badge className="ml-2" variant="secondary">
                      Aktiv
                    </Badge>
                  )}
                </Button>
                <Button
                  className="min-h-[44px] font-semibold px-8"
                  variant={activeTemplate === 'B' ? 'default' : 'outline'}
                  onClick={() => handleTemplateChange('B')}
                >
                  Vorlage B
                  {activeTemplate === 'B' && (
                    <Badge className="ml-2" variant="secondary">
                      Aktiv
                    </Badge>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Die aktive Vorlage bestimmt, welche Preise für alle Teams angezeigt werden.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Price Table */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg">Preisübersicht</CardTitle>
            {!productsLoading && (
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
          {!productsLoading &&
            visibleProducts.length > 0 &&
            (isEditingAllPrices ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={cancelEditingAllPrices}>
                  <X className="h-4 w-4 mr-1.5" />
                  Abbrechen
                </Button>
                <Button size="sm" onClick={saveAllPrices}>
                  <Check className="h-4 w-4 mr-1.5" />
                  Speichern
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={startEditingAllPrices}>
                <Pencil className="h-4 w-4 mr-1.5" />
                Preise bearbeiten
              </Button>
            ))}
        </CardHeader>
        <CardContent className="p-0">
          {productsLoading ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-14 font-bold">Produkt</TableHead>
                  <TableHead className="h-14 font-bold">Kategorie</TableHead>
                  <TableHead className="h-14 font-bold">Preis A</TableHead>
                  <TableHead className="h-14 font-bold">Preis B</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : visibleProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-14 font-bold">Produkt</TableHead>
                  <TableHead className="h-14 font-bold">Kategorie</TableHead>
                  <TableHead
                    className={`h-14 font-bold ${templateLoading ? '' : activeTemplate === 'A' ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    {templateLoading ? (
                      'Preis A'
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Preis A
                        {activeTemplate === 'A' && (
                          <>
                            <Check className="h-4 w-4" aria-hidden />
                            <span className="sr-only">(aktiv)</span>
                          </>
                        )}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className={`h-14 font-bold ${templateLoading ? '' : activeTemplate === 'B' ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    {templateLoading ? (
                      'Preis B'
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Preis B
                        {activeTemplate === 'B' && (
                          <>
                            <Check className="h-4 w-4" aria-hidden />
                            <span className="sr-only">(aktiv)</span>
                          </>
                        )}
                      </span>
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleProducts.map((product) => {
                  const category = categories?.find((c) => c._id === product.categoryId);
                  const edited = editPrices[product._id];

                  return (
                    <TableRow key={product._id} className="hover:bg-muted/50">
                      <TableCell className="font-semibold py-4">{product.name}</TableCell>
                      <TableCell className="py-4">{category?.name || '-'}</TableCell>
                      <TableCell className={`py-4 ${activeTemplate === 'A' ? 'bg-primary/5' : ''}`}>
                        {isEditingAllPrices && edited ? (
                          <Input
                            className="w-24 h-9"
                            type="number"
                            step="0.01"
                            min="0"
                            value={edited.priceA}
                            onChange={(e) => updateEditPrice(product._id, 'priceA', e.target.value)}
                          />
                        ) : (
                          <span className="font-semibold">{formatCurrency(product.priceA)}</span>
                        )}
                      </TableCell>
                      <TableCell className={`py-4 ${activeTemplate === 'B' ? 'bg-primary/5' : ''}`}>
                        {isEditingAllPrices && edited ? (
                          <Input
                            className="w-24 h-9"
                            type="number"
                            step="0.01"
                            min="0"
                            value={edited.priceB}
                            onChange={(e) => updateEditPrice(product._id, 'priceB', e.target.value)}
                          />
                        ) : (
                          <span className="font-semibold">{formatCurrency(product.priceB)}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground text-lg font-medium">Keine Produkte vorhanden</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTemplateTab;
