'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Закрытие по mousedown вне элемента ref (например, открытые дропдауны).
 */
export const useCloseOnOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  isActive: boolean,
  onClose: () => void
) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isActive) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onCloseRef.current();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isActive, ref]);
};
