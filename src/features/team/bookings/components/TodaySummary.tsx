import { formatCurrency } from '@/lib/format';

interface TodaySummaryProps {
  total: number | undefined;
}

export const TodaySummary = ({ total }: TodaySummaryProps) => {
  return (
    <div className="mt-4 rounded-lg border bg-muted/30 p-3">
      <p className="text-muted-foreground text-xs">Alle Buchungen von heute</p>
      <p className="text-lg font-semibold text-primary">
        {total === undefined ? '…' : formatCurrency(total)}
      </p>
    </div>
  );
};
