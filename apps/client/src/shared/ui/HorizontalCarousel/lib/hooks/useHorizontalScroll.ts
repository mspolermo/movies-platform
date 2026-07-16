'use client';

import type { RefCallback } from 'react';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export type TScrollStep = 'page' | number;

const SCROLL_TOLERANCE = 1;
const PAGE_SCROLL_RATIO = 0.8;

const resolveScrollStep = (track: HTMLDivElement, scrollStep: TScrollStep): number => {
  if (scrollStep === 'page') {
    return track.clientWidth * PAGE_SCROLL_RATIO;
  }

  return scrollStep;
};

export type UseHorizontalScrollOptions = {
  scrollStep?: TScrollStep;
};

export type UseHorizontalScrollResult = {
  trackRef: RefCallback<HTMLDivElement>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollToIndex: (index: number) => void;
};

/**
 * Хук горизонтальной прокрутки: метрики overflow и методы scroll.
 * Без UI-состояния (hover, стрелки).
 */
export const useHorizontalScroll = ({
  scrollStep = 'page',
}: UseHorizontalScrollOptions = {}): UseHorizontalScrollResult => {
  const trackElRef = useRef<HTMLDivElement | null>(null);
  const [trackEl, setTrackEl] = useState<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const getScrollBehavior = useCallback((): 'auto' | 'smooth' => {
    return prefersReducedMotion ? 'auto' : 'smooth';
  }, [prefersReducedMotion]);

  const updateMetrics = useCallback(() => {
    requestAnimationFrame(() => {
      const el = trackElRef.current;
      if (!el) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }

      const { scrollLeft, scrollWidth, clientWidth } = el;
      const canScroll = scrollWidth > clientWidth;

      setCanScrollLeft(canScroll && scrollLeft > SCROLL_TOLERANCE);
      setCanScrollRight(canScroll && scrollLeft < scrollWidth - clientWidth - SCROLL_TOLERANCE);
    });
  }, []);

  const trackRef = useCallback((node: HTMLDivElement | null) => {
    trackElRef.current = node;
    setTrackEl(node);
  }, []);

  useLayoutEffect(() => {
    updateMetrics();
  }, [trackEl, updateMetrics]);

  useLayoutEffect(() => {
    const el = trackEl;
    if (!el) {
      return undefined;
    }

    el.addEventListener('scroll', updateMetrics);
    window.addEventListener('resize', updateMetrics);

    const observer = new ResizeObserver(updateMetrics);
    observer.observe(el);

    return () => {
      el.removeEventListener('scroll', updateMetrics);
      window.removeEventListener('resize', updateMetrics);
      observer.disconnect();
    };
  }, [trackEl, updateMetrics]);

  const scrollPrev = useCallback(() => {
    const el = trackElRef.current;
    if (!el) {
      return;
    }

    const step = resolveScrollStep(el, scrollStep);
    el.scrollBy({ left: -step, behavior: getScrollBehavior() });
  }, [getScrollBehavior, scrollStep]);

  const scrollNext = useCallback(() => {
    const el = trackElRef.current;
    if (!el) {
      return;
    }

    const step = resolveScrollStep(el, scrollStep);
    el.scrollBy({ left: step, behavior: getScrollBehavior() });
  }, [getScrollBehavior, scrollStep]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = trackElRef.current;
      if (!el || index < 0) {
        return;
      }

      const child = el.children[index] as HTMLElement | undefined;
      if (!child) {
        return;
      }

      const containerWidth = el.clientWidth;
      const target = child.offsetLeft - containerWidth / 2 + child.offsetWidth / 2;

      el.scrollTo({ left: target, behavior: getScrollBehavior() });
    },
    [getScrollBehavior]
  );

  return {
    trackRef,
    canScrollLeft,
    canScrollRight,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  };
};
