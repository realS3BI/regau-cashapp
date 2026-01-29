type ResizableDividerProps = {
  'aria-label': string;
  onResizeStart: () => void;
};

const ResizableDivider = ({ 'aria-label': ariaLabel, onResizeStart }: ResizableDividerProps) => (
  <div
    aria-label={ariaLabel}
    className="hidden lg:block w-1 shrink-0 bg-border cursor-col-resize hover:bg-primary/30 transition-colors touch-none"
    onMouseDown={onResizeStart}
    onTouchStart={onResizeStart}
    role="separator"
  />
);

export default ResizableDivider;
