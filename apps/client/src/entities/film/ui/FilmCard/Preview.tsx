import type { FilmCardPreviewProps } from '../types';

import Image from 'next/image';
import { useState, useCallback } from 'react';

import { ImageIcon } from '@/shared/assets';
import { shouldSkipImageOptimization } from '@/shared/lib';
import { Skeleton, SvgIcon } from '@/shared/ui';

import styles from './FilmCard.module.scss';

export const Preview = ({ film, priority = false }: FilmCardPreviewProps) => {
  const { smallPictureUrl, bigPictureUrl, filmNameRu, filmNameEn } = film;
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const posterUrl = smallPictureUrl || bigPictureUrl || '';
  const filmTitle = filmNameRu || filmNameEn || 'Фильм';

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  if (imageError || !posterUrl) {
    return (
      <div className={styles.imagePlaceholder}>
        <div className={styles.placeholderIcon}>
          <SvgIcon data-variant="image" icon={ImageIcon} size={48} />
        </div>
        <div className={styles.placeholderText}>Нет изображения</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        fill
        alt={`Постер фильма ${filmTitle}`}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={posterUrl}
        style={{
          objectFit: 'cover',
          opacity: imageLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
        unoptimized={shouldSkipImageOptimization(posterUrl)}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
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
