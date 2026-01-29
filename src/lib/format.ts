/**
 * Formatiert einen Betrag in Cent als Euro (z.B. 499 → "4,99 €").
 * Alle Preise und Beträge werden in der App in Cent gespeichert.
 */
export const formatCurrency = (amountInCents: number) => {
  return new Intl.NumberFormat('de-DE', {
    currency: 'EUR',
    style: 'currency'
  }).format(amountInCents / 100);
};
  
export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatDateTime = (date: Date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};
