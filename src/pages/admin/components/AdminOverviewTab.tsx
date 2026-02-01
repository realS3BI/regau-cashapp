import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '@convex';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';
import { HelpCircle, Package, Receipt, TrendingUp } from 'lucide-react';

const AdminOverviewTab = () => {
  const purchasesToday = useQuery(api.purchases.getToday);

  const isLoading = purchasesToday === undefined;
  const todayRevenue = purchasesToday?.reduce((sum, p) => sum + p.totalAmount, 0) ?? 0;
  const todayItemsSold =
    purchasesToday?.reduce((sum, p) => sum + p.items.reduce((s, i) => s + i.quantity, 0), 0) ?? 0;
  const avgPerSaleToday =
    purchasesToday && purchasesToday.length > 0 ? todayRevenue / purchasesToday.length : 0;

  if (isLoading) {
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
            <Skeleton className="h-12 w-40 md:h-14 md:w-52" />
            <Skeleton className="mt-3 h-4 w-32" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="pt-0">
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <Skeleton className="h-10 w-64" />
        </div>
      </div>
    );
  }

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
            {purchasesToday?.length ?? 0} verkäufe heute
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
              <Receipt className="h-4 w-4" />
              Verkäufe heute
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold tracking-tight">{purchasesToday?.length ?? 0}</p>
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
          <Link to="/help/admin">
            <HelpCircle className="mr-2 h-4 w-4" />
            So funktioniert der Admin-Bereich
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminOverviewTab;
