'use client';

import type { THorizontalCarouselHandle, THorizontalCarouselProps } from './types';

import cn from 'classnames';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { useMediaQuery } from '@/shared/lib';
import { SvgIcon } from '@/shared/ui/SvgIcon';

import styles from './HorizontalCarousel.module.scss';
import { useHorizontalScroll } from '../lib';

const EDGE_HOVER_THRESHOLD = 80;

/**
 * Универсальная горизонтальная карусель: track + scroll-snap + стрелки (desktop).
 */
export const HorizontalCarousel = forwardRef<THorizontalCarouselHandle, THorizontalCarouselProps>(
  (
    {
      children,
      className,
      trackClassName,
      scrollStep = 'page',
      snapType = 'mandatory',
      arrows = 'auto',
    },
    ref
  ) => {
    const hasFinePointer = useMediaQuery('(pointer: fine)');
    const [hoverZone, setHoverZone] = useState<'left' | 'right' | null>(null);

    const { trackRef, canScrollLeft, canScrollRight, scrollPrev, scrollNext, scrollToIndex } =
      useHorizontalScroll({
        scrollStep,
      });

    useImperativeHandle(ref, () => ({ scrollToIndex }), [scrollToIndex]);

    const handleMouseMove = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (arrows !== 'auto' || !hasFinePointer) {
          return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const width = rect.width;

        if (x < EDGE_HOVER_THRESHOLD && canScrollLeft) {
          setHoverZone('left');
          return;
        }

        if (x > width - EDGE_HOVER_THRESHOLD && canScrollRight) {
          setHoverZone('right');
          return;
        }

        setHoverZone(null);
      },
      [arrows, canScrollLeft, canScrollRight, hasFinePointer]
    );

    const handleMouseLeave = useCallback(() => {
      setHoverZone(null);
    }, []);

    const showLeftArrow =
      arrows !== 'never' && canScrollLeft && (arrows === 'always' || hoverZone === 'left');
    const showRightArrow =
      arrows !== 'never' && canScrollRight && (arrows === 'always' || hoverZone === 'right');

    return (
      <div
        className={cn(styles.container, className)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div
          ref={trackRef}
          className={cn(styles.track, snapType === 'none' && styles.trackSnapNone, trackClassName)}
        >
          {children}
        </div>

        {arrows !== 'never' && (
          <>
            <button
              aria-label="Прокрутить влево"
              className={cn(
                styles.arrowButton,
                styles.arrowButtonLeft,
                showLeftArrow && styles.arrowButtonVisible
              )}
              disabled={!canScrollLeft}
              type="button"
              onClick={scrollPrev}
            >
              <SvgIcon name="arrow-left" size={24} />
            </button>

            <button
              aria-label="Прокрутить вправо"
              className={cn(
                styles.arrowButton,
                styles.arrowButtonRight,
                showRightArrow && styles.arrowButtonVisible
              )}
              disabled={!canScrollRight}
              type="button"
              onClick={scrollNext}
            >
              <SvgIcon name="arrow-right" size={24} />
            </button>
          </>
        )}
      </div>
    );
  }
);

HorizontalCarousel.displayName = 'HorizontalCarousel';
