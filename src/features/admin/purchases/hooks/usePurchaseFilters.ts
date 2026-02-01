import { useState, useCallback, useMemo } from 'react';
import { Id } from '@convex';
import { getDatePresetRange, validateDateRange } from '../utils';
import type { DatePreset } from '../types';

export const usePurchaseFilters = () => {
  const [activePreset, setActivePreset] = useState<DatePreset | null>(null);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterTeamId, setFilterTeamId] = useState('');

  const dateValidation = useMemo(
    () => validateDateRange(filterDateFrom, filterDateTo),
    [filterDateFrom, filterDateTo]
  );

  const handlePresetClick = useCallback((preset: DatePreset): void => {
    const { from, to } = getDatePresetRange(preset);
    setActivePreset(preset);
    setFilterDateFrom(from);
    setFilterDateTo(to);
  }, []);

  const handleClearFilters = useCallback((): void => {
    setActivePreset(null);
    setFilterDateFrom('');
    setFilterDateTo('');
  }, []);

  const handleDateFromChange = useCallback((value: string): void => {
    setActivePreset(null);
    setFilterDateFrom(value);
  }, []);

  const handleDateToChange = useCallback((value: string): void => {
    setActivePreset(null);
    setFilterDateTo(value);
  }, []);

  const filterOpts = useMemo(() => {
    if (!dateValidation.isValid) {
      return {
        dateFrom: undefined,
        dateTo: undefined,
        teamId: filterTeamId ? (filterTeamId as Id<'teams'>) : undefined,
      };
    }
    const from = filterDateFrom ? new Date(filterDateFrom).setHours(0, 0, 0, 0) : undefined;
    const to = filterDateTo ? new Date(filterDateTo).setHours(23, 59, 59, 999) : undefined;
    return {
      dateFrom: from,
      dateTo: to,
      teamId: filterTeamId ? (filterTeamId as Id<'teams'>) : undefined,
    };
  }, [dateValidation.isValid, filterDateFrom, filterDateTo, filterTeamId]);

  const hasDateFilter = Boolean(filterDateFrom || filterDateTo);

  return {
    activePreset,
    dateValidation,
    filterDateFrom,
    filterDateTo,
    filterOpts,
    filterTeamId,
    hasDateFilter,
    handleClearFilters,
    handleDateFromChange,
    handleDateToChange,
    handlePresetClick,
    setFilterTeamId,
  };
};
