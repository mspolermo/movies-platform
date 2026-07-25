'use client';

import type { TPromoBannerSliderProps } from './types';

import cn from 'classnames';
import Image from 'next/image';

import styles from './PromoBannerSlider.module.scss';
import { usePromoBannerSlider } from '../lib';

/**
 * Виджет промо-баннеров на главной: loop + dots + autoplay, свайп/drag, без стрелок и клика по баннеру.
 */
export const PromoBannerSlider = ({ className }: TPromoBannerSliderProps) => {
  const {
    trackRef,
    trackSlides,
    banners,
    itemCount,
    activeIndex,
    showPagination,
    scrollToIndex,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handlePointerUp,
    handleFocusCapture,
    handleBlurCapture,
  } = usePromoBannerSlider();

  const activeBanner = banners[activeIndex];

  return (
    <section
      aria-label="Рекламные баннеры"
      className={cn(styles.section, className)}
      onBlurCapture={handleBlurCapture}
      onFocusCapture={handleFocusCapture}
      onPointerCancel={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
    >
      <div className={styles.viewport}>
        <div ref={trackRef} className={styles.track}>
          {trackSlides.map(({ key, banner, isClone, priority }) => (
            <div key={key} aria-hidden={isClone || undefined} className={styles.slide}>
              <Image
                fill
                alt={banner.alt}
                className={styles.image}
                draggable={false}
                priority={priority}
                sizes="100vw"
                src={banner.src}
              />
            </div>
          ))}
        </div>

        {activeBanner && (
          <p aria-atomic="true" aria-live="polite" className={styles.liveStatus}>
            {`Баннер ${activeIndex + 1} из ${itemCount}: ${activeBanner.alt}`}
          </p>
        )}

        {showPagination && (
          <div aria-label="Пагинация баннеров" className={styles.pagination} role="group">
            {banners.map((banner, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={banner.id}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={`Баннер ${index + 1} из ${itemCount}`}
                  className={cn(styles.paginationDot, isActive && styles.paginationDotActive)}
                  type="button"
                  onClick={() => scrollToIndex(index)}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
