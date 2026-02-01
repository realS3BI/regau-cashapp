import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Id } from '@convex';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CategorySortableRow } from './CategorySortableRow';
import { CategoryBulkActions } from './CategoryBulkActions';
import type { CategoryItem } from '../types';

interface CategoryTableProps {
  categories: CategoryItem[];
  selectedCategoryIds: Set<Id<'categories'>>;
  sensors: ReturnType<typeof import('../hooks/useDragAndDrop').useDragAndDropSensors>;
  onDragEnd: (event: DragEndEvent) => Promise<void>;
  onEdit: (category: CategoryItem) => void;
  onToggleSelectAll: () => void;
  onToggleSelectCategory: (categoryId: Id<'categories'>, event: React.MouseEvent) => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onClearSelection: () => void;
  isAllSelected: boolean;
}

export const CategoryTable = ({
  categories,
  isAllSelected,
  onBulkActivate,
  onBulkDeactivate,
  onClearSelection,
  onDragEnd,
  onEdit,
  onToggleSelectAll,
  onToggleSelectCategory,
  selectedCategoryIds,
  sensors,
}: CategoryTableProps) => {
  return (
    <Card className="shadow-md">
      <CategoryBulkActions
        onActivate={onBulkActivate}
        onClearSelection={onClearSelection}
        onDeactivate={onBulkDeactivate}
        selectedCount={selectedCategoryIds.size}
      />
      <DndContext collisionDetection={closestCenter} sensors={sensors} onDragEnd={onDragEnd}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-14 w-10" />
              <TableHead className="h-14 w-12">
                <Checkbox
                  checked={isAllSelected}
                  className="h-5 w-5"
                  onCheckedChange={onToggleSelectAll}
                />
              </TableHead>
              <TableHead className="h-14 font-bold">Name</TableHead>
              <TableHead className="h-14 font-bold">Produkte</TableHead>
              <TableHead className="h-14 font-bold">Aktiv</TableHead>
            </TableRow>
          </TableHeader>
          <SortableContext
            items={categories.map((category) => category._id)}
            strategy={verticalListSortingStrategy}
          >
            <TableBody>
              {categories.map((category) => (
                <CategorySortableRow
                  key={category._id}
                  category={category}
                  isSelected={selectedCategoryIds.has(category._id)}
                  onEdit={() => onEdit(category)}
                  onToggleSelect={(event) => onToggleSelectCategory(category._id, event)}
                />
              ))}
            </TableBody>
          </SortableContext>
        </Table>
      </DndContext>
    </Card>
  );
};
