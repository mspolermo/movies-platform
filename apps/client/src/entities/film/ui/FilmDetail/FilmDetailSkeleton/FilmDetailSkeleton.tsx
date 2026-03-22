import { Skeleton } from '@/shared/ui';

import styles from '../FilmDetail.module.scss';
import skeletonStyles from './FilmDetailSkeleton.module.scss';

export const FilmDetailSkeleton = () => {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.filmDetail} ${skeletonStyles.skeletonContainer}`}
      >
        <div className={styles.posterSection}>
          {/* Постер */}
          <Skeleton
            animation="pulse"
            borderRadius="8px"
            className={skeletonStyles.posterSkeleton}
            height="400px"
            variant="rectangular"
            width="100%"
          />

          {/* Слоган */}
          <div className={skeletonStyles.sloganSkeleton}>
            <Skeleton
              animation="pulse"
              borderRadius="4px"
              height="16px"
              variant="rectangular"
              width="100%"
            />
          </div>

          {/* Рейтинг блок */}
          <div className={skeletonStyles.ratingSkeleton}>
            <Skeleton
              animation="pulse"
              borderRadius="8px"
              className={skeletonStyles.ratingCircle}
              height="64px"
              variant="rectangular"
              width="64px"
            />
            <div className={skeletonStyles.ratingInfo}>
              <Skeleton
                animation="pulse"
                borderRadius="4px"
                height="16px"
                variant="rectangular"
                width="80px"
              />
              <Skeleton
                animation="pulse"
                borderRadius="4px"
                height="14px"
                variant="rectangular"
                width="60px"
              />
              <Skeleton
                animation="pulse"
                borderRadius="4px"
                height="14px"
                variant="rectangular"
                width="100px"
              />
            </div>
            <Skeleton
              animation="pulse"
              borderRadius="6px"
              className={skeletonStyles.ratingButton}
              height="26px"
              variant="rectangular"
              width="80px"
            />
          </div>
        </div>

        <div className={styles.infoSection}>
          {/* Заголовок и основная информация */}
          <div className={skeletonStyles.summarySkeleton}>
            <Skeleton
              animation="pulse"
              borderRadius="4px"
              className={skeletonStyles.titleSkeleton}
              height="32px"
              variant="rectangular"
              width="70%"
            />

            <div className={skeletonStyles.metaInfo}>
              <Skeleton
                animation="pulse"
                borderRadius="4px"
                height="18px"
                variant="rectangular"
                width="120px"
              />
              <Skeleton
                animation="pulse"
                borderRadius="4px"
                height="18px"
                variant="rectangular"
                width="80px"
              />
              <Skeleton
                animation="pulse"
                borderRadius="4px"
                height="18px"
                variant="rectangular"
                width="100px"
              />
            </div>

            <div className={skeletonStyles.additionalInfo}>
              <Skeleton
                animation="pulse"
                borderRadius="4px"
                height="24px"
                variant="rectangular"
                width="60px"
              />
              <Skeleton
                animation="pulse"
                borderRadius="4px"
                height="18px"
                variant="rectangular"
                width="40px"
              />
              <Skeleton
                animation="pulse"
                borderRadius="4px"
                height="18px"
                variant="rectangular"
                width="40px"
              />
            </div>
          </div>

          {/* Описание */}
          <div className={skeletonStyles.descriptionSkeleton}>
            <Skeleton
              animation="pulse"
              borderRadius="4px"
              className={skeletonStyles.descriptionText}
              height="120px"
              variant="rectangular"
              width="100%"
            />
            <Skeleton
              animation="pulse"
              borderRadius="4px"
              className={skeletonStyles.readMoreButton}
              height="20px"
              variant="rectangular"
              width="100px"
            />
          </div>

          <Skeleton
            animation="pulse"
            borderRadius="4px"
            className={skeletonStyles.readMoreButton}
            height="20px"
            variant="rectangular"
            width="180px"
          />

          {/* Карточки актеров */}
          <div className={skeletonStyles.cardsSkeletonContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={skeletonStyles.cardSkeleton}>
                <Skeleton
                  animation="pulse"
                  borderRadius="8px"
                  className={skeletonStyles.cardImage}
                  height="70px"
                  variant="rectangular"
                  width="70px"
                />
                <Skeleton
                  animation="pulse"
                  borderRadius="4px"
                  className={skeletonStyles.cardTitle}
                  height="14px"
                  variant="rectangular"
                  width="80%"
                />
              </div>
            ))}
          </div>

          {/* Трейлер */}
          <div className={skeletonStyles.trailerSkeleton}>
            <Skeleton
              animation="pulse"
              borderRadius="4px"
              className={skeletonStyles.trailerTitleSkeleton}
              height="18px"
              variant="rectangular"
              width="80px"
            />
            <Skeleton
              animation="pulse"
              borderRadius="8px"
              className={skeletonStyles.trailerVideoSkeleton}
              height="auto"
              variant="rectangular"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
