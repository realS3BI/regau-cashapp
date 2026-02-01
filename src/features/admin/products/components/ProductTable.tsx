import { Doc, Id } from '@convex';
import { Card } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import { ProductRow } from './ProductRow';
import { ProductTableHeader } from './ProductTableHeader';
import { ProductBulkActions } from './ProductBulkActions';

interface ProductTableProps {
  activeTemplate: 'A' | 'B';
  categories: Doc<'categories'>[] | undefined;
  isAllSelected: boolean;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onClearSelection: () => void;
  onEdit: (product: Doc<'products'>) => void;
  onToggleFavorite: (
    productId: Id<'products'>,
    currentIsFavorite: boolean,
    event: React.MouseEvent
  ) => void;
  onToggleSelectAll: () => void;
  onToggleSelectProduct: (productId: Id<'products'>, event: React.MouseEvent) => void;
  products: Doc<'products'>[];
  selectedProductIds: Set<Id<'products'>>;
}

export const ProductTable = ({
  activeTemplate,
  categories,
  isAllSelected,
  onBulkActivate,
  onBulkDeactivate,
  onClearSelection,
  onEdit,
  onToggleFavorite,
  onToggleSelectAll,
  onToggleSelectProduct,
  products,
  selectedProductIds,
}: ProductTableProps) => {
  return (
    <Card className="shadow-md">
      <ProductBulkActions
        onActivate={onBulkActivate}
        onClearSelection={onClearSelection}
        onDeactivate={onBulkDeactivate}
        selectedCount={selectedProductIds.size}
      />
      <Table>
        <ProductTableHeader
          activeTemplate={activeTemplate}
          isAllSelected={isAllSelected}
          onToggleSelectAll={onToggleSelectAll}
        />
        <TableBody>
          {products.map((product) => {
            const category = categories?.find((c) => c._id === product.categoryId);
            return (
              <ProductRow
                key={product._id}
                activeTemplate={activeTemplate}
                categoryName={category?.name}
                isSelected={selectedProductIds.has(product._id)}
                product={product}
                onEdit={() => onEdit(product)}
                onToggleFavorite={(e) =>
                  onToggleFavorite(product._id, product.isFavorite ?? false, e)
                }
                onToggleSelect={(e) => onToggleSelectProduct(product._id, e)}
              />
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};
