import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';

interface CartCheckoutButtonProps {
  disabled: boolean;
  total: number;
  onCheckout: () => void;
}

export const CartCheckoutButton = ({ disabled, onCheckout, total }: CartCheckoutButtonProps) => {
  return (
    <div className="shrink-0 border-t bg-muted/30 p-6">
      <Button
        className="min-h-[52px] w-full text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
        disabled={disabled}
        onClick={onCheckout}
      >
        Bezahlen ({formatCurrency(total)})
      </Button>
    </div>
  );
};
