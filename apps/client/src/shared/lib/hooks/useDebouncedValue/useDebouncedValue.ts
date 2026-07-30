'use client';

import { useEffect, useState } from 'react';

/**
 * Значение с задержкой обновления (debounce).
 * Пока `value` меняется чаще `delayMs`, наружу остаётся предыдущее debounced.
 */
export const useDebouncedValue = <T>(value: T, delayMs: number): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debounced;
};
