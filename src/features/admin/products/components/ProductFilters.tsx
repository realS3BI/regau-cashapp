import { Doc, Id } from '@convex';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductFiltersProps {
  categories: Doc<'categories'>[] | undefined;
  filterCategoryId: Id<'categories'> | 'all';
  isLoading: boolean;
  onFilterChange: (categoryId: Id<'categories'> | 'all') => void;
}

export const ProductFilters = ({
  categories,
  filterCategoryId,
  isLoading,
  onFilterChange,
}: ProductFiltersProps) => {
  if (isLoading) return null;

  return (
    <Select
      value={filterCategoryId}
      onValueChange={(value) => onFilterChange(value as Id<'categories'> | 'all')}
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
  );
};
