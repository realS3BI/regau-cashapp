import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DatePreset, DatePresetOption } from '../types';
import { DATE_PRESETS } from '../types';

interface PurchaseDateFiltersProps {
  activePreset: DatePreset | null;
  dateValidation: { error: string | null; isValid: boolean };
  filterDateFrom: string;
  filterDateTo: string;
  hasDateFilter: boolean;
  todayStr: string;
  onClearFilters: () => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onPresetClick: (preset: DatePreset) => void;
}

export const PurchaseDateFilters = ({
  activePreset,
  dateValidation,
  filterDateFrom,
  filterDateTo,
  hasDateFilter,
  onClearFilters,
  onDateFromChange,
  onDateToChange,
  onPresetClick,
  todayStr,
}: PurchaseDateFiltersProps) => {
  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-semibold">Schnellauswahl</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {DATE_PRESETS.map((preset: DatePresetOption) => (
            <Button
              className="h-9"
              key={preset.value}
              size="sm"
              variant={activePreset === preset.value ? 'default' : 'outline'}
              onClick={() => onPresetClick(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
          {hasDateFilter && (
            <Button
              className="h-9 text-muted-foreground"
              size="sm"
              variant="ghost"
              onClick={onClearFilters}
            >
              <X className="h-4 w-4 mr-1" />
              Zurücksetzen
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Von</Label>
          <Input
            className={`min-h-[44px] w-full sm:w-auto ${
              !dateValidation.isValid && filterDateFrom
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
            }`}
            max={filterDateTo || todayStr}
            type="date"
            value={filterDateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Bis</Label>
          <Input
            className={`min-h-[44px] w-full sm:w-auto ${
              !dateValidation.isValid && filterDateTo
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
            }`}
            max={todayStr}
            min={filterDateFrom || undefined}
            type="date"
            value={filterDateTo}
            onChange={(e) => onDateToChange(e.target.value)}
          />
        </div>
      </div>

      {dateValidation.error && (
        <p className="text-sm text-destructive font-medium">{dateValidation.error}</p>
      )}
    </>
  );
};
