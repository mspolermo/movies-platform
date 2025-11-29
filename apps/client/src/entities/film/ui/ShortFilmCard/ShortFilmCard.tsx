import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { TFilmBased } from '@common/types';
import styles from './ShortFilmCard.module.scss';
import { formatRating } from '../../lib';

interface ShortFilmCardProps {
  film: TFilmBased;
}

export const ShortFilmCard: React.FC<ShortFilmCardProps> = ({ film }) => {
  const router = useRouter();

  const handleFilmClick = () => {
    router.push(`/films/${film.id}`);
  };

  const posterUrl = film.smallPictureUrl || '/images/poster-placeholder.png';
  const rating = formatRating(film.ratingKp);

  return (
    <div className={styles.card}>
      {/* Desktop версия */}
      <div className={styles.desktop}>
        <div className={styles.movie}>
          <div className={styles.poster}>
            <img src={posterUrl} alt={film.filmNameRu} />
          </div>
          <div className={styles.specification}>
            <div className={styles.year}>{film.year || '—'}</div>
            <div className={styles.name}>{film.filmNameRu}</div>
            <div className={styles.rating}>{rating}</div>
          </div>
        </div>
        <div className={styles.button}>
          <Button onClick={handleFilmClick}>К фильму</Button>
        </div>
      </div>

      {/* Mobile версия */}
      <div className={styles.mobile}>
        <div className={styles.poster}>
          <img src={posterUrl} alt={film.filmNameRu} />
        </div>

        <div className={styles.info}>
          <div className={styles.year}>{film.year || '—'}</div>
          <div className={styles.name}>{film.filmNameRu}</div>
          <div className={styles.rating}>{rating}</div>
          <div className={styles.button}>
            <Button onClick={handleFilmClick} size="large">
              К фильму
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

