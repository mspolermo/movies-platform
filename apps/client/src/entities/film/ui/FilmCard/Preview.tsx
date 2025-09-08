import { useState } from 'react';
import styles from './FilmCard.module.scss';
import colors from '@/app/styles/colors.module.scss';
import { FilmCardPreviewProps } from '../types';

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
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={colors.textColor}
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
      </div>
      <div className={styles.placeholderText}>
        Нет изображения
      </div>
    </div>
  )

  return (
    <>
        <img 
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
          <div className={styles.imageLoading}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
      </>
  )
};