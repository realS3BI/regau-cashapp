import { Checkbox } from '@/components/ui/checkbox';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check } from 'lucide-react';

interface ProductTableHeaderProps {
  activeTemplate: 'A' | 'B';
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
}

export const ProductTableHeader = ({
  activeTemplate,
  isAllSelected,
  onToggleSelectAll,
}: ProductTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        <TableHead className="h-14 w-12">
          <Checkbox
            checked={isAllSelected}
            className="h-5 w-5"
            onCheckedChange={onToggleSelectAll}
          />
        </TableHead>
        <TableHead className="h-14 font-bold">Name</TableHead>
        <TableHead className="h-14 font-bold">Kategorie</TableHead>
        <TableHead
          className={`h-14 font-bold ${activeTemplate === 'A' ? 'bg-primary/10 text-primary' : ''}`}
        >
          <span className="flex items-center gap-1.5">
            Preis A{activeTemplate === 'A' && <Check aria-hidden className="h-4 w-4" />}
          </span>
        </TableHead>
        <TableHead
          className={`h-14 font-bold ${activeTemplate === 'B' ? 'bg-primary/10 text-primary' : ''}`}
        >
          <span className="flex items-center gap-1.5">
            Preis B{activeTemplate === 'B' && <Check aria-hidden className="h-4 w-4" />}
          </span>
        </TableHead>
        <TableHead className="h-14 w-12 font-bold text-center">Favorit</TableHead>
        <TableHead className="h-14 font-bold">Status</TableHead>
      </TableRow>
    </TableHeader>
  );
};
