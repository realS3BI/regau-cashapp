import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

const TeamPageSkeleton = () => (
  <div className="min-h-screen flex flex-col bg-background w-full">
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 shadow-sm w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
        <Skeleton className="min-h-[44px] min-w-[44px] rounded-lg shrink-0" />
        <Skeleton className="h-8 flex-1 max-w-[240px]" />
      </div>
    </header>
    <div className="flex-1 flex flex-col lg:flex-row min-h-0 w-full">
      <aside className="hidden lg:block border-r bg-muted/20 shrink-0 w-[280px]">
        <ScrollArea className="h-full min-h-0">
          <div className="p-6 space-y-3">
            <Skeleton className="h-6 w-24 mb-3" />
            <Skeleton className="h-12 w-full rounded-lg" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </ScrollArea>
      </aside>
      <main className="flex-1 min-w-0 p-4 lg:p-6 flex flex-col min-h-0">
        <ScrollArea className="min-h-0 flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pr-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="rounded-xl aspect-[3/4] w-full" />
            ))}
          </div>
        </ScrollArea>
      </main>
      <aside className="hidden lg:block border-l bg-card w-[360px] shrink-0 p-4">
        <div className="space-y-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </aside>
    </div>
  </div>
);

export default TeamPageSkeleton;
