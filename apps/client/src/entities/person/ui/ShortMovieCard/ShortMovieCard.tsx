import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { TFilmBased } from '@common/types';
import styles from './ShortMovieCard.module.scss';

interface ShortMovieCardProps {
  film: TFilmBased;
}

const formatRating = (rating?: number): string => {
  if (!rating) return '0';
  return rating.toFixed(1).replace('.', ',');
};

export const ShortMovieCard: React.FC<ShortMovieCardProps> = ({ film }) => {
  const router = useRouter();

  const handleFilmClick = () => {
    router.push(`/films/${film.id}`);
  };

  const posterUrl = film.smallPictureUrl || '/images/poster-placeholder.png';
  const rating = formatRating(film.ratingKp);

  return (
    <div className={styles.shortMovieCard}>
      {/* Desktop версия */}
      <div className={styles.shortMovieCard__content}>
        <div className={styles.shortMovieCard__movie}>
          <div className={styles.shortMovieCard__poster}>
            <img src={posterUrl} alt={film.filmNameRu} />
          </div>
          <div className={styles.specification}>
            <div className={styles.specification__year}>{film.year || '—'}</div>
            <div className={styles.specification__name}>{film.filmNameRu}</div>
            <div className={styles.specification__rating}>
              Рейтинг: {rating}
            </div>
          </div>
        </div>
        <div className={styles.shortMovieCard__button}>
          <Button onClick={handleFilmClick}>К фильму</Button>
        </div>
      </div>

      {/* Mobile версия */}
      <div className={styles.shortMovieCard__mobile}>
        <div className={styles.shortMovieCard__poster}>
          <img src={posterUrl} alt={film.filmNameRu} />
        </div>

        <div className={styles.shortMovieCard__info}>
          <div className={styles.shortMovieCard__year}>{film.year || '—'}</div>
          <div className={styles.shortMovieCard__name}>{film.filmNameRu}</div>
          <div className={styles.shortMovieCard__rating}>
            Рейтинг: {rating}
          </div>
          <div className={styles.shortMovieCard__button}>
            <Button onClick={handleFilmClick} size="large">
              К фильму
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

