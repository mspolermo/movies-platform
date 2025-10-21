import React, { useState } from 'react';
import styles from './PosterPreviewBlock.module.scss';
import { SvgIcon, Skeleton } from '@/shared/ui';
import { ImageIcon } from '@/shared/assets/svg-icons';
import { PosterPreviewBlockProps } from '../../types';
import Image from 'next/image';

export const PosterPreviewBlock = ({
  bigPictureUrl,
  smallPictureUrl,
  filmNameRu,
  filmNameEn,
}: PosterPreviewBlockProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const posterUrl = bigPictureUrl ?? smallPictureUrl ?? '';
  const alt = filmNameRu || filmNameEn || '';

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
            <SvgIcon icon={ImageIcon} size={48} data-variant="image" />
          </div>
          <div className={styles.placeholderText}>Нет изображения</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.posterPreviewBlock}>
      <div className={styles.poster} style={{ position: 'relative' }}>
        <Image
          src={posterUrl}
          alt={alt}
          fill
          onLoad={handleImageLoad}
          onError={handleImageError}
          sizes="(max-width: 768px) 100vw, 600px"
          style={{
            objectFit: 'cover',
            opacity: imageLoading ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        />
      </div>
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
