import React, { useEffect, useState } from 'react';
import styles from './Card.module.scss';
import { SvgIcon } from '../SvgIcon';

interface CardProps {
  type?: 'small' | 'reit' | 'big';
  title?: string;
  photoUrl?: string;
  ratingKp?: number;
  role?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  type = 'small', 
  title, 
  photoUrl, 
  ratingKp, 
  role, 
  onClick 
}) => {
  const [cardClass, setCardClass] = useState(styles.card);
  const [imgClass, setImgClass] = useState(styles.card__img);
  const [bodyClass, setBodyClass] = useState(styles.card__body);
  const [textClass, setTextClass] = useState(styles.card__text);
  const [goodClass, setGoodClass] = useState(styles.card__color);
  const [rating, setRating] = useState(ratingKp);
  const [titleArray, setTitleArray] = useState(['']);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Сбрасываем состояние загрузки при изменении photoUrl
    if (photoUrl) {
      setImageLoading(true);
      setImageError(false);
    } else {
      setImageLoading(false);
      setImageError(true);
    }
  }, [photoUrl]);

  useEffect(() => {
    switch (type) {
      case 'small':
        setCardClass(styles.card__small);
        setBodyClass(styles.card__body_small);
        setImgClass(styles.card__img_small);
        setTextClass(styles.card__text_small);
        break;
      case 'reit':
        setCardClass(styles.card__reit);
        setRating(ratingKp ? Math.round(ratingKp * 10) / 10 : 0);
        setBodyClass(styles.card__body_rating);
        if (ratingKp && ratingKp >= 7) {
          setGoodClass(styles.card__color_green);
        }
        break;
      case 'big':
        setCardClass(styles.card__big);
        setBodyClass(styles.card__body_big);
        setImgClass(styles.card__img_big);
        if (title) {
          setTitleArray(title.split(' '));
        }
        break;
    }
  }, [type, ratingKp, rating]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const renderImageContent = () => {
    if (type === 'reit') {
      return (
        <div className={goodClass}>
          <p>{rating}</p>
        </div>
      );
    }

    // Если нет URL - показываем ошибку
    if (!photoUrl || imageError) {
      return (
        <div className={styles.imageError}>
          <SvgIcon name="image-icon" size={24} color="var(--color-text)" />
        </div>
      );
    }

    return (
      <>
        <img 
          src={photoUrl} 
          className={imgClass} 
          alt={title} 
          onLoad={handleImageLoad} 
          onError={handleImageError}
          style={{ 
            opacity: imageLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
        {imageLoading && (
          <div className={styles.skeleton}></div>
        )}
      </>
    );
  };

  return (
    <div className={cardClass} onClick={onClick}>
      <div className={bodyClass}>
        {renderImageContent()}
      </div>
      <div>
        {title && !titleArray[1] && <p className={textClass}>{title}</p>}
        
        {ratingKp && <p className={styles.card__text_reit}>Рейтинг</p>}
        {ratingKp && <p className={styles.card__text_reit}>Кинопоиск</p>}
        
        {titleArray.length === 2 && (
          <div>
            <p className={styles.card__text_big}>{titleArray[0]}</p>
            <p className={styles.card__text_big}>{titleArray[1]}</p>
          </div>
        )}
        {role && <p className={styles.card__text_role}>{role}</p>}
      </div>
    </div>
  );
};
