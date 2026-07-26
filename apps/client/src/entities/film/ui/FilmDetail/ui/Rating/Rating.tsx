'use client';

import type { RatingProps } from '../../types';

import cn from 'classnames';

import styles from './Rating.module.scss';
import { formatVotes, getKinopoiskUrl } from '../../../../lib';

/**
 * Блок рейтинга фильма с переходом на Кинопоиск.
 */
export const Rating = ({ film: { ratingKp, votesKp, filmNameRu, filmNameEn } }: RatingProps) => {
  const filmName = filmNameRu || filmNameEn || '';
  const rating = ratingKp ? Math.round(ratingKp * 10) / 10 : 0;
  const isHigh = ratingKp != null && ratingKp >= 7;

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
    </a>
  );
};
