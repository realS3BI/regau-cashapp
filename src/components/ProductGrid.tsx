import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { formatCurrency } from '@/lib/format';

interface ProductGridProps {
  categoryId: Id<'categories'> | null;
  lastAddedProductId?: Id<'products'> | null;
  onAddToCart: (product: { _id: Id<'products'>; name: string; price: number }) => void;
}

const ProductGrid = ({ categoryId, lastAddedProductId, onAddToCart }: ProductGridProps) => {
  const allProducts = useQuery(api.products.listAllActive);

  const products = allProducts
    ? categoryId
      ? allProducts.filter((p) => p.categoryId === categoryId)
      : allProducts
    : undefined;

  if (!products) {
    return (
      <div
        className="grid gap-4 p-4 lg:p-6"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 200px))' }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className="flex flex-col w-[200px]">
            <CardHeader className="space-y-1 p-4 pb-2">
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="flex-1 pt-1 px-4">
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground text-lg font-medium">Keine Produkte gefunden</p>
          <p className="text-sm text-muted-foreground">
            Es sind derzeit keine Produkte in dieser Kategorie verfügbar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid gap-4 p-4 lg:p-6"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 200px))' }}
    >
      {products.map((product) => (
        <Card
          key={product._id}
          className={`flex w-[200px] cursor-pointer flex-col border-2 border-transparent transition-all duration-200 hover:border-primary hover:shadow-lg group ${lastAddedProductId === product._id ? 'animate-add-to-cart' : ''}`}
          onClick={() => onAddToCart(product)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onAddToCart(product);
            }
          }}
        >
          <CardHeader className="space-y-1 p-4 pb-2">
            <CardTitle className="text-base font-semibold leading-tight transition-colors group-hover:text-primary">
              {product.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-1 px-4">
            <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
