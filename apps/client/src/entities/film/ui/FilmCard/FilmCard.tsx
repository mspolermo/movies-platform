'use client';

import type { FilmCardProps } from '../types';

import { useRouter } from 'next/navigation';
import React, { useState, useCallback } from 'react';

import styles from './FilmCard.module.scss';
import { FilmCardSkeleton } from './FilmCardSkeleton';
import { IconsBlock } from './IconsBlock';
import { Preview } from './Preview';
import { formatRating } from '../../lib';

export const FilmCard = ({ film, showIcons = false, isLoading = false }: FilmCardProps) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [notLike, setNotLike] = useState(false);

  const handleCardClick = useCallback(() => {
    router.push(`/films/${film.id}`);
  }, [router, film.id]);

  const handleFavoritesClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  }, []);

  const handleNotLikeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setNotLike((prev) => !prev);
  }, []);

  const handleGradeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement grade functionality
  }, []);

  const handleSimilarClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement similar films functionality
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardClick();
      }
    },
    [handleCardClick]
  );

  const formatDuration = useCallback((minutes?: number) => {
    if (!minutes) return '';
    return `${minutes} мин`;
  }, []);

  const formatFilmDetails = useCallback(() => {
    const parts = [];
    if (film.year) parts.push(film.year);
    if (film.premiereCountry) parts.push(film.premiereCountry);
    return parts.join(', ');
  }, [film.year, film.premiereCountry]);

  const filmTitle = film.filmNameRu || film.filmNameEn || 'Без названия';

  // Показываем скелетон во время загрузки
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
              <Preview film={film} />
              <div className={styles.imageBackground} />

              {showIcons && (
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <div className={styles.iconsContainer}>
                      <IconsBlock
                        handleFavoritesClick={handleFavoritesClick}
                        handleGradeClick={handleGradeClick}
                        handleNotLikeClick={handleNotLikeClick}
                        handleSimilarClick={handleSimilarClick}
                        isFavorite={isFavorite}
                        notLike={notLike}
                      />
                    </div>

                    <div className={styles.filmInfo}>
                      <div className={styles.rating}>
                        <span className={styles.ratingValue}>
                          {formatRating(film.ratingKp, true)}
                        </span>
                      </div>
                      <div className={styles.filmDetails}>{formatFilmDetails()}</div>
                      <div className={styles.duration}>{formatDuration(film.movieLength)}</div>
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
