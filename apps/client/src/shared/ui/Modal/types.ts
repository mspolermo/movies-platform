import type { ReactNode } from 'react';

export type TModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};
