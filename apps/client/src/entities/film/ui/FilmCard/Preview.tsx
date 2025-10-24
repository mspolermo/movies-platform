import { useState, useCallback } from 'react';
import { Skeleton, SvgIcon } from '@/shared/ui';
import { ImageIcon } from '@/shared/assets/svg-icons';
import styles from './FilmCard.module.scss';
import { FilmCardPreviewProps } from '../types';
import Image from 'next/image';

export const Preview = ({ film }: FilmCardPreviewProps) => {
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
          <SvgIcon icon={ImageIcon} size={48} data-variant="image" />
        </div>
        <div className={styles.placeholderText}>Нет изображения</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        src={posterUrl}
        alt={`Постер фильма ${filmTitle}`}
        fill
        onLoad={handleImageLoad}
        onError={handleImageError}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit: 'cover',
          opacity: imageLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
        priority={false}
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
