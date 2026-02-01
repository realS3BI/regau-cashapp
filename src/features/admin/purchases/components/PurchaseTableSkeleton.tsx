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
import { TABLE_SKELETON_ROWS } from '../types';

export const PurchaseTableSkeleton = () => {
  return (
    <Card className="shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-14 font-bold">Datum</TableHead>
            <TableHead className="h-14 font-bold">Uhrzeit</TableHead>
            <TableHead className="h-14 font-bold">Team</TableHead>
            <TableHead className="h-14 font-bold">Artikel</TableHead>
            <TableHead className="h-14 font-bold">Gesamtbetrag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: TABLE_SKELETON_ROWS }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell className="py-4">
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-5 w-16" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-5 w-28" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-5 w-20" />
              </TableCell>
              <TableCell className="py-4">
                <Skeleton className="h-5 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
