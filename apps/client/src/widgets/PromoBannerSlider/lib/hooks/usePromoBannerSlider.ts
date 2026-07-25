'use client';

import type { FocusEvent, RefCallback } from 'react';

import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { useMediaQuery } from '@/shared/lib';

import { DEFAULT_AUTOPLAY_MS, useCarouselAutoplay } from './useCarouselAutoplay';
import { useLoopingSlideScroll } from './useLoopingSlideScroll';
import { PROMO_BANNERS, type TPromoBanner } from '../../model';

export type TPromoTrackSlide = {
  key: string;
  banner: TPromoBanner;
  isClone: boolean;
  priority: boolean;
};

export type UsePromoBannerSliderResult = {
  trackRef: RefCallback<HTMLDivElement>;
  trackSlides: TPromoTrackSlide[];
  banners: typeof PROMO_BANNERS;
  itemCount: number;
  activeIndex: number;
  showPagination: boolean;
  scrollToIndex: (logicalIndex: number) => void;
  handlePointerEnter: () => void;
  handlePointerLeave: () => void;
  handlePointerDown: () => void;
  handlePointerUp: () => void;
  handleFocusCapture: () => void;
  handleBlurCapture: (event: FocusEvent<HTMLDivElement>) => void;
};

/**
 * Оркестрация промо-слайдера: loop-scroll, autoplay, pause on hover/touch/focus/visibility.
 * Навигация — свайп/drag по треку + точки; стрелок нет.
 * Клоны только после mount — SSR/first paint показывает banner0, не клон последнего.
 */
export const usePromoBannerSlider = (): UsePromoBannerSliderResult => {
  const banners = PROMO_BANNERS;
  const itemCount = banners.length;
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [isMounted, setIsMounted] = useState(false);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isFocusInside, setIsFocusInside] = useState(false);
  const [autoplayResetKey, setAutoplayResetKey] = useState(0);

  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  const looping = isMounted && itemCount >= 2;

  const {
    trackRef,
    activeIndex,
    scrollNext,
    scrollToIndex: scrollToIndexBase,
  } = useLoopingSlideScroll({
    itemCount,
    looping,
    prefersReducedMotion,
  });

  const restartAutoplay = useCallback(() => {
    setAutoplayResetKey((key) => key + 1);
  }, []);

  const scrollToIndex = useCallback(
    (logicalIndex: number) => {
      scrollToIndexBase(logicalIndex);
      restartAutoplay();
    },
    [restartAutoplay, scrollToIndexBase]
  );

  useCarouselAutoplay({
    enabled: itemCount > 1 && !prefersReducedMotion,
    intervalMs: DEFAULT_AUTOPLAY_MS,
    paused: isPointerInside || isPointerDown || isFocusInside,
    resetKey: autoplayResetKey,
    onTick: scrollNext,
  });

  const trackSlides = useMemo((): TPromoTrackSlide[] => {
    if (!looping) {
      return banners.map((banner, index) => ({
        key: banner.id,
        banner,
        isClone: false,
        priority: index === 0,
      }));
    }

    const withClones = [banners[itemCount - 1], ...banners, banners[0]];

    return withClones.map((banner, index) => {
      const isClone = index === 0 || index === withClones.length - 1;
      const logicalIndex = isClone ? -1 : index - 1;

      return {
        key: isClone ? `clone-${index}-${banner.id}` : banner.id,
        banner,
        isClone,
        priority: logicalIndex === 0,
      };
    });
  }, [banners, itemCount, looping]);

  const handlePointerEnter = useCallback(() => {
    setIsPointerInside(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsPointerInside(false);
    setIsPointerDown(false);
  }, []);

  const handlePointerDown = useCallback(() => {
    setIsPointerDown(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsPointerDown(false);
    restartAutoplay();
  }, [restartAutoplay]);

  const handleFocusCapture = useCallback(() => {
    setIsFocusInside(true);
  }, []);

  const handleBlurCapture = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsFocusInside(false);
    }
  }, []);

  return {
    trackRef,
    trackSlides,
    banners,
    itemCount,
    activeIndex,
    showPagination: itemCount > 1,
    scrollToIndex,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handlePointerUp,
    handleFocusCapture,
    handleBlurCapture,
  };
};
