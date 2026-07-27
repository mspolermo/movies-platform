import type { ReactNode } from 'react';

export type TOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
};
