import type { DatePreset } from './types';

const formatDateStr = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getMonday = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const getDatePresetRange = (preset: DatePreset): { from: string; to: string } => {
  const today = new Date();

  switch (preset) {
    case 'today':
      return { from: formatDateStr(today), to: formatDateStr(today) };
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: formatDateStr(yesterday), to: formatDateStr(yesterday) };
    }
    case 'thisWeek': {
      const monday = getMonday(today);
      return { from: formatDateStr(monday), to: formatDateStr(today) };
    }
    case 'lastWeek': {
      const lastMonday = getMonday(today);
      lastMonday.setDate(lastMonday.getDate() - 7);
      const lastSunday = new Date(lastMonday);
      lastSunday.setDate(lastSunday.getDate() + 6);
      return { from: formatDateStr(lastMonday), to: formatDateStr(lastSunday) };
    }
    case 'thisMonth': {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: formatDateStr(firstDay), to: formatDateStr(today) };
    }
    case 'lastMonth': {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from: formatDateStr(firstDayLastMonth), to: formatDateStr(lastDayLastMonth) };
    }
    default:
      return { from: '', to: '' };
  }
};

export const validateDateRange = (
  dateFrom: string,
  dateTo: string
): { error: string | null; isValid: boolean } => {
  if (!dateFrom && !dateTo) return { isValid: true, error: null };

  const fromDate = dateFrom ? new Date(dateFrom) : null;
  const toDate = dateTo ? new Date(dateTo) : null;
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (fromDate && fromDate > today) {
    return { error: 'Von-Datum kann nicht in der Zukunft liegen', isValid: false };
  }
  if (toDate && toDate > today) {
    return { error: 'Bis-Datum kann nicht in der Zukunft liegen', isValid: false };
  }
  if (fromDate && toDate && fromDate > toDate) {
    return { error: 'Von-Datum muss vor dem Bis-Datum liegen', isValid: false };
  }
  return { error: null, isValid: true };
};
