import type { PosterProps } from '../../types';

import cn from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

import { ImageIcon } from '@/shared/assets';
import { SvgIcon, Skeleton } from '@/shared/ui';

import styles from './Poster.module.scss';

export const Poster = ({ film }: PosterProps) => {
  const { bigPictureUrl, smallPictureUrl, filmNameRu, filmNameEn } = film;

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
      <div className={styles.container}>
        <div className={styles.imagePlaceholder}>
          <div aria-hidden className={styles.placeholderIcon}>
            <SvgIcon data-variant="image" icon={ImageIcon} size={48} />
          </div>
          <div className={styles.placeholderText}>Нет изображения</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.poster}>
        <Image
          fill
          priority
          alt={alt}
          className={cn(styles.posterImage, imageLoading && styles.posterImageLoading)}
          sizes="(max-width: 768px) 100vw, 600px"
          src={posterUrl}
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
