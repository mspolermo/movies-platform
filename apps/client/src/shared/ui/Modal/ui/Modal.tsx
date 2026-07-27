'use client';

import type { TModalProps } from '../model';

import cn from 'classnames';
import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Overlay } from '@/shared/ui/Overlay';
import { SvgIcon } from '@/shared/ui/SvgIcon';

import { useModalFocusTrap } from '../lib';
import styles from './Modal.module.scss';

/**
 * Переиспользуемая модалка: Overlay + portal в body, слоты title/footer, крестик.
 * Focus trap + restore focus на элемент, с которого открыли.
 */
export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  footer,
  showCloseButton = true,
  closeOnEsc = true,
  closeOnBackdrop = true,
  className,
  contentClassName,
  overlayClassName,
  headerClassName,
  titleClassName,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledbyProp,
}: TModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const ariaLabelledby = ariaLabelledbyProp ?? (title ? titleId : undefined);

  useModalFocusTrap(isOpen, panelRef);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <Overlay
      className={overlayClassName}
      closeOnBackdrop={closeOnBackdrop}
      closeOnEsc={closeOnEsc}
      contentClassName={contentClassName}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div
        ref={panelRef}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-modal="true"
        className={cn(styles.panel, className)}
        role="dialog"
        tabIndex={-1}
      >
        {(title || showCloseButton) && (
          <div className={cn(styles.header, headerClassName)}>
            {title ? (
              <h2 className={cn(styles.title, titleClassName)} id={titleId}>
                {title}
              </h2>
            ) : (
              <span />
            )}
            {showCloseButton && (
              <button
                aria-label="Закрыть"
                className={styles.closeButton}
                type="button"
                onClick={onClose}
              >
                <SvgIcon icon="close" size={24} />
              </button>
            )}
          </div>
        )}

        <div className={styles.body}>{children}</div>

        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </Overlay>,
    document.body
  );
};
