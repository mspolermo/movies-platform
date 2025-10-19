import { useState } from 'react';
import { Skeleton, SvgIcon } from '@/shared/ui';
import { ImageIcon } from '@/shared/assets/svg-icons';
import styles from './FilmCard.module.scss';
import { FilmCardPreviewProps } from '../types';
import Image from 'next/image';

export const Preview = ({ film }: FilmCardPreviewProps) => {
const { smallPictureUrl, bigPictureUrl, filmNameRu } = film;

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getPosterUrl = () => {
    return smallPictureUrl || bigPictureUrl || '';
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  
  if (imageError) return (
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
  )

  return (
    <>
        <Image 
          src={getPosterUrl()} 
          alt={filmNameRu}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ 
            opacity: imageLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
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
      </>
  )
};