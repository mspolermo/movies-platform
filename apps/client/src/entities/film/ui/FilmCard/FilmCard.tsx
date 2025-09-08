'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@/shared/ui';
import { FilmCardSkeleton } from './FilmCardSkeleton';
import styles from './FilmCard.module.scss';
import { Preview } from './Preview';
import { FilmCardProps } from '../types';
import { IconsBlock } from './IconsBlock';

export const FilmCard = ({ 
  film, 
  showIcons = false,
  isLoading = false
}: FilmCardProps) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [notLike, setNotLike] = useState(false);

  const handleCardClick = () => {
    router.push(`/films/${film.id}`);
  };

  const handleFavoritesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(prev => !prev);
  };

  const handleNotLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotLike(prev => !prev);
  };

  const handleGradeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement grade functionality
  };

  const handleSimilarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement similar films functionality
  };

  const formatRating = (rating?: number) => {
    if (!rating) return '0,0';
    return rating.toFixed(1).replace('.', ',');
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    return `${minutes} мин`;
  };

  // Показываем скелетон во время загрузки
  if (isLoading) {
    return <FilmCardSkeleton showIcons={showIcons} />;
  }

  //TODO: иконки вынести в shared/

  return (
    <div className={styles.filmcard} onClick={handleCardClick}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={showIcons ? styles.poster : styles.posterTwo}>
            <div className={styles.img}>
              <Preview film={film} />
              <div className={styles.imgBackground}></div>
            </div>
          </div>
          <div className={styles.properties}>
            <IconsBlock
              showIcons={showIcons}
              notLike={notLike}
              isFavorite={isFavorite}
              handleFavoritesClick={handleFavoritesClick}
              handleSimilarClick={handleSimilarClick}
              handleGradeClick={handleGradeClick}
              handleNotLikeClick={handleNotLikeClick}
            />

            <div className={styles.propertiesInfo}>
              <div className={styles.rating}>
                <span className={styles.bigRating}>
                  {formatRating(film.ratingKp)}
                </span>
              </div>
              <div className={styles.infoShort}>
                {film.year && `${film.year}, `}
                {film.premiereCountry || ''}
              </div>
              <div className={styles.infoTime}>
                {formatDuration(film.movieLength)}
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.name}>
          {film.filmNameRu || film.filmNameEn}
        </div>
      </div>
    </div>
  );
};
