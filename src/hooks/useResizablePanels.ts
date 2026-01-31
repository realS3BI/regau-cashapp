import { useCallback, useEffect, useState } from 'react';

const DEFAULT_MAX = 500;
const DEFAULT_MIN = 220;

export type UseResizablePanelsOptions = {
  defaultWidth: number;
  maxWidth?: number;
  minWidth?: number;
  side: 'left' | 'right';
  storageKey: string;
};

const getStoredWidth = (key: string, defaultVal: number, min: number, max: number): number => {
  try {
    const v = sessionStorage.getItem(key);
    if (v != null) {
      const n = parseInt(v, 10);
      if (!Number.isNaN(n) && n >= min && n <= max) return n;
    }
  } catch {
    // ignore
  }
  return defaultVal;
};

export const useResizablePanels = (options: UseResizablePanelsOptions) => {
  const {
    defaultWidth,
    maxWidth = DEFAULT_MAX,
    minWidth = DEFAULT_MIN,
    side,
    storageKey,
  } = options;

  const [width, setWidth] = useState(() =>
    getStoredWidth(storageKey, defaultWidth, minWidth, maxWidth)
  );
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const raw = side === 'left' ? e.clientX : window.innerWidth - e.clientX;
      const w = Math.min(maxWidth, Math.max(minWidth, raw));
      setWidth(w);
    },
    [isResizing, maxWidth, minWidth, side]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isResizing) return;
      e.preventDefault();
      const clientX = e.touches[0].clientX;
      const raw = side === 'left' ? clientX : window.innerWidth - clientX;
      const w = Math.min(maxWidth, Math.max(minWidth, raw));
      setWidth(w);
    },
    [isResizing, maxWidth, minWidth, side]
  );

  const handleTouchEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  const startResize = useCallback(() => {
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;
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
  }, [isResizing, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    sessionStorage.setItem(storageKey, String(width));
  }, [storageKey, width]);

  return { startResize, width };
};
