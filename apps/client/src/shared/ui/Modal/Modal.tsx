'use client';

import type { TModalProps } from './types';

import cn from 'classnames';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Overlay } from '../Overlay';
import { SvgIcon } from '../SvgIcon';
import styles from './Modal.module.scss';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

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

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    panel.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
      );

      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || active === panel) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

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
