import { useQuery } from 'convex/react';
import { api, Id } from '@convex';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import { Heart, LayoutGrid } from 'lucide-react';
import { Separator } from './ui/separator';

export type CategorySelection = Id<'categories'> | null | 'favorites';

interface CategoryListProps {
  onSelectCategory: (categoryId: CategorySelection) => void;
  selectedCategoryId: CategorySelection;
}

const CategoryList = ({ onSelectCategory, selectedCategoryId }: CategoryListProps) => {
  const categories = useQuery(api.categories.listNonEmpty);

  if (!categories) {
    return (
      <div className="flex min-w-0 flex-col gap-3 overflow-hidden p-6">
        <Skeleton className="mb-3 h-6 w-28 truncate" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-full rounded-lg" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 overflow-hidden p-6">
      <div className="min-w-0 space-y-2">
        <Button
          variant={selectedCategoryId === null ? 'default' : 'outline'}
          className="w-full min-h-[48px] min-w-0 justify-start gap-2 truncate text-base font-medium"
          onClick={() => onSelectCategory(null)}
        >
          <LayoutGrid className="h-4 w-4 shrink-0" />
          <span className="truncate">Alle Produkte</span>
        </Button>
        <Button
          variant={selectedCategoryId === 'favorites' ? 'default' : 'outline'}
          className={cn(
            'w-full min-h-[48px] min-w-0 justify-start gap-2 truncate text-base font-medium transition-all',
            selectedCategoryId === 'favorites' && 'bg-primary text-primary-foreground shadow-sm'
          )}
          onClick={() => onSelectCategory('favorites')}
        >
          <Heart className="h-4 w-4 shrink-0" />
          <span className="truncate">Favoriten</span>
        </Button>
        <Separator />
        {categories.map((category) => (
          <Button
            key={category._id}
            variant={selectedCategoryId === category._id ? 'default' : 'outline'}
            className={cn(
              'w-full min-h-[48px] min-w-0 justify-start truncate text-base font-medium transition-all',
              selectedCategoryId === category._id && 'bg-primary text-primary-foreground shadow-sm'
            )}
            onClick={() => onSelectCategory(category._id)}
          >
            <span className="truncate">{category.name}</span>
          </Button>
        ))}
        {categories.length === 0 && (
          <p className="truncate py-4 text-center text-sm text-muted-foreground">
            Keine Kategorien gefunden
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
