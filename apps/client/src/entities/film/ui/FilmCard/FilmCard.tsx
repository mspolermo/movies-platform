'use client';

import type { FilmCardProps } from '../types';

import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

import { RemotePoster } from '@/shared/ui';

import styles from './FilmCard.module.scss';
import { FilmCardSkeleton } from './FilmCardSkeleton';
import { formatDuration, formatRating, resolveFilmPosterUrl } from '../../lib';
import { useFilmCardActions } from '../../model';

export const FilmCard = ({
  film,
  showIcons = false,
  isLoading = false,
  priority = false,
}: FilmCardProps) => {
  const router = useRouter();
  const renderCardActions = useFilmCardActions();

  const handleCardClick = useCallback(() => {
    router.push(`/films/${film.id}`);
  }, [router, film.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick();
      }
    },
    [handleCardClick]
  );

  const formatFilmDetails = useCallback(() => {
    const parts = [];
    if (film.year) parts.push(film.year);
    if (film.premiereCountry) parts.push(film.premiereCountry);
    return parts.join(', ');
  }, [film.year, film.premiereCountry]);

  const filmTitle = film.filmNameRu || film.filmNameEn || 'Без названия';
  const actions = renderCardActions?.(film) ?? null;
  const durationLabel = film.movieLength ? formatDuration(film.movieLength) : '';

  if (isLoading) {
    return <FilmCardSkeleton showIcons={showIcons} />;
  }

  return (
    <article
      aria-label={`Открыть информацию о фильме ${filmTitle}`}
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.poster}>
            <div className={styles.imageContainer}>
              <RemotePoster
                alt={`Постер фильма ${filmTitle}`}
                priority={priority}
                size="m"
                src={resolveFilmPosterUrl(film, 'small')}
              />
              <div className={styles.imageBackground} />

              {showIcons && (
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    {actions ? <div className={styles.iconsContainer}>{actions}</div> : null}

                    <div className={styles.filmInfo}>
                      <div className={styles.rating}>
                        <span className={styles.ratingValue}>
                          {formatRating(film.ratingKp, true)}
                        </span>
                      </div>
                      <div className={styles.filmDetails}>{formatFilmDetails()}</div>
                      <div className={styles.duration}>{durationLabel}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <h3 className={styles.title}>{filmTitle}</h3>
      </div>
    </article>
  );
};
