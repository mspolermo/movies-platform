import type { PosterPreviewBlockProps } from '../../types';

import Image from 'next/image';
import React, { useState } from 'react';

import { ImageIcon } from '@/shared/assets';
import { SvgIcon, Skeleton } from '@/shared/ui';

import styles from './PosterPreviewBlock.module.scss';

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
            <SvgIcon data-variant="image" icon={ImageIcon} size={48} />
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
          fill
          alt={alt}
          sizes="(max-width: 768px) 100vw, 600px"
          src={posterUrl}
          style={{
            objectFit: 'cover',
            opacity: imageLoading ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
      {imageLoading && (
        <Skeleton
          animation="pulse"
          borderRadius="8px"
          className={styles.imageSkeleton}
          height="100%"
          variant="rectangular"
          width="100%"
        />
      )}
    </div>
  );
};
