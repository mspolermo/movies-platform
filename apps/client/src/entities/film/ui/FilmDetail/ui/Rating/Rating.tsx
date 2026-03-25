import type { RatingProps } from '../../types';

import type { MouseEvent } from 'react';

import cn from 'classnames';

import { Button } from '@/shared/ui';

import styles from './Rating.module.scss';
import { formatVotes, getKinopoiskUrl } from '../../../../lib';

/**
 * Блок рейтинга фильма с переходом на Кинопоиск.
 */
export const Rating = ({ film: { ratingKp, votesKp, filmNameRu, filmNameEn } }: RatingProps) => {
  const filmName = filmNameRu || filmNameEn || '';
  const rating = ratingKp ? Math.round(ratingKp * 10) / 10 : 0;
  const isHigh = ratingKp != null && ratingKp >= 7;

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: логика "Оценить"
  };

  return (
    <a
      aria-label={`Открыть Кинопоиск: ${filmName}`}
      className={cn(styles.root, isHigh && styles.high)}
      href={getKinopoiskUrl(filmName)}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className={styles.content}>
        <div className={cn(styles.badge, isHigh && styles.badgeHigh)}>
          <span className={styles.value}>{rating}</span>
        </div>

        <div className={styles.meta}>
          <span className={styles.title}>Рейтинг</span>
          <span className={styles.source}>Кинопоиск</span>
          <span className={styles.votes}>{formatVotes(votesKp)}</span>
        </div>
      </div>

      <div className={styles.action}>
        <Button size="small" variant="outline" onClick={handleButtonClick}>
          Оценить
        </Button>
      </div>
    </a>
  );
};
