import type { TPersonFilmographyItemResponse } from '@common/types';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui';

import styles from './ShortFilmCard.module.scss';
import { formatRating } from '../../lib';

interface ShortFilmCardProps {
  film: TPersonFilmographyItemResponse;
}

export const ShortFilmCard = ({ film }: ShortFilmCardProps) => {
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
            {/* eslint-disable-next-line @next/next/no-img-element -- внешние URL постеров */}
            <img alt={film.filmNameRu} src={posterUrl} />
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
          {/* eslint-disable-next-line @next/next/no-img-element -- внешние URL постеров */}
          <img alt={film.filmNameRu} src={posterUrl} />
        </div>

        <div className={styles.info}>
          <div className={styles.year}>{film.year || '—'}</div>
          <div className={styles.name}>{film.filmNameRu}</div>
          <div className={styles.rating}>{rating}</div>
          <div className={styles.button}>
            <Button size="large" onClick={handleFilmClick}>
              К фильму
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
