import { useEffect, useState } from 'react';

/**
 * Отслеживает системную настройку prefers-reduced-motion.
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    const listener = () => setPrefersReducedMotion(media.matches);

    listener();
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
};
