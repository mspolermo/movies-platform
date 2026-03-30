'use client';

import type { TPersonFilmResponse } from '@common/types';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';

import { MOBILE_BREAKPOINT } from '@/shared/constants';
import { useMediaQuery } from '@/shared/lib';
import { Button, Skeleton } from '@/shared/ui';

import styles from './ShortFilmCard.module.scss';
import { formatRating } from '../../lib';

interface ShortFilmCardProps {
  film: TPersonFilmResponse;
}

type PosterLoadState = 'loading' | 'loaded' | 'error';

export const ShortFilmCard = ({ film }: ShortFilmCardProps) => {
  const router = useRouter();
  const titleId = useId();
  const isMobileLayout = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  const posterSrc = film.smallPictureUrl ?? '/images/poster-placeholder.png';
  const [posterState, setPosterState] = useState<PosterLoadState>('loading');

  useEffect(() => {
    setPosterState('loading');
  }, [film.id, posterSrc]);

  const handleFilmClick = () => {
    router.push(`/films/${film.id}`);
  };

  const handlePosterLoad = () => {
    setPosterState('loaded');
  };

  const handlePosterError = () => {
    setPosterState('error');
  };

  const rating = formatRating(film.ratingKp);

  return (
    <article aria-labelledby={titleId} className={styles.root}>
      <div className={styles.posterSlot}>
        {posterState === 'loading' && (
          <Skeleton animation="wave" borderRadius={4} className={styles.posterSkeleton} />
        )}
        {posterState === 'error' && (
          <div aria-label="Постер недоступен" className={styles.posterFallback} role="img">
            <svg
              aria-hidden
              className={styles.posterFallbackIcon}
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 16L8.586 11.414C8.961 11.039 9.475 10.828 10.01 10.828C10.545 10.828 11.059 11.039 11.434 11.414L16 16M14 14L15.586 12.414C15.961 12.039 16.475 11.828 17.01 11.828C17.545 11.828 18.059 12.039 18.434 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
            <span className={styles.posterFallbackText}>Нет постера</span>
          </div>
        )}
        {posterState !== 'error' && (
          // eslint-disable-next-line @next/next/no-img-element -- внешние URL постеров
          <img
            alt=""
            className={`${styles.posterImg} ${posterState === 'loaded' ? styles.posterImgVisible : ''}`}
            decoding="async"
            src={posterSrc}
            onError={handlePosterError}
            onLoad={handlePosterLoad}
          />
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.meta}>
          <div className={styles.year}>{film.year ?? '—'}</div>
          <div className={styles.filmTitle} id={titleId}>
            {film.filmNameRu}
          </div>
          <div className={styles.rating}>{rating}</div>
        </div>
        <div className={styles.action}>
          <Button
            className={styles.actionButton}
            size={isMobileLayout ? 'large' : 'medium'}
            onClick={handleFilmClick}
          >
            К фильму
          </Button>
        </div>
      </div>
    </article>
  );
};
