import { toast as sonnerToast } from 'sonner';

const showSuccessToast = (description: string, title = 'Erfolgreich'): void => {
  sonnerToast.success(title, { description });
};

const showErrorToast = (error: unknown, defaultMessage: string, title = 'Fehler'): void => {
  const message = error instanceof Error ? error.message : defaultMessage;
  sonnerToast.error(title, { description: message });
};

export const toast = {
  error: showErrorToast,
  success: showSuccessToast,
};
