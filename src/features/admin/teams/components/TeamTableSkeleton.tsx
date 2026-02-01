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

export const TeamTableSkeleton = () => {
  return (
    <Card className="shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-14 font-bold">Name</TableHead>
            <TableHead className="h-14 font-bold">Slug</TableHead>
            <TableHead className="h-14 font-bold">Sichtbar</TableHead>
            <TableHead className="h-14 font-bold">Gelöscht</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell className="py-4">
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-5 w-24 font-mono" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-6 w-20 rounded-full" />
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
