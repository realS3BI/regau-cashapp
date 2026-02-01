import { useRef, useState, useEffect, useCallback } from 'react';
import { Id } from '@convex';

export const useAddToCartFeedback = () => {
  const [lastAddedProductId, setLastAddedProductId] = useState<Id<'products'> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showFeedback = useCallback((productId: Id<'products'>): void => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLastAddedProductId(productId);
    timeoutRef.current = setTimeout(() => {
      setLastAddedProductId(null);
      timeoutRef.current = null;
    }, 500);
  }, []);

  return {
    lastAddedProductId,
    showFeedback,
  };
};
