import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboardSkeleton = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
          <Skeleton className="h-9 w-48" />
        </div>
        <Skeleton className="h-11 w-28 rounded-lg" />
      </div>
    </header>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-10">
        <Skeleton className="h-12 w-full rounded-lg md:hidden" />
        <div className="hidden md:block mt-2">
          <div className="flex gap-2 p-2 rounded-lg bg-muted/50">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-11 flex-1 rounded-md" />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-10 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

export default AdminDashboardSkeleton;
