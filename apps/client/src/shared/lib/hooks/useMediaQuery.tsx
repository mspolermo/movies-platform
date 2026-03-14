'use client';

import { useEffect, useState } from 'react';

/**
 * Хук для отслеживания соответствия CSS media query.
 *
 * Использует window.matchMedia и обновляет состояние при изменении
 * размера окна или условий media query.
 *
 * @param query CSS media query строка (например: '(max-width: 768px)')
 * @returns true если media query совпадает, иначе false
 */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = () => setMatches(media.matches);

    listener();
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};