import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const ProductTableSkeleton = () => {
  return (
    <Card className="shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-14 w-12" />
            <TableHead className="h-14 font-bold">Name</TableHead>
            <TableHead className="h-14 font-bold">Kategorie</TableHead>
            <TableHead className="h-14 font-bold">Preis A</TableHead>
            <TableHead className="h-14 font-bold">Preis B</TableHead>
            <TableHead className="h-14 w-12 font-bold text-center">Favorit</TableHead>
            <TableHead className="h-14 font-bold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell className="py-4">
                <Skeleton className="h-5 w-5" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-5 w-16" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-5 w-16" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-9 w-9 rounded-full mx-auto" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
