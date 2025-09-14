import React, { useState } from 'react';
import styles from './PosterPreviewBlock.module.scss';
import { SvgIcon, Skeleton } from '@/shared/ui';
import { ImageIcon } from '@/shared/assets/svg-icons';
import { PosterPreviewBlockProps } from '../../types';

export const PosterPreviewBlock = ({ 
  posterUrl, 
  alt
}: PosterPreviewBlockProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getPosterUrl = () => {
    return posterUrl || '';
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Если нет URL или ошибка - показываем ошибку
  if (!posterUrl || imageError) {
    return (
      <div className={styles.posterPreviewBlock}>
        <div className={styles.imagePlaceholder}>
          <div className={styles.placeholderIcon}>
            <SvgIcon
              icon={ImageIcon}
              size={48}
              data-variant="image"
            />
          </div>
          <div className={styles.placeholderText}>
            Нет изображения
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.posterPreviewBlock}>
      <img 
        src={getPosterUrl()} 
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ 
          opacity: imageLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
        className={styles.poster}
      />
      {imageLoading && (
        <Skeleton
          width="100%"
          height="100%"
          borderRadius="8px"
          variant="rectangular"
          animation="pulse"
          className={styles.imageSkeleton}
        />
      )}
    </div>
  );
};
