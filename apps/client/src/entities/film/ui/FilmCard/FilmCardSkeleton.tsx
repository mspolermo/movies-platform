import React from 'react';
import { Skeleton } from '@/shared/ui';
import styles from './FilmCard.module.scss';
import { FilmCardSkeletonProps } from '../types';

export const FilmCardSkeleton = ({
  showIcons = false,
}: FilmCardSkeletonProps) => {
  return (
    <article className={`${styles.card} ${styles.skeletonCard}`}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.poster}>
            <div className={styles.imageContainer}>
              <Skeleton
                width="100%"
                height="100%"
                borderRadius="8px"
                variant="rectangular"
                animation="pulse"
              />
              
              {showIcons && (
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <div className={styles.iconsContainer}>
                      {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton
                          key={index}
                          width="32px"
                          height="32px"
                          borderRadius="4px"
                          variant="rectangular"
                          animation="pulse"
                        />
                      ))}
                    </div>

                    <div className={styles.filmInfo}>
                      <div className={styles.rating}>
                        <Skeleton
                          width="40px"
                          height="28px"
                          borderRadius="4px"
                          variant="rectangular"
                          animation="pulse"
                        />
                      </div>
                      <div className={styles.filmDetails}>
                        <Skeleton
                          width="80px"
                          height="16px"
                          borderRadius="4px"
                          variant="rectangular"
                          animation="pulse"
                        />
                      </div>
                      <div className={styles.duration}>
                        <Skeleton
                          width="60px"
                          height="16px"
                          borderRadius="4px"
                          variant="rectangular"
                          animation="pulse"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <h3 className={styles.title}>
          <Skeleton
            width="150px"
            height="20px"
            borderRadius="4px"
            variant="rectangular"
            animation="pulse"
          />
        </h3>
      </div>
    </article>
  );
};
