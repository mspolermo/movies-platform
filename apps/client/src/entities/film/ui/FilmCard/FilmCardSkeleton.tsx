import React from 'react';
import { Skeleton } from '@/shared/ui';
import styles from './FilmCardSkeleton.module.scss';

interface FilmCardSkeletonProps {
  showIcons?: boolean;
}

export const FilmCardSkeleton: React.FC<FilmCardSkeletonProps> = ({ 
  showIcons = false 
}) => {
  return (
    <div className={styles.filmcard}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={showIcons ? styles.poster : styles.posterTwo}>
            <div className={styles.img}>
              <Skeleton 
                width="100%" 
                height="280px" 
                borderRadius="8px"
                variant="rectangular"
                animation="pulse"
              />
            </div>
          </div>
          
          {showIcons && (
            <div className={styles.properties}>
              <div className={styles.icons}>
                <Skeleton 
                  width="25px" 
                  height="25px" 
                  borderRadius="4px"
                  variant="rectangular"
                  animation="pulse"
                />
                <Skeleton 
                  width="25px" 
                  height="25px" 
                  borderRadius="4px"
                  variant="rectangular"
                  animation="pulse"
                />
                <Skeleton 
                  width="25px" 
                  height="25px" 
                  borderRadius="4px"
                  variant="rectangular"
                  animation="pulse"
                />
                <Skeleton 
                  width="25px" 
                  height="25px" 
                  borderRadius="4px"
                  variant="rectangular"
                  animation="pulse"
                />
              </div>

              <div className={styles.propertiesInfo}>
                <div className={styles.rating}>
                  <Skeleton 
                    width="40px" 
                    height="28px" 
                    borderRadius="4px"
                    variant="rectangular"
                    animation="pulse"
                  />
                </div>
                <div className={styles.infoShort}>
                  <Skeleton 
                    width="80px" 
                    height="16px" 
                    borderRadius="4px"
                    variant="rectangular"
                    animation="pulse"
                  />
                </div>
                <div className={styles.infoTime}>
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
          )}
        </div>
        
        <div className={styles.name}>
          <Skeleton 
            width="150px" 
            height="20px" 
            borderRadius="4px"
            variant="rectangular"
            animation="pulse"
          />
        </div>
      </div>
    </div>
  );
};
