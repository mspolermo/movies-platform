'use client';

import type { TRateFilmContentProps } from './types';

import cn from 'classnames';

import styles from './RateFilmContent.module.scss';

const GRADES = Array.from({ length: 10 }, (_, index) => index + 1);
const BAD_GRADE_MAX = 6;

/**
 * Шкала оценки 1–10.
 * 1–6 — красный hover, 7–10 — зелёный.
 */
export const RateFilmContent = ({ onSelect }: TRateFilmContentProps) => {
  return (
    <div className={styles.root}>
      <p className={styles.hint}>Оценки улучшают рекомендации</p>

      <div className={styles.selector}>
        <div aria-label="Оценка от 1 до 10" className={styles.scale} role="group">
          {GRADES.map((grade) => (
            <button
              key={grade}
              aria-label={`Оценка ${grade}`}
              className={cn(
                styles.score,
                grade <= BAD_GRADE_MAX ? styles.scoreBad : styles.scoreGood
              )}
              type="button"
              onClick={() => onSelect(grade)}
            >
              {grade}
            </button>
          ))}
        </div>

        <div className={styles.labels}>
          <span className={styles.label}>очень плохо</span>
          <span className={styles.label}>отлично</span>
        </div>
      </div>
    </div>
  );
};
