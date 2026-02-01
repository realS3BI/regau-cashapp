import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { GripVertical } from 'lucide-react';
import type { CategoryItem } from '../types';

interface CategorySortableRowProps {
  category: CategoryItem;
  isSelected: boolean;
  onEdit: () => void;
  onToggleSelect: (event: React.MouseEvent) => void;
}

export const CategorySortableRow = ({
  category,
  isSelected,
  onEdit,
  onToggleSelect,
}: CategorySortableRowProps) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: category._id,
  });

  const dragStyle = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDragHandleClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
  };

  return (
    <TableRow
      ref={setNodeRef}
      className="cursor-pointer hover:bg-muted/50"
      onClick={onEdit}
      style={dragStyle}
    >
      <TableCell
        className="w-10 py-4"
        {...attributes}
        {...listeners}
        onClick={handleDragHandleClick}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
      </TableCell>
      <TableCell className="w-12 py-4" onClick={onToggleSelect}>
        <Checkbox checked={isSelected} className="h-5 w-5 pointer-events-none" />
      </TableCell>
      <TableCell className="font-semibold py-4">{category.name}</TableCell>
      <TableCell className="py-4 font-semibold">{category.productCount ?? 0}</TableCell>
      <TableCell className="py-4">
        <Badge className="font-semibold" variant={category.active ? 'default' : 'secondary'}>
          {category.active ? 'Aktiv' : 'Inaktiv'}
        </Badge>
      </TableCell>
    </TableRow>
  );
};
