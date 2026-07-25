'use client';

import { useEffect, useRef, useState } from 'react';

const DEFAULT_AUTOPLAY_MS = 5000;

export type UseCarouselAutoplayOptions = {
  enabled: boolean;
  intervalMs?: number;
  paused?: boolean;
  /** Смена ключа перезапускает таймер (user navigation). */
  resetKey?: number;
  onTick: () => void;
};

/**
 * Автопрокрутка. Пауза при paused / disabled / скрытой вкладке.
 * Таймер сбрасывается при смене paused→false и при resetKey.
 */
export const useCarouselAutoplay = ({
  enabled,
  intervalMs = DEFAULT_AUTOPLAY_MS,
  paused = false,
  resetKey = 0,
  onTick,
}: UseCarouselAutoplayOptions): void => {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const [isDocumentHidden, setIsDocumentHidden] = useState(false);

  useEffect(() => {
    const syncVisibility = () => {
      setIsDocumentHidden(document.visibilityState === 'hidden');
    };

    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);

    return () => {
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!enabled || paused || isDocumentHidden || intervalMs <= 0) {
      return undefined;
    }

    let timeoutId = window.setTimeout(function tick() {
      onTickRef.current();
      timeoutId = window.setTimeout(tick, intervalMs);
    }, intervalMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled, intervalMs, isDocumentHidden, paused, resetKey]);
};

export { DEFAULT_AUTOPLAY_MS };
