import React, { FC, useEffect, useState } from 'react';
import { Button } from '@/shared/ui';
import styles from './ReitingBlock.module.scss';
import { ReitingBlockProps } from '../../types';

export const ReitingBlock = ({ 
  ratingKp, 
  votesKp, 
  filmNameRu, 
  filmNameEn 
}: ReitingBlockProps) => {
  const [ratingClass, setRatingClass] = useState(styles.rating);
  const [blockClass, setBlockClass] = useState(styles.reitingBlock);

  useEffect(() => {
    if (ratingKp && ratingKp >= 7) {
      setRatingClass(`${styles.rating} ${styles.ratingGreen}`);
      setBlockClass(`${styles.reitingBlock} ${styles.reitingBlockGreen}`);
    }
  }, [ratingKp]);

  const handleClick = () => {
    // Используем русское название, если есть, иначе английское
    const filmName = filmNameRu || filmNameEn || '';
    const searchQuery = encodeURIComponent(filmName);
    const kinopoiskUrl = `https://www.kinopoisk.ru/index.php?kp_query=${searchQuery}`;
    
    window.open(kinopoiskUrl, '_blank');
  };

  const rating = ratingKp ? Math.round(ratingKp * 10) / 10 : 0;

  const formatVotes = (votes?: number): string => {
    if (!votes) return '0 оценок';
    
    if (votes >= 1000000) {
      const millions = Math.round(votes / 100000) / 10;
      return `${millions}М оценок`;
    } else if (votes >= 1000) {
      const thousands = Math.round(votes / 100);
      return `${thousands / 10}К оценок`;
    }
    
    return `${votes} оценок`;
  };

  return (
    <div className={blockClass} onClick={handleClick}>
      <div className={styles.inner}>
        <div className={ratingClass}>
          <p className={styles.count}>{rating}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.heading}>Рейтинг</p>
          <p className={styles.text}>Кипопоиск</p>
          <p className={styles.text}>{formatVotes(votesKp)}</p>
        </div>
      </div>
      <div className={styles.btn}>
        <Button variant="outline" size="small">Оценить</Button>
      </div>
    </div>
  );
};
