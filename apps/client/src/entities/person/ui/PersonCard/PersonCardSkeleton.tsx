import React from 'react';

import { Skeleton } from '@/shared/ui';

import styles from './PersonCard.module.scss';

export const PersonCardSkeleton = () => {
  return (
    <article aria-hidden className={`${styles.card} ${styles.skeletonCard}`}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.poster}>
            <div className={styles.imageContainer}>
              <Skeleton
                animation="pulse"
                borderRadius="8px"
                height="100%"
                variant="rectangular"
                width="100%"
              />
            </div>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.nameRu}>
            <Skeleton
              animation="pulse"
              borderRadius="4px"
              height="20px"
              variant="rectangular"
              width="100%"
            />
          </div>
          <div className={styles.nameEn}>
            <Skeleton
              animation="pulse"
              borderRadius="4px"
              height="18px"
              variant="rectangular"
              width="75%"
            />
          </div>
        </div>
      </div>
    </article>
  );
};
