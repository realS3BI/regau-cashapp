import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import { ProductSalesItem } from './ProductSalesItem';

interface ProductSales {
  name: string;
  quantity: number;
}

interface ProductsTabProps {
  productSales: ProductSales[];
  isLoading: boolean;
}

export const ProductsTab = ({ isLoading, productSales }: ProductsTabProps) => {
  if (isLoading) {
    return (
      <TabsContent
        className="flex-1 -mx-6 px-6 mt-3 min-h-0 data-[state=inactive]:hidden flex flex-col"
        value="products"
      >
        <div className="text-muted-foreground text-sm py-8 text-center">Wird geladen…</div>
      </TabsContent>
    );
  }

  if (productSales.length === 0) {
    return (
      <TabsContent
        className="flex-1 -mx-6 px-6 mt-3 min-h-0 data-[state=inactive]:hidden flex flex-col"
        value="products"
      >
        <div className="text-muted-foreground text-sm py-8 text-center">
          Heute noch keine Verkäufe
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent
      className="flex-1 -mx-6 px-6 mt-3 min-h-0 data-[state=inactive]:hidden flex flex-col"
      value="products"
    >
      <ScrollArea className="min-h-0 flex-1">
        <ul className="space-y-2 pb-6 pr-4">
          {productSales.map(({ name, quantity }) => (
            <ProductSalesItem key={name} name={name} quantity={quantity} />
          ))}
        </ul>
      </ScrollArea>
    </TabsContent>
  );
};
