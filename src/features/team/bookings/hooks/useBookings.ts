import { useMemo } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api, Id } from '@convex';

const FIVE_MINUTES_MS = 5 * 60 * 1000;

const getStartOfTodayMs = (): number => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const canDeletePurchase = (createdAt: number): boolean => {
  return Date.now() - createdAt < FIVE_MINUTES_MS;
};

export const useBookings = (teamId: Id<'teams'>, isOpen: boolean) => {
  const todayRange = useMemo(() => {
    if (!isOpen) return null;
    return {
      endMs: Date.now(),
      startMs: getStartOfTodayMs(),
    };
  }, [isOpen]);

  const recentPurchases = useQuery(
    api.purchases.getRecentByTeam,
    isOpen ? { limit: 20, teamId } : 'skip'
  );
  const todayPurchases = useQuery(
    api.purchases.getPurchasesByTeamInRange,
    isOpen && todayRange ? { ...todayRange, teamId } : 'skip'
  );
  const removePurchase = useMutation(api.purchases.remove);

  const todayTotal = useMemo(() => {
    if (todayPurchases === undefined) return 0;
    return todayPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
  }, [todayPurchases]);

  const productSalesToday = useMemo(() => {
    if (todayPurchases === undefined) return [];
    const byName: Record<string, number> = {};
    for (const p of todayPurchases) {
      for (const item of p.items) {
        byName[item.name] = (byName[item.name] ?? 0) + item.quantity;
      }
    }
    return Object.entries(byName)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [todayPurchases]);

  return {
    productSalesToday,
    recentPurchases,
    removePurchase,
    todayPurchases,
    todayTotal,
  };
};
