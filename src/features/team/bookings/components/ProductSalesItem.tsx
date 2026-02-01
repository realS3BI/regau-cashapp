interface ProductSalesItemProps {
  name: string;
  quantity: number;
}

export const ProductSalesItem = ({ name, quantity }: ProductSalesItemProps) => {
  return (
    <li className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2">
      <span className="text-sm font-medium">{name}</span>
      <span className="text-sm font-semibold text-primary">{quantity}×</span>
    </li>
  );
};
