import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { HelpCircle, Package, Receipt, ShoppingBag, TrendingUp } from 'lucide-react';

const getStartOfTodayMs = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
};

const AdminOverviewTab = () => {
  const purchases = useQuery(api.purchases.getAll);

  const startOfTodayMs = getStartOfTodayMs();

  const purchasesToday = purchases?.filter((p) => p.createdAt >= startOfTodayMs) ?? [];
  const todayRevenue = purchasesToday.reduce((sum, p) => sum + p.totalAmount, 0);
  const todayItemsSold = purchasesToday.reduce(
    (sum, p) => sum + p.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const totalRevenue = purchases?.reduce((sum, p) => sum + p.totalAmount, 0) ?? 0;
  const avgPerSaleToday = purchasesToday.length > 0 ? todayRevenue / purchasesToday.length : 0;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
            <TrendingUp className="h-5 w-5" />
            Heutiger Umsatz
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-4xl font-bold tracking-tight text-primary md:text-5xl">
            {formatCurrency(todayRevenue)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {purchasesToday.length} verkäufe heute
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
              <Receipt className="h-4 w-4" />
              Verkäufe heute
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold tracking-tight">{purchasesToday.length}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
              <Package className="h-4 w-4" />
              Artikel verkauft heute
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold tracking-tight">{todayItemsSold}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
              <ShoppingBag className="h-4 w-4" />
              Gesamtumsatz
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold tracking-tight text-primary">
              {formatCurrency(totalRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
              Ø pro Verkauf
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold tracking-tight">
              {formatCurrency(Math.round(avgPerSaleToday))}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Heutiger Umsatz</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-2">
        <Button asChild className="text-muted-foreground" variant="link">
          <Link to="/admin/erklaerung">
            <HelpCircle className="mr-2 h-4 w-4" />
            So funktioniert der Admin-Bereich
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminOverviewTab;
