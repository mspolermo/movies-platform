'use client';

import type { TFilmsCarouselProps } from './types';

import cn from 'classnames';
import React, { useId } from 'react';

import { HorizontalCarousel, Skeleton } from '@/shared/ui';

import { FilmCard, FilmCardSkeleton } from '../FilmCard';
import styles from './FilmsCarousel.module.scss';

const SKELETON_COUNT = 8;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, index) => `skeleton-${index}`);

/** Горизонтальная карусель карточек фильмов с заголовком. */
export const FilmsCarousel = ({
  title,
  films,
  isLoading = false,
  className,
}: TFilmsCarouselProps) => {
  const titleId = useId();

  if (!isLoading && films.length === 0) {
    return null;
  }

  return (
    <section
      aria-busy={isLoading || undefined}
      aria-label={isLoading ? 'Загрузка фильмов' : undefined}
      aria-labelledby={isLoading ? undefined : titleId}
      className={cn(styles.section, className)}
    >
      {isLoading ? (
        <Skeleton
          aria-hidden
          animation="pulse"
          borderRadius={4}
          className={styles.titleSkeleton}
          variant="rectangular"
        />
      ) : (
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>
      )}

      <HorizontalCarousel arrows="auto" scrollStep="page">
        {isLoading
          ? SKELETON_KEYS.map((key) => (
              <div key={key} className={styles.slide}>
                <FilmCardSkeleton showIcons />
              </div>
            ))
          : films.map((film) => (
              <div key={film.id} className={styles.slide}>
                <FilmCard showIcons film={film} />
              </div>
            ))}
      </HorizontalCarousel>
    </section>
  );
};
