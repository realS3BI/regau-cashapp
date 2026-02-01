import { ReactNode } from 'react';

interface MobileCartProps {
  children: ReactNode;
}

export const MobileCart = ({ children }: MobileCartProps) => {
  return <div className="lg:hidden border-t bg-card p-4 shrink-0">{children}</div>;
};
