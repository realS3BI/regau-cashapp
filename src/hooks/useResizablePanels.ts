import { useCallback, useEffect, useState } from 'react';

const CATEGORY_WIDTH_KEY = 'regau-cashapp-category-width';
const CART_WIDTH_KEY = 'regau-cashapp-cart-width';
const CATEGORY_DEFAULT = 280;
const CART_DEFAULT = 360;
const MIN_PANEL = 220;
const MAX_PANEL = 500;

const getStoredWidth = (key: string, defaultVal: number): number => {
  try {
    const v = sessionStorage.getItem(key);
    if (v != null) {
      const n = parseInt(v, 10);
      if (!Number.isNaN(n) && n >= MIN_PANEL && n <= MAX_PANEL) return n;
    }
  } catch {
    // ignore
  }
  return defaultVal;
};

export const useResizablePanels = () => {
  const [cartWidth, setCartWidth] = useState(() => getStoredWidth(CART_WIDTH_KEY, CART_DEFAULT));
  const [categoryWidth, setCategoryWidth] = useState(() =>
    getStoredWidth(CATEGORY_WIDTH_KEY, CATEGORY_DEFAULT)
  );
  const [resizing, setResizing] = useState<'cart' | 'category' | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (resizing === 'category') {
        const w = Math.min(MAX_PANEL, Math.max(MIN_PANEL, e.clientX));
        setCategoryWidth(w);
      } else if (resizing === 'cart') {
        const w = Math.min(MAX_PANEL, Math.max(MIN_PANEL, window.innerWidth - e.clientX));
        setCartWidth(w);
      }
    },
    [resizing]
  );

  const handleMouseUp = useCallback(() => {
    setResizing(null);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (resizing == null) return;
      e.preventDefault();
      const clientX = e.touches[0].clientX;
      if (resizing === 'category') {
        const w = Math.min(MAX_PANEL, Math.max(MIN_PANEL, clientX));
        setCategoryWidth(w);
      } else if (resizing === 'cart') {
        const w = Math.min(MAX_PANEL, Math.max(MIN_PANEL, window.innerWidth - clientX));
        setCartWidth(w);
      }
    },
    [resizing]
  );

  const handleTouchEnd = useCallback(() => {
    setResizing(null);
  }, []);

  useEffect(() => {
    if (resizing == null) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [resizing, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    sessionStorage.setItem(CATEGORY_WIDTH_KEY, String(categoryWidth));
  }, [categoryWidth]);

  useEffect(() => {
    sessionStorage.setItem(CART_WIDTH_KEY, String(cartWidth));
  }, [cartWidth]);

  return {
    cartWidth,
    categoryWidth,
    setResizing,
  };
};
