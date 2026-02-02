import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Id } from '@convex';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CategorySortableRow } from './CategorySortableRow';
import type { CategoryItem } from '../types';

interface CategoryTableProps {
  categories: CategoryItem[];
  editMode: boolean;
  sensors: ReturnType<typeof import('../hooks/useDragAndDrop').useDragAndDropSensors>;
  onDelete: (id: Id<'categories'>) => void;
  onDragEnd: (event: DragEndEvent) => Promise<void>;
  onNameSave: (id: Id<'categories'>, name: string) => void;
}

export const CategoryTable = ({
  categories,
  editMode,
  onDelete,
  onDragEnd,
  onNameSave,
  sensors,
}: CategoryTableProps) => {
  return (
    <Card className="shadow-md">
      <DndContext collisionDetection={closestCenter} sensors={sensors} onDragEnd={onDragEnd}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-14 w-10" />
              <TableHead className="h-14 font-bold">Name</TableHead>
              <TableHead className="h-14 font-bold">Produkte</TableHead>
              {editMode && <TableHead className="h-14 w-12" />}
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
                  editMode={editMode}
                  onDelete={onDelete}
                  onNameSave={onNameSave}
                />
              ))}
            </TableBody>
          </SortableContext>
        </Table>
      </DndContext>
    </Card>
  );
};
