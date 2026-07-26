import type { TrailerProps } from '../../types';

import React, { useState, useEffect } from 'react';

import { SvgIcon, Skeleton } from '@/shared/ui';

import styles from './Trailer.module.scss';

export const Trailer = ({ film }: TrailerProps) => {
  const { trailerUrl, filmNameRu, filmNameEn } = film;

  const filmName = filmNameRu ?? filmNameEn ?? '';

  const [isLoading, setIsLoading] = useState(!!trailerUrl);
  const [isReady, setIsReady] = useState(false);

  // reset при смене трейлера
  useEffect(() => {
    if (!trailerUrl) {
      setIsLoading(false);
      setIsReady(false);
      return;
    }

    setIsLoading(true);
    setIsReady(false);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // fallback

    return () => clearTimeout(timer);
  }, [trailerUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    setIsReady(true);
  };

  const showPlaceholder = !trailerUrl || (!isLoading && !isReady);

  return (
    <div className={styles.root}>
      <h3 className={styles.title}>Трейлер</h3>

      <div className={styles.container}>
        {/* skeleton */}
        {isLoading && (
          <Skeleton
            animation="pulse"
            borderRadius="8px"
            className={styles.skeleton}
            variant="rectangular"
          />
        )}

        {/* placeholder */}
        {showPlaceholder && (
          <div className={styles.placeholder}>
            <SvgIcon icon="image" size={48} />
            <span>Нет трейлера</span>
          </div>
        )}

        {/* iframe */}
        {trailerUrl && !showPlaceholder && (
          <iframe
            allowFullScreen
            className={styles.iframe}
            src={trailerUrl}
            title={`Трейлер ${filmName}`}
            onLoad={handleLoad}
          />
        )}
      </div>
    </div>
  );
};
