import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PurchaseDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const PurchaseDeleteDialog = ({ isOpen, onClose, onConfirm }: PurchaseDeleteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kauf löschen</AlertDialogTitle>
          <AlertDialogDescription>Diese Buchung wirklich löschen?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >
            Löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
