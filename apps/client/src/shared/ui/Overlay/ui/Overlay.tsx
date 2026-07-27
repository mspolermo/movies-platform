'use client';

import type { TOverlayProps } from '../model';

import cn from 'classnames';

import { useOverlayEscape, useOverlayScrollLock } from '../lib';
import styles from './Overlay.module.scss';

export const Overlay = ({
  isOpen,
  onClose,
  children,
  className,
  contentClassName,
  closeOnEsc = true,
  closeOnBackdrop = true,
}: TOverlayProps) => {
  useOverlayEscape(isOpen, closeOnEsc, onClose);
  useOverlayScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className={cn(styles.overlay, className)}
      role="presentation"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div className={cn(styles.content, contentClassName)} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
