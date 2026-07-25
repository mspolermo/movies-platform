'use client';

import type { RefCallback } from 'react';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const SCROLL_END_FALLBACK_MS = 150;

const getClosestChildIndex = (el: HTMLDivElement): number => {
  let closest = 0;
  let minDist = Infinity;

  for (let i = 0; i < el.children.length; i += 1) {
    const child = el.children[i] as HTMLElement;
    const dist = Math.abs(child.offsetLeft - el.scrollLeft);

    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  }

  return closest;
};

/** Snap-start: без центрирования — иначе full-width слайды дают субпиксельный drift. */
const getChildScrollLeft = (el: HTMLDivElement, childIndex: number): number | null => {
  const child = el.children[childIndex] as HTMLElement | undefined;
  if (!child) {
    return null;
  }

  return child.offsetLeft;
};

/**
 * Программный scroll. Silent jump: behavior=auto + временно без scroll-snap,
 * иначе snap откатывает позицию обратно на клон.
 */
const scrollToChild = (
  el: HTMLDivElement,
  childIndex: number,
  behavior: 'auto' | 'smooth'
): boolean => {
  const left = getChildScrollLeft(el, childIndex);
  if (left === null) {
    return false;
  }

  if (behavior === 'auto') {
    const prevBehavior = el.style.scrollBehavior;
    const prevSnap = el.style.scrollSnapType;

    el.style.scrollBehavior = 'auto';
    el.style.scrollSnapType = 'none';
    el.scrollLeft = left;
    void el.offsetHeight;
    el.style.scrollSnapType = prevSnap;
    el.style.scrollBehavior = prevBehavior;
    return true;
  }

  el.scrollTo({ left, behavior: 'smooth' });
  return true;
};

export const toLogicalIndex = (domIndex: number, itemCount: number, looping: boolean): number => {
  if (!looping || itemCount < 2) {
    return domIndex;
  }

  if (domIndex <= 0) {
    return itemCount - 1;
  }

  if (domIndex >= itemCount + 1) {
    return 0;
  }

  return domIndex - 1;
};

export const toDomIndex = (logicalIndex: number, itemCount: number, looping: boolean): number => {
  if (!looping || itemCount < 2) {
    return logicalIndex;
  }

  return logicalIndex + 1;
};

export type UseLoopingSlideScrollOptions = {
  itemCount: number;
  /** false до mount — без клонов в DOM, нет SSR-flash последнего баннера. */
  looping?: boolean;
  prefersReducedMotion?: boolean;
};

export type UseLoopingSlideScrollResult = {
  trackRef: RefCallback<HTMLDivElement>;
  activeIndex: number;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollToIndex: (logicalIndex: number) => void;
};

/**
 * Infinite-loop slide scroll: клоны краёв в DOM (виджет) + silent jump после snap.
 */
