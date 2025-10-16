import React from 'react';
import { Skeleton } from '@/shared/ui';
import styles from '../FilmDetail.module.scss';
import skeletonStyles from './FilmDetailSkeleton.module.scss';

export const FilmDetailSkeleton: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.filmDetail} ${skeletonStyles.skeletonContainer}`}>
        <div className={styles.posterSection}>
          {/* Постер */}
          <Skeleton
            width="100%"
            height="400px"
            borderRadius="8px"
            variant="rectangular"
            animation="pulse"
            className={skeletonStyles.posterSkeleton}
          />
          
          {/* Слоган */}
          <div className={skeletonStyles.sloganSkeleton}>
            <Skeleton
              width="100%"
              height="16px"
              borderRadius="4px"
              variant="rectangular"
              animation="pulse"
            />
          </div>

          {/* Рейтинг блок */}
          <div className={skeletonStyles.ratingSkeleton}>
            <Skeleton
              width="64px"
              height="64px"
              borderRadius="8px"
              variant="rectangular"
              animation="pulse"
              className={skeletonStyles.ratingCircle}
            />
            <div className={skeletonStyles.ratingInfo}>
              <Skeleton
                width="80px"
                height="16px"
                borderRadius="4px"
                variant="rectangular"
                animation="pulse"
              />
              <Skeleton
                width="60px"
                height="14px"
                borderRadius="4px"
                variant="rectangular"
                animation="pulse"
              />
              <Skeleton
                width="100px"
                height="14px"
                borderRadius="4px"
                variant="rectangular"
                animation="pulse"
              />
            </div>
            <Skeleton
              width="80px"
              height="26px"
              borderRadius="6px"
              variant="rectangular"
              animation="pulse"
              className={skeletonStyles.ratingButton}
            />
          </div>
        </div>
        
        <div className={styles.infoSection}>
          {/* Заголовок и основная информация */}
          <div className={skeletonStyles.summarySkeleton}>
            <Skeleton
              width="70%"
              height="32px"
              borderRadius="4px"
              variant="rectangular"
              animation="pulse"
              className={skeletonStyles.titleSkeleton}
            />
            
            <div className={skeletonStyles.metaInfo}>
              <Skeleton
                width="120px"
                height="18px"
                borderRadius="4px"
                variant="rectangular"
                animation="pulse"
              />
              <Skeleton
                width="80px"
                height="18px"
                borderRadius="4px"
                variant="rectangular"
                animation="pulse"
              />
              <Skeleton
                width="100px"
                height="18px"
                borderRadius="4px"
                variant="rectangular"
                animation="pulse"
              />
            </div>
            
            <div className={skeletonStyles.additionalInfo}>
              <Skeleton
                width="60px"
                height="24px"
                borderRadius="4px"
                variant="rectangular"
                animation="pulse"
              />
              <Skeleton
                width="40px"
                height="18px"
                borderRadius="4px"
                variant="rectangular"
                animation="pulse"
              />
              <Skeleton
                width="40px"
                height="18px"
                borderRadius="4px"
                variant="rectangular"
                animation="pulse"
              />
            </div>
          </div>

          {/* Описание */}
          <div className={skeletonStyles.descriptionSkeleton}>
            <Skeleton
              width="100%"
              height="120px"
              borderRadius="4px"
              variant="rectangular"
              animation="pulse"
              className={skeletonStyles.descriptionText}
            />
            <Skeleton
              width="100px"
              height="20px"
              borderRadius="4px"
              variant="rectangular"
              animation="pulse"
              className={skeletonStyles.readMoreButton}
            />
          </div>

          <Skeleton
              width="180px"
              height="20px"
              borderRadius="4px"
              variant="rectangular"
              animation="pulse"
              className={skeletonStyles.readMoreButton}
            />

          {/* Карточки актеров */}
          <div className={skeletonStyles.cardsSkeletonContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={skeletonStyles.cardSkeleton}>
                <Skeleton
                  width="70px"
                  height="70px"
                  borderRadius="8px"
                  variant="rectangular"
                  animation="pulse"
                  className={skeletonStyles.cardImage}
                />
                <Skeleton
                  width="80%"
                  height="14px"
                  borderRadius="4px"
                  variant="rectangular"
                  animation="pulse"
                  className={skeletonStyles.cardTitle}
                />
              </div>
            ))}
          </div>



          {/* Трейлер */}
          <div className={skeletonStyles.trailerSkeleton}>
            <Skeleton
              width="80px"
              height="18px"
              borderRadius="4px"
              variant="rectangular"
              animation="pulse"
              className={skeletonStyles.trailerTitleSkeleton}
            />
            <Skeleton
              width="100%"
              height="auto"
              borderRadius="8px"
              variant="rectangular"
              animation="pulse"
              className={skeletonStyles.trailerVideoSkeleton}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
