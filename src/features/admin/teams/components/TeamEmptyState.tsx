import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface TeamEmptyStateProps {
  onCreateClick: () => void;
}

export const TeamEmptyState = ({ onCreateClick }: TeamEmptyStateProps) => {
  return (
    <Card className="shadow-md">
      <CardContent className="py-16 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-2">
          <Plus className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-lg font-medium">Noch keine Teams vorhanden</p>
        <Button className="min-h-[44px] font-semibold gap-2" onClick={onCreateClick}>
          <Plus className="h-5 w-5" />
          Team erstellen
        </Button>
      </CardContent>
    </Card>
  );
};
