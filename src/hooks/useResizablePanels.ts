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

const getStoredWidth = (
  storageKey: string,
  defaultValue: number,
  minWidth: number,
  maxWidth: number
): number => {
  try {
    const storedValue = sessionStorage.getItem(storageKey);
    if (storedValue != null) {
      const parsedValue = parseInt(storedValue, 10);
      if (!Number.isNaN(parsedValue) && parsedValue >= minWidth && parsedValue <= maxWidth) {
        return parsedValue;
      }
    }
  } catch {
    // SessionStorage access failed, use default
  }
  return defaultValue;
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
    (event: MouseEvent): void => {
      if (!isResizing) return;
      const rawWidth = side === 'left' ? event.clientX : window.innerWidth - event.clientX;
      const clampedWidth = Math.min(maxWidth, Math.max(minWidth, rawWidth));
      setWidth(clampedWidth);
    },
    [isResizing, maxWidth, minWidth, side]
  );

  const handleMouseUp = useCallback((): void => {
    setIsResizing(false);
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent): void => {
      if (!isResizing) return;
      event.preventDefault();
      const clientX = event.touches[0].clientX;
      const rawWidth = side === 'left' ? clientX : window.innerWidth - clientX;
      const clampedWidth = Math.min(maxWidth, Math.max(minWidth, rawWidth));
      setWidth(clampedWidth);
    },
    [isResizing, maxWidth, minWidth, side]
  );

  const handleTouchEnd = useCallback((): void => {
    setIsResizing(false);
  }, []);

  const startResize = useCallback((): void => {
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
