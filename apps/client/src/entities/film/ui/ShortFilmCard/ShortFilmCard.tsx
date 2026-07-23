'use client';

import type { TPersonFilmResponse } from '@common/types';

import { useRouter } from 'next/navigation';
import { useId } from 'react';

import { MOBILE_BREAKPOINT } from '@/shared/constants';
import { useMediaQuery } from '@/shared/lib';
import { Button, RemotePoster } from '@/shared/ui';

import styles from './ShortFilmCard.module.scss';
import { formatRating } from '../../lib';

interface ShortFilmCardProps {
  film: TPersonFilmResponse;
}

export const ShortFilmCard = ({ film }: ShortFilmCardProps) => {
  const router = useRouter();
  const titleId = useId();
  const isMobileLayout = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  const rating = formatRating(film.ratingKp);

  const handleFilmClick = () => {
    router.push(`/films/${film.id}`);
  };

  return (
    <article aria-labelledby={titleId} className={styles.root}>
      <div className={styles.posterSlot}>
        <RemotePoster
          alt=""
          fallbackIconSize={28}
          fallbackLabel="Нет постера"
          size="s"
          skeletonAnimation="wave"
          skeletonBorderRadius={4}
          skeletonClassName={styles.posterSkeleton}
          src={film.smallPictureUrl}
        />
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
