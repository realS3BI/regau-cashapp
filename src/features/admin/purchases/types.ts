export type DatePreset =
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'custom';

export interface DatePresetOption {
  label: string;
  value: DatePreset;
}

export const DATE_PRESETS: DatePresetOption[] = [
  { label: 'Heute', value: 'today' },
  { label: 'Gestern', value: 'yesterday' },
  { label: 'Diese Woche', value: 'thisWeek' },
  { label: 'Letzte Woche', value: 'lastWeek' },
  { label: 'Dieser Monat', value: 'thisMonth' },
  { label: 'Letzter Monat', value: 'lastMonth' },
];

export const INITIAL_PAGE_SIZE = 30;
export const LOAD_MORE_PAGE_SIZE = 50;
export const TABLE_SKELETON_ROWS = 10;
