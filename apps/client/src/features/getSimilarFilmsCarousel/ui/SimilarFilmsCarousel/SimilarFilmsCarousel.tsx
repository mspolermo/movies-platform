'use client';

import type { TSimilarFilmsCarouselProps } from './types';

import cn from 'classnames';
import React, { useId } from 'react';

import { FilmCard, FilmCardSkeleton } from '@/entities/film';
import { HorizontalCarousel, Skeleton } from '@/shared/ui';

import styles from './SimilarFilmsCarousel.module.scss';

const SKELETON_COUNT = 8;
const SKELETON_KEYS = Array.from({ length: SKELETON_COUNT }, (_, index) => `skeleton-${index}`);

/** Секция карусели похожих фильмов на странице фильма. */
export const SimilarFilmsCarousel = ({
  films,
  filmName,
  isLoading = false,
  className,
}: TSimilarFilmsCarouselProps) => {
  const titleId = useId();

  if (!isLoading && films.length === 0) {
    return null;
  }

  return (
    <section
      aria-busy={isLoading || undefined}
      aria-label={isLoading ? 'Загрузка похожих фильмов' : undefined}
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
          Похожие на «{filmName}»
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
