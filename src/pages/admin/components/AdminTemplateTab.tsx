import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from '@/lib/toast';
import { formatCurrency } from '@/lib/format';
import { getVisibleProducts, convertCentsToEuro } from '@/lib/product-utils';
import { Check, Pencil, X } from 'lucide-react';

type Template = 'A' | 'B';

type EditPricesMap = Record<string, { priceA: string; priceB: string }>;

const AdminTemplateTab = () => {
  const categories = useQuery(api.categories.listForAdmin);
  const products = useQuery(api.products.listForAdmin);
  const activeTemplate = useQuery(api.settings.getActiveTemplate);
  const templateNames = useQuery(api.settings.getTemplateNames);
  const setActiveTemplate = useMutation(api.settings.setActiveTemplate);
  const setTemplateNames = useMutation(api.settings.setTemplateNames);
  const updateProduct = useMutation(api.products.update);

  const [filterCategoryId, setFilterCategoryId] = useState<Id<'categories'> | 'all'>('all');
  const [isEditingAllPrices, setIsEditingAllPrices] = useState(false);
  const [editPrices, setEditPrices] = useState<EditPricesMap>({});
  const [editNameA, setEditNameA] = useState('');
  const [editNameB, setEditNameB] = useState('');
  const [isSavingNames, setIsSavingNames] = useState(false);
  const templateNamesInitialized = useRef(false);

  useEffect(() => {
    if (templateNames && !templateNamesInitialized.current) {
      templateNamesInitialized.current = true;
      setEditNameA(templateNames.nameA);
      setEditNameB(templateNames.nameB);
    }
  }, [templateNames]);

  const visibleProducts = getVisibleProducts(products, filterCategoryId);
  const productsLoading = products === undefined || categories === undefined;

  const handleTemplateChange = async (template: Template) => {
    try {
      await setActiveTemplate({ template });
      const displayName = template === 'A' ? templateNames?.nameA : templateNames?.nameB;
      toast.success(`${displayName ?? template} ist jetzt aktiv`);
    } catch (error) {
      toast.error(error, 'Fehler beim Umschalten');
    }
  };

  const handleSaveTemplateNames = async () => {
    const nameA = editNameA.trim() || (templateNames?.nameA ?? 'Vorlage A');
    const nameB = editNameB.trim() || (templateNames?.nameB ?? 'Vorlage B');
    setIsSavingNames(true);
    try {
      await setTemplateNames({ nameA, nameB });
      toast.success('Vorlagen-Namen gespeichert');
    } catch (error) {
      toast.error(error, 'Fehler beim Speichern');
    } finally {
      setIsSavingNames(false);
    }
  };

  const startEditingAllPrices = (): void => {
    const initialPrices: EditPricesMap = {};
    visibleProducts.forEach((product) => {
      initialPrices[product._id] = {
        priceA: convertCentsToEuro(product.priceA),
        priceB: convertCentsToEuro(product.priceB),
      };
    });
    setEditPrices(initialPrices);
    setIsEditingAllPrices(true);
  };

  const cancelEditingAllPrices = (): void => {
    setIsEditingAllPrices(false);
    setEditPrices({});
  };

  const updateEditPrice = (productId: string, field: 'priceA' | 'priceB', value: string): void => {
    setEditPrices((previousPrices) => ({
      ...previousPrices,
      [productId]: {
        ...previousPrices[productId],
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
        toast.error(null, `Ungültiger Preis bei "${product.name}"`, 'Fehler beim Speichern');
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
        toast.error(error, 'Fehler beim Speichern');
        hasError = true;
        break;
      }
    }
    if (!hasError) {
      setIsEditingAllPrices(false);
      setEditPrices({});
      toast.success('Alle Preise gespeichert');
    }
  };

  const templateLoading = activeTemplate === undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Preisvorlagen</h2>
      </div>

      {/* Template names settings */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Einstellungen: Namen der Vorlagen</CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            Hier kannst du festlegen, wie die beiden Preisvorlagen heißen (z.B. &quot;Standard&quot;
            und &quot;Extra&quot;). Die Namen erscheinen in den Buttons und Tabellenüberschriften.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {templateNames === undefined ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-10 w-full max-w-xs" />
              <Skeleton className="h-10 w-full max-w-xs" />
            </div>
          ) : (
            <div className="flex flex-wrap items-end gap-4">
              <div className="grid gap-2 min-w-[240px]">
                <Label htmlFor="template-name-a">Name Vorlage 1</Label>
                <Input
                  id="template-name-a"
                  value={editNameA}
                  onChange={(e) => setEditNameA(e.target.value)}
                />
              </div>
              <div className="grid gap-2 min-w-[240px]">
                <Label htmlFor="template-name-b">Name Vorlage 2</Label>
                <Input
                  id="template-name-b"
                  value={editNameB}
                  onChange={(e) => setEditNameB(e.target.value)}
                />
              </div>
              <Button
                disabled={isSavingNames || (!editNameA.trim() && !editNameB.trim())}
                onClick={handleSaveTemplateNames}
              >
                Namen speichern
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
                  {templateNames?.nameA ?? 'Vorlage A'}
                </Button>
                <Button
                  className="min-h-[44px] font-semibold px-8"
                  variant={activeTemplate === 'B' ? 'default' : 'outline'}
                  onClick={() => handleTemplateChange('B')}
                >
                  {templateNames?.nameB ?? 'Vorlage B'}
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
                      'Preis'
                    ) : (
                      <span className="flex items-center gap-1.5">
                        {templateNames?.nameA ?? 'Vorlage A'}
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
                      'Preis'
                    ) : (
                      <span className="flex items-center gap-1.5">
                        {templateNames?.nameB ?? 'Vorlage B'}
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
                  const category = categories?.find(
                    (category) => category._id === product.categoryId
                  );
                  const editedPrices = editPrices[product._id];

                  return (
                    <TableRow key={product._id} className="hover:bg-muted/50">
                      <TableCell className="font-semibold py-4">{product.name}</TableCell>
                      <TableCell className="py-4">{category?.name || '-'}</TableCell>
                      <TableCell className={`py-4 ${activeTemplate === 'A' ? 'bg-primary/5' : ''}`}>
                        {isEditingAllPrices && editedPrices ? (
                          <Input
                            className="w-24 h-9"
                            type="number"
                            step="0.01"
                            min="0"
                            value={editedPrices.priceA}
                            onChange={(event) =>
                              updateEditPrice(product._id, 'priceA', event.target.value)
                            }
                          />
                        ) : (
                          <span className="font-semibold">{formatCurrency(product.priceA)}</span>
                        )}
                      </TableCell>
                      <TableCell className={`py-4 ${activeTemplate === 'B' ? 'bg-primary/5' : ''}`}>
                        {isEditingAllPrices && editedPrices ? (
                          <Input
                            className="w-24 h-9"
                            type="number"
                            step="0.01"
                            min="0"
                            value={editedPrices.priceB}
                            onChange={(event) =>
                              updateEditPrice(product._id, 'priceB', event.target.value)
                            }
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
