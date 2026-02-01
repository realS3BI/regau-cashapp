import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export const CategoryEmptyState = () => {
  return (
    <Card className="shadow-md">
      <CardContent className="py-16 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-2">
          <Plus className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-lg font-medium">Keine Kategorien gefunden</p>
      </CardContent>
    </Card>
  );
};
