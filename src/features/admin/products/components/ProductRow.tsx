import { Doc } from '@convex';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/format';
import { Heart } from 'lucide-react';

interface ProductRowProps {
  activeTemplate: 'A' | 'B';
  categoryName: string | undefined;
  isSelected: boolean;
  onEdit: () => void;
  onToggleFavorite: (event: React.MouseEvent) => void;
  onToggleSelect: (event: React.MouseEvent) => void;
  product: Doc<'products'>;
}

export const ProductRow = ({
  activeTemplate,
  categoryName,
  isSelected,
  product,
  onEdit,
  onToggleFavorite,
  onToggleSelect,
}: ProductRowProps) => {
  const isFavorite = product.isFavorite ?? false;

  return (
    <TableRow key={product._id} className="cursor-pointer hover:bg-muted/50" onClick={onEdit}>
      <TableCell className="w-12 py-4" onClick={onToggleSelect}>
        <Checkbox checked={isSelected} className="h-5 w-5 pointer-events-none" />
      </TableCell>
      <TableCell className="font-semibold py-4">{product.name}</TableCell>
      <TableCell className="py-4">{categoryName || '-'}</TableCell>
      <TableCell className={`py-4 font-semibold ${activeTemplate === 'A' ? 'bg-primary/5' : ''}`}>
        {formatCurrency(product.priceA)}
      </TableCell>
      <TableCell className={`py-4 font-semibold ${activeTemplate === 'B' ? 'bg-primary/5' : ''}`}>
        {formatCurrency(product.priceB)}
      </TableCell>
      <TableCell className="py-4 text-center">
        <Button
          aria-label={isFavorite ? 'Favorit entfernen' : 'Als Favorit markieren'}
          className="h-9 w-9 rounded-full p-0"
          size="icon"
          variant="ghost"
          onClick={onToggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
        </Button>
      </TableCell>
      <TableCell className="py-4">
        <Badge className="font-semibold" variant={product.active ? 'default' : 'secondary'}>
          {product.active ? 'Aktiv' : 'Inaktiv'}
        </Badge>
      </TableCell>
    </TableRow>
  );
};