export const useLoopingSlideScroll = ({
  itemCount,
  looping = itemCount >= 2,
  prefersReducedMotion = false,
}: UseLoopingSlideScrollOptions): UseLoopingSlideScrollResult => {
  const trackElRef = useRef<HTMLDivElement | null>(null);
  const isJumpingRef = useRef(false);
  const didInitLoopRef = useRef(false);
  const [trackEl, setTrackEl] = useState<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLooping = looping && itemCount >= 2;

  const getScrollBehavior = useCallback((): 'auto' | 'smooth' => {
    return prefersReducedMotion ? 'auto' : 'smooth';
  }, [prefersReducedMotion]);

  const updateActiveIndex = useCallback(() => {
    requestAnimationFrame(() => {
      const el = trackElRef.current;
      if (!el || isJumpingRef.current) {
        return;
      }

      setActiveIndex(toLogicalIndex(getClosestChildIndex(el), itemCount, isLooping));
    });
  }, [isLooping, itemCount]);

  const unlockJump = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isJumpingRef.current = false;
        updateActiveIndex();
      });
    });
  }, [updateActiveIndex]);

  const settleLoopPosition = useCallback(() => {
    const el = trackElRef.current;
    if (!el || !isLooping || isJumpingRef.current) {
      return;
    }

    const domIndex = getClosestChildIndex(el);
    let targetDom: number | null = null;

    if (domIndex === 0) {
      targetDom = itemCount;
    } else if (domIndex === itemCount + 1) {
      targetDom = 1;
    }

    if (targetDom === null) {
      setActiveIndex(toLogicalIndex(domIndex, itemCount, isLooping));
      return;
    }

    isJumpingRef.current = true;
    scrollToChild(el, targetDom, 'auto');
    setActiveIndex(toLogicalIndex(targetDom, itemCount, isLooping));
    unlockJump();
  }, [isLooping, itemCount, unlockJump]);

  const trackRef = useCallback((node: HTMLDivElement | null) => {
    trackElRef.current = node;
    setTrackEl(node);
  }, []);

  useLayoutEffect(() => {
    didInitLoopRef.current = false;
  }, [itemCount, isLooping]);

  useLayoutEffect(() => {
    const el = trackEl;
    if (!el) {
      return;
    }

    if (isLooping && !didInitLoopRef.current && el.children.length >= itemCount + 2) {
      didInitLoopRef.current = true;
      isJumpingRef.current = true;
      scrollToChild(el, 1, 'auto');
      setActiveIndex(0);
      unlockJump();
      return;
    }

    updateActiveIndex();
  }, [isLooping, itemCount, trackEl, unlockJump, updateActiveIndex]);

  useLayoutEffect(() => {
    const el = trackEl;
    if (!el) {
      return undefined;
    }

    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    const handleScroll = () => {
      if (isJumpingRef.current) {
        return;
      }

      updateActiveIndex();

      if (!isLooping) {
        return;
      }

      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }

      fallbackTimer = setTimeout(() => {
        fallbackTimer = undefined;
        settleLoopPosition();
      }, SCROLL_END_FALLBACK_MS);
    };

    const handleScrollEnd = () => {
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = undefined;
      }

      settleLoopPosition();
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    el.addEventListener('scrollend', handleScrollEnd);
    window.addEventListener('resize', updateActiveIndex);

    const observer = new ResizeObserver(updateActiveIndex);
    observer.observe(el);

    return () => {
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }

      el.removeEventListener('scroll', handleScroll);
      el.removeEventListener('scrollend', handleScrollEnd);
      window.removeEventListener('resize', updateActiveIndex);
      observer.disconnect();
    };
  }, [isLooping, settleLoopPosition, trackEl, updateActiveIndex]);

  const scrollToDomIndex = useCallback((domIndex: number, behavior: 'auto' | 'smooth') => {
    const el = trackElRef.current;
    if (!el || domIndex < 0 || domIndex >= el.children.length) {
      return;
    }

    scrollToChild(el, domIndex, behavior);
  }, []);

  const scrollToIndex = useCallback(
    (logicalIndex: number) => {
      if (logicalIndex < 0 || logicalIndex >= itemCount) {
        return;
      }

      scrollToDomIndex(toDomIndex(logicalIndex, itemCount, isLooping), getScrollBehavior());
    },
    [getScrollBehavior, isLooping, itemCount, scrollToDomIndex]
  );

  const scrollPrev = useCallback(() => {
    const el = trackElRef.current;
    if (!el || isJumpingRef.current) {
      return;
    }

    scrollToDomIndex(getClosestChildIndex(el) - 1, getScrollBehavior());
  }, [getScrollBehavior, scrollToDomIndex]);

  const scrollNext = useCallback(() => {
    const el = trackElRef.current;
    if (!el || isJumpingRef.current) {
      return;
    }

    scrollToDomIndex(getClosestChildIndex(el) + 1, getScrollBehavior());
  }, [getScrollBehavior, scrollToDomIndex]);

  return {
    trackRef,
    activeIndex,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  };
};
