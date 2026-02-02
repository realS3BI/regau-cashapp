import { useState, useCallback, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Id } from '@convex';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { GripVertical, Trash2 } from 'lucide-react';
import type { CategoryItem } from '../types';

interface CategorySortableRowProps {
  category: CategoryItem;
  editMode: boolean;
  onDelete: (id: Id<'categories'>) => void;
  onNameSave: (id: Id<'categories'>, name: string) => void;
}

export const CategorySortableRow = ({
  category,
  editMode,
  onDelete,
  onNameSave,
}: CategorySortableRowProps) => {
  const [editName, setEditName] = useState(category.name);

  useEffect(() => {
    setEditName(category.name);
  }, [category.name]);

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

  const handleNameBlur = useCallback((): void => {
    const trimmed = editName.trim();
    if (trimmed !== category.name && trimmed.length > 0) {
      onNameSave(category._id, trimmed);
    } else {
      setEditName(category.name);
    }
  }, [category._id, category.name, editName, onNameSave]);

  const handleNameKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      if (event.key === 'Enter') {
        (event.target as HTMLInputElement).blur();
      }
    },
    []
  );

  return (
    <TableRow ref={setNodeRef} className="hover:bg-muted/50" style={dragStyle}>
      <TableCell
        className="w-10 py-4"
        {...attributes}
        {...listeners}
        onClick={handleDragHandleClick}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
      </TableCell>
      <TableCell className="font-semibold py-4">
        {editMode ? (
          <Input
            className="min-h-[40px] font-semibold"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          category.name
        )}
      </TableCell>
      <TableCell className="py-4 font-semibold">{category.productCount ?? 0}</TableCell>
      {editMode && (
        <TableCell className="w-12 py-4">
          <Button
            className="min-h-[36px] text-destructive hover:text-destructive"
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(category._id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};
