import { useEffect } from 'react';

export const useOverlayEscape = (isOpen: boolean, closeOnEsc: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEsc, onClose]);
};
