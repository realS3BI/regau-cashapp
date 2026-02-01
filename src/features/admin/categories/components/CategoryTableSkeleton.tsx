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

export const CategoryTableSkeleton = () => {
  return (
    <Card className="shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-14 w-10" />
            <TableHead className="h-14 w-12" />
            <TableHead className="h-14 font-bold">Name</TableHead>
            <TableHead className="h-14 font-bold">Produkte</TableHead>
            <TableHead className="h-14 font-bold">Aktiv</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell className="py-4">
                <Skeleton className="h-5 w-5" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-5 w-5" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-5 w-12" />
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
