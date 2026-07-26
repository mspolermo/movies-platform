import type { FilmCardSkeletonProps } from '../types';

import React from 'react';

import { Skeleton } from '@/shared/ui';

import styles from './FilmCard.module.scss';

export const FilmCardSkeleton = ({ showIcons = false }: FilmCardSkeletonProps) => {
  return (
    <article className={`${styles.card} ${styles.skeletonCard}`}>
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

              {showIcons && (
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <div className={styles.iconsContainer}>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton
                          key={index}
                          animation="pulse"
                          borderRadius="4px"
                          height="32px"
                          variant="rectangular"
                          width="32px"
                        />
                      ))}
                    </div>

                    <div className={styles.filmInfo}>
                      <div className={styles.rating}>
                        <Skeleton
                          animation="pulse"
                          borderRadius="4px"
                          height="28px"
                          variant="rectangular"
                          width="40px"
                        />
                      </div>
                      <div className={styles.filmDetails}>
                        <Skeleton
                          animation="pulse"
                          borderRadius="4px"
                          height="16px"
                          variant="rectangular"
                          width="80px"
                        />
                      </div>
                      <div className={styles.duration}>
                        <Skeleton
                          animation="pulse"
                          borderRadius="4px"
                          height="16px"
                          variant="rectangular"
                          width="60px"
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
            animation="pulse"
            borderRadius="4px"
            height="20px"
            variant="rectangular"
            width="150px"
          />
        </h3>
      </div>
    </article>
  );
};
