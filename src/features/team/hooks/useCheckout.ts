import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api, Id } from '@convex';
import { toast } from '@/lib/toast';
import { formatCurrency } from '@/lib/format';
import type { CartItem } from '@/hooks/useCart';

interface UseCheckoutParams {
  clearCart: () => void;
  getTotal: () => number;
  items: CartItem[];
  teamId: Id<'teams'>;
}

export const useCheckout = ({ clearCart, getTotal, items, teamId }: UseCheckoutParams) => {
  const checkout = useMutation(api.purchases.create);

  const handleCheckout = useCallback(async (): Promise<void> => {
    if (items.length === 0) return;

    try {
      const totalAmount = getTotal();
      await checkout({
        items: items.map((item) => ({
          name: item.name,
          price: item.price,
          productId: item.productId,
          quantity: item.quantity,
        })),
        teamId,
        totalAmount,
      });

      clearCart();
      toast.success(`Kauf abgeschlossen – ${formatCurrency(totalAmount)}`);
    } catch (error) {
      toast.error(error, 'Beim Bezahlen ist ein Fehler aufgetreten');
    }
  }, [checkout, clearCart, getTotal, items, teamId]);

  return { handleCheckout };
};
