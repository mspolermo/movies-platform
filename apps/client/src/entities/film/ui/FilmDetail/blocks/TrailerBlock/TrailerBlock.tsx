import React, { useState, useEffect } from 'react';
import styles from './TrailerBlock.module.scss';
import { SvgIcon, Skeleton } from '@/shared/ui';
import { ImageIcon } from '@/shared/assets/svg-icons';
import { TrailerBlockProps } from '../../types';

export const TrailerBlock = ({
  trailerUrl,
  filmNameRu,
  filmNameEn,
}: TrailerBlockProps) => {
  const filmName = filmNameRu ?? filmNameEn ?? '';
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  // Сброс состояний при изменении URL
  useEffect(() => {
    if (trailerUrl) {
      setVideoLoading(true);
      setVideoError(false);
    } else {
      setVideoLoading(false);
      setVideoError(true);
    }
  }, [trailerUrl]);

  const handleVideoLoad = () => {
    setVideoLoading(false);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoLoading(false);
    setVideoError(true);
  };

  // Таймаут для скелетона - если iframe не загрузился за 5 секунд
  useEffect(() => {
    if (trailerUrl && videoLoading) {
      const timer = setTimeout(() => {
        setVideoLoading(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [trailerUrl, videoLoading]);

  return (
    <div className={styles.trailerBlock}>
      <h3 className={styles.trailerTitle}>Трейлер</h3>
      <div className={styles.trailerContainer}>
        {/* Скелетон пока загружается */}
        {videoLoading && (
          <Skeleton
            width="100%"
            height="100%"
            borderRadius="8px"
            variant="rectangular"
            animation="pulse"
            className={styles.videoSkeleton}
          />
        )}

        {/* Ошибка если нет URL или не загрузилось */}
        {(!trailerUrl || videoError) && !videoLoading && (
          <div className={styles.videoPlaceholder}>
            <div className={styles.placeholderIcon}>
              <SvgIcon icon={ImageIcon} size={48} data-variant="image" />
            </div>
            <div className={styles.placeholderText}>Нет трейлера</div>
          </div>
        )}

        {/* iframe - всегда рендерим для событий, но скрываем */}
        {trailerUrl && (
          <iframe
            src={trailerUrl}
            title={`Трейлер ${filmName}`}
            className={styles.trailerIframe}
            allowFullScreen
            onLoad={handleVideoLoad}
            onError={handleVideoError}
            style={{
              opacity: videoLoading || videoError ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}
          />
        )}
      </div>
    </div>
  );
};
