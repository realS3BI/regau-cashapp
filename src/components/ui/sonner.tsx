import * as React from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { CircleCheck, Info, Loader2, OctagonX, TriangleAlert } from 'lucide-react';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      theme="dark"
      icons={{
        error: <OctagonX className="size-4" />,
        info: <Info className="size-4" />,
        loading: <Loader2 className="size-4 animate-spin" />,
        success: <CircleCheck className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
      }}
      style={
        {
          '--border-radius': 'var(--radius)',
          '--normal-bg': 'var(--popover)',
          '--normal-border': 'var(--border)',
          '--normal-text': 'var(--popover-foreground)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
